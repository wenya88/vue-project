<!-- 项目-任务页面-->
<template>
    <div>
        <main-native>
            <div class="main-header-style iconfont">
                <div class="headerNavBar" >
                    <ul class="setMenuList">
                        <li @click="switchTabFun(1)" :class="{'checked':TabFlags.oneFlag}">看板</li>
                        <li @click="switchTabFun(2)" :class="{'checked':TabFlags.twoFlag}">甘特图</li>
                        <li @click="switchTabFun(3)" :class="{'checked':TabFlags.threeFlag}">进度管理</li>
                    </ul>
                </div>
            </div>
        </main-native>

        <div class="task">
            <div class="task-operation" v-if="companyType == 0">
                <button @click="showExcelTask">Excle导入</button>
                <button @click="showAccretionTask">新增任务</button>
            </div>
            <div class="taskMainContainer">
                <!--&lt;!&ndash;项目进度&ndash;&gt;-->
                <div class="projectPlanRight" v-if="TabFlags.oneAndOneFlag">
                    <!--头部-->
                    <div class="rightTitle">
                        <span v-show="editShow">
                            <Icon type="android-options" style="vertical-align: top" size="20"></Icon>&emsp;项目进度
                        </span>
                        <span v-show="!editShow">
                            <Icon type="android-options" style="vertical-align: top" size="20"></Icon>&emsp;项目编辑
                        </span>
                        <span class="editBtn">
                            <Icon v-show="editShow" @click.native="editMode" type="ios-compose-outline"
                                style="vertical-align: top" size="20"></Icon>
                            <Icon v-show="!editShow" @click.native="editMode" type="android-arrow-back"
                                style="vertical-align: top" size="20"></Icon>
                        </span>
                    </div>
                    <!--显示列表-->
                    <div v-if="editShow" class="rightRow">
                        <div class="Listall" @click="changeTaskListData('all')">全部</div>
                        <div class="eidtList">
                            <div class="line" v-for="(item,index) in ChildMsgData">
                            <section class="titleList"
                                     @click="changeTaskListData(item,null,'alone',item)"
                                     :class="[{'activeTask':item.run_uid === aloneActive},{'activeTask':item.child_id === itemActive}]">
                                <div class=" headTitle" :class="{'aloneHead': item.realname}">
                                    <!--子项目头部-->
                                    <template v-if="!item.realname">
                                        <span class="iconfont icon-xiangmuxiaoxi" style="margin-left: 5px;color: #97c9f9;"></span>&nbsp;&nbsp;
                                        <span class="titleText" style="color: #97c9f9;"
                                              :title="item.child_project_name">{{item.child_project_name }}</span>
                                        <i class="iconfont icon-rencai" style="color: #3bceb6" ></i>
                                        <!--<Icon style="color: #3bceb6" type="person-add" size="16"></Icon>-->
                                        <!--<span class="iconfont icon-xiangmufuzeren"></span>-->
                                        <span class="titleText" style="color: #3bceb6"
                                              :title="item.leader_name">{{item.leader_name}}</span>
                                    </template>
                                    <!--单独的成员-->
                                    <div v-else class="alone">
                                        <img class="headImg" :src="item.headimage" alt="">
                                    </div>
                                </div>
                                <!--子项目和单独成员的进度条-->
                                <div class="lineRow showPlan" :class="item.realname?'':'showPlanColor'">
                                    <div style="margin: 0;color: #bdbdbd">{{item.realname}}</div>
                                    <Progress hide-info :percent="Number(item.progress)"></Progress>
                                </div>
                                <div class="ratio" :class="{'aloneRight': item.realname}">{{item.complete}}/{{item.total}}
                                </div>
                            </section>
                            <!--有项目的成员-->
                            <section v-if="member.run_uid"  v-for="(member,i) in item.child_project"  :key="i"
                                     @click="changeTaskListData(member,'member','team',item)" class=" "  >
                                <section class="titleList">
                                    <div class=" headTitle aloneHead">
                                        <!--单独的成员-->
                                        <div class="alone">
                                            <img class="headImg" :src="member.headimage" alt="">
                                        </div>
                                    </div>
                                    <!--子项目和单独成员的进度条-->
                                    <div class="lineRow showPlan">
                                        <div style="margin: 0;color: #bdbdbd">{{member.user}}</div>
                                        <Progress hide-info :percent="Number(member.progress)"></Progress>
                                    </div>
                                    <div class="ratio" :class="{'aloneRight': member.realname}">{{member.complete}}/{{member.total}}</div>
                                </section>

                                <!--<template  >-->
                                <!--<p class=" memberTitle"  >{{member.user}}</p>-->
                                <!--<p class="memberRatio" style="">{{member.complete}}/{{member.total}}</p>-->
                                <!--</template>-->
                            </section>

                        </div>
                        </div>
                    </div>
                    <!--编辑-->
                    <div v-else  class="rightRow editRightRow">
                        <div :class="{projectPlanButton:!addInput}" class="addBlock" >
                            <span v-show="addInput">
                                <Select v-model="subProjectManager" style="width:30%">
                                    <Option v-for="(item,index) in companyMember" :value="item.user_id" :key="index">
                                        {{ item.remark_name}}
                                    </Option>
                                </Select>
                                <Input v-model="subProjectName" placeholder="项目名称" style="width:69%"></Input>
                            </span>
                            <div  v-show="addInput" style="margin-top: 10px ;text-align: right;" ><Button @click="addButton(true)" >确定</Button>  <Button @click="addButton(false) ">取消</Button></div>
                            <Icon v-show="!addInput" @click.native="addInputShow" type="ios-plus-outline" style="vertical-align: middle;color: #fcc44b;" size="24"></Icon>
                        </div>

                        <div class="eidtList">
                            <div class="lineEdit" v-for="(item,index) in ChildMsgData" :key="index" v-if="item.child_project">
                            <template>
                                <section>
                                    <div style="margin-bottom: 10px;">
                                        <span class="text">项目名称：</span>
                                        <Input style="width:160px;" type="text" icon="android-create"  @on-blur="changeName(item,$event)"
                                               :value="item.child_project_name || item.realname" class="title"></Input>
                                    </div>
                                    <div>
                                        <span class="text">项目成员：</span>
                                        <Avatar src="https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar" size="small"/>&nbsp;&nbsp;
                                        <Select v-model="item.leader" @on-change="changePrincipal(item,item.leader)" style="width:150px">
                                            <Option v-for="(leader,i) in companyMember" :value="leader.user_id" :key="i">{{ leader.remark_name}}</Option>
                                        </Select>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Icon class="iconDel"  @click="delProject(item)"   type="trash-b" size="16"></Icon>
                                    </div>
                                    <!--<div @click="delProject(item)" style="padding: 0px 10px; cursor: pointer;">-->
                                        <!--<Icon class="iconDel"  @click="delProject(item)"   type="trash-b" size="16"></Icon>-->
                                    <!--</div>-->
                                </section>

                            </template>
                        </div>
                        </div>
                    </div>
                </div>

                <!--主视图:列表/甘特图 -->
                <div class="task-tab">
                    <!--看板-->
                    <tasklist v-if="TabFlags.oneAndTwoFlag"  ref="list" v-on:showTaskDetails='showTaskDetails' v-on:delTask="closeTaskDetails"></tasklist>
                    <!--甘特图-->
                    <template v-if="TabFlags.twoFlag">
                        <iframe width="100%" height="800"  id="show-iframe" frameborder=0   name="showHere" scrolling=auto src="../../../src/views/project/gantt/gantt.html"></iframe>
                    </template>
                    <!--进度-->
                    <v-schedule-plan v-if="TabFlags.threeFlag"></v-schedule-plan>
                </div>
            </div>
            <!-- 新增任务组件 -->
            <Modal
                    v-model="isAccretionTask"
                    width="662"
                    class="taskModel"
                    :styles="{top: '150px'}"
                    :loading="isSaveLoading"

                    okText='完成上传'
                    cancelText='取消'
                    @on-ok="saveAccretionTaskPop"
            >
                <accretiontaskpop ref="add" v-on:refreshCurrentTaskList='refreshCurrentTaskList'></accretiontaskpop>
            </Modal>
            <!-- excel解析组件 -->
            <Modal v-model="isExcelTask"  class="taskModel" width="1200" @on-cancel="excelCancel">
                <p slot="header">
                    <span>批量导入任务</span>
                </p>
                <div>
                    <excel-modal ref="upload"></excel-modal>
                </div>
                <div slot="footer" style="height:20px;"></div>
            </Modal>
            <excel-modal v-if="isExcelTask"></excel-modal>
        </div>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex'
    import qs from 'querystring'
    import Cookies from 'js-cookie';
    import tasklist from "./task/tasklist";
    import taskinfopop from "./task/taskInfoPop/taskInfoPop";
    import accretiontaskpop from "./task/accretionTaskPop";
    import ExcelModal from "./components/excel"
    import vSchedulePlan from "./schedule"
    import mainNative from '../main-components/mainNative.vue';

    export default {
        components: {
            tasklist,
            taskinfopop,
            accretiontaskpop,
            ExcelModal,
            vSchedulePlan,
            mainNative
        },
        computed:{
        },
        data() {
            return {
                TabFlags:{
                   oneFlag:true,
                   twoFlag:false,
                   threeFlag:false,
                   oneAndOneFlag:JSON.parse(Cookies.get('company')).type == 1 ? false : true,
                   oneAndTwoFlag:true,
                },
                addInput:false,
                aloneActive: '',
                teamActive: '',
                memberItemActive: '',
                itemActive: '',
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
                userID: sessionStorage.userId,
                companyType:JSON.parse(Cookies.get('company')).type
            };
        },
        mounted() {
            this.projectPlan();
            this.autoH();
            this.initTaskMain();
            this.$bus.on('refreshCurrentTaskList', () => {
                this.refreshCurrentTaskList();
            });
            this.setUserStatus(null);
        },
        methods: {
            ...mapMutations(['setProjectInfoDetails', 'setDetailAll', 'setUserStatus']),
            excelCancel() {
                this.$bus.emit('clearExcleData')
            },
            autoH() {
                let oIframe = document.getElementById("show-iframe");
                let deviceHeight = document.documentElement.clientHeight - 190;
                if(oIframe){

                    oIframe.style.width = 100 + "%";
                    oIframe.style.height = deviceHeight + "px";
                }
            },
            //初始化任务相关参数
            initTaskMain() {
                sessionStorage.TaskID = 0;
            },
            //改变任务列表
            changeTaskListData(subType, type, member, item) {
                this.teamActive = '';
                this.aloneActive = '';
                this.itemActive = '';
                if (subType.run_uid && member === 'alone') {
                    this.aloneActive = subType.run_uid;

                } else if (subType.run_uid && member === 'team') {
                    this.teamActive = subType.run_uid;
                    this.memberItemActive = item.child_id;

                } else if (!subType.run_uid && member === 'alone') {
                    this.itemActive = subType.child_id
                }

                if (Object.keys(subType)[0] === 'run_uid') {
                    type = 'member'

                }
                if (subType !== 'all') {
                    subType.project_child_id = subType.child_id;
                }


                this.$refs.list.initTaskListFromId(subType, type, item);

            },
            //刷新当前任务列表
            refreshCurrentTaskList() {
                this.$refs.list.refreshTaskList();
            },
            //进入任务详情
            showTaskDetails(data) {

                this.setDetailAll(data); // 存储list数据
                this.$router.push({path: '/project/details'})

            },
            //编辑后关闭modal
            closeTaskDetails() {
                this.isShowTaskDetails = false;
            },
            //保存新建任务弹窗
            async saveAccretionTaskPop() {
                let result = await this.$refs.add.saveTaskDetail();

                if (result) {
                    this.isSaveLoading = false;
                    this.isAccretionTask = false;
                    this.$Message.success('创建任务成功');
                    this.$refs.add.clearAllData()

                }
                else {
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
            setProjectInfo(projectInfo) {
                this.projectInfo = projectInfo;
            },
            // 项目进度初始化接口
            projectPlan() {
                this.$axios.post(this.GLOBAL.baseRouter + '/task/total/member-child-project-total', qs.stringify({project_id: this.projectId}))
                    .then(({data}) => {
                        if (data.err_code === 0) {
                            this.ChildMsgData = data.data;
                        }
                    })

            },
            // 编辑按钮并获得负责人
            editMode() {
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
            delProject(data) {
                let id = null;
                if (data.child_id) {
                    id = data.child_id
                } else if (data.run_uid) {
                    id = data.run_uid
                }
                ;
                this._ajax('task/project/child-delete', {id: id})
                    .then(({data}) => {
                        if (data.err_code === 0) {
                            this.$Message.success('删除成功');
//                            this.projectPlan()
                        }
                    })
            },
            // 更改负责人
            changePrincipal(data, leader) {
                if (data.leader) {
                    let id = data.child_id;
                    let name = data.child_project_name;
                    this._ajax('task/project/child-update', {id: id, name: name, leader: data.leader})
                        .then(({data}) => {
                            if (data.err_code === 0) {
                                this.projectPlan();
                                this.$Message.success('修改成功');
                            }
                        })
                }
            },
            // 更改项目名称
            changeName(data, e) {
                let id = data.child_id;
                let name = e.target.value
                if (data.child_project_name !== name) {
                    this._ajax('task/project/child-update', {id: id, name: name, leader: data.leader})
                        .then(({data}) => {
                            if (data.err_code === 0) {
                                this.projectPlan();
                                this.$Message.success('修改成功');
                            }
                        })
                }
            },
            // 添加项目
            addButton(type) {
                if(type){
                    this._ajax('task/project/child-add', {
                        project_id: this.projectId,
                        name: this.subProjectName,
                        leader: this.subProjectManager
                    })
                        .then(({data}) => {
                            if (data.err_code === 0) {
                                this.$Message.success('添加成功');
                                this.projectPlan()
                            }
                        })
                }
                this.subProjectManager = '';
                this.subProjectName = '';
                this.addInput = false;
            },
            addInputShow(){
                this.addInput = !this.addInput
            },
            _ajax(url, data) {
                return this.$axios.post(this.GLOBAL.baseRouter + url, qs.stringify(data))
            },
            //切换TAB
            switchTabFun(index){
                switch (index){
                    case 1:
                        this.TabFlags.oneFlag = true;
                        this.TabFlags.twoFlag = false;
                        this.TabFlags.threeFlag = false;
                        this.TabFlags.oneAndTwoFlag = true;
                        this.TabFlags.oneAndOneFlag = this.companyType == 1 ? false : true;
                        break;
                    case 2:
                        this.TabFlags.oneFlag = false;
                        this.TabFlags.twoFlag = true;
                        this.TabFlags.threeFlag = false;
                        this.TabFlags.oneAndTwoFlag = false;
                        this.TabFlags.oneAndOneFlag = false;
                        break;
                    case 3:
                        this.TabFlags.oneFlag = false;
                        this.TabFlags.twoFlag = false;
                        this.TabFlags.threeFlag = true;
                        this.TabFlags.oneAndTwoFlag = false;
                        this.TabFlags.oneAndOneFlag = false;
                        break;
                    default:
                        this.TabFlags.oneFlag = true;
                        this.TabFlags.twoFlag = false;
                        this.TabFlags.threeFlag = false;
                        this.TabFlags.oneAndTwoFlag = true;
                        this.TabFlags.oneAndOneFlag = this.companyType == 1 ? false : true;
                }
            }
        },
    };
</script>
<style lang="less" >
    @green: #3bceb6;
    .task {
        .ivu-tabs ,.ivu-tabs-content-animated{
            height: 90%;
        }
        position: relative;
        height: 100%;
        .taskMainContainer {
            margin: 30px 0;
            display: flex;
            justify-content: space-between;
            height: 100%;
            .ivu-tabs .ivu-tabs-content-animated {
                margin-top: 60px;
            }
            .ivu-tabs-nav-container {
                height: 60px !important;
            }

            .ivu-tabs-ink-bar {
                margin-left: 16px;
                height: 6px !important;
                background: @green !important;
            }
            .ivu-tabs-tab {
                padding: 8px 6px;
                margin-left: 16px;
                margin-right: 0 !important;
                font-size: 14px;
                line-height: 32px;
                &:hover {
                    color: #48c5b5;
                }
            }
            .ivu-tabs-tab-active {
                color: #48c5b5;
            }
            .eidtList{
                overflow: auto;
                height: 720px;
                border: 1px solid #ddd;
                border-top: 0;
                overflow-y: auto;
            }
            .projectPlanRight {
                height: 800px;
                width: 33%;
                z-index: 333;
                overflow: hidden;
                /*background: #c4f0e9;*/
                border-radius: 5px;
                margin-right: 30px;
                .editRightRow{
                    background: #eef1f2;
                    .addBlock{
                        /*border-bottom: 1px solid #f2f2f2;*/
                        padding: 20px;
                        background: #fff;
                    }
                    .ivu-input{
                        border-left: 1px solid transparent;
                        border-top: 1px solid transparent;
                        border-right: 1px solid transparent;
                        background: transparent!important;
                        color: #777777;
                    }
                    .ivu-select-selection{
                        color: #777777;
                        background: transparent!important;
                    }
                    .lineEdit{
                        border-bottom: 1px solid #f2f2f2;
                        padding: 30px 20px;
                        margin-bottom: 20px;
                        background: #fff;
                    }
                }
                .Listall {
                    height: 30px;
                    padding-left: 5px;
                    line-height: 30px;
                    background: @green;
                    color: #fff;
                    cursor: pointer;
                    &:hover {
                        border: 1px solid #48c5b5;
                    }
                }
                .titleList {
                    display: flex;
                    padding: 17px 0 17px 5px;
                    background: #fff;
                    /*border: 1px solid red;*/
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    .showPlan {
                        flex: 1;
                        margin-top: 8px;
                    }
                    .headTitle {
                        .headImg {
                            width: 50px;
                            height: 50px;
                            border-radius: 50%;
                        }
                        .titleText {
                            display: inline-block;
                            width: 40px;
                            text-align: center;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            cursor: pointer;
                        }

                        span {
                            vertical-align: middle;
                        }
                        .iconfont:nth-of-type(2) {
                            vertical-align: middle;
                        }
                    }
                    .aloneHead {
                        width: 90px;
                    }
                    .aloneRight {
                        margin-top: 27px;
                    }
                    .showPlanColor {
                        margin: 0;
                    }
                    .ratio {
                        width: 60px;

                        text-align: center;
                    }
                    &:hover {
                        border-top: 1px solid @green;
                        border-bottom: 1px solid @green;
                    }
                }
                .projectMemberList {
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
                    .memberRatio {
                        width: 40px;
                        text-align: center;
                        color: #fff;
                        background: @green;
                    }
                    &:hover {
                        border: 1px solid #48c5b5;
                    }
                }
                .editList {
                    display: flex;
                    margin-bottom: 10px;
                    justify-content: space-between;
                    .text{
                        color: #bdbdbd;
                        letter-spacing:1px;
                    }
                    .iconDel{
                        line-height: 38px;
                        opacity: 0;
                    }
                    &:hover{
                        .iconDel{
                            opacity: 1;
                        }
                    }
                }

                .flag {
                    position: absolute;
                    top: 0;
                    left: 20px;
                    transform: scale(0.8);
                }
                .rightTitle {
                    font-weight: lighter;
                    font-size: 16px;
                    position: relative;
                    color: #7d8180;
                    background: #c4f0e9;
                    .editBtn {
                        position: absolute;
                        top: 50%;
                        right: 16px;
                        transform: translateY(-50%);
                        cursor: pointer;
                    }
                }
                .editShowPlan {
                    margin-left: 355px !important;
                }
                .alone {
                    display: flex;
                    margin-left: 20px;
                    background: #fff;
                    line-height: normal !important;
                }
                .editList {
                    display: flex;
                    padding-right: 10px;
                    justify-content: space-between;
                }
            }
            .taskListContainer{
                height: 800px;
                /*background: #fff;*/
            }
            .activeTask {
                border-top: 1px solid @green;
                border-bottom: 1px solid @green;
            }
        }
        .projectPlanButton {
            text-align: right;
            background: #fff;
        }
    }

    .task-tab {
        width: 100%;
        overflow: hidden;
    }

    .task-operation {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
        z-index: 2;
        button{
            margin-left: 10px;
            background: #fff;
            cursor: pointer;
            color: #3bceb6;
            border: none;
            outline: none;
            padding: 8px 10px 8px 30px;
            font-size: 14px;
            border-radius: 5px;
            &:nth-child(1){
                 background: url("./components/imgEditorTwo/images/taskIcos.png")#fff no-repeat left center;
                 background-position: 10px -31px;
             }
            &:nth-child(2){
                background: url("./components/imgEditorTwo/images/taskIcos.png")#fff no-repeat left center;
                background-position: 10px 10px;
            }
        }

    }
    .taskModel{



        .ivu-modal-content{
            .ivu-modal-close{
                right: 30px;
            }
            .ivu-modal-body{
                padding: 0;
                h1{
                    background: #4ACAC6;
                    height: 62px;
                    line-height: 62px;
                    border-radius: 4px;
                    font-size: 20px;
                    color: #fff;
                    font-weight: normal;
                    padding-left:30px;

                }
                .taskDetailsContainer{
                    padding:15px 70px 15px 52px;
                    .borBotm{
                        padding: 0;
                    }
                    .ivu-form-item-label{
                        color: #CACACA;
                    }
                    .btn{
                        position: relative;

                        color: #898989;
                        font-size: 12PX;


                    }
                    .shade{
                        background: #EEF1F2;
                         border: 0;
                         height: 100px;
                        .ivu-icon-android-upload{
                             display: block;
                             font-size: 32px;
                             color: #3bceb6;
                             margin-bottom: -48px;
                             padding-top: 28px;
                         }
                    }
                    .remark-item{
                        height: 62px;
                        .remark {
                            .ivu-input{
                            height: 62px!important;
                            margin-bottom: 0!important;

                            }
                        }
                    }

                }

            }
            .ivu-modal-footer{
                border: 0;
                padding-right:70px;
                padding-bottom: 42px;
                .ivu-btn-large{
                    width: 120px;
                    height: 42px;
                }
            }
        }
    }
</style>

