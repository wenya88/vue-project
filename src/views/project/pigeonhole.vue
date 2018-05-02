<template>
  <div class="pigeonhole">
    <div class="handleBox">
      <Row type="flex" justify="space-between" class="code-row-bg">
        <Col span="16">
        <Button type="primary">全部下载</Button>
        </Col>
        <Col span="2"> 类型:
        <Select v-model="selTaskType" style="width:80px" @on-change="fetchData()">
          <OptionGroup :label="item.name" v-for="(item,index) in taskList" :key="index">
            <Option v-for="items in item.tasktype" :value="items.id" :key="items.id">{{ items.tasktype_name }}</Option>
          </OptionGroup> 
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
          placeholder="任务 / 负责人" 
          style="width: 200px;float: right;margin-right: 20px;margin-top: 3px;"
          @keyup.enter.native="fetchData()"></Input>
        </Col>
      </Row>
      <!-- <my-input :placeholder="text" @enter="fetchData()"></my-input> -->
    </div>
    <Row type="flex" justify="start" class="code-row-bg">
      <Col span="8" v-for="(item,index) in fileData" :key="index">
      <div class="card">
        <div class="card-box" @click="fetchFileData(item.id)">
          <!-- <Icon type="heart" color="red" v-if=""></Icon>
          <Icon type="pause" v-else-if=""></Icon> -->
          <img class="card-box-pic" :src="item.image[0]"/>
        </div>
        <table class="card-table">
          <tr>
            <td class="w15"><span class="tag">{{item.tasktype_name}}</span></td>
            <td class="w55">{{item.name}}</td>
            <td class="w20"><img class="icon" src="../../images/leader.png" /> {{item.run_uname}}</td>
            <td class="w10" @click="downloadFile(item.id,1)"><Icon type="ios-download"></Icon></td>
          </tr>
        </table>
      </div>
      </Col>
    </Row>
    <finish-model 
    :editData="formLeft" 
    v-show="isTabModal" 
    @close="closeTabmodal" 
    :isDisabled="true"
    >
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
    <div class="edit" slot="two">
      <div>
        121212
      </div>  
    </div>
    </finish-model>
  </div>
</template>

<script>
var qs = require('querystring');
import finishModel from '../main-components/model/finishModel';
import { mapGetters } from 'vuex'
export default {
  components: {
    finishModel
  },
  data() {
    return {
      date: (Date.parse(new Date()))/1000,
      searchInput: '',
      fileData: [],
      text: '任务 / 负责人',
      selTaskType: '',
      taskType: '',
      subpId: null,
      status: '',
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
      searchInput: '',
      isTabModal: false,
      formLeft: {}
    }
  },
  computed: {
    ...mapGetters({
      taskList: 'getTaskType',
      subProjectList: 'getSubProjectList'
    })
  },
  created() {
    this.fetchData();
    this.getTaskList();
  },
  methods: {
    fetchData() {
      // console.log(this.tasktype)
      let data = {
        status: this.status,
        tasktype: this.selTaskType,
        project_id: localStorage.pid,
        project_child_id: '',
        search: this.searchInput
      }
      this.$axios.post('/task/task/page',qs.stringify(data))
      .then(res => res.data)
      .then(res => {
        // console.log(res)
        if(res.err_code == 0) {
          this.fileData = res.data
          // console.log(this.fileData)
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
    downloadFile(tid, pid) {
      let data = {
        task_id : tid,
        project_id: pid
      }
      this.$axios.post('/task/task/download', qs.stringify(data))
      .then(res => res.data)
      .then(res => {
        if(res.err_code == 0) {
          // let key = {
          //   url_key: res.url_key
          // }
          window.open('http://192.168.2.19/index.php?r=file/file/download&url_key='+ res.url_key, '_blank')
          // this.$axios.post('/file/file/download', qs.stringify(key))
          // .then(res => res.data)
          // .then(res => {
          //   window.open(urls, '_blank')
          //   console.log(res)
          // })
        }
      })
    },
    closeTabmodal() {
      this.isTabModal = false;
      // this.taskType = '';
      // this.fetchData();
    },
    fetchFileData(taskId) {
      this.$Loading.start();
      this.boxHeight = 0;
      let data = {
        id: taskId
      }
      this.$axios.post('/task/task/info', qs.stringify(data))
      .then(res => res.data)
      .then(res => {
        console.log(res)
        this.isTabModal = true;
        this.formLeft = res;
        // this.$Loading.finish();
        // this.getSubProject(res.project_id)
        this.taskType = res.tasktype_id+''
        this.subpId = res.project_child
      })
    }
  }
}
</script>

<style lang='less'>
@import "./style/project.less";
</style>
