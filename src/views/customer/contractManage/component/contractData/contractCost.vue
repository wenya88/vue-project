<template>
    <div class="newContractData autoHeight">
        <div class="contractCost">
            <h1>价格清单</h1>
            <div class="priceList">
                <ul>
                    <li class="priceTile">
                        <span class="span">文件类型</span>
                        <span class="span">完成时间</span>
                        <span class="span">单价/个</span>
                        <span class="span">数量</span>
                        <span class="span">小计</span>
                        <div class="clear"></div>
                    </li>
                    <div>
                        <li v-for="(item,index) in priceData" :key="index">
                            <span class="span line">{{item.key}}</span>
                            <span class="span line">{{item.finish_date}}</span>
                            <span class="span line">{{item.unitprice}}</span>
                            <span class="span line">{{item.count}}</span>
                            <span class="span line bigFont">￥{{item.amount}}</span>
                            <div class="clear"></div>
                        </li>
                        <li style="margin-top:10px;">
                            <span class="span">&nbsp;</span>
                            <span class="span">&nbsp;</span>
                            <span class="span">&nbsp;</span>
                            <span class="span">合同文件数量： <em class="bigFont">{{fileCount}}</em></span>
                            <span class="span">合同总额： <em class="bigFont">￥ {{(priceNum).toFixed(2)}}</em></span>
                            <div class="clear"></div>
                        </li>
                    </div>
                </ul>
            </div>
            <h1 style="margin-top:30px">合同付款</h1>
            <div class="priceList contractPay">
                <ul>
                    <li class="priceTile">
                        <span class="span">付款阶段</span>
                        <span class="span">完成文件数量</span>
                        <span class="span">支付款项</span>
                        <div class="clear"></div>
                    </li>
                    <div>
                        <li v-for="(item,index) in contractPayDate" :key="index">
                            <span class="span line">{{item.key}}</span>
                            <span class="span line">{{item.num}}</span>
                            <span class="span line bigFont">￥{{item.amount}}</span>
                            <div class="clear"></div>
                        </li>
                    </div>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            priceData:[],
            contractPayDate:[],
            fileCount:1,
            priceNum:0,
        }
    },
    props:{
        contractCostData:{
            type:Array
        }
    },
    mounted(){
        this.autoHeight();
        this.editContractData();
    },
    methods:{
        // autoH
        autoHeight(){
            $(".newContractData .autoHeight").height($(window).height()-270);
            $(".contractSchedle").height($(window).height()-310);
        },
        // editContract
        editContractData(){
            if(this.contractCostData.length>0){
               this.priceData=this.contractCostData[0].price_list;
               this.contractPayDate=this.contractCostData[0].step_list;
               for(let i=0;i<this.priceData.length;i++){
                   this.priceData[i].count=Number(this.priceData[i].count);
               }
            }
        },
        // priceChange
        priceChange(){
            let sum=0;
            let amsum=0;
            let jsum=0;
            let jamsum=0;
            for(let i=0;i<this.priceData.length;i++){
                if(this.priceData.length==1){
                    sum=Number(this.priceData[i].count);
                    amsum=Number(this.priceData[i].unitprice)*sum;
                }else{
                     sum+=Number(this.priceData[i].count);
                     amsum+=Number(this.priceData[i].unitprice)*this.priceData[i].count;
                }
                
            }
            this.fileCount=sum;
            this.priceNum=amsum;
        }
    },
    updated(){
        this.priceChange();
    }

}
</script>
<style scoped>

</style>
