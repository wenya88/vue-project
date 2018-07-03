<!-- 任务详情组件 -->
<template>
    <div>
        <Form :label-position="taskManagement?'top':'left'" :label-width="60" >
            <FormItem   label="任务名称">
                <Input   v-model="editData.name"  :disabled="editDisabled">
                <span v-if="taskManagement" slot="prepend"><Icon type="ios-person-outline"></Icon></span>
                </Input>
            </FormItem>
            <FormItem  label="负责人">
                <Select v-model="principalName"  placeholder="">
                    <Option v-for="item in principal" :value="item.member_id" :key="item.user_id">{{ item.remark_name }}</Option>
                </Select>
            </FormItem>
            <!--<FormItem  v-else label="负责人">-->
                <!--<Select v-model="principalName"  placeholder="">-->
                    <!--<Option v-for="item in principal" :value="item.id" :key="item.value">{{ item.remark_name }}</Option>-->
                <!--</Select>-->
            <!--</FormItem>-->
            <FormItem label="计划时间">
                <DatePicker
                :value="getTimeRange"
                @on-change="setTimeRange"
                format="yyyy-MM-dd"
                type="daterange"
                :options="startTime"
                split-panels

                :disabled="editDisabled"
                >
                </DatePicker>
            </FormItem>
            <FormItem label="子项目">
                <Select
                @on-change='setChildProject'
                v-model="editData.project_child"
                clearable
                :disabled="editDisabled"
                placeholder=""
                >
                    <Option
                        v-for="item in childProjectsList"
                        :key="item.child_id"
                        :value="item.id"
                        >
                        {{item.name}}
                    </Option>
                </Select>
            </FormItem>
            <FormItem v-if="taskManagement" label="任务类型">
                <section class="requirement">
                    <AutoComplete  v-model="editData.tasktype_name"
                                   @on-select="selectTaskType"
                                   :disabled="editDisabled"
                                   icon="android-color-palette"
                    >
                        <Option v-for="item in taskTypesList"
                                :key="item.tasktype_name"
                                :value="item.tasktype_name"
                        >
                            <span> {{item.tasktype_name}}</span>
                        </Option>
                    </AutoComplete>
                    <Card :bordered="true" style="text-align: center">
                        <div v-for="item in taskTypeInfo" :key="item.id">
                           <p>
                               <span>尺寸</span><span>{{item.require[0].value?item.require[0].value:'无'}}</span>
                           </p>
                            <p>
                                 <span>格式</span><span>{{item.file_format}}</span>
                            </p>
                        </div>
                    </Card>

                </section>
            </FormItem>
            <template v-else>
                <FormItem label="任务类型">
                    <AutoComplete  v-model="editData.tasktype_name"
                                   placeholder="选择任务类型"
                                   @on-select="selectTaskType"
                                   :disabled="editDisabled"
                    >
                        <Option v-for="item in taskTypesList"
                                :key="item.tasktype_name"
                                :value="item.tasktype_name"
                        >
                            <span> {{item.tasktype_name}}</span>
                        </Option>
                    </AutoComplete>
                </FormItem>
                <FormItem  label="文件要求">
                    <Card :bordered="true" style="text-align: center">
                        <p v-for="item in taskTypeInfo" :key="item.id">
                            {{item.file_format}}&#160&#160{{item.require[0].value}}
                        </p>
                    </Card>
                </FormItem>
            </template>
            <FormItem label="参考附件">
                <div>
                <Upload
                multiple
                type="drag"
                :show-upload-list="true"
                :on-success="referenceFileSuccess"
                :on-remove ="referenceFileRemove"
                :action="fileup"
                :default-file-list="referenceFileName"
                >
                <Icon type="ios-cloud-upload" size="32" style="color: #3399ff"></Icon>
                <p>点击或拖入上传</p>
                </Upload>
                </div>
                <!-- <div v-for="item in editData.file" :key="item.url">{{item.url}}</div> -->
            </FormItem>
            <FormItem label="要求说明">
                <Input
                v-model="editData.description"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
                :disabled="editDisabled"
                ></Input>
            </FormItem>
        </Form>
    </div>
</template>

