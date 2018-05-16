<!-- 子任务组件 -->
<template>
    <div class="subtask">
      <div class="subtask-left">
        <Button type="text" @click="addSubTask" size="small">添加子任务</Button>
        <Table 
          :columns="subColumns" 
          :data="subTaskListData" 
          size="small" 
          width='262'
          highlight-row
          ref="sublist"
          @on-current-change="changeSubTask"
        >
        </Table>
      </div>
      <div class="subtask-right">
        <Button type="text">删除子任务</Button>
        <subtask ref="subtaskinfo"></subtask>
      </div>
    </div>
</template>
<script>
import {
  deletetaskData,
  gettasklistDetails
} from "@/config/env.js";
var qs = require("querystring");
import editSubmodal from "./editSubmodal";
import subtask from "./taskDetails"

export default {
  components: { 
    editSubmodal,
    subtask
    },
  props: {
    //subTaskList: Object
  },
  data() {
    return {
      fatherTaskData:{},
      subTasks:[],//子任务内容
      subTaskListData:[],//子任务列表
      subColumns: [//子任务标题
        {
          title: "任务名",
          key: "name",
          align: "left",
          ellipsis: true,
          width: 120
        },
        {
          title: "状态",
          key: "status",
          align: "right",
          width: 80
        },
        {
          title: "操作",
          key: "add_subtask",
          align: "right",
          width: 60,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    marginLeft: "-8px"
                  },
                  on: {
                    click: () => {
                      this.delSubtask(params.index);
                    }
                  }
                },
                "删除"
              ),
            ]);
          }
        },
      ],
      //
      localLastSubList:{},
      localLastSubTask:{},
      init_new:false,//是否首次增加
      initAmount:0,
    };
  },
  created() {
    // this.forEachSubData();
    // this.getforechDailt();
  },
  methods: {
    //初始化
    initSubTaskListData(Data)
    {
        this.fatherTaskData = Data;
        this.subTaskListData = Data.child;
        this.subTasks=[];
        this.initAmount = this.subTaskListData.length;
        //this.subTaskListData=[];
        this.localLastSubList={};
        this.localLastSubTask={};
    },
    //关闭modal
    closeSubListmodal() {
      this.isubListModal = false;
    },
    showSubListmodal: function(rq) {
      this.isubListModal = true;
      this.getforechDailt(rq.id);
    },
    //添加子任务
    addSubTask()
    {
      if(this.init_new)
      {
          if(this.localLastSubTask.tasktype_id == 0 ||
             this.localLastSubTask.expect_start_time =="" ||
             this.localLastSubTask.expect_end_time ==""
          )
          {
              return false;
          }
      }
      //初始化子任务列表
      let subListObj = {
        subid:this.subTaskListData.length+1,
        name:"子任务"+(this.subTaskListData.length+1).toString(),
        status:"待开始",
        _highlight:true
      };
      this.subTaskListData.push(subListObj);
      
      //初始化临时的子任务
      let localLastSubTask = {
        name:"子任务"+(this.subTaskListData.length).toString(),
        project:this.fatherTaskData.project,
        project_child:this.fatherTaskData.project_child,
        subid:this.subTaskListData.length,
        is_new:true,//新任务
        father:this.fatherTaskData.id,
      };
      this.localLastSubTask = localLastSubTask;
      this.subTasks.push(localLastSubTask);
      
      this.$refs.subtaskinfo.initTaskDetailFromData(this.localLastSubTask);
      this.changeSubTask(subListObj,this.localLastSubList);

      this.init_new = true;
    },
    //改变当前显示的子列表
    changeSubTask(currentRow,oldRow)
    {
      if(oldRow && oldRow._highlight)
      {
        oldRow._highlight=false;
      }
      this.localLastSubList = currentRow;
      //保存切换前修改的值
      let old_taskdata = this.$refs.subtaskinfo.getTaskDetail();
      if(this.subTasks.length > 0)
      {
        this.subTasks.forEach((datas)=>{
            if(old_taskdata.subid)
            {
              if(old_taskdata.subid == datas.subid)
              {
                this.subTasks[old_taskdata.subid-1] = old_taskdata;
              }
            }
            if(currentRow.subid)
            {
              if(currentRow.subid == datas.subid)
              {
                //显示新切换的子任务值
                this.$refs.subtaskinfo.initTaskDetailFromData(this.subTasks[currentRow.subid-1]);
              }
            }
          });
      }
      
    },
    //删除子任务
    delSubtask(id)
    {

    },
    //保存所有临时的子任务
    saveSubTasks()
    {
        //处理仅仅添加子任务后离开页面直接保存的情况
        if(this.subTaskListData.length > this.initAmount)
        {
          this.localLastSubTask = this.$refs.subtaskinfo.getTaskDetail();
          this.subTasks[this.subTaskListData.length-1] = this.localLastSubTask;
        }
        this.subTasks.forEach(
          (res)=>{
            res.expect_start_time = res.expect_start_date;
            res.expect_end_time = res.expect_end_date;
            if(res.is_new)
            {
                this.addTaskDetails(res);
            }
            else
            {

                this.updateTaskDetail(res);
            }
          }
        );
    },
    //这里该封装一个统一的新增接口
    addTaskDetails(dateForm)
    {
        this.$axios.post(this.GLOBAL.baseRouter + "/task/task/add", qs.stringify(dateForm))
                    .then(res => {
                        
                    })
                    .catch(error => {
                        this.$Message.error("新建任务失败，请重试！");
                        return false;
                    });
        return true;
    },
    updateTaskDetail(dateForm)
    {
        this.$axios.post(this.GLOBAL.baseRouter + "/task/task/update", qs.stringify(dateForm))
                    .then(res => {
                        
                    })
                    .catch(error => {
                        this.$Message.error("编辑任务失败，请重试！");
                        return false;
                    });
        return true;
    },
    //删除子任务列表数据
    removetaskSub() {
      let cIs = this;
      let removeSubData = this.row.id;
      // this.get(
      //   deletetaskData,
      //   {
      //     id: removeSubData
      //   },
      //   () => {
      //     cIs.$Message.success("刪除子任务成功！");
      //     cIs.forEachSubData();
      //   }
      // );
    },
    //遍历子任务列表数据
    forEachSubData() {
      // let cIs = this;
      // this.get(
      //   gettasklistData,
      //   {
      //     project_id: 1
      //   },
      //   res => {
      //     //子任务数据渲染及状态上色
      //     //console.log(res);
          
      //     let dataColortd = res.data.data;
      //     for (var i = 0; i < dataColortd.length; i++) {
      //       dataColortd[i].status;
      //       dataColortd[i].status_text;
      //       let child = dataColortd[i].child;
      //       if (child) {
      //         for (var k = 0; k < child.length; k++) {
      //           if (
      //             child[k].status === "1" ||
      //             child[k].status_text === "等待开始"
      //           ) {
      //             child[k].cellClassName = {
      //               status_text: "demo-table-info-cell-start"
      //             };
      //           } else if (
      //             child[k].status === "2" ||
      //             child[k].status_text === "执行中"
      //           ) {
      //             child[k].cellClassName = {
      //               status_text: "demo-table-info-cell-execution"
      //             };
      //           } else if (
      //             child[k].status === "3" ||
      //             child[k].status_text === "暂停"
      //           ) {
      //             child[k].cellClassName = {
      //               status_text: "demo-table-info-cell-pause"
      //             };
      //           } else if (
      //             child[k].status === "4" ||
      //             child[k].status_text === "完成"
      //           ) {
      //             child[k].cellClassName = {
      //               status_text: "demo-table-info-cell-complete"
      //             };
      //           }
      //         }
      //       }
      //       //cIs.row.child = child;
      //     }
      //   }
      // );
    },
    //获取任务列表详情
    getforechDailt(id) {
      // let fDi = this;
      // fDi.get(
      //   gettasklistDetails,
      //   {
      //     id: id
      //   },
      //   res => {
      //     fDi.subForm = res.body;
      //     fDi.isTabModal = true;
      //   }
      // );
    }
  }
};
</script>
<style>
@import "../../../styles/task/task.css";
td.ivu-table-expanded-cell {
  padding: 0 !important;
}
.table_border .ivu-table-wrapper {
  border: 0;
}
.sub-header .ivu-table-header {
  display: none;
}
.subtask{
  display:inline-block;
  overflow:hidden;
}
.subtask-left{
  width:262px;
  float:left;
  padding: 0 20px 0 0;
}
.subtask-right{
  width:300px;
  float:left;
  padding: 0 0 0 20px;
}
</style>