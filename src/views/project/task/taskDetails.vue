<!-- 任务详情组件 -->
<template>
    <div class="taskDetailsContainer">

        <Form :label-position="taskManagement?'top':'left'" :label-width="taskManagement?0:60">
            <FormItem v-if="!taskManagement" label="任务名称">

                <Input v-model="editData.name" :disabled="editDisabled">
                <span v-if="taskManagement" slot="prepend"><Icon type="ios-person-outline"></Icon></span>
                </Input>
            </FormItem>

            <FormItem label="负责人" class="borBotm" v-if="companyType == 0">
                <div class="head">
                    <!--<img v-if="taskManagement" src="./QQ图片20180719133401.jpg" class="headImg" alt="">-->
                    <Select v-model="principalName" :disabled="editDisabled" placeholder="请选择负责人" @on-change="saveShow">
                        <Option v-for="(item,index) in principal" :value="item.member_id" :key="'principal'+index">
                            {{ item.remark_name }}
                        </Option>
                    </Select>
                </div>
            </FormItem>
            <!--<FormItem  v-else label="负责人">-->
            <!--<Select v-model="principalName"  placeholder="">-->
            <!--<Option v-for="item in principal" :value="item.id" :key="item.value">{{ item.remark_name }}</Option>-->
            <!--</Select>-->
            <!--</FormItem>-->
            <FormItem label="计划时间" class="borBotm">
                <DatePicker
                        :value="getTimeRange"
                        @on-change="setTimeRange"
                        format="  yyyy-MM-dd  "
                        type="daterange"
                        :options="startTime"
                        split-panels
                        :readonly="editDisabled"
                        style="width: 100%"
                >
                </DatePicker>
            </FormItem>
            <FormItem label="子项目" class="borBotm">
                <Select
                        @on-change='setChildProject'
                        v-model="editData.project_child"
                        clearable
                        :disabled="editDisabled"
                        placeholder=""
                >
                    <Option
                            v-for="(item,index) in childProjectsList"
                            :key="'children'+index"
                            :value="item.id"
                    >
                        {{item.name}}
                    </Option>
                </Select>
            </FormItem>
            <FormItem v-if="taskManagement" label="任务类型" class="borBotm">
                <section class="requirement">
                    <AutoComplete v-model="editData.tasktype_name"
                                  @on-select="selectTaskType"
                                  :disabled="editDisabled"
                                  icon="android-color-palette"
                                  @on-change="saveShow"
                    >
                        <Option v-for="(item,index) in taskTypesList"
                                :key="'taskManagement'+index"
                                :value="item.tasktype_name"
                        >
                            <span> {{item.tasktype_name}}</span>
                        </Option>
                    </AutoComplete>
                    <Card :bordered="true" style="text-align: center">
                        <div v-for="(item,index) in taskTypeInfo" :key="'file'+index">
                            <p>
                                <span>尺寸</span><span>{{item.require[0].value ? item.require[0].value : '无'}}</span>
                            </p>
                            <p>
                                <span>格式</span><span>{{item.file_format}}</span>
                            </p>
                        </div>
                    </Card>

                </section>
            </FormItem>
            <template v-else>
                <FormItem label="任务类型" class="borBotm">
                    <AutoComplete v-model="editData.tasktype_name"
                                  placeholder="选择任务类型"
                                  @on-select="selectTaskType"
                                  :disabled="editDisabled"
                    >
                        <Option v-for="(item,index) in taskTypesList"
                                :key="'taskTypesList'+index"
                                :value="item.tasktype_name"
                        >
                            <span> {{item.tasktype_name}}</span>
                        </Option>
                    </AutoComplete>
                </FormItem>
                <!--<FormItem label="文件要求">-->
                    <!--<Card :bordered="true" style="text-align: center">-->
                        <!--<p v-for="(item,index) in taskTypeInfo" :key="'taskTypeInfo'+index">-->
                            <!--{{item.file_format}}&#160&#160{{item.require[0].value}}-->
                        <!--</p>-->
                    <!--</Card>-->
                <!--</FormItem>-->
            </template>

            <FormItem label="参考附件" class="borBotm">
                <div>
                    <v-upload :id="uploadId" v-on:FileUploadedSuccess="getUploadFile" v-if="!editDisabled">
                        <template slot="upload">
                            <button :id="uploadId" class="btn">选择文件</button>
                            <p class="shade"><Icon type="android-upload"></Icon> 拖入或点击可上传文件</p>
                        </template>
                    </v-upload>

                    <ul>
                        <li class="flieList" v-for="(items,index) in flieList" :key="index">
                            <span class="fileText"><Icon type="android-document"></Icon><p :title="items.name"> {{items.name}}</p></span>
                            <span >
                                <a :href="items.url" download="" target="_blank" style="color: #657180">下载 &nbsp;</a>
                                <Icon @click.native="delImage(items)" type="ios-close-outline" v-if="!editDisabled"></Icon>
                            </span>
                        </li>
                    </ul>

                    <!--<Upload-->
                    <!--@on-change="saveShow"-->
                    <!--multiple-->
                    <!--type="drag"-->
                    <!--:show-upload-list="true"-->
                    <!--:on-success="referenceFileSuccess"-->
                    <!--:on-remove ="referenceFileRemove"-->
                    <!--:action="fileup"-->
                    <!--:default-file-list="referenceFileName"-->
                    <!--&gt;-->
                    <!--<Icon type="ios-cloud-upload" size="32" style="color: #3399ff"></Icon>-->
                    <!--<p>点击或拖入上传</p>-->
                    <!--</Upload>-->

                </div>
                <!-- <div v-for="item in editData.file" :key="item.url">{{item.url}}</div> -->
            </FormItem>
            <FormItem label="备注" class="borBotm remark-item">
                <Input
                        @on-change="saveShow"
                        class="remark"
                        v-model="editData.description"
                        type="textarea"
                        size="large"
                        :autosize="{minRows: 2,maxRows: 5}"
                        :disabled="editDisabled"

                ></Input>
            </FormItem>

        </Form>
    </div>
