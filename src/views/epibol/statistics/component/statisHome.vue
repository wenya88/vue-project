<template>
    <div>
        <!-- statisInfo -->
        <div class="statisInfo">
            <!-- inCome -->
            <div class="sIncome">
                <div class="title">收入</div>
                <div>
                    <div class="infoMent sPayMent">
                        <i class="iconfont icon-qianbao"></i> 已收款
                        <p>￥{{Number(statisData.income).toFixed(2)}}</p>
                    </div>
                    <div class="infoMent sPayAble">
                        <i class="iconfont icon-shoukuan"></i> 待收款
                        <p>￥{{Number(statisData.wait_income).toFixed(2)}}</p>
                    </div>
                    <div class="clear"></div>
                </div>
            </div>
            <!-- sDisbu -->
            <div class="sIncome sDisbu">
                <div class="title">支出</div>
                <div>
                    <div class="infoMent outPaid">
                        <i class="iconfont icon-qiandai"></i> 已支出
                        <p>￥{{Number(statisData.pay).toFixed(2)}}</p>
                    </div>
                    <div class="infoMent forPaid">
                        <i class="iconfont icon-zidingyibiaodan-caiwulei_zhichu"></i> 待支出
                        <p>￥{{Number(statisData.wait_pay).toFixed(2)}}</p>
                    </div>
                    <div class="clear"></div>
                </div>
            </div>
            <!-- sProje -->
            <div class="sIncome sProje">
                <div class="title">&nbsp;</div>
                <div>
                    <div class="infoMent">
                        <span class="project">{{statisData.project_count}}</span>个
                        <p>承接项目</p>
                    </div>
                    <div class="infoMent">
                        <span class="number">{{statisData.member_count}}</span>个
                        <p>成员数量</p>
                    </div>
                    <div class="clear"></div>
                </div>
            </div>
            <!-- sGrade -->
            <div class="sGrade">
                <i-circle :size="80" :trail-width="5" :stroke-width="6" :percent="valueHalf*20" stroke-linecap="square" stroke-color="#fcc44a" trail-color="#fff2d7" >
                    <div>
                        <p class="gradeText"><span>{{Number(statisData.quality)}}</span>分</p>
                        <Rate allow-half disabled v-model="valueHalf" />
                    </div>
                </i-circle>
                <p class="title">总体质量评分</p>
            </div>
            <div class="clear"></div>
        </div>
        <!-- statisEchart -->
        <div class="statisEchart">
            <!-- 中标率 -->
            <div class="echartColumn bidding">
                <div class="echartTitle">中标率</div>
                <bid-ding :biddingColor="biddingColor" :biddingData="bidData"></bid-ding>
            </div>
            <!-- 收入走势 -->
            <div class="echartColumn earning">
                <div class="echartTitle">收入走势</div>
                <bid-ding :biddingColor="earningColor" :biddingData="earningData"></bid-ding>
            </div>
            <!-- 承接项目走势 -->
            <div class="echartColumn project">
                <div class="echartTitle">承接项目走势</div>
                <bid-ding :biddingColor="projectColor" :biddingData="projectData"></bid-ding>
            </div>
            <!-- 质量走势 -->
            <div class="echartColumn quality">
                <div class="echartTitle">质量走势</div>
                <bid-ding :biddingColor="qualityColor" :biddingData="qualityData"></bid-ding>
            </div>
            <!-- 成员空闲走势 -->
            <div class="echartColumn member">
                <div class="echartTitle">成员空闲走势</div>
                <bid-ding :biddingColor="memberColor" :biddingData="memberData"></bid-ding>
            </div>
            <div class="clear"></div>
        </div>
        <!-- //statisEchartEnd -->
    </div>
</template>
<script>
import bidDing from './statisHome/bidding';
export default {
    data(){
        return{
            valueHalf:1.2,
            // 中标率
            biddingColor:{
                Cstart:'#c0f3ea',
                Cend:'#f6fdfc',
                Cline:'#4fdcc5',
                echartID:'echartBid'
            },
            // 收入走势
            earningColor:{
                Cstart:'#feeabe',
                Cend:'#fffcf6',
                Cline:'#fcc44a',
                echartID:'echartEarning'
            },
            // 承接项目走势
            projectColor:{
                Cstart:'#d0e8fe',
                Cend:'#f5faff',
                Cline:'#7cbefc',
                echartID:'echartProject'
            },
            // 质量走势
            qualityColor:{
                Cstart:'#ffd4d6',
                Cend:'#fff3f3',
                Cline:'#ff898e',
                echartID:'echartQuality' 
            },
            // 成员空闲走势
            memberColor:{
                Cstart:'#ceeccf',
                Cend:'#fafdfa',
                Cline:'#78c97c',
                echartID:'echartMember'  
            },

            //图表数据
            bidData:{}, // 中标
            earningData:{}, // 收入走势
            projectData:{}, // 承接项目
            qualityData:{}, // 质量走势
            memberData:{},  //  成员

            statisData:Array
        }
    },
    components:{
        bidDing:bidDing,
    },
    beforeMount(){
        this.getStatisData();
    },
    methods:{
        getStatisData(){
            this.$Loading.start();
            let url=this.GLOBAL.baseRouter+'task/count/home-page';
            this.$axios.get(url).then(msg=>{
                if(msg.data.err_code==0){
                    this.$Loading.finish();
                    this.statisData=msg.data.data;
                    this.valueHalf=Number(this.statisData.quality);

                    this.bidData=msg.data.data.bid_trend;
                    this.earningData=msg.data.data.income_trend;
                    this.projectData=msg.data.data.project_trend;
                    this.qualityData=msg.data.data.quality_trend;
                    this.memberData=msg.data.data.free_trend;

                }else{
                    this.$Loading.error();
                }
            })
        }
    }
}
</script>

