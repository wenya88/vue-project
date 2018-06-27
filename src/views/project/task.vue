<!-- 项目-任务页面-->
<template>
  <div class="task">
    <taskclasses ref="classes"
                 v-on:changeTaskListData = 'changeTaskListData'
                 v-on:setProjectInfo = 'setProjectInfo'
                 >
    </taskclasses>
    <div class="task-operation">
      <Button type="success" size="large" @click="showAccretionTask">新增任务</Button>
      <Button type="primary" size="large" @click="showExcelTask">Excle导入</Button>
    </div>
      <div class="taskMainContainer">
          <!--项目进度-->
          <div class="projectPlanRight">
              <div class="rightTitle">
                  <Icon type="android-apps" size="20"></Icon>
                  子项目进度
              </div>
              <div class="rightRow">
                  <div class="line" v-for="item in ChildMsgData">
                      <div class="title">{{item.name}}</div>
                      <div class="lineRow">
                          <Progress :percent="Number(item.progress)"><span>{{item.complete}}/{{item.total}}</span>
                          </Progress>
                      </div>
                      <div class="clear"></div>
                  </div>
              </div>
              <div class="rightTitle" style="border-top:0px;margin-top:15px;">
                  <Icon type="android-apps" size="20"></Icon>
                  成员进度
              </div>
              <div class="rightRow">
                  <div class="line" v-for="item in memberMsgData">
                      <div class="title">
                          <div class="demo-avatar">
                              <Avatar src="https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar"
                                      size="small"/>&nbsp;&nbsp;{{item.realname}}
                          </div>
                      </div>
                      <div class="lineRow">
                          <Progress :percent="Number(item.progress)"><span>{{item.complete}}/{{item.task_num}}</span>
                          </Progress>
                      </div>
                      <div class="clear"></div>
                  </div>
              </div>
          </div>

           <!--主视图:列表/甘特图 -->
          <Tabs  class="task-tab">
              <Tab-pane label="列表模式" icon="ios-list-outline">
                  <tasklist ref="list" v-on:showTaskDetails='showTaskDetails'
                            v-on:delTask="closeTaskDetails"></tasklist>
              </Tab-pane>
              <Tab-pane  label="甘特图模式" icon="podium">
                  <iframe id="show-iframe" frameborder=0  name="showHere" scrolling=auto
                          src="../../../src/views/project/gantt/gantt.html"></iframe>
              </Tab-pane>
              <Tab-pane  label="进度" icon="podium">
                  <v-schedule-plan>123</v-schedule-plan>
              </Tab-pane>
          </Tabs>
      </div>

    <!-- 编辑任务组件 -->
    <!--<Modal-->
          <!--v-model="isShowTaskDetails"-->
          <!--width="1200"-->
          <!--:styles="{top: '100px'}"-->
          <!--:loading = "isSaveLoading"-->
          <!--:closable="false"-->
          <!--okText= '保存'-->
          <!--cancelText='取消'-->
          <!--@on-ok="saveTaskInfoPop"-->
          <!--&gt;-->
        <!--<taskinfopop ref="details"-->
                     <!--v-bind:taskID="taskId"-->
                     <!--v-on:refreshCurrentTaskList = 'refreshCurrentTaskList'-->
                     <!--v-on:delTask="closeTaskDetails"-->
                     <!--&gt;-->
        <!--</taskinfopop>-->
    <!--</Modal>-->

    <!-- 新增任务组件 -->
    <Modal
           v-model="isAccretionTask"
           width="600"
           :styles="{top: '150px'}"
           :loading = "isSaveLoading"
           :closable="false"
           okText= '保存'
           cancelText='取消'
           @on-ok="saveAccretionTaskPop"
      >
      <accretiontaskpop ref="add"
                        v-on:refreshCurrentTaskList = 'refreshCurrentTaskList'
                        >
      </accretiontaskpop>
    </Modal>
    <!-- excel解析组件 -->
    <Modal v-model="isExcelTask" width="1200" @on-cancel="excelCancel">
      <p slot="header">
        <span>批量导入任务</span>
      </p>
      <div>
        <excel-modal ref="upload"></excel-modal>
      </div>
      <div slot="footer" style="height:20px;"></div>
    </Modal>
    <!-- <excel-modal v-if="isExcelTask" ></excel-modal> -->
  </div>

</template>

<script>
import {mapMutations} from 'vuex'
import qs from 'querystring'
import taskclasses from "./task/taskClasses";
import tasklist from "./task/taskList";
import taskinfopop from "./task/taskInfoPop";
import accretiontaskpop from "./task/accretionTaskPop";
import ExcelModal from "./components/excel"
import vSchedulePlan from "./schedule"

