<!-- 项目-任务页面-->
<template>
  <div class="task">
    <!--<taskclasses ref="classes"-->
                 <!--v-on:changeTaskListData = 'changeTaskListData'-->
                 <!--v-on:setProjectInfo = 'setProjectInfo'-->
                 <!--&gt;-->
    <!--</taskclasses>-->
    <div class="task-operation">
      <Button type="success" size="large" @click="showAccretionTask">新增任务</Button>
      <Button type="primary" size="large" @click="showExcelTask">Excle导入</Button>
    </div>
      <div class="taskMainContainer">
          <!--&lt;!&ndash;项目进度&ndash;&gt;-->
          <div class="projectPlanRight">
              <div class="rightTitle">
                  <Icon type="android-apps" style="vertical-align: top" size="20"></Icon>&nbsp;项目进度
                  <span class="editBtn">
                      <Icon @click.native="editMode" type="edit" style="vertical-align: top" size="20"></Icon>
            </span>
              </div>
              <div v-if="editShow" class="rightRow">
                  <div class="line" v-for="item in ChildMsgData">
                      <div class="title">
                          <span v-if="!item.realname" @click="changeTaskListData(item)" style="cursor: pointer">{{item.child_project_name }}</span>
                        <div v-else class="alone">
                            <Avatar  src="https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar"
                                    size="small"/>&nbsp;&nbsp;
                            <div v-if="item.realname">{{item.realname}}</div>
                        </div>
                      </div>
                      <div  class="lineRow showPlan">
                          <Progress  :percent="Number(item.progress)">
                              <span>{{item.complete}}/{{item.total}}</span>
                          </Progress>
                      </div>
                      <div class="clear"></div>
                      <div v-if="!item.realname" style="position: relative;padding-left: 30px;">
                            <Avatar  src="https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar"
                                     size="small"/>&nbsp;&nbsp;
                            <span >{{item.leader_name}}</span>
                          <Icon class="flag" type="flag"></Icon>
                      </div>
                      <!--<Select v-model="item.leader"    style="width:100px">-->
                      <!--<Option v-for="leader in companyMember"   :value="leader.user_id" :key="leader.value">{{ leader.nickname }}</Option>-->
                      <!--</Select>-->
                      <div  style="padding-left: 30px;">
                          <div class="line" v-for="member in item.child_project">
                              <div class="title">
                                  <div class="demo-avatar">
                                      <Avatar  src="https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar"
                                               size="small"/>&nbsp;&nbsp;&nbsp;&nbsp;{{member.user}}
                                  </div>
                              </div>
                              <div class="lineRow">
                                  <Progress :percent="Number(member.progress)"><span>{{member.complete}}/{{member.total}}</span>
                                  </Progress>
                              </div>
                              <div class="clear"></div>
                          </div>
                      </div>
                  </div>
              </div>
              <div v-else class="rightRow">

                  <div class="line" v-for="item in ChildMsgData">
                      <div  class="editList" v-if="item.child_project">
                       <div>
                           <input type="text" @change="changeName(item,$event)"
                                  :value="item.child_project_name || item.realname" class="title"/>
                           <Avatar src="https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar"
                                   size="small"/>&nbsp;&nbsp;
                           <Select v-model="item.leader"   @on-change="changePrincipal(item,item.leader)"    style="width:100px">
                               <Option v-for="leader in companyMember"   :value="leader.user_id" :key="leader.value">{{ leader.realname}}</Option>
                           </Select>
                       </div>
                          <Icon @click.native="delProject(item)" type="trash-b" size="14"></Icon>


                      </div>
                  </div>
                  <div class="projectPlanButton">
                      <Select v-model="subProjectManager" style="width:100px">
                          <Option v-for="item in companyMember" :value="item.user_id" :key="item.value">{{ item.realname}}
                          </Option>
                      </Select>
                      <Input v-model="subProjectName" placeholder="项目名称" style="width: 200px"></Input>
                      <Icon @click.native="addButton()" type="plus-round" style="vertical-align: middle"
                            size="20"></Icon>
                  </div>
              </div>


              <!--<div class="rightTitle" style="border-top:0px;margin-top:15px;">-->
                  <!--<Icon type="android-apps" size="20"></Icon>-->
                  <!--成员进度-->
              <!--</div>-->
              <!--<div class="rightRow">-->
                  <!--<div class="line" v-for="item in memberMsgData">-->
                      <!--<div class="title">-->
                          <!--<div class="demo-avatar">-->
                              <!--<Avatar src="https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar"-->
                                      <!--size="small"/>&nbsp;&nbsp;{{item.realname}}-->
                          <!--</div>-->
                      <!--</div>-->
                      <!--<div class="lineRow">-->
                          <!--<Progress :percent="Number(item.progress)"><span>{{item.complete}}/{{item.task_num}}</span>-->
                          <!--</Progress>-->
                      <!--</div>-->
                      <!--<div class="clear"></div>-->
                  <!--</div>-->
              <!--</div>-->
          </div>

           <!--主视图:列表/甘特图 -->
          <Tabs  class="task-tab">
              <Tab-pane label="列表模式"  icon="ios-list-outline">
                  <tasklist style="padding-left: 450px;" ref="list" v-on:showTaskDetails='showTaskDetails'
                            v-on:delTask="closeTaskDetails"></tasklist>
              </Tab-pane>
              <Tab-pane  label="甘特图模式" icon="podium" style="height: 700px;overflow: auto;">
                  <iframe style="padding-left: 450px;" id="show-iframe" frameborder=0  name="showHere" scrolling=auto
                          src="../../../src/views/project/gantt/gantt.html"></iframe>
              </Tab-pane>
              <Tab-pane   label="进度" icon="podium"  style="height: 700px;overflow: auto;" >
                  <v-schedule-plan  style="padding-left: 450px;" ></v-schedule-plan>
              </Tab-pane>
          </Tabs>
      </div>

    <!-- 编辑任务组件 -->
    <!--<Modal-->
          <!--v-model="isShowTaskDetails"-->
          <!--width="1200"-->
          <!--:styles="{top: '100px'}"-->
          <!--:loading = "isSaveLoading"-->
          <!--:closable="false"-->
          <!--okText= '保存'-->
          <!--cancelText='取消'-->
          <!--@on-ok="saveTaskInfoPop"-->
          <!--&gt;-->
        <!--<taskinfopop ref="details"-->
                     <!--v-bind:taskID="taskId"-->
                     <!--v-on:refreshCurrentTaskList = 'refreshCurrentTaskList'-->
                     <!--v-on:delTask="closeTaskDetails"-->
                     <!--&gt;-->
        <!--</taskinfopop>-->
    <!--</Modal>-->

    <!-- 新增任务组件 -->
    <Modal
           v-model="isAccretionTask"
           width="600"
           :styles="{top: '150px'}"
           :loading = "isSaveLoading"
           :closable="false"
           okText= '保存'
           cancelText='取消'
           @on-ok="saveAccretionTaskPop"
      >
      <accretiontaskpop ref="add"
                        v-on:refreshCurrentTaskList = 'refreshCurrentTaskList'
                        >
      </accretiontaskpop>
    </Modal>
    <!-- excel解析组件 -->
    <Modal v-model="isExcelTask" width="1200" @on-cancel="excelCancel">
      <p slot="header">
        <span>批量导入任务</span>
      </p>
      <div>
        <excel-modal ref="upload"></excel-modal>
      </div>
      <div slot="footer" style="height:20px;"></div>
    </Modal>
     <excel-modal v-if="isExcelTask" ></excel-modal>
  </div>

