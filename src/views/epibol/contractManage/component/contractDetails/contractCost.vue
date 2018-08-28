<template>
    <div class="contractCost">
        <div class="costTitle">价格清单</div>
        <div class="costContent">
             <ul>
                 <li class="title">
                     <span class="span">文件类型</span>
                     <span class="span">完成时间</span>
                     <span class="span">单价(个)</span>
                     <span class="span">数量</span>
                     <span class="span">小计</span>
                     <div class="clear"></div>
                 </li>
                 <li v-for="(item,index) in priceList" :key="index">
                     <span class="span">{{item.key}}</span>
                     <span class="span">{{item.finish_date}}</span>
                     <span class="span">￥{{item.unitprice}}</span>
                     <span class="span">{{item.count}}</span>
                     <span class="span">￥{{item.amount}}</span>
                     <div class="clear"></div>
                 </li>
                 <li class="fooder">
                    合同文件：<em>{{contractFile}}个</em>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    合同总金额：<em>￥{{Number(contractTotal).toFixed(2)}}</em>
                 </li>
             </ul>
        </div>
        <div class="costTitle">合同付款</div>
        <div class="costContent payContent">
             <ul>
                 <li class="title">
                     <span class="span">付款阶段</span>
                     <span class="span">完成文件数量</span>
                     <span class="span">支付款项</span>
                     <div class="clear"></div>
                 </li>
                 <li v-for="(item,index) in stepList">
                     <span class="span">{{item.key}}</span>
                     <span class="span">
                         <Progress :percent="Math.round((Number(item.num)/contractFile)*100)>101?99.99:Math.round((Number(item.num)/contractFile)*100)" status="active" :stroke-width="6">
                             <span>
                                 <span class="num">{{item.num}}</span>个({{Math.round((Number(item.num)/contractFile)*100)}}%)
                             </span>
                         </Progress>
                     </span class="span">
                     <span class="span">￥{{item.amount}}</span>
                     <div class="clear"></div>
                 </li>
             </ul>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            priceList:Array,
            stepList:Array,
            contractFile:Number,
            contractTotal:Number
        }
    },
    methods:{
        // 组件数据
        moduleData(data){
            this.priceList=data[0].price_list;
            this.stepList=data[0].step_list;
            let count=0;
            let amount=0;
            for(let i=0;i<this.priceList.length;i++){
                count+=Number(this.priceList[i].count)
                amount+=Number(this.priceList[i].amount)
            }
            this.contractFile=count;
            this.contractTotal=amount;
        }
    }
}
</script>

