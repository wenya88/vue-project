<template>
    <div>
        <!-- 负责的项目 -->
        <div class="projectWorkInfo">
            <!-- 日程提醒 -->
            <div class="myCalend">
                <CalendInfo></CalendInfo>
            </div>
            <div class="myProject">
                <dl>
                    <dt><Icon type="android-apps"></Icon> 我负责的项目({{ProjectData.length}})</dt>
                    <dd>
                        <Row>
                            <!-- 分割线 -->
                            <Col span="12" v-for="(item,index) in ProjectData" :key="index" @click.native="homepage">
                                <div class="proChart">
                                    <Row>
                                        <Col span="8">
                                            <div class="circle">
                                                <div style="display:block"><span class="title">{{item.last_day}}</span></div>
                                                <i-circle :percent="Number(item.rate_task)" :size="100" stroke-color="#00cc00">
                                                    <span class="demo-Circle-inner" style="font-size:24px">
                                                        {{Math.round(item.rate_task)}}%
                                                        <p>当前完成</p>
                                                    </span>
                                                </i-circle>
                                                <div class="content">
                                                    {{item.name}} 
                                                    <span class="tips" v-show="item.status==2?true:false">暂停</span>
                                                    <span class="chlidPro" v-show="item.child_name==null?false:true"><Icon type="ios-arrow-right"></Icon> {{item.child_name}}</span>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span="16" style="padding-top:20px;">
                                            <div class="PressLine">
                                                <div class="gressTile">即将完成</div>
                                                <div class="gressLine"><Progress :percent="Number(item.will_finish_progress)"></Progress></div>
                                                <div class="clear"></div>
                                            </div>
                                            <div class="PressLine">
                                                <div class="gressTile">时间进度</div>
                                                <div class="gressLine">
                                                    <Progress :percent="Number(item.time_progress)>101?101:item.time_progress">
                                                        <span>{{item.time_progress>101?item.last_day:Math.round(item.time_progress)+'%'}}</span>
                                                    </Progress>
                                                </div>
                                                <div class="clear"></div>
                                            </div>
                                            <div class="PressLine">
                                                <div class="gressTile">文件进度</div>
                                                <div class="gressLine"><Progress :percent="Number(item.rate_task)"><span>{{item.end_task}}/{{item.all_task}}</span></Progress></div>
                                                <div class="clear"></div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <!-- 分割线 -->
                        </Row>
                    </dd>
                </dl>
            </div>
            <div class="clear"></div>
        </div>
        <!-- 工作台内容 -->
        <!-- 文件详情 -->
        <FinishModel
            v-if="modelTask"
            :isDisabled="true"
            @close="CloseModel"
            :editData="BaseObj" 
        >
            <div slot="one">
                <FormItem label="子项目">
                    <Select v-model="subpId" :disabled="true">
                        <Option v-for="item in childList" :value="item.project_child_name" :key="item.project_child_name">{{item.project_child_name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="任务类型">
                    <Select v-model="tType" :disabled="true">
                        <Option v-for="items in taskType" :value="items.tasktype_name" :key="items.tasktype_name">{{ items.tasktype_name }}</Option>
                    </Select>
                </FormItem>
            </div>
            <div slot="three">
                    <ImgEditor v-if="imgConponent"></ImgEditor>
                    <VidEditor v-if="vidConponent"></VidEditor>
                    <div v-if="NotType" class="notIMG">暂未上传任务文件或无法预览文件类型</div>
            </div>
        </FinishModel>
        <!-- 文件详情结束 -->
        <div class="projectWorkContent">
            <!-- 重点关注 -->
            <div class="contentRow emphkeep">
                <dl>
                    <dt><Icon type="grid"></Icon> 重点关注({{KeepData.length}})</dt>
                    <dd>
                        <ul>
                            <li v-for="(item,index) in KeepData" :key="index" @click="taskDetaInfo(
                                item.id,
                                item.stage_file.type,
                                item.stage_file.file,
                                item.stage_file.task_id
                                )">
                                <div class="row">
                                    <span>
                                        <b>{{item.name}}</b><br/><img src="https://i.loli.net/2017/08/21/599a521472424.jpg"/>&nbsp;<u>{{item.realname==null?item.nickname:item.realname}}</u>
                                    </span>
                                    <span>
                                        <i>{{item.surplus_time | FilteTime}}</i><br/><u>结束</u>
                                    </span>
                                    <span>
                                        <s>{{item.now_stage}}</s> / {{item.all_stage}}<br/><u>{{item.now_stage_name}}</u>
                                    </span>
                                </div>
                                <Progress :percent="Number(item.task_progress)" :stroke-width="2" :hide-info="true"></Progress>
                            </li>
                        </ul>
                    </dd>
                </dl>
            </div>
            <!-- 等待审核 -->
            <div class="contentRow awaiaudit">
                <dl>
                    <dt><Icon type="grid"></Icon> 等待审核({{AuditData.length}})</dt>
                    <dd>
                        <ul>
                            <li v-for="(item,index) in AuditData" :key="index"  @click="taskDetaInfo(
                                item.id,
                                item.stage_file.type,
                                item.stage_file.file,
                                item.stage_file.task_id
                                )">
                                <span>
                                    <img :src="item.thumb"/>{{item.name}}<br/><u>{{item.project_name}}</u>
                                </span>
                                <span>
                                    {{item.upload_day==0?"今天":Math.abs(item.upload_day)}} 天前<br/><u>上传</u>
                                </span>
                                <span>
                                    <i>{{item.surplus_time | FilteTime}}</i><br/><u>剩余时间</u>
                                </span>
                                <span>
                                    <s>{{item.stage}}</s> / {{item.all_stage}}<br/><u>{{item.now_stage_name}}</u>
                                </span>
                            </li>
                        </ul>
                    </dd>
                </dl>
            </div>
            <!-- 反馈待处理 -->
            <div class="contentRow fbackdisp">
                <dl>
                    <dt>
                        <Icon type="grid"></Icon> 反馈待处理 ({{DispData.length}})
                    </dt>
                    <dd>
                        <ul>
                            <li v-for="(item,index) in DispData" :key="index"   @click="taskDetaInfo(
                                item.id,
                                item.stage_file.type,
                                item.stage_file.file,
                                item.stage_file.task_id
                                )">
                                <span class="tip">{{item.upload_day==0?"今天":Math.abs(item.upload_day)+" 天前"}}</span>
                                <span class="stop" v-show="item.status==2?true:false">暂停</span>
                                <img :src="item.thumb"/>
                                <div class="fbackinfo">
                                    <p>{{item.name}}</p>
                                    <p>
                                        <span>{{item.fkqk}}</span>
                                        <span>
                                            <img src="https://i.loli.net/2017/08/21/599a521472424.jpg"/>&nbsp;{{item.realname==null?item.nickname:item.realname}}
                                        </span>
                                    </p>
                                </div>
                            </li>
                            
                            <div class="clear"></div>
                        </ul>
                    </dd>
                </dl>
            </div>
            <div class="clear"></div>
        </div>

    </div>
