<template>
   <!-- 投标 -->
  <div class="bidManage">
      <Tabs value="application" @on-click="application" :animated="false">
        <!-- 已报名招标 -->
        <TabPane :label="appName" name="application">
            <div class="fileCondition">
                <em> 
                    <Select v-model="condtionData" size="small" style="width:110px">
                        <Option v-for="item in filerList" :value="item.index" :key="item.index">{{ item.value }}</Option>
                    </Select>
                </em>
                <em> 
                    <Select v-model="resultData" size="small" style="width:110px">
                        <Option v-for="item in resultList" :value="item.index" :key="item.index">{{ item.value }}</Option>
                    </Select>
                </em>
                <em>
                    <Input v-model="searchData" size="small" style="width:150px;margin-top:-1px;" placeholder="输入搜索的内容">
                        <Button slot="append" icon="ios-search" size="small" @click.native="search"></Button>
                    </Input>
                </em>
                <div class="clear"></div>
            </div>
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
                            <img :src="item.headimage!=null?item.headimage:'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1528168614&di=2d0f1e00b83ecd741a9c32a4c83ef526&src=http://pic.90sjimg.com/design/00/67/59/63/58e89bee922a2.png'"> {{item.execute_user}}
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
                <!-- ModalComponent-->
                <Modal
                    v-model="applModal"
                    :title="modalTitle"
                    :closable="false"
                    @on-cancel="cancelModal"
                    width="1100px">

                    <!-- 招标详情Modal -->
                    <bid-Details :appData='appData' ref="getCont"></bid-Details>
                    
                   <div slot="footer"></div>
                </Modal>
            </div>

        </TabPane>
        <!-- 外包邀请 -->
        <TabPane label="外包邀请" name="invite">
            <div class="fileCondition">
                <em> 
                    <Select v-model="fileInvite" size="small" style="width:110px">
                        <Option v-for="item in inviteList" :value="item.value" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </em>
                <em>
                    <Input v-model="searchData" size="small" style="width:150px;margin-top:-1px;" placeholder="输入搜索的内容">
                        <Button slot="append" icon="ios-search" size="small"></Button>
                    </Input>
                </em>
                <div class="clear"></div>
            </div>
             <div class="bidList invite">
                <dl>
                    <dt>
                        <span>项目名称</span>
                        <span>项目预计总额</span>
                        <span>时间要求</span>
                        <span>邀请方</span>
                        <span>邀请反馈</span>
                        <div class="clear"></div>
                    </dt>
                    <dd>
                        <span>项目名称</span>
                        <span>项目预计总额</span>
                        <span>时间要求</span>
                        <span>邀请方</span>
                        <span><Button type="primary">确认</Button></span>
                        <div class="clear"></div>
                    </dd>
                </dl>
             </div>
        </TabPane>
      </Tabs>
  </div>
</template>
<script>
import bidDetails from './bidManage/component/bidDetails'
var qs = require('querystring')
export default {
    data () {
        return {
            appName: (h) => {
                    return h('div', [
                        h('span', '已报名招标'),
                        h('Badge', {
                            props: {
                                count:'('+this.applicationData.length+')',
                            }
                        })
                    ])
                },
            companyID:1,
            applicationData:[],
            applModal:false,
            modalTitle:'',
            condtionData:0,
            filerList:[
                {value:'不限',index:0},
                {value:'未上传',index:1},
                {value:'已上传',index:2},
                {value:'待审核',index:3}
            ],
            resultData:5,
            resultList:[
                {value:'不限',index:5},
                {value:'等待公布',index:0},
                {value:'中标',index:1},
                {value:'落选',index:2},
                {value:'入合作公司库',index:3},
                {value:'招标失败',index:4}
            ],
            searchData:null,
            fileInvite:'不限',
            inviteList:[
                {value:'不限'},
                {value:'待确认'},
                {value:'邀请已过期'},
                {value:'已接受'},
                {value:'已拒绝'}
            ],
            appData:[],
            personnel:[]
        }
    },
    components:{
        bidDetails:bidDetails
    },
    mounted(){
        this.bidGet();
        this.Refresh();
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
    watch:{
        condtionData(val){
           this.bidGet(val,this.resultData);
        },
        resultData(val){
           this.bidGet(this.condtionData,val);
        }
    },
    methods:{
        // 远程关闭Modal
        Refresh(){
            this.$bus.on('InfoRefresh',()=>{
                this.applModal=false;
            })
        },
        //关闭Modal回调
        cancelModal(){
            this.$bus.emit("defaultType")
        },
        // 招标详情
        applicationInfo(name,id){
            let _this=this;
            _this.applModal=true;
            _this.modalTitle=name;
            let url=_this.GLOBAL.baseRouter+'task/company/bid-info&bid_id='+id;
            _this.$axios.get(url).then(msg=>{
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
        // 切换外包和招标
        application(name){
            console.log(name)
        },
        // 搜索
        search(){
            this.bidGet(this.condtionData,this.resultData,this.searchData)
        },
        //初始化招标数据
        bidGet(condData=this.condtionData,resultData=this.resultData,searData=this.searchData){
            let _this=this;
            _this.$Loading.start();
            let ContUrl=_this.$axios.get(_this.GLOBAL.baseRouter+'task/project/get-company-member');
            let url=_this.$axios.post(_this.GLOBAL.baseRouter+'task/company/bid-list',qs.stringify({
                company_id:_this.companyID,
                has_file:condData,
                bid_result:resultData,
                search:searData
            }))
            _this.$axios.all([url,ContUrl]).then(([msg,ContMsg])=>{
                if(msg.data.err_code==0){
                    _this.$Loading.finish();
                    //招标
                    _this.applicationData=msg.data.data;
                    _this.personnel=ContMsg.data.data;
                }
                _this.searchData=null;
            },()=>{
                _this.$Loading.error();
            })  
        }
    }
}
</script>
<style lang="less">
  @import './bidManage/style/bidManage.less';
</style>