</template>

<script>
    var qs = require("querystring");
    import {mapState, mapMutations} from 'vuex';
    import api from 'api';
    import vUpload from '@/components/upload'
    import Cookies from 'js-cookie';
    export default {
        props: {
            taskManagement: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                flieList: [],// 上传组件回显的图片
                saveButtonShow: false,
                projectId: sessionStorage.getItem('projectID'),
                //*任务属性*//
                taskID: 0,
                editData: {},
                //*任务属性选项*//
                editDisabled: false,//能否编辑
                isNewTask: false,//是否为新任务
                principal: [],//负责人列表
                principalName: "",//搜索框负责人名字
                principalNum: 1,
                principalType: [],//供选择的负责人类型
                referenceFileList: [],//附件文件列表
                childProjectsList: [],//供选择的子项目列表
                taskTypesList: [],//供选择的任务类型
                taskTypeInfo: {},//任务类型信息
                referenceFileName: [],//附件文件名称
                referenceFileUrl: [],//附件文件地址
                dateRange: "",
                principalList: [],
                //*时间属性选项*//
                startTime: {
                    disabledDate(date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
                endTime: {
                    disabledDate(date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
                companyType:JSON.parse(Cookies.get('company')).type
            }
        },
        created() {
            this.getTaskTypeList();
        },
        mounted() {
            let userType =JSON.parse(Cookies.get('company'));
            if(userType.post_id !== '3' && userType.type != 1){
                this.setEditDisabled(false)
            }else {
                this.setEditDisabled(true)
            }
            // console.log(userType)
            // if (this.userStatus !== 'member') {
            //     // JSON.parse(Cookies.get('company')).type == 1 ? true :
            //     this.setEditDisabled(false)
            // }
        },
        beforeDestroy() {

        },

        computed: {
            ...mapState({
                userStatus(value) {
                    return value.project.userStatus
                },
                toName(value) {
                    return value.ImgVedioStatus.toName;
                }
            }),
            getTimeRange() {
                return [this.editData.expect_start_date, this.editData.expect_end_date]
            },
            fileup() {
                return this.$store.state.paySkip.fileUpload
            },
            uploadId() {
                return 'upload' + Math.random()
            }

        },
        methods: {
            saveShow() {
                this.$emit('buttonShow');
            },
            ...mapMutations(['setTaskInfo', 'changeComponentTaskID', 'changeComponentFileURl']),
            //获取任务详情
            initTaskDetailFromID(id, fatherFunctions) {
                if (id != 0) {
                    this.getChildProject()
                    this.taskID = id;
                    this.$axios.post(this.GLOBAL.baseRouter + 'task/task/info', qs.stringify({id: this.taskID}))
                        .then(res => res.data)
                        .then(res => {
                                this.initTaskDetailFromData(res);
                                this.getTaskTypeRequire(res.tasktype_id);
                                this.clickMenberDropdown();
                                this.callFatherFunction(fatherFunctions);
                                this.principalName = res.member_id;
                                this.flieList = res.file || [];
                                this.setTaskInfo(res);  // vux存储info
                                // 资源管理页面进入时 会调用图片
                                if (this.toName !== 'quality') {
                                    this.$bus.emit('initFileBrowse', {taskid: res.id, type: res.stage_file_type});
                                    this.changeComponentTaskID(res.id);
                                    this.changeComponentFileURl(res.stage_file);
                                }
                            }
                        )
                        .catch(error => {
                            console.log(error);

                            this.$Message.error("获取任务信息失败，请重试！");
                        });
                }
            },
            //直接赋值任务属性-DONE
            initTaskDetailFromData(data) {
                this.editData = data;
                this.formatLocalData();

            },
            //设置能否编辑-DONE
            setEditDisabled(forbidEdit) {
                this.editDisabled = forbidEdit;
            },
            //新增任务初始化-DONE
            initTaskDetailFromNew(projectInfo) {
                this.isNewTask = true;
                this.initProjectInfo(projectInfo);
                this.clickMenberDropdown();
                this.getChildProject()
            },
            //初始化项目相关信息-DONE
            initProjectInfo(projectInfo) {
                if (projectInfo) {
                    this.editData.project_id = projectInfo.id;
                }
//            this.childProjectsList = projectInfo.child;
            },
            //外部获得任务数据-DONE
            getTaskDetail() {
                return this.editData;
            },
            //获得任务类型要求-DONE
            getTaskTypeRequire(tasktype_id) {
                if (tasktype_id == 0 || tasktype_id == null)
                    return false;
                this.$axios.post(this.GLOBAL.baseRouter + 'task/task-type/info', qs.stringify({id: tasktype_id}))
                    .then(res => res.data)
                    .then(res => {
                            this.taskTypeInfo = [];
                            this.taskTypeInfo = res.file;

                            // res.file.forEach((res)=>
                            // {
                            //     this.taskTypeInfo.push({
                            //         file_format:res.file_format,
                            //         config_name:res.require.value,
                            //         is_main:res.is_main,
                            //         }
                            //     );
                            // })
                        }
                    )
                    .catch(error => {
                        //this.$Message.error("获取任务信息失败，请重试！");
                    });
            },
            //获得全部任务类型列表-DONE
            getTaskTypeList() {
                this.$axios.post(this.GLOBAL.baseRouter + 'task/project-tasktype/list', qs.stringify({project_id: this.projectId}))
                    .then(res => res.data)
                    .then(({data}) => {
                        this.taskTypesList = data
                    })
                    .catch(error => {
                        //this.$Message.error("获取任务信息失败，请重试！");
                    });
            },
            //格式化本地数据
            formatLocalData() {
                this.referenceFileName = [];
                if (this.editData.file) {
                    this.editData.file.forEach(
                        (res) => {
                            this.referenceFileName.push({
                                name: "",
                                url: res
                            });
                        }
                    );
                }

            },
            //用于父组件通信-DONE
            callFatherFunction(fatherfunctions) {
                if (this.editData.child)
                    this.$emit('sendSubTaskList', this.editData);//这里子任务需要父任务的一些属性
                if (this.editData.log)
                    this.$emit('sendLogData', this.editData.log);
                if (fatherfunctions) {
                    fatherfunctions.forEach(
                        (res) => {
                            this.$emit(res.functionName);
                        }
                    );
                }
            },
            //主任务保存编辑数据
            saveTaskDetails(link, id) {
                let dataForm = {};
                dataForm.id = this.editData.id;
                dataForm.father = this.editData.father ? this.editData.father : 0;
                dataForm.name = this.editData.name;
                dataForm.project = this.projectId;
//                dataForm.project = this.editData.project_id;
                dataForm.project_child = this.editData.project_child;
                dataForm.tasktype_id = this.editData.tasktype_id ? this.editData.tasktype_id : 0;
                dataForm.expect_start_time = this.editData.expect_start_date;
                dataForm.expect_end_time = this.editData.expect_end_date;
                dataForm.description = this.editData.description;
//                dataForm.file = JSON.stringify(this.referenceFileUrl) ? JSON.stringify(this.referenceFileUrl) : [];
                dataForm.file = JSON.stringify(this.flieList) ? JSON.stringify(this.flieList) : [];
                dataForm.run_member_id = this.principalName;
                dataForm.remark_name = this.principalName;
                if (id) {
                    dataForm.father = id;
                }


                return this.isNewTask ? this.addTaskDetails(dataForm) : this.updateTaskDetail(dataForm, link);
            },
            //获得参与人ID
            getUserId(namesData) {
                if (this.principal.length > 0) {
                    for (let i = 0; i < this.principal.length; i++) {
                        if (namesData == this.principal[i].remark_name) {

                            return this.principal[i].id;
                        }
                    }
                }
                else
                    return null;
            },
            //获得参与人ID
            getUserName(namesId) {


                if (this.principal.length > 0) {
                    for (let i = 0; i < this.principal.length; i++) {
                        if (namesId == this.principal[i].id) {

                            return this.principal[i].remark_name;
                        }
                    }
                }
                else
                    return "";
            },
            //新增任务
            addTaskDetails(dataForm) {
                this.$axios.post(this.GLOBAL.baseRouter + "/task/task/add", qs.stringify(dataForm))
                    .then(res => {
                        this.flieList = [];
                        this.$bus.emit('refreshCurrentTaskList');
                        this.$bus.emit('clearExcleData');
                    })
                    .catch(error => {
                        this.$Message.error("新建任务失败，请重试！");
                        return false;
                    });
                return true;
            },
            //更新任务
            updateTaskDetail(dataForm, link) {
                this.$axios.post(this.GLOBAL.baseRouter + "/task/task/update", qs.stringify(dataForm))
                    .then(res => {
                        this.$bus.emit('refreshCurrentTaskList');
                        if (link) {
//                                this.$router.push({path:'/project/task'});
                        }
                    })
                    .catch(error => {
                        this.$Message.error("编辑任务失败，请重试！");
                        return false;
                    });
                return true;
            },
            //删除任务
            delTaskDetail() {
                this.$axios.post(this.GLOBAL.baseRouter + "/task/task/delete", qs.stringify({id: this.editData.id}))
                    .then(res => {
                        this.$bus.emit('refreshCurrentTaskList');
                    })
                    .catch(error => {
                        this.$Message.error("删除任务失败，请重试！");
                        return false;
                    });
                return true;
            },
            //初始化编辑数据
            initEditData() {
                this.editData = {};
            },
            //开始时间
            setTimeRange(date, date_now) {
                this.$emit('buttonShow');
                this.editData.expect_start_date = date[0];
                this.editData.expect_end_date = date[1];
            },
            // 获得子项目
            getChildProject() {
                this.$axios.post(this.GLOBAL.baseRouter + "/task/project/child-list", qs.stringify({id: sessionStorage.getItem('projectID')}))
                    .then(({data}) => {
                        this.childProjectsList = data.data
                    })
            },
            //设置子项目
            setChildProject(pId) {
                this.$emit('buttonShow');
                this.editData.project_child = pId;

            },
            //选择任务类型自动改变类型要求-DONE
            selectTaskType(id_name) {

                if (id_name != null) {
                    this.taskTypesList.forEach(
                        (res) => {
                            if (res.tasktype_name == id_name) {
                                this.editData.tasktype_id = parseInt(res.id);
                                this.getTaskTypeRequire(res.id);
                            }
                        }
                    );
                }
            },
            //----------参与人-------------//
            //点击参与人下拉
            clickMenberDropdown() {
                this.$axios.post(this.GLOBAL.baseRouter + 'task/company/joined-members', qs.stringify({project_id: this.projectId}))
                    .then(res => res.data)
                    .then(res => {
                            this.principal = res.data;
//                        this.principal=[];
//                        this.principalName="";
//                        this.principal = res.data;
//                        this.principalName = this.getUserName(this.editData.member_id)
                        }
                    )
                    .catch(error => {

                        this.$Message.error("获取公司成员失败，请重试！");
                    });
            },
            //参与人滚动条
            principalHandleReachBottom() {
                return new Promise(resolve => {
                    setTimeout(() => {
                        const last = this.list1[this.list1.length - 1];
                        for (let i = 1; i < 11; i++) {
                            this.list1.push(last + i);
                        }
                        resolve();
                    }, 2000);
                });
            },
            //移除已选参与人
            removePartici(event, name) {
                this.principal.splice(this.principal.indexOf(name), 1);
            },
            //设置任务类型
            setTaskClass(TypeName) {
                this.editData.tasktype_name = TypeName;
            },
            //----------上传文件-------------//
            // 上传附件成功后返回
            referenceFileSuccess(response, file, fileList) {
                this.$emit('buttonShow');
                this.referenceFileUrl.push(response.file.url);
            },
            //移除附件
            referenceFileRemove(file, fileList) {
                for (let i = 0; i < this.referenceFileUrl.length; i++) {
                    if (this.referenceFileUrl[i] == file.response.affix.url) {
                        this.referenceFileUrl.splice(i);
                    }
                }
            },
            //判断图片格式
            handleFormatError(file) {
                this.$Notice.warning({
                    title: "文件格式不正确",
                    desc: "文件格式 " + file.name + " 不正确，请选择jpg或png"
                });
            },
            //判断图片大小
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: "文件大小超过限制",
                    desc: "文件  " + file.name + " 太大了，不超过10M。"
                });
            },
            //判断图片最多上传张数
            handleBeforeUpload() {
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: "最多可以上传5张图片。"
                    });
                }
                return check;
            },
            getUploadFile(uploader) {
                const obj = {url: JSON.parse(uploader.data.response).file_url, name: uploader.data.name}
                this.flieList.push(obj);
                this.saveShow();

            },
            clearAllData() {
                this.editData = {};
                this.principalName = '';
                this.referenceFileName = [];
                this.taskTypeInfo = [];
            },
            delImage({url}) {
                this.flieList = this.flieList.filter((item) => {
                    return item.url !== url
                });
                this.saveShow();

            }
        },
        components: {
            vUpload
        }
    };
