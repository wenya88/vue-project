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
.taskHead .taskInfo .active {
  padding: 0 !important;
  height: 35px;
  line-height: 35px;
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
  right: 34px;
  position: relative;
}
.hideIconDel {
  display: none;
}
.taskHead .taskInfo .hideIconDel {
  margin-left: 5px;
  font-size: 15px;
  color: #5c6b77;
}
</style>
<template>
  <div class="layout">
    <Layout>
      <Layout>
        <Layout>
          <div class="taskHead">
            <div class="taskInfo">
              <b>项目任务(15)</b>
              <span v-for="(index,item) in taskTag" v-on:mouseenter="dataDetails($event)" v-on:mouseleave="hiddenDetail($event)">
                <a href="javascript:;" @click=sTag(taskTag[item].project_id)>{{taskTag[item].name}}({{taskTag[item].num}})
                  <span class="hideIconDel" @click="EditoverShow">
                    <Icon type="edit" style="cursor: pointer;"></Icon>
                  </span>
                  <span class="hideIconDel" @click="childDel(index.id)">
                    <Icon type="trash-a" style="cursor: pointer;"></Icon>
                  </span>
                </a>
              </span>
              <span :class="{showAdd:showText,hideAdd:hideText}">
                <Dropdown trigger="click" class="dropChild">
                  <a href="javascript:void(0)" class="pushDa">
                    <Input icon="ios-plus-empty" placeholder="参与人" clearable></Input>
                  </a>
                  <DropdownMenu slot="list">
                    <Input v-model="value1" placeholder="参与人姓名/名字首字母" clearable style="width: 100%"></Input>
                    <Row :gutter="16">
                      <Col span="10" class="demo-tabs-style2 memberList">
                      <ul class="meberli">
                        <li v-for="(item,index) in tabs" :key="item.tabs" :class="{active:index == num}" @click="memberList(index)">{{item}}
                        </li>
                      </ul>
                      </Col>
                      <Col span="12" align="center" class="scrollBorder">
                      <Scroll :on-reach-bottom="handleReachBottom">
                        <div class="tabCon">
                          <div v-for='(itemCon,index) in tabContents' :key="itemCon.tabContents" v-show="index == num">
                            <Card dis-hover>
                              <CheckboxGroup v-model="fruit">
                                <Checkbox :label="i,d" v-for='(i,d) in itemCon' :key="i.itemCon"></Checkbox>
                              </CheckboxGroup>
                            </Card>
                          </div>
                        </div>
                      </Scroll>
                      </Col>
                    </Row>
                  </DropdownMenu>
                </Dropdown>
                <span class="borderNome">
                  <Input v-model="addVal" placeholder="输入子项目名称" clearable style="width: 200px"></Input>
                </span>
                <Button type="success" @click="saveChild">保存</Button>
                <Button @click="outHide">取消</Button>
              </span>
              <span :class="{showEdit:showEditText,hideEdit:hideEditText}">
                <Dropdown trigger="click" class="dropChild">
                  <a href="javascript:void(0)" class="pushDa">
                    <Input icon="ios-plus-empty" placeholder="参与人" clearable></Input>
                  </a>
                  <DropdownMenu slot="list">
                    <Input v-model="value1" placeholder="参与人姓名/名字首字母" clearable style="width: 100%"></Input>
                    <Row :gutter="16">
                      <Col span="10" class="demo-tabs-style2 memberList">
                      <ul class="meberli">
                        <li v-for="(item,index) in tabs" :key="item.tabs" :class="{active:index == num}" @click="memberList(index)">{{item}}
                        </li>
                      </ul>
                      </Col>
                      <Col span="12" align="center" class="scrollBorder">
                      <Scroll :on-reach-bottom="handleReachBottom">
                        <div class="tabCon">
                          <div v-for='(itemCon,index) in tabContents' :key="itemCon.tabContents" v-show="index == num">
                            <Card dis-hover>
                              <CheckboxGroup v-model="fruit">
                                <Checkbox :label="i,d" v-for='(i,d) in itemCon' :key="i.itemCon"></Checkbox>
                              </CheckboxGroup>
                            </Card>
                          </div>
                        </div>
                      </Scroll>
                      </Col>
                    </Row>
                  </DropdownMenu>
                </Dropdown>
                <span class="borderNome">
                  <Input v-model="editVal" placeholder="输入子项目名称" clearable style="width: 200px"></Input>
                </span>
                <Button type="success" @click="EditSave">保存</Button>
                <Button @click="EditoutHide">取消</Button>
              </span>
            </div>
            <div @click="overShow">
              <Icon type="plus-round" style="float:right;font-size:25px;color:#2d8cf0; cursor: pointer;"></Icon>
            </div>
            <div class="clear"></div>
          </div>
          <div style="background: #FFFFFF">
            <div class="btnStting">
              <Button type="success" @click="showaddFormodal">新增任务</Button>
              <Button type="primary" @click="showExcelmodal">Excle导入</Button>
            </div>
          </div>
          <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
            <!-- 任务列表编辑modal组件 -->
            <edit-list-modal :editData="formLeft" v-if="isTabModal" @close="closeEditmodal"></edit-list-modal>
            <!-- excel解析modal组件 -->
            <excel-modal v-if="isexcelModal" @close="closeModal"></excel-modal>
            <!-- 新增任务modal组件 -->
            <addform-modal :addData="addmodalData" v-if="isaddFormModal" @close="closeAdd" @addmodal="addcloseModal"></addform-modal>
            <!-- 任务列表父组件 -->
            <Table :columns="columnsTask" :ellipsis="true" :data="dataList" size="small" ref="table" class="tableStyle"></Table>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
