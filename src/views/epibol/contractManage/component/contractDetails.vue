<template>
    <div class="contDetails">
        <!-- statusNav -->
        <div class="statusNav">
            <span :class="[nIndex=='0'?'show':'nextshow']" @click="changNav('0')">1、基本信息</span>
            <span :class="[nIndex=='1'?'show':'',nIndex=='2'?'nextshow':'']" @click="changNav('1')">2、金额及付款</span>
            <span :class="[nIndex=='2'?'show':'']"  @click="changNav('2')">3、合同详情</span>
            <div class="clear"></div>
        </div>
        <!-- contractContent -->
        <div class="contContent">
            <component :is="isModule" ref="moduleInfo"></component>
        </div>
    </div>
</template>
<script>
var qs=require('querystring');
import {mapState} from 'vuex';
import contractBase from './contractDetails/contractBase';
import contractCost from './contractDetails/contractCost';
import contractDeta from './contractDetails/contractDeta';
export default {
   data(){
       return{
           nIndex:'0',
           isModule:contractBase,
           contractCostData:Array,//金额及付款
           filesData:Array,//附件
           basicInfoData:Array //基本信息,
       }
   },
   computed:{
        ...mapState({
        //    合同ID
            contractID(data){
                return data.paySkip.contractID 
            }
        })
   },
   mounted(){
       this.autoH();
       this.contractInfo();
   },
   methods:{
        autoH(){
            let H=document.documentElement.clientHeight;
            let CH=document.getElementsByClassName('contContent')[0];
            CH.style.height=H-170+'px';
        },
        //    切换组件
        changNav(nmber){
            this.nIndex=nmber;
            if(nmber=='0'){
                // 基本信息
                this.isModule=contractBase;
                setTimeout(()=>{
                    this.$refs.moduleInfo.moduleData(this.basicInfoData);
                },100)
            }else if(nmber=='1'){
                // 清单及付款
                this.isModule=contractCost;
                setTimeout(()=>{
                    this.$refs.moduleInfo.moduleData(this.contractCostData);
                },100)
            }else if(nmber=='2'){
                // 附件
                this.isModule=contractDeta;
                setTimeout(()=>{
                    this.$refs.moduleInfo.moduleData(this.filesData);
                },100)
            }
        },
        // 合同数据
        contractInfo(){
            if(this.contractID!=null){
                this.$Loading.start();
                let url=this.GLOBAL.baseRouter+"task/contract/contract-info";
                let params={
                    "contract_id":this.contractID
                }
                this.$axios.post(url,qs.stringify(params)).then(msg=>{
                    this.$Loading.finish();
                    let contractCost=[
                       {
                           "price_list":msg.data.price_list,
                           "step_list":msg.data.step_list
                       }
                    ];
                    // 清单及付款
                    this.contractCostData=contractCost;

                    // 附件
                    this.filesData=msg.data.files;
                
                    // 基本信息
                    this.basicInfoData=msg.data;
                    
                    // 传递数据
                    this.$refs.moduleInfo.moduleData(this.basicInfoData);
               
                },()=>{
                    this.$Message.error("请求失败!")
                    this.$Loading.error();
                })
            }else{
                this.$router.go(-1)
            }
        },
   }
}
</script>
<style lang="less">
@import '../style/contractDetails.less';
</style>
