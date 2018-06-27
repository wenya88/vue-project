<template>
  <div class="defaultH">
      <div class="imgEditorCom">
          <div class="controlListRow" @mouseenter="showStageList">文件上传记录</div>
          <div class="stageListRow" @mouseleave="hideStageList">
              <ul>
                <li v-for="(item,index) in IMGlist" @click="changCont(
                        item.file.file,
                        item.file.tag,
                        item.status,
                        item.inside_audit_time,
                        item.client_audit_time,
                        item.inside_audit_date,
                        item.client_audit_date,
                        item.inside_audit_uid,
                        item.client_audit_uid,
                        index,
                        item.file.stage_id,
                        item.file.id
                    )" :class="{showBg:index==liIndex}"> 
                    <span>{{index+1}}<br/>{{item.stage_name}}</span>
                    <em>
                      {{item.inside_audit_time>item.client_audit_time?item.inside_audit_date:item.client_audit_date}}<br/>
                      {{item.status | filtStat}}
                    </em>
                    <div class="clear"></div>
                </li>
              </ul>
          </div>
          <!-- 加载动画 -->
          <OnLoad id="onload"></OnLoad>
          <div class="imgFocus" id="signx">
              <img :src="url" id="ImgOnlod"/>
          </div>
          <!-- 标注提交 -->
          <div v-if="AllowEditRow" class="AllowEdit">
            <span class="EditInput">
                <input type="text" placeholder="请输入你要反馈的内容" id="EditInput" v-model="FeedbackValue">
            </span>
            <span class="EditSub">
                <button class="actionPost">需修改</button>
            </span>
            <span class="EditSub" v-if="data==null?true:false">
                <button class="subPass">通过</button>
                <em @click="InfoRefresh" id="InfoRefresh"></em>
            </span>
          </div>
          
          <!-- 反馈信息 -->
          <div v-if="SataeInfo" class="feedbackInfo">
            <span><p>反馈状态</p><br/>{{StateFeedBack | filtStat}}</span>
            <span><p>时间</p><br/>{{insTime>cliTiem?insDate:cliDate}}</span>
            <span><p>审核人</p><br/>{{insTime>cliTiem?insUid:cliUid}}</span>
            <div class="clear"></div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
  var Data=[];
  var qs = require('querystring');
  import OnLoad from './onLoad.vue';
  import {baseUrl} from '../../../config/env.js';
  export default {
    components:{
      OnLoad
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
        insUid:0,
        cliUid:0,
        liIndex:0,
        FeedbackValue:'',
        onload:true,
        IMGID:0,
        fileID:0
      }
    },
    watch:{
      FeedbackValue(val){
        sessionStorage.FeedbackValue=val;
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
      // this.initImgEditor();
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
      // addClass(){
      //      $('.AllowEdit').css('margin-top','520px')
      // },
      InfoRefresh(){
         this.$bus.emit('InfoRefresh')
      },
      initImgEditor()
      {
        this.url=this.storeFileURl;
        this.get();
        this.onLoad();
        sessionStorage.removeItem("FeedbackValue");
      },
      onLoad(){
          let el=document.getElementById("ImgOnlod");
          let el2=document.getElementById("onload");
          // el2.style.display="block";
          el.onload=function(){
              el2.style.display="none";
              let imgH=$("#ImgOnlod").height()
              let divH=$(".browsetaskpop").height()
              $('.stageListRow').css('height',imgH)
              if(imgH>divH){
                $(".browsetaskpop").css('height',imgH+88)
              }
          }
      },
      loadWH(){
          $('.stageListRow,.imgEditorCom').height($(window).height()-500);
          $(".imgEditorCom").width($(".filebrowse").width());
          //$('.imgFocus img').height($(window).height()-500);
          $(".defaultH").height($(window).height()-400);
          //$(".imgFocus").width($(".filebrowse").width());    
      },
      changCont(file,tag,status,insTime,cliTiem,insDate,cliDate,insUid,cliUid,index,taskID,fid){
         this.url=file;
         this.data=tag;
         this.StateFeedBack=status;
         this.insTime=insTime;
         this.cliTiem=cliTiem;
         this.insDate=insDate;
         this.cliDate=cliDate;
         this.insUid=insUid;
         this.cliUid=cliUid;
         this.liIndex=index;
         let fileID=taskID;
         let fID=fid;
         this.changeState(this.StateFeedBack);
         this.defue(fileID,fID);
         this.imgdef();
         Data=[];
         this.onLoad();
      },
      defue(fileID,fID){
        (function($){
          var cX,cY,indexId=0,removeId,DOM;
          var Rleft,Rtop;//需要删除的坐标
          jQuery.sign={
            bindSign:function(dom){
              DOM=dom;
              defined(dom);
            },
            loadingSign:function(data){
              loading(data);
              Data.concat(data);
            }
          };
          document.oncontextmenu = function(e){
            e.preventDefault();
          };//阻止鼠标右键默认事件
          $(document).on('click','.imgFocus img',function(e){
              $(".inputSignBox").hide();
              e.stopPropagation;
          });

          function defined(dom){
            //是否显示标记
            if(sessionStorage.AllowEdit=="NotAllow"||sessionStorage.AllowEdit=="Other"){
                return
            }
            //鼠标右键
            $(document).on("mousedown",dom,function(e){
              e.preventDefault();
              if(e.which==3){
                $(".inputSignBox").remove();
                var l=e.clientX-$(dom).offset().left;
                var t=e.clientY-$(dom).offset().top;
                cX=l;
                cY=t;
                $(dom).append("<div class='inputSignBox'></div>");
                $('.inputSignBox').append("<div class='outSignbox'>X</div>");
                $('.inputSignBox').append("<div class='signbox' contenteditable='true' id='inputText' tabindex='-1'><em id='deflutText'>输入标记</em></div>");
                $('.inputSignBox').append("<div class='sureSign'>标注</div>");
                $('.inputSignBox').css({"left":cX,"top":cY});
                e.stopPropagation();
              }
            });
            //添加编辑
            $(document).on('click','#inputText',function(){
              $(this).focus();
              $('.signbox em').remove();
            });//编辑框聚焦
            $(document).on('click','.outSignbox',function(){
              $('.inputSignBox').remove();
            });//退出编辑
            $(document).on('click','.sureSign',function(){
              if($('.signbox em').length>0){
                $('.inputSignBox').remove();
              }else if($('.signbox').text().length<=0){
                $('.inputSignBox').remove();
              }else{
                indexId++;
                var text=$.trim($('.signbox').text());
                $('.inputSignBox').remove();
                $(dom).append("<div class='signIndex' id='Ts"+indexId+"' theSign='"+text+"'>"+"<div class='hintBox'"+"title="+text+">"+text+"</div>"+"</div>");
                $('#Ts'+indexId).css({"left":cX-11,"top":cY-29});
                var mes={left:cX-11,top:cY-29,message:text};
                Data[Data.length]=mes;
              }
            });//确认编辑
            $(document).on('mouseenter','[id*=Ts]',function(e){
              var m=$(this).attr('id').replace(/[^0-9]/ig, "");
              // if(e.which==3){
                e.stopPropagation();
                removeId=m;
                $('.chooseBox').remove();
                Rleft=$(this).css("left").replace(/[^0-9]/ig, "");
                Rtop=$(this).css("top").replace(/[^0-9]/ig, "");
                var l=e.clientX-$(dom).offset().left,t=e.clientY-$(dom).offset().top;
                $(this).append("<div class='chooseBox'><ul><li id='deleteSign'>X</li></ul></div>");
                $('.chooseBox').css({"left":45,"top":-20});
              // }
            });//弹出取消标记
            $(document).on('click','#deleteSign',function(){
              deleteData(Rleft,Rtop);
              $('#Ts'+removeId).remove();
            });//删除标记
          
            $(document).click(function(){
              $('.chooseBox').remove();
            });
            //点击消失
          }
          function deleteData(left,top){
            for(var i=0;i<Data.length;i++){
              if(Data[i].left==left&&Data[i].top==top){
                Data.splice(i,1);
                break;
              }else{
                continue;
              }
             
            }
          }//删除数据
          function loading(data){
             $(".signIndex").remove();
               if(data!=null){
                 var l=Data.length;
                  for(var i=0;i<data.length;i++){
                    indexId++
                    $(DOM).append("<div class='signIndex' id='Ts"+l+"' theSign='"+data[i].message+"'>"+"<div class='hintBox'"+"title="+data[i].message+">"+data[i].message+"</div>"+"</div>");
                    $('#Ts'+l).css({"left":Number(data[i].left),"top":Number(data[i].top)});
                    l++;
                  }
                indexId=l;
               }
           
          }//载入数据

          function AjaxFun(url,ImgData){
              $.ajax({
                cache:false,
                type:'post',
                url:url,
                data:ImgData,
                async:true,
                dataType:"json",
                success:function(msg){
                  if(msg.err_code>0){
                    alert(msg.err_message);
                  }else{
                    sessionStorage.removeItem("FeedbackValue");
                    document.getElementById('InfoRefresh').dispatchEvent(new Event('click'));
                    alert("提交成功！");
                  }
              },
              error:function(){
                alert(' 提交失败!')
              }
              })
          };

          // 标注
          $(".actionPost").unbind('click').click(function(){
            // var url='/task/task/inside-audit';
            var url=baseUrl+'index.php?r=task/task/inside-audit';
            var ImgData={
                  "stage_id": fileID,
                  "audit": 2,
                  "feedback": sessionStorage.FeedbackValue,
                  "file": [{
                    "file_id": fID,
                    "tag":Data
                  }]
                }
                AjaxFun(url,ImgData)
          });

          // 审核通过
          $(".subPass").unbind('click').click(function(){
               var url=baseUrl+'index.php?r=task/task/inside-audit';
               var ImgData={
                  "stage_id": fileID,
                  "audit": 1,
                  "feedback":'',
                  "file": [{
                    "file_id": fID,
                    "tag":[]
                  }]
                }
               AjaxFun(url,ImgData)
          });

        })(jQuery);
      },     
      imgdef(){
        $.sign.bindSign('#signx');
        $.sign.loadingSign(this.data);
      },
      changeState(state){
        //  控制图片是否可标注
              if(state==1||state==2){
                sessionStorage.AllowEdit="Allow";//允许标注
                  this.AllowEditRow=true;
                  this.SataeInfo=false;
              }else if(state==3||state==4||state==5){
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
           let url=this.GLOBAL.baseRouter+'task/task/task-stage&task_id='+TaskID;
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
                     _this.insTime=val.insTime;
                     _this.cliTiem=val.cliTiem;
                     _this.insDate=val.insDate;
                     _this.cliDate=val.cliDate;
                     _this.insUid=val.insUid;
                     _this.cliUid=val.cliUid;
                     _this.liIndex=index;
                     _this.IMGID=val.file.id;
                     _this.fileID=val.file.stage_id;
                   }
                })
              _this.changeState(_this.StateFeedBack);
              // 把StageID传到提交
              let fileID = _this.fileID;
              let fID=_this.IMGID;
              _this.defue(fileID,fID);
              _this.imgdef();
              }else{
                return
              }          
          },()=>{
            _this.$Message.error('请求失败')
          })
      },
      showStageList(){
          document.getElementsByClassName('controlListRow')[0].style.display='none';
          document.getElementsByClassName('stageListRow')[0].style.display='block';
      },
      hideStageList(){
          document.getElementsByClassName('controlListRow')[0].style.display='block';
          document.getElementsByClassName('stageListRow')[0].style.display='none';
      }
    }

  }
</script>
<style lang='less'>
@import '../../../styles/imgEditor.less';
</style>