<script>
var qs = require("querystring");
import {mapMutations} from 'vuex';
export default{
    props:{
        taskManagement:{
            type:String,
            default:''
        }
    },
    data() {
        return {
            projectId:sessionStorage.getItem('projectID'),
            //*任务属性*//
            taskID:0,
            editData:{},
            //*任务属性选项*//
            editDisabled:false,//能否编辑
            isNewTask:false,//是否为新任务
            principal: [],//负责人列表
            principalName: "",//搜索框负责人名字
            principalNum: 1,
            principalType: [],//供选择的负责人类型
            referenceFileList: [],//附件文件列表
            childProjectsList: [],//供选择的子项目列表
            taskTypesList:[],//供选择的任务类型
            taskTypeInfo:{},//任务类型信息
            referenceFileName: [],//附件文件名称
            referenceFileUrl:[],//附件文件地址
            dateRange:"",
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
        }
    },
    created(){
        this.getTaskTypeList();
    },
    computed:{
        getTimeRange(){
            return [this.editData.expect_start_date,this.editData.expect_end_date]
        },
        fileup(){
            return this.$store.state.paySkip.fileUpload
        },
    },
    methods:{

        //获取任务详情
        initTaskDetailFromID(id,fatherFunctions) {
            // console.log('详情',id,fatherFunctions)
            if(id!=0)
            {
                this.getChildProject()
                this.taskID = id;
                this.$axios.post(this.GLOBAL.baseRouter + 'task/task/info',qs.stringify({id: this.taskID}))
                .then( res => res.data)
                .then( res => {
                        this.initTaskDetailFromData(res);
                        this.getTaskTypeRequire(res.tasktype_id);
                        this.clickMenberDropdown();
                        this.callFatherFunction(fatherFunctions);
                        this.principalName = res.member_id;
                    }
                )
                .catch(error => {
                    console.log(error);

                    this.$Message.error("获取任务信息失败，请重试！");
                });
            }
        },
        //直接赋值任务属性-DONE
        initTaskDetailFromData(data)
        {
            this.editData = data;
            this.formatLocalData();
            this.haha();
        },
        //设置能否编辑-DONE
        setEditDisabled(forbidEdit)
        {
            this.editDisabled = forbidEdit;
        },
        //新增任务初始化-DONE
        initTaskDetailFromNew(projectInfo)
        {
            this.isNewTask = true;
            this.initProjectInfo(projectInfo);
            this.clickMenberDropdown();
            this.getChildProject()
        },
        //初始化项目相关信息-DONE
        initProjectInfo(projectInfo)
        {
            if(projectInfo){
                this.editData.project_id = projectInfo.id;
            }
//            this.childProjectsList = projectInfo.child;
        },
        //外部获得任务数据-DONE
        getTaskDetail()
        {
            return this.editData;
        },
        //获得任务类型要求-DONE
        getTaskTypeRequire(tasktype_id)
        {
            if(tasktype_id == 0 || tasktype_id == null)
                return false;
            this.$axios.post(this.GLOBAL.baseRouter + 'task/task-type/info',qs.stringify({id: tasktype_id}))
                .then( res => res.data)
                .then( res => {
                        this.taskTypeInfo=[];
                        this.taskTypeInfo = res.file;

                        // res.file.forEach((res)=>
                        // {
                        //     console.log(res);
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
        getTaskTypeList()
        {
            //console.log("===");
            this.$axios.post(this.GLOBAL.baseRouter + 'task/task-type/cate-list',qs.stringify({company_id: 1}))
                .then( res => res.data)
                .then( res => {
                    this.taskTypesList=[];
                    res.data.forEach((res)=>{
                        if(res.tasktype)
                        {
                            this.taskTypesList = [];
                            this.taskTypesList = res.tasktype;
                            // res.tasktype.forEach((res)=>{
                            //     console.log(res);
                            //     this.taskTypesList.push({
                            //         tasktype_name:res.tasktype_name,
                            //         cate_id:res.cate_id
                            //     });
                            // })
                        }

                    })
                    })
                .catch(error => {
                    //this.$Message.error("获取任务信息失败，请重试！");
                });
        },
        //格式化本地数据
        formatLocalData()
        {
            this.referenceFileName = [];
            if(this.editData.file)
            {
                this.editData.file.forEach(
                    (res)=>{
                        this.referenceFileName.push({
                            name:"",
                            url:res
                        });
                    }
                );
            }
            console.log('编辑',this.editData)
        },
        //用于父组件通信-DONE
        callFatherFunction(fatherfunctions)
        {
            if(this.editData.child)
                this.$emit('sendSubTaskList', this.editData);//这里子任务需要父任务的一些属性
            if(this.editData.log)
                this.$emit('sendLogData', this.editData.log);
            if(fatherfunctions)
            {
                fatherfunctions.forEach(
                    (res)=>{
                        this.$emit(res.functionName);
                    }
                );
            }
        },
        haha(){
            console.log('haha',this.editData)
        },
        //主任务保存编辑数据
        saveTaskDetails(link,id) {

            let dataForm = {};
                dataForm.id = this.editData.id;
                dataForm.father = this.editData.father ? this.editData.father : 0;
                dataForm.name = this.editData.name;
                dataForm.project = this.projectId;
//                dataForm.project = this.editData.project_id;
                dataForm.project_child = this.editData.project_child;
                dataForm.tasktype_id = this.editData.tasktype_id ? this.editData.tasktype_id: 0;
                dataForm.expect_start_time = this.editData.expect_start_date;
                dataForm.expect_end_time = this.editData.expect_end_date;
                dataForm.description = this.editData.description;
                dataForm.file = JSON.stringify(this.referenceFileUrl) ? JSON.stringify(this.referenceFileUrl): [];
                dataForm.run_member_id = this.principalName;
                dataForm.remark_name = this.principalName;
                if(id){
                    dataForm.father = id;
                }


            return this.isNewTask ?this.addTaskDetails(dataForm) : this.updateTaskDetail(dataForm,link);
        },
        //获得参与人ID
        getUserId(namesData)
        {
            if(this.principal.length > 0)
            {
                for(let i=0;i<this.principal.length;i++)
                {
                    if(namesData == this.principal[i].remark_name)
                     {
                         console.log(this.principal[i].id);

                        return this.principal[i].id;
                    }
                }
            }
            else
                return null;
        },
        //获得参与人ID
        getUserName(namesId)
        {


            if(this.principal.length > 0)
            {
                for(let i=0;i<this.principal.length;i++)
                {
                    if(namesId == this.principal[i].id)
                     {
                         console.log(this.principal[i].remark_name);

                        return this.principal[i].remark_name;
                    }
                }
            }
            else
                return "";
        },
        //新增任务
        addTaskDetails(dataForm)
        {
            this.$axios.post(this.GLOBAL.baseRouter + "/task/task/add", qs.stringify(dataForm))
                        .then(res => {
                            this.$bus.emit('refreshCurrentTaskList');
                        })
                        .catch(error => {
                            this.$Message.error("新建任务失败，请重试！");
                            return false;
                        });
            return true;
        },
        //更新任务
        updateTaskDetail(dataForm,link)
        {
            this.$axios.post(this.GLOBAL.baseRouter + "/task/task/update", qs.stringify(dataForm))
                        .then(res => {
                            this.$bus.emit('refreshCurrentTaskList');
                            if(link){
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
        delTaskDetail()
        {
            this.$axios.post(this.GLOBAL.baseRouter + "/task/task/delete", qs.stringify({id:this.editData.id}))
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
        initEditData()
        {
            this.editData={};
        },
        //开始时间
        setTimeRange(date,date_now) {
            this.editData.expect_start_date = date[0];
            this.editData.expect_end_date = date[1];
        },
        // 获得子项目
        getChildProject(){

            this.$axios.post(this.GLOBAL.baseRouter + "/task/project/child-list", qs.stringify({id:sessionStorage.getItem('projectID')}))
                .then(({data})=>{
                // console.log(33,data)
                this.childProjectsList = data.data
                })
        },
        //设置子项目
        setChildProject(pId) {

            this.editData.project_child = pId;

        },
        //选择任务类型自动改变类型要求-DONE
        selectTaskType(id_name)
        {

            if(id_name!=null)
            {
                this.taskTypesList.forEach(
                    (res)=>{
                        if(res.tasktype_name == id_name)
                        {
                            this.editData.tasktype_id = parseInt(res.id);
                            this.getTaskTypeRequire(res.id);
                        }
                    }
                );
            }
        },
        //----------参与人-------------//
        //点击参与人下拉
        clickMenberDropdown()
        {
            this.$axios.post(this.GLOBAL.baseRouter + 'task/company/joined-members',qs.stringify({project_id: this.projectId}))
                .then( res => res.data)
                .then( res => {
                    this.principal = res.data;
                    // console.log('负责人',res.data)
//                        this.principal=[];
//                        this.principalName="";
//                        this.principal = res.data;
//                        this.principalName = this.getUserName(this.editData.member_id)
                    // console.log(1.1,this.principalName);
                    //     console.log(1.2,this.principal);
                    }
                )
                .catch(error => {
                    // console.log(error);

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
        referenceFileSuccess(response, file ,fileList) {
            this.referenceFileUrl.push(response.file.url);
        },
        //移除附件
        referenceFileRemove(file,fileList)
        {
            for(let i = 0;i<this.referenceFileUrl.length;i++)
            {
                if(this.referenceFileUrl[i] == file.response.affix.url)
                {
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
        clearAllData(){
            this.editData = {};
            this.principalName = '';
            this.referenceFileName = [];
            this.taskTypeInfo = [];
        }
    }
};
</script>
<style>
.taskdetail{
  display:inline-block;
  overflow:hidden;
}
.taskdetail-left{
  width:400px;
  float:left;
  padding: 0 20px 0 0;
}
.taskdetail-right{
  width:600px;
  float:left;
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