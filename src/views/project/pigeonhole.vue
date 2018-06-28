<template>
  <div class="pigeonhole">
    <div class="handleBox">
      <Row type="flex" justify="space-between" class="code-row-bg">
        <Col span="16">
        <Button type="primary" @click="downloadFile('',projectID)">全部下载</Button>
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
          <Option v-for="item in followList" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
        <div class="card-box" @click="fetchFileData(item.id,item.stage_file.type,item.stage_file.file)">
          <!-- <Icon type="heart" color="red" v-if=""></Icon>
          <Icon type="pause" v-else-if=""></Icon> -->
          <img class="card-box-pic" :src="item.image[0]"/>
        </div>
        <table class="card-table">
          <tr>
            <td class="w15"><span class="tag">{{item.tasktype_name}}</span></td>
            <td class="w55">{{item.name}}</td>
            <td class="w20"><img class="icon" src="../../images/leader.png" /> {{item.run_uname}}</td>
            <td class="w10 pointer" @click="downloadFile(item.id)"><Icon type="ios-download" size="16"></Icon></td>
          </tr>
        </table>
      </div>
      </Col>
    </Row>
      <!-- <div slot="three">
        <ImgEditor v-if="imgConponent"></ImgEditor>
        <VidEditor v-if="vidConponent"></VidEditor>
        <div v-if="NotType" class="notIMG">暂未上传任务文件</div>
      </div>  -->
    <Modal 
           v-model="isTabModal"
           width="1200" 
           :styles="{top: '150px'}"
           :closable="false"
           okText= '保存'
           cancelText='取消'
           @on-cancle="closeTabmodal"
      >
      <browsetask ref="pigeonholetask" 
                    v-on:opentabmodal = 'openTabmodal'
                    >
      </browsetask>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>

<script>
var qs = require('querystring');
import browsetask from './task/browseTaskPop'
import { mapGetters } from 'vuex'
export default {
  name: 'pigeonhole',
  components: {
    browsetask,
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
      status: '4',
      projectID: sessionStorage.projectID,
      followList: [
        {
          value: 0,
          label: '不限'
        }, {
          value: 1,
          label: '是'
        }
      ],
      model: '',
      searchInput: '',
      isTabModal: false,
      imgConponent: false,
      vidConponent: false,
      NotType: false,
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
        project_id: sessionStorage.projectID,
        project_child_id: '',
        search: this.searchInput
      }
      this.$axios.post(this.GLOBAL.baseRouter+'task/task/page',qs.stringify(data))
      .then(res => res.data)
      .then(res => {
        // console.log(res)
        if(res.err_code == 0) {
          console.log(res.data);
          
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
      this.$axios.post(this.GLOBAL.baseRouter+'task/task/download', qs.stringify(data))
      .then(res => res.data)
      .then(res => {
        if(res.err_code == 0) {
          // let key = {
          //   url_key: res.url_key
          // }
          window.open('http://192.168.2.19/index.php?r=file/file/download&url_key='+ res.url_key, '_blank')
          // this.$axios.post(this.GLOBAL.baseRouter+'file/file/download', qs.stringify(key))
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
    },
    openTabmodal() {
      this.isTabModal = true;
    },
    fetchFileData(taskId,type,file) {
      this.isTabModal = true;
      // sessionStorage.TaskID=taskId;
      // sessionStorage.FileURl=file;
      this.$store.commit('changeComponentTaskID',TaskID);
      this.$store.commit('changeComponentFileURl',file);
      sessionStorage.AllowEdit=undefined;
      console.log(taskId,type);
      
      this.$refs.pigeonholetask.initBrowseTaskPop(taskId,type);//根据ID和类型初始化弹窗
      this.$refs.pigeonholetask.setEditDisabled(true);//设置弹窗能否编辑

      this.$Loading.start();
      this.boxHeight = 0;
      // this.$axios.post(this.GLOBAL.baseRouter+'task/task/info', qs.stringify(data))
      // .then(res => res.data)
      // .then(res => {
      //   console.log(res)
      //   
      //   this.formLeft = res;
      //   // this.$Loading.finish();
      //   // this.getSubProject(res.project_id)
      //   this.taskType = res.tasktype_id+''
      //   this.subpId = res.project_child
      // })
    }
  }
}
</script>

<style lang='less'>
@import "./style/project.less";
</style>
