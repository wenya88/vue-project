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
                        <p>￥83500.00</p>
                    </div>
                    <div class="infoMent sPayAble">
                        <i class="iconfont icon-shoukuan"></i> 待收款
                        <p>￥83500.00</p>
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
                        <p>￥83500.00</p>
                    </div>
                    <div class="infoMent forPaid">
                        <i class="iconfont icon-zidingyibiaodan-caiwulei_zhichu"></i> 待支出
                        <p>￥83500.00</p>
                    </div>
                    <div class="clear"></div>
                </div>
            </div>
            <!-- sProje -->
            <div class="sIncome sProje">
                <div class="title">&nbsp;</div>
                <div>
                    <div class="infoMent">
                        <span class="project">5</span>个
                        <p>承接项目</p>
                    </div>
                    <div class="infoMent">
                        <span class="number">8</span>个
                        <p>成员数量</p>
                    </div>
                    <div class="clear"></div>
                </div>
            </div>
            <!-- sGrade -->
            <div class="sGrade">
                <i-circle :size="80" :trail-width="5" :stroke-width="6" :percent="valueHalf*20" stroke-linecap="square" stroke-color="#fcc44a" >
                    <div>
                        <p class="gradeText"><span>{{valueHalf}}</span>分</p>
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
                <bid-ding :biddingColor="biddingColor"></bid-ding>
            </div>
            <!-- 收入走势 -->
            <div class="echartColumn earning">
                <div class="echartTitle">收入走势</div>
                <bid-ding :biddingColor="earningColor"></bid-ding>
            </div>
            <!-- 承接项目走势 -->
            <div class="echartColumn project">
                <div class="echartTitle">承接项目走势</div>
                <bid-ding :biddingColor="projectColor"></bid-ding>
            </div>
            <!-- 质量走势 -->
            <div class="echartColumn quality">
                <div class="echartTitle">质量走势</div>
                <bid-ding :biddingColor="qualityColor"></bid-ding>
            </div>
            <!-- 成员空闲走势 -->
            <div class="echartColumn member">
                <div class="echartTitle">成员空闲走势</div>
                <bid-ding :biddingColor="memberColor"></bid-ding>
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
            biddingColor:{
                Cstart:'#c0f3ea',
                Cend:'#f6fdfc',
                Cline:'#4fdcc5',
                echartID:'echartBid'
            },
            earningColor:{
                Cstart:'#feeabe',
                Cend:'#fffcf6',
                Cline:'#fcc44a',
                echartID:'echartEarning'
            },
            projectColor:{
                Cstart:'#d0e8fe',
                Cend:'#f5faff',
                Cline:'#7cbefc',
                echartID:'echartProject'
            },
            qualityColor:{
                Cstart:'#ffd4d6',
                Cend:'#fff3f3',
                Cline:'#ff898e',
                echartID:'echartQuality' 
            },
            memberColor:{
                Cstart:'#ceeccf',
                Cend:'#fafdfa',
                Cline:'#78c97c',
                echartID:'echartMember'  
            }
        }
    },
    components:{
        bidDing:bidDing,
    }
}
</script>

