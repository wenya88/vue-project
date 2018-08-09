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
            <basic-info v-if="nIndex==0" ref="ContractInfo"></basic-info>
            <contract-cost v-if="nIndex==1" :contractCostData="contractCostData"></contract-cost>
            <confir-contract v-if="nIndex==2" :filesData="filesData"></confir-contract>
        </keep-alive>
        <div class="enterContract">
            <div  v-if="ContractCtatus==0">
                 <span><Icon type="information-circled" size="20" color="#f19000"></Icon>&nbsp;&nbsp;确认合同无误请仔细核对合同信息！ </span>
                <em>
                    <Button type="error" @click.native="setContractStatus">确认合同无误</Button>
                </em>
            </div>
            <div v-else>
                <span><Icon type="checkmark" size="20" color="green"></Icon> 合同已确认！</span>
            </div>
        </div>
        <Modal v-model="payModel" width="360">
            <div style="text-align:center">
                <p style="color:#00cc00;font-size:22px;font-weight:blod;"><Icon type="checkmark-circled"></Icon> 合同确认成功</p>
                <p style="font-size:16px;color:#ff6600;margin-top:10px;">请立即支付首付款</p>
            </div>
            <div slot="footer">
                <Button type="success" size="large" long @click="immPay">立即支付</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
var qs=require('querystring');
import basicInfo from './contractData/basicInfo';
import contractCost from './contractData/contractCost';
import confirContract from './contractData/confirContract';
import {mapGetters,mapState} from 'vuex';
export default {
    data(){
        return{
            nIndex:0,
            basicInfoData:[],
            ContractCtatus:null,
            payModel:false
        }
    },
    computed:{
        ...mapState({
            contractID:state=>state.paySkip.contractID,
        })
    },
    components:{
        basicInfo:basicInfo,
        contractCost:contractCost,
        confirContract:confirContract
    },
    mounted(){
        this.contractInfo();
    },
    methods:{
        contractInfo(){
                if(this.contractID==null){
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
                    this.ContractCtatus=msg.data.status;

                    // 清单及付款
                    this.contractCostData=contractCost;

                    //附件
                    this.filesData=msg.data.files;

                    // 基本信息
                    this.basicInfoData=msg.data;
                    delete this.basicInfoData.price_list;
                    delete this.basicInfoData.step_list;
                    this.$refs.ContractInfo.editContract(this.basicInfoData);
               
                },()=>{
                    this.$Message.error("请求失败!")
                    this.$Loading.error();
                })
        },
        setContractStatus(){
            this.$Loading.start();
            this.payModel=true;
            let url=this.GLOBAL.baseRouter+'task/demand-contract/set-contract-status';
            let params={
                "contract_id":this.contractID,
                "status":0
            }
            // this.$axios.post(url,qs.stringify(params)).then(msg=>{
            //     this.$Loading.finish();
            //     if(msg.data.err_code==0){
            //         this.$Modal.success({
            //             title: "合同确认成功",
            //             content: "请立即支付首付款",
            //             okText:'立即支付'
            //         });
            //     }else{
            //         this.$Message.error(msg.data.err_message)
            //     }
            // })
            
        },
        immPay(){
            this.$router.push('/customer/payManage/'+this.contractID)
        }

    }
}
</script>
<style scoped lang="less">
@import '../../../epibol/contractManage/style/contractData.less';

.enterContract{
    position:relative;z-index:11;bottom:0px;background:#fff3c5;width:100%;height:50px;line-height:50px;
    span{
        padding-left:10px;
    }
    em{
        float:right;padding-right:10px;
    }
}

</style>