</template>

<script>
import {mapMutations} from 'vuex'
import qs from 'querystring'
import taskclasses from "./task/taskClasses";
import tasklist from "./task/taskList";
import taskinfopop from "./task/taskInfoPop";
import accretiontaskpop from "./task/accretionTaskPop";
import ExcelModal from "./components/excel"
import vSchedulePlan from "./schedule"

export default {
  components: {
    taskclasses,
    tasklist,
    taskinfopop,
    accretiontaskpop,
    ExcelModal,
      vSchedulePlan
  },
  data() {
    return {
        haha:'74',
        editShow: true,
        ChildMsgData: null,
        memberMsgData: [],
        projectId: sessionStorage.getItem('projectID'),
        companyMember: null,
        subProjectManager: null,
        subProjectName: null,
        isShowTaskDetails: false,
        isSaveLoading: true,
        taskId: 0,
        isExcelTask: false,
        isAccretionTask: false,
        projectInfo: {}
    };
  },
  mounted() {
    this.autoH();
    this.initTaskMain();
    this.$bus.on('refreshCurrentTaskList',()=>{
        this.refreshCurrentTaskList();
    });
    this.projectPlan()
  },
  methods: {
      ...mapMutations(['setProjectInfoDetails','setDetailAll']),
      excelCancel(){
        this.$bus.emit('clearExcleData')
      },
      autoH() {
        let oIframe = document.getElementById("show-iframe");
        let deviceHeight = document.documentElement.clientHeight - 190;
        oIframe.style.width = 100 + "%";
        oIframe.style.height = deviceHeight + "px";
      },
      //初始化任务相关参数
      initTaskMain()
      {
        sessionStorage.TaskID = 0;
      },
      //改变任务列表
      changeTaskListData(subType){
          subType.project_child_id = subType.child_id
        this.$refs.list.initTaskListFromId(subType);
      },
      //刷新当前任务列表
      refreshCurrentTaskList()
      {
        this.$refs.list.refreshTaskList();
        this.$refs.classes.getProjectChildInfo();
      },
      //显示任务详情
      showTaskDetails(data)
      {
//        this.isShowTaskDetails = true;
//        this.isSaveLoading = true;
//        this.taskId = parseInt(data.task_id);

//        this.$refs.details.initTaskDetailProjecInfo(this.projectInfo);
//        this.$refs.details.initTaskDetail(data);

        this.setProjectInfoDetails(this.projectInfo);
        this.setDetailAll(data);
        this.$router.push({path:'/project/details'})
      },
      //编辑后关闭modal
      closeTaskDetails() {
        this.isShowTaskDetails = false;
      },
      //保存编辑任务信息弹窗
      saveTaskInfoPop()
      {
        let result = this.$refs.details.saveTaskDetail();
        if(result)
        {
          this.isSaveLoading = false;
          this.isShowTaskDetails = false;
          this.$Message.success('保存任务成功');
        }
        else
        {
            setTimeout(() => {
                this.isSaveLoading = false;
                this.isShowTaskDetails = false;
                this.$Message.success('保存任务失败');
                }, 1000);
        }
      },
      //保存新建任务弹窗
      saveAccretionTaskPop()
      {
        let result = this.$refs.add.saveTaskDetail();
        if(result)
        {
          this.isSaveLoading = false;
          this.isAccretionTask = false;

          this.$Message.success('创建任务成功');
        }
        else
        {
            setTimeout(() => {
                this.isSaveLoading = false;
                this.isAccretionTask = false;
                this.$Message.success('创建任务失败');
                }, 1000);
        }
      },
      //EXCEL添加
      showExcelTask() {
        this.isExcelTask = true;
        this.$refs.upload.isShowPage(true)
      },
      //添加任务
      showAccretionTask(index) {
        this.isAccretionTask = true;
        this.$refs.add.accretionTaskPop(this.projectInfo);
      },
      //初始化任务列表的项目信息
      setProjectInfo(projectInfo)
      {
        this.projectInfo = projectInfo;
      },
      // 项目进度初始化接口
      projectPlan() {
          let projectID=sessionStorage.projectID;
          let ProjectProgess=this.$axios.get(this.GLOBAL.baseRouter+"/task/total/project-progress&project_id="+projectID);
          let ChlidProjectProgess=this.$axios.get(this.GLOBAL.baseRouter+"/task/total/child-project-progress&project_id="+projectID);
          let MemberProgess=this.$axios.get(this.GLOBAL.baseRouter+"/task/total/member-progress&project_id="+projectID);
//          this.$axios.all([ProjectProgess,ChlidProjectProgess,MemberProgess]).then(([msg,childMsg,memberMsg])=>{
//              // 项目进度
//              let MsData=msg.data.data;
////              this.proPanData=Math.round(MsData.project_progress);
////              this.ProTiemDate=Math.round(MsData.time_progress);
////              this.ProFinhData=Math.round(MsData.will_finish);
////              this.ProSytsData=Math.ceil(MsData.syts);
////              this.ProTaskData=MsData.tasking_num;
////              this.ProPauseNum=MsData.pause_num;
//
//              console.log(11,childMsg.data.data)
//              console.log(22,memberMsg.data.data)
//
//              // 子项目进度
////              this.ChildMsgData=childMsg.data.data;
//
//              // 成员进度
//              this.memberMsgData=memberMsg.data.data;
//          },()=>{
//              console.log("请求失败")
//          })

          this.$axios.post(`${this.GLOBAL.baseRouter}/task/total/member-child-project-total`,qs.stringify({project_id:this.projectId}))
              .then(({data})=>{
              if(data.err_code === 0){
                  this.ChildMsgData = data.data;
                  console.log(11,data.data)
              }
              })

      },
      // 编辑按钮并获得负责人
      editMode(){
          this.editShow = !this.editShow
          if (!this.companyMember) {
              this._ajax('task/company/member-page', {company_id: 1})
                  .then(({data}) => {
                      if (data.err_code === 0) {
                          this.companyMember = data.data

                      }
                  })
          }
      },
      // 删除项目
      delProject(data){
          let id = null;
          if (data.child_id) {
              id = data.child_id
          } else if (data.run_uid) {
              id = data.run_uid
          };
          this._ajax('task/project/child-delete', {id: id})
              .then(({data}) => {
                  if (data.err_code === 0) {
                      this.projectPlan();
                      this.$Message.success('删除成功');
                  }
              })
      },
      // 更改负责人
      changePrincipal(data,leader){
          console.log(33,data)
         if(leader){
             let id = data.child_id;
             let name = data.child_project_name;
             this._ajax('task/project/child-update',{id:id,name:name,leader:leader})
                 .then(({data})=>{
                     if(data.err_code === 0){
                         this.projectPlan();
                         this.$Message.success('修改成功');
                     }
                 })
         }
      },
      // 更改项目名称
      changeName(data,e){
          console.log(111,data)
          let id = data.child_id;
          let name = e.target.value
          this._ajax('task/project/child-update',{id:id,name:name,leader:data.leader})
              .then(({data})=>{
                  if(data.err_code === 0){
                      this.projectPlan();
                      this.$Message.success('修改成功');
                  }
              })

      },
      // 添加项目
      addButton(){
          this._ajax('task/project/child-add',{project_id:this.projectId,name:this.subProjectName,leader:this.subProjectManager})
              .then(({data})=>{
                  if(data.err_code === 0){
                      this.$Message.success('添加成功');
                      this.projectPlan()
                  }
              })
      },
      _ajax(url,data){
          return this.$axios.post(this.GLOBAL.baseRouter+url,qs.stringify(data))
      },
  }
};
</script>

