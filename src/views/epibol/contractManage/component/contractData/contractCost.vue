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
                            <span class="span line">￥{{item.unitprice}}</span>
                            <span class="span line">{{item.count}}</span>
                            <span class="span line bigFont">￥{{item.amount}}</span>
                            <div class="clear"></div>
                        </li>
                    </div>
                    <div v-if="!lineFlag">
                        <li v-for="(item,index) in priceData">
                            <span class="span">
                                <Input v-model="item.key" placeholder="输入文件类型名称1" @on-change="upDate"></Input>
                            </span>
                            <span class="span">
                                    <DatePicker type="date" :value="item.finish_date" :options="dateTime" placeholder="选择完成时间" style="width:200px" @on-change="finishDate" @click.native="changeDate(index)"></DatePicker>
                            </span>
                            <span class="span">
                                 <Input v-model="item.unitprice" placeholder="0.00" style="width:100px" @on-change="upDate"></Input>
                                 <em style="position:relative;z-index:11;top:-30px;left:2px;">￥</em>
                            </span>
                            <span class="span">
                                <InputNumber :min="1" v-model="item.count" style="width:100px" @on-change="upDate"></InputNumber>
                            </span>
                            <span class="span bigFont">
                                ￥ {{(item.unitprice*item.count).toFixed(2)}}
                            </span>
                            <span><Icon type="trash-a" class="deletPrice" @click.native="deletPrice(index)" @on-change="upDate" ></Icon></span>
                            <div class="clear"></div>
                        </li>
                        <li style="margin-top:10px;">
                            <span class="span"><em class="addPrice" @click="addPriceList"><Icon type="ios-plus-outline"></Icon> 增加清单项</em></span>
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
                    <div v-if="lineFlag">
                        <li v-for="(item,index) in contractPayDate" :key="index">
                            <span class="span line">{{item.key}}</span>
                            <span class="span line">{{item.num}}</span>
                            <span class="span line bigFont">￥{{item.amount}}</span>
                            <div class="clear"></div>
                        </li>
                    </div>
                    <div v-if="!lineFlag">
                        <li v-for="(item,index) in contractPayDate" :key="index">
                            <span class="span">
                                <Input v-model="item.key" placeholder="输入付款阶段" @on-change="upDate"></Input>
                            </span>
                            <span class="span">
                                <em>({{Math.round((item.num/fileCount)*100)}}%)</em>
                                <Input v-model="item.num" placeholder="文件数量" @on-change="upDate"></Input>
                            </span>
                            <span class="span">
                                <Input v-model="item.amount" placeholder="输入该阶段支付合同款" class="payAmount" @on-change="upDate"></Input>
                            </span>
                            <span>
                                <Icon type="trash-a" class="deletPrice" @click.native="deletPay(index)" @on-change="upDate"></Icon>
                            </span>
                            <div class="clear"></div>
                        </li>
                        <li style="margin-top:10px;">
                            <span class="span"><em class="addPrice" @click="addPay"><Icon type="ios-plus-outline"></Icon> 增加付款阶段</em></span>
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
            priceData:[
                {
                    key:'',
                    finish_date:'',
                    unitprice:null,
                    count:1,
                }
            ],
            contractPayDate:[
                {
                    key:'首笔款',
                    num:0,
                    amount:'',
                },
                {
                    key:'尾款',
                    num:0,
                    amount:'',
                }
            ],
            // ------------
            fileCount:1,
            priceNum:0,

            contFileConunt:1,
            // ------------
            amount:0,
            dateIndex:0,
            // -----------
        }
    },
    computed:{
        lineFlag(){
            return this.$store.state.paySkip.enterContractFlag;
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
        this.priceChange();
    },
    methods:{
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
        updateCost(){
            let constArr=
                {
                    "price_list":[],
                    "step_list":[]
                }
            
            constArr.price_list=this.priceData;
            constArr.step_list=this.contractPayDate;
            this.$bus.emit('addContractCost',constArr);
        },

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
            this.upDate()
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
            if(this.priceData.length>1){
                this.priceData.splice(index,1);
            }else{
                this.priceData.splice(index,1,{
                key:'',
                finish_date:'',
                unitprice:null,
                count:1,
            });
            }
        },
        // addPay
        addPay(){
            let payNum=''
            switch(this.contractPayDate.length){
                case 1:
                    payNum='一';
                    break;
                case 2:
                    payNum='二';
                    break;
                case 3:
                    payNum='三';
                    break;
                case 4:
                    payNum='四';
                    break;
                case 5:
                    payNum='五';
                    break;
                case 6:
                    payNum='六';
                    break;
                case 7:
                    payNum='七';
                    break;
                case 8:
                    payNum='八';
                    break;
                case 9:
                    payNum='九';
                    break;
                case 10:
                    payNum='十';
                    break;
                default:
                    payNum="N"
            }
            let obj={
                key:payNum+'笔款',
                num:'',
                amount:'',
            }
            this.contractPayDate.splice(this.contractPayDate.length-1,0,obj)
        },
        // deletePay
        deletPay(index){
            this.contractPayDate.splice(index,1);

        },
        // priceChange
        priceChange(){
            let sum=0;
            let amsum=0;
            let csum=0;
            let camsum=0;
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

            for(let j=0;j<this.contractPayDate.length;j++){
                csum+=Number(this.contractPayDate[j].num);
                camsum+=Number(this.contractPayDate[j].amount)
            }
            if(csum>sum){
                this.$Message.error('对不起,文件数大于合同文件数据！');
                this.$bus.emit("Bdisabled",true);
            }else if(camsum>amsum){
                this.$Message.error('对不起,金额大于合同金额！');
                this.$bus.emit("Bdisabled",true);
            }else{
                this.$bus.emit("Bdisabled",false);
            }

        },
        upDate(){
            this.$emit('changeIsSubmit')
        }
    },
    updated(){
        this.priceChange();
        this.updateCost();
    }
}
</script>
<style>

</style>