</script>
<style lang="less">
    @bor: #f2f9f9;
    .taskDetailsContainer {
        padding: 0 20px;
        .head {
            display: flex;
            .headImg {
                width: 45px;
                height: 45px;
                border-radius: 50%;
            }
        }
        .uploadContainer {
            margin-top: 0;
            .btn {
                width: 100%;
                height: 120px;
                opacity: 0;
            }
            .shade {
                position: absolute;
                top: 0;
                width: 100%;
                height: 120px;
                line-height: 120px ;
                text-align: center;
                background: #fff;
                border: 1px dashed #ccc;

            }
            &:hover {
                .shade {

                    border: 1px dashed #3bceb6 !important;
                }
            }
        }
        .flieList {
            display: flex;
            padding: 0 5px;
            justify-content: space-between;
            align-items: center;
            .fileText{
                display: flex;
                align-items: center;
                p{
                    width: 300px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
            }
            &:hover {
                background: #ccc;
            }
        }
        .borBotm {
            padding-bottom: 14px;
            border-bottom: 1px solid @bor;
        }

        textarea.ivu-input {
            /*height: 30px !important;*/
            /*min-height: 30px !important;*/
        }
    }

    .taskdetail {
        display: inline-block;
        overflow: hidden;
    }

    .taskdetail-left {
        width: 400px;
        float: left;
        padding: 0 20px 0 0;
    }

    .taskdetail-right {
        width: 600px;
        float: left;
        padding: 0 0 0 20px;
    }
</style>
// {
//     "err_code": 0,
//     "err_message": "请求成功",
//     "id": "id",
//     "father": "父级id",
//     "name": "任务名字",
//     "status": "状态",
//     "status_text": "状态文本信息",
//     "progress": "当前进度",
//     "run_uid": "1执行人ID",
//     "create_uid": "2创建人ID",
//     "create_date": "创建时间 2018-03-19 11:01:13",
//     "update_date": " 更新时间 2018-03-19 11:01:13",
//     "tasktype_id": "任务类型ID",
//     "tasktype_name": "任务类型名称",
//     "stage": [
//         {
//             "stage_name": "阶段名称",
//             "is_client_audit": "是否需要审核"
//         }
//     ],
//     "stage_count": "阶段总数",
//     "status": "状态",
//     "progress": "进度",
//     "file_id": "关联文件ID",
//     "create_time": "创建时间时间戳",
//     "update_time": "更新时间时间戳",
//     "expect_start_time": "预计开始时间时间戳",
//     "expect_end_time": "预计结束时间时间戳",
//     "expect_work_day": "预计时间所需天数",
//     "project": "所属项目ID",
//     "project_child": "所属子项目ID",
//     "expect_start_date": "2018-03-19 11:01:13预计时间",
//     "expect_end_date": "2018-03-19 11:01:13结束时间",
//     "start_date": "2018-03-19 11:01:13开始时间",
//     "end_date": "2018-03-19 11:01:13结束时间",
//     "project_name": "项目名",
//     "project_child_name": "子项目名",
//     "description" : "描述",
//     "child": [
//         {
//             "id": "子任务ID",
//             "name": "子任务名称",
//             "progress": "进度",
//             "tasktype_id": "任务类型ID",
//             "stage": [
//                 {
//                     "stage_name": "阶段名字",
//                     "is_inside_audit": "是否需要内审",
//                     "tasktype_id": "任务类型ID"
//                 } ]
//         }
//     ],
//     "status_text": "状态文本化",
//     "file": [
//        "关联附件路径"
//     ],
//   "image": [
//        "关联图片路径"
//     ],
//     "relevance" : [
//           "关联任务ID",
//      ],
//     "log": [
//         {
//       "nickname": "当事人昵称",
//       "text": "日志描述",
//       "time": "日志时间（格式化后的日期格式）",
//       "action": "日志动作"
//       }
//     ]
// }
