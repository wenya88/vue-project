<template>
  <div class="pigeonhole">
    <div class="handleBox">
      <Row type="flex" justify="space-between" class="code-row-bg">
        <Col span="16">
        <Button type="primary">全部下载</Button>
        </Col>
        <Col span="2"> 类型:
        <Select v-model="model" style="width:80px">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        </Col>
        <Col span="2"> 关注:
        <Select v-model="model" style="width:80px">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        </Col>
        <Col span="4">
          <Input 
          v-model="searchInput" 
          icon="search" 
          placeholder="项目 / 负责人" 
          style="width: 200px;float: right;margin-right: 20px;margin-top: 3px;"
          @keyup.enter.native="fetchData()"></Input>
        </Col>
      </Row>
    </div>
    <Row type="flex" justify="start" class="code-row-bg">
      <Col span="8" v-for="(item,index) in fileData" :key="index">
      <div class="card" @click="handleRender = true">
        <div class="card-box">
          <!-- <Icon type="heart" color="red" v-if=""></Icon>
          <Icon type="pause" v-else-if=""></Icon> -->
          <img class="card-box-pic" :src="item.thumb"/>
        </div>
        <table class="card-table">
          <tr>
            <td class="w15"><span class="tag">{{item.tasktype_name}}</span></td>
            <td class="w55">{{item.task_name}}</td>
            <td class="w20"><img class="icon" src="../../images/leader.png" /> {{item.run_uname}}</td>
            <td class="w10"><Icon type="ios-download"></Icon></td>
          </tr>
        </table>
      </div>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: (Date.parse(new Date()))/1000,
      searchInput: '',
      fileData: [],
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
      searchInput: ''
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      let _this = this;
      _this.$axios.get('/task/stage-page',{
        params: {
          status: 5,
          search: _this.searchInput
        }
      })
      .then(res => res.data)
      .then(res => {
        if(res.err_code == 0) {
          _this.fileData = res.data
          console.log(_this.fileData)
        }
      })
    }
  }
}
</script>

<style lang='less'>
@import "./style/project.less";
</style>
