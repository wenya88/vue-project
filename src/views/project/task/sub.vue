<style>
@import "../../../styles/task/task.css";
td.ivu-table-expanded-cell {
  padding: 0 !important;
}
.table_border .ivu-table-wrapper {
  border: 0;
}
</style>
<template>
  <!-- 子任务列表父组件 -->
  <div class="table_border">
    <Content :style="{background: '#fff'}">
      <edit-submodal :editSubData="subForm" v-if="isubListModal" @close="closeSubListmodal"></edit-submodal>
      <Table :show-header="false" :columns="subColumns" :data="Subdata" size="small" ref="table"></Table>
    </Content>
  </div>
</template>
<script>
import {
  deletetaskData,
  updatetaskData,
  gettasklistData,
  gettasklistDetails
} from "../../../config/env.js";
import editSubmodal from "../components/task/modalTab/editSubmodal/editSubmodal";
export default {
  components: { editSubmodal },
  data() {
    return {
      subForm: {},
      //弹出层
      isubListModal: false,
      subColumns: [
        {
          width: 50,
          align: "center"
        },
        {
          title: "任务",
          key: "name",
          align: "center",
          ellipsis: true
        },
        {
          title: "状态",
          key: "status_text",
          sortable: true,
          align: "center",
          ellipsis: true
        },
        {
          title: "子项目",
          key: "project_child_name",
          align: "center",
          ellipsis: true
        },
        {
          title: "参与人",
          align: "center",
          width: "100px",
          key: "run_uname",
          ellipsis: true
        },
        {
          title: "类型",
          key: "tasktype_name",
          align: "center",
          ellipsis: true
        },
        {
          title: "实施阶段",
          align: "center",
          width: "550px",
          ellipsis: true,
          render: function(h) {
            return h(
              "Steps",
              {
                props: {
                  current: 0,
                  status: "wait",
                  size: "small",
                  direction: "horizontal"
                }
              },
              [
                h("Step", {
                  props: {
                    title: "test1"
                  }
                }),
                h("Step", {
                  props: {
                    title: "test2"
                  }
                }),
                h("Step", {
                  props: {
                    title: "test3"
                  }
                }),
                h("Step", {
                  props: {
                    title: "test4"
                  }
                }),
                h("Step", {
                  props: {
                    title: "test5"
                  }
                })
              ]
            );
          }
        },
        {
          title: "任务文件",
          align: "center",
          ellipsis: true
        },
        {
          title: "更新时间",
          align: "center",
          key: "expect_end_date",
          width: "100px",
          ellipsis: true
        },
        {
          title: "已用时",
          align: "center",
          ellipsis: true
        },
        {
          title: "剩余",
          align: "center",
          ellipsis: true
        },
        {
          title: "操作",
          align: "center",
          width: "200px",
          ellipsis: true,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      let cIs = this;
                      cIs.showSubListmodal(params.index);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                    confirm: true,
                    title: "您确定要删除这条数据吗?",
                    transfer: true
                  },
                  on: {
                    click: () => {
                      let cIs = this;
                      cIs.removetaskSub(params.index);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      Subdata: []
    };
  },
  created() {
    this.forEachSubData();
    this.getforechDailt();
  },
  methods: {
    //关闭modal
    closeSubListmodal() {
      this.isubListModal = false;
    },
    showSubListmodal: function(index) {
      this.isubListModal = true;
      this.getforechDailt(this.Subdata[index].id);
    },
    /**
     * 请求数据
     */
    get(url, params, call) {
      /*获取列表信息*/
      this.$http.get(url, { params: params }).then(
        function(res) {
          call(res);
        },
        function(error) {}
      );
    },
    //删除子任务列表数据
    removetaskSub(index) {
      let cIs = this;
      let removeSubData = this.Subdata[index].id;
      this.get(
        deletetaskData,
        {
          id: removeSubData
        },
        () => {
          cIs.$Message.success("刪除子任务成功！");
          cIs.forEachSubData();
        }
      );
    },
    //遍历子任务列表数据
    forEachSubData() {
      let cIs = this;
      this.get(
        gettasklistData,
        {
          project_id: 1
        },
        res => {
          //子任务数据渲染及状态上色
          let dataColortd = res.data.data;
          for (var i = 0; i < dataColortd.length; i++) {
            dataColortd[i].status;
            dataColortd[i].status_text;
            let child = dataColortd[i].child;
            console.log(child);
            if (child) {
              for (var k = 0; k < child.length; k++) {
                if (
                  child[k].status === "1" ||
                  child[k].status_text === "等待开始"
                ) {
                  child[k].cellClassName = {
                    status_text: "demo-table-info-cell-start"
                  };
                } else if (
                  child[k].status === "2" ||
                  child[k].status_text === "执行中"
                ) {
                  child[k].cellClassName = {
                    status_text: "demo-table-info-cell-execution"
                  };
                } else if (
                  child[k].status === "3" ||
                  child[k].status_text === "暂停"
                ) {
                  child[k].cellClassName = {
                    status_text: "demo-table-info-cell-pause"
                  };
                } else if (
                  child[k].status === "4" ||
                  child[k].status_text === "完成"
                ) {
                  child[k].cellClassName = {
                    status_text: "demo-table-info-cell-complete"
                  };
                }
              }
              // cIs.Subdata = child;
              this.Subdata = child;
            }
          }
        }
      );
    },
    //获取任务列表详情
    getforechDailt(id) {
      let fDi = this;
      fDi.get(
        gettasklistDetails,
        {
          id: id
        },
        res => {
          fDi.subForm = res.body;
          fDi.isTabModal = true;
        }
      );
    }
  }
};
</script>
