<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal">
        <div class="modal-header">
          <div class=""></div>
          <Row :gutter="100">
            <Col span="1">
            <Icon type="ios-star-outline" size="23"></Icon>
            </Col>
            <Col span="1">
            <div>
              <Icon type="ios-trash-outline" size="23" style="cursor: pointer;position: absolute;z-index: 999999;display: inline-block;"></Icon>
            </div>
            </Col>
            <Col span="2">
            <button type="button" class="btn-close" @click="close">x</button>
            </Col>
          </Row>
        </div>
        <div class="modal-body">
          <!-- 基本管理数据 -->
          <Tabs type="card">
            <TabPane label="基本管理">
              <div>
                <Row>
                  <Col span="7">
                  <Form label-position="left" :label-width="80">
                    <FormItem label="任务名称">
                      <Input v-model="editData.name"></Input>
                    </FormItem>
                    <FormItem label="开始时间">
                      <DatePicker :value="editData.expect_start_date" @on-change="handleChange" format="yyyy-MM-dd" type="date" :options="disableTime" placeholder="选择时间" style="width: 100%"></DatePicker>
                    </FormItem>
                    <FormItem label="结束时间">
                      <DatePicker :value="editData.expect_end_date" @on-change="handleChange2" format="yyyy-MM-dd" type="date" :options="disableTime2" placeholder="选择时间" style="width: 100%"></DatePicker>
                    </FormItem>
                    <FormItem label="子项目">
                      <Select @on-change='setChild' v-model="editData.project_child">
                        <Option v-for="(item,childName) in childList" :value="item.child_id" :key="item.child_id">{{item.name}}</Option>
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
                    </FormItem>
                    <FormItem label="任务类型">
                      <Select @on-change="setClasst" v-model="editData.tasktype_name">
                        <Option v-for="(item,typeClass) in setypeClass" :value="item.tasktype_name" :key="item.tasktype_name">{{item.tasktype_name}}</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="文件要求">
                      <div>
                        <Card :bordered="true" style="text-align: center">
                          <Row :gutter="16">
                            <Col span="8">
                            <div class="car-bg">模型</div>
                            </Col>
                            <Col span="8">
                            <div>PSD</div>
                            </Col>
                            <Col span="8">
                            <div>贴图</div>
                            </Col>
                          </Row>
                          <Tag>大小：8000*200</Tag>
                          <Tag>分辨率：72PDI</Tag>
                          <Tag>坐标：默认归零</Tag>
                          <Tag>贴面：2000</Tag>
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
                            <!--<Icon type="ios-eye-outline"-->
                            <!--@click.native="handleView(item.name)"></Icon>-->
                            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                          </div>
                        </template>
                        <template v-else>
                          <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                        </template>
                      </div>
                      <Upload name="cert" ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" multiple type="drag" :data="{'type':'image'}" action="http://192.168.2.19/index.php?r=file/file/file-upload" style="display: inline-block;width:80px;">
                        <div style="width: 80px;height:58px;line-height: 28px;">
                          <Icon type="camera" size="20"></Icon>
                          <p>可拖拽上传</p>
                        </div>
                      </Upload>
                    </FormItem>
                    <FormItem label="参考附件">
                      <Upload :format="['jpg','jpeg','png']" :data="{'type':'image'}" :on-success="fileSuccess" multiple action="http://192.168.2.19/index.php?r=file/file/file-upload">
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传
                        </Button>
                      </Upload>
                    </FormItem>
                    <FormItem label="要求说明">
                      <Input v-model="editData.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                  </Form>
                  </Col>
                  <Col span="16">
                  <three-dmodel></three-dmodel>
                  </Col>
                </Row>
              </div>
              <div class="modal-footer">
                <slot name="footer">
                  <Button @click="close" class="btn-green">取消</Button>
                  <Button type="primary" @click="editmodal" class="btn-green">保存修改</Button>
                </slot>
              </div>
            </TabPane>
            <!-- 子任务数据 -->
            <TabPane label="子任务">
              <Row>
                <Col span="16">
                <div class="subtaskArea">
                  <Progress :percent="45" status="active" style="margin-bottom: 30px"></Progress>
                  <Button type="primary" size="small" style="margin-bottom: 10px">增加子任务</Button>
                  <Table border :columns="columnsTask" :data="dataList"></Table>
                </div>
                </Col>
                <Col span="7">
                <div>
                  <Form label-position="left" :label-width="80">
                    <FormItem label="任务名称">
                      <Input v-model="editData.name"></Input>
                    </FormItem>
                    <FormItem label="开始时间">
                      <DatePicker :value="editData.expect_start_date" @on-change="handleChange" format="yyyy-MM-dd" type="date" :options="disableTime" placeholder="选择时间" style="width: 100%"></DatePicker>
                    </FormItem>
                    <FormItem label="结束时间">
                      <DatePicker :value="editData.expect_end_date" @on-change="handleChange2" format="yyyy-MM-dd" type="date" :options="disableTime2" placeholder="选择时间" style="width: 100%"></DatePicker>
                    </FormItem>
                    <FormItem label="子项目">
                      <Select @on-change='setChild' v-model="editData.project_child">
                        <Option v-for="(item,childName) in childList" :value="item.child_id" :key="item.child_id">{{item.name}}</Option>
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
                    </FormItem>
                    <FormItem label="任务类型">
                      <Select @on-change="setClasst" v-model="editData.tasktype_name">
                        <Option v-for="(item,typeClass) in setypeClass" :value="item.tasktype_name" :key="item.tasktype_name">{{item.tasktype_name}}</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="文件要求">
                      <div>
                        <Card :bordered="true" style="text-align: center">
                          <Tabs type="card">
                            <TabPane label="模型">
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
                            <!--<Icon type="ios-eye-outline"-->
                            <!--@click.native="handleView(item.name)"></Icon>-->
                            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                          </div>
                        </template>
                        <template v-else>
                          <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                        </template>
                      </div>
                      <Upload name="cert" ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" multiple type="drag" :data="{'type':'image'}" action="http://192.168.2.19/index.php?r=file/file/file-upload" style="display: inline-block;width:80px;">
                        <div style="width: 80px;height:58px;line-height: 28px;">
                          <Icon type="camera" size="20"></Icon>
                          <p>可拖拽上传</p>
                        </div>
                      </Upload>
                    </FormItem>
                    <FormItem label="参考附件">
                      <Upload :format="['jpg','jpeg','png']" :data="{'type':'image'}" :on-success="fileSuccess" multiple action="http://192.168.2.19/index.php?r=file/file/file-upload">
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传
                        </Button>
                      </Upload>
                    </FormItem>
                    <FormItem label="要求说明">
                      <Input v-model="editData.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                  </Form>
                </div>
                </Col>
              </Row>
            </TabPane>
            <TabPane label="日志">
              <jou-rnal></jou-rnal>
            </TabPane>
          </Tabs>
        </div>

      </div>
    </div>
  </transition>
