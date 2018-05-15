<!-- 任务列表组件 -->
<template>
  <div>
      <Table 
        height='660' 
        :columns="columnsTask" 
        :data="dataList" 
        :ellipsis="true"
        size="large"
        highlight-row
        ref="table" 
        class="tableStyle"
        @on-current-change="changeTaskListItem"
        >
      </Table>
    </div>
</template>
<script>
var qs = require("querystring");
import excelModal from "./excelModal";
import addformModal from "./addformModal";

import {
  deletetaskData,

  projectList,
  getChildList
} from "@/config/env.js";

export default {
  components: {
    excelModal,
    addformModal,
  },
  data() {
    return {
       /*-----*/
      dataList: [],
      columnsTask: [
        {
          type: "expand",
          width: 20,
          render: (h, subdow) => {
            return h(sub, {
              //子任务下拉
              props: {
                row: subdow.row
              }
            });
          }
        },
        {
          title: "任务名",
          key: "name",
          align: "left",
          ellipsis: true,
          width: 380
        },
        {
          title: "状态",
          key: "status_text",
          align: "right",
          ellipsis: true,
          width: 100
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
          width: 120
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
              if(present == i)
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
                  {props: {current: present,size: "small"}},
                  steplist
            );
          }
        },
        {
          title: "任务文件",
          align: "center",
          ellipsis: true,
          key: "file_id",
          width: 120
        },
        {
          title: "文件最近更新",
          align: "right",
          key: "update_date",
          ellipsis: false,
          width: 140
        },
         {
          title: "到期时间",
          align: "right",
          key: "expect_end_date",
          ellipsis: false,
          width: 100
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
                    title: "您确定要删除这条数据吗?",
                    transfer: true
                  },
                  style: {
                    marginLeft: "12px"
                  },
                  on: {
                    click: () => {
                      let cIs = this;
                      cIs.removetasklistData(params.index);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
    };
  },
  mounted() {
    this.forEachData();
  },
  methods: {
    
    //打开任务详情
    showTaskDetail: function(index) {
      this.$emit('showTaskDetails',this.dataList[index].id);
    },
    //点击切换任务项
    changeTaskListItem(currentRow,oldRow)
    { 
      if(currentRow != null)//clearCurrentRow有BUG会重复调用，第二次进来就会是个空数据
      {
        this.$emit('showTaskDetails',currentRow.id); 
        this.$refs.table.clearCurrentRow();
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
    removetasklistData(index) {
      let cIs = this;
      let removeData = this.dataList[index].id;
      this.get(
        deletetaskData,
        {
          id: removeData
        },
        () => {
          cIs.forEachData();
          this.$Message.success("删除成功");
        }
      );
    },
    //遍历主任务列表数据
    forEachData(id) {
      let company_id = id ? id:1;
      this.$axios.post(this.GLOBAL.baseRouter + 'task/task/list',qs.stringify({project_id: company_id}))
                .then( res => res.data)
                .then( res => {
                      this.dataList = res.data;
                      this.formatTaskList(this.dataList);
                    }
                )
                .catch(error => {
                    this.$Message.error("获取任务列表失败，请重试！");
                });
    },
    //格式化后端数据
    formatTaskList(taskData)
    {
      for (var i = 0; i < taskData.length; i++) {
          this.setTaskStatus(taskData[i]);
          taskData[i].update_date = this.TimeFormatMinute(taskData[i].update_date);
          taskData[i].expect_end_date = this.TimeFormatDay(taskData[i].expect_end_date);
          //console.log(taskData[i]);
          
          //判断主列表下是否含有子列表
          if (taskData[i].child != undefined) {
            taskData[i]._expanded = false;
          } else {
            taskData[i]._disableExpand = true;
          }
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
.hideIconDel {
  display: none;
}
.taskHead .taskInfo .hideIconDel {
  margin-left: 5px;
  font-size: 10px;
  /* color: #5c6b77; */
}
.taskHead .taskInfo .active {
  padding: 0 !important;
  height: 32px;
  line-height: 32px;
}
.taskHead .taskInfo a {
  color: #666;
}
.btnStting {
  margin-bottom: 10px;
}
</style>

