<template>
  <div class="newImgEditor">
      <div class="imgEditorCom">
          <!-- 加载动画 -->
          <OnLoad id="onload"></OnLoad>
          <div class="imgFocus" id="signx">
                <img :src="url" class="ImgOnlod"/>
          </div>
          <!-- 工具条 -->
          <div class="toolBar">
              1
          </div>
          <!-- 标注提交 -->
          <div v-if="AllowEditRow" class="AllowEdit">
            <span class="EditInput">
                <input type="text" placeholder="请输入你要反馈的内容" id="EditInput" v-model="FeedbackValue" AUTOCOMPLETE="off">
            </span>
            <span class="EditSub">
                <button @click="commitEidt('edit')">需修改</button>
                <button @click="commitEidt('ok')">通过</button>
            </span>
          </div>
          <!-- 反馈信息 -->
          <div v-if="SataeInfo" class="feedbackInfo">
            <span><p>反馈状态</p><br/>{{StateFeedBack | filtStat}}</span>
            <span><p>时间</p><br/>{{insTime>cliTiem?insDate:cliDate}}</span>
            <span><p>审核人</p><br/></span>
            <div class="clear"></div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
  var qs = require('querystring');
  import OnLoad from './onLoad.vue';
  import {imgSign} from './imgEditorTwo/imgSign.js'
  export default {
    components:{
      OnLoad:OnLoad
    },
    data () {
      return {
        data:[],
        IMGdata:[],
        url:'',
        TID:80,
        TaskID:0,
        IMGlist:[],
        AllowEdit:String,
        AllowEditRow:false,
        SataeInfo:false,
        StateFeedBack:0,
        insTime:0,
        cliTiem:0,
        insDate:0,
        cliDate:0,
        liIndex:0,
        FeedbackValue:'',
        onload:true,
        fileID:0,
        stageID:0
      }
    },
    filters:{
      filtStat(val){
            if(val==1){
              return '内部待审'
            }else if(val==2){
              return '客户待审'
            }else if(val==3){
              return '内部已反馈'
            }else if(val==4){
              return '客户已反馈'
            }else if(val==5){
              return '审核通过'
            }else{
              return '--'
            }
      }
    },
    mounted(){
      this.initImgEditor();
      this.loadWH();
    },
    computed:{
      storeTaskID(){
        return this.$store.state.ImgVedioStatus.TaskID
      },
      storeFileURl(){
        return this.$store.state.ImgVedioStatus.FileURl
      }

    },
    methods:{
      //关闭窗口
      InfoRefresh(){
         this.$bus.emit('InfoRefresh')
      },
      initImgEditor()
      {
        this.url='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530620594590&di=c6b4e74808ace02b3f26ffe1a9336206&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20171103%2F436c2c052eb345d8b12601536fcb6fc6.jpeg';
        // this.url=this.storeFileURl;
        this.get();
        this.onLoad();
        sessionStorage.removeItem('ImgData');
      },
      onLoad(){
          let el=document.getElementsByClassName("ImgOnlod")[0];
          let el2=document.getElementById("onload");
          el.onload=function(){
              el2.style.display="none";
          }
      },
      loadWH(){
          let sw=$(".single-page-con").width()-400;
          let sh=$(".single-page-con").height()-140;
          $(".imgFocus").height(sh)
          $(".imgEditorCom").width(sw);
         
      },
      defue(){
        // 标注
        imgSign();

      },
      //需要修改
      commitEidt(type){
        let url=this.GLOBAL.baseRouter+'task/task/inside-audit'
        let Okparams={
          "stage_id": this.stageID,
          "audit": 1,//1为通过审核,2为不通过
          "feedback":'',
          "file": [JSON.stringify({
                    "file_id": this.fileID,
                    "tag":[]
          })]
        }
        let EDITparams={
            "stage_id": this.stageID,
            "audit": 2,
            "feedback": this.FeedbackValue,
            "file": JSON.stringify([{
              "file_id": this.fileID,
              "tag":sessionStorage.ImgData!=undefined?JSON.parse(sessionStorage.ImgData):'[]'
            }])
        }
        if(type=='edit'){
            this.$axios.post(url,qs.stringify(EDITparams)).then(msg=>{
               this.$Message.success(msg.data.err_message);
               this.initImgEditor();
               sessionStorage.removeItem('ImgData');
            }, ()=>{
               this.$Message.error(msg.data.err_message);
            })
        }else if(type=='ok'){
            this.$axios.post(url,qs.stringify(Okparams)).then(msg=>{
               this.$Message.success(msg.data.err_message);
               this.initImgEditor();
               sessionStorage.removeItem('ImgData');
            }, ()=>{
               this.$Message.error(msg.data.err_message);
            })
        }
      },    
      imgdef(){
        $.sign.bindSign('#signx');
        $.sign.loadingSign(this.data);
      },
      changeState(state){
        //  控制图片是否可标注
              if(state=='1'||state=='2'){
                sessionStorage.AllowEdit="Allow";//允许标注
                  this.AllowEditRow=true;
                  this.SataeInfo=false;
              }else if(state=='3'||state=='4'||state=='5'){
                sessionStorage.AllowEdit="NotAllow";//不允许标注
                  this.AllowEditRow=false
                  this.SataeInfo=true;
              }else{
                sessionStorage.AllowEdit="Other";//不显示下面和不允许标注
                  this.AllowEditRow=false;
                  this.SataeInfo=false;
              }
      },
      get(){
          //  获取图片的标注信息
           let TaskID=this.storeTaskID
           if(TaskID == 0)
           {
              return false;
           }
           let _this=this;
           let url=this.GLOBAL.baseRouter+'task/task/task-stage&task_id='+350;
           _this.$axios.get(url).then(function(msg){
            let Sdate=msg.data;
            if(Sdate.err_code==0){
             
                _this.IMGlist = [];
                _this.IMGlist = Sdate.data;
                
                _this.IMGlist.forEach((val,index)=>{
                   if(val.file.file==_this.storeFileURl){
                    // 设置初始化值
                     _this.data=val.file.tag;
                     _this.StateFeedBack=val.status;
                     _this.insTime=val.inside_audit_time;
                     _this.cliTiem=val.client_audit_time;
                     _this.insDate=val.inside_audit_date;
                     _this.cliDate=val.client_audit_date;
                     _this.liIndex=index;
                     _this.fileID=val.file.id;
                     _this.stageID=val.file.stage_id;
                   }
                })
              _this.changeState(2);
            //   _this.changeState(_this.StateFeedBack);
              // 把StageID传到提交
              let stageID = _this.stageID;
              let fileID=_this.fileID;
              _this.defue();
              _this.imgdef();
              }else{
                return
              }          
          },()=>{
            _this.$Message.error('请求失败')
          })
      },
    }

  }
</script>
<style lang='less'>
@import './imgEditorTwo/style/imgEditor.less';
</style>
