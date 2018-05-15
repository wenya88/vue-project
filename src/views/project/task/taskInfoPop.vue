<!-- 任务信息弹窗-->
<template>
  <!-- <transition name="modal-fade"> -->
    <!-- <div class="modal-backdrop"> -->
      <!-- <div class="modal"> -->
    <div>
        <div class="modal-header">
            <Button type="text" icon="ios-star-outline" size="large"></Button>
            <Button type="text" @click="delTaskdeile" icon="trash-b" size="large"></Button>
        </div>
        <div class="modal-body">
          <Tabs type="card" style="height: 600px;">
            <TabPane label="基本管理">
                <div v-show="isInitTask">
                  <maintask ref="main" 
                            v-on:sendSubTaskList="sendSubTaskList"
                            v-on:sendLogData="sendLogData"
                  ></maintask>
                </div>
            </TabPane>
            <TabPane label="子任务">
                <subtasklist ref="sublist"></subtasklist>
            </TabPane>
            <TabPane label="日志">
                <tasklog ref="log"></tasklog>
            </TabPane>
          </Tabs>
        </div>
    </div>
      <!-- </div> -->
    <!-- </div> -->
  <!-- </transition> -->
</template>
<script>
var qs = require("querystring");
import maintask from "./taskDetails";
import subtasklist from "./subTask";
import tasklog from "./taskLog";

import {
  projectList,
  projDatali,
  cateList,
  deletetaskData,
  gettasklistDetails,
} from "@/config/env.js";