export default {
  components: {
    taskclasses,
    tasklist,
    taskinfopop,
    accretiontaskpop,
    ExcelModal,
      vSchedulePlan
  },
  data() {
    return {
        ChildMsgData:[],
        memberMsgData:[],
      isShowTaskDetails:false,
      isSaveLoading:true,
      taskId:0,
      isExcelTask: false,
      isAccretionTask: false,
      projectInfo:{}
    };
  },
  mounted() {
    this.autoH();
    this.initTaskMain();
    this.$bus.on('refreshCurrentTaskList',()=>{
        this.refreshCurrentTaskList();
    });
    this.projectPlan()
  },
  methods: {
      ...mapMutations(['setProjectInfoDetails','setDetailAll']),
      excelCancel(){
        this.$bus.emit('clearExcleData')
      },
      autoH() {
        let oIframe = document.getElementById("show-iframe");
        let deviceHeight = document.documentElement.clientHeight - 190;
        oIframe.style.width = 100 + "%";
        oIframe.style.height = deviceHeight + "px";
      },
      //初始化任务相关参数
      initTaskMain()
      {
        sessionStorage.TaskID = 0;
      },
      //改变任务列表
      changeTaskListData(subType){
        this.$refs.list.initTaskListFromId(subType);
      },
      //刷新当前任务列表
      refreshCurrentTaskList()
      {
        this.$refs.list.refreshTaskList();
        this.$refs.classes.getProjectChildInfo();
      },
      //显示任务详情
      showTaskDetails(data)
      {
//        this.isShowTaskDetails = true;
//        this.isSaveLoading = true;
//        this.taskId = parseInt(data.task_id);

//        this.$refs.details.initTaskDetailProjecInfo(this.projectInfo);
//        this.$refs.details.initTaskDetail(data);

        this.setProjectInfoDetails(this.projectInfo);
        this.setDetailAll(data);
        this.$router.push({path:'/project/details'})
      },
      //编辑后关闭modal
      closeTaskDetails() {
        this.isShowTaskDetails = false;
      },
      //保存编辑任务信息弹窗
      saveTaskInfoPop()
      {
        let result = this.$refs.details.saveTaskDetail();
        if(result)
        {
          this.isSaveLoading = false;
          this.isShowTaskDetails = false;
          this.$Message.success('保存任务成功');
        }
        else
        {
            setTimeout(() => {
                this.isSaveLoading = false;
                this.isShowTaskDetails = false;
                this.$Message.success('保存任务失败');
                }, 1000);
        }
      },
      //保存新建任务弹窗
      saveAccretionTaskPop()
      {
        let result = this.$refs.add.saveTaskDetail();
        if(result)
        {
          this.isSaveLoading = false;
          this.isAccretionTask = false;
          this.$Message.success('创建任务成功');
        }
        else
        {
            setTimeout(() => {
                this.isSaveLoading = false;
                this.isAccretionTask = false;
                this.$Message.success('创建任务失败');
                }, 1000);
        }
      },
      //EXCEL添加
      showExcelTask() {
        this.isExcelTask = true;
        this.$refs.upload.isShowPage(true)
      },
      //添加任务
      showAccretionTask(index) {
        this.isAccretionTask = true;
        this.$refs.add.accretionTaskPop(this.projectInfo);
      },
      //初始化任务列表的项目信息
      setProjectInfo(projectInfo)
      {
        this.projectInfo = projectInfo;
      },
      projectPlan() {
          let projectID=sessionStorage.projectID;
          let ProjectProgess=this.$axios.get(this.GLOBAL.baseRouter+"/task/total/project-progress&project_id="+projectID);
          let ChlidProjectProgess=this.$axios.get(this.GLOBAL.baseRouter+"/task/total/child-project-progress&project_id="+projectID);
          let MemberProgess=this.$axios.get(this.GLOBAL.baseRouter+"/task/total/member-progress&project_id="+projectID);
          this.$axios.all([ProjectProgess,ChlidProjectProgess,MemberProgess]).then(([msg,childMsg,memberMsg])=>{

              // 项目进度
              let MsData=msg.data.data;
//              this.proPanData=Math.round(MsData.project_progress);
//              this.ProTiemDate=Math.round(MsData.time_progress);
//              this.ProFinhData=Math.round(MsData.will_finish);
//              this.ProSytsData=Math.ceil(MsData.syts);
//              this.ProTaskData=MsData.tasking_num;
//              this.ProPauseNum=MsData.pause_num;

              // 子项目进度
              this.ChildMsgData=childMsg.data.data;

              // 成员进度
              this.memberMsgData=memberMsg.data.data;
          },()=>{
              console.log("请求失败")
          })

      },
      _ajax(url,data){
          return this.$axios.post(this.GLOBAL.baseRouter+url,qs.stringify(data))
      },
  }
};
</script>
<style lang="less" >
.task{
  position:relative;
  margin:20px auto;
    .taskMainContainer{
        display: flex;
        margin-top: 50px;
    }
}
.task-tab{
    position:absolute;
    width:100%;
    z-index:1;
    overflow-x: hidden !important;
    overflow-y: auto !important;
}
.task-operation{
    position:absolute;
    width:220px;
    height:60px;
    /* text-align:right; */
    float:right;
    right: -10px;
    padding: 4px 10px 10px 24px;
    z-index:2;
}
</style>

