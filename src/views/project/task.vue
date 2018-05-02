<template>
  <div>
    <Tabs>
      <Tab-pane label="列表模式" icon="ios-list-outline">
        <task></task>
      </Tab-pane>
      <Tab-pane label="甘特图模式" icon="podium">
        <iframe id="show-iframe" frameborder=0 name="showHere" scrolling=auto src="../../../src/views/project/gantt/gantt.html"></iframe>
      </Tab-pane>
    </Tabs>
  </div>
</template>

<script>
import task from "../project/task/task";
export default {
  components: {
    task: task
  },
  data() {
    return {};
  },
  mounted() {
    this.autoH();
  },
  methods: {
    autoH() {
      let oIframe = document.getElementById("show-iframe");
      let deviceHeight = document.documentElement.clientHeight - 190;
      oIframe.style.width = 100 + "%";
      oIframe.style.height = deviceHeight + "px";
    }
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
</style>
