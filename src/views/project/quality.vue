<template>
  <div class="quality">
    <Tabs value="1" :animated="false" v-model="status" @on-click="changeTabs()">
      <TabPane :label="'内部待审(' + param.num1 + ')'" name="1">
        <my-sort :sortList="ndsSortList" @choiced="filterFTime"></my-sort>
        <div class="screen">
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="4"> 状态:
            <Select v-model="model" style="width:80px">
              <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
            <Col span="4"> 类型:
            <Select v-model="selTaskType" style="width:80px" @on-change="fetchData()">
              <OptionGroup :label="item.name" v-for="(item,index) in taskList" :key="index">
                <Option v-for="items in item.tasktype" :value="items.id" :key="items.id">{{ items.tasktype_name }}</Option>
              </OptionGroup>
            </Select>
            </Col>
            <Col span="4"> 关注:
            <Select v-model="model" style="width:80px">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
            <Col span="12">
            <Input v-model="searchInput" icon="search" placeholder="任务 / 负责人" style="width: 300px;float: right;margin-right: 20px;margin-top: 3px;" @keyup.enter.native="fetchData()"></Input>
            </Col>
          </Row>
        </div>
        <div class="tab-main" :style="`min-height: ${boxHeight}px;`">
          <Row type="flex" justify="start" class="code-row-bg">
            <Col span="8" v-for="(item,index) in fristData" :key="index">
            <div class="card" @click="fetchFileData(item.stage_id,item.stage_file.type,item.stage_file.file,item.task_id)">
              <div class="card-box">
                <!-- <Icon type="heart" color="red" v-if=""></Icon>
                  <Icon type="pause" v-else-if=""></Icon> -->
                <img class="card-box-pic" :src="item.thumb" />
                <div class="tips">
                  <span class="tag">{{item.tasktype_name}}</span>{{item.task_name}}
                  <span class="date">上传：{{item.create_date}}</span>
                </div>
              </div>
              <table class="card-table">
                <tr>
                  <td class="w25">待审天数</td>
                  <td class="w25">完成阶段</td>
                  <td class="w25">剩余时间</td>
                  <td class="w25" rowspan="2">
                    <img class="icon" src="../../images/leader.png" /> {{item.run_uname}}
                  </td>
                </tr>
                <tr class="fb">
                  <td class="w25">
                    <span class="orange-span">{{parseInt((date - item.create_time)/86400)}}</span>/天</td>
                  <td class="w25">
                    <span class="orange-span">{{item.stage}}</span>/{{item.stage_count}}</td>
                  <td class="w25">
                    <span class="orange-span">{{parseInt((item.expect_end_time - date)/86400)}}</span>/天</td>
                </tr>
              </table>
            </div>
            </Col>
          </Row>
          <span class="more" @click="changePageIndex()">{{moreText}}</span>
        </div>
      </TabPane>
      <TabPane :label="'内审已反馈(' + param.num2 + ')'" name="3">
        <my-sort :sortList="nsfkSortList" @choiced="filterSTime"></my-sort>
        <div class="screen">
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="4"> 状态:
            <Select v-model="model" style="width:80px">
              <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
            <Col span="4"> 类型:
            <Select v-model="selTaskType" style="width:80px" @on-change="fetchData()">
              <OptionGroup :label="item.name" v-for="(item,index) in taskList" :key="index">
                <Option v-for="items in item.tasktype" :value="items.id" :key="items.id">{{ items.tasktype_name }}</Option>
              </OptionGroup>
            </Select>
            </Col>
            <Col span="4"> 关注:
            <Select v-model="model" style="width:80px">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
            <Col span="12">
            <Input v-model="value" icon="search" placeholder="任务 / 负责人" style="width: 300px;float: right;margin-right: 20px;margin-top: 3px;"></Input>
            </Col>
          </Row>
        </div>
        <div class="tab-main" :style="`min-height: ${boxHeight}px;`">
          <Row type="flex" justify="start" class="code-row-bg">
            <Col span="8" v-for="(item,index) in thirdData" :key="index">
            <div class="card" @click="fetchFileData(item.stage_id,item.stage_file.type,item.stage_file.file,item.task_id)">
              <div class="card-box">
                <img class="card-box-pic" :src="item.thumb" />
                <div class="tips">
                  <span class="tag">{{item.type}}</span>{{item.task_name}}
                  <span class="date">上传：{{item.create_date}}</span>
                </div>
              </div>
              <table class="card-table">
                <tr>
                  <td class="w25">待审天数</td>
                  <td class="w25">完成阶段</td>
                  <td class="w25">剩余时间</td>
                  <td class="w25">
                    <img class="icon" src="../../images/leader.png" /> {{item.run_uname}}
                  </td>
                </tr>
                <tr class="fb">
                  <td class="w25">
                    <span class="orange-span">{{parseInt((date - item.create_time)/86400)}}</span>/天</td>
                  <td class="w25">
                    <span class="orange-span">{{item.stage}}</span>/{{item.stage_count}}</td>
                  <td class="w25">
                    <span class="orange-span">{{item.surplusTime}}</span>/天</td>
                </tr>
                <tr>
                  <td colspan="4" class="b-border"></td>
                </tr>
                <tr>
                  <td colspan="3">
                    <Icon type="compose"></Icon>
                    <span class="l-padding">{{item.feedback}}</span>
                  </td>
                  <td class="w25">
                    <span class="gray-sapn">{{item.tag_count}}处修改</span>
                  </td>
                </tr>
              </table>
            </div>
            </Col>
          </Row>
          <span class="more" @click="changePageIndex()">{{moreText}}</span>
        </div>
      </TabPane>
      <TabPane :label="'客户待审(' + param.num3 + ')'" name="2">
        <my-sort :sortList="khdsSortList" @choiced="filterTTime"></my-sort>
        <div class="screen">
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="4"> 状态:
            <Select v-model="model" style="width:80px">
              <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
            <Col span="4"> 类型:
            <Select v-model="selTaskType" style="width:80px" @on-change="fetchData()">
              <OptionGroup :label="item.name" v-for="(item,index) in taskList" :key="index">
                <Option v-for="items in item.tasktype" :value="items.id" :key="items.id">{{ items.tasktype_name }}</Option>
              </OptionGroup>
            </Select>
            </Col>
            <Col span="4"> 关注:
            <Select v-model="model" style="width:80px">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
            <Col span="12">
            <Input v-model="value" icon="search" placeholder="任务 / 负责人" style="width: 300px;float: right;margin-right: 20px;margin-top: 3px;"></Input>
            </Col>
          </Row>
        </div>
        <div class="tab-main" :style="`min-height: ${boxHeight}px;`">
          <Row type="flex" justify="start" class="code-row-bg">
            <Col span="8" v-for="item in secondData" :key="item.title">
            <div class="card" @click="fetchFileData(item.stage_id,item.stage_file.type,item.stage_file.file,item.task_id)">
              <div class="card-box">
                <img class="card-box-pic" :src="item.thumb" />
                <div class="tips">
                  <span class="tag">{{item.type}}</span>{{item.task_name}}
                  <span class="date">上传：{{item.create_date}}</span>
                </div>
              </div>
              <table class="card-table">
                <tr>
                  <td class="w25">待审天数</td>
                  <td class="w25">完成阶段</td>
                  <td class="w25">剩余时间</td>
                  <td class="w25" rowspan="2">
                    <img class="icon" src="../../images/leader.png" /> {{item.run_uname}}
                  </td>
                </tr>
                <tr class="fb">
                  <td class="w25">
                    <span class="orange-span">{{parseInt((date - item.create_time)/86400)}}</span>/天</td>
                  <td class="w25">
                    <span class="orange-span">{{item.stage}}</span>/{{item.stage_count}}</td>
                  <td class="w25">
                    <span class="orange-span">{{item.surplusTime}}</span>/天</td>
                </tr>
              </table>
            </div>
            </Col>
          </Row>
          <span class="more" @click="changePageIndex()">{{moreText}}</span>
        </div>
      </TabPane>
      <TabPane :label="'客户已反馈(' + param.num4 + ')'" name="4">
        <my-sort :sortList="khfkSortList" @choiced="filterFoTime"></my-sort>
        <div class="screen">
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="4"> 状态:
            <Select v-model="model" style="width:80px">
              <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
            <Col span="4"> 类型:
            <Select v-model="selTaskType" style="width:80px" @on-change="fetchData()">
              <OptionGroup :label="item.name" v-for="(item,index) in taskList" :key="index">
                <Option v-for="items in item.tasktype" :value="items.id" :key="items.id">{{ items.tasktype_name }}</Option>
              </OptionGroup>
            </Select>
            </Col>
            <Col span="4"> 关注:
            <Select v-model="model" style="width:80px">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
            <Col span="12">
            <Input v-model="value" icon="search" placeholder="任务 / 负责人" style="width: 300px;float: right;margin-right: 20px;margin-top: 3px;"></Input>
            </Col>
          </Row>
        </div>
        <div class="tab-main" :style="`min-height: ${boxHeight}px;`">
          <Row type="flex" justify="start" class="code-row-bg">
            <Col span="8" v-for="item in fourthData" :key="item.title">
            <div class="card" @click="fetchFileData(item.stage_id,item.stage_file.type,item.stage_file.file,item.task_id)">
              <div class="card-box">
                <img class="card-box-pic" src="../../images/logo.png" />
                <div class="tips">
                  <span class="tag">{{item.type}}</span>{{item.title}}
                  <span class="date">上传：{{item.date}}</span>
                </div>
              </div>
              <table class="card-table">
                <tr>
                  <td class="w25">待审天数</td>
                  <td class="w25">完成阶段</td>
                  <td class="w25">剩余时间</td>
                  <td class="w25">
                    <img class="icon" src="../../images/leader.png" /> 张娇颖
                  </td>
                </tr>
                <tr class="fb">
                  <td class="w25">
                    <span class="orange-span">{{item.examineTime}}</span>/天</td>
                  <td class="w25">
                    <span class="orange-span">{{item.stage}}</span>/5</td>
                  <td class="w25">
                    <span class="orange-span">{{item.surplusTime}}</span>/天</td>
                </tr>
                <tr>
                  <td colspan="4" class="b-border"></td>
                </tr>
                <tr>
                  <td colspan="3">
                    <Icon type="compose"></Icon>
                    <span class="l-padding">{{item.message}}</span>
                  </td>
                  <td class="w25">
                    <span class="gray-sapn">{{item.num}}处修改</span>
                  </td>
                </tr>
              </table>
            </div>
            </Col>
          </Row>
          <span class="more" @click="changePageIndex()">{{moreText}}</span>
        </div>
      </TabPane>
    </Tabs>
    <base-model :editData="formLeft" v-show="isTabModal" @close="closeTabmodal" :isDisabled="true">
      <div slot="one">
        <FormItem label="子项目">
          <Select v-model="subpId" :disabled="true">
            <Option v-for="(item,index) in subProjectList" :value="item.id" :key="index">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="任务类型">
          <Select v-model="taskType" :disabled="true">
            <OptionGroup :label="item.name" v-for="(item,index) in taskList" :key="index">
              <Option v-for="items in item.tasktype" :value="items.id" :key="items.id">{{ items.tasktype_name }}</Option>
            </OptionGroup>
            <!-- <Option v-for="item in taskList" :value="item.tasktype_name" :key="item.tasktype_name"></Option> -->
          </Select>
        </FormItem>
      </div>
      <div slot="three">
        <ImgEditor v-if="imgConponent"></ImgEditor>
        <VidEditor v-if="vidConponent"></VidEditor>
        <div v-if="NotType" class="notIMG">暂未上传任务文件</div>
      </div>
       <div slot="two">
        <!-- <div v-show="status == 1">
          <input class="message" type="text" v-model="feedback" placeholder="输入您要反馈的内容" />
          <div class="change">需修改</div>
          <div class="success">通过</div>
        </div> -->
        <div v-show="status == 2" style="margin: 20px 0 0 20px;">
          <ul class="list">
            <li>反馈内容</li>
            <li>反馈结果</li>
            <li>反馈人</li>
            <li>反馈时间</li>
          </ul>
          <ul class="list">
            <li>把以上标注修改即可，把以上标注修改即可把以上标注修改即可</li>
            <li>需修改</li>
            <li>刘德华</li>
            <li>今天/3天前</li>
          </ul>
        </div>
        <div v-show="status == 3" style="margin: 20px 0 0 100px;">
          <ul class="list">
            <li>反馈状态</li>
            <li>反馈人</li>
            <li>等待时间</li>
          </ul>
          <ul class="list">
            <li>客户待审</li>
            <li>四川义美游有限公司</li>
            <li>今天提交/3天前</li>
          </ul>
        </div>
        <div v-show="status == 4" style="margin: 20px 0 0 20px;">
          <ul class="list">
            <li>反馈内容</li>
            <li>反馈结果</li>
            <li>反馈人</li>
            <li>反馈时间</li>
          </ul>
          <ul class="list">
            <li>把以上标注修改即可，把以上标注修改即可把以上标注修改即可</li>
            <li>需修改</li>
            <li>刘德华</li>
            <li>今天/3天前</li>
          </ul>
        </div>
      </div> 
    </base-model>
  </div>
