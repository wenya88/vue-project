<template>
  <div class="quality">
    <Tabs value="name1" :animated="false" v-model="status">
      <TabPane :label="fristName" name="name1">
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
              <Input v-model="searchInput" icon="search" placeholder="项目 / 负责人" style="width: 300px;float: right;margin-right: 20px;margin-top: 3px;"></Input>
            </Col>
          </Row>
        </div>
        <div class="tab-main">
          <Row type="flex" justify="start" class="code-row-bg">
            <Col span="8" v-for="(item,index) in fristData" :key="item.title">
            <div class="card" @click="handleRender = true">
              <div class="card-box">
                <img class="card-box-pic" src="../../images/logo.png"/>
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
                  <td class="w25" rowspan="2">
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
              </table>
            </div>
            </Col>
          </Row>
        </div>
      </TabPane>
      <TabPane :label="secondName" name="name2">
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
            <Col span="8" v-for="item in secondData" :key="item.title">
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
      <TabPane :label="thirdName" name="name3">
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
                  <td class="w25" rowspan="2">
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
              </table>
            </div>
            </Col>
          </Row>
        </div>
      </TabPane>
      <TabPane :label="fourthName" name="name4">
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
      <bea-n :datl="formLeft"></bea-n>
      <div slot="footer">
          <!--<Button type="error" size="large">ssd</Button>-->
      </div>
    </Modal>
  </div>
</template>

<script>
import beaN from './modal/beaN';
import {fetchstagetaskData} from "../../config/env.js";
export default {
  data() {
    return {
      num: 0,
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
      status: '',
      searchInput: '',
      fristData: [
        {
          type: '场景',
          title: '宇宙之战杀人之机器人',
          date: '2017-1-6 14:16',
          examineTime: 5,
          stage: 3,
          surplusTime: 12
        }, {
          type: '场景',
          title: '宇宙之战杀人之机器人',
          date: '2017-1-6 14:16',
          examineTime: 5,
          stage: 3,
          surplusTime: 12
        }, {
          type: '场景',
          title: '宇宙之战杀人之机器人',
          date: '2017-1-6 14:16',
          examineTime: 5,
          stage: 3,
          surplusTime: 12
        }
      ],
      secondData: [
        {
          type: '场景',
          title: '宇宙之战杀人之机器人',
          date: '2017-1-6 14:16',
          examineTime: 5,
          stage: 3,
          surplusTime: 12,
          message: '整体风格一点都不Q，麻烦请按需求来',
          num: 15
        }
      ],
      thirdData: [
        {
          type: '场景',
          title: '宇宙之战杀人之机器人',
          date: '2017-1-6 14:16',
          examineTime: 5,
          stage: 3,
          surplusTime: 12
        }
      ],
      fourthData: [
        {
          type: '场景',
          title: '宇宙之战杀人之机器人',
          date: '2017-1-6 14:16',
          examineTime: 5,
          stage: 3,
          surplusTime: 12,
          message: '整体风格一点都不Q，麻烦请按需求来',
          num: 15
        }
      ],
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
  mounted() {
    this.fristName = '内部待审(' + this.param.num1 + ')'
    this.secondName = '内审已反馈(' + this.param.num2 + ')'
    this.thirdName = '客户待审(' + this.param.num3 + ')'
    this.fourthName = '客户已反馈(' + this.param.num4 + ')'
  },
  methods: {
    choseSort(ide) {
      this.num = ide
    },
    cancel(){
      this.$Message.info('点击了取消');
    },
    fetchData() {   //获取阶段数据
      let _this = this;
      let data = {
        status: this.status,
        search: this.searchInput
      }
      this.post(fetchstagetaskData,data,(res) => {
          //任务类型状态
          let dataColortd = res.data.data;
          for(var i=0;i<dataColortd.length;i++){
            let colorText = res.data.data[i].status_text;
            if (colorText === '等待开始'){
              res.data.data[i].cellClassName = { status_text : "demo-table-info-cell-start" }
            }else if(colorText === '执行中'){
              res.data.data[i].cellClassName = { status_text : "demo-table-info-cell-execution" }
            }else if(colorText === '暂停'){
              res.data.data[i].cellClassName = { status_text : "demo-table-info-cell-pause" }
            }else if(colorText === '完成'){
              res.data.data[i].cellClassName = { status_text : "demo-table-info-cell-complete" }
            };
            //判断主列表下是否含有子列表
            if (dataColortd[i].child != undefined ){
              res.data.data[i]._expanded = false;
            }else {
              res.data.data[i]._disableExpand = true;
            }
          }
          cIs.dataList = res.data.data;
        }
      );
    }
  }
}
</script>

<style lang='less'>
@import "./project.less";
</style>