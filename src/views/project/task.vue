<!-- 项目-任务页面-->
<template>
  <div class="task">
    <taskclasses ref="classes" v-on:changeListData = 'changeListData'></taskclasses>
    <div class="task-operation">
      <Button type="success" size="large" @click="showAccretionTask">新增任务</Button>
      <Button type="primary" size="large" @click="showExcelTask">Excle导入</Button>
    </div>
    <Tabs style="height: 720px;" class="task-tab">
      <Tab-pane label="列表模式" icon="ios-list-outline">
        <tasklist ref="list" v-on:showTaskDetails = 'showTaskDetails'></tasklist>
      </Tab-pane>
      <Tab-pane label="甘特图模式" icon="podium">
        <iframe id="show-iframe" frameborder=0 name="showHere" scrolling=auto src="../../../src/views/project/gantt/gantt.html"></iframe>
      </Tab-pane>
    </Tabs>
    <Modal 
          v-model="isShowTaskDetails" 
          width="1200" 
          :styles="{top: '150px'}"
          :loading = "isSaveLoading"
          :closable="false"
          okText= '保存'
          cancelText='取消'
          @on-ok="saveTaskInfoPop"
          >
        <taskInfoPop ref="details" v-bind:taskID="taskId"></taskInfoPop>
    </Modal>
    <!-- excel解析modal组件 -->
    <excel-modal v-if="isExcelTask" ></excel-modal>
    <!-- 新增任务modal组件 -->
    <addform-modal v-if="isAccretionTask"></addform-modal>
  </div>
  
</template>

<script>
import taskclasses from "./task/taskClasses";
import tasklist from "./task/taskList";
import taskInfoPop from "./task/taskInfoPop";

export default {
  components: {
    taskclasses,
    tasklist,
    taskInfoPop,
  },
  data() {
    return {
      isShowTaskDetails:false,
      isSaveLoading:true,
      taskId:0,
      isExcelTask: false,
      isAccretionTask: false,
    };
  },
  mounted() {
    // this.autoH();
  },
  methods: {
      autoH() {
        let oIframe = document.getElementById("show-iframe");
        let deviceHeight = document.documentElement.clientHeight - 190;
        oIframe.style.width = 100 + "%";
        oIframe.style.height = deviceHeight + "px";
      },
      changeListData(subType){
        this.$refs.list.forEachData(subType);
      },
      showTaskDetails(id)
      {
        this.isShowTaskDetails = true;
        this.isSaveLoading = true;
        this.taskId = id;
        this.$refs.details.initTaskDetailFromID(id);
      },
      //编辑后关闭modal
      closeTaskDetails() {
        this.isShowTaskDetails = false;
      },
      //保存任务信息弹窗
      saveTaskInfoPop()
      {
        let result = this.$refs.details.saveTaskDetail();
        if(result)
        {
          //this.isSaveLoading = false;
          this.isSaveLoading = false;
          this.isShowTaskDetails = false;
          this.$Message.success('保存任务成功');
        }
        else
        {
            setTimeout(() => {
                this.isSaveLoading = false;
                this.isShowTaskDetails = false;
                this.$Message.success('保存任务成功');
                }, 1000);
        }
      },
      //EXCEL添加
      showExcelTask: function() {
        this.isExcelTask = true;
      },
      //添加任务
      showAccretionTask: function(index) {
        this.isAccretionTask = true;
      },
  }
};
</script>
<style>
.taskHead {
  border: 1px solid #ddd;
  background: #f7f7f7;
  padding: 10px 10px;
  font-size: 14px;
  margin-bottom: 10px;
}

.taskHead .taskInfo {
  float: left;
}

.taskHead .taskInfo b {
  color: #555;
}

.taskHead .taskInfo span {
  margin-left: 30px;
}

.taskHead .taskInfo .active {
  padding: 4px 8px;
  border-radius: 4px;
  background: #3399ff;
  color: #fff;
}

.taskHead .taskInfo .active:hover {
  color: #fff;
}
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

