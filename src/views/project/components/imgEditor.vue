<template>
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
                      index
                  )" :class="{showBg:index==liIndex}"> 
                  <span>{{index+1}}<br/>{{item.stage}}</span>
                  <em>
                    {{item.inside_audit_time>item.client_audit_time?item.inside_audit_date:item.client_audit_date}}<br/>
                    {{item.status | filtStat}}
                  </em>
                  <div class="clear"></div>
              </li>
            </ul>
            
        </div>
        <div class="imgFocus" id="signx"><img :src="url" /></div>
        <div v-if="AllowEdit"><button class="actionPost">确认</button></div>
        <div v-if="SataeInfo">反馈状态:{{StateFeedBack | filtStat}} 时间:{{insTime>cliTiem?insDate:cliDate}}审核人:{{insTime>cliTiem?insUid:cliUid}}</div>
    </div>
</template>
<script>
  var qs = require('querystring')
  import {baseUrl} from '../../../config/env.js';
  export default {
    data () {
      return {
        data:[],
        IMGdata:[],
        url:'',
        TID:80,
        TaskID:0,
        IMGlist:[],
        AllowEdit:Boolean,
        SataeInfo:Boolean,
        StateFeedBack:0,
        insTime:0,
        cliTiem:0,
        insDate:0,
        cliDate:0,
        insUid:0,
        cliUid:0,
        liIndex:0
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
      this.url=sessionStorage.FileURl;
      this.get();
    },
    methods:{
      changCont(file,tag,status,insTime,cliTiem,insDate,cliDate,insUid,cliUid,index){
         this.url=file;
         this.data=tag;
         this.StateFeedBack=status;
         this.insTime=insTime;
         this.cliTiem=cliTiem;
         this.insDate=insDate;
         this.cliDate=cliDate;
         this.insUid=insUid;
         this.cliUid=cliUid;
         this.liIndex=index
         this.imgdef();
      },
      defue(fileID,SataeInfo){
        (function($){
          var cX,cY,indexId=0,removeId,Data=[],DOM,changeSignColor=false,signColor;
          var changeBodyColor=false,bodyColor,changeFontColor=false,fontColor;
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
            if(SataeInfo==true||SataeInfo==undefined){
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
                $('.inputSignBox').append("<div class='sureSign'>确定</div>");
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
                $(dom).append("<div class='signIndex' id='Ts"+indexId+"' theSign='"+text+"'>"+"<div class='triangle-down'></div><div class='hintBox'"+"title="+text+">"+text+"</div>"+"</div>");
                $('#Ts'+indexId).css({"left":cX-15,"top":cY-15});
                if(changeSignColor){
                  $('#Ts'+indexId).css("border",signColor+" 3px solid");
                }//改变了颜色
                var mes={left:cX-15,top:cY-15,message:text};
                Data[Data.length]=mes;
              }
            });//确认编辑
            $(document).on('mousedown','[id*=Ts]',function(e){
              var m=$(this).attr('id').replace(/[^0-9]/ig, "");
              if(e.which==3){
                e.stopPropagation();
                removeId=m;
                $('.chooseBox').remove();
                Rleft=$(this).css("left").replace(/[^0-9]/ig, "");
                Rtop=$(this).css("top").replace(/[^0-9]/ig, "");
                var l=e.clientX-$(dom).offset().left,t=e.clientY-$(dom).offset().top;
                $(dom).append("<div class='chooseBox'><ul><li id='deleteSign'>删除</li></ul></div>");
                $('.chooseBox').css({"left":l,"top":t});
              }
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
            $(".signIndex").remove()
            var l=Data.length;
            for(var i=0;i<data.length;i++){
              indexId++
              $(DOM).append("<div class='signIndex' id='Ts"+l+"' theSign='"+data[i].message+"'>"+"<div class='triangle-down'></div><div class='hintBox'"+"title="+data[i].message+">"+data[i].message+"</div>"+"</div>");
              $('#Ts'+l).css({"left":Number(data[i].left),"top":Number(data[i].top)});
              if(changeSignColor){
                $('#Ts'+l).css("border",signColor+" 3px solid");
              }//改变了颜色
              l++;
            }
            indexId=l;
          }//载入数据

          $(".actionPost").click(function(){   
            var url=baseUrl+'index.php?r=task/task/inside-audit';
            var ImgData={
                  "stage_id": fileID,
                  "audit": 2,
                  "feedbac": "",
                  "file": [{
                    "file_id": 49,
                    "tag": Data
                  }]
                }
            $.ajax({
              type:'post',
              url:url,
              data:ImgData,
              async:true,
              dataType:"json",
              success:function(msg){
               console.log(msg)
             },
             error:function(){
               alert('请求失败!')
             }
             
            })
              console.log(ImgData)
          })

        })(jQuery);
      },
      imgdef(){
        $.sign.bindSign('#signx');
        $.sign.loadingSign(this.data);
      },
      get(){
           let _this=this;
          //  控件图片和列表的高度
           $('.imgFocus img,.stageListRow').height($(window).height()-320);
          //  控制图片是否可标注
           if(sessionStorage.AllowEdit=='true'){
                _this.AllowEdit=true;
                _this.SataeInfo=false;
            }else if(sessionStorage.AllowEdit=='false'){
                _this.AllowEdit=false
                 _this.SataeInfo=true;
            }else if(sessionStorage.AllowEdit==undefined){
                _this.AllowEdit=false;
                _this.SataeInfo=false;
            }
          //  获取图片的标注信息
           let TaskID=sessionStorage.TaskID;
           let url='/task/task/task-stage&task_id='+TaskID;
          _this.$axios.get(url).then(function(msg){
            let Sdate=msg.data;
            if(Sdate.err_code==0){
                Sdate.data.forEach(element => {
                    _this.IMGlist.push(element)
                });
            // 设置初始化值
            _this.data=_this.IMGlist[0].tag;
            _this.StateFeedBack=_this.IMGlist[0].status;
            _this.insTime=_this.IMGlist[0].insTime;
            _this.cliTiem=_this.IMGlist[0].cliTiem;
            _this.insDate=_this.IMGlist[0].insDate;
            _this.cliDate=_this.IMGlist[0].cliDate;
            _this.insUid=_this.IMGlist[0].insUid;
            _this.cliUid=_this.IMGlist[0].cliUid;
            // 把StageID传到提交
            let fileID = Sdate.stage_id;
            let SataeInfo=_this.SataeInfo
            _this.defue(fileID,SataeInfo);
            _this.imgdef();
            document.oncontextmenu=new Function("event.returnValue=false;");
            }else{
              return
            }          
        },()=>{
          alert("请求失败!")
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
