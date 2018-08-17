<template>
  <div class="qualityContainer" id="completed">
    <div class="qualityTitle"><p class="icon"></p><span style="font-size: 18px;line-height: 100px;">资源管理</span></div>
    <div class="nav">
      <!--<div v-if="projectSet.qualityFrist" class="frist" @click="finishData(4)">-->
      <div v-if="true" class="frist" @click="finishData(4)">
        <i-circle
          :size="120"
          :trail-width="0"
          :stroke-width="15"
          :percent="100"
          stroke-linecap="square"
          stroke-color="#3bceb6">
          <div class="text">
            <p class="big"  style="color:#3bceb6;">{{param.num}}</p>
          </div>
        </i-circle>
        <p class="description">归档</p>
      </div>
      <div  v-if="projectSet.qualitySecond" class="second" @click="resourcesData(1)">
        <i-circle

          :size="118"
          :trail-width="0"
          :stroke-width="15"
          :percent="100"
          stroke-linecap="square"
          stroke-color="#fcc44a">
          <div class="text">
            <p class="big" style="color:#fcc44a;">{{param.num1}}</p>
          </div>
        </i-circle>
        <p class="description">内部待审</p>

      </div>
      <div  v-if="projectSet.qualityThird" class="third" @click="resourcesData(3)">
        <i-circle

          :size="118"
          :trail-width="0"
          :stroke-width="15"
          :percent="100"
          stroke-linecap="square"
          stroke-color="#8cc8ff">
          <div class="text">
            <p class="big"  style="color:#8cc8ff;" >{{param.num2}}</p>
          </div>
        </i-circle>
        <p class="description">内审已反馈</p>
      </div>
      <div  v-if="projectSet.qualityFourth" class="fourth" @click="resourcesData(2)">
        <i-circle
          :size="118"
          :trail-width="0"
          :stroke-width="15"
          :percent="100"
          stroke-linecap="square"
          stroke-color="#ff898e">
          <div class="text">
            <p class="big" style="color:#ff898e;" >{{param.num3}}</p>
          </div>
        </i-circle>
        <p class="description">客户待审</p>
      </div>
      <div  v-if="projectSet.qualityFifth" class="fifth" @click="resourcesData(4)">
        <i-circle

          :size="118"
          :trail-width="0"
          :stroke-width="15"
          :percent="100"
          stroke-linecap="square"
          stroke-color="#78c97c">
          <div class="text">
            <p class="big" style="color:#78c97c;" >{{param.num4}}</p>
          </div>
        </i-circle>
        <p class="description">客户已反馈</p>
      </div>
    </div>
    <!-- <Affix>
     <ul class="topNav">
      <li class="active" @click="finishData(4)">归档</li>
      <li @click="resourcesData(1)">内部待审</li>
      <li @click="resourcesData(3)">内审已反馈</li>
      <li @click="resourcesData(2)">客户待审</li>
      <li @click="resourcesData(4)">客户已反馈</li>
    </ul> 
    </Affix> -->
    <!-- <Tabs value="1" :animated="false" v-model="status" @on-click="changeTabs()">
      <TabPane label="归档文件" name="1"> -->
        <pigeonhole ref="finish" v-if="finish"></pigeonhole>
        <resources-list ref="list" v-else :sortShow="sortNumber"></resources-list>
      <!-- </TabPane>
    </Tabs> -->
    <!-- 浏览任务弹窗 -->
   <!--<Modal-->
          <!--v-model="isTabModal"-->
          <!--width="1200"-->
          <!--:styles="{top: '100px'}"-->
          <!--:closable="false"-->
          <!--okText= '保存'-->
          <!--cancelText='取消'-->
          <!--@on-cancel="closeTabmodal"-->
          <!--&gt;-->
        <!--<browsetask ref="browsetask"></browsetask>-->
        <!--<div slot="footer">-->
        <!--</div>-->
    <!--</Modal>-->
  </div>
</template>

<script>
var qs = require('querystring');

