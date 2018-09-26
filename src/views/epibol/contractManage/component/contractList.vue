<template>
    <div class="contractRow">
        <dl>
            <dd v-for="(item,index) in contData" :key="index">
                <p v-if="item.network === '2'" class="networkSign">电</p>
                <div class="statusRow">
                    <div :class="[item.status!=0?'status':'status yellow']">
                        <span v-if="item.is_over === 0"> 未完善合同</span>
                        <span v-else-if="item.status==1&&item.company_signServiceId&&item.costomer_signServiceId">合同已签章</span>
                        <span v-else> {{item.status_text}}</span>

                    </div>
                    <div class="title">
                        <Dropdown trigger="click" placement="bottom-end" v-if="item.status<='0'">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="38"></Icon>
                            </a>
                            <DropdownMenu slot="list" >
                                <DropdownItem @click.native="editContract(item)">编辑</DropdownItem>
                                <DropdownItem @click.native="deleteContract(item.id)">删除</DropdownItem>
                            </DropdownMenu>

                            <!--<DropdownMenu slot="list" v-else>-->
                                <!--<DropdownItem @click.native="contDetails(item)">详情</DropdownItem>-->
                            <!--</DropdownMenu>-->
                        </Dropdown>
                    </div>
                </div>
                <div class="projectName" @click="enter(item)">
                    {{item.contract_name}}
                </div>
                <div class="projectMoney" @click="enter(item)">
                    ￥<span>{{item.contract_price}}</span>
                </div>
                <div class="projectInfo" @click="enter(item)">
                    <p class="company">
                        <i class="iconfont icon-loudong"></i> {{item.customer_name}}
                    </p>
                    <p class="company">
                        {{item.start_time}} ~ {{item.end_time}}
                    </p>
                </div>
            </dd>
        </dl>
    </div>
</template>
<script>
    var qs = require('querystring');
    import {mapMutations} from 'vuex'

    export default {
        data() {
            return {
                addModal: false,
                modalTitle: null,
                onContractData: Object
            }
        },
        props: {
            contData: {
                type: Array
            }
        },
        mounted() {

            this.autoH();
            this.$bus.on('addContractData', (val) => {
                this.onContractData = val;
            })
        },
        methods: {
            ...mapMutations(['setContractId','setIsEdit']),
            // 初始化高
            autoH() {
                $('.contractRow').height($(window).height() - 160);
                this.$store.commit('changContractStatus', false);
            },
            //删除
            deleteContract(id) {
                if (window.confirm('是否确认删除?')) {
                    let url = this.GLOBAL.baseRouter + 'task/contract/delete-contract';
                    let params = {
                        "contract_id": id
                    }
                    this.$axios.post(url, qs.stringify(params)).then(msg => {
                        this.$Message.success('删除成功！');
                        this.$bus.emit('addSuccess');
                    })
                } else {
                    return
                }
            },
            //编辑
            editContract(item) {

                // 路由切换 2为电子合同 其他为线下合同
                this.$store.commit('getContractIDCommit', item.id);//传contrac_ID
                if (item.network === '2') {
                    this.$router.push('/epibol/addElectronicContract');
                } else {
                    this.$store.commit('getContractServerButton', true);//保存按钮
                    this.newAddData();
                }
            },

            // 新增合同
            newAddData() {
                this.$router.push('/epibol/contractData');//路由切换
            },
            // 详情
            contDetails(item) {
                this.$store.commit('getContractIDCommit', item.id);
                this.$store.commit('getContractType', item.network);
                this.$router.push('/epibol/contractDetails')
            },
            enter(item) {
                if (item.network === '2') {
                    if (item.status <= '0' || (item.status == 1 && (!item.company_signServiceId || !item.costomer_signServiceId))) {

                        this.editContract(item)
                        this.setIsEdit(true)
                    } else {
                        this.contDetails(item)
                    }
                } else {
                    if (item.status <= '0') {
                        this.setIsEdit(true)
                        this.editContract(item)
                    } else {
                        this.contDetails(item)
                    }
                }
            }
        },
        computed: {},
        destroyed() {
            this.$store.commit('getContrateCommit', false);//销毁组件
        }

    }
</script>
