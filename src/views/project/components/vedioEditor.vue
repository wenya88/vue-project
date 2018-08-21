<template>
    <div>
        <div class="videoM">
            <!--<div class="controlListRow" @mouseenter="showStageList">文件上传记录</div>-->
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
                        <span>{{index + 1}}<br/>{{item.stage_name}}</span>
                        <em>
                            {{item.inside_audit_time > item.client_audit_time ? item.inside_audit_date : item.client_audit_date}}<br/>
                            {{item.status | filtStat}}
                        </em>
                        <div class="clear"></div>
                    </li>
                </ul>
            </div>
            <div class='V_markVjs' style="display:none;top:0px;left:0px;"></div>
            <!-- 进度条 -->
            <div class="V_progressBar" style="top:0px;left:0px;"></div>
            <section class="canvasContainer">
                <!--<video id="my-video" class="video-js" controls   width="810" height="this.videoHeight" data-setup="{}">-->
                <!--<source :src="VideoURL" type="video/mp4">-->
                <!--</video>-->
                <!--视频-->
                <video id="haha" style="width:100%;object-fit: fill;">
                    <source :src="VideoURL" type="video/mp4">
                </video>
                <!--进度条-->
                <div class="controls">
                    <!--移动小圆点-->
                    <span v-show="!isCanvas" id="circle" class="circleSign">
                        <span id="circleSpot" class="circleSpot"></span>
                    </span>
                    <span v-show="!isCanvas" class="progressBar" @click="pictureJump" @mousedown="pictureMove"></span>
                    <i v-show="!isCanvas" class="strip"></i>
                    <!--canvas标注-->
                    <ul v-show="!isCanvas" class="progressSignUl">
                        <li v-if="item.left && item.width" v-for="(item,index) in timeList" class="progressSign"
                            :style="{'width':item.width+'px','left':(item.left<0?-1*item.left:item.left)+'px'}"
                            :class="labelHighlight===index && editCas?'highlight':''" :key="index">
                            <p class="progressSignText" @click="editCanvasDate(item,index)">
                                {{labelHighlight === index && editCas ? '存' : '改'}}</p>
                            <p v-if="labelHighlight===index && editCas" class="progressSignText"
                               @click="delCanvas(item)" type="text">删</p>
                        </li>
                    </ul>
                    <!--刻度-->
                    <ul v-show="!isCanvas" class="scaleUl">
                        <li v-for="(item,index) in articleScale" class="scale" :key="index"></li>
                    </ul>

                    <!--时间显示和视频开关-->
                    <Icon v-show="switchIcon&&!isCanvas" @click.native.prevent="videoStart" class="startButton"
                          type="play"></Icon>
                    <Icon v-show="!switchIcon&&!isCanvas" @click.native.prevent="pauseButton" class="startButton"
                          type="pause"></Icon>
                    <span v-if="video"
                          class="controlsTime">{{currnt_time | dateType}}/{{video.duration | dateType}}</span>
                </div>
                <!--video画布-->
                <canvas v-show="isCanvas" id="myCanvas" :width="videoWidth" :height="videoHeight" class="videoCanvas"
                        style="border:1px solid #d3d3d3;">
                    Your browser does not support the HTML5 canvas tag.
                </canvas>
                <!--画板画布-->
                <canvas id="tu" class="drawMain" :width="videoWidth" :height="videoHeight"
                        :style="[isCanvas?{'z-index':'113'}:{},hideSign?{'opacity':0}:{'opacity':1}]"
                        @click.stop="drawText" @mousedown.prevent="paletteInit"
                        style="border:1px solid #d3d3d3;opacity: 0">
                    Your browser does not support the HTML5 canvas tag.
                </canvas>
                <!--move画布-->
                <canvas v-show="isCanvas" id="tu2" class="drawTrans" :width="videoWidth" :height="videoHeight"
                        style="border:1px solid #d3d3d3;">
                    Your browser does not support the HTML5 canvas tag.
                </canvas>

                <!--<div v-show="switchIcon&&!isCanvas"   class="masking" @click="videoStart" >-->
                <!--<Icon class="circleIcon"  type="play"></Icon>-->
                <!--</div>-->
                <div v-show="!switchIcon&&!isCanvas" class="masking" @click="pauseButton"></div>

                <input v-show="drawTextShow" @blur="drawText" v-model="drawTextValue" type="text" class="textInput"
                       :style="{'top':top+'px','left':left+'px'}">
            </section>
            <!--操作按钮-->
            <div class="canvasEdit">
                <i class="project_instrument tagimage"></i>
                <p class="canvasEditText">审核工具</p>
                <Icon @click.native="updateFrame('before')" type="skip-backward" class="videoicon"
                      title="上一帧"></Icon>
                <Icon @click.native="updateFrame('after')" type="skip-forward"
                      class="videoicon" title="下一帧"></Icon>

                <Icon v-show="!isCanvas" @click.native="startCanvas" type="paintbrush" class="videoicon"
                      title="修改标记"></Icon>
                <template v-if="isCanvas">

                    <Icon @click.native=" isRect = false;isLine = true;isText = false" type="edit"
                          :class="[{'editHover':isLine},'edit','videoicon']" title="画笔"></Icon>

                    <i @click="changeText" :class="[{'textHover':isText},'text','videoicon']">A</i>
                    <span class="canvasicon"> <i class="little " @click="changelineWidth(1)"></i></span>
                    <span class="middleBox"> <i class="middle " @click="changelineWidth(5)"></i></span>
                    <span class="bigBox"> <i class="big " @click="changelineWidth(8)"></i></span>

                    <span class="canvasicon" @click="changeColor('#fff')"> <i class="fff" ></i></span>
                    <span class="canvasicon" @click="changeColor('black')">  <i class="black " ></i></span>
                    <span class="canvasicon" @click="changeColor('#ff512e')"> <i class="red " ></i></span>
                    <span class="canvasicon" @click="changeColor('#66DAFF')">  <i class="blue " ></i></span>
                    <span class="canvasicon" @click="changeColor('#FFB14D')"><i class="orange " ></i></span>
                </template>
                <Icon v-show="hideSign" @click.native="hideSign = !hideSign" type="eye" class="videoicon"
                      title="显示标记"></Icon>
                <Icon v-show="!hideSign" @click.native="hideSign = !hideSign" type="eye-disabled" class="videoicon"
                      title="隐藏标记"></Icon>
                <span  class="saveButton" v-show="isCanvas" @click="saveCanvas" >保存</span>
                <span  class="saveButton" v-show="isCanvas" @click="clearCanvas" >取消</span>
                <!--<Button  type="text">{{hideSign ? '显示标记' : '隐藏标记'}}</Button>-->

            </div>
            <!-- 标注提交 -->
            <div v-if="AllowEditRow" class="VideoAllowEdit">
                <i class="project_opinion tagimage"></i>
                <span style="color: #868788;margin-left: 20px;line-height: 30px;">审核意见</span>
            <span class="text">
                <textarea name="" id="EditInput"  placeholder="请输入你要反馈的内容" v-model="FeedbackValue"></textarea>
                <!--<input type="text"  id="EditInput" v-model="FeedbackValue">-->
            </span>
                <span class="EditSub">
                <button class="actionPost" @click="commitEidt('edit')">需修改</button>
            </span>
                <span class="EditSub" v-if="data==null?true:false">
                <button class="subPass" @click="commitEidt('ok')">通过</button>
                <em @click="InfoRefresh" id="InfoRefresh"></em>
            </span>
            </div>
            <!-- 反馈信息 -->
            <div v-if="SataeInfo" class="VideofeedbackInfo">
                <span><p>反馈状态</p><br/>{{StateFeedBack | filtStat}}</span>
                <span><p>时间</p><br/>{{insTime > cliTiem ? insDate : cliDate}}</span>
                <span><p>审核人</p><br/>{{insTime > cliTiem ? insUid : cliUid}}</span>
                <div class="clear"></div>
            </div>
            <img id="img" :src="img" style="opacity:0" alt="">
        </div>
        <Modal
                v-model="saveCanvasShow"
                title="画布保存"
                width="300"
                @on-ok="saveCanvas"
                @on-cancel="clearCanvas"
        >
            <p>是否保存画布?</p>
        </Modal>
    </div>
