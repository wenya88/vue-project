<template>
   <!-- 投标 -->
  <div class="bidManage">
      <Tabs value="application" :animated="false">
        <!-- 已报名招标 -->
        <TabPane v-if="callForBidsdts.HaveTender" :label="appName" name="application">
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
        <TabPane v-if="callForBidsdts.invitation" :label="inviteName" name="invite">
            <div class="fileCondition">
                <em> 
                    <Select v-model="fileInvite" size="small" style="width:110px">
                        <Option v-for="item in inviteList" :value="item.key" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </em>
                <em>
                    <Input v-model="searchData" size="small" style="width:150px;margin-top:-1px;" placeholder="输入搜索的内容" @on-enter="searchInVite">
                        <Button slot="append" icon="ios-search" size="small" @click.native="searchInVite"></Button>
                    </Input>
                </em>
                <div class="clear"></div>
            </div>
            <bid-invite :inviteData="inviteData"></bid-invite>
        </TabPane>
      </Tabs>
  </div>
</template>
<script>
    import {mapState} from 'vuex'
import bidInvite from './bidManage/component/bidInvite'
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
            inviteName:(h)=>{
                 return h('div', [
                        h('span', '外包邀请'),
                        h('Badge', {
                            props: {
                                count:'('+this.inviteData.length+')',
                            }
                        })
                    ])
            },
            companyID:2,
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
            fileInvite:0,
            inviteList:[
                {value:'不限',key:0},
                {value:'未反馈',key:1},
                {value:'已接受',key:2},
                {value:'已拒绝',key:3},
                {value:'邀请过期',key:4}
            ],
            appData:{},
            personnel:[],
            inviteData:[]
        }
    },
    components:{
        bidDetails:bidDetails,
        bidInvite:bidInvite
    },
    mounted(){
        this.bidGet();
        this.Refresh();
        this.inviteGet();
        this.$bus.on('updataSuccess',()=>{
            this.inviteGet();
        })
        this.$bus.on('setExecuteUser',()=>{
            this.bidGet(); 
        })
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
        },
        fileInvite(val){
           this.inviteGet(this.searchData,val) 
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
            
        },
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
        // 招标搜索
        search(){
            this.bidGet(this.condtionData,this.resultData,this.searchData)
        },
        searchInVite(){
            this.inviteGet(this.searchData,this.fileInvite)
        },
        // 初始化招标数据
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
        },
        // 邀请列表
        inviteGet(search=this.searchData,status=this.fileInvite){
            let _this=this;
            let url=_this.GLOBAL.baseRouter+'task/company/my-invite-list';
            let params={
                search:search,
                status:status
            }
            _this.$Loading.start();
            _this.$axios.post(url,qs.stringify(params)).then(msg=>{
                if(msg.data.err_code==0){
                    _this.$Loading.finish();
                    _this.inviteData=msg.data.data
                }
            },()=>{
                _this.$Loading.error();
            })
        }
    },
    computed:{
        ...mapState({
            callForBidsdts(data){
                return data.app.callForBidsdts
            }
        })
    },
}
</script>
<style lang="less">
  @import './bidManage/style/bidManage.less';
</style>
