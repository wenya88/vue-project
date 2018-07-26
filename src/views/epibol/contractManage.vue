<template>
    <div class="newContract">
        <dl>
            <dt>
                <span class="span">
                    <Input v-model="search" placeholder="合同/项目名称" style="width: 300px" icon="ios-search" @on-click="searchCommit" @on-enter="searchCommit"></Input>
                </span>
                <span class="em">
                    <Button type="success" @click.native="newAdd">新增合同</Button>
                </span>
                <div class="clear"></div>
            </dt>
            <contract-list :contData="contData" ref="contractRef"></contract-list>
        </dl>
    </div>
</template>
<script>
var qs=require('querystring');
import contractList from './contractManage/component/contractList'
export default {
    data(){
        return{
            contData:[],
            search:''
        }
    },
    components:{
        contractList:contractList
    },
    mounted(){
        this.contractData();
        this.projectPost();
        this.getUserInfo();
        this.$bus.on('addSuccess',()=>{
            this.contractData();
        });
    },
    methods:{
        // 新增
        newAdd(){
           this.$refs.contractRef.newAddData();
        },
        // 搜索
        searchCommit(){
            this.contractData(this.search);
        },
        // 初始化列表数据
        contractData(search=this.search){
            let _this=this;
            let url=_this.GLOBAL.baseRouter+'task/company/get-contract-list';
            let params={
                search:search,
                company_id:1
            };
            _this.$Loading.start();
            _this.$axios.post(url,qs.stringify(params)).then(msg=>{
                _this.$Loading.finish();
                if(msg.data.err_code==0){
                    _this.contData=msg.data.data
                    _this.$store.commit('getContractIDCommit',null)
                }
            },()=>{
                _this.$Loading.error();
            })
        },
        //获取项目ID
        projectPost(){
            let _this=this;
            let url=_this.GLOBAL.baseRouter+'task/project/page';
            let params={
                page_size:10000
            }
            _this.$axios.post(url,qs.stringify(params)).then(msg=>{
                if(msg.data.err_code==0){
                     let proArr=[]
                     msg.data.project.forEach(val => {
                         let obj={
                             id:val.id,
                             name:val.name
                         }
                        proArr.push(obj)
                     });
                    _this.$store.commit('getProjectData',proArr)
                }
            })
        },
        //获取人员名单
        getUserInfo(){
            let _this=this;
            let url=_this.GLOBAL.baseRouter+'task/company/member-page'
            let params={
                company_id:1
            }
            _this.$axios.post(url,qs.stringify(params)).then(msg=>{
                if(msg.data.err_code==0){
                    _this.$store.commit('getUserData',msg.data.data);
                }
            })
        }
        
    }
}
</script>
<style lang="less">
@import './contractManage/style/contractManage.less';
</style>
