<template>
  <div>
      <div class="tabHeader">
          <Tabs>
              <Tab-pane label="我的工作">
                  <div class="imProject">
                      <!--右侧Row-->
                      <div class="imPRight">
                          <div class="personInfo">
                              <div class="infoRow">
                                  <img src="https://i.loli.net/2017/08/21/599a521472424.jpg">
                                  李小小 <s>原画</s><br/>
                                  <span>原画</span><span>次世代</span><span>中国风原画</span><br/>
                                  任职：四川营火虫游戏美术有限公司
                          </div>
                              <div class="weiInfo">
                        <span>
                            29<br />
                            已关注
                        </span>
                                  <span>
                            1921<br />
                            粉丝
                        </span>
                                  <span>
                            13<br/>
                            文章
                        </span>
                                  <div class="clear"></div>
                              </div>
                              <div class="projectInfo">
                                  <dl>
                                      <dt>项目经历</dt>
                                      <dd>
                                          <p><span>天下3</span><em>2014.5 ~ 2015-6</em></p>
                                          <p><span>无双战意</span><em>2014.5 ~ 2015-6</em></p>
                                      </dd>
                                      <dt>我的社交</dt>
                                      <dd>
                                          <a href="#" class="addWei">+<br/>增加</a>
                                      </dd>
                                  </dl>
                              </div>
                          </div>
                          <CalendInfo></CalendInfo>
                      </div>
                      <!--左侧Row-->
                      <div class="imPLeft">
                          <!--任务清单-->
                          <div class="imTaskList">
                              <dl>
                                  <dt><Icon type="ios-paper-outline"></Icon> 我的任务清单</dt>
                                  <dd>
                                      <div class="beInOper">
                                          <h3>实施中({{dataUnderway.length}})</h3>
                                          <ul>
                                              <li v-for="(item,index) in dataUnderway" @mouseenter="ShowEm($event)"  @mouseleave="HideEm($event)"
                                              @click="taskDetaInfo( item.id,
                                                  item.stage_file.type,
                                                  item.stage_file.file,
                                                  item.id,item)" :key="index">
                                                  <span>
                                                      <s>{{item.name}}</s>
                                                      <br/><i class="projectRow">{{item.project_name | DefName }}</i>
                                                      <i><Icon type="clock"></Icon><i :class="[item.expect_end_time<=Mdate?'itody':'beInI']">{{item.expect_end_time | endTiem}}</i></i>
                                                  </span>
                                                  <em class="ShowEm" >
                                                      <em class="ShowUpLoad">
                                                          <Button @click.stop="ShowModel(item.name,item.id,item.progress,item.stage,item.tasktype_id)" class="upload"><Icon type="ios-cloud-upload-outline" size="24"></Icon> 上传文件</Button>
                                                      </em>
                                                      <u><b>{{item.progress}}</b> / {{item.stage | stageArr }}<br/>{{item.stage[item.progress==0?item.progress:item.progress-1].stage_name}}</u>
                                                  </em>
                                                  <div class="clear"></div>
                                              </li>
                                          </ul>
                                          <!-- 文件上传 -->
                                          <Modal v-model="modal"  @on-ok="ok"  width="800">
                                              <UploadM></UploadM>
                                          </Modal>
                                          <!-- 文件上传结束 -->
                                          <!-- 任务详情 -->
                                          <Modal 
                                                v-model="isTabModal"
                                                width="1200" 
                                                :styles="{top: '100px'}"
                                                :closable="false"
                                                okText= '保存'
                                                cancelText='取消'
                                                @on-cancel="closeTabmodal"
                                                >
                                                <browsetask ref="browsetask" style="min-height:570px;"></browsetask>
                                                <div slot="footer">
                                                </div>
                                          </Modal>
                                          <!-- 任务详情结束 -->
                                      </div>
                                      <div class="theUpcom">
                                          <h3>即将实施({{dataWait.length}})</h3>
                                          <ul>
                                              <li v-for="(item,index) in dataWait"  @click="taskDetaInfo( item.id,
                                                  item.stage_file.type,
                                                  item.stage_file.file,
                                                  item.id,item)" :key="index">
                                                  <span><s>{{item.name}}</s><br/>
                                                    <p v-if="item.expect_start_time<=Mdate?false:true">{{item.project_name}}</p>
                                                    <p v-if="item.expect_start_time<=Mdate?true:false">
                                                        <Button type="success" size="small" @click.stop="instance(item.id)">确认任务开始</Button>
                                                    </p>
                                                  </span>
                                                  <em><Icon type="clock"></Icon><i :class="[item.expect_start_time<=Mdate?'itody':'beInI']">{{item.expect_start_time | startTiem}}</i></em>
                                                  <div class="clear"></div>
                                              </li>
                                          </ul>

                                      </div>
                                      <div class="Completed">
                                          <h3>已完成({{dataAccom.length}})</h3>
                                          <ul id="CompletedUL">
                                              <li v-for="(item,index) in dataAccom" :key="index"  
                                              @click="taskDetaInfo( item.id,
                                                  item.stage_file.type,
                                                  item.stage_file.file,
                                                  item.id,item)">
                                                  <span class="spanTop"><Icon type="android-checkbox" color="mediumseagreen" size="18"></Icon></span>
                                                  <span>{{item.name}}</span>
                                                  <em>{{item.end_date}}</em>
                                                  <div class="clear"></div>
                                              </li>
                                          </ul>
                                      </div>
                                      <div class="clear"></div>
                                  </dd>
                              </dl>
                          </div>
                          <!--反馈Row-->
                          <div class="feedBack">
                              <!--待反馈-->
                              <div class="stayFeedBack">
                                  <dl>
                                      <dt><Icon type="social-buffer-outline"></Icon> 待反馈({{AuditData.length}})</dt>
                                      <dd>
                                          <GeminiScrollbar>
                                            <Timeline>
                                                <div v-if="AuditData==''" class="notData">暂无数据</div>
                                                <Timeline-item color='lightgray' v-for="(Litem,index) in AuditData" :key="index">
                                                    <Icon type="record" slot="dot"></Icon>
                                                    <span><em>{{Litem.upload_day==0?'今天上传':Math.abs(Litem.upload_day)+' 前上传'}}</em></span>
                                                    <span>{{Litem.name}}</span>
                                                    <span><em>{{Litem.run_uname}}</em> 审核</span>
                                                    <span @click="taskDetaInfo(
                                                    Litem.stage_file.stage_id,
                                                    Litem.stage_file.type,
                                                    Litem.stage_file.file,
                                                    Litem.stage_file.task_id,item
                                                    )">查看</span>
                                                </Timeline-item>
                                            </Timeline>
                                          </GeminiScrollbar>
                                      </dd>
                                  </dl>
                              </div>
                              <!--已反馈-->
                              <div class="alrFeedBack">
                                  <dl>
                                      <dt><Icon type="social-buffer"></Icon> 已反馈({{DispData.length}})</dt>
                                      <dd>
                                          <Timeline>
                                              <div v-if="DispData==''" class="notData">暂无数据</div>
                                              <Timeline-item color="lightgray" v-for="(Aitem,index) in DispData" :key="index">
                                             <!-- <Timeline-item :color="[Aitem.stage_id==AlrFeedBack[0].stage_id?'darkorange':'lightgray']" v-for="Aitem in AlrFeedBack"> -->
                                                  <Icon type="record" slot="dot"></Icon>
                                                  <span><em>{{Aitem.upload_day==0?'今天上传':Math.abs(Aitem.upload_day)+' 前上传'}}</em></span>
                                                  <span>{{Aitem.name}}</span>
                                                  <span><s>2处修改</s></span>
                                                  <span><Icon type="chatbox-working"></Icon> 12</span>
                                                  <span @click="taskDetaInfo(
                                                  Aitem.stage_file.stage_id,
                                                  Aitem.stage_file.type,
                                                  Aitem.stage_file.file,
                                                  Aitem.stage_file.task_id,item
                                                  )">查看</span>
                                              </Timeline-item>
                                          </Timeline>
                                      </dd>
                                  </dl>
                              </div>
                              <div class="clear"></div>
                          </div>

                      </div>
                      <div class="clear"></div>
                  </div>
              </Tab-pane>
              <Tab-pane label="日程按排">
                    <!--<Calend></Calend>-->
              </Tab-pane>
          </Tabs>
      </div>
  </div>
