<template>
  <div class="bidManage">
      <main-native>
          <div class="main-header-style iconfont"><i></i>{{this.$route.meta.title}}</div>
      </main-native>
     <Tabs @on-click="application" :animated="false">
          <!-- 合作公司 -->
          <TabPane :label="comName" name="coopCom">
                <div class="fileCondition">
                    <em class="newAdd">
                        <Button type="success" size="small" @click.native="newAddCoop"><Icon type="plus"></Icon> 添加公司</Button>
                    </em>
                    <em>
                        <Select v-model="sourceData" size="small" style="width:80px">
                            <Option v-for="item in sourceList" :value="item.index" :key="item.index">{{ item.value }}</Option>
                        </Select>
                    </em>
                    <em>
                        <Input v-model="searchData" size="small" style="width:200px;margin-top:-1px;" placeholder="公司名称/联系人/电话/擅长" @keyup.13.native="searchCoop">
                            <Button slot="append" icon="ios-search" size="small" @click.native="searchCoop"></Button>
                        </Input>
                    </em>
                    <div class="clear"></div>
                </div>
                <coop-corp :coopCorpData="coopCorpData" ref="coopCorpRef"></coop-corp>
          </TabPane>
          <!-- 测试任务 -->
          <TabPane :label="testName" name="testTask">
              <div class="fileCondition">
                <em class="newAdd">
                    <Button type="success" size="small" @click.native="newAdd"><Icon type="plus"></Icon> 新增</Button>
                </em>
                <em>
                    <Select v-model="stateData" size="small" style="width:80px">
                        <Option v-for="item in stateList" :value="item.index" :key="item.index">{{ item.value }}</Option>
                    </Select>
                </em>
                <em>
                    <Input v-model="searchData" size="small" style="width:200px;margin-top:-1px;" placeholder="输入任务名称" @keyup.13.native="search">
                        <Button slot="append" icon="ios-search" size="small" @click.native="search"></Button>
                    </Input>
                </em>
                <div class="clear"></div>
            </div>
            <test-task :testTaskData='testTaskData' ref="testTaskRef"></test-task>
          </TabPane>
          <!-- 外包邀请 -->
          <TabPane :label="otherName" name="otherInvite">
                 <div class="fileCondition">
                    <em class="newAdd">
                        <Button type="success" size="small" @click.native="newAddIntive"><Icon type="plus"></Icon> 新增</Button>
                    </em>
                    <em>
                    <Input v-model="intivesearch" size="small" style="width:200px;margin-top:-1px;" placeholder="输入任务名称" @keyup.13.native="intivesearchBtn">
                        <Button slot="append" icon="ios-search" size="small" @click.native="intivesearchBtn"></Button>
                    </Input>
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
export default {
    data(){
      return{
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
        intivesData:[]

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
        })
        this.$bus.on('succeedCommit',()=>{
           this.coopCorpGet(this.sourceData,this.searchData);
        })
        this.$bus.on('inviteScuess',()=>{
           this. companyInvite();
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
              _this.testTaskData=msg.data.data
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
