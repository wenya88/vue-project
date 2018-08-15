<!-- 任务信息弹窗-->
<template>
    <div class="taskinfopop">
        <div class="title">
            <span style="margin-left: 50px;"><Icon type="ios-person"  size="30" style="vertical-align: middle;color: #3bceb6;" ></Icon>任务/详情</span>
        <Button  style="font-size: 18px;" @click="leaveInfo" type="text">返回</Button>
        </div>
        <div class="taskinfopopContainer">
            <Tabs   type="card" class="filebrowse taskManagement">
                <TabPane label="基本管理" style="height: 800px;overflow-y: auto">
                    <div v-show="isInitTask">
                        <maintask ref="main"
                                  v-on:sendSubTaskList="sendSubTaskList"
                                  v-on:sendLogData="sendLogData"
                                  taskManagement="true"
                        >
                        </maintask>
                        <div style="text-align: right">
                            <Button @click="saveTaskDetail">保存</Button>
                        </div>
                    </div>
                </TabPane>
                <TabPane label="规范" style="height: 800px;overflow-y: auto">
                    <v-standard></v-standard>
                </TabPane>
                <TabPane label="资源" style="height: 800px;overflow-y: auto">
                    <v-resource></v-resource>
                </TabPane>
                <TabPane :label="userStatus === 'member'?'关联任务':'子任务'" style="height: 800px;overflow-y: auto">
                    <subtasklist></subtasklist>
                </TabPane>
                <TabPane label="日志" style="height: 800px;overflow-y: auto">
                    <tasklog ref="log"></tasklog>
                </TabPane>
            </Tabs>
            <section class="videoRight">
                <filebrowse ref="filebrowse"
                            class="filebrowseContainer"
                ></filebrowse>
            </section>
        </div>
    </div>
