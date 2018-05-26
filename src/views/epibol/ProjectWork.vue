<template>
    <div>
         <Tabs active-key="key1">
            <Tab-pane label="我的工作" key="key1">
                
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
                                    <Col span="12" v-for="(item,index) in ProjectData" :key="index">
                                        <div class="proChart">
                                            <Row>
                                                <Col span="8">
                                                    <div class="circle">
                                                        <div style="display:block"><span class="title">{{item.last_day}}</span></div>
                                                        <i-circle :percent="Number(item.rate_task)" :size="100" stroke-color="#00cc00"  @click.native="homepage(item.id)">
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
                                                            <Progress :percent="item.time_progress|progressLine">
                                                                <span>{{item.time_progress>101?item.last_day:Math.round(item.time_progress)|progresTime}}</span>
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
                <Modal 
                    v-model="isTabModal" 
                    width="1200" 
                    :styles="{top: '100px'}"
                    :closable="false"
                    okText= '保存'
                    cancelText='取消'
                    @on-cancel="closeTabmodal"
                    >
                    <browsetask ref="browsetask" 
                                >
                    </browsetask>
                    <div slot="footer">
                    </div>
                </Modal>
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
                                                <i :class="[item.surplus_time>1?'ishow':'']">{{item.surplus_time | FilteTime}}</i><br/><u>结束</u>
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
                                        item.task_id,
                                        item.stage_file.type,
                                        item.stage_file.file,
                                        item.stage_file.task_id
                                        )">
                                        <span>
                                            <img :src="item.thumb"/>{{item.name}}<br/><u>{{item.project_name}}</u>
                                        </span>
                                        <span>
                                            {{item.upload_day==0?"今天":(Math.abs(item.upload_day)+"天前")}} <br/><u>上传</u>
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
                                        <span class="tip">{{item.upload_day==0?"今天":(Math.abs(item.upload_day)+" 天前")}}</span>
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

            </Tab-pane>
            <!-- 分割线 -->
            <Tab-pane label="日程按排" key="key2">日程按排</Tab-pane>
        </Tabs>
        
    </div>
</template>
<script>
import CalendInfo from '../main-components/calend/calendrinfo.vue';
import browsetask from '../project/task/browseTaskPop.vue'

export default {
    data(){
        return{
            isTabModal: false,
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
            AllowEdit:"Allow",//控制是否允许标注 Allow允许，NotAllow不允许，Other不显示下面的容器和不允许标注
        }
    },
    components:{CalendInfo,browsetask},
    filters:{
        progresTime(val){
           if(val<0){
               return 0+"%"
           }else if(val<=100){
               return val+"%"
           }else{
               return val
           }
        },
        progressLine(val){
            if(val>101){
                return 101
            }else if(val<0){
                return 0
            }else{
                return val
            }
        },
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
        this.UserID=sessionStorage.userId;
        this.AutoHeight();
        this.getData();
    },
    methods:{
        // 跳转到概况页
        homepage(id){
            sessionStorage.projectID=id;
            this.$router.push('/project/home');
        },
        // 文件详情
        taskDetaInfo(id,type,file,TaskID){
            let _this=this;
             _this.isTabModal=true
            this.$refs.browsetask.initBrowseTaskPop(TaskID,type);//根据ID和类型初始化弹窗
            this.$refs.browsetask.setEditDisabled(true);//设置弹窗能否编辑

            // 本地缓存信息
            sessionStorage.TaskID=TaskID;
            sessionStorage.FileURl=file;

            // 是否显示编辑信息
            sessionStorage.AllowEdit=_this.AllowEdit;
        },
        closeTabmodal(){
            this.isTabModal=false;
        },
        // 初始化高
        AutoHeight(){
            $(".contentRow dd").height($(window).height()-525);
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
