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
            <Button type="warning" v-show="contrateCommit&&nIndex==2">保存合同</Button>
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
            newData:[],
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
    },
    methods:{
        // next
        nextStep(){
            if(this.nIndex>=0&&this.nIndex<2){
                this.nIndex++;
            }
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
