<!-- 项目-任务页面-->
<template>
  <div class="task">
    <div class="task-operation">
      <Button type="success" size="large" @click="showAccretionTask">新增任务</Button>
      <Button type="primary" size="large" @click="showExcelTask">Excle导入</Button>
    </div>
      <div class="taskMainContainer">
          <!--&lt;!&ndash;项目进度&ndash;&gt;-->
          <div class="projectPlanRight">
              <!--头部-->
              <div class="rightTitle">
                  <Icon type="android-apps" style="vertical-align: top" size="20"></Icon>&nbsp;项目进度
                  <span class="editBtn">
                      <Icon v-show="editShow" @click.native="editMode" type="edit" style="vertical-align: top" size="20"></Icon>
                      <Icon v-show="!editShow" @click.native="editMode" type="arrow-left-a" style="vertical-align: top" size="20"></Icon>
                  </span>
              </div>
              <!--显示列表-->
              <div v-if="editShow" class="rightRow">
                  <div class="Listall"  @click="changeTaskListData('all')">全部</div>
                  <div class="line" v-for="(item,index) in ChildMsgData" :key="'show'+index">
                     <section  class="titleList"  @click="changeTaskListData(item,null,'alone',item)"    :class="[{'activeTask':item.run_uid === aloneActive},{'activeTask':item.child_id === itemActive}]"  :key="index" >
                         <div class=" headTitle">
                                 <!--子项目头部-->
                                 <template v-if="!item.realname">
                                     <span class="iconfont icon-xiangmuxiaoxi"></span>&nbsp;&nbsp;
                                     <span  class="titleText" :title="item.child_project_name" >{{item.child_project_name }}</span>
                                     <span class="iconfont icon-xiangmufuzeren"></span>
                                     <span style="display: inline-block;width:40px;  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" :title="item.leader_name" >{{item.leader_name}}</span>
                                 </template>
                                 <!--单独的成员-->
                                 <div v-else class="alone" >
                                     <div style="margin: 0"  @click="">{{item.realname}}</div>
                                 </div>
                         </div>
                         <!--子项目和单独成员的进度条-->
                         <div    class="lineRow showPlan" :class="item.realname?'':'showPlanColor'">
                             <Progress  hide-info :percent="Number(item.progress)"></Progress>
                         </div>
                         <div class="ratio">{{item.complete}}/{{item.total}}</div>
                     </section>

                      <!--有项目的成员-->
                      <section v-if="member.run_uid"  v-for="(member,i) in item.child_project"  :key="'show'+i" @click="changeTaskListData(member,'member','team',item)"
                               :class="member.run_uid === teamActive && item.child_id === memberItemActive ? 'activeTask':''" class="projectMemberList"  >
                            <template  >
                                <p class=" memberTitle"  >{{member.user}}</p>
                                <p class="memberRatio" style="">{{member.complete}}/{{member.total}}</p>
                            </template>
                      </section>

                  </div>
              </div>
              <!--编辑-->
              <div v-else class="rightRow">
                  <div class="line editList"  v-for="(item,index) in ChildMsgData" :key="'edit'+index">
                      <template v-if="item.child_project">
                          <div>
                              <Input style="width: 100px;" type="text" @on-blur="changeName(item,$event)"
                                     :value="item.child_project_name || item.realname" class="title"></Input>
                              <Avatar src="https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar"
                                      size="small"/>&nbsp;&nbsp;
                              <Select v-model="item.leader" @on-change="changePrincipal(item,item.leader)"
                                      style="width:100px">
                                  <Option v-for="(leader,i) in companyMember" :value="leader.user_id"
                                          :key="i">{{ leader.realname}}
                                  </Option>
                              </Select>
                          </div>
                          <div @click="delProject(item)" style="padding: 0px 10px; cursor: pointer;" >
                              <Icon  style="line-height: 32px;" type="trash-b" size="16"></Icon>
                          </div>
                      </template>
                  </div>
                  <div class="projectPlanButton">
                      <Select v-model="subProjectManager" style="width:100px">
                      <Option v-for="(item,i) in companyMember" :value="item.user_id" :key="index">{{ item.realname}}
                      </Option>
                      </Select>
                      <Input v-model="subProjectName" placeholder="项目名称" style="width: 200px"></Input>
                      <Icon @click.native="addButton()" type="plus-round" style="vertical-align: middle"
                            size="20"></Icon>
                  </div>
              </div>
          </div>

           <!--主视图:列表/甘特图 -->
          <Tabs  class="task-tab">
              <Tab-pane label="看板"  >
                  <tasklist style="padding-left: 450px;" ref="list"
                            v-on:showTaskDetails='showTaskDetails'
                            v-on:delTask="closeTaskDetails"></tasklist>
              </Tab-pane>
              <Tab-pane  label="甘特图"  >
                  <iframe style="padding-left: 450px;" id="show-iframe" frameborder=0  name="showHere" scrolling=auto
                          src="../../../src/views/project/gantt/gantt.html"></iframe>
              </Tab-pane>
              <Tab-pane   label="进度管理"   >
                  <v-schedule-plan  style="padding-left: 450px;" ></v-schedule-plan>
              </Tab-pane>
          </Tabs>
      </div>

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

