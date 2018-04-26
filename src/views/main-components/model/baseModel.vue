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
          <div>
            <Row>
              <Col span="7">
              <Form label-position="left" :label-width="80">
                <FormItem label="任务名称">
                  <Input v-model="editData.task_name" :disabled="isDisabled"></Input>
                </FormItem>
                <FormItem label="开始时间">
                  <DatePicker :value="editData.create_time" @on-change="handleChange" format="yyyy-MM-dd" type="date" :options="disableTime" placeholder="选择时间" style="width: 100%" :disabled="isDisabled"></DatePicker>
                </FormItem>
                <FormItem label="结束时间">
                  <DatePicker :value="editData.expect_end_time" @on-change="handleChange2" format="yyyy-MM-dd" type="date" :options="disableTime2" placeholder="选择时间" style="width: 100%" :disabled="isDisabled"></DatePicker>
                </FormItem>
                <!-- <FormItem label="子项目">
                  <Select v-model="subpId" :disabled="isDisabled">
                    <Option v-for="item in subpList" :value="item.id" :key="item.project">{{item.name}}</Option>
                  </Select>
                </FormItem> -->
                <FormItem label="参与人">
                  <Tag v-for="item in fruit" :key="item.fruit" :name="item" closable @on-close="removePartici" type="border">{{item}}
                  </Tag>
                  <Dropdown trigger="click" class="dropBig">
                    <a href="javascript:void(0)">
                      <Button icon="ios-plus-empty" type="dashed" size="small" :disabled="isDisabled">
                        添加
                      </Button>
                    </a>
                    <DropdownMenu slot="list">
                      <Input v-model="value1" placeholder="参与人姓名/名字首字母" clearable style="width: 100%" :disabled="isDisabled"></Input>
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
                                <CheckboxGroup v-model="editData.fruit">
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
                <slot name="one"></slot> 
                <!-- <FormItem label="任务类型">
                  <Select v-model="taskType" :disabled="isDisabled">
                    <OptionGroup :label="item.name" v-for="(item,index) in taskList" :key="index">
                      <Option v-for="items in item.tasktype" :value="items.id" :key="items.id">{{ items.tasktype_name }}</Option>
                    </OptionGroup>  -->
                    <!-- <Option v-for="item in taskList" :value="item.tasktype_name" :key="item.tasktype_name"></Option> -->
                  <!-- </Select>
                </FormItem> -->
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
                  <Upload ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" multiple type="drag" action="//jsonplaceholder.typicode.com/posts/" style="display: inline-block;width:80px;">
                    <div style="width: 80px;height:58px;line-height: 28px;">
                      <Icon type="camera" size="20"></Icon>
                      <p>可拖拽上传</p>
                    </div>
                  </Upload>
                </FormItem>
                <FormItem label="参考附件">
                  <Upload :format="['jpg','jpeg','png']" multiple action="//jsonplaceholder.typicode.com/posts/">
                    <Button type="ghost" icon="ios-cloud-upload-outline">上传
                    </Button>
                  </Upload>
                </FormItem>
                <FormItem label="要求说明">
                  <Input v-model="editData.name" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="补充说明"></Input>
                  <!--@on-blur="blurTj()"-->
                </FormItem>
              </Form>
              </Col>
              <Col span="16">
              <three-dmodel></three-dmodel>
              <div class="edit">
                <slot name="two"></slot> 
              </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import threeDmodel from '../../project/components/task/modalTab/beaN/threeDmodel';

export default {
  name: 'baseModel',
  // props: ['editData'],
  props: {
    editData: {
      type: Object,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    // subpId: {    //子项目id
    //   type: Number,
    //   default: null
    // },
    // subpList: {     //子项目数组
    //   type: Array,
    //   default: []
    // },
    // taskType: {   //任务类型
    //   type: String,
    //   default: ''
    // },
    // taskList: {    //任务类型数组
    //   type: Array,
    //   default: []
    // }
  },
  components: {
    threeDmodel
  },
  data() {
    return {
      seleData: '',
      // subpList: [],
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
      tabs: [
        "全部成员(33)",
        "3D模型(11)",
        "地编组(11)",
        "次世代(11)"
      ],
      tabContents: [
        ['李霄霄', '王二帅'],
        ['赵三娃', '陈无敌'],
        ['哈哈', '嘻嘻洗洗'],
        ['哇娃娃', '呜呜呜呜',]
      ],
      list1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      num: 1,
      value1: '',
      fruit: [],
      //上传图片
      defaultList: [
        {
          'name': 'a42bdcc1178e62b4694c830f028db5c0',
          'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
        },
        {
          'name': 'bc7521e033abdd1e92222d733590f104',
          'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
        }
      ],
      uploadList: [],
      formLeft: {
        name: '',
        tasktype_name: '',
        expect_start_date: '',
        expect_end_date: '',
        dtasktype_name: '',
        project: ''
      },
      dataList: []
    }
  },
  mounted() {
    //调用图片上传功能
    this.uploadList = this.$refs.upload.fileList;
  },
  methods: {
    handleChange(date) {
      this.editData.expect_start_time = date;
      console.log(date);
    },
    handleChange2(date) {
      this.editData.expect_end_time = date;
      console.log(date);
    },
    close: function() {
      this.$emit('close');
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
      file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
      file.name = '7eb99afb9d5f317c912f08b5212fd69a';
    },
    //判断图片格式
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件格式 ' + file.name + ' 不正确，请选择jpg或png'
      });
    },
    //判断图片大小
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '文件大小超过限制',
        desc: '文件  ' + file.name + ' 太大了，不超过2M。'
      });
    },
    //判断图片最多上传张数
    handleBeforeUpload() {
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: '最多可以上传5张图片。'
        });
      }
      return check;
    },
  }
}
</script>
<style scoped>
@import "../../project/style/taskModal.css";
.edit{
  margin-left: 20px;
}
</style>
