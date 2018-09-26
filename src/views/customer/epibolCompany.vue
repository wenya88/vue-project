<template>
  <div class="bidManage">
     <Tabs @on-click="application" :animated="false">

          <!-- 测试任务 -->
          <TabPane :label="testName" name="testTask">
              <div class="fileCondition" v-if="Details">
                <em>
                    <Select v-model="stateData" style="width:80px">
                        <Option v-for="item in stateList" :value="item.index" :key="item.index">{{ item.value }}</Option>
                    </Select>
                </em>
                <em>
                    <Input v-model="searchData" style="width:200px;margin-top:-1px;" placeholder="输入任务名称" @keyup.13.native="search">
                        <Button slot="append" icon="ios-search" @click.native="search"></Button>
                    </Input>
                </em>
                <em>
                    <Button type="success" @click.native="newAdd"><i class="iconfont icon-xinjian"></i> 新增任务</Button>
                </em>
                <div class="clear"></div>
            </div>
            <test-task :testTaskData='testTaskData' ref="testTaskRef" v-on:referList="referListFun"></test-task>
          </TabPane>
         <!-- 合作公司 -->
         <TabPane :label="comName" name="coopCom">
             <div class="fileCondition">
                 <em>
                     <Select v-model="sourceData" style="width:80px">
                         <Option v-for="item in sourceList" :value="item.index" :key="item.index">{{ item.value }}</Option>
                     </Select>
                 </em>
                 <em>
                     <Input v-model="searchData" style="width:200px;margin-top:-1px;" placeholder="公司名称/联系人/电话/擅长" @keyup.13.native="searchCoop">
                     <Button slot="append" icon="ios-search" @click.native="searchCoop"></Button>
                     </Input>
                 </em>
                 <em>
                     <Button type="success" @click.native="newAddCoop"><i class="iconfont icon-xinjian"></i> 添加公司</Button>
                 </em>
                 <div class="clear"></div>
             </div>
             <coop-corp :coopCorpData="coopCorpData" ref="coopCorpRef"></coop-corp>
         </TabPane>
          <!-- 外包邀请 -->
          <TabPane :label="otherName" name="otherInvite">
                 <div class="fileCondition">
                    <em>
                    <Input v-model="intivesearch" style="width:200px;margin-top:-1px;" placeholder="输入任务名称" @keyup.13.native="intivesearchBtn">
                        <Button slot="append" icon="ios-search" @click.native="intivesearchBtn"></Button>
                    </Input>
                    </em>
                    <em>
                        <Button type="success" @click.native="newAddIntive"><i class="iconfont icon-xinjian"></i> 新增外包</Button>
                    </em>
                    <div class="clear"></div>
                </div>
                <company-invite :intivesData="intivesData" ref="companyIntive"></company-invite>
          </TabPane>
     </Tabs>

  </div>
