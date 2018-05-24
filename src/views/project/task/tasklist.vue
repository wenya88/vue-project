<!-- 任务列表组件 -->
<template>
  <div >
      <Table 
        height='660' 
        :columns="columnsTask" 
        :data="dataList" 
        :ellipsis="true"
        size="large"
        highlight-row
        :loading="loading"
        ref="table" 
        @on-current-change="changeTaskListItem"
        >
      </Table>
      <!-- <Table 
        height='660' 
        :columns="columnsTask_del" 
        :data="dataList_del" 
        size="large"
        :loading="loading"
        disabled-hover="dellisthighlight"
        ref="del"
        class="tasklistdel"
        @on-current-change="changeTaskListDel"
        >
      </Table> -->
    </div>
</template>
<script>
var qs = require("querystring");
import tasklistline from "./taskListLine";

export default {
  components: {
  },
  data() {
    return {
      currentMsg:{},
      loading:true,
      dellisthighlight:false,
      /*-----*/
      dataList: [],
      dataList_del:[],
      columnsTask: [
        // {
        //   type: 'expand',
        //   width: 20,
        //   render: (h, params) => {
        //     console.log(params);
            
        //     return h(tasklistline, {//子任务下拉
        //       props: {
        //         taskrow: params.child
        //       }
        //     });
        //   }
        // },
        {
          title: "任务名",
          key: "name",
          align: "left",
          ellipsis: true,
          width: 340
        },
        {
          title: "状态",
          key: "status_text",
          align: "right",
          ellipsis: true,
          width: 120
        },
        {
          title: "类型",
          key: "tasktype_name",
          align: "right",
          ellipsis: true,
          width: 100
        },
        {
          title: "负责人",
          key: "run_uname",
          align: "right",
          ellipsis: true,
          width: 154
        },
        {
          title: "实施阶段",
          key:"stage",
          align: "left",
          ellipsis: true,
          width: 280,
          render: function(h, params) {
            //console.log(params);
            let steplist = [];
            let present = parseInt(params.row.progress)+1;
            for(let i=0;i<params.row.stage.length;i++)
            {
              let str="";
              if((present-1) == i)
                str = params.row.stage[i].stage_name;
              steplist.push(
                h("Step",{
                  props: {
                    title: str,
                    }
                })
              );
            }
            return h("Steps",
                  {props: {current: present-1,size: "small"}},
                  steplist
            );
          }
        },
        {
          title: "任务文件",
          align: "center",
          ellipsis: true,
          key: "file_id",
          width: 140
        },
        {
          title: "文件最近更新",
          align: "right",
          key: "update_date",
          ellipsis: false,
          width: 120
        },
         {
          title: "到期时间",
          align: "right",
          key: "expect_end_date",
          ellipsis: false,
          width: 120
        },
        {
          title: "操作",
          align: "right",
          width: 84,
          render: (h, params) => {
            return h("div", [
                // h(
                //   "Button",
                //   {
                //     props: {
                //       type: "text",
                //       size: "small"
                //     },
                //     style: {
                //       marginLeft: "12px"
                //     },
                //     on: {
                //       click: () => {
                //         this.showTaskDetail(params.index);
                //       }
                //     }
                //   },
                //   "编辑"
                // ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                    confirm: true,
                    title: "确认删除该任务?",
                    transfer: true
                  },
                  style: "dellisttask",
                  on: {
                    click: ($event) => {
                      this.removetasklistData(params.index,$event);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      columnsTask_del:[
        {
          title: "删除",
          key: "name",
          align: "center",
          width: 80,
          render: (h, params) => {
            return h("div", [
                    h(
                      "Button",
                      {
                        props: {
                          type: "text",
                          size: "small",
                          confirm: true,
                          title: "确认删除该任务?",
                          transfer: true
                        },
                        style: "dellisttask",
                        on: {
                          click: ($event) => {//render不支持.
                            this.removetasklistData(params.index,$event);
                          }
                        }
                      },
                      "删除"
                    )
            ]);
          }
        },
      ]
    };
  },
  mounted() {
    this.initTaskListFromId();
  },
  methods: {
    
    //打开任务详情
    showTaskDetail: function(index) {
      this.$emit('showTaskDetails',this.dataList[index]);
    },
    //点击切换任务项
    changeTaskListItem(currentRow,oldRow)
    { 
      if(currentRow != null)//clearCurrentRow有BUG会重复调用，第二次进来就会是个空数据
      {
        this.$emit('showTaskDetails',currentRow); 
        this.$refs.table.clearCurrentRow();
      }
    },
    //删除
    changeTaskListDel(currentRow,oldRow)
    {
      if(currentRow != null)//clearCurrentRow有BUG会重复调用，第二次进来就会是个空数据
      {
        console.log("changeTaskListDel");
      }
    },
    exportData(type) {
      if (type === 1) {
        this.$refs.table.exportCsv({
          filename: "原始数据的处理"
        });
      } else if (type === 2) {
        this.$refs.table.exportCsv({
          filename: "排序和过滤数据",
          original: false
        });
      } else if (type === 3) {
        this.$refs.table.exportCsv({
          filename: "自定义数据",
          columns: this.columnsTask.filter((col, sub) => sub < 4),
          data: this.dataList.filter((data, sub) => sub < 4)
        });
      }
    },
    //参与人滚动条
    handleReachBottom() {
      // return new Promise(resolve => {
      //   setTimeout(() => {
      //     const last = this.list1[this.list1.length - 1];
      //     for (let i = 1; i < 11; i++) {
      //       this.list1.push(last + i);
      //     }
      //     resolve();
      //   }, 2000);
      // });
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
    
    //删除数据
    removetasklistData(index,$event) {
      $event.cancelBubble = true;
      this.$axios.post(this.GLOBAL.baseRouter + "/task/task/delete", qs.stringify({id:this.dataList[index].id}))
                  .then(res => {
                      this.$bus.emit('refreshCurrentTaskList');
                      this.refreshTaskList();
                  })
                  .catch(error => {
                      this.$Message.error("删除任务失败，请重试！");
                      return false;
                  });
      return true;
    },
    //遍历主任务列表数据
    initTaskListFromId(data) {
      if(data == null)
        data={}
      let msg = {}
      if(!data.project_child_id)//主项目
      {
        msg.project_id = data.project_id?data.project_id:1;
      }
      else
      {
        msg.project_child_id = data.project_child_id;
      }
      this.currentMsg = msg;
      this.getTaskList(msg);
    },
    //刷新当前列表
    refreshTaskList()
    {
      this.loading = true;
      this.getTaskList(this.currentMsg);
    },
    getTaskList(msg)
    {
        this.$axios.post(this.GLOBAL.baseRouter + 'task/task/list',qs.stringify(msg))
                .then( res => res.data)
                .then( res => {
                    // console.log(res.data);
                      this.dataList = res.data;
                      this.formatTaskList(this.dataList.reverse());//颠倒顺序
                      this.loading = false;
                      this.dataList_del=[];
                      this.dataList.forEach(
                        (element) => {
                          this.dataList_del.push({
                            name:"删除",
                            id:element.id
                          });
                      });
                    }
                )
                .catch(error => {
                    console.log(error);
                    
                    this.$Message.error("获取任务列表失败，请重试！");
                });
        return true;
    },
    //格式化后端数据
    formatTaskList(taskData)
    {
      for (var i = 0; i < taskData.length; i++) {
          this.setTaskStatus(taskData[i]);
          taskData[i].update_date = this.TimeFormatMinute(taskData[i].update_date);
          taskData[i].expect_end_date = this.TimeFormatDay(taskData[i].expect_end_date);

          // if (taskData[i].child != null) {
          //   taskData[i]._expanded = true;
          // }
        }
    },
    TimeFormatDay(str)
    {  
      return str.substr(0,str.search(/ /));
    },
    TimeFormatMinute(str)
    {  
      return str.substr(0,str.lastIndexOf(":"));
    },
    //任务状态
    setTaskStatus(taskDatastatus)
    {
      switch(taskDatastatus.status)
      {
        case "1":
          taskDatastatus.cellClassName = {status_text: "demo-table-info-cell-start"};
          break;
        case "2":
          taskDatastatus.cellClassName = {status_text: "demo-table-info-cell-execution"};
          break;
        case "3":
          taskDatastatus.cellClassName = {status_text: "demo-table-info-cell-pause"};
          break;
        case "4":
          taskDatastatus.cellClassName = {status_text: "demo-table-info-cell-complete"};
          break;
      }
    },
  }
};
</script>
<style>
@import "../../../styles/task/task.css";

.main-header-con {
  z-index: 0 !important;
}

.showAdd {
  display: inline-block;
}

.hideAdd {
  display: none;
}
.showEdit {
  display: inline-block;
}
.hideEdit {
  display: none;
}

.dropChild .ivu-select-dropdown {
  width: 300px !important;
  top: 40px !important;
  margin: 0 !important;
  padding: 0 !important;
}

.meberli li {
  height: 35px;
  line-height: 35px;
}
.pushDa Input {
  width: 100px !important;
  border-right: 0 !important;
  border-radius: 0 !important;
  position: relative;
}
.borderNome Input {
  border-radius: 0 !important;
  right: 20px;
  position: relative;
}

.btnStting {
  margin-bottom: 10px;
}
.tasklistfather{
  display:inline-block;
  overflow:hidden;
}
.tasklist{
    width:1400px;
    z-index: 1;
    float:left;
    padding: 0 0px 0 0;
}
.tasklistdel{
    width:82px;
    z-index: 1;
    float:left;
    padding: 0 0 0 -2px;
}
.dellisttask{
  width:80px;
  position:absolute;
  z-index: 2;
  marginLeft: 12px;
  display:block;
}
</style>

