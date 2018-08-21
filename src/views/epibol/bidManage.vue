<template>
   <!-- 投标 -->
  <div class="bidManage">
      <Tabs value="application" :animated="false">
        <!-- 已报名招标 -->
        <TabPane v-if="callForBidsdts.HaveTender" :label="appName" name="application">
            <!-- 搜索条件 -->
            <!-- <div class="fileCondition">
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
            </div> -->
            <div class="newBid">
                 <bid-list :applicationData="applicationData"></bid-list>
            </div>
        </TabPane>
        <!-- 外包邀请 -->
        <TabPane v-if="callForBidsdts.invitation" :label="inviteName" name="invite">
            <!-- 搜索条件 -->
            <!-- <div class="fileCondition">
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
            </div> -->
            <div class="newBid">
                <bid-invite :inviteData="inviteData"></bid-invite>
            </div>
        </TabPane>
      </Tabs>
  </div>
</template>
<script>
import {mapState} from 'vuex';
import bidInvite from './bidManage/component/bidInvite';
import bidList from './bidManage/component/bidList';
var qs = require('querystring');
export default {
    data () {
        return {
            appName: (h) => {
                    return h('div', [
                        h('span', '已报名'),
                        // h('Badge', {
                        //     props: {
                        //         count:'('+this.applicationData.length+')',
                        //     }
                        // })
                    ])
                },
            inviteName:(h)=>{
                 return h('div', [
                        h('span', '外包邀请'),
                        h('Badge', {
                            props: {
                                count:'( '+this.inviteData.length+' )',
                            }
                        })
                    ])
            },
            companyID:2,
            applicationData:[],
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
            personnel:[],
            inviteData:[],
        }
    },
    components:{
        bidList:bidList,
        bidInvite:bidInvite
    },
    mounted(){
        this.bidGet();
        this.inviteGet();
        this.$bus.on('updataSuccess',()=>{
            this.inviteGet();
        });
        this.$bus.on('setExecuteUser',()=>{
            this.bidGet(); 
        });
        this.autoH();
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
        // 设置行高
        autoH(){
            $('.bidManage .newBid').height($(window).height()-165)
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
            let ContUrl=_this.GLOBAL.baseRouter+'task/project/get-company-member';
            let url=_this.GLOBAL.baseRouter+'task/company/bid-list';
            let urlParams={
                company_id:_this.companyID,
                has_file:condData,
                bid_result:resultData,
                search:searData
            }
            _this.$axios.get(ContUrl).then(ContMsg=>{
                 _this.$Loading.finish();
                 _this.personnel=ContMsg.data.data;
            })

            _this.$axios.post(url,qs.stringify(urlParams)).then(msg=>{
                if(msg.data.err_code==0){
                    //招标
                    _this.applicationData=msg.data.data;
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
                    _this.inviteData=msg.data.data;
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