</template>
<script>
var qs = require("querystring");
import threeDmodel from "./modalTab/beaN/threeDmodel";
import jouRnal from "./modalTab/jouRnal/jouRnal";
import {
  projectList,
  projDatali,
  cateList,
  updatetaskData,
} from "@/config/env.js";
export default {
  props: ["editData"],
  components: {
    threeDmodel,
    jouRnal
  },
  // props: ['show'],
  data() {
    return {
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
                      // this.remove(params.index)
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
      dataList: [],
      handleUrl: [],
      fileUrl: [],
      childList: [],
      setypeClass: [],
      project_child: "",
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
      formLeft: {}
    };
  },
  created() {
    let str;
    let arr = [];
    let image = this.editData.image;
    if (image) {
      image.forEach(im => {
        arr.push({
          url: im
        });
      });
      this.defaultList = arr;
      this.handleUrl = image;
    }
  },
  mounted() {
    //调用图片上传功能
    this.uploadList = this.$refs.upload.fileList;
    this.getProjectId();
    this.getTaskClass();
    this.forEachData();
  },
  methods: {
    //保存编辑数据
    editmodal: function() {
      let cIs = this;
      let dateForm = {};
      dateForm.id = cIs.editData.id;
      dateForm.father = cIs.editData.father ? cIs.editData.father : 0;
      dateForm.name = cIs.editData.name;
      dateForm.project = cIs.editData.project_id;
      dateForm.project_child = cIs.editData.project_child;
      dateForm.tasktype_id = cIs.editData.tasktype_id
        ? cIs.editData.tasktype_id
        : 0;
      dateForm.expect_start_time = cIs.editData.expect_start_time;
      dateForm.expect_end_time = cIs.editData.expect_end_time;
      dateForm.description = cIs.editData.description;
      dateForm.image = JSON.stringify(cIs.handleUrl);
      dateForm.file = cIs.fileUrl;
      cIs.$axios
        .post("/task/task/update", qs.stringify(dateForm))
        .then(res => {
          if (res.data.err_code === 0) {
            cIs.$emit("close");
            this.$Message.success("编辑任务成功！");
          } else {
            this.$Message.error("编辑任任务失败，请重试！");
          }
        })
        .catch(error => {
          this.$Message.error("编辑任务失败，请重试！");
        });
    },
    handleChange(date) {
      this.editData.expect_start_date = date;
    },
    handleChange2(date) {
      this.editData.expect_end_date = date;
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
      this.handleUrl.push(file.url);
    },
    // 上传附件成功后返回
    fileSuccess(res, file) {
      file.url = res.affix.url;
      this.editData.fileName = file.name;
      this.fileUrl.push(file.url);
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
        desc: "文件  " + file.name + " 太大了，不超过2M。"
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
    //遍历子任务列表数据
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
        projDatali,
        {
          id: Hid.prId
        },
        res => {
          //获取子项目列表
          Hid.childList = res.data.child;
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
      this.editData.project_child = pName;
    },
    setClasst(TypeName) {
      this.editData.tasktype_name = TypeName;
    }
  }
};
</script>
<style scoped>
@import "../style/taskModal.css";
</style>
