<style>
.layout-logo {
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}

.layout-nav {
  /*width: 500px;*/
  margin: 0 auto;
  margin-right: 20px;
}

.stem-logo img {
  max-width: 8rem;
}

.stem-l {
  margin-left: 10rem;
}

.spaceTb {
  padding: 21px 21px;
}

.restdele {
  position: relative;
  color: red;
  top: 10px;
  left: 12px;
  z-index: 999999;
  font-size: 14px;
  cursor: pointer;
}

.show {
  display: block;
}

.hide {
  display: none;
}
.ivu-steps.ivu-steps-small .ivu-steps-content {
  padding: 0 !important;
}
/* .hideIconDel {
  display: none;
} */
</style>
<template>
  <Content :style="{padding: '24px 0', minHeight: '280px', background: '#fff'}">
    <Row>
      <Col span="4">
      <type-list :listData="formLeft" @getListId="change"></type-list>
      </Col>
      <Col span="19">
      <Content :style="{padding: '26px 0 100px', minHeight: '280px', background: '#fff'}">
        <Row>
          <Col span="22">
          <h2 class="spaceTb">基础管理</h2>
          </Col>
        </Row>
        <Form class="spaceTb" :model="formLeft" label-position="left" :label-width="100">
          <h4 :style="{paddingBottom:'10px'}">类型名称</h4>
          <Input :style="{width:'800px',paddingBottom:'20px'}" placeholder="输入任务类型名称" v-model="listN"></Input>
          <h4 :style="{paddingBottom:'10px'}">沟通确认阶段</h4>
          <Row>
            <Col span="22">
            <h2 class="spaceTb">
              <div v-on:mouseenter="dataDetails($event)" v-on:mouseleave="hiddenDetail($event)">
                <Steps :style="{width:'800px'}" :current="current" size="small">
                  <Step v-for="step in stepCount" :key="step.sage" :name="step" :title="step.stage_name" :content="step.stage_name">
                    <br>
                    <Input style="width: 100px" size="small" v-model="step.stage_name"></Input>
                    <br>
                    <Checkbox>内审后提交客户确认
                    </Checkbox>
                    <!-- <div class="hideIconDel">
                      <button class="restdele">刪除</button>
                    </div> -->
                    <Button>刪除</Button>
                  </Step>
                </Steps>
              </div>
            </h2>
            </Col>
            <Col span="2">
            <div @click="addSteps">
              <Icon :style="{fontSize:'36px',color:'#39f'}" type="plus-circled"></Icon>
            </div>
            </Col>
          </Row>
          <h2 :style="{padding:'20px 0 20px'}">任务主文件</h2>
          <h4 :style="{paddingBottom:'10px'}">文件格式</h4>
          <AutoComplete v-model="fileType" icon="arrow-down-b" placeholder="选择主文件格式，可直接输入  如' JPG '" style="width:383px">
            <Option v-for="item in accesData" :value="item.file_format" :key="item.file">{{ item.file_format }}</Option>
          </AutoComplete>
          <h4 :style="{paddingBottom:'10px'}">文件属性</h4>
          <Row v-for="(item, index) in formDynamic.items" v-if="item.status" :prop="'items.' + index + '.value'" :key="index" :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
            <Col span="7">
            <AutoComplete v-model="fileCate" icon="arrow-down-b" placeholder="大小" style="width:200px">
              <Option v-for="item in reqData" :value="item.config_name" :key="item.conf">{{ item.config_name }}</Option>
            </AutoComplete>
            </Col>
            <Col span="5">
            <AutoComplete v-model="fileText" placeholder="8000* 8000">
              <Option v-for="item in reqData" :value="item.value" :key="item.conf">{{ item.value }}</Option>
            </AutoComplete>
            </Col>
            <Col span="2" offset="1">
            <span :style='{cursor:"pointer",position:"relative",top:"5px"}' @click="removeFileat(index)">移除</span>
            </Col>
          </Row>
          <Row>
            <Col span="2">
            <Button :style='{cursor:"pointer",margin:"20px 0"}' type="dashed" long @click="addFileat" icon="">
              <Icon type="plus-round"></Icon>
              增加
            </Button>
            </Col>
          </Row>
          <h2 :style="{padding:'40px 0 20px'}">任务附加文件</h2>
          <template>
            <!-- <Table style="margin-bottom: 20px" :columns="acces" :data="reqfData"></Table> -->
            <Row v-for="(item,index) in otherfile" :key="item.config">
              <Col span="4">
              <Input v-model="item.config_name" placeholder="输入格式，如“max”" clearable></Input>
              </Col>
              <Col span="12">
              <Input v-model="item.value" placeholder="附加文件描述..." clearable style="margin-left:20px"></Input>
              </Col>
              <Button :style='{margin:"0 50px"}' type="dashed" icon="">
                删除
              </Button>
            </Row>
            <Row>
              <Col span="2">
              <Button :style='{cursor:"pointer",margin:"20px 0"}' type="dashed" @click="addJunctShow" icon="">
                <Icon type="plus-round"></Icon>
                增加附件文件
              </Button>
              </Col>
            </Row>
          </template>
        </Form>
      </Content>
      </Col>
    </Row>
    <Row>
      <Col span="7">
      <Button type="primary" style="float: right;width: 200px" @click="taskClassubmit">提交</Button>
      </Col>
    </Row>
  </Content>
