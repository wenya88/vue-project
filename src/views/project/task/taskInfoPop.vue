<!-- 任务信息弹窗-->
<template>
    <div class="taskinfopop" >
        <Tabs type="card" >
            <TabPane label="基本管理" style="height: 800px;overflow-y: auto">
                <div v-show="isInitTask" class="browsetaskpop">
                    <div class="filebrowse" :class="$route.query.type === 'taskManagement'?'filebrowseContainer':''"  >
                        <filebrowse ref="filebrowse"></filebrowse>
                    </div>
                    <div   :class="$route.query.type === 'taskManagement'?'taskManagement':'taskbrowse'" >
                        <maintask ref="main"
                                  v-on:sendSubTaskList="sendSubTaskList"
                                  v-on:sendLogData="sendLogData"
                                  taskManagement="true"
                                  v-on:subtask='getSubtaskInfo'
                        >
                        </maintask>
                    </div>
                </div>
            </TabPane>
            <TabPane label="子任务" style="height: 800px;overflow-y: auto">
                <subtasklist :subtaskInfoData="subtaskInfo" ref="sublist"></subtasklist>
            </TabPane>
            <TabPane label="日志" style="height: 800px;overflow-y: auto">
                <tasklog ref="log"></tasklog>
            </TabPane>
        </Tabs>
        <div class="taskButton">
            <router-link to="/project/task" tag="button" >返回</router-link>
            <button @click="saveTaskDetail" style="background: #39f;color: #fff">保存</button>
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
import filebrowse from "../components/fileBrowseManager";

import {
  cateList,
  deletetaskData,
} from "@/config/env.js";

export default {
  props: [
    "taskID"
    ],
  components:{
    maintask,
    subtasklist,
    tasklog,
    filebrowse
  },
    mounted(){
        this.initTaskDetail();
        this.initTaskDetailProjecInfo();
    },
  data() {
    return {
        subtaskInfo:null,
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
    initTaskDetail() {

        if(!this.$store.state.project.detail.setDetailAll){
            this.$router.push({path:'/project/task'})
        }
        let taskData = this.$store.state.project.detail.setDetailAll;
        this.isInitTask = true;
        if (taskData) {
            this.$refs.main.initTaskDetailFromID(taskData.id);
            let filetype = taskData.stage_file ? taskData.stage_file.type : "NULL";
            this.$refs.filebrowse.initFileBrowse(taskData.id, filetype);
        }


    },
    //初始化项目信息
    initTaskDetailProjecInfo()
    {

        let data = this.$store.state.project.detail.projectInfo;
        this.$refs.main.initProjectInfo(data);
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
      this.$refs.main.saveTaskDetails(true);
      //保存子任务
      this.$refs.sublist.saveSubTasks();

      this.$Message.success('保存成功');
      return true;
    },
    //单击编辑Modal中子任务列表，数据添加至右侧form表单
    clickLine: function(index) {
      this.pushSubData = index;
    },
    //刪除任务
    delTask() {
      this.$refs.main.delTaskDetail();
      this.$emit("delTask");
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
    },
      getSubtaskInfo(data){
        console.log(313,data)
          this.subtaskInfo = data
      }
  }
};
</script>
<style lang="less" >
@import "../style/taskModal.css";
@gray:#E6EAEB;
.taskinfopop{
    .taskManagement{
        float: left;
        padding: 0!important;
        margin: 0 !important;
        width: 304px!important;
    }
  .taskbrowse{
    float:left;
    width:540px !important;
    padding-right: 200px;
    margin:0 12px 0 0;
  }
  display:inline-block;
  overflow:hidden;
    .ivu-tabs-bar{
        .ivu-tabs-nav-container{
            height: 55px !important;
        }
       .ivu-tabs-tab{
           height: 32px !important;
            line-height: 32px !important;
        }
    }

    .ivu-form-item{
        /*&:hover{*/
            /*.ivu-form-item-label{*/
                /*top:0 ;*/
            /*}*/
        /*}*/
    }
    .ivu-date-picker{
        width: 100%;
    }
    .ivu-input-group-prepend{
        font-size: 22px;
        background: transparent;
        border: none;
        border-bottom: 1px solid #ccc;
    }
    .ivu-input,.ivu-select-selection{
        background: transparent;
        border: none;
        border-bottom: 1px solid #ccc;
        outline: none;
        box-shadow: none;
        &:focus,&:hover{
            border-bottom: 1px solid #ccc;
            box-shadow: none;

        }
    }
    .ivu-select-visible, .ivu-select-selection{
        border-bottom: 1px solid #ccc !important;
        outline: none !important;
        box-shadow: none !important;
    }
    .ivu-form-item{
        position: relative;
        .ivu-form-item-label{
            margin-left: 66px;
            text-align: left;
        }
    }
    .requirement {
        padding: 5px 10px 70px 10px;
        background: #fff;
        .ivu-card {
            background: transparent;
            border: none;
            .ivu-card-body {
                padding: 16px 0;
            }
            &:hover {
                box-shadow: none;
            }
        }
        .ivu-input {
            padding-right: 0;
            font-size: 20px;
            text-align: right;
        }
        .ivu-input-icon {
            left: 0;
            font-size: 20px;
        }
        p {
            display: flex;
            height: 22px;
            margin-bottom: 10px;
            padding: 0 5px;
            font-size: 14px;
            line-height: 22px;
            justify-content: space-between;
            border-radius: 8px;
            background: @gray;
        }
    }
    .ivu-upload-list{
        width: 100%;
        border-bottom: 1px solid #ccc;
    }

    .taskButton{
        padding-right: 120px;
        text-align: right;
        button{
            width: 110px;
            height: 35px;
            margin-right: 30px;
            text-align: center;
            line-height:35px;
            color: #657180;
            background: #fff;
            border: 1px solid #e4e4e4;
            border-radius: 4px;
            box-shadow: 2px 2px 2px 0 #e4e4e4;
            cursor: pointer;
            outline: none;
            &:active{
                transform: translate3d(2px,2px,0);
            }
        }
    }
}
.task-body {
  width:1100px;
  padding: 0 0 0 0px;
}
.task-option {
  width:60px;
  padding: 0 0 0 20px;
}
.browsetaskpop {

}

.filebrowse{
    float:left;
    width:800px;
    height: 400px;
}
    .filebrowseContainer{
        width: 1200px !important;
        margin: 60px;
    }
</style>
