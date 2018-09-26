<template>
    <div class="newBidList">
        <dl>
            <dd v-for="item in applicationData" :key="item.id" >
                <div @click="applicationInfo(item)">
                <div class="bidTitle">
                     {{item.test_name}}
                </div>
                <div class="bidMoney">
                    <span v-if="item.test_price">
                        测试金额
                        <p>￥<em>{{Math.round(Number(item.test_price))}}</em></p>
                    </span>
                    <span v-else>
                        我方报价
                        <p>￥<em>{{Math.round(Number(item.bid_price))}}</em></p>
                    </span>
                    <span>
                        项目预计
                        <p>￥<em>{{Math.round(Number(item.project_max_price))}}</em></p>
                    </span>
                    <div class="clear"></div>
                </div>
                <div class="bidPerso">
                    <div class="persoInfo">
                        <div>
                            <span class="span"><i class="iconfont icon-renyuanguanli"></i> 负责人：{{item.leader_name ||'未指派'}}</span>
                            <span class="span"><i class="iconfont icon-yonghuguanli"></i> 执行人：{{item.execute_name ||'未指派'}}</span>
                            <div class="clear"></div>
                        </div>
                        <div class="progress">
                            <Progress :percent="((100-item.shengyuDay)/100)*100 > 100 ? 100 : ((100-item.shengyuDay)/100)*100 " status="active" :stroke-width="5" style="max-width: 100%">
                                <span>{{item.strShengyuDay}}</span>
                            </Progress>
                        </div>
                    </div>
                </div>
                </div>
                <div class="bidStatus" :class="{'bidYes':item.bid_status == 1 ||item.bid_status == 2 || item.bid_status == 4 || item.bid_status == 9}" @click="comfirmPay(item)">
                    {{item.status_text}}
                    <!--{{item.strendDay}}-->
                </div>
            </dd>
        </dl>
    </div>
</template>
<script>
    import api from 'api'
export default {
    props:{
        applicationData:{
            type:Array,
            default:[]
        }
    },
    methods:{
        // 招标详情
        applicationInfo(item){
            console.log(JSON.stringify(item))
            //如果是一口价任务 或者 是报价任务且报价状态是已选择报价 那么直接跳转测试任务详情
            //否则提示等待确认报价
            if(item.test_price || !item.test_price && item.bid_status !=5){
                this.$router.push({name:'ManageDetails',params:{id:item.id,type:'new'}});
            }else if(!item.test_price && item.bid_status == 5){
                this.$Message.warning('等待确认报价！');
            }
        },
        comfirmPay(item){
            if(item.bid_status == 8){
                let _this = this;
                (async function () {
                    const collectData = await api.collect({bid:item.id});
                    if(collectData.data.err_code == 0){
                        _this.$Message.success("收款成功!");
                        _this.$emit('referBidList')
                    }else {
                        _this.$Message.error("收款失败!")
                    }
                })();
            }
        }
    }
}
</script>
