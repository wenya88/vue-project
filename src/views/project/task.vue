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
</style>

<template>
  <div>
    <taskclasses ref="classes" v-on:changeListData = 'changeListData'></taskclasses>
    <Tabs style="height: 536px;">
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
          :styles="{top: '20px'}"
          @on-ok="saveTaskInfoPop"
          :loading = "isSaveLoading"
          :closable="false"
          >
        <taskInfoPop ref="details" v-bind:taskID="taskId"></taskInfoPop>
    </Modal>
  </div>
  
</template>

<script>
import taskclasses from "./task/taskclasses";
import tasklist from "./task/tasklist";
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
        // console.log(this.$refs.list);
        this.$refs.list.forEachData(subType);
      },
      showTaskDetails(id)
      {
        //console.log(id);
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
        result = false;
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
      }
  }
};
</script>