</template>
<script>
var qs = require("querystring");
import { typeInfo } from "../../../config/env.js";
import Icon from "iview/src/components/icon/icon";
import Caspanel from "iview/src/components/cascader/caspanel";
import typeList from "./typeList";

export default {
  components: {
    typeList,
    Caspanel,
    Icon
  },
  data() {
    return {
      current: 0,
      reqeData: {},
      reqarn: {},
      reqArrt: {},
      isInit: Boolean,
      /*--------------------文件类型阶段属性开始------------------------*/
      formLeft: {},
      listN: "",
      fileType: "",
      fileCate: "",
      fileText: "",
      stepCount: [],
      accesData: [],
      reqData: [],
      reqfData: [],
      formDynamic: {
        items: [
          {
            value: "",
            index: 1,
            status: 1
          }
        ]
      },
      otherfile: [{ config_name: "", value: "" }],
      /*----------------------文件类型阶段属性结束-----------------------*/
      category_id: 0,
      index: 1,
      acces: [
        {
          title: "文件格式",
          key: "file_format"
        },
        {
          title: "描述",
          key: "describe"
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
                      this.remove(params.index);
                    }
                  }
                },
                "移除"
              )
            ]);
          }
        }
      ]
    };
  },
  mounted() {},
  methods: {
    //hover阶段，删除图标
    dataDetails: function(e) {
      let el = event.currentTarget.children[0].children[0];
      el.style.display = "inline-block";
    },
    hiddenDetail: function(e) {
      let el = event.currentTarget.children[0].children[0];
      el.style.display = "";
    },
    //提交任务类别库表单
    taskClassubmit: function() {
      let csb = this;
      let csbObj = {};
      //类型属性
      csbObj.id = csb.clsId;
      csbObj.category_id = csb.category_id ? csb.category_id : 0;
      csbObj.name = csb.listN;
      csbObj.stage = JSON.stringify(csb.stepCount);
      //文件属性
      let main_file = {};
      main_file.file_name = csb.fileType;
      main_file.file_format = csb.fileType;
      main_file.is_main = 1;
      main_file.require = [
        {
          config_id: 0,
          config_name: csb.fileCate,
          value: csb.fileText
        }
      ];
      let files = [];
      files.push(main_file);
      let other_file = [];
      for (let i = 0; i < this.otherfile.length; i++) {
        let _otherfile = {
          file_name: "",
          file_format: this.otherfile[i].config_name,
          is_main: 0,
          require: [
            {
              config_id: 0,
              config_name: this.otherfile[i].config_name,
              value: this.otherfile[i].value
            }
          ]
        };
        files.push(_otherfile);
      }
      csbObj.file = JSON.stringify(files);
      let address = "";
      //判断类型是否为ture执行接口
      if (this.isInit) {
        address = "/task/task-type/add";
      } else {
        address = "/task/task-type/update";
      }
      csb.$axios
        .post(address, qs.stringify(csbObj))
        .then(res => {
          if (res.data.err_code === 0) {
            this.$Message.success("编辑类型成功！");
            this.taskClassforEach();
          } else {
            this.$Message.error(res.data.err_message);
          }
        })
        .catch(error => {
          this.$Message.error("加载失败，请重试！");
        });
      this.refreshPage();
    },
    addJunctShow() {
      // this.junctShow = !this.junctShow;
      // this.junctHide = !this.junctHide;
      if (this.otherfile.length) {
        this.otherfile.push({ config_name: "", value: "" });
      } else {
        this.otherfile.push(0);
      }
    },
    //沟通确认阶段
    addSteps() {
      let aSp = this;
      if (aSp.stepCount.length >= 6 || aSp.current >= 6) {
        // aSp.stepCount.push(aSp.stepCount[aSp.stepCount.length - 1] + 1);
        this.$Message.error("最多只能添加6个阶段");
        aSp.current = 6;
      } else {
        // aSp.stepCount.push(0);
        aSp.current += 1;
        this.stepCount.push({
          id: this.stepCount.length + 1,
          stage_name: "",
          is_inside_audit: false,
          tasktype_id: this.category_id
        });
      }
    },
    /**
     * 文件属性模块操作
     */
    //增加
    addFileat() {
      this.index++;
      this.formDynamic.items.push({
        value: "",
        index: this.index,
        status: 1
      });
    },
    //移除
    removeFileat(index) {
      this.formDynamic.items[index].status = 0;
    },
    remove(index) {
      this.accesData.splice(index, 1);
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
    //遍历任务类别详情数据
    taskClassforEach() {
      let cif = this;
      this.get(
        typeInfo,
        {
          id: this.clsId
        },
        res => {
          cif.formLeft = res.data;
          //任务附加文件列表
          cif.accesData = res.data.file;
          if (cif.accesData != null) {
            cif.accesData.forEach(reqr => {
              cif.forSubmit = reqr.is_main;
              if (reqr.is_main == 1) {
                cif.reqData = reqr.require;
                cif.fileType = reqr.file_format;
                cif.reqData.forEach(reqFor => {
                  cif.fileCate = reqFor.config_name;
                  cif.fileText = reqFor.value;
                });
              } else if (reqr.is_main == 0) {
                reqr.require.forEach(other => {
                  this.otherfile = [
                    {
                      config_name: other.config_name,
                      value: other.value
                    }
                  ];
                });
                cif.reqfData.push(reqr);
              }
            });
          }
          //沟通确认阶段
          cif.stepCount = res.body.stage;
        }
      );
    },
    //从左边列表组件中获取id,name
    change(clicktype) {
      this.isInit = clicktype.isInit;
      this.category_id = clicktype.category_id;
      this.listN = clicktype.liName;
      this.clsId = clicktype.id;
      if (clicktype.isInit) {
        //新增文件類型-頁面
        this.initPage();
      } else {
        this.taskClassforEach();
      }
    },
    //初始化頁面數據
    initPage() {
      this.stepCount = [];
      this.stepCount.push({
        id: 1,
        stage_name: "默认阶段",
        is_inside_audit: false,
        tasktype_id: this.category_id
      });
      //清空
      this.formLeft = {};
      this.listN = "";
      this.fileType = "";
      this.fileCate = "";
      this.fileText = "";
      this.accesData = [];
      this.reqData = [];
      this.reqfData = [];
      this.formDynamic = {
        items: [
          {
            value: "",
            index: 1,
            status: 1
          }
        ]
      };
      this.otherfile = [{ config_name: "", value: "" }];
    },
    //刷新当前页面
    refreshPage() {
      this.$Spin.show(
        {
          render: h => {
            return h("div", [
              h("Icon", {
                class: "demo-spin-icon-load",
                props: {
                  type: "load-c",
                  size: 18
                }
              }),
              h("div", "Loading")
            ]);
          }
        },
        location.reload()
      );
      setTimeout(() => {
        this.$Spin.hide();
      }, 3000);
    },
    //或者select文件格式选择后id
    getSelectId(r) {
      let requ = this.formLeft.file[r]; //文件类型数据
      if (requ) {
        this.reqeData = requ;
      }
    },
    //文件属性的value
    getselecArrt() {
      this.reqArrt = this.reqeData.require[0];
    },
    stepClick: function() {
      console.log(step);
    }
  }
};
</script>
