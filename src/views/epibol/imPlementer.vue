<template>
    <div class="imPlementerContainer">
        <main-native>
            <div class="main-header-style iconfont"><span
                    class="main-header-title"><i></i>{{this.$route.meta.title}}</span></div>
        </main-native>
        <div class="page_week_all">
            <!-- 左侧 -->
            <div class="left_tips">
                <img class='left_img_first' src='../../images/right.png'/>
                <img class='left_img_last' src='../../images/right.png'/>
            </div>
            <!-- 右侧 -->
            <div class="right_tips">
                <img class='right_img_first' src='../../images/left.png'/>
                <img class='right_img_last' src='../../images/left.png'/>
            </div>
            <p class="myTaskAll"><span class="iconfont icon-ymy-ren-copy"></span>我的任务</p>
            <!-- 未读任务end -->
            <div class="tiemSolt" :style="`height: ${boxHight}`" @mousedown="down">
                <div :style="`width: ${widthAll}`" class="clearfix timeSoltFather">
                    <!-- 时间 -->
                    <div v-for="(item, indexed) in dateList" :style="`width: ${widths}`" class="times_box"
                         :key="indexed">
                        <span v-show='item.weeks'>{{item.weeks}}</span>
                        <span>{{item.dateStr}}</span>
                    </div>
                    <!-- 时间结束 -->
                    <div class="task_ka" :style="`height:${boxHg}`">
                        <div :class="`task_top_box ${elems.taskBack}`" v-for="(elems, indexed) in tastList"
                             :key="indexed"
                             :style="`width:${elems.centWidth}; left:${elems.clienLeft}; top:${elems.top}`">
                            <div class="task_describe">
                                <div class="clearfix task_describe_title">
                                    <p class="state-introd" :style="`background:${elems.leftTopColor}`">
                                        {{elems.isComplete}}</p>
                                    <div class="task_describe_father">

                                        <span class='task_describe-sign iconfont icon-bofang' @click='getAgin(elems)'
                                              v-if='elems.is_test == 0 && elems.status == 1'></span>


                                        <span class="task_describe_msg" @click="goTask(elems)">{{elems.name}}</span>

                                        <span v-if="elems.is_test == 1" class="IsTestTaskType">测试</span>
                                    </div>
                                </div>
                            </div>

                            <div v-if="elems.is_test == 0" class="upload_preview_box" v-show="elems.status !== '1'" @click="getUpload(elems)">
                                <p class="iconfont icon-ymy-upload-copy"></p>
                            </div>
                            <div v-if="elems.is_test == 1" class="upload_preview_box" v-show="elems.status !== '2'" @click="getUpload(elems)">
                                <p class="iconfont icon-ymy-upload-copy"></p>
                            </div>
                        </div>
                    </div>
                    <!-- 审核任务box -->
                </div>
            </div>
            <!-- 审核任务未读 -->
            <!-- 审核任务 -->
            <p class="myTaskAll"><span class="iconfont icon-ymy-wenjian-copy"></span>任务反馈</p>
            <div class="task_feedback" @mousedown="getdown">
                <div class="task_feedback_box" :style="`width:${allListWidth}`">
                    <div class="clearfix task_feedback_msg" v-for="(item, index) in examinList" :key="index">
                        <div class="feedback_iamge_father" :style="{backgroundImage:'url('+item.thumb+')'}">
                            <!--<img :src="item.thumb+'?x-oss-process=image/resize,l_1000'" class="task_feedback_image"/>-->
                        </div>
                        <div class="task_feedback_details">
                            <div class="clearfix feedback_words_box">
                                <div class="feedback_words">
                                    <p class="feedback_words_task" @click="goTask(item)">{{item.name}} <span v-if="item.is_test == 1" class="IsTestTaskType">测试</span></p>
                                    <p class="feedback_words_project">{{item.project_name}}</p>
                                </div>
                                <!--<p class="feedback_explain">内部评审3天</p>-->
                            </div>
                            <!-- 进度条 -->
                            <div v-if="item.is_test == 0">
                                <div class="feedback_task_progress" v-if="item.is_client_audit==1 && item.is_inside_audit==1">
                                    <div :class="`progress_feedback_style ${item.firstStage}`"></div>
                                    <div :class="`progress_feedback_style ${item.secondStage}`"></div>
                                    <div :class="`progress_feedback_style ${item.thirdStage}`"></div>
                                </div>
                                <div class="feedback_task_progress" v-else-if="item.is_client_audit==1 && item.is_inside_audit==0">
                                    <div :class="`progress_feedback_style ${item.firstStage}`" style="flex: 1"></div>
                                    <div :class="`progress_feedback_style ${item.thirdStage}`"></div>
                                </div>
                                <div class="feedback_task_progress" v-else-if="item.is_client_audit==0 && item.is_inside_audit==1">
                                    <div :class="`progress_feedback_style ${item.firstStage}`" style="flex: 1"></div>
                                    <div :class="`progress_feedback_style ${item.secondStage}`"></div>
                                </div>

                                <div class="feedback_stage" v-if="item.is_client_audit==1 && item.is_inside_audit==1">
                                    <p>上传文件</p>
                                    <p>内部审核</p>
                                    <p>客户审核</p>
                                </div>
                                <div class="feedback_stage"  v-else-if="item.is_client_audit==1 && item.is_inside_audit==0">
                                    <p>上传文件</p>
                                    <p>客户审核</p>
                                </div>
                                <div class="feedback_stage"  v-else-if="item.is_client_audit==0 && item.is_inside_audit==1">
                                    <p>上传文件</p>
                                    <p>内部审核</p>
                                </div>

                                <div class="feedback_stage_state">
                                    <p v-if="item.create_time">{{item.create_time_title}}</p>
                                    <p v-if="item.inside_audit_time">{{item.inside_audit_title}}</p>
                                    <p v-if="item.client_audit_time">{{item.client_audit_title}}</p>
                                </div>
                            </div>
                            <!--测试任务进度条-->
                            <div v-if="item.is_test == 1">
                                <div class="feedback_task_progress">
                                    <div class="progress_feedback_style" :class="{'isStage':item.upload_time!=null ? true : false}" style="flex: 1"></div>
                                    <div class="progress_feedback_style" :class="{'isStage':item.status == 2 ? true : false}"></div>
                                </div>
                                <div class="feedback_stage">
                                    <p>上传文件</p>
                                    <p>内部审核</p>
                                </div>
                                <div class="feedback_stage_state">
                                    <p>{{item.uploadTime}}</p>
                                    <p>{{item.insideAuditTime}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <!-- 上传界面 -->
            <div class="upload_outer" v-if="isclose1">
                <div class="upload_page">
                    <p class="upload_page_close" @click="getclose">x</p>
                    <div class="upload_page_header">
                        <!-- <span class="upload_header_ce">测试</span> -->
                        <span class="upload_header_title">{{task_name}}</span>
                        <span class="upload_header_ce" v-if="is_tesk == 1">测试</span>
                    </div>
                    <div class="upload_page_main">
                        <p class="Choice_page_title">选择上传阶段</p>
                        <ul class="choice_page_ul">
                            <li v-for="(items,indexs) in stageList" @click="getClick(items,indexs)" :key="indexs">
                                <span :class="`iconfont icon-ymy-right-copy ${items.Instructions}`"
                                      v-if="indexs"></span>
                                <div :class="items.elementClass">
                                    <p>{{items.stage_name}}</p>
                                    <span class="iconfont icon-ymy-xuanzhong-copy upload_gou"
                                          v-if="items.iconShow"></span>
                                    <span class="upload_jiao" v-if="indexs == stageList.length-1">交稿阶段</span>
                                </div>
                            </li>
                        </ul>
                        <p class="Choice_page_title">交稿规范</p>
                        <div class="Choice_page_box">
                            <!-- <GeminiScrollbar class="crollbar"> -->
                            <p class="clearfix choice_title_Stand" v-for="(itd, indexs) in standardList" :key="indexs">
                                <span>{{itd.name}}</span>
                                <span>{{itd.values}}</span>
                            </p>
                            <!-- </GeminiScrollbar> -->
                        </div>
                        <!-- 上传文件 -->
                        <div class="upload_box">
                            <upload-box v-show="!isImgShow" :ids="ids" v-on:getOSS="getOSSdataFun">
                                <template slot='upload'>
                                    <div id="browse" class="browse"></div>
                                    <div class="title_all">
                                        <p class='iconfont icon-ymy-upload-copy font_class'></p>
                                        <p class="prompt_title">点击上传任务文件</p>
                                        <p class="prompt_title_last">支持jpg、gf、png</p>
                                    </div>
                                </template>
                            </upload-box>
                            <div class='all_upload_page' v-show="isImgShow">
                                <Row v-if="nameList.length != filenum">
                                    <Col class="demo-spin-col" span="24">
                                    <Spin size="large"></Spin>
                                    </Col>
                                </Row>
                                <!-- <GeminiScrollbar class="crollbar" v-else> -->
                                <div v-else>
                                    <div class="again_upload_father">
                                        <!-- <p class="again_upload_title">上传文件</p> -->
                                        <p class="again_upload" @click="againFun">重新上传</p>
                                    </div>
                                    <div class="yu_lan" id="yu_lan">
                                        <img :src="feilsUrl" v-show="filesStatus==1"/>
                                        <video :src="feilsUrl" width="100%" height="300px;" controls="controls"
                                               v-show="filesStatus==2">
                                            your browser does not support the video tag
                                        </video>

                                        <!--<three-module ></three-module>-->
                                        <keep-alive>
                                            <three-module :memberUpload="'upload'" :height="340" v-if="filesStatus==3"></three-module>
                                        </keep-alive>
                                    </div>
                                    <div class="yulan_span">
                                        <div :class="`yulanBacks ${element.backClass}`"
                                             v-for="(element, indexs) in nameList" :key="indexs">
                                            <div class="yulan_bx" @click="getYus(indexs)">
                                                <p class="yulan_sanjiao"></p>
                                                <p class="yulan_zhujian">设为主文件</p>
                                            </div>
                                            <p class="xe_title" @click="getYu(indexs)">
                                                <span class="precond" v-show="element.is_precond">预</span><span>{{element.name}}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <!-- </GeminiScrollbar> -->
                            </div>
                        </div>

                        <p class="sure_title" @click="uploadImg">{{uploadStatusText}}</p>
                    </div>
                </div>
            </div>
            <!-- 上传界面end -->

            <!--测试任务上传界面-->
            <div class="upload_outer" v-if="isclose2">
                <div class="upload_page2">
                    <p class="upload_page_close" @click="getclose">x</p>
                    <div class="upload_page_header">
                        <span class="upload_header_title">{{TestTaskInfos.test_name}}</span>
                        <span class="testTask">测试</span>
                    </div>
                    <div class="upload_page_main">
                        <div class="testTaskDiv">
                            <div class="testTaskLeft">
                                <span class="tipsText">测试任务要求</span>
                                <dl>
                                    <dt> 交稿要求</dt>
                                    <dd>
                                        <span>{{TestTaskInfos.file_require}}</span>
                                    </dd>
                                    <dt>参考附件</dt>
                                    <dd>
                                        <p class="uploadFileSty" v-for="item in TestTaskInfos.file">{{item.name |substring}}
                                            <a :href="JSON.parse(item.response).file_url" :download="item.name" target="_blank"><i class="icon iconfont icon-xiazai"></i></a>
                                        </p>
                                    </dd>
                                    <dt>其它说明</dt>
                                    <dd>
                                        <span>{{TestTaskInfos.description}}</span>
                                    </dd>
                                </dl>
                            </div>
                            <div class="testTaskright">
                                <p class="tipsText">
                                    <span>上传文件</span>
                                    <button @click="againFun">重新上传</button>
                                </p>
                                <div class="contenerFile">
                                    <Spin v-if="uploadPopFlag" size="large" class="spinPop"></Spin>
                                    <div class="upload_box">
                                        <upload-box v-show="!isImgShow" id="browse2" v-on:FileUploadedSuccess="FileUploadedSuccess" v-on:getOSS="getOSSdataFun">
                                            <template slot='upload'>
                                                <div id="browse2" class="browse"></div>
                                                <div class="title_all">
                                                    <p class='iconfont icon-ymy-upload-copy font_class'></p>
                                                    <p class="prompt_title">点击上传任务文件</p>
                                                    <p class="prompt_title_last">支持jpg、gf、png</p>
                                                </div>
                                            </template>
                                        </upload-box>
                                        <div class='all_upload_page' v-show="isImgShow">
                                            <Row v-if="nameList.length != filenum">
                                                <Col class="demo-spin-col" span="24">
                                                <Spin size="large"></Spin>
                                                </Col>
                                            </Row>
                                            <!-- <GeminiScrollbar class="crollbar" v-else> -->
                                            <div v-else>
                                                <div class="yu_lan" id="TestTaskHtml">
                                                    <img :src="feilsUrl" v-show="filesStatus==1"/>
                                                    <video :src="feilsUrl" width="100%" height="300px;" controls="controls"
                                                           v-show="filesStatus==2">
                                                        your browser does not support the video tag
                                                    </video>

                                                    <!--<three-module ></three-module>-->
                                                    <keep-alive>
                                                        <three-module :memberUpload="'upload'" :height="340" v-if="filesStatus==3"></three-module>
                                                    </keep-alive>
                                                </div>

                                                <div class="yulan_span">
                                                    <div :class="`yulanBacks ${element.backClass}`"
                                                         v-for="(element, indexs) in nameList" :key="indexs">
                                                        <div class="yulan_bx" @click="getYus(indexs)">
                                                            <p class="yulan_sanjiao"></p>
                                                            <p class="yulan_zhujian">设为主文件</p>
                                                        </div>
                                                        <p class="xe_title" @click="getYu(indexs)">
                                                            <span class="precond" v-show="element.is_precond">预</span><span>{{element.name}}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- </GeminiScrollbar> -->
                                        </div>
                                    </div>
                                </div>
                                <!--<div class="buttons">-->
                                    <!--<button v-for="(element, indexs) in nameList" >{{element.name}}</button>-->
                                <!--</div>-->
                                <p class="tipsUpload">请选择默认预览文件，方便审核人员快速反馈</p>
                                <div class="actionBtn">
                                    <button class="caell" @click="getclose">取消</button>
                                    <button class="ok" @click="uploadTestTask">{{uploadStatusText}}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--测试任务上传界面end-->
            <div class="is_angin" v-if="isAngin">
                <p>是否开始任务</p>
                <div class="is_angin_box">
                    <p @click="sureAngin">是</p>
                    <p @click="noAngin">否</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapMutations, mapState} from 'vuex'
    var qs = require('querystring')
    import uploadBox from '../../components/upload.vue'
    import threeModule from '../project/components/threeModule.vue'
    import mainNative from '../main-components/mainNative.vue';
    import api from 'api';
    // import {mapState} from 'vuex'
    export default {
        data() {
            return {
                ids:{               //用于图片命名防止名称冲突
                    taskId:null,
                    projectId:null,
                    stageId:null,
                },
                dateList: [],
                partObj: {},
                widths: '',
                widthAll: '',
                isImgShow: false,
                left: 0,
                taskleft: 0,
                momentTime: 0,
                isclose1: false,
                isclose2: false,
                isAngin: false,
                tastList: [],
                examinList: [],
                solt: {},
                nameList: [],
                index: 0,
                boxHg: '',
                allListWidth: '',
                task_name: '',
                isToday: true,
                boxHgs: '',
                boxHight: '',
                is_tesk: '0',
                beforeData: {},
                afterData: {},
                listAll: {},
                nameLists: [],
                feilsList: [],
                standardList: [],
                filesStatus: 0,
                feilsUrl: '',
                task_id: '',
                stageList: [],
                startTime: '2018-6-20',
                endTime: '2018-8-10',
                OSSdata:{},
                uploadPopFlag:false,
                uploadStatusText:'完成上传',
                testTaskList:[],
                TestTaskInfos:{}
            }
        },
        components: {
            uploadBox,
            threeModule,
            mainNative
        },
        mounted() {
            this.getTestTaskList();
            // this.getShowTime()
            this.getScreenWidth();
            // this.getMsgList()
            this.getMsgLists();

        },
        computed: {
            ...mapState({
                filenum(data) {
                    return data.app.filenum
                }
            }),
            uploadList() {
                return this.$store.state.app.uploadFile
            }
        },
        watch: {
            uploadList(data) {
                this.getList(data)
            }
        },
        methods: {
            ...mapMutations(['setDetailAll', 'setUserStatus', 'changeComponentFileURl']),

            //跳转业务详情
            goTask(data) {
                if(data.is_test==0){
                    const item = {id: data.id}
                    this.setDetailAll(item)
                    this.$router.push('/project/details')
                }else {
                    this.$router.push({name:'ManageDetails',params:{id:data.id,type:'new'}});
                }
                this.setUserStatus('member')
            },
            // 确定开始
            sureAngin() {
                const url = this.GLOBAL.baseRouter + "/task/task/start"
                const items = {
                    id: this.task_id
                }
                this.$axios.post(url, qs.stringify(items)).then(data => {
                    if (data.data.err_code == 0) {
                        this.isAngin = false
                        this.getOriginal()
                        this.getMsgLists()
                        this.$Message.success(data.data.err_message)
                    } else {
                        this.$Message.error(data.data.err_message)
                    }
                })
            },
            // 取消开始
            noAngin() {
                this.isAngin = false
            },
            // 是否开始
            getAgin(data) {
                this.task_id = data.id
                this.isAngin = true
            },
            // 重新上传
            againFun() {
                this.nameLists = []
                this.feilsUrl = ''
                this.filesStatus = 0
                this.feilsList = []
                this.isImgShow = false
            },
            // 预览
            getYus(index) {
                const list = this.feilsList
                const nameListed = this.nameLists
                list.forEach((items, idx) => {
                    if (index === idx) {
                        items.is_main = 1
                    } else {
                        items.is_main = 0
                    }
                })
                const newList = nameListed.map((items, idx) => {
                    if (idx == index) {
                        items.is_precond = true
                    } else {
                        items.is_precond = false
                    }
                    return items
                })
                // this.feilsList = list
                // this.nameLists = nameLists
                this.nameList = newList
                this.$set(this, 'nameLists', nameListed)
            },
            // 预览
            getYu(index) {
                const list = this.feilsList
                const nameLists = this.nameLists
                if (nameLists.length) {
                    const name = nameLists[index].name
                    const newList = nameLists.map((items, idx) => {
                        if (idx == index) {
                            items.backClass = 'yulanBack'
                        } else {
                            items.backClass = ''
                        }
                        return items
                    })
                    const names = name.split('.')[1].toLowerCase()
                    let filesStatus = 0
                    if (names == 'jpg' || names == 'png') {
                        filesStatus = 1
                    } else if (names == 'mp4' || names == 'avi' || names == 'mpg' || names == 'rmvb') {
                        filesStatus = 2
                    } else if (names == 'fbx') {
                        filesStatus = 3
                        this.changeComponentFileURl(JSON.parse(list[index].response).file_url)
                        // this.changeComponentFileURl('https://yhc-1.oss-cn-shanghai.aliyuncs.com/file-upload/2018/08/28/M_atk.FBX')
                        //   https://yhc-1.oss-cn-shanghai.aliyuncs.com/file-upload/2018/08/16/M_idle.FBX
                        // const taskId = this.task_id
                    }
                    this.filesStatus = filesStatus
                    this.$set(this, 'nameLists', nameLists)
                    this.nameList = newList
                    this.feilsUrl = JSON.parse(list[index].response).file_url
                }
            },
            // 获取队列
            getList(list) {
                const nameLists = []
                list.forEach(item => {
                    const nameObj = {
                        name: item.name
                    }
                    nameLists.push(nameObj)
                })
                this.isImgShow = true
                this.nameLists = nameLists
                this.feilsList = list
                this.getYu(0)
                this.getYus(0)
            },
            // 上传
            getUpload(data) {
                this.task_id = data.id
                this.is_tesk = data.is_test
                this.task_name = data.name

                if(data.is_test==0){  //普通任务
                    this.isclose1 = true;
                    this.getStageList();
                }else {     //测试任务
                    this.isclose2 = true;
                    this.getTestTask(data.id)
                }
                this.againFun()
            },
            //获取测试任务详情'33'
            async getTestTask(id){
                const TestTaskInfo = await api.getTestTaskInfo(id);
                if(TestTaskInfo.data.err_code==0){
                    this.TestTaskInfos = TestTaskInfo.data;
                    this.isclose2 = true;
                }
            },
            //FileUploadedSuccess
            FileUploadedSuccess(data){
                this.uploadCallbackData = this.uploadList
            },
            //上传测试任务
             uploadTestTask(){
                this.uploadPopFlag = true;
                 this.uploadStatusText = '上传中...';
                this.getHtml2canvas('TestTaskHtml').then((mainThumbUrl)=>{
                    let uploadCallbackData = this.uploadCallbackData;
                    var fileArr = [];
                    for(let i=0;i<uploadCallbackData.length;i++){
                        let res = JSON.parse(uploadCallbackData[i].response);
                        let item = {
                            file:res.file_url,
                            is_main:uploadCallbackData[i].is_main,
                            thumb:mainThumbUrl,
                            type:res.fileType,
                            fid:res.fid
                        }
                        fileArr.push(item);
                    }
                    let obj = {
                        bid_id:parseInt(this.task_id),
                        file:JSON.stringify(fileArr)
                    }
                    let getUploadData = async()=>{
                        const uploadTest = await api.uploadTestHttp(obj);
                        if(uploadTest.data.err_code == 0){
                            this.uploadStatusText = '完成上传';
                            this.uploadPopFlag = false;
                            this.isclose2 = false;
                            this.$Message.success(uploadTest.data.err_message);
                            //刷新任务
                            this.getTestTaskList();
                            this.getScreenWidth();
                            this.getMsgLists();
                        }else {
                            this.uploadPopFlag = false;
                            this.uploadStatusText = '完成上传';
                            this.isclose2 = false;
                            this.$Message.error('上传失败');
                        }
                    }
                    getUploadData();
                })
            },
            // 点击关闭
            getclose() {
                this.isclose1 = false
                this.isclose2 = false
            },
            // 点击事件
            getClick(item,index) {
                let that = this
                this.stage = index + 1
                const list = this.stageList
                const obj = list.map((item, idx) => {
                    if (index == idx) {
                        item.elementClass = 'choice_page_active'
                        item.iconShow = true
                        item.Instructions = 'Instruc'
                    } else {
                        item.elementClass = ''
                        item.iconShow = false
                        item.Instructions = ''
                    }
                    return item
                })
                // this.$set(this, 'stageList', list)
                this.stageList = obj
                this.ids.stageId = item.id
            },
            //获取测试任务数据
            getTestTaskList(){
              const url =  this.GLOBAL.baseRouter + "task/test/test-shaft";
                this.$axios.post(url).then(data => {
                    if(data.data.err_code == 0){
                        let temp = {};
                        let array = data.data.data;
                        //测试任务数据组装 为了和普通任务字段完整性一致  免除后面不必要的问题
                        for(let i=0;i<array.length;i++){
                            array[i].is_test = 1;
                            array[i].startDate = this.timeFun(array[i].add_time);
                            array[i].endDate = this.timeFun(array[i].end_time);
                            array[i].name = array[i].test_name;
                            array[i].run_uid = null,
                            array[i].tasktype_id = array[i].test_id,
                            array[i].update_time = 0,
                            array[i].expect_start_time = array[i].add_time,
                            array[i].expect_end_time = array[i].end_time,
                            array[i].start_time = array[i].add_time,
                            array[i].end_time = array[i].end_time,
                            array[i].project = array[i].test_id,
                            array[i].image = '',
                            array[i].status_text = '',
                            array[i].stage={},
                            array[i].project_name=array[i].test_name;
                        }
                        // console.log(array)

                        var filterObj = {};
                        var tempIndex = [];
                        for(let j=0;j<array.length;j++){
                            if(temp[array[j].startDate]){
                                tempIndex.push(j);
                                filterObj[array[j].startDate] = tempIndex
                            }else {
                                temp[array[j].startDate] = [array[j]];
                            }
                        }

                        // var aa = [{name:111},{name:222},{name:333},{name:444},{name:555},{name:666},{name:777}];
                        // var ss = {'2018-9-5':[5,2],'2018-9-6':[4,3]}
                        for(var i in filterObj){
                            filterObj[i].map(function (item,index,arr) {
                                 temp[i].push(array[item])
                             })
                        }
                        this.testTaskList = temp;
                        // console.log(temp);
                        // console.log(JSON.stringify(temp));
                    }
                })
            },
            //转换时间
            timeFun(time){
                var unixTimestamp = new Date(time*1000);
                var year = unixTimestamp.getFullYear();
                var month = unixTimestamp.getMonth() + 1;
                month = month < 10 ? ('0' + month) : month
                var date = unixTimestamp.getDate()
                date = date < 10 ? ('0' + date) : date
                return year+'-'+month+'-'+date;
            },
            // 获取数据
            getMsgList() {
                return new Promise((resove, reject) => {
                    for (let i = 1; i < 8; i++) {
                        const indexs = i * 8
                        this.getBefore(indexs).then(msg => {
                            this.getAfter(indexs).then(msage => {
                                if (msage == 7) {
                                    resove()
                                }
                            })
                        })
                    }
                })
            },
            getMsgLists() {
                this.getMsgList().then(() => {
                    this.getAll()
                })
            },
            // 获取前面的数据
            getBefore(number) {
                return new Promise((resove, reject) => {
                    const url = this.GLOBAL.baseRouter + "/task/task/shaft"
                    const items = {
                        xdays: number
                    }
                    this.$axios.post(url, qs.stringify(items)).then(data => {
                        const list = data.data.data.dates
                        const beforeData = this.beforeData
                        let lists = Object.assign(beforeData, list);
                        this.beforeData = lists
                        resove(number / 8)
                    })
                })
            },
            // 获取后面的数据
            getAfter(number) {
                return new Promise((resove, reject) => {
                    const url = this.GLOBAL.baseRouter + "/task/task/shaft"
                    const items = {
                        xdays: -number
                    }
                    this.$axios.post(url, qs.stringify(items)).then(data => {
                        const list = data.data.data.dates
                        const afterData = this.afterData
                        let lists = Object.assign(list, afterData);
                        this.afterData = lists
                        resove(number / 8)
                    })
                })
            },
            // 获取任务时间数据
            getAll() {
                const url = this.GLOBAL.baseRouter + "/task/task/shaft"
                const beforeLists = this.beforeData
                const afterLists = this.afterData
                const testTaskList = this.testTaskList
                const items = {}
                this.$axios.post(url, qs.stringify(items)).then(data => {
                    const nowList = data.data.data.dates
                    this.momentTime = data.data.current_time
                    let list = Object.assign(afterLists, nowList,testTaskList,beforeLists);
                    this.getView(list)
                }, error => {
                    console.log('错误', error)
                })
            },
            // 获取视图
            getView(list) {
                let lists = []
                let tastList = []
                for (let i in list) {
                    lists.push(i)
                    tastList = tastList.concat(list[i])
                }

                let objList = []
                tastList.forEach((items, i) => {
                    let flag = true
                    objList.forEach((elems, j) => {
                        if (items.id == elems.id) {
                            flag = false
                        }
                    })
                    if (flag) {
                        if(items.is_test==0){
                            if (items.status == 1) {
                                items.isComplete = '待开始'
                                items.leftTopColor = '#7cbefc'
                                items.taskBack = 'task-wait'
                            } else if (items.status == 2) {
                                items.isComplete = '进行中'
                                items.leftTopColor = '#3bceb6'
                                items.taskBack = 'task-doing'
                            } else if (items.status == 3) {
                                items.isComplete = '暂停'
                                items.leftTopColor = '#bdbdbd'
                                items.taskBack = 'task-pause'
                            } else {
                                items.isComplete = '已完成'
                                items.leftTopColor = '#fcc44a'
                                items.taskBack = 'task-complete'
                            }
                        }else if(items.is_test==1){
                            if (items.status == 1) {
                                items.isComplete = '待审核'
                                items.leftTopColor = '#3bceb6'
                                items.taskBack = 'task-doing'
                            }else if(items.status == 2){
                                items.isComplete = '已通过'
                                items.leftTopColor = '#fcc44a'
                                items.taskBack = 'task-complete'
                            }else if(items.status == 3){
                                items.isComplete = '已反馈'
                                items.leftTopColor = '#3bceb6'
                                items.taskBack = 'task-doing'
                            }else {
                                items.isComplete = '进行中'
                                items.leftTopColor = '#3bceb6'
                                items.taskBack = 'task-doing'
                            }
                        }

                        objList.push(items);
                    }
                })
                const index = lists.length - 1
                this.startTime = lists[0]
                this.endTime = lists[index]
                this.tastList = objList
                this.getTimeSlot()
                this.getTast()
                this.getFeedback(list);
            },
            // 获取任务
            getTast() {
                let list = this.tastList
                let startTimes = this.startTime
                let endTimes = this.endTime
                const todays = this.getTimes(Date.now()).times
                const clentWidth = Number(this.widths.split('px')[0])
                const startCode = new Date(startTimes.replace(/-/g, '/')).getTime()
                const endCode = new Date(endTimes.replace(/-/g, '/')).getTime()
                const dateList = this.dateList
                let startTime = ''
                let endTime = ''
                let starts = ''
                let diffDaye = 0
                let index = 0
                list.forEach((items, itInd) => {
                    if (items.end_time != 0) {
                        endTime = items.end_time
                    } else {
                        endTime = items.expect_end_time
                    }
                    if (items.start_time != 0) {
                        startTime = items.start_time
                    } else {
                        startTime = items.expect_start_time
                    }
                    const expectEnd = Number(items.expect_end_time) * 1000
                    const expectStart = Number(items.expect_start_time) * 1000
                    items.startDay = this.getTimes(expectStart).title
                    items.endDay = this.getTimes(expectEnd).title
                    if (Number(items.end_time) - Number(items.expect_end_time) < 0) {
                        const delay = todays - expectEnd
                        if (delay > 0 && !Number(items.end_time)) {
                            items.isDelay = true
                        } else {
                            items.isDelay = false
                        }
                    } else {
                        items.isDelay = true
                    }
                    const startNow = this.getTimes(Number(startTime) * 1000).times // 后台获取的时间戳是10位，
                    const endNow = this.getTimes(Number(endTime) * 1000).times
                    const diffenc = startCode - startNow
                    const diffencEnd = endCode - endNow
                    let diffStart = 0
                    let diffEnd = 0
                    if (diffenc > 0) {
                        diffStart = startCode
                    } else {
                        diffStart = startNow
                    }
                    if (diffencEnd > 0) {
                        diffEnd = endNow
                    } else {
                        diffEnd = endCode
                    }
                    diffDaye = (diffEnd - diffStart) / (24 * 60 * 60 * 1000) + 1
                    const diffDayes = (this.getTimes(expectEnd).times - this.getTimes(expectStart).times) / (24 * 60 * 60 * 1000) + 1
                    starts = this.getTime(diffStart, 0).dateStr
                    if (diffDaye <= 0) { // 不在时间线内的删除
                        list.splice(itInd, 1)
                    }
                    dateList.forEach((elems, inds) => {
                        if (elems.dateStr == starts) {
                            index = inds
                        }
                    })
                    const centWidth = clentWidth * diffDaye - 20
                    const clienLeft = index * clentWidth + 10
                    const startIndex = index
                    items.startIndex = startIndex // 任务开始的数据
                    items.endIndex = startIndex + diffDaye - 1 // 最后结束位置
                    items.centWidth = centWidth + 'px'
                    items.clienLeft = clienLeft + 'px'
                    items.workDay = diffDayes
                    items.ends = diffEnd
                    items.starts = diffStart
                })
                this.getTop()
                this.getBackground()
            },
            // 获取今天的日期
            getToDay() {
                const dateList = this.dateList
                const width = this.widths.split('px')[0]
                const todays = Date.now()
                const element = document.getElementsByClassName('timeSoltFather')[0]
                const todayStr = this.getTime(todays, 0).dateStr
                const widthAll = this.widthAll
                dateList.forEach((items, index) => {
                    if (todayStr == items.dateStr) {
                        items.weeks = '今天'
                        const lefts = -((index - 1) * width - 1)
                        const moves = lefts + 'px'
                        this.left = lefts
                        element.setAttribute('style', `width: ${widthAll}; left: ${moves}`)
                    }
                })
            },
            // 获取task排序位子
            getTop() {
                const list = this.tastList
                const listLt = list.length
                let solt = this.solt
                let index = this.index
                if (Object.keys(solt).length == 0) {
                    solt[index] = []
                    if (!listLt) {
                        solt[index].push(
                            {
                                startIndex: 0,
                                endIndex: 0
                            }
                        )
                    } else {
                        solt[index].push(list[0])
                    }
                    // list[0].top = 0 + 'px'
                    this.solt = solt
                } else {
                    index++
                    let items = list[index]
                    let ends = items.ends
                    let starts = items.starts
                    let object = [] // 计算层级
                    let isPing = false // 是否匹配
                    let isPush = false // 循环层级
                    let isXun = false // 是否循环
                    for (let i in solt) {
                        object.push(i)
                    }
                    object.forEach(element => { // 循环层级
                        const ok = solt[element]
                        if (!isXun) {
                            ok.forEach(elems => {
                                const soltEnds = Number(elems.ends)
                                const soltStarts = Number(elems.starts)
                                const endsCode = ends - soltStarts
                                const startsCode = soltEnds - starts
                                if (endsCode >= 0 && startsCode >= 0) {
                                    isPush = true
                                }
                            })
                            if (!isPush) {
                                solt[element].push(items)
                                items.top = element * 80 + 'px'
                                isPing = true
                                isPush = true
                                isXun = true
                                this.solt = solt
                            } else {
                                isPush = false
                                // isPing = false
                            }
                        }
                    })
                    if (!isPing) {
                        const objLt = object.length - 1
                        const num = Number(object[objLt]) + 1
                        solt[num] = []
                        solt[num].push(items)
                        items.top = num * 80 + 'px'
                        this.solt = solt
                    }
                    this.index = index
                }
                if (index < listLt - 1) { // 执行次数，因为本身执行一次，所以减一
                    this.getTop()
                }
                if (index == listLt - 2) {
                    this.tastList = list
                    this.getHieght()
                }
            },
            // 获取背景
            getBackground() {
                const list = this.solt
                const object = []
                for (let i in list) {
                    object.push(i)
                }
                // 最低6层测试
                let num = 0
                if (object.length < 6) {
                    num = 6
                    const objLt = object.length
                    const differ = 6 - objLt
                    const soltNum = Number(object[objLt - 1])
                    for (let i = 0; i < differ; i++) {
                        const nums = i + soltNum + 1
                        list[nums] = [
                            {
                                startIndex: 0,
                                endIndex: 0
                            }
                        ]
                    }
                } else {
                    num = object.length
                }
                // 测试结束
                const numbers = this.dateList.length
                const widths = this.widths
                let element = document.getElementsByClassName('timeSoltFather')[0]
                let div = document.createElement('div')
                div.setAttribute('id', 'lattice')
                let htmlDate = ''
                for (let i = 0; i < num; i++) {
                    let HierList = list[i]
                    let childrenString = '' // 多少子元素
                    for (let k = 0; k < numbers; k++) {
                        let index = 0
                        let isremove = false
                        for (let y = 0; y < HierList.length; y++) {
                            index++
                            const hierLength = HierList.length
                            const start = HierList[y].startIndex
                            const end = HierList[y].endIndex
                            let appendStr = ''
                            if (k >= start && k < end) {
                                isremove = true
                            }
                            if (index == hierLength) {
                                if (isremove) {
                                    appendStr = `<div class='latt-child latt-border' style='width: ${widths};'></div>`
                                } else {
                                    appendStr = `<div class='latt-child' style='width: ${widths}'></div>`
                                }
                                childrenString += appendStr
                            }
                        }
                    }
                    htmlDate += `<div class='latt-father'>${childrenString}</div>`
                }
                div.innerHTML = htmlDate
                element.appendChild(div)
            },
            getHieght() {
                const list = this.solt
                let ObjList = []
                for (let i in list) {
                    ObjList.push(i)
                }
                const length = ObjList.length
                this.boxHg = length * 80 + 'px'
                this.boxHgs = length * 80 + 50 + 'px'
            },
            // 转换时间
            getTimes(str) {
                const now = new Date(str);
                var year = now.getFullYear()
                var month = now.getMonth() + 1
                month = month < 10 ? ('0' + month) : month
                var date = now.getDate()
                date = date < 10 ? ('0' + date) : date
                const timesTile = year + '-' + month + '-' + date
                const dateTime = year + '/' + month + '/' + date
                const itms = {
                    times: new Date(dateTime).getTime(),
                    title: timesTile
                }
                return itms

            },
            // 获取时间任务时间段
            getTimeSlot() {
                const startTime = this.startTime
                const endTime = this.endTime
                const isToday = this.isToday // 只允许第一次加载定位今天
                const startStr = new Date(startTime.replace(/-/g, '/')).getTime()
                const endStr = new Date(endTime.replace(/-/g, '/')).getTime()
                const timeNum = (endStr - startStr) / (24 * 60 * 60 * 1000)
                var list = []
                for (let i = 0; i < timeNum + 1; i++) {
                    let dateList = this.getTime(startStr, i)
                    list.push(dateList)
                }
                const width = this.widths.split('px')[0]
                this.widthAll = width * (timeNum + 1) + 'px'
                this.dateList = list
                if (isToday) {
                    this.getToDay()
                    this.isToday = false
                }
            },
            // mousedown
            down(e) {
                const ownDiv = e.target // 获取元素
                const isSx = false // 是否刷新
                const ownWidth = ownDiv.clientWidth // 获取元素宽度
                const startDisX = e.clientX// 获取鼠标开始位置
                let isClick = false
                // let width = Number(this.widths.split('px')[0]) + 10
                const element = document.getElementsByClassName('timeSoltFather')[0]
                const widthAll = this.widthAll
                const lefts = this.left
                var endDisX = 0
                var that = this
                const fun = function (e) {
                    isClick = true
                    endDisX = e.clientX - startDisX + lefts
                    that.left = endDisX
                    const movePx = endDisX + 'px'
                    element.setAttribute('style', `width: ${widthAll}; left: ${movePx}`)
                }
                let unFun = function (e) {
                    document.removeEventListener('mousemove', fun, false)
                    document.removeEventListener('mouseup', unFun, false)
                    if (!isClick) {
                        return
                    }
                }
                document.addEventListener('mousemove', fun, false)
                document.addEventListener('mouseup', unFun, false)
            },
            getdown(e) {
                const ownDiv = e.target // 获取元素
                const isSx = false // 是否刷新
                const ownWidth = ownDiv.clientWidth // 获取元素宽度
                const startDisX = e.clientX// 获取鼠标开始位置
                let isClick = false
                // let width = Number(this.widths.split('px')[0]) + 10
                const element = document.getElementsByClassName('task_feedback_box')[0]
                const widthAll = this.allListWidth
                const lefts = this.taskleft
                var endDisX = 0
                var that = this
                const fun = function (e) {
                    isClick = true
                    endDisX = e.clientX - startDisX + lefts
                    that.taskleft = endDisX
                    const movePx = endDisX + 'px'
                    element.setAttribute('style', `width: ${widthAll}; left: ${movePx}`)
                }
                let unFun = function (e) {
                    document.removeEventListener('mousemove', fun, false)
                    document.removeEventListener('mouseup', unFun, false)
                    if (!isClick) {
                        return
                    }
                }
                document.addEventListener('mousemove', fun, false)
                document.addEventListener('mouseup', unFun, false)
            },
            // 获取时间
            getTime(str, Num) {
                const now = new Date(str + Num * 24 * 60 * 60 * 1000)
                var month = now.getMonth() + 1
                var date = now.getDate()
                const week = now.getDay()
                var weekday = ["周日", "星期一", "星期二", "星期三", "星期四", "星期五", "周六"]
                var weekString = weekday[week]
                date = date < 10 ? ('0' + date) : date
                const tims = {
                    dateStr: month + '/' + date,
                    weeks: weekString
                }
                return tims
            },
            // 获取开始和后面的时间
            getShowTime() {
                var list = []
                for (let i = -1; i < 7; i++) {
                    const dateObj = this.getTime(i)
                    list.push(dateObj)
                }
                this.dateList = list
            },
            // 获取屏幕宽度
            getScreenWidth() {
                const width = $('.tiemSolt').width()
                this.widths = Math.floor((width - 1) / 8 * 100) / 100 + 'px'
            },
            // 获取反馈信息
            getFeedback(obj) {
                let ones = {}
                let index = 0
                let allList = []
                let idList = []
                let heightList = []
                const clentWidth = Number(this.widths.split('px')[0])
                let testArr = []
                for (let i in obj) {
                    index++
                    ones[i] = []
                    const left = clentWidth * (index - 1) + 10 * (index - 1) + 'px'
                    const list = obj[i]
                    list.forEach(item => {
                        if(item.is_test == 0){
                            if (Object.keys(item.stage).length != 0) {
                                item.stage.is_test = 0;
                                item.stage.is_client_audit = item.is_client_audit;
                                item.stage.is_inside_audit = item.is_inside_audit;
                                item.stage.left = left
                                item.stage.name = item.name
                                item.stage.parentId = item.id
                                item.stage.project_name = item.project_name
                                ones[i].push(item.stage)
                            }
                        }else if(item.is_test == 1 && item.status == 1 || item.is_test == 1 && item.status == 3) {
                            item.uploadTime = this.getTimeTitle(item.upload_time);
                            item.insideAuditTime = this.getTimeTitle(item.inside_audit_time);
                            testArr.push(item);
                        }
                    })
                }
                for (let k in ones) {
                    const list = ones[k]
                    let topNum = 0

                    list.forEach((items, index) => {
                        items.centWidths = clentWidth + 'px'
                        items.chilrenLeft = clentWidth / 2 + 'px'
                        items.top = index * 210 + 'px'
                        if (index > 0) {
                            const status = list[index - 1].status
                            if (status !== '1') {
                                topNum += 360
                            } else {
                                topNum += 210
                            }
                        } else {
                            topNum = 0
                        }
                        items.top = topNum + 'px'
                        heightList.push(index * 210)
                        if (items.create_time) {
                            items.create_time_title = !items.create_time ? null : this.getTimeTitle(items.create_time)
                            items.client_audit_title = !items.client_audit_time ? null : this.getTimeTitle(items.create_time)
                            items.inside_audit_title = !items.inside_audit_time ? null : this.getTimeTitle(items.create_time)
                            if (!allList.length) {
                                allList.push(items)
                                idList.push(items.id)
                            } else {
                                if (idList.indexOf(items.id) == -1) {
                                    idList.push(items.id)
                                    allList.push(items)
                                }
                            }
                        }
                    })
                }
                heightList.sort()
                const height_min = $(window).height() - 390 // 300是除去他元素的总高度
                const length = heightList.length - 1
                const boxHgs = Number(this.boxHgs.split('px')[0])
                if (length >= 0) {
                    const lengths = boxHgs
                    if (lengths > height_min) {
                        this.boxHight = boxHgs + 'px'
                    } else {
                        this.boxHight = height_min + 'px'
                    }
                } else {
                    if (boxHgs > height_min) {
                        this.boxHight = boxHgs + 'px'
                    } else {
                        this.boxHight = height_min + 'px'
                    }
                }
                const testList = testArr.length;
                const listLt = allList.length;
                this.allListWidth = (listLt+testList) * 520 - 20 + 'px'

                allList.forEach(element => {
                    if (element.create_time) {
                        element.firstStage = 'isStage'
                    }
                    if (element.inside_audit_time) {
                        element.secondStage = 'isStage'
                    }
                    if (element.client_audit_time) {
                        element.thirdStage = 'isStage'
                    }
                    if (!element.create_time && !element.inside_audit_time && !element.client_audit_time) {
                        element.firstStage = '',
                            element.secondStage = '',
                            element.thirdStage = ''
                    }
                });
                this.examinList = allList.concat(testArr);
            },
            // 查找阶段
            getStageList() {
                const url = this.GLOBAL.baseRouter + "/task/task/info"
                const items = {
                    id: this.task_id
                }
                this.$axios.post(url, qs.stringify(items)).then(data => {
                    this.stageList = data.data.stage;
                    const list = data.data.standard;
                    const newList = [];
                    this.ids.taskId = data.data.id;
                    this.ids.projectId = data.data.project;

                    list.forEach(element => {
                        if (element.type == 'file') {
                            newList.push(element)
                        }
                    });
                    this.standardList = newList
                })
            },
            // 获取时间字段
            getTimeTitle(time) {
                const timeNum = time * 1000
                const momentTime = this.momentTime * 1000
                let tageTitle = ''
                const times = momentTime - timeNum
                const remainder = Math.floor(times / (24 * 60 * 60 * 1000)) // 下舍入判断上传多少天
                if (!remainder) {
                    const remainders = Math.floor(times / (60 * 60 * 1000))
                    if (!remainders) {
                        tageTitle = '刚刚'
                    } else {
                        tageTitle = remainder + '小时前'
                    }
                } else {
                    tageTitle = remainder + '天前'
                }
                return tageTitle
            },
            // 上传
            uploadImg() {
                let _this = this;
                $LAB
                    .script("/static/html2canvas.min.js").wait(() => {
                    this.getHtml2canvas('yu_lan').then((mainThumbUrl)=>{
                        // mainThumbUrl  截取下来的主图地址
                        let url = _this.GLOBAL.baseRouter + "/task/task/stage-upload";
                        let list = _this.feilsList;
                        let objList = [];
                        list.forEach(items => {
                            let obj = JSON.parse(items.response);
                            objList.push({
                                fid: obj.fid,
                                file: obj.file_url,
                                is_main: items.is_main,
                                thumb: items.is_main == 1 ? mainThumbUrl : obj.file_url,
                                type: obj.fileType
                            })
                        })

                    let items = {
                        task_id: this.task_id, // 任务id
                        stage: this.stage, //上传阶段
                        file: JSON.stringify(objList) // json字符串
                    }
                    if(items.stage){
                        //开始上传
                        _this.uploadStatusText = '上传中...';
                        _this.$axios.post(url, qs.stringify(items)).then(data => {
                            if (data.data.err_code === 0) {
                                _this.isclose1 = false;
                                _this.getOriginal();
                                _this.getMsgLists();
                                _this.$Message.success(data.data.err_message);
                                _this.uploadStatusText = '完成上传';
                            } else {
                                _this.$Message.error(data.data.err_message)
                            }
                            _this.againFun()
                        })
                    }else {
                        this.$Message.info('请选择上传阶段');
                    }

            })
                    })},
            // 回到初始状态
            getOriginal() {
                this.index = 0
                this.boxHgs = ''
                this.boxHight = ''
                this.tastList = []
                this.examinList = []
                this.solt = {}
                this.nameList = []
                this.task_name = ''
                this.isToday = true
                this.beforeData = {}
                this.afterData = {}
                this.listAll = {}
            },
            //获取OSS参数
            getOSSdataFun(OSSdata){
                this.OSSdata = OSSdata;
            },
            // 截取缩略图
            getHtml2canvas(el){
                let _this = this;
                var ele = document.getElementById(el);
                return new Promise((resolve,reject)=>{
                    html2canvas(ele,{ useCORS: true }).then(function(canvas) {
                        var dataURL = canvas.toDataURL('image/png');
                        // dataURL = dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
                        resolve(_this.uploadOss(dataURL));
                    })
                })
            },
            // 转blob方法
            convertImgDataToBlob(base64Data) {
                var format = "image/jpeg";
                var base64 = base64Data;
                var code = window.atob(base64.split(",")[1]);
                var aBuffer = new window.ArrayBuffer(code.length);
                var uBuffer = new window.Uint8Array(aBuffer);
                for(var i = 0; i < code.length; i++){
                    uBuffer[i] = code.charCodeAt(i) & 0xff ;
                }
                // console.info([aBuffer]);
                // console.info(uBuffer);
                // console.info(uBuffer.buffer);
                // console.info(uBuffer.buffer==aBuffer); //true
                var blob=null;
                try{
                    blob = new Blob([uBuffer], {type : format});
                }
                catch(e){
                    window.BlobBuilder = window.BlobBuilder ||
                        window.WebKitBlobBuilder ||
                        window.MozBlobBuilder ||
                        window.MSBlobBuilder;
                    if(e.name == 'TypeError' && window.BlobBuilder){
                        var bb = new window.BlobBuilder();
                        bb.append(uBuffer.buffer);
                        blob = bb.getBlob("image/jpeg");
                    }
                    else if(e.name == "InvalidStateError"){
                        blob = new Blob([aBuffer], {type : format});
                    }
                    else{
                    }
                }
                return blob;
            },
            //上传OSS
            uploadOss(base64Codes){
                var option = this.OSSdata;
                var UploadUrl = this.OSSdata.host;
                var file = this.convertImgDataToBlob(base64Codes);
                var tt = new File([file],'tt',{type:'image/jpeg'});
                var formData = new FormData();
                formData.append('key', option.dir+this.ids.projectId+this.ids.taskId+this.ids.stageId+this.GenNonDuplicateID());
                formData.append('policy', option.policy);
                formData.append('OSSAccessKeyId', option.accessid);
                formData.append('success_action_status', '200');
                formData.append('signature', option.signature);
                formData.append('callback',option.callback);
                formData.append("file", tt);
                // console.log(1010101,formData);
                return new Promise((resolve,reject)=>{
                    $.ajax({
                        url:UploadUrl,
                        data:formData,
                        processData:false,
                        cache: false,
                        async: false,
                        contentType: false,
                        dataType: 'JSON',
                        type : 'post',
                        // headers:{"Content-Type":"multipart/form-data"},
                        success:function(data){
                            if(data.Status == 'Ok'){
                                resolve(data.file_url);
                            }
                        },
                        error:function(data) {
                            if(data.status == 403){
                                this.$Message.info('上传超时，请重新上传！');
                            }
                        }
                    });
                })
            },
            // 生成不重复随机文件名
            GenNonDuplicateID() {
                var randomStr = Number(Math.random().toString().substr(3,12) + Date.now()).toString(36);
                return randomStr.substring(0,randomStr.length - 4);
            }
        },
        filters:{
            substring:function (val) {
                return val.length > 30 ? '...'+val.substring(val.length,15):val;
            },
            timeCover:function (val) {
                let day = new Date(val * 1000);
                return day.getFullYear()+'-'+(day.getMonth()+1)+'-'+day.getDate()+'-'+day.getHours()+'-'+day.getMinutes()+'-'+day.getSeconds()
            }
        }
    }