</template>
<script>
var qs=require('querystring')
import companyInvite from './epibolCompany/component/companyInvite';
import testTask from './epibolCompany/component/testTask';
import coopCorp from './epibolCompany/component/coopCorp';
import mainNative from '../main-components/mainNative.vue';
import api from 'api';
export default {
    data(){
      return{
          testName: (h) => {
              return h('div', [
                  h('span', '测试任务'),
                  h('Badge', {
                      props: {
                          count:'('+this.testTaskData.length+')',
                      }
                  })
              ])
          },
        comName: (h) => {
                    return h('div', [
                        h('span', '合作公司'),
                        h('Badge', {
                            props: {
                                count:'('+this.coopCorpData.length+')',
                            }
                        })
                    ])
        },
        otherName: (h) => {
                    return h('div', [
                        h('span', '外包邀请'),
                        h('Badge', {
                            props: {
                                count:'('+this.intivesData.length+')',
                            }
                        })
                    ])
        },
        searchData:null,
        stateData:5,
        stateList:[
            {value:'全部',index:5},
            {value:'待支付',index:0},
            {value:'征集中',index:1},
            {value:'待选稿件',index:2},
            {value:'招标成功',index:3},
            {value:'招标失败',index:4}
        ],
        testTaskData:[],
        //coopCorp
        sourceData:0,
        sourceList:[
            {value:'全部',index:0},
            {value:'手动添加',index:1},
            {value:'测试',index:2}
        ],
        coopCorpData:[],

        //companInvite
        intivesearch:null,
        intivesData:[],

        Details:true

      }
    },
    components:{
        testTask:testTask,
        coopCorp:coopCorp,
        companyInvite:companyInvite,
        mainNative:mainNative
    },
    mounted(){
        this.testTaskGet();
        this.coopCorpGet();
        this.companyInvite();
        this.$bus.on('submitOk',()=>{
           this.testTaskGet(this.stateData,this.searchData);
        });
        this.$bus.on('succeedCommit',()=>{
           this.coopCorpGet(this.sourceData,this.searchData);
        });
        this.$bus.on('inviteScuess',()=>{
           this.companyInvite();
        });
        this.$bus.on('showDetails',()=>{
            this.Details=false
        });
        this.$bus.on('callbackTest',()=>{
            this.Details=true;
        })
    },
    methods:{
    //   新增
      newAdd(){
          this.$refs.testTaskRef.newAdd();
      },
      newAddCoop(){
          this.$refs.coopCorpRef.newAdd();
      },
      newAddIntive(){
          this.$refs.companyIntive.newAdd();
      },
    //   切换
      application(name){

      },
    //   搜索
      search(){
         this.testTaskGet(this.stateData,this.searchData);
      },
      searchCoop(){
          this.coopCorpGet(this.sourceData,this.searchData);
      },
      intivesearchBtn(){
          this.companyInvite(this.intivesearch)
      },
    //  测试任务数据
      testTaskGet(status=this.stateData,search=this.searchData){
          let _this=this;
          _this.$Loading.start();
          let url=_this.GLOBAL.baseRouter+'task/company/get-test-list';
          let params={
              create_demand:1,
              status:status,
              search:search
          };
          _this.$axios.post(url,qs.stringify(params)).then(msg=>{
              _this.$Loading.finish();
              let htttpData = msg.data.data;
              let nowTime = new Date();
              for(let i=0;i<htttpData.length;i++){
                  let endStr = new Date(htttpData[i].bid_end_time).getTime();
                  let endTime = new Date(endStr);
                  let year = parseInt(endTime.getFullYear() - nowTime.getFullYear());
                  let month = parseInt((endTime.getMonth()+1) - (nowTime.getMonth()+1));
                  let day = parseInt(endTime.getDate() - nowTime.getDate());
                  htttpData[i].shengyuDay = year * 365 + month * 30 + day;
              }
              _this.testTaskData=htttpData;
          },()=>{
              _this.$Loading.error();
              _this.$Message.error("请求失败!")
          })
      },

    // 合作公司
    coopCorpGet(source=this.sourceData,search=this.searchData){
        let _this=this;
        _this.$Loading.start();
        let url=_this.GLOBAL.baseRouter+'task/company/cooperation-list';
        let params={
            demand_id:1,
            from:source,
            search:search
        }
        _this.$axios.post(url,qs.stringify(params)).then((msg)=>{
            if(msg.data.err_code==0){
                _this.$Loading.finish();
                _this.coopCorpData=msg.data.data;
            }
        })
    },

    // 外包邀请
    companyInvite(search=this.intivesearch){
        let _this=this;
        _this.$Loading.start();
        let url=_this.GLOBAL.baseRouter+'task/company/invite-list';
        let params={
            demand_id:1,
            search:search
        }
        _this.$axios.post(url,qs.stringify(params)).then(msg=>{
             if(msg.data.err_code==0){
                 _this.$Loading.finish();
                 _this.intivesData=msg.data.data;
            }
        })
    },
        referListFun(){
          this.testTaskGet();
        }
    },
    watch:{
        stateData(val){
            this.testTaskGet(val,this.searchData)
        },
        sourceData(val){
            this.coopCorpGet(val,this.searchData)
        }
    }
}
</script>
<style lang="less">
@import './epibolCompany/style/epibolCompany.less';
</style>
