<template>
    <div class="videoM">
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
                      item.task_id,
                      item.file.fid
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
      <div class='V_markVjs' style="display:none;top:0px;left:0px;"></div>
      <div class="V_progressBar" style="top:0px;left:0px;"></div>
      <video id="my-video" class="video-js" controls preload="auto" width="880" height="600" data-setup="{}">
        <source :src="VideoURL" type="video/mp4">
      </video>

      <!-- 标注提交 -->
      <div v-if="AllowEditRow" class="VideoAllowEdit">
          <span class="EditInput">
              <input type="text" placeholder="请输入你要反馈的内容" id="EditInput">
          </span>
          <span class="EditSub">
              <button class="actionPost">确认</button>
          </span>
          <span class="EditSub">
              <button class="subPass">通过</button>
          </span>
      </div>
      
      <!-- 反馈信息 -->
      <div v-if="SataeInfo" class="VideofeedbackInfo">
          <span><p>反馈状态</p><br/>{{StateFeedBack | filtStat}}</span>
          <span><p>时间</p><br/>{{insTime>cliTiem?insDate:cliDate}}</span>
          <span><p>审核人</p><br/>{{insTime>cliTiem?insUid:cliUid}}</span>
          <div class="clear"></div>
        </div>
  	</div>
</template>
<script>
// import videojs from 'video.js';
import {baseUrl} from '../../../config/env.js';
export default {
    data(){
        return{
            data:[],
            TID:49,
            fileID:10,
            AllowEdit:String,
            AllowEditRow:Boolean,
            SataeInfo:Boolean,
            StateFeedBack:0,
            IMGlist:[],
            insTime:0,
            cliTiem:0,
            insDate:0,
            cliDate:0,
            insUid:0,
            cliUid:0,
            liIndex:0,
            VideoURL:'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
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
    created(){
        this.videoLoad();
    },
    mounted(){
        // 设初始视频地址
        // this.url=sessionStorage.FileURl;
        this.VedioGet();
    },
    methods:{
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
         this.Vdefault(fileID,fID);
         this.vedioLoad();
       },
        videoLoad(){
            $(".video_js").remove();
            let head = document.getElementsByTagName('head')[0];  
            let script = document.createElement('script');  
            script.async = true;  
            script.src = "http://vjs.zencdn.net/6.6.3/video.js";
            script.classList.add("video_js")
            head.appendChild(script);
        },
        Vdefault(fileID,fID){
                 var btiem
                 var myPlayer = videojs('my-video');
                    videojs("my-video").ready(function(){
                        var myPlayer = this;
                        myPlayer.play();
                        $(".vjs-volume-panel,.vjs-fullscreen-control").hide();
                        var myPWidth=myPlayer.width();
                        var myPHeigth=myPlayer.height()-36;
                        $(".V_markVjs").css({'width':myPWidth,'height':myPHeigth});
                        $(".V_progressBar").css({'width':myPWidth-119,'top':myPHeigth+2,'left':58});
                    });
                    
                    function PauPlay(){
                        $(".V_markVjs").show()
                        var domWidth=document.getElementsByClassName("vjs-play-progress")[0].style.width;
                        var Ftiem=myPlayer.currentTime();
                            btiem=Number(Ftiem).toFixed(2);
                        // console.log(btiem);
                        return domWidth
                    }

                    myPlayer.on('pause',function(){
                        // console.log(myPlayer.currentTime());
                        PauPlay();
                    });
                    myPlayer.on('play',function(){
                        $(".V_markVjs,.V_signIndex").hide();
                    });

                    // -----------------图片标识-----------------
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
                    //阻止鼠标右键默认事件
                    document.oncontextmenu = function(e){
                        PauPlay();
                        myPlayer.pause();
                        e.preventDefault();
                    };
                    function defined(dom){
                        if(sessionStorage.AllowEdit=="NotAllow"||sessionStorage.AllowEdit=="Other"){
                            return
                        }
                        $(document).on("mousedown",dom,function(e){
                        e.preventDefault();
                        if(e.which==3){
                            $(".V_inputSignBox").remove();
                            var l=e.clientX-$(dom).offset().left;
                            var t=e.clientY-$(dom).offset().top;
                            cX=l;
                            cY=t;
                            $(dom).append("<div class='V_inputSignBox'></div>");
                            $('.V_inputSignBox').append("<div class='V_outSignbox'>X</div>");
                            $('.V_inputSignBox').append("<div class='V_signbox' contenteditable='true' id='inputText' tabindex='-1'><em id='deflutText'>输入标记</em></div>");
                            $('.V_inputSignBox').append("<div class='V_sureSign'>确定</div>");
                            $('.V_inputSignBox').css({"left":cX,"top":cY});
                            e.stopPropagation();
                        }
                        });

                        //添加编辑
                        $(document).on('click','#inputText',function(e){
                        $(this).focus();
                        $('.V_signbox em').remove();
                        e.stopPropagation();
                        });//编辑框聚焦
                        $(document).on('click','.V_outSignbox',function(){
                        $('.V_inputSignBox').remove();
                        });//退出编辑
                        $(document).on('click','.V_sureSign',function(){
                            if($('.V_signbox em').length>0){
                                $('.V_inputSignBox').remove();
                            }else if($('.V_signbox').text().length<=0){
                                $('.V_inputSignBox').remove();
                            }else{
                                var domWidth=PauPlay()
                                indexId++;
                                var text=$.trim($('.V_signbox').text());
                                $('.V_inputSignBox').remove();
                                var Dtiem="'"+btiem+"'";
                                var Rtiem=Dtiem.replace('.','_');
                                $(dom).append("<div class='V_signIndex bBs"+Rtiem.replace("'",'')+"' id=Ts"+indexId+" theSign="+text+" data-btiem="+btiem+">"+"<div class='V_hintBox'"+"title="+text+">"+text+"</div>"+"<div class='V_triangle-down'></div></div>");
                                $(".V_progressBar").append("<span class='V_barSpan'"+'id=bBs'+indexId+' style=left:'+domWidth+">"+btiem+"</span>")
                                $('#Ts'+indexId).css({"left":cX-15,"top":cY-15,"display":"block"});
                                if(changeSignColor){
                                $('#Ts'+indexId).css("border",signColor+" 3px solid");
                                }//改变了颜色
                                var mes={left:cX-15,top:cY-15,message:text,btiem:btiem,leftX:domWidth};
                                Data[Data.length]=mes;
                        }
                        });//确认编辑
                        $(document).on('mousedown','[id*=Ts]',function(e){
                        var m=$(this).attr('id').replace(/[^0-9]/ig, "");
                        if(e.which==3){
                            e.stopPropagation();
                            removeId=m;
                            $('.V_chooseBox').remove();
                            Rleft=$(this).css("left").replace(/[^0-9]/ig, "");
                            Rtop=$(this).css("top").replace(/[^0-9]/ig, "");
                            var l=e.clientX-$(dom).offset().left,t=e.clientY-$(dom).offset().top;
                            $(dom).append("<div class='V_chooseBox'><ul><li id='deleteSign'>删除</li></ul></div>");
                            $('.V_chooseBox').css({"left":l,"top":t});
                        }
                        });//弹出取消标记
                        $(document).on('click','#deleteSign',function(){
                        deleteData(Rleft,Rtop);
                        $('#Ts'+removeId).remove();
                        $('#bBs'+removeId).remove();
                        });
                        $(document).click(function(){
                        $('.V_chooseBox').remove();
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
                    }
                    function loading(data){
                    var l=Data.length;
                    for(var i=0;i<data.length;i++){
                    indexId++
                    var Dtiem="'"+Number(data[i].btiem)+"'";
                    var Rtiem=Dtiem.replace('.','_');
                    $('.V_signIndex').remove();
                    $(DOM).append("<div class='V_signIndex bBs"+Rtiem.replace("'",'')+" id=Ts"+l+" theSign="+data[i].message+" data-btiem="+Number(data[i].btiem)+">"+"<div class='V_triangle-down'></div><div class='V_hintBox'"+"title="+data[i].message+">"+data[i].message+"</div>"+"</div>");
                    $(".V_progressBar").append("<span class='V_barSpan'"+'id=bBs'+l+' style=left:'+data[i].leftX+">"+Number(data[i].btiem)+"</span>");
                    $('#Ts'+l).css({"left":Number(data[i].left),"top":Number(data[i].top)});
                    if(changeSignColor){
                        $('#Ts'+l).css("border",signColor+" 3px solid");
                    }//改变了颜色
                    l++;
                    }
                    indexId=l;
                }//载入数据
                $(".actionPost").unbind("click").click(function(){
                    var url=baseUrl+'index.php?r=task/task/inside-audit';
                    var VedData={
                        "stage_id":fileID,
                        "audit":2,
                        "feedback":"",
                        "file":[{
                            "file_id":fID,
                            "tag":Data
                           }]
                    };
                    $.ajax({
                        type:'post',
                        url:url,
                        data:VedData,
                        async:true,
                        dataType:'json',    
                        success:function(msg){
                            console.log(msg)
                        },
                        error:function(){
                            alert("请求错误!")
                        }
                    })

                })

                $(document).on('click','.V_signIndex',function(){
                    var thisTiem=$.trim($(this).attr('data-btiem'));
                    myFun(thisTiem);
                    // console.log(thisTiem);
                });

                $(document).on('click','.V_progressBar .V_barSpan',function(){
                    var thisTiem=$.trim($(this).text());
                    $(".V_signIndex").hide()
                    var DthisTiem=thisTiem;
                    var RthisTiem=DthisTiem.replace('.','_');
                    $(".bBs"+RthisTiem).show();
                    //console.log(RthisTiem);
                    myFun(thisTiem);
                })	

                $(document).on('click','.V_markVjs',function(){
                        $(".V_inputSignBox").hide();
                })

                function myFun(thisTiem){
                        myPlayer.currentTime(thisTiem)
                }
        },
        vedioLoad(){
            $.sign.bindSign('.V_markVjs');
            $.sign.loadingSign(this.data);
            document.oncontextmenu = function(e){
                e.preventDefault();
            };
        },
        VedioGet(){
             let _this=this;
             //  列表高度
             $(".stageListRow").height(600)
             //  控制图片是否可标注
            if(sessionStorage.AllowEdit=="Allow"){ //允许标注
                _this.AllowEditRow=true;
                _this.SataeInfo=false;
            }else if(sessionStorage.AllowEdit=="NotAllow"){ //不允许标注
                _this.AllowEditRow=false
                 _this.SataeInfo=true;
            }else if(sessionStorage.AllowEdit=="Other"){ //不显示下面和不允许标注
                _this.AllowEditRow=false;
                _this.SataeInfo=false;
            }
            //  获取视频的标注信息
            let TaskID=sessionStorage.TaskID;
            let url=this.GLOBAL.baseRouter+'task/task/task-stage&task_id='+TaskID;
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
                 let fileID = Sdate.data[0].task_id;
                 let fID=Sdate.data[0].file.fid;
                // 加载Video控件
                _this.Vdefault(fileID,fID);
                console.log(fileID+"/"+fID)
                _this.vedioLoad();
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
<style lang="less">
     @import '../../../styles/vedioEditor.less';
</style>