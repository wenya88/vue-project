<template>
    <div class="newContract">
        <main-native>
            <div class="main-header-style iconfont"><span
                    class="main-header-title"><i></i>{{this.$route.meta.title}}</span></div>
        </main-native>
        <dl>
            <dt>
                <span class="span">
                    <Input v-model="search" placeholder="请输入您想搜索的合同" style="width: 300px" @on-enter="searchCommit">
                        <Button slot="append" icon="ios-search" @on-click="searchCommit"
                                @on-enter="searchCommit"></Button>
                    </Input>
                </span>
                <span class="em">
                     <Dropdown style="margin-left: 20px">
                           <Button type="success" ><i class="iconfont icon-xinjian"></i> 增加合同</Button>
                        <DropdownMenu trigger="click" slot="list">
                            <DropdownItem @click.native="addElectronicContract" >电子合同</DropdownItem>
                            <DropdownItem @click.native="newAdd" >线下合同</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </span>
                <div class="clear"></div>
            </dt>
            <contract-list :contData="contData" ref="contractRef"></contract-list>
        </dl>
    </div>
</template>
<script>
    var qs = require('querystring');
    import contractList from './contractManage/component/contractList';
    import mainNative from '../main-components/mainNative.vue';
    import {mapState} from 'vuex';

    export default {
        data() {
            return {
                contData: [],
                search: ''
            }
        },
        computed: {
            ...mapState({
                companyID(data) {
                    return data.paySkip.company
                }
            })
        },
        components: {
            contractList: contractList,
            mainNative: mainNative
        },
        mounted() {
            this.contractData();
            this.projectPost();
            this.getUserInfo();
            this.$bus.on('addSuccess', () => {
                this.contractData();
            });
        },
        methods: {
            // 新增
            newAdd() {
                this.$refs.contractRef.newAddData();
            },
            // 搜索
            searchCommit() {
                this.contractData(this.search);
            },
            // 初始化列表数据
            contractData(search = this.search) {
                let _this = this;
                let url = _this.GLOBAL.baseRouter + 'task/contract/get-contract-list';
                let params = {
                    search: search,
                    company_id: this.companyID.company_id
                };
                _this.$Loading.start();
                _this.$axios.post(url, qs.stringify(params)).then(msg => {
                    _this.$Loading.finish();
                    if (msg.data.err_code == 0) {
                        _this.contData = msg.data.data
                        _this.$store.commit('getContractIDCommit', null)
                    }
                }, () => {
                    _this.$Loading.error();
                })
            },
            //获取项目ID
            projectPost() {
                let _this = this;
                let url = _this.GLOBAL.baseRouter + 'task/project/page';
                let params = {
                    page_size: 10000,
                    hide: 1
                }
                _this.$axios.post(url, qs.stringify(params)).then(msg => {
                    if (msg.data.err_code == 0) {
                        let proArr = []
                        msg.data.project.forEach(val => {
                            let obj = {
                                id: val.id,
                                name: val.name
                            }
                            proArr.push(obj)
                        });
                        _this.$store.commit('getProjectData', proArr)
                    }
                })
            },
            //获取人员名单
            getUserInfo() {
                let _this = this;
                let url = _this.GLOBAL.baseRouter + 'task/company/member-page'
                let params = {
                    company_id: this.companyID.company_id
                }
                _this.$axios.post(url, qs.stringify(params)).then(msg => {
                    if (msg.data.err_code == 0) {
                        _this.$store.commit('getUserData', msg.data.data);
                    }
                })
            },
            addElectronicContract(){
                this.$router.push({path:'/epibol/addElectronicContract'})
            }

        }
    }
</script>
<style lang="less">
    @import './contractManage/style/contractManage.less';
</style>