</template>
<script>
    import {mapState,mapMutations} from 'vuex'
    import qs from 'querystring'

    import maintask from "../taskDetails";
    import subtasklist from "../subtask";
    import tasklog from "../taskLog";
    import filebrowse from "../../components/fileBrowseManager";
    import vStandard from "./standard";
    import vResource from "./resource";

    export default {
        props: [
            "taskID"
        ],
        components: {
            maintask,
            subtasklist,
            tasklog,
            filebrowse,
            vStandard,
            vResource
        },
        mounted() {
            this.initTaskDetail();
            this.initTaskDetailProjecInfo();
        },
        beforeDestroy(){
            /*清空 让左侧菜单显示*/
            this.setDetailAll(null)
        },
        data() {
            return {
                editDataName:null,
                subtaskInfo: null,
                taskId: 0,
                editData: {},
                isInitTask: false,
                subData: [],
                handleUrl: [],
                fileUrl: [],
                setypeClass: [],
                pushSubData: {},
                project_child: "",
                formLeft: {}
            };
        },
        methods: {
            ...mapMutations(['setPrimaryMission','setDetailAll','setUserStatus']),
            //根据任务ID初始化属性
            initTaskDetail() {
                /*没有数据 返回之前页*/
                if (!this.$store.state.project.detail.setDetailAll) {
//                    this.$router.go(-1);
                }
                let taskData = this.$store.state.project.detail.setDetailAll;
                this.isInitTask = true;

                if (taskData) {
                    this.$refs.main.initTaskDetailFromID(taskData.id); // 加载表单数据
                    let filetype = taskData.stage_file ? taskData.stage_file.type : "NULL";
                    this.$refs.filebrowse.initFileBrowse(taskData.id, filetype);
                }


            },
            //初始化项目信息
            initTaskDetailProjecInfo() {

                let data = this.$store.state.project.detail.projectInfo;
                this.$refs.main.initProjectInfo(data);
            },
            //子任务子组件传参
            sendSubTaskList(data) {
//      this.$refs.sublist.initSubTaskListData(data);
            },
            //日志子组件传参
            sendLogData(data) {
                this.$refs.log.inittaskLogData(data);
            },
            //保存所有的任务信息，包含子任务
            saveTaskDetail() {
                //保存父任务
                this.$refs.main.saveTaskDetails(true);
                //保存子任务
//      this.$refs.sublist.saveSubTasks();

                this.$Message.success('保存成功');
                return true;
            },
            //单击编辑Modal中子任务列表，数据添加至右侧form表单
            clickLine: function (index) {
                this.pushSubData = index;
            },
            //刪除任务
            delTask() {
                this.$refs.main.delTaskDetail();
                this.$emit("delTask");
            },
            //增加编辑Modal子任务模版
            addChildTask: function () {
                this.subData.push({
                    name: "暂无名称",
                    plan: "暂无进度"
                });
            },
            //子任务新增数据
            subSave: function () {
                let cIs = this;
                let dateForm = {};
                dateForm.father = cIs.editData.id;
                dateForm.name = cIs.pushSubData.name;
                dateForm.project = cIs.pushSubData.project_id;
                dateForm.project_child = cIs.pushSubData.project_child;
                dateForm.tasktype_id = cIs.pushSubData.tasktype_id
                    ? cIs.pushSubData.tasktype_id
                    : 0;
                dateForm.expect_start_time = cIs.pushSubData.expect_start_time;
                dateForm.expect_end_time = cIs.pushSubData.expect_end_time;
                dateForm.description = cIs.pushSubData.description;
                dateForm.image = JSON.stringify(cIs.handleUrl);
                dateForm.file = JSON.stringify(cIs.fileUrl)
                    ? JSON.stringify(cIs.fileName)
                    : 0;
                cIs.$axios
                    .post("/task/task/add", qs.stringify(dateForm))
                    .then(res => {
                        if (res.data.err_code === 0) {
                            cIs.$emit("close");
                            this.forEachData();
                            this.$Message.success("成功新增一条任务！");
                        } else {
                            this.$Message.error("新增任务失败，请重试！");
                        }
                    })
                    .catch(error => {
                        this.$Message.error("新增任务失败，请重试！");
                    });
            },


            //参与人选项卡
            memberList(index) {
                this.num = index;
            },
            /**
             * get请求
             */
            get(url, params, call) {
                /*获取列表信息*/
                this.$http.get(url, {params: params}).then(
                    function (res) {
                        call(res);
                    },
                    function (error) {
                        this.$Message.error("数据加载出错了！请刷新浏览器");
                    }
                );
            },
            //判断主任务是否包含子任务数据
            forEachData() {
                let cdy = this;
                let child = this.editData.child;
                if (child) {
                    cdy.subData = child;
                }
            },
            //获取任务类型
            getTaskClass() {
                let clT = this;
                this.get(
                    cateList,
                    {
                        company_id: 1
                    },
                    res => {
                        clT.formLeft = res.data.data;
                        for (let i = 0; i < clT.formLeft.length; i++) {
                            this.setypeClass = clT.formLeft[i].tasktype;
                        }
                    }
                );
            },
            subChild(pName) {
                this.pushSubData.project_child = pName;
            },
            subClasst(TypeName) {
                this.pushSubData.tasktype_name = TypeName;
            },
            //删除子任务列表数据
            removeChild(index) {
                let cIs = this;
                let removeSubData = this.subData[index].id;
                this.get(
                    deletetaskData,
                    {
                        id: removeSubData
                    },
                    () => {
                        cIs.$Message.success("刪除子任务成功！");
                        cIs.getProjectId();
                    }
                );
                this.subData.splice(index, 1);
            },
            // 清除进入详情页获得的任务数据
            leaveInfo() {
                /*返回清空任务ID清空身份*/
                this.setPrimaryMission(null);
                this.setUserStatus(null);
                this.$router.back(-1)
            }
        },
        computed:{
            ...mapState({
                userStatus(value){
                    return value.project.userStatus
                }
            })
        }
    };
