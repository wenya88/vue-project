<template>
    <div class="newContractData">
        <!-- ContractNav -->
        <div class="detailsNav">
            <span @click="nIndex=0" :class="[nIndex==0?'show':'']">基本信息</span>
            <span @click="nIndex=1" :class="[nIndex==1?'show':'']">费用及付款</span>
            <span @click="nIndex=2" :class="[nIndex==2?'show':'']">确认合同</span>
        </div>
        <!-- ContractComponent -->
        <keep-alive>
            <basic-info v-if="nIndex==0" ref="editContract"></basic-info>
            <contract-cost v-if="nIndex==1" :contractCostData="contractCostData"></contract-cost>
            <!-- <confir-contract v-if="nIndex==2" :filesData="filesData" ref="emitFile"></confir-contract> -->
        </keep-alive>
    </div>
</template>
<script>
var qs=require('querystring');
import basicInfo from './contractData/basicInfo';
import contractCost from './contractData/contractCost';
import {mapGetters,mapState} from 'vuex';
export default {
    data(){
        return{
            nIndex:0,
            basicInfoData:[]
        }
    },
    computed:{
        ...mapGetters([
            'contractID'
        ]),
        ...mapState({
            contractID:state=>state.paySkip.contractID,
        })
    },
    components:{
        basicInfo:basicInfo,
        contractCost:contractCost
    },
    mounted(){
        this.contractInfo();
    },
    methods:{
         contractInfo(){
                if(this.contractID==null){
                    this.$Message.error("合同ID失效");
                    this.$router.go(-1);
                }
                this.$Loading.start();
                let url=this.GLOBAL.baseRouter+"task/demand-contract/contract-info";
                let params={
                    "contract_id":this.contractID
                }
                this.$axios.post(url,qs.stringify(params)).then(msg=>{
                    this.$Loading.finish();
                    this.contractCostData=[];
                    let contractCost=[
                       {
                           "price_list":msg.data.price_list,
                           "step_list":msg.data.step_list
                       }
                    ];
                    // 清单及付款
                    this.contractCostData=contractCost;

                    //附件
                    this.filesData=msg.data.files;

                    // 基本信息
                    this.basicInfoData=msg.data;
                    delete this.basicInfoData.price_list;
                    delete this.basicInfoData.step_list;
                    this.$refs.editContract.editContract(this.basicInfoData);
               
                },()=>{
                    this.$Message.error("请求失败!")
                    this.$Loading.error();
                })
        },
    }
}
</script>
<style scoped lang="less">
@import '../../../epibol/contractManage/style/contractData.less';
</style>
