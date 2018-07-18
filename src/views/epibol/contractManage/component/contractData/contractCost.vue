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
                    <div v-if="lineFlag">
                        <li v-for="(item,index) in priceData" :key="index">
                            <span class="span line">{{item.key}}</span>
                            <span class="span line">{{item.finish_date}}</span>
                            <span class="span line">{{item.unitprice}}</span>
                            <span class="span line">{{item.count}}</span>
                            <span class="span line bigFont">￥{{item.amount}}</span>
                            <div class="clear"></div>
                        </li>
                    </div>
                    <div v-if="!lineFlag">
                        <li v-for="(item,index) in priceData">
                            <span class="span">
                                <Input v-model="item.key" placeholder="输入文件类型名称"></Input>
                            </span>
                            <span class="span">
                                <DatePicker type="date" :value="item.finish_date" :options="dateTime" placeholder="选择完成时间" style="width:200px" @on-change="finishDate" @click.native="changeDate(index)"></DatePicker>
                            </span>
                            <span class="span">
                                <Input v-model="item.unitprice" placeholder="0" style="width:100px"></Input>
                            </span>
                            <span class="span">
                                <InputNumber :min="1" v-model="item.count" style="width:100px"></InputNumber>
                            </span>
                            <span class="span bigFont">
                                ￥ {{item.unitprice*item.count}}
                            </span>
                            <span><Icon type="trash-a" class="deletPrice" @click.native="deletPrice(index)"></Icon></span>
                            <div class="clear"></div>
                        </li>
                        <li style="margin-top:10px;">
                            <span class="span"><em class="addPrice" @click="addPriceList">+ 增加清单项</em></span>
                            <span class="span">&nbsp;</span>
                            <span class="span">&nbsp;</span>
                            <span class="span">合同文件数量： <em class="bigFont">{{fileCount}}</em></span>
                            <span class="span">合同总额： <em class="bigFont">￥ {{priceNum*fileCount}}</em></span>
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
                    <div v-if="lineFlag">
                        <li v-for="(item,index) in payListData" :key="index">
                            <span class="span line">{{item.key}}</span>
                            <span class="span line">{{item.num}}</span>
                            <span class="span line bigFont">￥{{item.amount}}</span>
                            <div class="clear"></div>
                        </li>
                    </div>
                    <div v-if="!lineFlag">
                        <li v-for="(item,index) in contractPayDate" :key="index">
                            <span class="span">
                                <Input v-model="item.key" placeholder="输入付款阶段"></Input>
                            </span>
                            <span class="span">
                                <em>({{Math.round((item.num/fileCount)*100)}}%)</em>
                                <Input v-model="item.num" placeholder="文件数量"></Input>
                            </span>
                            <span class="span">
                                <Input v-model="item.amount" placeholder="输入该阶段支付合同款" class="payAmount"></Input>
                            </span>
                            <span>
                                <Icon type="trash-a" class="deletPrice" @click.native="deletPay(index)"></Icon>
                            </span>
                            <div class="clear"></div>
                        </li>
                        <li style="margin-top:10px;">
                            <span class="span"><em class="addPrice" @click="addPay">+ 增加付款阶段</em></span>
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
            dateTime: {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            priceListData:[],
            priceData:[
                {
                    key:'',
                    finish_date:'',
                    unitprice:null,
                    count:1,
                }
            ],
            payListData:[],
            contractPayDate:[
                {
                    key:'',
                    num:'',
                    amount:'',
                }
            ],
            fileCount:1,
            priceNum:0,
            amount:0,
            dateIndex:0,
            lineFlag:false,
        }
    },
    mounted(){
        this.autoHeight();
    },
    methods:{
        // autoH
        autoHeight(){
            $(".newContractData .autoHeight").height($(window).height()-250)
        },
        // GetPriceIndex
        changeDate(index){
            this.dateIndex=index;
        },
        // changeDate
        finishDate(date){
            this.priceData[this.dateIndex].finish_date=date
        },
        // addPrice
        addPriceList(){
            let obj={
                key:'',
                finish_date:'',
                unitprice:null,
                count:1,
            };
            this.priceData.push(obj)
        },
        // deletePrice
        deletPrice(index){
            this.priceData.splice(index,1);
        },
        // addPay
        addPay(){
            let obj={
                key:'',
                num:'',
                amount:'',
            }
            this.contractPayDate.push(obj)
        },
        // deletePay
        deletPay(index){
            this.contractPayDate.splice(index,1)
        },
        // priceChange
        priceChange(){
            let sum=0;
            let amsum=0;
            for(let i=0;i<this.priceData.length;i++){
                if(this.priceData.length==1){
                    sum=this.priceData[i].count;
                    amsum=Number(this.priceData[i].unitprice);
                }else{
                    sum+=this.priceData[i].count;
                    amsum+=Number(this.priceData[i].unitprice);
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
<style>

</style>