</script>
<style lang="less">
    @import "../../style/taskModal.css";
    @green:#3bceb6;
    @gray: #E6EAEB;
    @title:#aeaeae;
    @text:#8b8b8b;
    .taskinfopop {
        overflow: hidden;
        .title {
            display: flex;
            margin-top: 5px;
            padding: 0 52px 0 10px;
            line-height: 40px;
            font-size: 18px;
            justify-content: space-between;
        }
        .taskinfopopContainer{
            display: flex;
            .videoRight{
                flex: 1;
                max-height: 100%;
                /*margin-bottom: 300px;*/
                .reviewPanel{
                    margin: 0 60px;
                    height: 100px;

                }
            }
        }
        .taskManagement {
            width: 415px;
            margin: 0 90px 0 0;
            background: #fcfdfd;

        }
        .taskbrowse {
            width: 540px !important;
            padding-right: 200px;
            margin: 0 12px 0 0;
        }
        .ivu-tabs-nav-scroll{
            margin-left: 20px;
        }
        .ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab-active{
            position: relative;
            color: #fff !important;
            background: @green;
            &:after{
                content: '';
                display: block;
                position: absolute;
                left: 50%;
                bottom:-12px;
                width: 0;
                height: 0;
                border: 6px solid @green;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-bottom: 6px solid transparent;
                transform: translateX(-50%);
            }
        }

        .ivu-tabs-bar {
            .ivu-tabs-nav-container {
                height: 55px !important;

            }
            .ivu-tabs-tab {
                width: 75px;
                height: 35px !important;
                padding: 0 !important;
                margin: 0 !important;
                text-align: center;
                line-height: 35px !important;
                color: #b0b0b0;
                border-radius:0 !important;
                /*padding: 5px 14px 4px !important;*/
            }

        }

        .ivu-form-item {
            /*&:hover{*/
            /*.ivu-form-item-label{*/
            /*top:0 ;*/
            /*}*/
            /*}*/
        }
        .ivu-date-picker {
            width: 100%;
        }
        .ivu-input-group-prepend {
            font-size: 22px;
            background: transparent;
            border: none;
            /*border-bottom: 1px solid #ccc;*/
        }
        .ivu-input, .ivu-select-selection {
            font-size: 16px;
            color: @text;
            background: transparent;
            border: none;
            /*border-bottom: 1px solid #ccc;*/
            outline: none;
            box-shadow: none;
            &:focus, &:hover {
                /*border-bottom: 1px solid #ccc;*/
                box-shadow: none;

            }
        }
        .ivu-select-visible, .ivu-select-selection {
            font-size: 16px;
            color: @text;
            /*border-bottom: 1px solid #ccc !important;*/
            outline: none !important;
            box-shadow: none !important;
        }
        .ivu-form-item {
            position: relative;
            .ivu-form-item-label {
                color: @title;
                /*margin-left: 10px;*/
                text-align: left;
            }
        }
        .requirement {
            padding: 5px 10px 70px 10px;
            background: #fff;
            .ivu-card {
                background: transparent;
                border: none;
                .ivu-card-body {
                    padding: 16px 0;
                }
                &:hover {
                    box-shadow: none;
                }
            }
            .ivu-input {
                padding-right: 0;
                font-size: 20px;
                text-align: right;
            }
            .ivu-input-icon {
                left: 0;
                font-size: 20px;
            }
            p {
                display: flex;
                height: 22px;
                margin-bottom: 10px;
                padding: 0 5px;
                font-size: 14px;
                line-height: 22px;
                justify-content: space-between;
                border-radius: 8px;
                background: @gray;
            }
        }
        .ivu-upload-list {
            width: 100%;
            border-bottom: 1px solid #ccc;
        }

        .taskButton {
            margin-top: 10px;
            padding-right: 120px;
            text-align: right;
            button {
                width: 110px;
                height: 35px;
                margin-right: 30px;
                text-align: center;
                line-height: 35px;
                color: #657180;
                background: #fff;
                border: 1px solid #e4e4e4;
                border-radius: 4px;
                box-shadow: 2px 2px 2px 0 #e4e4e4;
                cursor: pointer;
                outline: none;
                &:active {
                    transform: translate3d(2px, 2px, 0);
                }
            }
        }
    }

    .task-body {
        width: 1100px;
        padding: 0;
    }

    .task-option {
        /*width: 60px;*/
        padding: 0 0 0 20px;
    }



    .filebrowseContainer {
        height: 100%;
        flex: 1;
        margin: 10px 30px 0 60px;



    }
</style>
