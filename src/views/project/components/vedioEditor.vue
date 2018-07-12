<template>
    <div>
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
        <div class='V_markVjs' style="display:none;top:0px;left:0px;"></div>
        <!-- 进度条 -->
        <div class="V_progressBar" style="top:0px;left:0px;"></div>
        <video id="my-video" class="video-js" controls preload="auto" width="810" height="480" data-setup="{}">
            <source :src="VideoURL" type="video/mp4">
        </video>
        <!-- 标注提交 -->
        <div v-if="AllowEditRow" class="VideoAllowEdit">
            <span class="EditInput">
                <input type="text" placeholder="请输入你要反馈的内容" id="EditInput" v-model="FeedbackValue">
            </span>
            <span class="EditSub">
                <button class="actionPost" @click="commitEidt('edit')">需修改</button>
            </span>
            <span class="EditSub" v-if="data==null?true:false">
                <button class="subPass"  @click="commitEidt('ok')">通过</button>
                <em @click="InfoRefresh" id="InfoRefresh"></em>
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
    </div>
</template>
<script>

var Data=[];
import {baseUrl, deletetaskData} from '../../../config/env.js';
var qs=require('querystring');
export default {
    data(){
        return{
            data:[],
            TID:49,
            fileID:10,
            AllowEdit:String,
            AllowEditRow:false,
            SataeInfo:false,
            StateFeedBack:0,
            IMGlist:[],
            insTime:0,
            cliTiem:0,
            insDate:0,
            cliDate:0,
            insUid:0,
            cliUid:0,
            liIndex:0,
            VideoURL:'',
            fileID:0,
            stageID:0,
            FeedbackValue:''
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
         $LAB
        .script("/src/js/video.js").wait(()=>{
            this.Vdefault();
            this.vedioLoad();
        });
        this.VedioGet();
    },
    created(){
        this.AddVedioJS();
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
        InfoRefresh(){
         this.$bus.emit('InfoRefresh')
        },
        changCont(file,tag,status,insTime,cliTiem,insDate,cliDate,insUid,cliUid,index,taskID,fid){
         this.VideoURL=file;
         this.data=tag;
         this.StateFeedBack=status;
         this.insTime=insTime;
         this.cliTiem=cliTiem;
         this.insDate=insDate;
         this.cliDate=cliDate;
         this.insUid=insUid;
         this.cliUid=cliUid;
         this.liIndex=index;
         this.fileID=fid;
         this.stageID=taskID;
         this.changeState(this.StateFeedBack);
         this.AddVedioJS();
         this.vedioLoad();
        //  切换视频初始化播放器
         let myPlayer = videojs('my-video');
         myPlayer.load(this.VideoURL);
         myPlayer.play();
       },
       //追加video.js文件
        AddVedioJS(){
            $(".video_js").remove();
            let head = document.getElementsByTagName('head')[0];  
            let script = document.createElement('script');  
            script.async = true;  
            script.src = "http://vjs.zencdn.net/6.6.3/video.js";
            script.classList.add("video_js")
            head.appendChild(script);
        },
        // videojs控制
        Vdefault(){
                 var btiem
                 var myPlayer = videojs('my-video');
                    videojs("my-video").ready(function(){
                        var myPlayer = this;
                        myPlayer.play();
                        $(".vjs-volume-panel,.vjs-fullscreen-control").hide();
                        var myPWidth=myPlayer.width();
                        var myPHeigth=myPlayer.height()-36;
                        $(".V_markVjs").css({'width':myPWidth,'height':myPHeigth});//设置标记层
                        $(".V_progressBar").css({'width':myPWidth-119,'top':myPHeigth+2,'left':58});//设置进度条
                    });
                    
                    function PauPlay(){ //暂停方法
                        $(".V_markVjs").show()
                        var domWidth=document.getElementsByClassName("vjs-play-progress")[0].style.width;//获取正在播放进度条的宽度
                        var Ftiem=myPlayer.currentTime();//获取时间
                            btiem=Number(Ftiem).toFixed(2);//保留2位小数
                        return domWidth
                    }

                    myPlayer.on('pause',function(){//暂停播放
                        $(".V_signIndex").hide();
                        PauPlay();
                    });
                    
                    myPlayer.on('play',function(){ //开始播放
                       $(".V_markVjs,.V_signIndex").hide();  //标记层和标记隐藏
                    });

                    // -----------------图片标识-----------------
                    var cX,cY,indexId=0,removeId,DOM
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
                        if(sessionStorage.AllowEdit=="NotAllow"||sessionStorage.AllowEdit=="Other"){  //是否允许标记
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
                            $('.V_inputSignBox').append("<div class='V_sureSign'>标注</div>");
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
                                $(dom).append("<div class='V_signIndex bBs"+Rtiem.replace("'",'')+"' id=Ts"+indexId+" theSign="+text+" data-btiem="+btiem+">"+"<div class='V_hintBox'"+"title="+text+">"+text+"</div>"+"</div>");
                                $(".V_progressBar").append("<span class='V_barSpan'"+'id=bBs'+indexId+' style=left:'+domWidth+">"+btiem+"</span>")
                                $('#Ts'+indexId).css({"left":cX-11,"top":cY-29,"display":"block"});
                                var mes={left:cX-11,top:cY-29,message:text,btiem:btiem,leftX:domWidth};
                                Data[Data.length]=mes;
                                sessionStorage.ImgData=JSON.stringify(Data);
                        }
                        });//确认编辑
                        $(document).on('mouseenter','[id*=Ts]',function(e){
                        var m=$(this).attr('id').replace(/[^0-9]/ig, "");
                        // if(e.which==3){
                            e.stopPropagation();
                            removeId=m;
                            $('.V_chooseBox').remove();
                            Rleft=$(this).css("left").replace(/[^0-9]/ig, "");
                            Rtop=$(this).css("top").replace(/[^0-9]/ig, "");
                            var l=e.clientX-$(dom).offset().left,t=e.clientY-$(dom).offset().top;
                            $(this).append("<div class='V_chooseBox'><ul><li id='deleteSign'>X</li></ul></div>");
                            $('.V_chooseBox').css({"left":45,"top":-20});
                        // }
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
                                sessionStorage.ImgData=JSON.stringify(Data);
                                break;
                            }else{
                                continue;
                            }
                        }
                    }//删除
                    function loading(data){
                    $('.V_signIndex,.V_barSpan').remove()
                    if(data!=null){
                        var l=Data.length;
                        for(var i=0;i<data.length;i++){
                            indexId++
                            var Dtiem="'"+Number(data[i].btiem)+"'";
                            var Rtiem=Dtiem.replace('.','_');
                            $(DOM).append("<div class='V_signIndex bBs"+Rtiem.replace("'",'')+" id=Ts"+l+" theSign="+data[i].message+" data-btiem="+Number(data[i].btiem)+">"+"<div class='V_hintBox'"+"title="+data[i].message+">"+data[i].message+"</div>"+"</div>");
                            $(".V_progressBar").append("<span class='V_barSpan'"+'id=bBs'+l+' style=left:'+data[i].leftX+">"+Number(data[i].btiem)+"</span>");
                            $('#Ts'+l).css({"left":Number(data[i].left),"top":Number(data[i].top)});
                            l++;
                        }
                    indexId=l;
                    }
                }//载入数据


                $(document).on('click','.V_signIndex',function(){  //点击标记
                    var thisTiem=$.trim($(this).attr('data-btiem'));
                    myFun(thisTiem);
                });

                $(document).on('click','.V_progressBar .V_barSpan',function(){ // 点击进度条上面的标记
                    myPlayer.pause();
                    $(".V_signIndex").hide();
                    var thisTiem=$.trim($(this).text());
                    var DthisTiem=thisTiem;
                    var RthisTiem=DthisTiem.replace('.','_');
                    $(".bBs"+RthisTiem).show();
                    //console.log(RthisTiem);
                    myFun(thisTiem);
                })	

                $(document).on('click','.V_markVjs',function(){
                        $(".V_inputSignBox").hide();
                })
                function myFun(thisTiem){ //时间跳转
                    myPlayer.currentTime(thisTiem);
                }
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
               this.VedioGet();
               sessionStorage.removeItem('ImgData');
            }, ()=>{
               this.$Message.error(msg.data.err_message);
            })
        }else{
            this.$axios.post(url,qs.stringify(Okparams)).then(msg=>{
               this.$Message.success(msg.data.err_message);
               this.VedioGet();
               sessionStorage.removeItem('ImgData');
            }, ()=>{
               this.$Message.error(msg.data.err_message);
            })
        }
      },   
        vedioLoad(){
            $.sign.bindSign('.V_markVjs');
            $.sign.loadingSign(this.data);
            document.oncontextmenu = function(e){
                e.preventDefault();
            };
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
        VedioGet(){
             let _this=this;
             _this.VideoURL=_this.storeFileURl;
             sessionStorage.removeItem('ImgData')
             //  列表高度
             $(".stageListRow").height(480)
            //  获取视频的标注信息
            let TaskID=_this.storeTaskID;
            let url=_this.GLOBAL.baseRouter+'task/task/task-stage&task_id='+TaskID;
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
                        _this.insUid=val.insUid;
                        _this.cliUid=val.cliUid;
                        _this.liIndex=index;
                        _this.fileID=val.file.id;
                        _this.stageID=val.file.stage_id;
                    }
                })
                _this.changeState(_this.StateFeedBack)
                _this.Vdefault();
                _this.vedioLoad();
                // 把StageID传到提交
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