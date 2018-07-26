<template>
  <div class="authMessage">
    <div class="content">
      <div class="content-left">
        <div class="title">设置角色功能权限</div>
        <Tabs type="card" @on-click="changeTabs">
          <TabPane v-for="(tab,index) in tabs" :key="index" :label="tab.name" :name="tab.name">
            <auth-list :authList="authList"></auth-list>
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
        </div>
        <auth-tree></auth-tree>
      </div>
    </div>
  </div>
</template>

<script>
import authList from './authList.vue';
import authTree from './authTree.vue';
export default {
  name:'authMessage',
  components: {
    authList,
    authTree
  },
  data() {
    return {
      name: 'bbb',
      tabs: [{
        name: '工作台'
      }, {
        name: '招标'
      }, {
        name: '合同'
      }],
      authList: [{
        status: true,
        modelName: '我的任务清单',
        modelMessage: '拥有管理的权限的成员，可对任务进行(开启任务，上传文件，查看任务详情等操作)'
      }]
    }
  },
  methods: {
    changeTabs(name) {  //根据name的不同加载不同的权限列表
      console.log(name)
    }
  }
}
</script>

<style scoped lang="less">
.authMessage{
  .content{
    float: left;
    .content-left{
      float: left;
      width: 75%;
      padding-left: 50px;
      border-right: 1px solid #e4e4e4;
      border-left: 1px solid #e4e4e4;
      .title{
        height: 36px;
        line-height: 36px;
        background: rgba(228, 228, 228, 0.6);
        margin-bottom: 20px;
        margin-left: -50px;
        padding-left: 50px;
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
      width: 24.9%;
      float: left;
      .title{
        height: 36px;
        line-height: 36px;
        background: rgba(228, 228, 228, 0.6);
        margin-bottom: 20px;
        padding-left: 30px;
      }
      .tips{
        margin: 10px;
        border: 1px solid #ffeeac;
        background: #fff7eb;
        padding: 10px;
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

