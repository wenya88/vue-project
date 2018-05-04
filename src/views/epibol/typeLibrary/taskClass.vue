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
.displayShow {
  display: block;
}
.displayHide {
  display: none;
}
.ivu-steps.ivu-steps-small .ivu-steps-content {
  padding: 0 !important;
}
.hideIconDel {
  display: none;
}
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
          <!-- formLeft.tasktype_name -->
          <Input :style="{width:'800px',paddingBottom:'20px'}" placeholder="输入任务类型名称" v-model="listN"></Input>
          <h4 :style="{paddingBottom:'10px'}">沟通确认阶段</h4>
          <Row>
            <Col span="22">
            <h2 class="spaceTb">

              <div v-on:mouseenter="dataDetails($event)" v-on:mouseleave="hiddenDetail($event)">
                <span class="hideIconDel">
                  <a class="restdele">x</a>
                </span>
                <Steps :style="{width:'800px'}" :current="current" size="small">
                  <Step :content="this.stageName" v-for="step in stepCount" :key="step" :name="step">
                    <!-- <br>
                    <Input style="width: 100px" size="small"></Input>
                    <br>
                    <Checkbox v-model="single">内审后提交客户确认
                    </Checkbox> -->
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
          <Select :style="{width:'800px',paddingBottom:'20px'}" @on-change="getSelectId">
            <Option v-for="(item,index) in formLeft.file" :value="index" :key="index">{{ item.file_format }}</Option>
          </Select>
          <h4 :style="{paddingBottom:'10px'}">文件属性</h4>
          <Row v-for="(item, index) in formDynamic.items" v-if="item.status" :prop="'items.' + index + '.value'" :key="index" :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
            <Col span="4">
            <Select :style="{padding:'0 20px 20px 0'}" v-model="reqArrt.value">
              <Option v-for="(item,index) in reqeData.require" :value="item.value" :key="index">{{item.config_name}}</Option>
            </Select>
            </Col>
            <Col span="4">
            <Input :style="{padding:'0 20px 20px 0'}" v-model="reqArrt.value"></Input>
            </Col>
            <Col span="2" offset="1">
            <span :style='{cursor:"pointer",position:"relative",top:"5px"}' @click="removeFileat(index)">移除</span>
            </Col>
          </Row>
          <Row>
            <Col span="2">
            <Button :style='{cursor:"pointer"}' type="dashed" long @click="addFileat" icon="">
              <Icon type="plus-round"></Icon>
              增加
            </Button>
            </Col>
          </Row>
          <h2 :style="{padding:'40px 0 20px'}">任务附加文件</h2>
          <template>
            <Table style="margin-bottom: 20px" :columns="acces" :data="accesData"></Table>
            <div :class="{displayShow:junctShow,displayHide:junctHide}">
              <Row>
                <Col span="4">
                <Input v-model="fileFormat" placeholder="输入格式，如“max”" clearable></Input>
                </Col>
                <Col span="12">
                <Input placeholder="附加文件描述..." clearable style="margin-left:20px"></Input>
                </Col>
                <Col span="2">
                <Button type="success" style="margin-left:30px" @click="fileSave">确定</Button>
                </Col>
                <Col span="2">
                <Button @click="addJunctHide">取消</Button>
                </Col>
              </Row>
            </div>
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
import { typeInfo, cateList } from "../../../config/env.js";
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
      single: false,
      junctShow: false,
      junctHide: true,
      stepCount: [0],
      fileFormat: "",
      stageName: "",
      listN: "",
      formLeft: {},
      index: 1,
      formDynamic: {
        items: [
          {
            value: "",
            index: 1,
            status: 1
          }
        ]
      },
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
      ],
      accesData: []
    };
  },
  mounted() {
    // this.ListEachId();
  },
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
    taskClassubmit: function() {
      let csb = this;
      let csbObj = {};
      csbObj.id = csb.formLeft.id;
      csbObj.category_id = csb.formLeft.category_id;
      csbObj.tasktype_name = csb.formLeft.tasktype_name;
      // csbObj.stage = csb.formLeft.stage;
      // csbObj.file = csb.formLeft.file;
      csb.$axios
        .post("/task/task-type/update", qs.stringify(csbObj))
        .then(res => {
          console.log(res.data.err_code);
          if (res.data.err_code === 0) {
            this.$Message.success("编辑类型成功！");
            this.taskClassforEach();
          } else {
            this.$Message.error("编辑类型失败，请重试！");
          }
        })
        .catch(error => {
          this.$Message.error("编辑类型失败，请重试！");
        });
    },
    fileSave: function() {
      let fsv = this;
      let fsvObj = {};
      console.log(this.accesData);
      fsvObj.category_id = fsv.formLeft.category_id;
      fsvObj.name = fsv.fileFormat;
      fsv.$axios.post("/task/task-type/add", qs.stringify(fsvObj)).then(fil => {
        console.log(fil);
      });
    },
    addJunctShow() {
      this.junctShow = !this.junctShow;
      this.junctHide = !this.junctHide;
      return;
    },
    addJunctHide() {
      this.junctHide = !this.junctHide;
    },
    //沟通确认阶段
    addSteps() {
      let aSp = this;
      if (aSp.stepCount.length >= 6 || aSp.current >= 6) {
        // aSp.stepCount.push(aSp.stepCount[aSp.stepCount.length - 1] + 1);
        this.$Message.error("最多只能添加6个阶段");
        aSp.current = 6;
      } else {
        aSp.stepCount.push(0);
        aSp.current += 1;
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
    // 任务类型分类
    // ListEachId() {
    //   let fiC = this;
    //   this.get(
    //     cateList,
    //     {
    //       company_id: 1
    //     },
    //     res => {
    //       let listId = res.data.data;
    //     }
    //   );
    // },
    //遍历任务类别详情数据
    taskClassforEach() {
      let cif = this;
      this.get(
        typeInfo,
        {
          id: cif.listId
        },
        res => {
          cif.formLeft = res.data;
          cif.accesData = res.data.file;
          let stage = res.body.stage;
          stage.forEach(stN => {
            cif.stageName = stN.stage_name;
          });
        }
      );
    },
    //从左边列表组件中获取id,name
    change(id, liName) {
      this.listN = liName;
      this.listId = id;
      this.taskClassforEach();
    },
    //或者select文件格式选择后id
    getSelectId(r) {
      let requ = this.formLeft.file[r]; //文件类型数据
      console.log(requ);
      if (requ) {
        this.reqeData = requ;
      }
    },
    //文件属性的value
    getselecArrt() {
      this.reqArrt = this.reqeData.require[0];
    }
  }
};
</script>