</script>
<style lang="less">
    .upload_page2{
        padding-bottom: 20px;
        position: absolute;
        top: 70px;
        left: 25%;
        /*margin-left: -250px;*/
        background: #ffffff;
        z-index: 99999;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        .upload_header_title{
            margin:0;
            line-height: 60px;
            font-weight: lighter;
            margin-left: 20px;
        }
        .testTask{
            line-height: 60px;
            font-size: 12px;
            border: 1px solid #fff;
            padding: 1px 5px;
            border-radius: 3px;
            color: #fff;
            margin-left: 10px;
        }
        .testTaskDiv{
            /*padding: 30px;*/
            display: flex;
            justify-content: space-between;
            .testTaskLeft{
                width: 300px;
                .tipsText{
                    font-size: 13px;
                    color: #ccc;
                    display: inline-block;
                    margin-bottom: 20px;
                }
                dl{
                    dt{
                        font-size: 15px;
                        font-weight: lighter;
                    }
                    dd{
                        margin: 15px 0;
                        font-size: 13px;
                        color: #ccc;
                        padding-right: 15px;
                        .uploadFileSty{
                            padding: 5px 0;
                            a{
                                color:#3bceb6;
                                margin-left: 50px;
                                &:hover{
                                    text-decoration-line:underline;
                                }
                            }
                        }
                    }
                }
            }
            .testTaskright{
                width: 600px;
                .tipsText{
                    width: 100%;
                    font-size: 13px;
                    color: #ccc;
                    display: inline-block;
                    margin-bottom: 20px;
                    button{
                        border-radius: 3px;
                        background: #fff;
                        float: right;
                        border: 1px solid #3bceb6;
                        color: #3bceb6;
                        padding: 2px 5px;
                        font-size: 13px;
                        outline: none;
                        cursor: pointer;
                    }
                }
                .contenerFile{
                    width: 100%;
                    height: auto;
                    /*background: #ccc;*/
                    border-radius: 3px;
                    position: relative;
                    .upload_box{
                        margin: 0;
                        .uploadContainer{
                            cursor: pointer;
                            margin-left: -300px!important;
                        }
                        .yu_lan{
                            max-height: 400px;
                            height: auto !important;
                            overflow: hidden;
                        }
                    }
                    .spinPop{
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: rgba(0,0,0,.5);
                        z-index: 2;
                    }
                }
                .buttons{
                    margin: 10px 0;
                    button{
                        padding: 1px 10px;
                        border: 1px dashed #ccc;
                        font-size: 12px;
                        background: #fff;
                        border-radius: 3px;
                        outline: none;
                        margin-right: 10px;
                        color: #ccc;
                    }
                }
                .tipsUpload{
                    color: orange;
                    font-size: 12px;
                    margin-top: 10px;
                }
                .actionBtn{
                    text-align: right;
                    button{
                        cursor: pointer;
                        padding: 5px 15px;
                        border-radius: 3px;
                        border: 0;
                        font-size: 15px;
                        margin-left: 15px;
                    }
                    .caell{
                        color: #ccc;
                        background: #ffffff;
                    }
                    .ok{
                        color: #fff;
                        background: #3bceb6;
                    }
                }

                /*width: 80%;*/
            }
        }
    }

    .my_task_top {
        background: rgb(72, 197, 183);
    }

    .my_task_bottom {
        background: rgb(26, 153, 170);
    }

    .page_week_all {
        width: 100%;
        min-height: 100%;
        position: relative;
        padding: 10px;
        .left_tips, .right_tips {
            position: absolute;
            width: 80px;
            height: 100%;
            top: 0;
            z-index: 2;
        }
        .left_tips {
            left: -40px;
            background: -webkit-linear-gradient(left, #eef1f2, rgba(298, 241, 242, .4));
            background: -o-linear-gradient(right, #eef1f2, rgba(298, 241, 242, .4));
            background: -moz-linear-gradient(right, #eef1f2, rgba(298, 241, 242, .4));
            background: linear-gradient(to right, #eef1f2, rgba(298, 241, 242, .4));
            .left_img_first {
                position: absolute;
                top: 200px;
                left: 20px;
            }
            .left_img_last {
                position: absolute;
                bottom: 80px;
                left: 20px;
            }
        }
        .right_tips {
            right: -40px;
            background: -webkit-linear-gradient(left, rgba(298, 241, 242, .4), #eef1f2);
            background: -o-linear-gradient(right, rgba(298, 241, 242, .4), #eef1f2);
            background: -moz-linear-gradient(right, rgba(298, 241, 242, .4), #eef1f2);
            background: linear-gradient(to right, rgba(298, 241, 242, .4), #eef1f2);
            .right_img_first {
                position: absolute;
                top: 200px;
                right: 20px;
            }
            .right_img_last {
                position: absolute;
                bottom: 80px;
                right: 20px;
            }
        }
    }

    .times_box {
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 16px;
        border: 1px solid #eef1f2;
        border-left: none;
        margin-top: -1px;
        float: left;
    }

    .times_box:first-child {
        border-left: 1px solid #eef1f2;
    }

    .tiemSolt {
        width: 100%;
        /* min-height: 643px; */
        /* margin: 50px 0px; */
        overflow: hidden;
        position: relative;
    }

    .times_box > span:nth-child(2) {
        margin-right: 10px;
    }

    .task_top_box {
        position: absolute;
        height: 60px;
        /* padding: 10px; */
        border-radius: 4px;
        overflow: hidden;
        z-index: 1;
        // background: rgb(72,197,183);
    }

    .timeSoltFather {
        background: #fdfdfd;
        position: absolute;
        top: 0;
    }

    .task_ka {
        width: 100%;
        /* height: 50px; */
        margin-top: 60px;
        position: relative;
    }

    .my_strips {
        width: calc(100% - 200px);
        height: 60px;
        border-bottom: 10px solid rgb(26, 153, 170);
    }

    .myTaskAll {
        width: 100%;
        height: 80px;
        line-height: 80px;
        font-size: 20px;
        padding-left: 30px;
        color: #777777;
    }

    .myTaskAll > span {
        color: #3bceb6;
        font-size: 20px;
        margin-right: 5px;
    }

    .upload_preview_box {
        width: 40px;
        height: 40px;
        position: absolute;
        top: 10px;
        right: 20px;
        cursor: pointer;
        text-align: center;
        line-height: 40px;
        color: #ffffff;
        & p {
            font-size: 40px;
        }
    }

    .task_describe {
        @widthed: 60px;
        width: calc(~"100% - @{widthed}");
        height: 100%;
    }

    .task_describe_title {
        width: 100%;
        height: 100%;
        /*padding-right: 10px;*/
        position: relative;
    }

    /* .task_describe_title>div{
      float: left;
    } */
    .state-introd {
        width: 100px;
        height: 30px;
        line-height: 30px;
        color: #ffffff;
        //  background: #fcc44a;
        text-align: center;
        position: absolute;
        top: 3px;
        left: -33px;
        transform: rotate(-45deg);
    }

    .task-wait {
        background: -webkit-linear-gradient(left, rgb(185, 224, 254), rgb(158, 211, 253)); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(right, rgb(185, 224, 254), rgb(158, 211, 253)); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(right, rgb(185, 224, 254), rgb(158, 211, 253)); /* Firefox 3.6 - 15 */
        background: linear-gradient(to right, rgb(185, 224, 254), rgb(158, 211, 253)); /* 标准的语法 */
    }

    .task-doing {
        background: -webkit-linear-gradient(left, rgb(146, 235, 224), rgb(108, 226, 211)); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(right, rgb(146, 235, 224), rgb(108, 226, 211)); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(right, rgb(146, 235, 224), rgb(108, 226, 211)); /* Firefox 3.6 - 15 */
        background: linear-gradient(to right, rgb(146, 235, 224), rgb(108, 226, 211)); /* 标准的语法 */
    }

    .task-pause {
        background: -webkit-linear-gradient(left, rgb(219, 207, 254), rgb(201, 183, 254)); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(right, rgb(219, 207, 254), rgb(201, 183, 254)); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(right, rgb(219, 207, 254), rgb(201, 183, 254)); /* Firefox 3.6 - 15 */
        background: linear-gradient(to right, rgb(219, 207, 254), rgb(201, 183, 254)); /* 标准的语法 */
    }

    .task-complete {
        background: -webkit-linear-gradient(left, rgb(254, 227, 154), rgb(253, 215, 114)); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(right, rgb(254, 227, 154), rgb(253, 215, 114)); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(right, rgb(254, 227, 154), rgb(253, 215, 114)); /* Firefox 3.6 - 15 */
        background: linear-gradient(to right, rgb(254, 227, 154), rgb(253, 215, 114)); /* 标准的语法 */
    }

    .task_describe_father {
        /* padding-right: 60px; */
        @widthLeft: 50px;
        margin-left: 45px;
        width: calc(~"100% - @{widthLeft}");
        height: 100%;
        line-height: 60px;
    }

    .task_describe_msg {
        font-size: 18px;
        color: #ffffff;
        cursor: pointer;
    }
    .IsTestTaskType{
        color: #2adcbf;
        padding: 1px 5px;
        border-radius: 4px;
        font-size: 12px;
        border: 1px solid #2adcbf;
        margin-left: 5px;
    }

    .task_describe_sub {
        font-size: 16px;
        color: #ffffff;
    }

    .task_describe_time {
        color: #ffffff;
        font-size: 14px;
    }

    .task_describe_time > span:last-child {
        margin-left: 20px;
    }

    .task_icon {
        margin-right: 10px;
    }

    .task_icon > span {
        font-size: 30px;
        display: block;
        line-height: 1;
        float: left;
        color: rgb(25, 250, 40);
    }

    .examine_task {
        width: 100%;
        margin-top: 80px;
        height: 400px;
        position: relative;
    }

    .examin_msg_task {
        position: absolute;
        /* width: 200px; */
        height: 200px;
    }

    .examin_sanjiao {
        height: 0px;
        width: 0px;
        /* margin-left: 84px; */
        border-right: 15px solid transparent;
        border-bottom: 30px solid rgb(26, 153, 170);
        border-left: 15px solid transparent;
    }

    .eaxmin_msg {
        width: 100%;
        /* height: 150px; */
        padding: 10px;
        background: rgb(26, 153, 170);
    }

    .eaxmin_title_all {
        width: 100%;
        height: 100px;
    }

    .eaxmin_title_all > p:first-child {
        font-size: 20px;
        color: #ffffff;
    }

    .eaxmin_title_all > p:last-child {
        font-size: 14px;
        color: #ffffff;
    }

    .msg_stauts {
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 20px;
        color: rgb(72, 197, 183);
    }

    .no_msgs {
        position: absolute;
        width: 50px;
        height: 50px;
        left: 10px;
        top: 80px;
        cursor: pointer;
    }

    .no_msg_left {
        position: absolute;
        left: 0;
        top: 10px;
        height: 0px;
        width: 0px;
        /* margin-left: 84px; */
        border-top: 10px solid transparent;
        border-right: 20px solid rgb(72, 197, 183);
        border-bottom: 10px solid transparent;
    }

    .no_msg_lefts {
        position: absolute;
        left: 0;
        top: 10px;
        height: 0px;
        width: 0px;
        /* margin-left: 84px; */
        border-top: 10px solid transparent;
        border-right: 20px solid rgb(255, 92, 50);
        border-bottom: 10px solid transparent;
    }

    .no_msg_sj {
        position: absolute;
        right: 0;
        top: 10px;
        height: 0px;
        width: 0px;
        /* margin-left: 84px; */
        border-top: 10px solid transparent;
        border-left: 20px solid rgb(72, 197, 183);
        border-bottom: 10px solid transparent;
    }

    .no_msg_title {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        text-align: center;
        line-height: 40px;
        background: rgb(72, 197, 183);
        font-size: 16px;
        color: #ffffff;
    }

    .no_msg_titles {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-left: 10px;
        text-align: center;
        line-height: 40px;
        background: rgb(255, 92, 50);
        font-size: 16px;
        color: #ffffff;
    }

    .msg_couple {
        width: 100%;
    }

    .msg_couple > span:nth-child(1) {
        float: left;
        display: block;
        width: 30px;
        height: 30px;
        background: #ffffff;
        border-radius: 50%;
    }

    .msg_couple > span:nth-child(2) {
        float: left;
        color: #ffffff;
        margin-top: 10px;
        font-size: 14px;
    }

    .msg_couple > span:nth-child(3) {
        float: right;
        font-size: 20px;
        color: rgb(72, 197, 183);
    }

    .msg_couple_p {
        width: 100%;
        height: 150px;
        border: 2px solid #ffffff;
        border-radius: 4px;
    }

    .upload_outer {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, .3);
        z-index: 9999;
    }

    .upload_page {
        width: 556px;
        // height: 770px;
        padding-bottom: 20px;
        position: absolute;
        top: 70px;
        left: 50%;
        margin-left: -250px;
        background: #ffffff;
        z-index: 99999;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    .task_describe-sign {
        color: #7cbefc;
        cursor: pointer;
    }

    .upload_page_header {
        width: 100%;
        height: 60px;
        /* line-height: 60px; */
        background: url('../../images/upload.png');
        background-size: 100% 100%;
        border-bottom: 1px solid rgb(228, 228, 228);
    }

    .upload_header_ce {
        display: block;
        float: left;
        text-align: center;
        padding: 2px 5px;
        margin: 22px 0px 0px 10px;
        background: #fcc44a;
        border-radius: 4px;
        color: #ffffff;
    }

    .upload_header_title {
        display: block;
        float: left;
        font-size: 18px;
        font-weight: bold;
        color: #ffffff;
        margin: 20px 10px 0 20px;
    }

    .upload_page_close {
        position: absolute;
        right: 0;
        top: 0;
        width: 20px;
        height: 20px;
        border-top-right-radius: 4px;
        text-align: center;
        line-height: 20px;
        cursor: pointer;
        background: rgb(102, 215, 201);
        color: #ffffff;
    }

    .upload_page_main {
        width: 100%;
        // height: 540px;
        padding: 20px;
    }

    .Choice_page_title {
        font-size: 14px;
        color: rgb(218, 218, 218);
    }

    .Choice_page_box {
        width: 100%;
        height: 70px;
        overflow-y: auto;
    }

    .choice_page_ul {
        width: 100%;
        height: 35px;
        margin: 20px 0px;
    }

    .choice_page_ul li {
        height: 100%;
        float: left;
    }

    .choice_page_ul li > span {
        float: left;
        font-size: 18px;
        margin-top: 4px;
    }

    .choice_page_ul li > div {
        position: relative;
        width: 80px;
        height: 100%;
        float: left;
        cursor: pointer;
        border-radius: 4px;
        border: 1px solid rgb(215, 215, 215);
    }

    .choice_page_ul li > div > p {
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 35px;
    }

    .choice_page_active {
        border: 1px solid #3bceb6 !important;
        background: #66d7c9;
    }

    .Instruc {
        color: #3bceb6;
    }

    .upload_gou {
        font-size: 15px;
        position: absolute;
        right: 5px;
        top: 5px;
        color: rgb(24, 191, 164);
    }

    .upload_jiao {
        position: absolute;
        right: 10px;
        top: -37px;
        width: 70px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        border-radius: 4px;
        background: #3bceb6;
        color: #ffffff;
    }

    .upload_jiao:before {
        width: 0;
        height: 0;
        content: '';
        display: block;
        position: absolute;
        top: 25px;
        left: 50%;
        margin-left: -5px;
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
        border-top: 5px solid #3bceb6;
    }

    .choice_title_Stand {
        margin-top: 10px;
        margin-top: 10px;
        width: 100%;
        background: #eef1f2;
        border-radius: 4px;
        padding: 0 10px;
    }

    .choice_title_Stand > span:first-child {
        float: left;
        font-size: 16px;
        color: #777777;
    }

    .choice_title_Stand > span:last-child {
        float: right;
        font-size: 16px;
        color: #777777;
    }

    .upload_box {
        width: 100%;
        min-height: 400px;
        margin-top: 20px;
        position: relative;
        border: 1px dashed black;
    }

    .sure_title {
        width: 100px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        margin-top: 20px;
        font-size: 16px;
        border-radius: 4px;
        cursor: pointer;
        float: right;
        background: rgba(24, 191, 164, 1);
        color: #ffffff;
    }

    .sure_title:hover {
        background: rgba(24, 191, 164, .8);
    }

    .yulanBack {
        background: #fcc44a !important;
        color: #ffffff;
        .precond {
            color: #ffffff;
        }
    }

    .prompt_title {
        font-size: 18px;
        // color: rgb(215,215,215);
        cursor: pointer;
    }

    .prompt_title_last {
        font-size: 16px;
        color: rgb(215, 215, 215);
    }

    .font_class {
        font-size: 40px !important;
        cursor: pointer;
        color: #3bceb6;
    }
    .imPlementerContainer{
        .uploadContainer {
            position: absolute;
            width: 100%;
            top: 50%;
            left: 50%;
            height: 120px;
            margin-top: -60px;
            margin-left: -258px;
            text-align: center;
        }
        .browse {
            width: 100% !important;
            height: 100% !important;
            opacity: 0;
        }
    }


    .title_all {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 120px;
    }



    .yu_lan {
        width: 100%;
        height: 300px;
        //  padding-right: 20px;
        /* margin-top: 50px; */
    }

    .yulan_span {
        width: 100%;
        margin: 10px 0 10px 0;
        /* overflow-y: scroll; */
    }

    .yulan_span > div {
        display: inline-block;
        background: #eef1f2;
        margin-left: 10px;
        /* float: left; */
        margin-top: 10px;
        position: relative;
        cursor: pointer;
        border-radius: 4px;
    }

    .yu_lan > img {
        width: 100%;
        height: 100%;
    }

    .again_upload {
        padding: 3px 10px;
        text-align: center;
        line-height: 20px;
        margin-top: 5px;
        font-size: 16px;
        cursor: pointer;
        border-radius: 4px;
        float: right;
        color: #3bceb6;
        border: 1px solid #3bceb6;
    }

    .again_upload_title {
        float: left;
        margin: 5px 0 0 10px;
        line-height: 20px;
        font-size: 16px;
        color: #3bceb6;
    }

    .all_upload_page {
        width: 100%;
        height: 100%;
        .ivu-row {
            width: 100%;
            height: 100%;
            .demo-spin-col > div {
                width: 50px;
                margin: 180px auto 0;
                text-align: center;
            }
        }
    }

    .again_upload_father {
        width: 100%;
        height: 30px;
        padding-right: 10px;
    }

    .is_angin {
        width: 200px;
        height: 160px;
        position: fixed;
        top: 50%;
        left: 50%;
        margin-top: -100px;
        margin-left: -100px;
        background: rgb(240, 240, 240);
        border-radius: 4px;
        z-index: 99999;
    }

    .is_angin > p {
        width: 100%;
        height: 120px;
        text-align: center;
        line-height: 160px;
    }

    .is_angin_box {
        width: 100%;
        height: 40px;
    }

    .is_angin_box > p {
        width: 60px;
        height: 30px;
        float: left;
        border-radius: 4px;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        color: #ffffff;
        margin-top: 5px;
    }

    .is_angin_box > p:first-child {
        background: rgb(24, 191, 164);
        margin-left: 30px;
    }

    .is_angin_box > p:last-child {
        background: rgb(215, 215, 215);
        margin-left: 20px;
    }

    .xe_title {
        width: 100%;
        height: 100%;
        padding: 5px 10px;
    }

    .precond {
        padding: 3px;
        margin-right: 3px;
    }

    .yulanBacks:hover .yulan_bx {
        display: block;
    }

    .yulan_bx {
        width: 100px;
        height: 40px;
        z-index: 9999;
        position: absolute;
        left: 0;
        top: 29px;
        display: none;
        margin-bottom: 20px;
    }

    .yulan_sanjiao {
        height: 0px;
        width: 0px;
        margin-left: 20px;
        border-right: 5px solid transparent;
        border-bottom: 10px solid #fcc44a;
        border-left: 5px solid transparent;
    }

    .yulan_zhujian {
        width: 100%;
        height: 30px;
        border-radius: 4px;
        background: #fcc44a;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        color: #ffffff;
    }

    .demo-spin-container {
        width: 100%;
        height: 100%;
    }

    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }

    /* @keyframes ani-demo-spin {
      from { transform: rotate(0deg)}
      50%  { transform: rotate(180deg)}
      to   { transform: rotate(360deg)}
    } */
    .demo-spin-col {
        height: 100%;
        position: relative;
    }

    .demo-spin-col > div {
        width: 50px;
        margin: 100px auto 0;
    }

    #lattice {
        width: 100%;
        position: absolute;
        top: 50px;
        left: 0;
    }

    .latt-father {
        width: 100%;
        height: 80px;
        border-bottom: 1px solid #eef1f2;
    }

    .latt-child {
        float: left;
        height: 100%;
        border-right: 1px solid #eef1f2;
        background: #fdfdfd;
    }

    .latt-child:first-child {
        border-left: 1px solid #eef1f2;
    }

    .latt-border {
        border-right: 1px solid rgba(255, 255, 255, 0);
    }

    .task_feedback {
        width: 100%;
        height: 140px;
        overflow: hidden;
        position: relative;
        .task_feedback_box {
            // width: 100%;
            position: absolute;
            top: 0;
            height: 100%;
            .task_feedback_msg {
                width: 500px;
                height: 140px;
                padding: 20px;
                border-radius: 4px;
                background: #fdfdfd;
                margin-right: 20px;
                float: left;
                &:last-child {
                    margin-right: 0;
                }
                .feedback_iamge_father {
                    width: 100px;
                    height: 100px;
                    background-repeat: no-repeat;
                    background-size: cover;
                    background-position: center;
                    border-radius: 4px;
                    float: left;
                    .task_feedback_image {
                        width: 100%;
                        height: 100%;
                    }
                }
                .task_feedback_details {
                    width: 350px;
                    height: 100px;
                    margin-left: 10px;
                    float: left;
                    .feedback_words_box {
                        width: 100%;
                        height: 45px;
                        .feedback_words {
                            width: 240px;
                            height: 45px;
                            float: left;
                            .feedback_words_task {
                                font-size: 16px;
                                font-weight: bold;
                                cursor: pointer;
                                .IsTestTaskType{
                                    font-weight: lighter;
                                }
                            }
                            .feedback_words_project {
                                font-size: 14px;
                                color: #bdbdbd;
                            }
                        }
                        .feedback_explain {
                            padding: 5px 10px;
                            margin-left: 10px;
                            border: 1px solid #eef1f2;
                            color: #3bceb6;
                            float: left;
                        }
                    }
                    .feedback_task_progress {
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        height: 5px;
                        border-radius: 4px;
                        background: #bdbdbd;
                        .progress_feedback_style {
                            width: 33.3333%;
                            height: 100%;
                            float: left;
                            border-radius: 4px;
                            background: #bababa;
                            &:before {
                                display: block;
                                content: '';
                                width: 0;
                                height: 0;
                                border-left: 5px solid transparent;
                                border-right: 5px solid transparent;
                                border-top: 5px solid #bababa;
                                // position: absolute;
                                // top: 40px;
                                // left: 50%;
                                margin: 5px 0 0 55px;
                            }
                        }
                        .isStage {
                            background: #3bceb6;
                            &::before {
                                border-top: 5px solid #3bceb6;
                            }
                        }
                    }
                    .feedback_stage {
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        height: 20px;
                        margin-top: 5px;
                        & p {
                            width: 33.333%;
                            height: 100%;
                            text-align: center;
                            font-size: 14px;
                            color: #bdbdbd;
                            float: left;
                        }
                    }
                    .feedback_stage_state {
                        width: 100%;
                        height: 20px;
                        display: flex;
                        justify-content: space-between;
                        & p {
                            width: 33.333%;
                            height: 100%;
                            text-align: center;
                            font-size: 14px;
                            color: #bdbdbd;
                            float: left;
                        }
                    }
                }
            }
        }
    }
</style>