import browsetask from './task/browseTaskPop';
import mySort from '../main-components/sort';
import pigeonhole from './pigeonhole';
import resourcesList from './components/resourcesList';
import { mapGetters ,mapState} from 'vuex'
export default {
  components: {
    mySort,
    browsetask,
    pigeonhole,
    resourcesList
  },
  data() {
    return {
      finish: true,
      sortNumber: '',
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
        num4: 0,
        num: 0
      },
      feedback: '',
      status: '1',
      sortStatus: '',
      searchInput: '',
      handleRender: false,
      imgConponent: false,
      vidConponent: false,
      NotType: false,
      orderBy: 'desc',
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
      taskType: '',
      selTaskType: '',
      subpId: null,
      value: '',
      formLeft: {},
      page: 1,
      loading: false
    }
  },
  created() {
    // console.log(this.$children[0],this.$children[1]) 
    this.fetchNum(1);
    this.fetchNum(2);
    this.fetchNum(3);
    this.fetchNum(4);
    this.fetchFinishNum();
    // this.getTaskList();
    // if(this.status == '1') {
    //   this.sortStatus = 'stage_create_time';
    //   this.fetchData();
    // } else {
    //   this.fetchData();
    // } 
  },
  methods: {
    finishData(status) {
      this.finish = true
      setTimeout(() => {
        this.$refs.finish.fetchData()
      },0)
    },
    resourcesData(status) {

      this.finish = false
      sessionStorage.resourcesStatus = status
      switch (status){
        case 1:
          this.sortNumber = 'frist';
        break;
        case 2:
          this.sortNumber = 'second';
        break;
        case 3:
          this.sortNumber = 'third';
        break;
        case 4:
          this.sortNumber = 'fourth';
        break;
      }
      setTimeout(() => {
        this.$refs.list.fetchData()
      },0)
    },
    ScrollLoad(){
      let scr=document.getElementById("completed");
      scr.onscroll=function(){
        let scrollT = scr.scrollTop;
        let scrollH = scr.scrollHeight;
        let clientH = scr.clientHeight;
        console.log(scrollT,scrollH,clientH)
        if(scrollT == scrollH - clientH){
            console.log('111')
        }
      }
    },
    cancel() {
      this.$Message.info('点击了取消');
    },
    /**
     * 获取文件不同阶段的文件数
     */
    fetchNum(str) {
      let data = {
        status: str + '',
        project_id: sessionStorage.projectID
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
    fetchFinishNum() {
      let data = {
        status: '4',
        project_id: sessionStorage.projectID
      }
      this.$axios.post(this.GLOBAL.baseRouter+'task/task/page',qs.stringify(data))
      .then(res => res.data)
      .then(res => {
        // console.log(res)

        if(res.err_code == 0) {

            // console.log(res.data);
          this.param.num = res.page.count
          // console.log(this.fileData)
        }
      })
    },
    /**
     * 从store中把任务类型获取出来
     */
    // getTaskList() {
    //   let data = {
    //     company_id: 1
    //   }
    //   this.$store.dispatch('fetchTaskList', qs.stringify(data));
    // },
    // getSubProject(pId) {
    //   let data = {
    //     id: pId
    //   }
    //   this.$store.dispatch('fetchSubProject', qs.stringify(data));
    // },
    // closeTabmodal() {
    //   this.isTabModal = false;
    // },
    /**
     * 获取阶段文件中某个文件的详情
     * 阶段id  必传
     * 阶段  非必传
     */
     fetchFileData(stageId,type,file,taskId) {
//       this.isTabModal = true;
//       // sessionStorage.FileURl=file;
//       // sessionStorage.TaskID=taskId;
//
//       this.$store.commit('changeComponentTaskID',TaskID);
//       this.$store.commit('changeComponentFileURl',file);
//       this.$refs.browsetask.initBrowseTaskPop(taskId,type);//根据ID和类型初始化弹窗
//       this.$refs.browsetask.setEditDisabled(true);//设置弹窗能否编辑
//
//       if(this.status == '1') {
//         sessionStorage.AllowEdit='Allow';
//       } else {
//         sessionStorage.AllowEdit='Other';
//       }
     },
    loadMore() {
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
    }
  },
    computed:{
        ...mapState({
            projectSet(data){
                return data.app.projectSet
            }
        })
    },

}
</script>

<style lang='less'>
@import "./style/project.less";
</style>