var qs = require("querystring");
import sub from "./sub.vue";
import Icon from "iview/src/components/icon/icon";
import editListModal from "../components/task/editListModal";
import excelModal from "../components/task/excelModal";
import addformModal from "../components/task/addformModal";
import {
  gettasklistData,
  deletetaskData,
  gettasklistDetails,
  projectList,
  getChildList
} from "../../../config/env.js";
// import Caspanel from "iview/src/components/cascader/caspanel";
import Layout from "iview/src/components/layout/layout";

export default {
  components: {
    editListModal,
    excelModal,
    addformModal,
    Layout,
    Icon,
    "v-sub": sub
  },
  data() {
    return {
      tabs: ["全部成员(33)", "3D模型(11)", "地编组(11)", "次世代(11)"],
      tabContents: [
        ["李霄霄", "王二帅"],
        ["赵三娃", "陈无敌"],
        ["哈哈", "嘻嘻洗洗"],
        ["哇娃娃", "呜呜呜呜"]
      ],
      fruit: [],
      list1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      num: 1,
      value1: "",
      taskTag: [],
      TagClass: false,
      showText: false,
      hideText: true,
      showEditText: false,
      hideEditText: true,
      addVal: "",
      editVal: "",
      isTabModal: false,
      isexcelModal: false,
      isaddFormModal: false,
      addmodalData: {},
      formLeft: {},
      //弹出层
      handleRender: false,
      excelModal: false,
      addModal: false,
      columnsTask: [
        {
          type: "expand",
          width: 50,
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
                    title: "test1",
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
          ellipsis: true,
          key: "file_id"
        },
        {
          title: "更新时间",
          align: "center",
          key: "update_date",
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
          key: "expect_work_day",
          ellipsis: true
        },
        {
          title: "操作",
          align: "center",
          width: "200px",
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
                      cIs.showTabmodal(params.index);
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
      dataList: []
    };
  },
  mounted() {
    this.forEachData();
    this.getProjectId();
  },
  methods: {
    //hover子“项目任务”编辑，删除图标
    dataDetails: function(e) {
      let el = event.currentTarget.children[0].children[0];
      let el2 = event.currentTarget.children[0].children[1];
      el.style.display = "inline-block";
      el2.style.display = "inline-block";
    },
    hiddenDetail: function(e) {
      let el = event.currentTarget.children[0].children[0];
      let el2 = event.currentTarget.children[0].children[1];
      el.style.display = "";
      el2.style.display = "";
    },
    //子“项目任务”筛选切换样式
    sTag() {
      $(() => {
        console.log(11111);
        $(".taskInfo span a").click(function() {
          $(".taskInfo span a").removeClass("active");
          $(this).addClass("active");
        });
      });
    },
    //刪除，子“项目任务”筛选
    childDel: function(id) {
      let cdt = this;
      let delObj = {};
      delObj.id = id;
      cdt.$axios
        .post("/task/project/child-delete", qs.stringify(delObj))
        .then(del => {
          if (del.data.err_code === 0) {
            cdt.getProjectId();
            cdt.$Message.success("刪除成功！");
          } else {
            cdt.$Message.error(dis.data.err_message);
          }
        });
    },
    //编辑，子“项目任务”筛选
    EditSave: function() {
      let edt = this;
      let edtObj = {};
      edtObj.id = edt.givePid.id;
      edtObj.name = edt.editVal;
      edt.$axios
        .post("task/project/child-update", qs.stringify(edtObj))
        .then(edit => {
          if (edit.data.err_code === 0) {
            edt.getProjectId();
            edt.$Message.success("编辑成功！");
          } else {
            edt.$Message.error(edit.data.err_message);
          }
          edt.EditoutHide();
        });
    },
    // 新增保存，子“项目任务”
    saveChild: function() {
      let cIa = this;
      let aDc = {};
      aDc.project_id = cIa.givePid.project_id;
      aDc.name = cIa.addVal;
      cIa.$axios
        .post("/task/project/child-add", qs.stringify(aDc))
        .then(dis => {
          if (dis.data.err_code === 0) {
            cIa.getProjectId();
            cIa.$Message.success("新增子项目成功！");
            cIa.addVal = "";
          } else {
            cIa.$Message.error(dis.data.err_message);
          }
          cIa.outHide();
        })
        .catch(error => {
          cIa.$Message.error("请求失败，请刷新重试！");
        });
    },
    // 新增子“项目任务”文本编辑显示
    overShow() {
      this.showText = !this.showText;
      this.hideText = !this.hideText;
    },
    // 新增子“项目任务”文本编辑隐藏
    outHide() {
      this.showText = !this.showText;
      this.hideText = !this.hideText;
    },
    // 编辑子“项目任务”文本编辑显示
    EditoverShow(index) {
      this.showEditText = !this.showEditText;
      this.hideEditText = !this.hideEditText;
    },
    // 编辑子“项目任务”文本编辑隐藏
    EditoutHide() {
      this.showEditText = !this.showEditText;
      this.hideEditText = !this.hideEditText;
    },
    /**
     * modal
     */
    //开启
    showExcelmodal: function() {
      this.isexcelModal = true;
    },
    //编辑model 数据
    showTabmodal: function(index) {
      this.getforechDailt(this.dataList[index].id);
    },
    showaddFormodal: function(index) {
      this.isaddFormModal = true;
      this.addmodalData = {};
    },
    //关闭excel model
    closeModal: function() {
      this.isexcelModal = false;
    },
    //编辑后关闭modal
    closeEditmodal: function() {
      this.isTabModal = false;
      this.forEachData();
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
      return new Promise(resolve => {
        setTimeout(() => {
          const last = this.list1[this.list1.length - 1];
          for (let i = 1; i < 11; i++) {
            this.list1.push(last + i);
          }
          resolve();
        }, 2000);
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
    // 新增任务列表
    closeAdd: function() {
      this.isaddFormModal = false;
      this.forEachData();
    },
    addcloseModal: function() {
      this.isaddFormModal = false;
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
    forEachData() {
      let cIs = this;
      this.get(
        gettasklistData,
        {
          project_id: 1
        },
        res => {
          //主任务数据渲染及状态上色
          let dataColortd = res.data.data;

          for (var i = 0; i < dataColortd.length; i++) {
            let statusText = dataColortd[i].status;
            let colorText = dataColortd[i].status_text;
            if (statusText === "1" || colorText === "等待开始") {
              dataColortd[i].cellClassName = {
                status_text: "demo-table-info-cell-start"
              };
            } else if (statusText === "2" || colorText === "执行中") {
              dataColortd[i].cellClassName = {
                status_text: "demo-table-info-cell-execution"
              };
            } else if (statusText === "3" || colorText === "暂停") {
              dataColortd[i].cellClassName = {
                status_text: "demo-table-info-cell-pause"
              };
            } else if (statusText === "4" || colorText === "完成") {
              dataColortd[i].cellClassName = {
                status_text: "demo-table-info-cell-complete"
              };
            }
            //判断主列表下是否含有子列表
            if (dataColortd[i].child != undefined) {
              dataColortd[i]._expanded = false;
            } else {
              dataColortd[i]._disableExpand = true;
            }
            //获取主列表阶段进度
            let current = dataColortd[i].progress;
          }
          cIs.dataList = dataColortd;
          dataColortd.forEach(stg => {
            if (stg.stage) {
              stg.stage.forEach(ds => {
                this.stage_name = ds.stage_name;
              });
            }
          });
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
          fDi.formLeft = res.body;
          fDi.isTabModal = true;
        }
      );
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
        getChildList,
        {
          id: Hid.prId
        },
        res => {
          //赋值子项目列表
          Hid.taskTag = res.data.data;
          Hid.taskTag.forEach(pid => {
            Hid.givePid = pid;
          });
        }
      );
    }
  }
};
</script>

