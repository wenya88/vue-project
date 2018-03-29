<template>
  <div class="quality">
    <Tabs value="1" :animated="false" v-model="status" @on-click="fetchData()">
      <TabPane :label="fristName" name="1">
        <ul class="sort">
          <li v-for="(item,index) in sortList" :key="index" :class="{'actived': num == index}" @click="choseSort(index)">
            <Icon :type='item.icon'></Icon>{{item.label}}</li>
        </ul>
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
            <Col span="10">
              <Input 
              v-model="searchInput" 
              icon="search" 
              placeholder="项目 / 负责人" 
              style="width: 300px;float: right;margin-right: 20px;margin-top: 3px;"
              @keyup.enter.native="fetchData()"></Input>
            </Col>
          </Row>
        </div>
        <div class="tab-main">
          <Row type="flex" justify="start" class="code-row-bg">
            <Col span="8" v-for="(item,index) in fristData" :key="index">
            <div class="card" @click="handleRender = true">
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
      <TabPane :label="secondName" name="2">
        <ul class="sort">
          <li v-for="(item,index) in sortList" :key="index" :class="{'actived': num == index}" @click="choseSort(index)">
            <Icon :type='item.icon'></Icon>{{item.label}}</li>
        </ul>
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
              <Input v-model="value" icon="search" placeholder="项目 / 负责人" style="width: 300px;float: right;margin-right: 20px;margin-top: 3px;"></Input>
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
                    <img class="icon" src="../../images/logo.png" /> {{item.run_uname}}
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
      <TabPane :label="thirdName" name="3">
        <ul class="sort">
          <li v-for="(item,index) in sortList" :key="index" :class="{'actived': num == index}" @click="choseSort(index)">
            <Icon :type='item.icon'></Icon>{{item.label}}</li>
        </ul>
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
              <Input v-model="value" icon="search" placeholder="项目 / 负责人" style="width: 300px;float: right;margin-right: 20px;margin-top: 3px;"></Input>
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
                    <img class="icon" src="../../images/logo.png" /> {{item.run_uname}}
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
      <TabPane :label="fourthName" name="4">
        <ul class="sort">
          <li v-for="(item,index) in sortList" :key="index" :class="{'actived': num == index}" @click="choseSort(index)">
            <Icon :type='item.icon'></Icon>{{item.label}}</li>
        </ul>
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
              <Input v-model="value" icon="search" placeholder="项目 / 负责人" style="width: 300px;float: right;margin-right: 20px;margin-top: 3px;"></Input>
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
                    <img class="icon" src="../../images/logo.png" /> 张娇颖
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
    <Modal :styles="{top: '30px'}" v-model="handleRender" width="1300" @on-cancel="cancel">
      <div class="icon-header">
        <Row :gutter="40">
          <Col span="4">
          <Icon type="ios-star-outline" size="23"></Icon>
          </Col>
          <Col span="4">
          <Icon type="ios-trash-outline" size="23"></Icon>
          </Col>
        </Row>
      </div>
      <div slot="header">
      </div>
      <!-- <bea-n :datl="formLeft"></bea-n> -->
      <div slot="footer">
          <!--<Button type="error" size="large">ssd</Button>-->
      </div>
    </Modal>
  </div>
</template>

<script>
import beaN from './components/beaN';
// import axios from 'axios'
import {fetchstagetaskData} from "../../config/env.js";
export default {
  data() {
    return {
      num: 0,
      date: (Date.parse(new Date()))/1000,
      showNum: null,
      param: {
        num1: 0,
        num2: 0,
        num3: 0,
        num4: 0
      },
      fristName: '',
      secondName: '',
      thirdName: '',
      fourthName: '',
      status: '1',
      searchInput: '',
      fristData: [],
      secondData: [],
      thirdData: [],
      fourthData: [],
      sortList: [
        {
          label: '等待修改',
          icon: 'ios-arrow-thin-down'
        }, {
          label: '反馈时间',
          icon: 'ios-arrow-thin-down'
        }, {
          label: '剩余时间',
          icon: 'ios-arrow-thin-up'
        }
      ],
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
      value: '',
      formLeft: {
        name: '',
      }
    }
  },
  created() {
    this.fetchData()
    console.log(this.param.num1)
  },
  mounted() {
    let _this = this
    _this.fristName = '内部待审(' + _this.param.num1 + ')'
    _this.secondName = '内审已反馈(' + _this.param.num2 + ')'
    _this.thirdName = '客户待审(' + _this.param.num3 + ')'
    _this.fourthName = '客户已反馈(' + _this.param.num4 + ')'
  },
  methods: {
    choseSort(ide) {
      this.num = ide
      this.fetchData()
    },
    cancel(){
      this.$Message.info('点击了取消');
    },
    // get(url, params, call) {
    //   /*获取列表信息*/
    //   this.$http.get(url,{params: params}).then(function (res) {
    //     call(res);
    //   }, function (error) {
    //   });
    // },
    fetchData() {   //获取阶段数据
      let _this = this;
      let data = {
        status: _this.status,
        search: _this.searchInput
      }
      _this.$axios.get(fetchstagetaskData+'&status='+_this.status+'&search='+_this.searchInput)
      // _this.$axios.post('/task/stage-page',data)
      // _this.$axios({
      //     method: 'post',
      //     url: '/task/stage-page',
      //     data: data
      //   })
      .then(res => res.data)
      .then(res => {
        // let date = (Date.parse(new Date()))/1000;
        // console.log(date)
        if(res.err_code == 0) {
          if(_this.status == '1') {
            _this.fristData = res.data
            _this.searchInput = ''
            _this.param.num1 = res.page.count
          } else if(_this.status == '2') {
            _this.secondData = res.data
            _this.searchInput = ''
            _this.param.num2 = res.page.count
          } else if(_this.status == '3') {
            _this.thirdData = res.data
            _this.searchInput = ''
            _this.param.num3 = res.page.count
          } else if(_this.status == '4') {
            _this.fourthData = res.data
            _this.searchInput = ''
            _this.param.num4 = res.page.count
          }
        }
      })
      // _this.get(fetchstagetaskData,data,(res) => {
      //     console.log(res.data)
      //   }
      // );
    }
  }
}
</script>

<style lang='less'>
@import "./style/project.less";
</style>