</template>

<script>
  var qs = require('querystring')
  import {mapMutations} from 'vuex'
  import Calend from '../main-components/calend/calend.vue';
  import UploadM from './imPlementer/UpLoadModal.vue';
  import browsetask from '../project/task/browseTaskPop.vue'
  import CalendInfo from '../main-components/calend/calendrinfo.vue';
  export default {
    data(){
      return{
        iflag:false,
        dataFeedBack:[],
        dataUnderway:[],
        dataWait:[],
        dataAccom:[],
        modal: false,
        isTabModal:false,
        value:'',
        projectNmae:true,
        Mdate:Math.round(new Date().getTime()/1000),
        MainFlie:[],
        MinFile:[],
        Current:0,
        TaksID:0,
        AddMinFile:[],
        //AllowEdit:"Allow", //控制是否允许标注 Allow允许，NotAllow不允许，Other不显示下面的容器和不允许标注
        pageIndex:1,
        maxPage:0,
        accomMore:true,
        ile:null,
        UpLoadValue:'',
        userID:sessionStorage.userId,
        AuditData:[],
        DispData:[]
      }
    },
    components:{Calend,UploadM,CalendInfo,browsetask},
    
    mounted(){
      this.onLoad();
      this.get();
      this.taskGet();
      this.awaitTaskGet();
      this.taskAccom();
      this.InfoRefresh();
    //   接收主文件
      this.$bus.on('MainFile',(val)=>{
            this.MainFlie=val
      });
    //   接收阶段
      this.$bus.on('UpCurrent',(val)=>{
            this.Current=val;
      });
    //   接收附文件
      this.$bus.on('MinFile',(val)=>{
          this.MinFile=val;
      });
    //   接收task_id
      this.$bus.on('TaksID',(val)=>{
          this.TaksID=val
      });
    //   接收备注
    this.$bus.on("UpValue",(val)=>{
        this.UpLoadValue=val
    })
    //   任务完成滚动条加载i
      this.ScrollLoad();
    },
    filters:{
      startTiem(value){
          let tTime=value;
          let tTimeSt = new Date(tTime* 1000);
          let ndtody=new Date();
          let TimeD=(parseInt((ndtody-tTimeSt)/1000/60/60))/24
          
          if(TimeD<0){
             return value= Math.abs(Math.floor(TimeD)) +"天后实施";
          }else if(TimeD<=1){
             return value="今天开始"
          }else if(TimeD>1){
              return value ="延期 "+Math.abs(Math.round(TimeD)) +"天";
          }
      },
      endTiem(value){
          let nTiem=value;
          let nTimeSt = new Date(nTiem* 1000);
          let ndtody=new Date();
          let TimeD=(parseInt((ndtody-nTimeSt)/1000/60/60))/24;
          if(TimeD>1){
              return value="延期 "+Math.ceil(TimeD)+" 天"
          }else if(TimeD>0 && TimeD<1){
              return value="今天完成"
          }else{
              return value=Math.ceil(Math.abs(TimeD))+"天后结束"
          }
      },
      stageArr(value){
          let stageArr=value;
          if(stageArr.constructor === Array){
              return value=stageArr.length
          }else{
              return value="--"
          }
      },
      DefName(value){
          if(value==undefined){
              return '---'
          }else{
              return value
          }
      }
    },
    methods:{
        ...mapMutations(['setPrimaryMission','setDetailAll','setUserStatus']),
        //关闭窗口
        InfoRefresh(){
            this.$bus.on('InfoRefresh',()=>{
                 this.isTabModal=false;
            })
        },
        //  加载更多
        loadAdd(){
            let PagIndex=this.pageIndex;
            if(PagIndex<this.maxPage){
                this.pageIndex+=1;
                this.taskAccom()
                setTimeout(()=>{
                    if(this.pageIndex==this.maxPage){
                    this.accomMore=false;
                    }
                },1000)
            }else{
                return
            }
        },
        
        ScrollLoad(){
            let _this=this
            let scr=document.getElementById("CompletedUL");
            scr.onscroll=function(){
                let scrollT = scr.scrollTop;
                let scrollH = scr.scrollHeight;
                let clientH = scr.clientHeight;
                if(scrollT == scrollH - clientH){
                    _this.loadAdd();
                }
            }
        },
  
    //  打开任务详情
    taskDetaInfo(id,type,file,TaskID,item){

       /* let _this=this;
        _this.isTabModal=true;
        this.$refs.browsetask.initBrowseTaskPop(TaskID,type);//根据ID和类型初始化弹窗
        this.$refs.browsetask.setEditDisabled(true);//设置弹窗能否编辑*/
        // 本地缓存信息

//         sessionStorage.TaskID=TaskID;
//         sessionStorage.FileURl=file;

        this.$store.commit('changeComponentTaskID',TaskID);
        this.$store.commit('changeComponentFileURl',file);

        // 是否显示编辑信息
        //sessionStorage.AllowEdit=_this.AllowEdit;
        this.setPrimaryMission(item);
        this.setDetailAll(item);

        this.setUserStatus('member')
        this.$router.push({path:'/project/details'});
    },
    //   关闭Model
    closeTabmodal(){
        this.isTabModal=false;
        this.$bus.emit('closeModel');
    },
    //   初始化行高  
      onLoad(){
        $(()=>{
          $(".beInOper ul,.theUpcom ul,.Completed ul").css("height",407);
        })
      },
    //   反馈和待反馈数据请求
      get(){
        let _this=this;
        // let url=this.GLOBAL.baseRouter+'task/task/stage-page&is_my=1';
        let awaiaudit=_this.$axios.get(_this.GLOBAL.baseRouter+'task/total/need-review-task-file&people_type=1') //需要审核
        let fbackdisp=_this.$axios.get(_this.GLOBAL.baseRouter+'task/total/wait-action-task-file&people_type=1') //反馈待处理
        _this.$axios.all([awaiaudit,fbackdisp]).then(([Auditmsg,Dispmsg])=>{
            if(Auditmsg.data.err_code==0){
                _this.AuditData=Auditmsg.data.data;
                _this.DispData=Dispmsg.data.data;
            }

            // let MsData=data.data.data;
            // _this.dataFeedBack=[]
            // MsData.forEach((element)=>{
            //     if(JSON.stringify(element.stage_file) == "{}"){
            //         element.stage_file.id=null;
            //         element.stage_file.type='NotType',
            //         element.stage_file.file=null,
            //         element.stage_file.task_id=null
            //     }
            //     _this.dataFeedBack.push(element);
            // })
             
        },()=>{
            _this.$Message.error('请求失败')
        })
      },

    //   正在实施数据请求
      taskGet(){
          let _this=this;
          let url=this.GLOBAL.baseRouter+'task/task/page&run_uid='+_this.userID;
          _this.$axios.get(url).then((msg)=>{
              console.log(7878,msg)
            // 获取总页数
              _this.maxPage=msg.data.page.count_page;
            // 获取数据
              _this.dataUnderway=[];
              let MsgData=msg.data.data;
              MsgData.forEach(function(element) {
                
                  if(element.status==2){
                      //正在进行中数据
                      if(JSON.stringify(element.stage_file) == "{}"){
                          element.stage_file.id=null;
                          element.stage_file.type='NotType',
                          element.stage_file.file=null,
                          element.stage_file.task_id=null
                      }
                      _this.dataUnderway.push(element);
                  }
              }, this);
            _this.dataUnderway.sort((a,b)=>a.expect_end_time-b.expect_end_time);
          },()=>{
              alert("请求失败!")
          })
      },

    //   等待开始任务
      awaitTaskGet(){
          let _this=this;
          let url=this.GLOBAL.baseRouter+'task/task/page&run_uid='+_this.userID;
          _this.$axios.get(url).then((msg)=>{
            // 获取数据
              _this.dataWait=[];
              let MsgData=msg.data.data;
              MsgData.forEach(function(element) {
                  if(element.status==1){
                      //待开始数据
                      _this.dataWait.push(element);
                  }
              }, this);
            _this.dataWait.sort((a,b)=>a.expect_start_time-b.expect_start_time)
          },()=>{
              alert("请求失败!")
          })
      },
    //   已完成数据请求
      taskAccom(){
          let _this=this;
          let url=this.GLOBAL.baseRouter+'task/task/page&page='+_this.pageIndex;
          let params={};
          _this.$axios.get(url,params).then((msg)=>{
               let MsgData=msg.data.data;
               _this.dataAccom=[];
                MsgData.forEach(function(element) {
                 if(element.status==4){
                      //已完成数据
                      _this.dataAccom.push(element);
                  }
              }, this);
              _this.dataAccom.sort((a,b)=>Date.parse(b.end_date)-Date.parse(a.end_date))
          })
      },
    //   任务开始
      instance(Tid){
          let _this=this;
          _this.$Modal.confirm({
                    title: '任务开始',
                    content: '<p>确认开始任务？</p>',
                    onOk: () => {
                        let url=_this.GLOBAL.baseRouter+'task/task/start';
                        _this.$axios.post(url,qs.stringify({id:Tid})).then(msg=>{
                            _this.$Message.info('开始成功');
                            _this.dataUnderway=[];
                            _this.dataWait=[];
                            _this.taskGet();
                            _this.awaitTaskGet();
                        },()=>{
                             _this.$Message.error('开始失败');
                        })
                    }
         });
      },
    //   上传按钮
      ShowEm(event){
         let el = event.currentTarget.children[1].children[0];
         let el2 = event.currentTarget.children[1].children[1];
         el.style.display='block';
         el2.style.display='none';
      },
      HideEm(event){
        let el = event.currentTarget.children[1].children[0];
        let el2 = event.currentTarget.children[1].children[1];
        el.style=''
        el2.style=''
      },
    //   上传窗口
      ShowModel(name,id,progress,stage,taskTypeID){
          let obj={
              name:name,
              id:id,
              progress:Number(progress),
              stage:stage,
          }
          this.$bus.emit('EMname',obj);
          this.$bus.emit('taskTypeID',{taskTypeID:taskTypeID})
          this.modal=true;
      },

    //   阶段上传
      ok(){
            let _this=this;
            let MainData=_this.MainFlie;
            let MinData=_this.MinFile;
            // console.log(MinData)
            if(MainData.length>0){
                //MainFile
                let MFid=MainData[0].response.file.fid;
                let MUrl=MainData[0].response.file.url;
                let Mtype=MainData[0].response.file.category;
                let Mthumb=MUrl;
                let MIsMain=1;
                let TaksID=_this.TaksID;
                let Current=_this.Current;
                let Mainobj=[{
                        fid:MFid,
                        file:MUrl,
                        type:Mtype,
                        thumb:MUrl,
                        is_main:MIsMain
                }];
                //MinFile
                MinData.forEach((val)=>{
                     _this.AddMinFile.push(val.response.file)
                })
                _this.AddMinFile.forEach((val)=>{
                    Mainobj.push({
                        fid:val.fid,
                        file:val.url,
                        type:val.category,
                        thumb:val.url,
                        is_main:0
                    })
                })
                // console.log(Mainobj)
                let url=_this.GLOBAL.baseRouter+'task/task/stage-upload';
                
                let Mparams={
                    task_id:TaksID,
                    stage:Current+1,
                    describe:_this.UpLoadValue,
                    file:JSON.stringify(Mainobj)
                };
                _this.$axios.post(url,qs.stringify(Mparams)).then(function(data){
                let CodeData=data.data;
                if(CodeData.err_code==0){
                        _this.taskGet();
                        _this.get();
                        _this.$Message.info('提交成功');
                        _this.MainFlie=[];
                        _this.MinFile=[];
                        _this.AddMinFile=[];
                        _this.$bus.emit("RemoveFile");
                }
                },()=>{
                    _this.$Message.error('提交失败')
                })
        }else{
           this.$Message.error('主图为空') 
        }    
      },
      
    }
}
</script>

<style lang="less">
    @import '../../styles/workbench.less';
</style>