</template>

<script>
var qs = require('querystring');
import baseModel from '../main-components/model/baseModel';
import mySort from '../main-components/sort';
import ImgEditor from '../project/components/imgEditor.vue';
import VidEditor from '../project/components/vedioEditor.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    mySort,
    baseModel,
    ImgEditor,
    VidEditor
  },
  data() {
    return {
      isTabModal: false,
      num: 0,
      date: (Date.parse(new Date())) / 1000,
      showNum: null,
      boxHeight: 300,
      moreText: '加载更多',
      param: {
        num1: 0,
        num2: 0,
        num3: 0,
        num4: 0
      },
      feedback: '',
      status: '1',
      sortStatus: '',
      searchInput: '',
      fristData: [],
      secondData: [],
      thirdData: [],
      fourthData: [],
      handleRender: false,
      imgConponent: false,
      vidConponent: false,
      NotType: false,
      orderBy: 'desc',
      cityList: [
        {
          value: 'New York',
          label: 'New York'
        },
        {
          value: 'London',
          label: 'London'
        },
        {
          value: 'Sydney',
          label: 'Sydney'
        },
        {
          value: 'Ottawa',
          label: 'Ottawa'
        },
        {
          value: 'Paris',
          label: 'Paris'
        },
        {
          value: 'Canberra',
          label: 'Canberra'
        }
      ],
      model: '',
      taskType: '',
      selTaskType: '',
      subpId: null,
      value: '',
      formLeft: {},
      page: 1,
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      ndsSortList: 'getNdsSortList',
      nsfkSortList: 'getNsfkSortList',
      khdsSortList: 'getKhdsSortList',
      khfkSortList: 'getKhfkSortList',
      statusList: 'getStatusList',
      taskList: 'getTaskType',
      subProjectList: 'getSubProjectList'
    })
  },
  created() {
    console.log(this.$children[0],this.$children[1]) 
    this.fetchData();
    this.fetchNum(1);
    this.fetchNum(2);
    this.fetchNum(3);
    this.fetchNum(4);
    this.getTaskList();
  },
  mounted() {
  },
  directives: {
    /**
     * 滚动加载的自定义指令
     */
    scroll: {
      bind: function (el, binding, vnode) {
        window.addEventListener('scroll', vnode.context.scrollLoad)
      },
　　　　//路由转跳到其他页面时，会调用unbind，解绑滚动加载事件。
      unbind: function (el,binding, vnode) {
        window.removeEventListener('scroll', vnode.context.scrollLoad)
      }
    }
  },
  methods: {
    changePageIndex(){
      this.page += 1;
      this.fetchData();
    },
    changeTabs() {
      this.page = 1;
      this.fetchData()
    },
    /**
     * 文件筛选条件
     */
    filterFTime(val) {
      if (val == 0) {
        this.sortStatus = 'create_time';
        this.page = 1;
      } else if (val == 1) {
        this.sortStatus = 'inside_audit_time';
        this.page = 1;
      } else if (val == 2) {
        this.sortStatus = 'expect_end_time';
        this.orderBy = 'asc'
        this.page = 1;
      }
      this.fetchData()
    },
    filterSTime(val) {
      if (val == 0) {
        this.sortStatus = 'inside_audit_time';
        this.page = 1;
      // } else if (val == 1) {
      //   this.sortStatus = 'inside_audit_time';
        // this.page = 1;
      } else if (val == 1) {
        this.sortStatus = 'expect_end_time';
        this.page = 1;
      }
      this.fetchData()
    },
    filterTTime(val) {
      if (val == 0) {
        this.sortStatus = 'inside_audit_time';
        this.page = 1;
      } else if (val == 1) {
        this.sortStatus = 'inside_audit_time';
        this.page = 1;
      } else if (val == 2) {
        this.sortStatus = 'expect_end_time';
        this.page = 1;
      }
      this.fetchData()
    },
    filterFoTime(val) {
      if (val == 0) {
        this.sortStatus = 'client_audit_time';
        this.page = 1;
      } else if (val == 1) {
        this.sortStatus = 'client_audit_time';
        this.page = 1;
      } else if (val == 2) {
        this.sortStatus = 'expect_end_time';
        this.page = 1;
      }
      this.fetchData()
    },
    cancel() {
      this.$Message.info('点击了取消');
    },
    /**
     * 获取文件不同阶段的文件数
     */
    fetchNum(str) {
      let data = {
        status: str + ''
      }
      this.$axios.post(this.GLOBAL.baseRouter+'task/task/stage-page', qs.stringify(data))
        .then(res => res.data)
        .then(res => {
          if (res.err_code == 0) {
            if (str == 1) {
              this.param.num1 = res.page.count
            } else if (str == 3) {
              this.param.num2 = res.page.count
            } else if (str == 2) {
              this.param.num3 = res.page.count
            } else if (str == 4) {
              this.param.num4 = res.page.count
            }
          }
        })
    },
    /**
     * 获取阶段数据
     */
    fetchData() {
      this.searchInput = '';
      this.$Loading.start();
      if(this.status == '1') {
        this.sortStatus = 'create_time';
      } else if(this.status == '2') {
        this.sortStatus = 'inside_audit_time';
      } else if(this.status == '3') {
        this.sortStatus = 'inside_audit_time';
      } else if(this.status == '4') {
        this.sortStatus = 'client_audit_time';
      }
      let data = {
        status: this.status,
        search: this.searchInput,
        order: this.sortStatus,
        tasktype_id: this.selTaskType,
        page: this.page,
        order_by: this.orderBy
      }
      this.$axios.post(this.GLOBAL.baseRouter+'task/task/stage-page', qs.stringify(data))
        .then(res => res.data)
        .then(res => {
          if (res.err_code == 0) {
            if (this.status == '1') {
              if(this.page == 1) {
                this.fristData = res.data
              } else{
                this.fristData.push.apply(this.fristData,res.data);
              }
              this.searchInput = ''
            } else if (this.status == '2') {
              // res.data.forEach((item) => {
              //   this.secondData.push(item)
              // });
              if(this.page == 1) {
                this.secondData = res.data
                // console.log(this.secondData)
              } else{
                this.secondData.push.apply(this.secondData,res.data);
              }
              this.searchInput = ''
            } else if (this.status == '3') {
              if(this.page == 1) {
                this.thirdData = res.data
              } else{
                this.thirdData.push.apply(this.thirdData,res.data);
              }
              // this.thirdData = res.data
              this.searchInput = ''
              res.data.forEach((item) => {
                this.secondData.push(item)
              });
              if(this.page == 1) {
                this.secondData = res.data
              } else{
                this.secondData.push.apply(this.secondData,res.data);
              }
              this.searchInput = ''
            } else if (this.status == '4') {
              if(this.page == 1) {
                this.fourthData = res.data
              } else{
                this.fourthData.push.apply(this.fourthData,res.data);
              }
              // this.fourthData = res.data
              this.searchInput = ''
            }
            // console.log(typeof parseInt(this.page))
            if(parseInt(this.page) == res.page.count_page) {
              this.moreText = '没有更多内容'
            }
            this.$Loading.finish();
          } else {
            this.$Loading.error();
          }
        })
    },
    /**
     * 从store中把任务类型获取出来
     */
    getTaskList() {
      let data = {
        company_id: 1
      }
      this.$store.dispatch('fetchTaskList', qs.stringify(data));
    },
    getSubProject(pId) {
      let data = {
        id: pId
      }
      this.$store.dispatch('fetchSubProject', qs.stringify(data));
    },
    closeTabmodal() {
      this.isTabModal = false;
      // this.taskType = '';
      // this.fetchData();
    },
    /**
     * 获取阶段文件中某个文件的详情
     * 阶段id  必传
     * 阶段  非必传
     */
    fetchFileData(stageId,type,file,taskId) {
      sessionStorage.TaskID=taskId;
      sessionStorage.FileURl=file;
      if(this.status == '1') {
        sessionStorage.AllowEdit='Allow';
      } else {
        sessionStorage.AllowEdit='Other';
      }
      // console.log(sessionStorage.FileURl)
      // 判断文件类型进行组件显示
      if(type=='image'){
        this.imgConponent=true;
        this.vidConponent=false;
        this.NotType=false;
      }else if(type=='video'){
        this.vidConponent=true;
        this.imgConponent=false;
        this.NotType=false;
      }else if(type==undefined){
        this.vidConponent=false;
        this.imgConponent=false;
        this.NotType=false;
      }else if(type=='NotType'){
        this.vidConponent=false;
        this.imgConponent=false;
        this.NotType=true;
      }

      this.$Loading.start();
      this.boxHeight = 0;
      let data = {
        id: stageId
      }
      this.$axios.post(this.GLOBAL.baseRouter+'task/task/stage-info', qs.stringify(data))
        .then(res => res.data)
        .then(res => {
          this.isTabModal = true;
          this.formLeft = res;
          // console.log('formLeft',this.formLeft)
          localStorage.display = 'block'
          this.$Loading.finish();
          this.getSubProject(res.project_id)
          this.taskType = res.tasktype_id
          this.subpId = parseInt(res.project_child_id)
        })
    },
    /**
     * 获取滚动条当前的位置
     */
    getScrollTop() {
      let scrollTop = 0; 
      if (document.documentElement && document.documentElement.scrollTop) { 
        scrollTop = document.documentElement.scrollTop; 
      } else if (document.body) { 
        scrollTop = document.body.scrollTop; 
      } 
      return scrollTop;
    },
    /**
     * 获取当前可视范围的高度
     */
    getClientHeight() {
      let clientHeight = 0; 
      if (document.body.clientHeight && document.documentElement.clientHeight) { 
        clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight); 
      } else { 
        clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight); 
      } 
      return clientHeight; 
    },
    /**
     * 获取文档完整的高度
     */
    getScrollHeight() {
      return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); 
    },
    loadMore() {
      alert('111')
      if (!this.loading) {
        this.loading = true
        // 请求下一页数据
        let data = {
          status: this.status,
          search: this.searchInput,
          order: this.sortStatus,
          tasktype_id: this.taskType,
          page: this.page++
        }
        this.$axios.post(this.GLOBAL.baseRouter+'task/task/stage-page', qs.stringify(data))
          .then(res => res.data)
          .then(res => {
            if (res.err_code == 0) {
              if (this.status == '1') {
                this.fristData.push(res.data)
                this.searchInput = ''
              } else if (this.status == '2') {
                this.secondData.push(res.data)
                this.searchInput = ''
              } else if (this.status == '3') {
                this.thirdData.push(res.data)
                this.searchInput = ''
              } else if (this.status == '4') {
                this.fourthData.push(res.data)
                this.searchInput = ''
              }
            } else {
              this.$Loading.error();
            }
          })
        // 重新填充数据
        // this.lists = this.lists.concat(this.$store.state.lists)
        this.loading = false
      }
    },
    scrollLoad() {
      //滚动条高度（页面被卷去高度）
      // let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      let scrollTop = window.scrollY;
      console.log(scrollTop);
      //滚动条总高度
      // let bodyHeight = document.body.scrollHeight ||  document.documentElement.scrollHeight;
      let bodyHeight = document.body.scrollHeight;
      console.log(bodyHeight,window.innerHeight);

      if (scrollTop + window.innerHeight > bodyHeight) {
        alert('按空格键阿拉山口挂掉了')
        //判断请求发送标志位，避免重复请求(这个需要自己在data里声明，直接贴代码会报错。默认为false，发送请求前改为true， 请求完成回调函数里改回false)
        // if (!this.loading) {
        //   this.loading = true
        //   // 请求下一页数据
        //   let data = {
        //     status: this.status,
        //     search: this.searchInput,
        //     order: this.sortStatus,
        //     tasktype_id: this.taskType,
        //     page: this.page++
        //   }
        //   this.$axios.post(this.GLOBAL.baseRouter+'task/task/stage-page', qs.stringify(data))
        //     .then(res => res.data)
        //     .then(res => {
        //       if (res.err_code == 0) {
        //         if (this.status == '1') {
        //           this.fristData.push(res.data)
        //           this.searchInput = ''
        //         } else if (this.status == '2') {
        //           this.secondData.push(res.data)
        //           this.searchInput = ''
        //         } else if (this.status == '3') {
        //           this.thirdData.push(res.data)
        //           this.searchInput = ''
        //         } else if (this.status == '4') {
        //           this.fourthData.push(res.data)
        //           this.searchInput = ''
        //         }
        //       } else {
        //         this.$Loading.error();
        //       }
        //     })
        //   // 重新填充数据
        //   // this.lists = this.lists.concat(this.$store.state.lists)
        //   this.loading = false
        // }
      }
    }
  }
}
</script>

<style lang='less'>
@import "./style/project.less";
</style>