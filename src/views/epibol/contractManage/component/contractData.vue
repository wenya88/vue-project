<template>
    <div class="newContractData">
        <!-- ContractNav -->
        <div class="contractNav" v-if="!lineFlag">
            <span :class="[nIndex==0?'spanOne':'']"><s>1</s>基本信息</span>
            <span :class="[nIndex==1?'spanTwo':'']"><s>2</s>费用及付款</span>
            <span :class="[nIndex==2?'spanTwo':'']"><s>3</s>确认合同</span>
            <div class="clear"></div>
        </div>
        <div class="detailsNav" v-else>
            <span @click="nIndex=0" :class="[nIndex==0?'show':'']">基本信息</span>
            <span @click="nIndex=1" :class="[nIndex==1?'show':'']">费用及付款</span>
            <span @click="nIndex=2" :class="[nIndex==2?'show':'']">确认合同</span>
        </div>
        <!-- ContractComponent -->
        <keep-alive>
            <basic-info v-if="nIndex==0" ref="editContract"></basic-info>
            <contract-cost v-if="nIndex==1" :contractCostData="contractCostData"></contract-cost>
            <confir-contract v-if="nIndex==2" :filesData="filesData"></confir-contract>
        </keep-alive>
        <!-- nextRow -->
        <div class="nextRow"  v-if="!lineFlag">
            <Button type="success" v-show="nIndex==1||nIndex==2?true:false" @click.native="lastStep" :disabled="Bdisabled">上一步</Button>
            <Button type="success" @click.native="nextStep" v-show="nIndex==2?false:true" :disabled="Bdisabled">下一步</Button>
            <Button type="warning" v-show="contrateButton&&nIndex==2" @click="commitContract">保存合同</Button>
        </div>
        <!-- stop -->
    </div>
</template>
<script>
var qs=require('querystring');
import basicInfo from './contractData/basicInfo';
import contractCost from './contractData/contractCost';
import confirContract from './contractData/confirContract';
export default {
    data(){
        return{
            newData:{},//basicInfo
            newCost:{},//contractCost
            newFileLoad:[],//contractFile
            nIndex:0,
            componentId:'basic-info',
            addInfo:'',
            contractCostData:[],
            basicInfoData:{},
            filesData:[],
            Bdisabled:false
        }
    },
    components:{
        basicInfo:basicInfo,
        contractCost:contractCost,
        confirContract:confirContract
    },
    computed:{
        contrateButton(){
            return this.$store.state.paySkip.contrateButton;
        },
        contractID(){
            return this.$store.state.paySkip.contractID
        },
        lineFlag(){
            return this.$store.state.paySkip.enterContractFlag;
        }
    },
    destroyed(){
          this.$store.commit('getContractServerButton',false);
    },
    mounted(){
        this.$bus.on('addContractData',(val)=>{
            this.newData=val;
        })
        this.$bus.on("addContractCost",(val)=>{
            this.newCost=val;
        });
        this.$bus.on("ContractUploadFile",(val)=>{
            this.newFileLoad=val;
        })
        this.$bus.on("Bdisabled",val=>{
            this.Bdisabled=val
        })
        this.contractInfo();
    },
    methods:{
        contractInfo(){
            if(this.contractID!=null){
                this.$Loading.start();
                let url=this.GLOBAL.baseRouter+"task/contract/contract-info";
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
            }
        },
        commitContract(){
            this.$Loading.start();
            let url;
            let parms={
                contract_id:this.contractID,
                basic_list:JSON.stringify(this.newData),
                price_list:JSON.stringify(this.newCost.price_list),
                step_list:JSON.stringify(this.newCost.step_list),
                files_list:JSON.stringify(this.newFileLoad)
            }
            if(this.contractID==null){
                delete parms.contract_id
                url=this.GLOBAL.baseRouter+"task/contract/add-contract";
                this.addInfo='添加成功!'
            }else{
                url=this.GLOBAL.baseRouter+"task/contract/edit-contract";
                this.addInfo='修改成功!'
            }
            this.$axios.post(url,qs.stringify(parms)).then(msg=>{
               if(msg.data.err_code>0){
                  this.$Loading.finish();
                  this.$Message.warning(msg.data.err_message);
               }else{
                  this.$Message.success(this.addInfo);
                  this.$router.go(-1);
               }
            },()=>{
                this.$Loading.error();
                this.$Message.error('提交失败！')
            })
        },
        // next
        nextStep(){
            if(this.nIndex>=0&&this.nIndex<2){
                this.nIndex++;
            }
            // temporary
        },
        // last
        lastStep(){
            if(this.nIndex>0){
                this.nIndex--;
            }
        }
    }

}
</script>
<style lang="less" scoped>
@import '../style/contractData.less';
</style>
