<template>
    <div class="newBidList">
        <dl>
            <dd v-for="item in applicationData" :key="item.id">
                <div class="bidTitle" @click="applicationInfo(item.test_name,item.id)">
                     {{item.test_name}}
                </div>
                <div class="bidMoney">
                    <span>
                        测试金额
                        <p>￥<em>{{item.test_price}}</em></p>
                    </span>
                    <span>
                        项目预计
                        <p>￥<em>{{item.project_max_price}}</em></p>
                    </span>
                    <div class="clear"></div>
                </div>
                <div class="bidPerso">
                    <div class="persoInfo">
                        <div>
                            <span class="span"><i class="iconfont icon-renyuanguanli"></i> 负责人：{{item.apply_users}}</span>
                            <span class="span"><i class="iconfont icon-yonghuguanli"></i> 执行人：{{item.execute_users}}</span>
                            <div class="clear"></div>
                        </div>
                        <div class="progress">
                            <Progress :percent="item.finish_percent>100?99.99:item.finish_percent" status="active" :stroke-width="5">
                                <span>{{item.end_days<0?'延期 '+Math.abs(item.end_days)+' 天':'剩余 '+item.end_days+' 天'}}</span>
                            </Progress>
                        </div>
                    </div>
                </div>
                <div :class="[item.status!=0?'bidStatus bidYes':'bidStatus']">
                    {{item.status_t}}
                </div>
            </dd>
        </dl>
        <Modal
                    v-model="applModal"
                    :title="modalTitle"
                    :closable="false"
                    width="1100px">
                    <bid-Details :appData='appData' ref="getCont"></bid-Details>
                   <div slot="footer"></div>
        </Modal>
    </div>
    <!-- 
    <div class="bidList">
                <dl>
                    <dt>
                        <span>测试任务</span>
                        <span>任务金额</span>
                        <span>项目预计总额</span>
                        <span>执行人</span>
                        <span>交稿剩余时间</span>
                        <span>搞件</span>
                        <span>结果</span>
                        <div class="clear"></div>
                    </dt>
                    <dd v-for="item in applicationData" @click="applicationInfo(item.test_name,item.id)" :key="item.id">
                        <span>
                            <img :src="item.picture">
                            <em>
                                {{item.test_name}}
                            </em>
                        </span>
                        <span>
                            ￥{{item.test_price}}
                        </span>
                        <span>
                            ￥{{item.project_min_price}}~{{item.project_max_price}}
                        </span>
                        <span>
                            <img :src="item.headimage" v-if="item.headimage==null?false:true"> {{item.execute_users}}
                        </span>
                        <span>
                            <em class="action" v-if="item.end_days>0">{{item.end_days>0?item.end_days+'天':'今天结束'}}</em>
                            <em v-if="item.end_days<0">{{item.end_days<0?'已结束':''}}</em>
                        </span>
                        <span>
                            <em v-if="item.test_files=='未上传'">{{item.test_files}}</em>
                            <em :class="[item.test_files=='待审核'?'await':'upload']" v-if="item.test_files=='待审核' || item.test_files=='已上传'">{{item.test_files}}</em>
                        </span>
                        <span>
                            <em :class="[item.status==0?'await':'bidding']" v-if="item.status==0 || item.status==1 ">{{item.status==0?'待公布':'中标'}}</em>
                            <em v-if="item.status>1">{{item.status|filerStatus}}</em>
                        </span>
                        <div class="clear"></div>
                    </dd>
                </dl>

                <Modal
                    v-model="applModal"
                    :title="modalTitle"
                    :closable="false"
                    width="1100px">
                    <bid-Details :appData='appData' ref="getCont"></bid-Details>
                   <div slot="footer"></div>
                </Modal>
    </div>
     -->
</template>
<script>
import bidDetails from './bidDetails';
export default {
    data(){
        return{
            applModal:false,
            modalTitle:'',
            appData:{}
        }
    },
    props:{
        applicationData:{
            type:Array
        }
    },
    filters:{
        filerStatus(val){
            if(val==2){
                return '落选'
            }else if(val==3){
                return '招标失败'
            }else if(val==4){
                return '加入公司库'
            }
        }
    },
    components:{
        bidDetails:bidDetails,
    },
    methods:{
        // 招标详情
        applicationInfo(name,id){
            let _this=this;
            _this.$Loading.start();
            _this.applModal=true;
            _this.modalTitle=name;
            let url=_this.GLOBAL.baseRouter+'task/company/bid-info&bid_id='+id;
            _this.$axios.get(url).then(msg=>{
                _this.$Loading.finish();
                let MsgData=msg.data;
                if(MsgData.err_code==0){
                    let MsgObj={
                        id:MsgData.id,
                        testName:MsgData.test_name,
                        testPrice:MsgData.test_price,
                        demandCompanyName:MsgData.demand_company_name,
                        projectMinPrice:MsgData.project_min_price,
                        projectMaxPrice:MsgData.project_max_price,
                        executeUserName:MsgData.execute_user_name,
                        picture:MsgData.picture,
                        file:MsgData.file,
                        fileRequire:MsgData.file_require,
                        description:MsgData.description,
                        bidFile:MsgData.bid_file,
                        endTime:MsgData.end_time
                    }
                    _this.appData=MsgObj;
                    _this.$refs.getCont.getCont(_this.personnel);
                }
            })
        },
    }
}
</script>