</template>
<script>

    var Data = [];
    import api from 'api'
    //import {baseUrl, deletetaskData} from '../../../config/env.js';
    var qs = require('querystring');
    export default {
        data() {
            return {
                highlightSign: null,
                hideSign: false,
                labelHighlight: null,
                editCas: false,  //标注编辑
                articleScale: [],  // 刻度
                saveCanvasWindow: true, // 保存弹窗
                saveCanvasShow: false,
                videoWidth: null,  //canvas 宽度
                videoHeight: null,  //canvas 宽度
                switchIcon: true, //开始暂停按钮
                linshishuju: JSON.parse(sessionStorage.getItem('videoTime')) || [], //接口数据
                timeList: [], //进度条标注
                img: '', //canvas二进制
                stage_id: null, // 阶段id
                percentage: '',// 百分比
                drawTextValue: '', // canvas文字
                drawTextShow: false,
                isCanvas: false, // 画布开关
                video: null, // 视频dom
                videoCas: null, // 视频层canvas
                ctx: null, // 画板canvas
                canvas: null,
                currnt_time: 0,  //当前播放时间
                color: 'black', // 画板颜色
                lineWidth: 5,  //画板粗细
                x: null,  //起始x
                y: null,
                newX: null,  //更新x
                newY: null,
                minx: null,
                miny: null,
                maxx: null,
                maxy: null,
                isRect: false,  //画矩形
                isLine: true, // 画线
                isText: false,
                top: null,
                left: null,
                timeId: '',
                /*上面是标注*/
                data: [],
                TID: 49,
                AllowEdit: String,
                AllowEditRow: false,
                SataeInfo: false,
                StateFeedBack: 0,
                IMGlist: [],
                insTime: 0,
                cliTiem: 0,
                insDate: 0,
                cliDate: 0,
                insUid: 0,
                cliUid: 0,
                liIndex: 0,
                VideoURL: '',
                fileID: 0,
                stageID: 0,
                FeedbackValue: ''
            }
        },
        filters: {
            filtStat(val) {
                if (val == 1) {
                    return '内部待审'
                } else if (val == 2) {
                    return '客户待审'
                } else if (val == 3) {
                    return '内部已反馈'
                } else if (val == 4) {
                    return '客户已反馈'
                } else if (val == 5) {
                    return '审核通过'
                } else {
                    return '--'
                }
            },
            dateType(time) {
                return time.toFixed(2)
            }
        },
        mounted() {
            $LAB
                .script("/src/js/video.js").wait(() => {
                this.Vdefault();
                this.vedioLoad();
            });
            this.video = document.getElementById("haha");           // 视频
            this.VedioGet();

        },
        created() {
            this.AddVedioJS();
        },
        destroyed() {
            clearInterval(this.timeId)
        },
        computed: {
            storeTaskID() {
                return this.$store.state.ImgVedioStatus.TaskID
            },
            storeFileURl() {
                return this.$store.state.ImgVedioStatus.FileURl
            }
        },
        methods: {

            InfoRefresh() {
                this.$bus.emit('InfoRefresh')
            },
            changCont(file, tag, status, insTime, cliTiem, insDate, cliDate, insUid, cliUid, index, taskID, fid) {
                this.VideoURL = file;
                this.data = tag;
                this.StateFeedBack = status;
                this.insTime = insTime;
                this.cliTiem = cliTiem;
                this.insDate = insDate;
                this.cliDate = cliDate;
                this.insUid = insUid;
                this.cliUid = cliUid;
                this.liIndex = index;
                this.fileID = fid;
                this.stageID = taskID;
                this.changeState(this.StateFeedBack);
                this.AddVedioJS();
                this.vedioLoad();
                //  切换视频初始化播放器
                let myPlayer = videojs('my-video');
                myPlayer.load(this.VideoURL);
                myPlayer.play();
            },
            //追加video.js文件
            AddVedioJS() {
                $(".video_js").remove();
                let head = document.getElementsByTagName('head')[0];
                let script = document.createElement('script');
                script.async = true;
                script.src = "http://vjs.zencdn.net/6.6.3/video.js";
                script.classList.add("video_js")
                head.appendChild(script);
            },
            // videojs控制
            Vdefault() {
                var btiem
                var myPlayer = videojs('my-video');
                videojs("my-video").ready(function () {
                    var myPlayer = this;
                    myPlayer.play();
                    $(".vjs-volume-panel,.vjs-fullscreen-control").hide();
                    var myPWidth = myPlayer.width();
                    var myPHeigth = myPlayer.height() - 36;
                    $(".V_markVjs").css({'width': myPWidth, 'height': myPHeigth});//设置标记层
                    $(".V_progressBar").css({'width': myPWidth - 119, 'top': myPHeigth + 2, 'left': 58});//设置进度条
                });

                function PauPlay() { //暂停方法
                    $(".V_markVjs").show()
                    var domWidth = document.getElementsByClassName("vjs-play-progress")[0].style.width;//获取正在播放进度条的宽度
                    var Ftiem = myPlayer.currentTime();//获取时间
                    btiem = Number(Ftiem).toFixed(2);//保留2位小数
                    return domWidth
                }

                myPlayer.on('pause', function () {//暂停播放
                    $(".V_signIndex").hide();
                    PauPlay();
                });

                myPlayer.on('play', function () { //开始播放
                    $(".V_markVjs,.V_signIndex").hide();  //标记层和标记隐藏
                });

                // -----------------图片标识-----------------
                var cX, cY, indexId = 0, removeId, DOM
                var Rleft, Rtop;//需要删除的坐标
                jQuery.sign = {
                    bindSign: function (dom) {
                        DOM = dom;
                        defined(dom);
                    },
                    loadingSign: function (data) {
                        loading(data);
                        Data.concat(data);
                    }
                };
                //阻止鼠标右键默认事件
                document.oncontextmenu = function (e) {
                    PauPlay();
                    myPlayer.pause();
                    e.preventDefault();
                };

                function defined(dom) {
                    if (sessionStorage.AllowEdit == "NotAllow" || sessionStorage.AllowEdit == "Other") {  //是否允许标记
                        return
                    }
                    $(document).on("mousedown", dom, function (e) {
                        e.preventDefault();
                        if (e.which == 3) {
                            $(".V_inputSignBox").remove();
                            var l = e.clientX - $(dom).offset().left;
                            var t = e.clientY - $(dom).offset().top;
                            cX = l;
                            cY = t;
                            $(dom).append("<div class='V_inputSignBox'></div>");
                            $('.V_inputSignBox').append("<div class='V_outSignbox'>X</div>");
                            $('.V_inputSignBox').append("<div class='V_signbox' contenteditable='true' id='inputText' tabindex='-1'><em id='deflutText'>输入标记</em></div>");
                            $('.V_inputSignBox').append("<div class='V_sureSign'>标注</div>");
                            $('.V_inputSignBox').css({"left": cX, "top": cY});
                            e.stopPropagation();
                        }
                    });

                    //添加编辑
                    $(document).on('click', '#inputText', function (e) {
                        $(this).focus();
                        $('.V_signbox em').remove();
                        e.stopPropagation();
                    });//编辑框聚焦
                    $(document).on('click', '.V_outSignbox', function () {
                        $('.V_inputSignBox').remove();
                    });//退出编辑
                    $(document).on('click', '.V_sureSign', function () {
                        if ($('.V_signbox em').length > 0) {
                            $('.V_inputSignBox').remove();
                        } else if ($('.V_signbox').text().length <= 0) {
                            $('.V_inputSignBox').remove();
                        } else {
                            var domWidth = PauPlay()
                            indexId++;
                            var text = $.trim($('.V_signbox').text());
                            $('.V_inputSignBox').remove();
                            var Dtiem = "'" + btiem + "'";
                            var Rtiem = Dtiem.replace('.', '_');
                            $(dom).append("<div class='V_signIndex bBs" + Rtiem.replace("'", '') + "' id=Ts" + indexId + " theSign=" + text + " data-btiem=" + btiem + ">" + "<div class='V_hintBox'" + "title=" + text + ">" + text + "</div>" + "</div>");
                            $(".V_progressBar").append("<span class='V_barSpan'" + 'id=bBs' + indexId + ' style=left:' + domWidth + ">" + btiem + "</span>")
                            $('#Ts' + indexId).css({"left": cX - 11, "top": cY - 29, "display": "block"});
                            var mes = {left: cX - 11, top: cY - 29, message: text, btiem: btiem, leftX: domWidth};
                            Data[Data.length] = mes;
                            sessionStorage.ImgData = JSON.stringify(Data);
                        }
                    });//确认编辑
                    $(document).on('mouseenter', '[id*=Ts]', function (e) {
                        var m = $(this).attr('id').replace(/[^0-9]/ig, "");
                        // if(e.which==3){
                        e.stopPropagation();
                        removeId = m;
                        $('.V_chooseBox').remove();
                        Rleft = $(this).css("left").replace(/[^0-9]/ig, "");
                        Rtop = $(this).css("top").replace(/[^0-9]/ig, "");
                        var l = e.clientX - $(dom).offset().left, t = e.clientY - $(dom).offset().top;
                        $(this).append("<div class='V_chooseBox'><ul><li id='deleteSign'>X</li></ul></div>");
                        $('.V_chooseBox').css({"left": 45, "top": -20});
                        // }
                    });//弹出取消标记
                    $(document).on('click', '#deleteSign', function () {
                        deleteData(Rleft, Rtop);
                        $('#Ts' + removeId).remove();
                        $('#bBs' + removeId).remove();
                    });

                    $(document).click(function () {
                        $('.V_chooseBox').remove();
                    });
                    //点击消失
                }

                function deleteData(left, top) {
                    for (var i = 0; i < Data.length; i++) {
                        if (Data[i].left == left && Data[i].top == top) {
                            Data.splice(i, 1);
                            sessionStorage.ImgData = JSON.stringify(Data);
                            break;
                        } else {
                            continue;
                        }
                    }
                }//删除
                function loading(data) {
                    $('.V_signIndex,.V_barSpan').remove()
                    if (data != null) {
                        var l = Data.length;
                        for (var i = 0; i < data.length; i++) {
                            indexId++
                            var Dtiem = "'" + Number(data[i].btiem) + "'";
                            var Rtiem = Dtiem.replace('.', '_');
                            $(DOM).append("<div class='V_signIndex bBs" + Rtiem.replace("'", '') + " id=Ts" + l + " theSign=" + data[i].message + " data-btiem=" + Number(data[i].btiem) + ">" + "<div class='V_hintBox'" + "title=" + data[i].message + ">" + data[i].message + "</div>" + "</div>");
                            $(".V_progressBar").append("<span class='V_barSpan'" + 'id=bBs' + l + ' style=left:' + data[i].leftX + ">" + Number(data[i].btiem) + "</span>");
                            $('#Ts' + l).css({"left": Number(data[i].left), "top": Number(data[i].top)});
                            l++;
                        }
                        indexId = l;
                    }
                }//载入数据


                $(document).on('click', '.V_signIndex', function () {  //点击标记
                    var thisTiem = $.trim($(this).attr('data-btiem'));
                    myFun(thisTiem);
                });

                $(document).on('click', '.V_progressBar .V_barSpan', function () { // 点击进度条上面的标记
                    myPlayer.pause();
                    $(".V_signIndex").hide();
                    var thisTiem = $.trim($(this).text());
                    var DthisTiem = thisTiem;
                    var RthisTiem = DthisTiem.replace('.', '_');
                    $(".bBs" + RthisTiem).show();

                    myFun(thisTiem);
                })

                $(document).on('click', '.V_markVjs', function () {
                    $(".V_inputSignBox").hide();
                })

                function myFun(thisTiem) { //时间跳转
                    myPlayer.currentTime(thisTiem);
                }
            },

            //需要修改
            commitEidt(type) {
                let url = this.GLOBAL.baseRouter + 'task/task/inside-audit'
                let Okparams = {
                    "stage_id": this.stageID,
                    "audit": 1,//1为通过审核,2为不通过
                    "feedback": '',
                    "file": [JSON.stringify({
                        "file_id": this.fileID,
                        "tag": JSON.parse(sessionStorage.getItem('videoTime')) || []
                    })]
                };
                let EDITparams = {
                    "stage_id": this.stageID,
                    "audit": 2,
                    "feedback": this.FeedbackValue,
                    "file": JSON.stringify([{
                        "file_id": this.fileID,
                        "tag": JSON.parse(sessionStorage.getItem('videoTime')) || []
                    }])
                };
                if (type == 'edit') {
                    this.$axios.post(url, qs.stringify(EDITparams)).then(msg => {
                        this.$Message.success(msg.data.err_message);
                        this.VedioGet();
                        sessionStorage.removeItem('ImgData');
                    }, () => {
                        this.$Message.error(msg.data.err_message);
                    })
                } else {
                    this.$axios.post(url, qs.stringify(Okparams)).then(msg => {
                        this.$Message.success(msg.data.err_message);
                        this.VedioGet();
                        sessionStorage.removeItem('ImgData');
                    }, () => {
                        this.$Message.error(msg.data.err_message);
                    })
                }
            },
            vedioLoad() {
                $.sign.bindSign('.V_markVjs');
                $.sign.loadingSign(this.data);
                document.oncontextmenu = function (e) {
                    e.preventDefault();
                };
            },
            changeState(state) {
                //  控制图片是否可标注
                if (state == 1 || state == 2) {
                    sessionStorage.AllowEdit = "Allow";//允许标注
                    this.AllowEditRow = true;
                    this.SataeInfo = false;
                } else if (state == 3 || state == 4 || state == 5) {
                    sessionStorage.AllowEdit = "NotAllow";//不允许标注
                    this.AllowEditRow = false
                    this.SataeInfo = true;
                } else {
                    sessionStorage.AllowEdit = "Other";//不显示下面和不允许标注
                    this.AllowEditRow = false;
                    this.SataeInfo = false;
                }
            },
            VedioGet() {
                let _this = this;
                _this.VideoURL = _this.storeFileURl;
                sessionStorage.removeItem('ImgData')
                //  列表高度
                $(".stageListRow").height(480)
                //  获取视频的标注信息
                let TaskID = _this.storeTaskID;
                let url = _this.GLOBAL.baseRouter + 'task/task/task-stage&task_id=' + TaskID;
                _this.$axios.get(url).then(function (msg) {
                    let Sdate = msg.data;
                    if (Sdate.err_code == 0) {
                        _this.IMGlist = [];
                        _this.IMGlist = Sdate.data;
                        _this.IMGlist.forEach((val, index) => {
                            if (val.file.file == _this.storeFileURl) {
                                // 设置初始化值
                                _this.data = val.file.tag;
                                _this.StateFeedBack = val.status;
                                _this.insTime = val.inside_audit_time;
                                _this.cliTiem = val.client_audit_time;
                                _this.insDate = val.inside_audit_date;
                                _this.cliDate = val.client_audit_date;
                                _this.insUid = val.insUid;
                                _this.cliUid = val.cliUid;
                                _this.liIndex = index;
                                _this.fileID = val.file.id;
                                _this.stageID = val.file.stage_id;
                            }
                        })
                        _this.changeState(_this.StateFeedBack)
                        _this.Vdefault();
                        _this.vedioLoad();
                        sessionStorage.setItem('videoTime', JSON.stringify(msg.data.data[0].file.tag));
                        // 把StageID传到提交
                    } else {
                        return
                    }
                }, () => {
                    _this.$Message.error('请求失败')
                })
            },
            showStageList() {
                document.getElementsByClassName('controlListRow')[0].style.display = 'none';
                document.getElementsByClassName('stageListRow')[0].style.display = 'block';
            },
            hideStageList() {
                document.getElementsByClassName('controlListRow')[0].style.display = 'block';
                document.getElementsByClassName('stageListRow')[0].style.display = 'none';
            },
            /*启动视频*/
            videoStart() {
                this.switchIcon = false;
                this.video.play();
                this.videoInit();

            },
            /*临时的暂停*/
            pauseButton() {
                this.switchIcon = true;
                this.video.pause();
            },
            /*进度条*/
            timeNum() {
                if (this.video.readyState > 0) {
                    let zhen = parseFloat(this.video.duration);
                    this.percentage = this.video.currentTime / zhen;
                    document.querySelector('#circle').style.width = this.percentage * (this.videoWidth - 10) + 'px';
                    document.querySelector('#circleSpot').style.left = this.percentage * (this.videoWidth - 10) - 7 + 'px';
                }
            },
            /*开启画布*/
            startCanvas() {
                this.switchIcon = !this.switchIcon; // 暂停按钮
                if (this.isCanvas && this.saveCanvasWindow) {
                    this.saveCanvasShow = true;
                } else if (!this.isCanvas) {
                    this.saveCanvasWindow = true
                }
                this.isCanvas = !this.isCanvas;
                this.init();
                clearInterval(this.timeId);
//                this.timeNum();
                this.isRect = false;
                this.isLine = true;
                this.isText = false;
            },
            /*删除画布*/
            delCanvas(item) {
                this.linshishuju.map((item, index, arr) => {
                    if (this.highlightSign.time[0] === item.time[0] && this.highlightSign.time[1] === item.time[1]) {
                        arr.splice(index, 1);
                        this.showVideoSign();
                        this.ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
                        sessionStorage.setItem('videoTime', JSON.stringify(this.linshishuju));
                        this.editCas = !this.editCas;
                    }
                });
            },
            /*进入编辑标注模式*/
            editCanvasDate(item, index) {

                this.highlightSign = item;
                this.editCas = !this.editCas;
                this.labelHighlight = index
            },
            /*进度条拖拽*/
            pictureMove() {
                document.querySelector('.progressBar').addEventListener("mousemove", this.pictureJump);
//                document.querySelector('#circle').addEventListener("mouseup", this.pictureJump);
            },

            /*画面跳转*/
            pictureJump(e) {
                let time = this.video.duration * e.offsetX / (this.videoWidth - 10);
                /*编辑进度条*/
                if (!this.editCas) {
                    this.getVasList();
                    this.videoInit(true);
//                    this.timeNum();
                    this.video.currentTime = time;
                    /*暂停时跳转后暂停*/
                    this.currnt_time = time;
                }
                /*编辑标注*/
                else {
                    this.editTag(time)
                }
            },
            /*编辑标注*/
            editTag(time) {
                let newTime = null;

                let average = (this.highlightSign.time[0] + this.highlightSign.time[1]) / 2;
                /*点击标记左边*/
                if (time < average) {
                    this.highlightSign.time[0] = time;
                    newTime = this.highlightSign.time;
                }
                /*点击标记右边*/
                else if (time > average) {
                    this.highlightSign.time[1] = time;
                    newTime = this.highlightSign.time;
                }

                this.linshishuju.map((item, index, arr) => {
                    if (this.highlightSign.time[0] === item.time[0] && this.highlightSign.time[1] === item.time[1]) {
                        item.time = newTime;
                        this.timeNum();
                        this.showVideoSign();
                        sessionStorage.setItem('videoTime', JSON.stringify(this.linshishuju));
                    }
                });
            },
            /*播放插入标注*/
            videoInit(isPictureJump) {
                this.currnt_time = this.video.currentTime;
//                this.ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
                let timeId = setInterval(() => {
                    this.currnt_time = this.video.currentTime;

                    /*暂停播放*/
                    if (isPictureJump || this.switchIcon || this.isCanvas) {
                        clearInterval(timeId)
                    }

                    /*播放完停止*/
                    if (this.currnt_time >= this.video.duration) {
                        this.currnt_time = this.video.duration;

                        clearInterval(timeId)
                        this.switchIcon = !this.switchIcon
                    }

                    /*进度条*/
                    this.timeNum();
                    this.getVasList();
                }, 25);
            },
            /* 显示进度条标注 */
            showVideoSign() {
                let timeId = setInterval(() => {
                    if (this.video.readyState > 0) {
                        this.timeList = this.linshishuju;
                        this.timeList.map((item, index) => {
                            item.left = parseFloat(item.time[0] / this.video.duration * (this.videoWidth - 10));
                            item.width = parseFloat((item.time[1] - item.time[0]) / this.video.duration * (this.videoWidth - 10));
                        });
                        this.articleScaleList();
                        clearInterval(timeId)
                    }
                }, 25);
            },
            /*刻度*/
            articleScaleList() {
                this.articleScale = Array.from(new Array(parseInt(this.video.duration) + 1))
//                this.articleScale
            },
            /*canvas初始化*/
            init() {
//                this.video = document.getElementById("haha");           // 视频
                this.videoCas = document.getElementById("myCanvas");    // 获取视频图像的画布
                this.canvas = document.getElementById("tu");            // 画板
                this.canvasTans = document.getElementById("tu2");       // 矩形move画板

                this.video.volume = 0;  // 音量为0 方便调试

                const width = this.video.offsetWidth;
                const height = this.video.offsetHeight;

                this.videoWidth = width;
                this.videoHeight = height;
                this.videoCas.style.width = width + 'px';
                this.videoCas.style.height = height + 'px';
                this.canvas.style.width = width + 'px';
                this.canvas.style.height = height + 'px';
                this.canvasTans.style.width = width + 'px';
                this.canvasTans.style.height = height + 'px';

                this.videoCtx = this.videoCas.getContext('2d');
                this.ctx = this.canvas.getContext('2d');
                this.ctxTans = this.canvasTans.getContext('2d');

                document.body.addEventListener('mouseup', this.beyondArea);


//                this.timeNum(); // 进度条
                if (!this.isCanvas) {
                    return false
                }
                /*点击开启画布*/
                this.video.pause();
                setInterval(() => {

                    this.videoCtx.drawImage(this.video, 0, 0, this.videoWidth, height);
                }, 25)
            },
            /*body鼠标离开触发*/
            beyondArea() {
                this.canvas.removeEventListener("mousemove", this._move);
                if (document.querySelector('.progressBar')) {
                    document.querySelector('.progressBar').removeEventListener("mousemove", this.pictureJump);
                }
            },
            /*点击矩形*/
            changeRect() {
                this.isRect = true;
                this.isLine = false;
                this.isText = false
            },
            /*点击文字*/
            changeText() {
                this.isText = true;
                this.isLine = false;
                this.isRect = false
            },
            /*点击改变大小*/
            changelineWidth(lineWidth) {
                this.lineWidth = lineWidth
            },
            /*点击改变颜色*/
            changeColor(color) {
                this.color = color
            },
            /*画板初始化*/
            paletteInit(e) {

                if (!this.isCanvas) {
                    return false
                }
                //鼠标点击在canvas中的位置
                this.x = e.offsetX;
                this.y = e.offsetY;

                //记录旧的点
                this.newX = this.x - 1;
                this.newY = this.y - 1;

                if (this.isText) {
                    this.canvas.removeEventListener("mouseup", this._up);
                }

                //画笔功能
                if (this.isLine) {
                    this.drawLine();
                    this.canvas.addEventListener("mousemove", this._move);
                    this.canvas.addEventListener("mouseup", this._up);
                } else if (this.isText && !this.drawTextShow) {
                    this.top = this.y;
                    this.left = this.x;
                    this.drawTextShow = true;
                } else if (this.isRect) {

                    this.canvas.addEventListener("mousemove", this._drawRectTans);
                    this.canvas.addEventListener("mouseup", this._drawRect);
                }
                ;


            },
            /*canvas画笔功能*/
            drawLine() {
                this.ctx.beginPath();
                this.ctx.strokeStyle = this.color;
                //线的宽度
                this.ctx.lineWidth = this.lineWidth;
                //线的样式
                this.ctx.lineCap = "round";
                this.ctx.moveTo(this.x, this.y);
                this.ctx.lineTo(this.newX, this.newY);
                this.ctx.stroke();
                this.ctx.closePath();
            },
            /*canvas文字*/
            drawText() {
                this.drawTextShow = false;
                this.ctx.font = "20px Arial";
                this.ctx.fillText(this.drawTextValue, this.left + 8, this.top + 12);
                this.drawTextValue = '';
            },
            /*渲染二进制图片*/
            getVasList() {
                if (this.linshishuju) {
                    let show = true;
                    this.linshishuju.map((item) => {
                        /*渲染画布 时间段*/
                        if (this.currnt_time >= item.time[0] && this.currnt_time <= item.time[1]) {
                            // this.video.pause(); // 遇到标记暂停
                            show = false;
                            this.img = item.image;
//                            this.switchIcon = true; // 遇到标记暂停
                            setTimeout(() => {
                                this.ctx.drawImage(document.querySelector('#img'), 0, 0, this.videoWidth, this.videoHeight);
                            }, 30);
                        }
                    });
                    if (show) {
                        this.ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
                    }
                }
            },
            /*保存 暂时还是假数据*/
            async saveCanvas() {

                this.showVideoSign();
                if (this.saveCanvasShow) {
                    this.saveCanvasShow = false;
                }
                let isExist = true;
                let image = this.canvas.toDataURL("image/png");
                let json = {
                    "time": [this.currnt_time - .025, this.currnt_time + .025],
                    "image": image
                };

                /*修改*/
                /*   this.linshishuju.map((item, index) => {
                       if( this.currnt_time >= item.time[0] && this.currnt_time <= item.time[1] ){
                           item.image = image;
                           isExist = false;
                       }
                   });*/

                /*添加*/
                if (isExist) {
                    this.linshishuju.push(json);
                }

                sessionStorage.setItem('videoTime', JSON.stringify(this.linshishuju));
//                const data = await api.insideAudit({stage_id:this.stageID,audit:audit})
                this.isCanvas = !this.isCanvas
//                this.saveCanvasShow = true;
            },
            /*清空画布*/
            clearCanvas() {
                this.isCanvas = !this.isCanvas;
                this.ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
            },

            /*鼠标移动画矩形*/
            _drawRectTans(e) {
                let width = this.newX - this.x,
                    height = this.newY - this.y;
                this.newX = e.offsetX;
                this.newY = e.offsetY;
                this.ctxTans.clearRect(0, 0, this.canvasTans.clientWidth, this.canvasTans.clientHeight);
                this.ctxTans.strokeRect(this.x, this.y, width, height)
            },
            /*鼠标离开画矩形*/
            _drawRect(e) {
                let width = this.newX - this.x,
                    height = this.newY - this.y;
                this.newX = e.offsetX;
                this.newY = e.offsetY;
                this.ctxTans.clearRect(0, 0, this.canvasTans.clientWidth, this.canvasTans.clientHeight);
                this.ctx.strokeRect(this.x, this.y, width, height);

//                this.ctx.rect(5,5,290,140);
//                this.ctx.stroke();
                this.canvas.removeEventListener("mousemove", this._drawRectTans);
            },
            /*画笔移动*/
            _move(e) {
                this.x = e.offsetX;
                this.y = e.offsetY;

                if (e.offsetX < this.minx || !this.minx) {
                    this.minx = e.offsetX
                }
                if (e.offsetY < this.miny || !this.miny) {
                    this.miny = e.offsetY
                }
                if (e.offsetX > this.maxx || !this.maxx) {
                    this.maxx = e.offsetX
                }
                if (e.offsetY > this.maxy || !this.maxy) {
                    this.maxy = e.offsetY
                }


                //画笔功能
                this.drawLine();
                this.newX = this.x;
                this.newY = this.y;

            },
            /*鼠标离开*/
            _up() {
                this.canvas.removeEventListener("mousemove", this._move);
            },
            /*视频上一帧 下一帧*/
            updateFrame(type) {
                if (type === 'after') {
                    this.currnt_time += 0.03;
                } else if (type === 'before') {
                    this.currnt_time -= 0.03;
                }
                this.video.currentTime = this.currnt_time;
                this.currnt_time = this.video.currentTime;
                setTimeout(() => {
                    this.getVasList()
                }, 50);
            },
        },
        watch: {
            video(value) {
                const timeId = setInterval(() => {
                    if (value.readyState > 0) {
                        this.init();
                        this.showVideoSign();
                        clearInterval(timeId)
                    }
                }, 20)

            }
        }
    }