export default {
  props: [
    // "editData"
    "taskID"
    ],
  components:{
    maintask,
    subtasklist,
    tasklog
  },
  data() {
    return {
      taskId:0,
      editData:{},
      isInitTask:false,
      columnsTask: [
        {
          title: "子任务名称",
          key: "name",
          align: "center"
        },
        {
          title: "进度",
          align: "center",
          width: "300px",
          key: "plan",
          ellipsis: true,
          render: function(h) {
            let current = this.progress;
            return h(
              "Steps",
              {
                props: {
                  current: current,
                  size: "small"
                }
              },
              [
                h("Step", {
                  props: {
                    title: "1"
                  }
                }),
                h("Step", {
                  props: {
                    title: "2"
                  }
                }),
                h("Step", {
                  props: {
                    title: "3"
                  }
                }),
                h("Step", {
                  props: {
                    title: "4"
                  }
                }),
                h("Step", {
                  props: {
                    title: "5"
                  }
                })
              ]
            );
          }
        },
        {
          title: "操作",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.removeChild(params.index);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      subtaskData: [
        {
          subtaskName: "暂无名称",
          schedule: "暂无进度"
        }
      ],
      subData: [],
      handleUrl: [],
      fileUrl: [],
      setypeClass: [],
      pushSubData: {},
      project_child: "",
      list1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      formLeft: {}
    };
  },
  methods: {
    //根据任务ID初始化属性
    initTaskDetailFromID(id) {
      //console.log(id);
      this.isInitTask = true;
      this.$refs.main.initTaskDetailFromID(id);
    },
    //子任务子组件传参
    sendSubTaskList(data)
    {
      this.$refs.sublist.initSubTaskListData(data);
    },
    //日志子组件传参
    sendLogData(data)
    {
        this.$refs.log.inittaskLogData(data);
    },
    //保存所有的任务信息，包含子任务
    saveTaskDetail()
    {
      //保存父任务
      this.$refs.main.saveTaskDetails();
      //保存子任务
      this.$refs.sublist.saveSubTasks();
      return true;
    },
    //单击编辑Modal中子任务列表，数据添加至右侧form表单
    clickLine: function(index) {
      this.pushSubData = index;
    },
    //增加编辑Modal子任务模版
    addChildTask: function() {
      this.subData.push({
        name: "暂无名称",
        plan: "暂无进度"
      });
    },
    //子任务新增数据
    subSave: function() {
      let cIs = this;
      let dateForm = {};
      dateForm.father = cIs.editData.id;
      dateForm.name = cIs.pushSubData.name;
      dateForm.project = cIs.pushSubData.project_id;
      dateForm.project_child = cIs.pushSubData.project_child;
      dateForm.tasktype_id = cIs.pushSubData.tasktype_id
        ? cIs.pushSubData.tasktype_id
        : 0;
      dateForm.expect_start_time = cIs.pushSubData.expect_start_time;
      dateForm.expect_end_time = cIs.pushSubData.expect_end_time;
      dateForm.description = cIs.pushSubData.description;
      dateForm.image = JSON.stringify(cIs.handleUrl);
      dateForm.file = JSON.stringify(cIs.fileUrl)
        ? JSON.stringify(cIs.fileName)
        : 0;
      cIs.$axios
        .post("/task/task/add", qs.stringify(dateForm))
        .then(res => {
          if (res.data.err_code === 0) {
            cIs.$emit("close");
            this.forEachData();
            this.$Message.success("成功新增一条任务！");
          } else {
            this.$Message.error("新增任务失败，请重试！");
          }
        })
        .catch(error => {
          this.$Message.error("新增任务失败，请重试！");
        });
    },
    
    subChange(date) {
      this.pushSubData.expect_start_time = date;
    },
    subChange2(date) {
      this.pushSubData.expect_end_time = date;
    },
    close: function() {
      this.$emit("close");
    },
    //刪除任务
    delTaskdeile(index) {
      let cIs = this;
      let removeData = this.editData.id;
      this.get(
        deletetaskData,
        {
          id: removeData
        },
        () => {
          cIs.forEachData();
          cIs.$emit("close");
          cIs.$Message.success("删除成功");
        }
      );
    },
    //参与人选项卡
    memberList(index) {
      this.num = index;
    },
    /**
     * get请求
     */
    get(url, params, call) {
      /*获取列表信息*/
      this.$http.get(url, { params: params }).then(
        function(res) {
          call(res);
        },
        function(error) {
          this.$Message.error("数据加载出错了！请刷新浏览器");
        }
      );
    },
    //判断主任务是否包含子任务数据
    forEachData() {
      let cdy = this;
      let child = this.editData.child;
      if (child) {
        cdy.subData = child;
      }
    },
    //获取項目列表
    getProjectId() {
      let cHd = this;
      cHd.get(projectList, {}, res => {
        cHd.projectId = res.data.project;
        //遍历获取项目id
        cHd.projectId.forEach(id => {
          cHd.prId = id.id;
        });
        cHd.getChildId();
      });
    },
    //获取子项目id
    getChildId() {
      let Hid = this;
      Hid.get(
        projDatali,
        {
          id: Hid.prId
        },
        res => {
          //获取子项目列表
          Hid.childList = res.data.child;
          //获取项目id
          Hid.pushSubData.project_id = res.data.id;
        }
      );
    },
    //获取任务类型
    getTaskClass() {
      let clT = this;
      this.get(
        cateList,
        {
          company_id: 1
        },
        res => {
          clT.formLeft = res.data.data;
          for (let i = 0; i < clT.formLeft.length; i++) {
            this.setypeClass = clT.formLeft[i].tasktype;
          }
        }
      );
    },
    
    
    subChild(pName) {
      this.pushSubData.project_child = pName;
    },
    subClasst(TypeName) {
      this.pushSubData.tasktype_name = TypeName;
    },
    //删除子任务列表数据
    removeChild(index) {
      let cIs = this;
      let removeSubData = this.subData[index].id;
      this.get(
        deletetaskData,
        {
          id: removeSubData
        },
        () => {
          cIs.$Message.success("刪除子任务成功！");
          cIs.getProjectId();
        }
      );
      this.subData.splice(index, 1);
    }
  }
};
</script>
<style scoped>
@import "../style/taskModal.css";
.btn-close {
  position: absolute;
  margin-top: -15px !important;
}
</style>