</template>
<script>
import CalendInfo from '../main-components/calend/calendrinfo.vue';
import FinishModel from '../main-components/model/finishModel.vue';
import ImgEditor from '../project/components/imgEditor.vue';
import VidEditor from '../project/components/vedioEditor.vue';
export default {
    data(){
        return{
            UserID:1,
            ProjectData:[],
            KeepData:[],
            AuditData:[],
            DispData:[],
            modelTask:false,
            BaseObj:{},
            childList:[],
            taskType:[],
            subpId:'',
            tType:'',
            imgConponent:false,
            vidConponent:false,
            NotType:false,
            AllowEdit:"Allow",//控制是否允许标注 Allow允许，NotAllow不允许，Other不显示下面的容器和不允许标注
        }
    },
    components:{CalendInfo,FinishModel,ImgEditor,VidEditor},
    filters:{
        FilteTime(val){
            let TiemVal=val;
            if(TiemVal<0){
                return "延期"+Math.abs(TiemVal)+"天";
            }else if(TiemVal==0){
                return "今天完成";
            }else if(TiemVal>0){
                return "还剩"+TiemVal+"天";
            }
        }
       
    },
    mounted(){
        this.AutoHeight();
        this.getData();
    },
    methods:{
        // 跳转到概况页
        homepage(){
            this.$router.push('/project/home.vue')
        },
        // 文件详情
        taskDetaInfo(id,type,file,TaskID){
            let _this=this;
            let url=_this.GLOBAL.baseRouter+'task/task/info&id='+id;
             _this.modelTask=true;

            // 本地缓存信息
            sessionStorage.TaskID=TaskID;
            sessionStorage.FileURl=file;

            // 是否显示编辑信息
            sessionStorage.AllowEdit=_this.AllowEdit;

            // 判断是什么类型，显示什么组件
            if(type=='image'){
            _this.imgConponent=true;
            _this.vidConponent=false;
            _this.NotType=false;
            }else if(type=='video'){
            _this.vidConponent=true;
            _this.imgConponent=false;
            _this.NotType=false;
            }else if(type=='NotType'|| type=='other'){
            _this.vidConponent=false;
            _this.imgConponent=false;
            _this.NotType=true;
            }
            //获取信息
            _this.$axios.get(url).then((val)=>{
                let TaskDeta=val.data
                _this.BaseObj.id=TaskDeta.id;
                _this.BaseObj.name=TaskDeta.name;
                _this.BaseObj.start_date=TaskDeta.expect_start_date;
                _this.BaseObj.end_date=TaskDeta.expect_end_date;
                _this.childList.push({"project_child_name":TaskDeta.project_child_name});
                _this.taskType.push({"tasktype_name":TaskDeta.tasktype_name});
                _this.subpId=TaskDeta.project_child_name;
                _this.tType=TaskDeta.tasktype_name;       
            },()=>{
                _this.$Message.error('请求失败！')
            })
        },
        CloseModel(){
            this.modelTask=false;
        },
        // 初始化高
        AutoHeight(){
            $(".contentRow dd").height($(window).height()-475);
        },
        // 项目数据
        getData(){
            let _this=this;
            let myProject=_this.$axios.get(_this.GLOBAL.baseRouter+'task/total/total-by-my-project&user_id='+_this.UserID) //我负责的项目
            let emphKeep=_this.$axios.get(_this.GLOBAL.baseRouter+'task/total/total-by-important&user_id='+_this.UserID) //重点关注
            let awaiaudit=_this.$axios.get(_this.GLOBAL.baseRouter+'task/total/need-review-task-file&user_id='+_this.UserID) //需要审核
            let fbackdisp=_this.$axios.get(_this.GLOBAL.baseRouter+'task/total/wait-action-task-file&user_id='+_this.UserID) //反馈待处理
            _this.$axios.all([myProject,emphKeep,awaiaudit,fbackdisp]).then(([Mymsg,Keepmsg,Auditmsg,Dispmsg])=>{
                
                // 我负责的项目
                let MsgData=Mymsg.data;
                if(MsgData.err_code==0){
                    _this.ProjectData=MsgData.data;
                }

                // 重点关注
                let KeepData=Keepmsg.data;
                if(KeepData.err_code==0){
                    KeepData.data.forEach(function(element) {
                            if(JSON.stringify(element.stage_file) == "{}"){
                                element.stage_file.id=null;
                                element.stage_file.type='NotType',
                                element.stage_file.file=null,
                                element.stage_file.task_id=null
                            }
                             _this.KeepData.push(element);
                    }, this);
                }

                //需要审核
                let AuditData=Auditmsg.data;
                if(AuditData.err_code==0){
                     AuditData.data.forEach(function(element) {
                            if(JSON.stringify(element.stage_file) == "{}"){
                                element.stage_file.id=null;
                                element.stage_file.type='NotType',
                                element.stage_file.file=null,
                                element.stage_file.task_id=null
                            }
                             _this.AuditData.push(element);
                    }, this);
                }
                
                //反馈待处理
                let DispData=Dispmsg.data;
                if(DispData.err_code==0){
                    DispData.data.forEach(function(element) {
                            if(JSON.stringify(element.stage_file) == "{}"){
                                element.stage_file.id=null;
                                element.stage_file.type='NotType',
                                element.stage_file.file=null,
                                element.stage_file.task_id=null
                            }
                             _this.DispData.push(element);
                    }, this);
                }
            },()=>{
                _this.$Message.error('请求失败！')
            })
        }
    }
}
</script>
<style lang="less">
@import '../../styles/ProjectWork.less';
</style>
