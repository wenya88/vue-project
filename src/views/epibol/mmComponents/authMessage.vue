<template>
  <div class="authMessage">
    <div class="content">
      <div class="content-left">
        <div class="title">设置角色功能权限</div>
        <Tabs type="card" @on-click="changeTabs">
          <TabPane v-for="(tab,index) in tabList" :key="index" :label="tab.name" :name="tab.name">
            <auth-list :authList="tab.children"></auth-list>
          </TabPane>  
        </Tabs>
      </div>
      <div class="content-right">
        <div class="title">设置角色数据范围</div>
        <div class="tips">
          <div class="tips-message">
            <span>1</span>勾选"负责的任务"后，默认拥有所属子任务的权限
          </div>
          <div class="tips-message">
            <span>2</span>勾选"关联的任务"后，默认拥有所关联任务的权限
          </div>
         <div @click="close"><Icon type="close"></Icon></div>
        </div>
        <auth-tree :project="projectAuth" :bid="bidAuth" :contract="contractAuth"></auth-tree>
      </div>
    </div>
  </div>
</template>

<script>
var qs = require('querystring');
import { mapGetters } from 'vuex'
import authList from './authList.vue';
import authTree from './authTree.vue';
export default {
  name:'authMessage',
  components: {
    authList,
    authTree
  },
  props: {
    tabs: {
      type: Array,
      default: []
    },
    // authLists: {
    //   type: Array,
    //   default: []
    // }
  },
  data() {
    return {
      name: 'bbb',
      // tabs: [{
      //   name: '工作台'
      // }, {
      //   name: '招标'
      // }, {
      //   name: '合同'
      // }],
      authLists: [{
        status: true,
        modelName: '我的任务清单',
        modelMessage: '拥有管理的权限的成员，可对任务进行(开启任务，上传文件，查看任务详情等操作)'
      }],
      tabList: [],
      authlist: [],
      bidAuth: [],
      contractAuth: [],
      projectAuth: []
    }
  },
  mounted() {
    this.changeType();
  },
  methods: {
    changeTabs(name) {  //根据name的不同加载不同的权限列表
      // console.log(name)
    },
    close(){
     let tips= document.querySelectorAll('.tips')
     tips[0].style.display="none";
    //  console.log(tips)
    },
    changeType() {
      let project = [],bid = [],contract = []
      this.$bus.on("changeAuth", (val,list) => {
        for(let i=0;i<list.length;i++){
          if(list[i].id==val){
            this.tabList=list[i].auth;
            // project.push(list[i].project_auth.name);
            // bid.push(list[i].bid_auth.name);
            // contract.push(list[i].contract_auth.name);
            // // const arr = [1, 1, 2, 2, 3, 4, 5, 5];
            // this.projectAuth = [...new Set(project)];
            // this.bidAuth = [...new Set(bid)];
            // this.contractAuth = [...new Set(contract)];
            // console.log(this.tabList, this.projectAuth, this.bidAuth, this.contractAuth)
          }
        }
      })
    }
  },
  updated() {
    this.changeType();
  }
 
}
</script>

<style scoped lang="less">
.authMessage{
  .content{
    float: left;
    .content-left{
      float: left;
      width: 70%;
      padding-left: 50px;
      border-right: 1px solid #e4e4e4;
      border-left: 1px solid #e4e4e4;
      background: #fff;
      .title{
        height: 50px;
        line-height: 50px;
        background: #C4F0E9;
        margin-bottom: 20px;
        margin-left: -50px;
        padding-left: 50px;
        font-size: 18px;
      }
      .ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-nav-wrap{
        height: 34px;
        line-height: 17px;
        margin-top: 0;
      }
      .ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab{
        margin-right: 0;
        border: none;
        width: 50px;
        text-align: center;
      }
    }
    .content-right{
      width: 28%;
      float: left;
      margin-left: 20px;
      background: #fff;
      .title{
        height: 50px;
        line-height: 50px;
        background: #C4F0E9;
        margin-bottom: 20px;
        padding-left: 30px;
        font-size: 18px;
        
      }
      .tips{
        margin: 10px;
        border: 1px solid #ffeeac;
        background: #fff7eb;
        padding: 30px 40px 30px 32px;
        position: relative;
        .tips-message{
          :first-child{
            margin-bottom: 10px;
          }
          span{
            display: block;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            float: left;
            background: #ff9900;
            text-align: center;
            color: #fff;
            margin-right: 3px;
          }
          
        }
        .ivu-icon-close{
          position:absolute;
          top: 10px;
          right: 10px;
          color: #FDA692;
        }
      }
    }
  }
}
</style>
<style lang="less">
.authMessage{
    .ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-nav-wrap{
        height: 34px;
        line-height: 17px;
        margin-top: 0;
    }
    .ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab{
        margin-right: 0;
        border: none;
        width: 80px;
        text-align: center;
        background: #fff;
        margin-right: 20px;
        border-bottom: none !important;
    }
    .ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab-active{
      background: #31bb9f;
      color: #fff;
    }
}
</style>

