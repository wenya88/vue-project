<template>
    <transition name="modal-fade">
        <div class="modal-backdrop">
            <div class="modal smallModal">
                <div class="modal-header">
                    <slot name="header">
                        <div>
                            <h2 style="color: #2b85e4;">基本管理</h2>
                        </div>
                        <button type="button" class="btn-close" @click="close">x</button>
                    </slot>
                </div>
                <div class="modal-body">
                    <div>
                        <Row>
                            <Col span="24">
                            <Form label-position="left" :label-width="80">
                                <FormItem label="任务名称">
                                    <Input v-model="addData.name"></Input>
                                </FormItem>
                                <FormItem label="开始时间">
                                    <DatePicker :value="addData.expect_start_time" @on-change="handleChange" format="yyyy-MM-dd" type="date" :options="disableTime" placeholder="选择时间" style="width: 100%"></DatePicker>

                                </FormItem>
                                <FormItem label="结束时间">
                                    <DatePicker :value="addData.expect_end_time" @on-change="handleChange2" format="yyyy-MM-dd" type="date" :options="disableTime2" placeholder="选择时间" style="width: 100%"></DatePicker>
                                </FormItem>
                                <FormItem label="子项目">
                                    <Select @on-change='setChild'>
                                        <Option v-for="(item,childName) in childList" :value="item.name" :key="item.name" >{{item.name}}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="参与人">
                                    <Tag v-for="item in fruit" :key="item" :name="item" closable @on-close="removePartici" type="border">{{item}}
                                    </Tag>
                                    <Dropdown trigger="click" class="dropBig">
                                        <a href="javascript:void(0)">
                                            <Button icon="ios-plus-empty" type="dashed" size="small">
                                                添加
                                            </Button>
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
                                                                    <Checkbox :label="i" v-for='(i,d) in itemCon' :key="i.itemCon"></Checkbox>
                                                                </CheckboxGroup>
                                                            </Card>
                                                        </div>
                                                    </div>
                                                </Scroll>
                                                </Col>
                                            </Row>
                                        </DropdownMenu>
                                    </Dropdown>
                                </FormItem>
                                <FormItem label="任务类型">
                                    <Select @on-change="setClasst">
                                        <Option v-for="(item,typeClass) in setypeClass" :value="item.tasktype_name" :key="item.tasktype_name">{{item.tasktype_name}}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="文件要求">
                                    <div>
                                        <Card :bordered="true" style="text-align: center">
                                          <Tabs type="card">
                                            <TabPane label="模型" >
                                            <Tag>大小：8000*200</Tag>
                                            <Tag>分辨率：72PDI</Tag>
                                            <Tag>坐标：默认归零</Tag>
                                            <Tag>贴面：2000</Tag>
                                            </TabPane>
                                            <TabPane label="PSD">
                                            <Tag>大小：8000*200</Tag>
                                            <Tag>分辨率：72PDI</Tag>
                                            <Tag>坐标：默认归零</Tag>
                                            <Tag>贴面：2000</Tag>
                                            </TabPane>
                                            <TabPane label="贴图">
                                            <Tag>大小：8000*200</Tag>
                                            <Tag>分辨率：72PDI</Tag>
                                            <Tag>坐标：默认归零</Tag>
                                            <Tag>贴面：2000</Tag>
                                            </TabPane>
                                          </Tabs>
                                        </Card>
                                    </div>
                                </FormItem>
                                <h2 style="color: #39f;margin-bottom: 20px">
                                    <Icon type="grid"></Icon>
                                    任务要求
                                </h2>
                                <FormItem label="参考图片">
                                    <div class="demo-upload-list" v-for="item in uploadList" :key="item.uploadList">
                                        <template v-if="item.status === 'finished'">
                                            <img :src="item.url">
                                            <div class="demo-upload-list-cover">
                                                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                        </template>
                                    </div>
                                    <Upload 
                                    name="cert"
                                    ref="upload" 
                                    :show-upload-list="false" 
                                    :default-file-list="defaultList" 
                                    :on-success="handleSuccess" 
                                    :format="['jpg','jpeg','png']" 
                                    :max-size="2048" 
                                    :on-format-error="handleFormatError"
                                    :on-exceeded-size="handleMaxSize"  
                                    :before-upload="handleBeforeUpload" 
                                     multiple 
                                    type="drag" 
                                    :data="{'type':'image'}"
                                    action="http://192.168.2.19/index.php?r=file/file/file-upload" style="display: inline-block;width:80px;">
                                        <div style="width: 80px;height:58px;line-height: 28px;">
                                            <Icon type="camera" size="20"></Icon>
                                            <p>可拖拽上传</p>
                                        </div>
                                    </Upload>
                                </FormItem>
                                <FormItem label="参考附件">
                                    <Upload 
                                    :format="['jpg','jpeg','png']"
                                     multiple
                                    :on-success="fileSuccess" 
                                    :on-format-error="handleFormatError"
                                    :data="{'type':'image'}"
                                     action="http://192.168.2.19/index.php?r=file/file/file-upload">
                                        <Button type="ghost" icon="ios-cloud-upload-outline">上传
                                        </Button>
                                    </Upload>
                                </FormItem>
                                <FormItem label="要求说明">
                                    <Input v-model="addData.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="补充说明"></Input>
                                </FormItem>
                            </Form>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
