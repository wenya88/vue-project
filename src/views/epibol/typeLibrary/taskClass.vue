<template>
  <Content :style="{minHeight: '280px', background: '#fff'}">
    <!-- <Row> -->
      <Col span="4">
          <type-list :listData="formLeft" @getListId="getListId"></type-list>
      </Col>
      <Col span="18">
        <Content :style="{padding: '0 0 60px', minHeight: '280px', background: '#fff'}">
          <Row>
            <Col span="12">
              <h2 class="spaceTb">基础管理</h2>
            </Col>
          </Row>
          <Form class="spaceTb" :model="formLeft" label-position="left" :label-width="100">
            <h4 :style="{paddingBottom:'10px'}">类型名称</h4>
                <Input :style="{width:'800px',paddingBottom:'20px'}" placeholder="新建任务类型" v-model="listN"></Input>
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
                      <Checkbox v-model="step.is_inside_audit">内审后提交客户确认</Checkbox>
                      <!-- <div class="hideIconDel">
                        <button class="restdele">刪除</button>
                      </div> -->
                      <Button type="text" size="small" @click="delStep">刪除</Button>
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
            <h3 :style="{padding:'20px 0 20px'}">任务主文件</h3>
            <h4 :style="{paddingBottom:'20px'}">文件格式</h4>
            <AutoComplete v-model="fileType" icon="arrow-down-b" placeholder="选择主文件格式，可直接输入  如' JPG '" style="width:383px;margin:0px 0 20px">
              <Option v-for="item in accesData" :value="item.file_format" :key="item.file">{{ item.file_format }}</Option>
            </AutoComplete>
            <h4 :style="{paddingBottom:'10px'}">文件属性</h4>
            <Row v-for="(item,index) in attrFile" :key="item.config" :style='{margin:"10px 0"}'>
              <Col span="5">
                <AutoComplete v-model="item.config_name" placeholder="额外属性名称" clearable>
                  <!-- <Option v-for="item in reqData" :value="item.config_name" :key="item.conf">{{ item.config_name }}</Option> -->
                </AutoComplete>
              </Col>
              <Col span="10">
                <AutoComplete v-model="item.value" placeholder="额外属性说明" clearable style="margin-left:20px">
                  <!-- <Option v-for="item in reqData" :value="item.value" :key="item.conf">{{ item.value }}</Option> -->
                </AutoComplete>
              </Col>
              <Button type="text" @click="removeFileat(index)">移除</Button>
            </Row>
            <Row>
              <Button icon="plus-round" type="dashed" long @click="addFileat" style="width:718px">
                增加文件属性
              </Button>
            </Row>
            <h3 :style="{padding:'20px 0 0px'}">任务附加文件</h3>
              <Row v-for="(item,index) in otherfile" :key="item.config" :style='{margin:"20px 0"}'>
                  <Col span="5">
                    <AutoComplete v-model="item.file_format" placeholder="输入格式，如“max”" clearable></AutoComplete>
                  </Col>
                  <Col span="10">
                    <AutoComplete v-model="item.value" placeholder="附加文件描述..." clearable style="margin-left:20px"></AutoComplete>
                  </Col>
                  <Button type="text" @click="delOtherfile">移除</Button>
              </Row>
              <Button  style="width:718px" icon="plus-round" type="dashed" @click="addJunctShow">
                  增加附件文件
              </Button>
          </Form>
          <Col span="10">
            <Button type="primary" style="float: right;width: 200px" @click="taskClassubmit">提交</Button>
          </Col>
        </Content>
      </Col>
    <!-- </Row> -->
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
      isInit: Boolean,
      /*--------------------文件类型阶段属性开始------------------------*/
      formLeft: {},
      listN: "",
      fileType: "",
      stepCount: [],
      accesData: [],
      reqData: [],
      attrFile: [{ config_name: "", value: "" }],
      otherfile: [],
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
      let csbObj = {};
      //类型属性
      
      csbObj.id = this.clsId;
      csbObj.category_id = this.category_id ? this.category_id : 0;
      csbObj.name = this.listN;
      csbObj.stage = JSON.stringify(this.stepCount);
      //文件属性
      // let main_file = {};
      // main_file.file_name = csb.fileType;
      // main_file.file_format = csb.fileType;
      let files = [];
      // files.push(main_file);
      //任务主文件
      let _attrFile = {
          file_name: "",
          file_format: this.fileType,
          is_main: 1,
          require: []
        };
      for (let i = 0; i < this.attrFile.length; i++) {
        let r = {
                config_id: 0,
                config_name: this.attrFile[i].config_name,
                value: this.attrFile[i].value
                }
        _attrFile.require.push(r);
      }
      files.push(_attrFile);
      //任务附加文件
      console.log(this.otherfile.length);
      for (let i = 0; i < this.otherfile.length; i++) {
        let _otherfile = {
          file_name: "",
          file_format: this.otherfile[i].file_format,
          is_main: 0,
          require: [
            {
              config_id: 0,
              config_name: "",
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
        address = "task/task-type/add";
      } else {
        address = "task/task-type/update";
      }
      
      console.log(csbObj);
      
      this.$axios
        .post(this.GLOBAL.baseRouter + address, qs.stringify(csbObj))
        .then(res => {
          if (res.data.err_code === 0) {
            this.$Message.success("编辑类型成功！");
            //this.initPage();
            this.taskClassforEach();
            this.refreshPage();
          } else {
            this.$Message.error(res.data.err_message);
          }
        })
        .catch(error => {
          this.$Message.error("加载失败，请重试！");
        });
    },
    //增加任务附加文件
    addJunctShow(data) {
      this.otherfile.push({ config_name: "", value: "" });
    },
    //移除任务附加文件
    delOtherfile(event, ot) {
      const index = this.otherfile.indexOf(ot);
      this.otherfile.splice(index, 1);
    },
    //移除任务附加文件tabel
    remove(index) {
      this.accesData.splice(index, 1);
    },
    //沟通确认阶段
    addSteps() {
      let aSp = this;
      if (aSp.stepCount.length >= 6 || aSp.current >= 6) {
        this.$Message.error("最多只能添加6个阶段");
        aSp.current = 6;
      } else {
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
    //增加文件属性
    addFileat() {
      this.attrFile.push({ config_name: "", value: "" });
    },
    //移除文件属性
    removeFileat(event, at) {
      const index = this.attrFile.indexOf(at);
      this.attrFile.splice(index, 1);
    },
    //移除沟通确认阶段
    delStep(event, st) {
      if (this.stepCount.length <= 1) {
        this.stepCount = [
          {
            id: 1,
            stage_name: "默认阶段",
            is_inside_audit: false,
            tasktype_id: this.category_id
          }
        ];
        this.$Message.warning("默认阶段，不可刪除");
      } else {
        const index = this.stepCount.indexOf(st);
        this.stepCount.splice(index, 1);
      }
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
      this.clernPage();
      this.get(
        typeInfo,
        {
          id: this.clsId
        },
        res => {
          this.formLeft = res.data;
          this.listN = res.data.tasktype_name;
          //任务附加文件列表
          this.accesData = res.data.file;
          this.otherfile =[];
          if (this.accesData != null) {
            this.accesData.forEach(reqr => {
              this.forSubmit = reqr.is_main;
              if (reqr.is_main == 1) {
                this.reqData = reqr.require;
                this.fileType = reqr.file_format;
                this.reqData.forEach((reqFor) => {
                  this.attrFile.push({
                      config_name: reqFor.config_name,
                      value: reqFor.value
                    });
                });
              } else if (reqr.is_main == 0) {
                reqr.value = reqr.require[0].value;
                this.otherfile.push(reqr);
              }
            });
          }
          //沟通确认阶段
          if (this.formLeft.stage != null) {
            this.formLeft.stage.forEach(sta => {
              sta.is_inside_audit = sta.is_inside_audit == 1 ? true : false;
              this.stepCount.push(sta);
            });
          }
        }
      );
    },
    //从左边列表组件中获取id,name
    getListId(clicktype) {
      this.isInit = clicktype.isInit;
      this.category_id = clicktype.category_id;
      this.listN = clicktype.liName;
      this.clsId = clicktype.id;
      console.log(clicktype);
      
      if (clicktype.isInit) {
        //新增文件類型-頁面
        this.initPage();
      } else {
        this.taskClassforEach();
      }
    },
    //初始化頁面數據
    initPage() {
      this.clernPage();
      this.stepCount.push({
        id: 1,
        stage_name: "默认阶段",
        is_inside_audit: false,
        tasktype_id: this.category_id
      });
      //清空
      this.otherfile = [];
      this.attrFile = [{ config_name: "", value: "" }];
    },
    clernPage() {
      this.stepCount = [];
      this.formLeft = {};
      this.listN = "";
      this.fileType = "";
      this.accesData = [];
      this.reqData = [];
      this.reqfData = [];
      this.otherfile = [];
      this.attrFile = [];
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
    }
  }
};
</script>
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
