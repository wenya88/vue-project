<template>
  <div class="quality">
    <Tabs value="1" :animated="false" v-model="status" @on-click="fetchData()">
      <TabPane :label="'内部待审(' + param.num1 + ')'" name="1">
        <my-sort :sortList="ndsSortList" @choiced="filterTime"></my-sort>
        <div class="screen">
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="4"> 状态:
            <Select v-model="model" style="width:80px">
              <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
            <Col span="4"> 类型:
            <Select v-model="taskType" style="width:80px" @on-change="fetchData()">
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
            <Col span="10">
              <Input 
              v-model="searchInput" 
              icon="search" 
              placeholder="任务 / 负责人" 
              style="width: 300px;float: right;margin-right: 20px;margin-top: 3px;"
              @keyup.enter.native="fetchData()"></Input>
            </Col>
          </Row>
        </div>
        <div class="tab-main">
          <Row type="flex" justify="start" class="code-row-bg">
            <Col span="8" v-for="(item,index) in fristData" :key="index">
            <div class="card" @click="fetchFileData(item.task_id, item.stage)">
              <div class="card-box">
                <!-- <Icon type="heart" color="red" v-if=""></Icon>
                <Icon type="pause" v-else-if=""></Icon> -->
                <img class="card-box-pic" :src="item.thumb"/>
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
        </div>
      </TabPane>
      <TabPane :label="'内审已反馈(' + param.num2 + ')'" name="2">
        <my-sort :sortList="nsfkSortList" @choiced="filterTime"></my-sort>
        <div class="screen">
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="4"> 状态:
            <Select v-model="model" style="width:80px">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
            <Col span="4"> 类型:
            <Select v-model="model" style="width:80px">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
        <div class="tab-main">
          <Row type="flex" justify="start" class="code-row-bg">
            <Col span="8" v-for="(item,index) in secondData" :key="index">
            <div class="card" @click="modal1 = true">
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
        </div>
      </TabPane>
      <TabPane :label="'客户待审(' + param.num3 + ')'" name="3">
        <my-sort :sortList="khdsSortList" @choiced="filterTime"></my-sort>
        <div class="screen">
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="4"> 状态:
            <Select v-model="model" style="width:80px">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
            <Col span="4"> 类型:
            <Select v-model="model" style="width:80px">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
        <div class="tab-main">
          <Row type="flex" justify="start" class="code-row-bg">
            <Col span="8" v-for="item in thirdData" :key="item.title">
            <div class="card" @click="handleRender = true">
              <div class="card-box">
                <img class="card-box-pic" :src="item.thumb"/>
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
        </div>
      </TabPane>
      <TabPane :label="'客户已反馈(' + param.num4 + ')'" name="4">
        <my-sort :sortList="khfkSortList" @choiced="filterTime"></my-sort>
        <div class="screen">
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="4"> 状态:
            <Select v-model="model" style="width:80px">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
            <Col span="4"> 类型:
            <Select v-model="model" style="width:80px">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
        <div class="tab-main">
          <Row type="flex" justify="start" class="code-row-bg">
            <Col span="8" v-for="item in fourthData" :key="item.title">
            <div class="card" @click="modal1 = true">
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
        </div>
      </TabPane>
    </Tabs>
    <tab-modal :editData="formLeft" v-show="isTabModal" @close="closeTabmodal"></tab-modal>
  </div>
</template>

<script>
var qs = require('querystring');
import tabModal from './components/task/tabModal';
import mySort from '../main-components/sort'
import { mapGetters } from 'vuex'
export default {
  components: {
    mySort,
    tabModal
  },
  data() {
    return {
      isTabModal: false,
      num: 0,
      date: (Date.parse(new Date()))/1000,
      showNum: null,
      param: {
        num1: 0,
        num2: 0,
        num3: 0,
        num4: 0
      },
      status: '1',
      sortStatus: '',
      searchInput: '',
      fristData: [],
      secondData: [],
      thirdData: [],
      fourthData: [],
      handleRender: false,
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
      value: '',
      formLeft: {
        id: '',
        name: '',
        project: '',
        project_child: '',
        tasktype_id: '',
        expect_start_time: '',
        expect_end_time: '',
        run_uname: '',
        stage_name: ''
      },
      dataList: []
    }
  },
  computed: {
    ...mapGetters({
      ndsSortList: 'getNdsSortList',
      nsfkSortList: 'getNsfkSortList',
      khdsSortList: 'getKhdsSortList',
      khfkSortList: 'getKhfkSortList',
      statusList: 'getStatusList',
      taskList: 'getTaskType'
    })
  },
  created() {
    this.fetchData();
    this.fetchNum(1);
    this.fetchNum(2);
    this.fetchNum(3);
    this.fetchNum(4);
    this.getTaskList();
  },
  methods: {
    /**
     * 文件筛选条件
     */
    filterTime(val) {
      if(val == 0) {
        this.sortStatus = 'create_time'
      } else if(val == 1) {
        this.sortStatus = 'inside_audit_time'
      } else if(val == 2) {
        this.sortStatus = 'client_audit_time'
      }
      this.fetchData()
    },
    cancel(){
      this.$Message.info('点击了取消');
    },
    /**
     * 获取文件不同阶段的文件数
     */
    fetchNum(str) {
      let data = {
        status: str + ''
      }
      this.$axios.post('/task/stage-page', qs.stringify(data))
      .then(res => res.data)
      .then(res => {
        if(res.err_code == 0) {
          if(str == 1) {
            this.param.num1 = res.page.count
          } else if(str == 2) {
            this.param.num2 = res.page.count
          } else if(str == 3) {
            this.param.num3 = res.page.count
          } else if(str == 4) {
            this.param.num4 = res.page.count
          }
        }
      })
    },
    /**
     * 获取阶段数据
     */
    fetchData() {
      this.$Loading.start();
      let data = {
          status: this.status,
          search: this.searchInput,
          order: this.sortStatus,
          tasktype_id: this.taskType
      }
      this.$axios.post('/task/stage-page', qs.stringify(data))
      .then(res => res.data)
      .then(res => {
        if(res.err_code == 0) {
          if(this.status == '1') {
            this.fristData = res.data
            this.searchInput = ''
          } else if(this.status == '2') {
            this.secondData = res.data
            this.searchInput = ''
          } else if(this.status == '3') {
            this.thirdData = res.data
            this.searchInput = ''
          } else if(this.status == '4') {
            this.fourthData = res.data
            this.searchInput = ''
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
    showTabmodal() {
      this.isTabModal = true
      this.formLeft = this.dataList[index]
    },
    closeTabmodal() {

    },
    /**
     * 获取阶段文件中某个文件的详情
     * 任务id  必传
     * 阶段  非必传
     */
    fetchFileData(fileId,sNum) {
      this.$Loading.start();
      let data = {
        task_id: fileId,
        stage: sNum
      }
      this.$axios.post('/task/stage-list', qs.stringify(data))
      .then(res => res.data)
      .then(res => {
        console.log(res)
        this.isTabModal = true
        this.$Loading.finish();
      })
    }
  }
}
</script>

<style lang='less'>
@import "./style/project.less";
</style>