var qs = require("querystring");
import {
  gettasklistData,
  getChildList,
  cateList,
  getProof,
  uploadFile,
  getFile
} from "../../../../config/env.js";
export default {
  props: ["addData"],
  components: {},
  data() {
    return {
      childList: [],
      setypeClass: [],
      valueTime: "",
      disableTime: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      disableTime2: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      tabs: ["全部成员(33)", "3D模型(11)", "地编组(11)", "次世代(11)"],
      tabContents: [
        ["李霄霄", "王二帅"],
        ["赵三娃", "陈无敌"],
        ["哈哈", "嘻嘻洗洗"],
        ["哇娃娃", "呜呜呜呜"]
      ],
      list1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      num: 1,
      value1: "",
      fruit: [],
      //上传图片
      defaultList: [],
      uploadList: [],
      formLeft: {},
      dataList: []
    };
  },
  mounted() {
    //调用图片上传功能
    this.uploadList = this.$refs.upload.fileList;
    this.getChildId();
    this.getTaskClass();
  },
  methods: {
    handleChange(date) {
      this.addData.expect_start_time = date;
      console.log(date);
    },
    handleChange2(date) {
      this.addData.expect_end_time = date;
      console.log(date);
    },
    close: function() {
      this.$emit("close");
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
    //移除已选参与人
    removePartici(event, name) {
      const index = this.fruit.indexOf(name);
      this.fruit.splice(index, 1);
    },
    /**
     * 上传图片
     */
    // 删除图片
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    // 上传成功返回数据
    handleSuccess(res, file) {
      file.url = res.cert.url;
      console.log(file);
    },
    fileSuccess(res, file){
      file.url = res.file.url;
    },
    //判断图片格式
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式不正确",
        desc: "文件格式 " + file.name + " 不正确，请选择jpg或png"
      });
    },
    //判断图片大小
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件大小超过限制",
        desc: "文件  " + file.name + " 太大了，不能超过2兆。"
      });
    },
    //判断图片最多上传张数
    handleBeforeUpload() {
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: "最多可以上传5张图片。"
        });
      }
      return check;
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
    //获取子列表
    getChildId() {
      let cHd = this;
      this.get(
        gettasklistData,
        {
          project: 1
        },
        res => {
          let childId = res.data.data;
          this.getforEachChild();
        }
      );
    },
    //遍历子项目id
    getforEachChild() {
      let cHd = this;
      this.get(
        getChildList,
        {
          id: cHd.childId
        },
        res => {
          cHd.childList = res.data.data;
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
    setChild(pName) {
      this.addData.project_name = pName;
      console.log(this.addData.project_name);
    },
    setClasst(TypeName) {
      this.addData.tasktype_name = TypeName;
    },
  }
};
</script>

<style scoped>
@import "../../style/taskModal.css";

.smallModal {
  width: 700px;
}
</style>