</script>
<style lang="less">
    @import '../../../styles/vedioEditor.less';

    .canvasContainer {
        position: relative;
        .controls {

            position: absolute;
            bottom: 20px;
            left: 0;
            width: 100%;
            padding: 0 5px;
            z-index: 112;
            .progressBar {
                display: block;
                position: absolute;
                top: -6px;
                left: 0;
                width: 100%;
                height: 25px;

                margin-top: -10px;

                z-index: 160;
            }
            .strip {
                display: block;
                width: 100%;
                height: 4px;
                margin-top: -1px;
                background: #fff;

            }
            .progressSignUl {
                width: 100%;
                .progressSign {
                    position: absolute;
                    top: -1px;
                    width: 12px;
                    height: 4px;
                    background: #22d7bb;
                    .progressSignText {
                        width: 14px;
                        height: 14px;
                        margin-top: 4px;
                        line-height: 14px;
                        text-align: center;
                        font-size: 12px;
                        color: red;
                        background: orange;
                        border-radius: 50%;
                    }
                }
                .highlight {
                    top: -10px;
                    padding: 10px 0;
                    z-index: 149;
                }
            }
            .scaleUl {
                display: flex;
                padding-left: 2px;
                margin-bottom: 5px;
                justify-content: space-between;
                .scale {
                    width: 2px;
                    height: 6px;
                    background: #ccc;
                }
            }
            .circleSign {
                display: block;
                position: absolute;
                top: -1px;
                width: 8px;
                height: 4px;
                background: #39f;
                .circleSpot {
                    position: absolute;
                    top: -2px;
                    left: -3px;
                    display: block;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: red;
                    z-index: 131;
                }
            }
            .startButton {
                margin: 0 6px;
                font-size: 18px;
                color: #39f;
                vertical-align: middle;
            }
            .controlsTime {
                font-size: 16px;
                color: #fff;
                vertical-align: middle;
            }
        }
        .video-js {

        }
        .videoCanvas {
            position: absolute;

            top: 0;
            left: 0;
            z-index: 104;

        }
        .drawMain {
            position: absolute;

            top: 0;
            left: 0;
            z-index: 106;

        }
        .drawTrans {
            position: absolute;

            top: 0;
            left: 0;
            z-index: 105;
        }
        .masking {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 420px;
            text-align: center;
            z-index: 167;
        }
        .textInput {
            position: absolute;
            width: 70px;
            z-index: 999;
            background: transparent;
            border: 1px solid transparent;
            border-bottom: 2px solid #ff512e;
            outline: none;
        }

    }
    .project_instrument{
        background: url("../../../images/project_instrument.png") no-repeat;
    }.project_opinion{
         background: url("../../../images/project_opinion.png") no-repeat;
     }
    .tagimage{
        display: block;
        width: 28px;
        height: 28px;
        background-size: 28px;
    }
    .canvasEdit {
        display: flex;
        margin: 20px 0 0 20px;
        align-items: center;
        .canvasEditText {
            height: 34px;
            line-height: 34px;
            margin: 0 20px;
            color: #868788;
        }

        .videoicon {
            padding: 5px 10px;
            font-size: 18px;
            color: #27b39c;
            background: #fff;

        }
        .videoicon,.canvasicon, .middleBox,.bigBox{
            &:hover {
                border: 1px solid #ccc;
            }
        }
        .canvasicon {
            padding: 7px 8px;
            font-size: 18px;
            color: #27b39c;
            background: #fff;

        }
        .edit {
            padding: 5px;
            font-size: 18px;
        }
        .text {
            padding: 0 10px;
            font-weight: bold;
            font-size: 18px;
            cursor:default;
        }
        .editHover, .textHover {
            border: 1px solid #ccc;
        }
        .middleBox{
            padding: 5px 6px;background: #fff
        }.bigBox{
             padding: 3px 4px;background: #fff
        }
        .saveButton{
            padding: 5px 6px;
            background: #fff;
            cursor: default	;
        }
        .little, .middle, .big {
            display: block;
            margin: 5px;
            background: black;
            border-radius: 50%;

        }
        .little {
            width: 4px;
            height: 4px;
        }
        .middle {
            width: 8px;
            height: 8px;
        }
        .big {
            width: 12px;
            height: 12px;
        }
        .black, .red, .blue, .orange, .fff {
            display: block;
            width: 14px;
            height: 14px;
            border: 1px solid #e6e6e6;

        }
        .fff {
            background: #fff;
        }
        .black {
            background: black;
        }
        .red {
            background: #ff512e;
        }
        .blue {
            background: #66daff;
        }
        .orange {

            background: #FFB14D;
        }
    }
</style>
