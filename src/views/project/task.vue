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
    <!-- 主视图:列表/甘特图 -->
    <Tabs style="height: 720px;" class="task-tab">
      <Tab-pane label="列表模式" icon="ios-list-outline">
        <tasklist ref="list" v-on:showTaskDetails = 'showTaskDetails' v-on:delTask="closeTaskDetails"></tasklist>
      </Tab-pane>
      <Tab-pane label="甘特图模式" icon="podium">
        <iframe id="show-iframe" frameborder=0 name="showHere" scrolling=auto src="../../../src/views/project/gantt/gantt.html"></iframe>
      </Tab-pane>
    </Tabs>
    <!-- 编辑任务组件 -->
    <Modal 
          v-model="isShowTaskDetails" 
          width="1200" 
          :styles="{top: '100px'}"
          :loading = "isSaveLoading"
          :closable="false"
          okText= '保存'
          cancelText='取消'
          @on-ok="saveTaskInfoPop"
          >
        <taskinfopop ref="details" 
                     v-bind:taskID="taskId"
                     v-on:refreshCurrentTaskList = 'refreshCurrentTaskList'
                     v-on:delTask="closeTaskDetails"
                     >
        </taskinfopop>
    </Modal>
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
import taskclasses from "./task/taskClasses";
import tasklist from "./task/taskList";
import taskinfopop from "./task/taskInfoPop";
import accretiontaskpop from "./task/accretionTaskPop";
import ExcelModal from "./components/excel"

export default {
  components: {
    taskclasses,
    tasklist,
    taskinfopop,
    accretiontaskpop,
    ExcelModal
  },
  data() {
    return {
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
  },
  methods: {
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
        this.isShowTaskDetails = true;
        this.isSaveLoading = true;
        this.taskId = parseInt(data.task_id);
        this.$refs.details.initTaskDetailProjecInfo(this.projectInfo);
        this.$refs.details.initTaskDetail(data);
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
      }
  }
};
</script>
<style>
.task{
  position:relative;
  margin:20px auto;
}
.task-tab{
    position:absolute;
    width:100%;
    z-index:1;
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