import tasklist from "./task/tasklist";
import taskinfopop from "./task/taskInfoPop/taskInfoPop";
import accretiontaskpop from "./task/accretionTaskPop";
import ExcelModal from "./components/excel"
import vSchedulePlan from "./schedule"

export default {
  components: {

    tasklist,
    taskinfopop,
    accretiontaskpop,
    ExcelModal,
      vSchedulePlan
  },
  data() {
    return {
        aloneActive:'',
        teamActive:'',
        memberItemActive:'',
        itemActive:'',
        haha:'74',
        editShow: true,
        ChildMsgData: null,
        memberMsgData: [],
        projectId: sessionStorage.getItem('projectID'),
        companyMember: null,
        subProjectManager: null,
        subProjectName: null,
        isShowTaskDetails: true,
        isSaveLoading: true,
        taskId: 0,
        isExcelTask: false,
        isAccretionTask: false,
        projectInfo: {},
        userID:sessionStorage.userId
    };
  },
  mounted() {
    this.autoH();
    this.initTaskMain();
    this.$bus.on('refreshCurrentTaskList',()=>{
        this.refreshCurrentTaskList();
    });
    this.projectPlan();
    this.setUserStatus(null)
  },
  methods: {
      ...mapMutations(['setProjectInfoDetails','setDetailAll','setUserStatus']),
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
      changeTaskListData(subType,type,member,item){
          this.teamActive = '';
          this.aloneActive = '';
          this.itemActive = '';
          if(subType.run_uid && member === 'alone'){
              this.aloneActive = subType.run_uid;

          }else if(subType.run_uid && member === 'team'){
              this.teamActive = subType.run_uid;
              this.memberItemActive = item.child_id;

          }else if(!subType.run_uid && member === 'alone'){
              this.itemActive = subType.child_id
          }

          if (Object.keys(subType)[0] === 'run_uid') {
              type = 'member'

          }
          if (subType !== 'all') {
              subType.project_child_id = subType.child_id;
          }


            this.$refs.list.initTaskListFromId(subType,type,item);

      },
      //刷新当前任务列表
      refreshCurrentTaskList()
      {
        this.$refs.list.refreshTaskList();
      },
      //进入任务详情
      showTaskDetails(data)
      {
          this.setDetailAll(data); // 存储list数据
          this.$router.push({path: '/project/details'})
      },
      //编辑后关闭modal
      closeTaskDetails() {
        this.isShowTaskDetails = false;
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
          this.$refs.add.clearAllData()
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
          this.$axios.post(this.GLOBAL.baseRouter+'/task/total/member-child-project-total',qs.stringify({project_id:this.projectId}))
              .then(({data})=>{
                  if(data.err_code === 0){
                      this.ChildMsgData = data.data;
                  }
              })

      },
      // 编辑按钮并获得负责人
      editMode(){
          this.editShow = !this.editShow
          if (!this.companyMember) {
              this._ajax('task/company/joined-members', {project_id: this.projectId})
                  .then(({data}) => {
                      if (data.err_code === 0) {
                          this.companyMember = data.data
                      }
                  })
          }
      },
      // 删除项目
      delProject(data){
          console.log('删除',data)
          let id = null;
          if (data.child_id) {
              id = data.child_id
          } else if (data.run_uid) {
              id = data.run_uid
          };
          this._ajax('task/project/child-delete', {id: id})
              .then(({data}) => {
                  if (data.err_code === 0) {
                      this.$Message.success('删除成功');
                     this.projectPlan()
                  }
              })
      },
      // 更改负责人
      changePrincipal(data,leader){
         if(data.leader){
             let id = data.child_id;
             let name = data.child_project_name;
             this._ajax('task/project/child-update',{id:id,name:name,leader:data.leader})
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
          let id = data.child_id;
          let name = e.target.value
          if(data.child_project_name !== name ){
              this._ajax('task/project/child-update',{id:id,name:name,leader:data.leader})
                  .then(({data})=>{
                      if(data.err_code === 0){
                          this.projectPlan();
                          this.$Message.success('修改成功');
                      }
                  })
          }
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
    @green:#00FDA3;
.task{
  position:relative;
    height: 100%;
    .taskMainContainer{
        position: relative;
        display: flex;
        height: 100%;
        padding-top: 20px;

        .ivu-tabs-nav-container{
            height: 60px!important;
        }
        .ivu-tabs-bar{

        }
        .ivu-tabs-tab{
            padding: 8px 41px;
            font-size: 18px;
            line-height: 32px;
            &:hover{
                color: #48c5b5;
            }
        }
        .ivu-tabs-tab-active{
            color:  #48c5b5;
        }
        .projectPlanRight{
            position: absolute;
            top:77px;
            left: -11px;
            width: 457px;
            height: 916px;
            padding: 10px 23px;
            z-index: 333;
            background: #f5f7f6;
            .Listall{
                height: 30px;
                padding-left: 5px;
                line-height: 30px;
                background: @green;color: #fff;
                cursor: pointer;
                &:hover{
                    border: 1px solid #48c5b5;
                }
            }
            .titleList{
                display: flex;
                padding-left: 5px;
                margin: 10px 0;
                background: #fff;
                /*border: 1px solid red;*/
                justify-content: space-between;
                cursor: pointer;
                .showPlan{
                   width: 174px;
                    padding: 5px ;
                    margin-top: 3px;
                }
                .headTitle{
                    flex: 1;
                    padding: 5px 0;

                    .titleText {
                        display: inline-block;
                        width: 40px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        cursor: pointer;

                    }
                    span{
                        vertical-align: middle;
                    }
                    .iconfont:nth-of-type(2){
                     vertical-align: middle;
                    }
                }
                .showPlanColor{
                    margin: 0;
                }
                .ratio{
                    width: 40px;
                    padding: 5px 0;
                    text-align: center;
                    color: #fff;
                    background: @green;
                }
                &:hover{
                    border: 1px solid #48c5b5;
                }
            }
            .projectMemberList{
                display: flex;
                height: 30px;
                margin: 10px 0 10px 30px;
                padding-left: 5px;
                line-height: 30px;
                justify-content: space-between;
                background: #fff;
                cursor: pointer;
                .memberTitle {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .memberRatio{
                    width: 40px;
                    text-align: center;
                    color: #fff;
                    background: @green;
                }
                &:hover{
                    border: 1px solid #48c5b5;
                }
            }
            .editList{
                display: flex;
                justify-content: space-between;
            }

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

            .editShowPlan{
                margin-left: 355px !important;
            }
            .alone{
                display: flex;
                margin-left: 43px;
                background: #fff;
                line-height: normal!important;
            }
            .editList{
                display: flex;
                padding-right: 10px;
                justify-content: space-between;
            }
        }
        .activeTask{
           border: 1px solid #48c5b5;
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
    /*overflow-x: hidden !important;*/
    /*overflow-y: auto !important;*/

}
.task-operation{
    position:absolute;
    top:39px;
    width:220px;
    height:60px;
    /* text-align:right; */
    float:right;
    right: 17px;
    padding: 4px 10px 10px 24px;
    z-index:1;
}
</style>

