<template>
  <div class="defaultH">
      <div class="imgEditorCom">
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
            <span class="EditSub">
                <button class="subPass">通过</button>
                <em @click="InfoRefresh" id="InfoRefresh"></em>
            </span>
          </div>
          
          <!-- 反馈信息 -->
          <div v-if="SataeInfo" class="feedbackInfo feedbackInfoTow">
            <span><p>审核意见</p><br/>{{Biddata.examine_description}}</span>
            <span><p>审核结果</p><br/><b :class="[Biddata.status==2?'NOT':'']">{{Biddata.status==2?'需求修改':'通过'}}</b></span>
            <span><p>审核人</p><br/>{{Biddata.examine_user}}</span>
            <span><p>审核时间</p><br/>{{Biddata.examine_days==0?'今天':Math.abs(Biddata.examine_days)+'天前'}}</span>
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
        Biddata:[],
        url:'',
        AllowEditRow:true,
        SataeInfo:true,
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
    mounted(){
      this.loadWH();
    },
    methods:{
      InfoRefresh(){
         this.$bus.emit('InfoRefresh')
      },
      onLoad(){
          let el=document.getElementById("ImgOnlod");
          let el2=document.getElementById("onload");
          el2.style.display="block";
          el.onload=function(){
              el2.style.display="none";
              let imgH=$("#ImgOnlod").height()+120;
              let divH=$(".ivu-modal-body").height();
              if(imgH>divH){
                $(".ivu-modal-body").css('height',imgH)
              }
          }
      },
      loadWH(){
          $('.imgEditorCom').height($(window).height()-500);
          $(".imgEditorCom").width($(".ivu-modal").width()-400);
          // $('.imgFocus img').height($(window).height()-500);
          //$(".defaultH").height($(window).height()-400);
      },
      defue(BID,status){
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
            if( status=="1" || status=="2"){
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
            var url=baseUrl+'index.php?r=task/company/bid-tag';
            var ImgData={
                    "id": BID,
                    "tag":JSON.stringify(Data),
                    "examine_description":sessionStorage.FeedbackValue
                }
                AjaxFun(url,ImgData)
          });

          // 审核通过
          $(".subPass").unbind('click').click(function(){
               var url=baseUrl+'index.php?r=task/company/examine-bid';
               var ImgData={
                    "status":1,
                    "id": BID,
                    "examine_description":sessionStorage.FeedbackValue
                }
            AjaxFun(url,ImgData)
          });

        })(jQuery);
      },     
      imgdef(){
        $.sign.bindSign('#signx');
        $.sign.loadingSign(this.data);
      },
      Editget(bidFile){
           let _this=this;
           _this.onLoad();
           sessionStorage.removeItem("FeedbackValue");
          //  控制图片是否可标注
           if(bidFile.status=="0"){ //允许标注
                _this.AllowEditRow=true;
                _this.SataeInfo=false;
            }else if(bidFile.status=="1"||bidFile.status=="2"){ //不允许标注
                _this.AllowEditRow=false
                 _this.SataeInfo=true;
            }
            _this.data=bidFile.tag;
            _this.url=bidFile.file;
            _this.Biddata=bidFile;
            _this.defue(bidFile.id,bidFile.status);
            _this.imgdef();
      },
      
    }

  }
</script>
<style lang='less'>
@import '../../../styles/imgEditor.less';
</style>
