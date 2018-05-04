<style>
     @import '../../../styles/video-js.css'; 
    .m {width: 740px;height: 400px;margin-left: auto;margin-right: auto;position:absolute;}
    .m .controlListRow{position:absolute;z-index:999;background:#bb5717;color:#fff;width:18px;text-align:center;padding:5px 0px;line-height:16px;margin-top:25%;}
    .m .stageListRow{background:rgba(0,0,0,0.5);width:320px;position:absolute;z-index:9999;height:200px;display:none;overflow-y:auto;}
    .m .stageListRow ul{margin:10px;}
    .m .stageListRow ul li{border-radius:4px;line-height:20px;font-size:12px;}
    .m .stageListRow .showBg{background:#eaeab5;}
    .m .stageListRow ul li:hover{border-style:solid;}
    .m .stageListRow ul em{float:right;text-align:right;font-size:12px;}
    .m .stageListRow .clear{clear:both;}
    .video-js .vjs-slider {position: relative;cursor: pointer;padding: 0;user-select: none;background-color: #73859f;background-color: rgba(148, 159, 115, 0.5);}
    .video-js .vjs-play-progress {background-color: #ffffff;}
    .V_markVjs{background:rgba(0,0,0,0.4);position:absolute;z-index:100;left:-48px;}
    .V_chooseBox{height:auto;position:absolute;z-index:100;background:#fff;box-shadow:#000 0 0 2px;-webkit-box-shadow:#000 0 0 2px}
    .V_chooseBox ul{width:100%;height:auto;cursor:pointer;list-style:none;margin:0px;padding:0px;}
    .V_chooseBox ul li{height:20px;color:#000;font-size:12px;text-align:center;line-height:20px;padding:0px 4px;}
    .V_chooseBox ul li:hover{background:#3498db;color:#fff}
    .V_inputSignBox{width:250px;height:120px;position:absolute;z-index:200;background:#fff;box-shadow:#000 0 0 4px;-webkit-box-shadow:#000 0 0 4px;-webkit-border-radius:0px;overflow:hidden}
    .V_outSignbox{width:100%;height:29px;color:#1b1b1b;line-height:29px;text-align:center;font-size:12px;cursor:pointer;font-weight:bold;border-bottom:#d9d6d6 1px solid}
    .V_signbox{width:240px;height:62px;line-height:17px;outline:0;margin:0 auto;color:#000;font-size:12px;font-weight:400;overflow:hidden;text-align:left}
    .V_signbox em{width:auto;height:17px;line-height:17px;color:#a8a8a8;font-style:normal;}
    .V_sureSign{width:100%;height:29px;border-top:#d9d6d6 1px solid;line-height:29px;text-align:center;cursor:pointer;font-weight:bold;font-size:12px;color:#fff;background:#3498db}
    .V_signIndex{display:none;width:15px;height:15px;border:rgba(251,251,251,0.4) 3px solid;position:absolute;z-index:99;border-radius:100%;text-align:center;font-size:12px;}

    .V_hintBox{margin:0;position:absolute;min-width:50px;max-width:240px;max-height:100px;min-height:20px;z-index:101;background:rgba(0,0,0,0.5);color:#fff;line-height:20px;font-size:12px;text-align:center}
    .V_signIndex .V_hintBox{top:-28px;left:-46px;width:100px;padding-left:5px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;border-radius:4px;}
    .V_signIndex .V_triangle-down{left:-3px;top:-8px;}
    .V_video-js ul{padding:0px;}
    .V_triangle-down{position:absolute;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-top:5px solid rgba(0,0,0,0.5);z-index:101}
    .V_progressBar{position:absolute;width:0px;height:10px;z-index:99;background:rgba(0,0,0,0.3);}
    .V_progressBar>.V_barSpan{width:2px;height:10px;display:inline-block;background:#fff;position:absolute;left:0;overflow:hidden;text-indent:10px;} 
</style>
<template>
    <div class="m">
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
      <div class='V_markVjs' style="display:none;top:0px;left:0px;"></div>
      <div class="V_progressBar" style="top:0px;left:0px;"></div>
      <video id="my-video" class="video-js" controls preload="auto" width="880" height="600" data-setup="{}">
        <source :src="VideoURL" type="video/mp4">
      </video>
      <div v-if="AllowEdit"><button class="actionPost">确认</button></div>
      <div v-if="SataeInfo">反馈状态:{{StateFeedBack | filtStat}} 时间:{{insTime>cliTiem?insDate:cliDate}}审核人:{{insTime>cliTiem?insUid:cliUid}}</div>
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
            AllowEdit:Boolean,
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
        Vdefault(fileID,SataeInfo){
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
                        if(SataeInfo==true||SataeInfo==undefined){
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
                $(".actionPost").click(function(){
                    var url=baseUrl+'index.php?r=task/task/inside-audit';
                    var VedData={
                        "stage_id":49,
                        "audit":2,
                        "feedback":"",
                        "file":[{
                            "file_id":fileID,
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
            //  获取视频的标注信息
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
                let SataeInfo = _this.SataeInfo
                // 加载Video控件
                _this.Vdefault(fileID,SataeInfo);
                _this.vedioLoad();
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


