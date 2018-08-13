<template>
  <div>
    <div class="sortBg">
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
          <Select v-model="model1" style="width:80px">
            <Option v-for="item in followList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          </Col>
          <Col span="12">
          <Input v-model="searchInput" icon="search" placeholder="任务 / 负责人" style="width: 300px;float: right;margin-right: 20px;margin-top: 3px;" @keyup.enter.native="fetchData()"></Input>
          </Col>
        </Row>
      </div>
      <my-sort :sortList="ndsSortList" @choiced="filterFTime" v-if="sortShow == 'frist'"></my-sort>
      <my-sort :sortList="nsfkSortList" @choiced="filterSTime" v-if="sortShow == 'second'"></my-sort> 
      <my-sort :sortList="khdsSortList" @choiced="filterTTime" v-if="sortShow == 'third'"></my-sort>
      <my-sort :sortList="khfkSortList" @choiced="filterFoTime" v-if="sortShow == 'fourth'"></my-sort> 
    </div>
    <div class="tab-main" :style="`min-height: ${boxHeight}px;`">
      <Row type="flex" justify="start" class="code-row-bg">
        <Col span="6" v-for="(item,index) in listData" :key="index">
        <div class="card" @click="fetchFileData(item.stage_id,item.stage_file.type,item.stage_file.file,item.task_id,item)">
          <div class="card-box">
            <img class="card-box-pic" :src="item.thumb" v-if="item.stage_file.type == 'image'" />
            <img class="card-box-pic" src="../../../images/icon/3D.png" v-else-if="item.stage_file.type == '3d'" style="width: 100%;height: 100%" />
            <img class="card-box-pic" src="../../../images/icon/video.png" v-else-if="item.stage_file.type == 'video'" style="width: 100%;height: 100%" />
            <div class="tips">

             <div>
               <span class="tag">{{item.tasktype_name}}</span>{{item.task_name}}
               <span class="date">上传：{{item.create_date}}</span>
             </div>

              <div style="display: flex">
                <div class="userImg">
                  <img class="icon" src="../../../images/leader.png" /> {{item.run_uname}}
                </div>
                <i class="line"></i>
                <table class="card-table">
                  <tr>
                    <td class="w25">待审天数</td>
                    <td class="w25">完成阶段</td>
                    <td class="w25">剩余时间</td>
                  </tr>
                  <tr class="fb">
                    <td class="w25">
                      <span class="orange-span">{{parseInt((date - item.create_time)/86400)}}</span>/天</td>
                    <td class="w25">
                      <!-- <span class="orange-span">{{item.stage}}</span>/{{item.stage_count}}</td> -->
                      <span class="orange-span" v-if="item.tasktype_stage_now">{{item.tasktype_stage_now.stage_name}}</span>
                      <span class="orange-span" v-else>暂无上传阶段</span>
                    </td>
                    <td class="w25">
                      <span class="orange-span">{{parseInt((item.expect_end_time - date)/86400)}}</span>天</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
        </Col>
      </Row>
      <span class="more" @click="changePageIndex()">{{moreText}}</span>
    </div>
    
    <!-- 浏览任务弹窗 -->
    <!--<Modal -->
          <!--v-model="isTabModal" -->
          <!--width="1200" -->
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

import mySort from '../../main-components/sort';
import browsetask from '../task/browseTaskPop';
import { mapGetters,mapMutations } from 'vuex'
export default {
  name: 'resourcesList',
  components: {
    mySort,
    browsetask
  },
  props: {
    sortShow: {
      type: String,
      defaule: ''
    }
  },
  data() {
    return {
      resourceStatus: '',
      isTabModal: false,
      page: 1,
      date: (Date.parse(new Date())) / 1000,
      model: '',
      model1: '',
      selTaskType: '',
      searchInput: '',
      boxHeight: 300,
      listData: [],
      moreText: '加载更多',
      loading: false,
      followList: [
        {
          value: 0,
          label: '不限'
        }, {
          value: 1,
          label: '是'
        }
      ]
    }
  },
  mounted() {
    this.getTaskList();
    switch (this.sortShow){
        case 'frist':
          this.filterFTime(0);
        break;
        case 'second':
          this.filterSTime(0);
        break;
        case 'third':
          this.filterTTime(0);
        break;
        case 'fourth':
          this.filterFoTime(0);
        break;
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
    }),
  },
  methods: {
      ...mapMutations(['setPrimaryMission','setDetailAll','setUserStatus']),
    change (status) {
                this.$Message.info(`Status: ${status}`);
            },
    /**
     * 文件筛选条件
     */
    filterFTime(val) {
      if (val == 0) {
        this.sortStatus = 'stage_create_time';
        this.page = 1;
      } else if (val == 1) {
        this.sortStatus = 'stage_create_time';
        this.orderBy = 'asc'
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
    /**
     * 从store中把任务类型获取出来
     */
    getTaskList() {
      let data = {
        company_id: 1
      }
      this.$store.dispatch('fetchTaskList', qs.stringify(data));
    },
    changePageIndex(){
      this.page += 1;
      this.fetchData(sessionStorage.resourcesStatus);
    },
    changeTabs() {
      this.page = 1;
      this.fetchData(sessionStorage.resourcesStatus)
    },
    /**
     * 获取阶段数据
     */
    fetchData() {
      this.listData = []
      let status = sessionStorage.resourcesStatus
      this.$Loading.start();
      let data = {
        status: status,
        search: this.searchInput,
        order: this.sortStatus,
        tasktype_id: this.selTaskType,
        page: this.page,
        order_by: this.orderBy,
        project_id: sessionStorage.projectID
      }
      this.$axios.post(this.GLOBAL.baseRouter+'task/task/stage-page', qs.stringify(data))
        .then(res => res.data)
        .then(res => {
          if (res.err_code == 0) {
              if(this.page == 1) {
                this.listData = res.data
              } else{
                this.listData.push.apply(this.listData,res.data);
              }
              this.searchInput = ''
            if(parseInt(this.page) == res.page.count_page && parseInt(this.page)!=1) {
              this.moreText = '没有更多内容'
            } else if(parseInt(this.page)==1 && res.data.length > 0) {
              this.moreText = ''
            } else {
              this.moreText = '暂无内容'
            }
            this.$Loading.finish();
          } else {
            this.$Loading.error();
          }
        })
    },
    /**
     * 获取阶段文件中某个文件的详情
     * 阶段id  必传
     * 阶段  非必传
     */
    fetchFileData(stageId,type,file,taskId,item) {
//      this.isTabModal = true;
        this.$store.commit('changeComponentTaskID',taskId);
        this.$store.commit('changeComponentFileURl',file);

        // 是否显示编辑信息
        //sessionStorage.AllowEdit=_this.AllowEdit;
        item.id = item.task_id
        this.setPrimaryMission(item);
        this.setDetailAll(item);
//        this.setUserStatus('member');
        this.$router.push({path:'/project/details'});

//      this.$refs.browsetask.initBrowseTaskPop(taskId,type);//根据ID和类型初始化弹窗
//      this.$refs.browsetask.setEditDisabled(true);//设置弹窗能否编辑


      if(this.status == '1') {
        sessionStorage.AllowEdit='Allow';
      } else {
        sessionStorage.AllowEdit='Other';
      }
    },
    closeTabmodal() {
      this.isTabModal = false;
    },
  }
}
</script>

<style>

</style>