<style lang="less" >
.task{
  position:relative;
    .taskMainContainer{
        position: relative;
        display: flex;
        padding-top: 20px;
        .projectPlanRight{
            position: absolute;
            top:35px;
            left: -11px;
            width: 457px;
            height: 100%;
            padding: 10px 23px;
            z-index: 333;
            background: #fff;
            .flag{
                position: absolute;
                top:0;
                left: 20px;
                transform: scale(0.8);
            }
            .rightTitle{
                position: relative;
                .editBtn{
                    position: absolute;
                    top:50%;
                    right: 16px;
                    transform: translateY(-50%);
                    cursor: pointer;
                }
            }
            .showPlan{
                margin-left: 131px !important;
            }
            .editShowPlan{
                margin-left: 355px !important;
            }
            .alone{
                display: flex;
                margin-left: 30px;
            }
            .editList{
                display: flex;
                padding-right: 10px;
                justify-content: space-between;
            }
        }
    }
    .projectPlanButton{
        text-align: right;
    }
}
.task-tab{
    position:absolute;
    width:100%;
    z-index:1;
    overflow-x: hidden !important;
    overflow-y: auto !important;

}
.task-operation{
    position:absolute;
    width:220px;
    height:60px;
    /* text-align:right; */
    float:right;
    right: -10px;
    padding: 4px 10px 10px 24px;
    z-index:2;
}
</style>

