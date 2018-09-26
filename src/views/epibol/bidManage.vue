<template>
   <!-- 投标 -->
  <div class="bidManage">
      <main-native>
          <div class="main-header-style iconfont">
              <ul class="setMenuList">
                  <li v-for="(item,index) in tabsInfo.tabs" :class="{'checked':index == tabsInfo.tabIndex}" @click="tabsInfo.tabIndex = index">
                      {{ item.tab }}
                      <span v-if="item.count">({{item.count}})</span>
                  </li>
              </ul>
          </div>
      </main-native>

      <div>
          <div class="newBid" v-if="bidData && tabsInfo.tabIndex == 0" name="application">
              <bid-list :applicationData="bidData" v-on:referBidList="bidGet"></bid-list>
          </div>
          <div class="newBid" v-if="inviteData && tabsInfo.tabIndex == 1" name="invite">
              <bid-invite :inviteData="inviteData"></bid-invite>
          </div>
      </div>
  </div>
</template>
<script>
import {mapState} from 'vuex';
import bidInvite from './bidManage/component/bidInvite';
import bidList from './bidManage/component/bidList';
import mainNative from '../main-components/mainNative.vue';
import api from 'api';
var qs = require('querystring');
export default {
    data () {
        return {
            tabsInfo:{
                tabs:[
                  {tab:'已报名',name:'application',count:null},
                  {tab:'外包邀请',name:'invite',count:null}
                ],
                tabIndex:0
            },
            inviteData:[],
            bidData:[],
        }
    },
    components:{
        bidList:bidList,
        bidInvite:bidInvite,
        mainNative:mainNative
    },
    mounted(){
        this.bidGet();
        this.inviteGet();
        this.autoH();
    },
    methods:{
        // 设置行高
        autoH(){
            $('.bidManage .newBid').height($(window).height()-165)
        },
        // 获取招标数据
        async bidGet(){
            this.$Loading.start();
            const bidList = await api.getBidList();
            if(bidList.data.err_code == 0){
                this.$Loading.finish();
                let listData = bidList.data.data;
                let nowDate = new Date();
                for(let i=0;i<listData.length;i++){
                    let endData  = new Date(listData[i].end_time * 1000);
                    // console.log(endData.getFullYear()+'----'+(endData.getMonth()+1)+'++++++'+endData.getDate());
                    let year = parseInt(endData.getFullYear() - nowDate.getFullYear());
                    let month = parseInt((endData.getMonth()+1)-(nowDate.getMonth()+1));
                    let day = parseInt(endData.getDate()-nowDate.getDate());

                    // console.log(year+'----'+month+'++++++'+day);

                    let shengyuDay = year * 365 + month * 30 + day;
                    let strShengyuDay = '';
                    if(shengyuDay >= 0){
                        strShengyuDay = `剩余 ${shengyuDay} 天`
                    }else {
                        if(listData[i].bid_status == 9 || listData[i].bid_status == 4 ){
                            strShengyuDay = `剩余 0 天`
                        }else {
                            strShengyuDay = `延期 ${Math.abs(shengyuDay)} 天`
                        }
                    }
                    listData[i].shengyuDay = shengyuDay;
                    listData[i].strShengyuDay = strShengyuDay;
                    listData[i].strendDay = endData.getFullYear()+'-'+(endData.getMonth()+1)+'-'+endData.getDate()
                }
                this.bidData = [...listData];
            }else {
                this.$Loading.error();
            }
        },
        // 邀请列表
        inviteGet(){
            let _this=this;
            let url=_this.GLOBAL.baseRouter+'task/company/my-invite-list';
            _this.$Loading.start();
            _this.$axios.post(url).then(msg=>{
                if(msg.data.err_code==0){
                    _this.$Loading.finish();
                    _this.inviteData=msg.data.data;
                    _this.tabsInfo.tabs[1].count = msg.data.page.count;
                }
            },()=>{
                _this.$Loading.error();
            })
        },
    }
}
</script>
<style lang="less">
  @import './bidManage/style/bidManage.less';
</style>
