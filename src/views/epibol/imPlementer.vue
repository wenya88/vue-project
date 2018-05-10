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
                          <div class="jobCalend">
                              <dl>
                                  <dt><Icon type="calendar"></Icon> 工作日程</dt>
                                  <dd>
                                      <p><span>假</span><em>春节 2018-1-15 至 2018-2-1</em></p>
                                  </dd>
                              </dl>
                          </div>
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
                                              <li v-for="item in dataUnderway" @mouseenter="ShowEm($event)"  @mouseleave="HideEm($event)" 
                                              @click="taskDetaInfo(
                                                  item.id,
                                                  item.stage_file.type,
                                                  item.stage_file.file,
                                                  item.stage_file.task_id
                                                  )">
                                                  <span>
                                                      <s>{{item.name}}</s>
                                                      <br/><i class="projectRow">{{item.project_name | DefName }}</i>
                                                      <i><Icon type="clock"></Icon><i :class="[item.expect_end_time<=Mdate?'itody':'beInI']">{{item.expect_end_time | endTiem}}</i></i>
                                                  </span>
                                                  <em class="ShowEm" >
                                                      <em class="ShowUpLoad">
                                                          <Button @click.stop="ShowModel(item.name,item.id,item.progress,item.stage)" class="upload"><Icon type="upload" size="24"></Icon> 上传文件</Button>
                                                      </em>
                                                      <b>{{item.progress}}</b> / {{item.stage | stageArr }}<br/>{{item.stage[item.progress].stage_name|DefName}}
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
                                          <FinishModel 
                                            v-if="modelTask" 
                                            :editData="BaseObj" 
                                            @close="CloseModel"
                                            :isDisabled="true"
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
                                                    <div v-if="startStage"><button type="primary">开始任务</button></div>
                                                    <div v-if="NotType" class="notIMG">暂未上传任务文件</div>
                                                </div>
                                          </FinishModel>
                                          <!-- 任务详情结束 -->
                                      </div>
                                  
                                      <div class="theUpcom">
                                          <h3>即将实施({{dataWait.length}})</h3>
                                          <ul>
                                              <li v-for="item in dataWait"  @click="taskDetaInfo(item.id)">
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
                                          <ul>
                                              <li v-for="item in dataAccom"  @click="taskDetaInfo(item.id,item.stage_file.type,item.stage_file.file,item.stage_file.task_id)">
                                                  <span class="spanTop"><Icon type="android-checkbox" color="mediumseagreen" size="18"></Icon></span>
                                                  <span>{{item.name}}</span>
                                                  <em>{{item.end_date}}</em>
                                                  <div class="clear"></div>
                                              </li>
                                              <button @click="loadAdd" v-show="accomMore">加载更多</button>
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
                                      <dt><Icon type="social-buffer-outline"></Icon> 待反馈({{ListFeedBack.length}})</dt>
                                      <dd>
                                          <Timeline>
                                              <div v-if="ListFeedBack==''" class="notData">暂无数据</div>
                                              <!-- <Timeline-item :color="[Litem.stage_id==ListFeedBack[0].stage_id?'darkorange':'lightgray']" v-for="Litem in ListFeedBack"> -->
                                              <Timeline-item color='lightgray' v-for="Litem in ListFeedBack">
                                                  <Icon type="record" slot="dot"></Icon>
                                                  <span><em>{{Litem.inside_audit_time|fromatDate}}</em> 上传</span>
                                                  <span>{{Litem.task_name}}</span>
                                                  <span><em>{{Litem.run_uname}}</em> 审核</span>
                                                  <span @click="taskDetaInfo(
                                                  Litem.task_id,
                                                  Litem.stage_file.type,
                                                  Litem.stage_file.file,
                                                  Litem.stage_file.task_id
                                                  )"><a href="javascript:;">查看</a></span>
                                              </Timeline-item>
                                              
                                          </Timeline>
                                      </dd>
                                  </dl>
                              </div>
                              <!--已反馈-->
                              <div class="alrFeedBack">
                                  <dl>
                                      <dt><Icon type="social-buffer"></Icon> 已反馈({{AlrFeedBack.length}})</dt>
                                      <dd>
                                          <Timeline>
                                              <div v-if="AlrFeedBack==''" class="notData">暂无数据</div>
                                              <Timeline-item color="lightgray" v-for="Aitem in AlrFeedBack">
                                             <!-- <Timeline-item :color="[Aitem.stage_id==AlrFeedBack[0].stage_id?'darkorange':'lightgray']" v-for="Aitem in AlrFeedBack"> -->
                                                  <Icon type="record" slot="dot"></Icon>
                                                  <span><em>{{Aitem.client_audit_time|fromatDate}}</em> 上传</span>
                                                  <span>{{Aitem.task_name}}</span>
                                                  <span><s>{{Aitem.tag_count}}处修改</s></span>
                                                  <span><Icon type="chatbox-working"></Icon> {{Aitem.feedback}}</span>
                                                  <span @click="taskDetaInfo(
                                                  Aitem.task_id,
                                                  Aitem.stage_file.type,
                                                  Aitem.stage_file.file,
                                                  Aitem.stage_file.task_id
                                                  )"><a href="javascript:;">查看</a></span>
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
  import Calend from '../main-components/calend/calend.vue';
  import UploadM from './imPlementer/UpLoadModal.vue';
  import FinishModel from '../main-components/model/finishModel.vue';
  import ImgEditor from '../project/components/imgEditor.vue';
  import VidEditor from '../project/components/vedioEditor.vue'
  export default {
    data(){
      return{
        iflag:false,
        // MsgData:[],
        dataFeedBack:[],
        dataUnderway:[],
        dataWait:[],
        dataAccom:[],
        modal: false,
        modelTask:false,
        value:'',
        projectNmae:true,
        Mdate:Math.round(new Date().getTime()/1000),
        MainFlie:[],
        MinFile:[],
        Current:0,
        TaksID:0,
        AddMinFile:[],
        BaseObj:{},
        subpId:'',
        tType:'',
        childList:[],
        taskType:[],
        imgConponent:false,
        vidConponent:false,
        AllowEdit:false,
        pageIndex:1,
        maxPage:0,
        accomMore:true,
        startStage:false,
        StageDefType:null,
        ile:null,
        StageDefTaskID:null,
        NotType:false
      }
    },
    components:{Calend,UploadM,FinishModel,ImgEditor,VidEditor},
    
    mounted(){
      this.onLoad();
      this.get();
      this.taskGet();
      this.taskAccom();
    //   接收主文件
      this.$bus.on('MainFile',(val)=>{
            this.MainFlie=val
      });
    //   接收阶段
      this.$bus.on('UpCurrent',(val)=>{
            this.Current=val
      });
    //   接收附文件
      this.$bus.on('MinFile',(val)=>{
          this.MinFile=val;
      });
    //   接收task_id
      this.$bus.on('TaksID',(val)=>{
          this.TaksID=val
      });
    },
    filters:{
      fromatDate(value){
        let unTime=value;
        let nuTimeSt = new Date(unTime* 1000);
        let ndtody=new Date();
        let TimeD=parseInt((ndtody-nuTimeSt)/1000/60/60)

        if(TimeD<=24){
          return value=TimeD+"小时前";
        }else if(TimeD<=48){
          return value="1天前";
        }else if(TimeD<=96){
          return value="2天前";
        }else{
          return value="几天前";
        }
      },
      startTiem(value){
          let tTime=value;
          let tTimeSt = new Date(tTime* 1000);
          let ndtody=new Date();
          let TimeD=(parseInt((ndtody-tTimeSt)/1000/60/60))/24
          
          if(TimeD<0){
             return value= Math.abs(Math.ceil(TimeD)) +"天后实施";
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
    computed:{
        ListFeedBack(){
          return this.dataFeedBack.filter((item)=>{
            return item.status==1||item.status==2
          })
        },
        AlrFeedBack(){
          return this.dataFeedBack.filter((Aitem)=>{
            return Aitem.status==3||Aitem.status==4
          })
        }
    },
    methods:{
        //加载更多
        loadAdd(){
            if(this.pageIndex<this.maxPage){
                this.pageIndex+=1;
                console.log(this.pageIndex)
                this.taskAccom()
                setTimeout(()=>{
                    if(this.pageIndex==this.maxPage){
                    this.accomMore=false;
                    }
                },1000)
            }
        },
    //  打开任务详情
    taskDetaInfo(id,type,file,TaskID){
        let _this=this;
        _this.modelTask=true;
        
        let url='/task/task/info&id='+id;
        // 本地缓存信息
        sessionStorage.TaskID=TaskID;
        sessionStorage.FileURl=file;

        // 是否显示编辑信息
        sessionStorage.AllowEdit=_this.AllowEdit;

        // 判断是什么类型，显示什么组件
        if(type=='image'){
          _this.imgConponent=true;
          _this.vidConponent=false;
          _this.startStage=false;
          _this.NotType=false;
        }else if(type=='video'){
          _this.vidConponent=true;
          _this.imgConponent=false;
          _this.startStage=false;
          _this.NotType=false;
        }else if(type==undefined){
          _this.vidConponent=false;
          _this.imgConponent=false;
          _this.startStage=true;
          _this.NotType=false;
        }else if(type=='NotType'){
         _this.vidConponent=false;
         _this.imgConponent=false;
         _this.startStage=false;
         _this.NotType=true;
        }
        _this.$axios.get(url).then((val)=>{
            let TaskDeta=val.data
            _this.BaseObj.id=TaskDeta.id;
            _this.BaseObj.name=TaskDeta.name;
            _this.BaseObj.start_date=TaskDeta.start_date;
            _this.BaseObj.end_date=TaskDeta.end_date;
            _this.childList.push({"project_child_name":TaskDeta.project_child_name});
            _this.taskType.push({"tasktype_name":TaskDeta.tasktype_name});
            _this.subpId=TaskDeta.project_child_name;
            _this.tType=TaskDeta.tasktype_name;       
        },()=>{
            alert("请求失败!!")
        })
    },
    //   关闭Model
    CloseModel(){
        this.modelTask=false;
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
        let url='/task/task/stage-page';
        _this.$axios.get(url).then((data)=>{
            let MsData=data.data.data;
            MsData.forEach((element)=>{
                if(JSON.stringify(element.stage_file) == "{}"){
                    element.stage_file.id=null;
                    element.stage_file.type='NotType',
                    element.stage_file.file=null,
                    element.stage_file.task_id=null
                }
                _this.dataFeedBack.push(element);
            })
             
        },()=>{
          alert("请求失败!")
        })
      },

    //   正在实施数据请求
      taskGet(){
          let _this=this;
          let url='/task/task/page&page='+_this.pageIndex;
          _this.$axios.get(url).then((msg)=>{
            // 获取总页数
              _this.maxPage=msg.data.page.count_page;
            // 获取数据
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
                  }else if(element.status==1){
                      //待开始数据
                      _this.dataWait.push(element);
                  }
              }, this);
            _this.dataUnderway.sort((a,b)=>a.expect_end_time-b.expect_end_time);
            _this.dataWait.sort((a,b)=>a.expect_start_time-b.expect_start_time)
          },()=>{
              alert("请求失败!")
          })
      },
    //   已完成数据请求
      taskAccom(){
          let _this=this;
          let url='/task/task/page&page='+_this.pageIndex;
          let params={};
          _this.$axios.get(url,params).then((msg)=>{
               let MsgData=msg.data.data;
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
      instance(id){
          this.$Modal.confirm({
                    title: '任务开始',
                    content: '<p>确认开始任务？</p>'+id,
                    onOk: () => {
                        this.$Message.info('开始成功');
                        this.dataUnderway=[];
                        this.dataWait=[];
                        this.taskGet();
                        this.taskWaitGet()
                    }
         });
      },
    //   上传按钮
      ShowEm(e){
         let el = event.currentTarget.children[1].children[0];
         el.style.display='block';
      },
      HideEm(e){
        let el = event.currentTarget.children[1].children[0];
        el.style=''
      },
    //   上传窗口
      ShowModel(name,id,progress,stage){
          let obj={
              name:name,
              id:id,
              progress:Number(progress),
              stage:stage
          }
          this.$bus.emit('EMname',obj);
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
                let url='/task/task/stage-upload';
                
                let Mparams={
                    task_id:TaksID,
                    stage:Current,
                    file:JSON.stringify(Mainobj)
                };
                _this.$axios.post(url,qs.stringify(Mparams)).then(function(data){
                let CodeData=data.data;
                console.log(CodeData)
                if(CodeData.err_code==0){
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
