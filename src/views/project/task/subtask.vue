<!-- 子任务组件 -->
<template>
    <div class="subtask">
      <Button v-if="!userStatus" type="success" size="large" @click="showAccretionTask">添加子任务</Button>
      <!--列表-->
      <tasklist subtask="true" ref="list"
      v-on:editWindow="showTaskDetails"
      ></tasklist>
      <!-- 新增任务组件 -->
      <Modal
              v-model="isAccretionTask"
              width="600"
              :styles="{top: '150px'}"
              :loading = "isSaveLoading"
              :closable="false"
              okText= '保存'
              cancelText='取消'
              @on-ok="saveAccretionTaskPop(true)"
      >
        <accretiontaskpop ref="add"
                          v-on:refreshCurrentTaskList = 'refreshCurrentTaskList'
        >
        </accretiontaskpop>
      </Modal>

      <!-- 编辑任务组件 -->
      <Modal
              v-model="isShowTaskDetails"
              width="600"
              :styles="{top: '150px'}"
              :loading = "isSaveLoading"
              :closable="false"
              okText= '保存'
              cancelText='取消'
              @on-ok="saveAccretionTaskPop(false)"
      >
        <!--<maintask ref="main"-->
                  <!--v-on:sendSubTaskList="sendSubTaskList"-->
                  <!--v-on:sendLogData="sendLogData"-->
                  <!--taskManagement="true"-->
                  <!--v-on:subtask='getSubtaskInfo'-->
        <!--&gt;</maintask>-->
        <h1>编辑任务</h1>
          <maintask subtask="true" ref="main"></maintask>
      </Modal>



    </div>
</template>
<script>
  import {mapState} from 'vuex'
    import accretiontaskpop from "./accretionTaskPop";
    import tasklist from "./tasklist";
    import maintask from "./taskDetails";
  export default {
      mounted(){
          this.$bus.on('refreshCurrentTaskList',()=>{
              this.refreshCurrentTaskList();
          });

      },
      data(){
          return{
              isSaveLoading: true,
              isAccretionTask:false,
              isSaveLoading: true,
              isShowTaskDetails:false,
          }
      },
      methods:{
          //添加弹窗
          showAccretionTask(index) {
              this.isAccretionTask = true;
              this.$refs.add.accretionTaskPop();
          },
//          // 添加
          saveAccretionTaskPop(boole)
          {
              let result = null;
              if(boole){
                   result = this.$refs.add.saveTaskDetail(this.primaryMission.id);
              }else{
                   result = this.$refs.main.saveTaskDetails(true);
              }

              if(result)
              {
                  this.isShowTaskDetails = false;
                  this.isSaveLoading = false;
                  this.isAccretionTask = false;
                  this.$Message.success('任务保存成功');
//                  this.$refs.add.clearAllData()
              }
              else
              {
                  setTimeout(() => {
                      this.isSaveLoading = false;
                      this.isAccretionTask = false;
//                      this.$Message.success('创建任务失败');
                  }, 1000);
              }
          },
          //刷新当前任务列表
          refreshCurrentTaskList()
          {
              this.$refs.list.refreshTaskList();

          },
          // 编辑弹窗
          showTaskDetails(taskData){
              this.isShowTaskDetails = true;
              this.$refs.main.initTaskDetailFromID(taskData.id); // 加载表单数据
          },

      },
      computed:{
          ...mapState({
              primaryMission(state){
                  return state.project.primaryMission
              },
              userStatus(value){
                  return value.project.userStatus
              }
          })
      },
      components:{
          accretiontaskpop,
          tasklist,
          maintask
      }
  }
</script>
<style lang="less">

/*@import "../../../styles/task/task.css";*/
/*td.ivu-table-expanded-cell {*/
  /*padding: 0 !important;*/
/*}*/
/*.table_border .ivu-table-wrapper {*/
  /*border: 0;*/
/*}*/
/*.sub-header .ivu-table-header {*/
  /*display: none;*/
/*}*/
/*.subtask{*/
  /**/
  /*display:inline-block;*/
  /*overflow:hidden;*/
/*}*/
/*.subtask-left{*/
  /*width:262px;*/
  /*float:left;*/
  /*padding: 0 20px 0 0;*/
/*}*/
/*.subtask-right{*/
  /*width:300px;*/
  /*float:left;*/
  /*padding: 0 0 0 20px;*/
/*}*/
</style>