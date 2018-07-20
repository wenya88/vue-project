<template>
    <div class="newContractData">
        <!-- ContractNav -->
        <div class="contractNav">
            <span :class="[nIndex==0?'spanOne':'']"><s>1</s>基本信息</span>
            <span :class="[nIndex==1?'spanTwo':'']"><s>2</s>费用及付款</span>
            <span :class="[nIndex==2?'spanTwo':'']"><s>3</s>确认合同</span>
            <div class="clear"></div>
        </div>
        <!-- ContractComponent -->
        <keep-alive>
            <basic-info v-if="nIndex==0"></basic-info>
            <contract-cost v-if="nIndex==1"></contract-cost>
            <confir-contract v-if="nIndex==2"></confir-contract>
        </keep-alive>
        <!-- nextRow -->
        <div class="nextRow">
            <Button type="success" v-show="nIndex==1||nIndex==2?true:false" @click.native="lastStep">上一步</Button>
            <Button type="success" @click.native="nextStep" v-show="nIndex==2?false:true">下一步</Button>
            <Button type="warning" v-show="nIndex==1" @click="commitContract">保存合同</Button>
            <!-- <Button type="warning" v-show="contrateCommit&&nIndex==2" @click="commitContract">保存合同</Button> -->
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
            nIndex:0,
            componentId:'basic-info'
        }
    },
    components:{
        basicInfo:basicInfo,
        contractCost:contractCost,
        confirContract:confirContract
    },
    computed:{
        contrateCommit(){
            return this.$store.state.paySkip.contrateCommit;
        }
    },
    mounted(){
        this.$bus.on('addContractData',(val)=>{
            this.newData=val;
        })
        this.$bus.on("addContractCost",(val)=>{
            this.newCost=val;
        })
    },
    methods:{
        commitContract(){
            let url=this.GLOBAL.baseRouter+"task/company/add-contract";
           
            let parms={
                id:this.Cid,
                company_id:1,
                create_user:sessionStorage.userId,
                basic_list:JSON.stringify(this.newData),
                price_list:JSON.stringify(this.newCost.price_list),
                step_list:JSON.stringify(this.newCost.step_list)
            }
            if(this.Cid==null){
                delete parms.id
            }
            this.$axios.post(url,qs.stringify(parms)).then(msg=>{
                console.log(msg)
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
