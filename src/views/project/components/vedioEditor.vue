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
                <!--<video id="my-video" class="video-js" controls   width="810" height="480" data-setup="{}">-->
                <!--<source :src="VideoURL" type="video/mp4">-->
                <!--</video>-->
                <video id="haha" width="810" height="480">
                    <source :src="VideoURL" type="video/mp4">
                </video>
                <div class="controls">
                    <Icon @click.native="videoStart" type="play" size="30"
                          style="padding-left: 5px;color: #39f;"></Icon>
                    <span class="circle" id="circle">
                   <i class="circleSign"></i>
                </span>
                    <span class="progressBar" @click="pictureJump">
                    <i class="strip"></i>
                </span>
                </div>
                <canvas v-show="isCanvas" id="myCanvas" class="videoCanvas" width="810" height="480"
                        style="border:1px solid #d3d3d3;">
                    Your browser does not support the HTML5 canvas tag.
                </canvas>
                <canvas id="tu" class="drawMain" @mousedown="paletteInit" width="810" height="480"
                        style="border:1px solid #d3d3d3;">
                    Your browser does not support the HTML5 canvas tag.
                </canvas>
                <canvas v-show="isCanvas" id="tu2" class="drawTrans" width="810" height="480"
                        style="border:1px solid #d3d3d3;">
                    Your browser does not support the HTML5 canvas tag.
                </canvas>
                <input v-show="drawTextShow" @blur="drawText" v-model="drawTextValue" type="text" class="textInput"
                       :style="{'top':top+'px','left':left+'px'}">
            </section>
            <div class="canvasEdit">
                <ul>
                    <li v-for="(item,index) in timeList" :key="index">11</li>
                </ul>
                <Icon @click.native="changeRect" type="android-checkbox-outline-blank"></Icon>
                <Icon @click.native="changeText" type="paintbrush"></Icon>

                <i class="little" @click="changelineWidth(1)"></i>
                <i class="middle" @click="changelineWidth(5)"></i>
                <i class="big" @click="changelineWidth(8)"></i>

                <i class="black " @click="changeColor('#black')"></i>
                <i class="red" @click="changeColor('#ff512e')"></i>
                <i class="blue" @click="changeColor('#66DAFF')"></i>
                <i class="orange" @click="changeColor('#FFB14D')"></i>

                <Button @click="startCanvas" type="text">开启画布</Button>
                <Button @click="baocun" type="text">保存</Button>
                <Button @click="updateFrame('before')" type="text">上一帧</Button>
                <Button @click="updateFrame('after')" type="text">下一帧</Button>
                <Button @click="videoStart" type="text">开始</Button>
                <Button @click="zanting" type="text">暂停</Button>
            </div>
            <!-- 标注提交 -->
            <div v-if="AllowEditRow" class="VideoAllowEdit">
            <span class="EditInput">
                <input type="text" placeholder="请输入你要反馈的内容" id="EditInput" v-model="FeedbackValue">
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
            <img id="img" :src="img" alt="">
        </div>
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
                linshishuju: JSON.parse(sessionStorage.getItem('videoTime')),
                timeList: [],
                img: '',
                stage_id: null,
                percentage: '',// 百分比
                drawTextValue: '', //
                drawTextShow: false,
                isCanvas: false,
                video: null,
                videoCas: null,
                ctx: null,
                canvas: null,
                currnt_time: 0,
                color: 'black',
                lineWidth: 5,
                x: null,
                y: null,
                newX: null,
                newY: null,
                isRect: false,
                isLine: true,
                isText: false,
                top: null,
                left: null,
                timeId: '',
                /*上面是标注*/
                data: [],
                TID: 49,
                fileID: 10,
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
            }
        },
        mounted() {
            $LAB
                .script("/src/js/video.js").wait(() => {
                this.Vdefault();
                this.vedioLoad();
            });
            this.VedioGet();
            this.init();
            this.showVideoSign()

        },
        created() {
            this.AddVedioJS();
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
                        "tag": []
                    })]
                }
                let EDITparams = {
                    "stage_id": this.stageID,
                    "audit": 2,
                    "feedback": this.FeedbackValue,
                    "file": JSON.stringify([{
                        "file_id": this.fileID,
                        "tag": sessionStorage.ImgData != undefined ? JSON.parse(sessionStorage.ImgData) : '[]'
                    }])
                }
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
                    console.log(12, msg)
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
                this.video.play();
                this.timeNum();
                clearInterval(this.timeId);
                this.videoInit();

            },
            /*临时的暂停*/
            zanting() {
                this.video.pause();
                clearInterval(this.timeId)
            },
            /*进度条*/
            timeNum() {
                if (this.video.readyState > 0) {
                    let zhen = parseInt(this.video.duration);
                    this.percentage = this.video.currentTime / zhen;
                    document.querySelector('#circle').style.left = this.percentage * 778 + 'px';
                }
            },
            /*开启画布*/
            startCanvas() {
                this.isCanvas = !this.isCanvas;
                this.init();
                clearInterval(this.timeId);
                this.timeNum();
            },
            /*画面跳转*/
            pictureJump(e) {
//                this.video.duration*e.target.offsetX/778
                let time = this.video.duration * e.offsetX / 778;
                this.video.currentTime = time;
                this.timeNum();
                clearInterval(this.timeId);
                this.videoInit();
            },
            /*播放插入标注*/
            videoInit() {
                this.currnt_time = this.video.currentTime;

                this.timeId = setInterval(() => {
                    this.currnt_time += 0.03;
                    this.getVasList();
                    /*进度条*/
                    this.timeNum();
                }, 30);

            },
            showVideoSign() {
                this.timeList = this.linshishuju

            },
            /*canvas初始化*/
            init() {
                this.video = document.getElementById("haha");           // 视频
                this.videoCas = document.getElementById("myCanvas");    // 获取视频图像的画布
                this.canvas = document.getElementById("tu");            // 画板
                this.canvasTans = document.getElementById("tu2");       // 矩形move画板
                this.videoCtx = this.videoCas.getContext('2d');
                this.ctx = this.canvas.getContext('2d');
                this.ctxTans = this.canvasTans.getContext('2d');
                this.video.volume = 0;  // 音量为0 方便调试
//                this.timeNum(); // 进度条
                if (!this.isCanvas) {
                    return false
                }
                /*点击开启画布*/
                this.video.pause();
                setInterval(() => {
                    this.videoCtx.drawImage(this.video, 0, 0, 810, 480);
                }, 30)
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
                e.stopPropagation()
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
//                    this.ctx.font = "30px Verdana";
//                    this.ctx.fillText("Hello World!", 10, 50);
                } else if (this.isRect) {

                    this.canvas.addEventListener("mousemove", this._drawRectTans);
                    this.canvas.addEventListener("mouseup", this._drawRect);
                }


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
            getVasList() {
                this.linshishuju.map((item) => {
                    if (this.currnt_time >= (parseFloat(item.time) + 0.03)) {
                        this.ctx.clearRect(0, 0, 810, 480);
                    }
                    this.img = item.image;
                    if (this.currnt_time >= (parseFloat(item.time) - .25) && this.currnt_time <= (parseFloat(item.time) + .25)) {
                        this.ctx.drawImage(document.querySelector('#img'), 0, 0, 810, 480);
                    }
                });

            },
            /*保存 暂时还是假数据*/
            async baocun() {

                let audit = this.StateFeedBack === '5' ? 1 : 2,
                    img = this.canvas.toDataURL("image/png"),
                    json = [{
                        "time": this.currnt_time.toFixed(2),
                        "image": img
                    },
                        {
                            "time": 3.01,
                            "image": img
                        }];
//                    file = JSON.stringify([{
//                        "file_id": this.fileID,
//                        "tag": json
//                    }]);

                sessionStorage.setItem('videoTime', JSON.stringify(json));
//                const data = await api.insideAudit({stage_id:this.stageID,audit:audit})

            },
            /*鼠标移动画矩形*/
            _drawRectTans(e) {
                let width = this.newX - this.x,
                    height = this.newY - this.y;
                this.newX = e.offsetX;
                this.newY = e.offsetY;
                this.ctxTans.clearRect(0, 0, this.canvasTans.clientWidth, this.canvasTans.clientHeight)
                this.ctxTans.strokeRect(this.x, this.y, width, height)
            },
            /*鼠标离开画矩形*/
            _drawRect(e) {
                let width = this.newX - this.x,
                    height = this.newY - this.y;
                this.newX = e.offsetX;
                this.newY = e.offsetY;
                this.ctxTans.clearRect(0, 0, this.canvasTans.clientWidth, this.canvasTans.clientHeight)
                this.ctx.strokeRect(this.x, this.y, width, height);
                this.canvas.removeEventListener("mousemove", this._drawRectTans);
            },
            /*画笔移动*/
            _move(e) {
                this.x = e.offsetX;
                this.y = e.offsetY;

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

    }
</script>
<style lang="less">
    @import '../../../styles/vedioEditor.less';

    .canvasContainer {
        position: relative;
        .controls {
            display: flex;
            position: absolute;
            bottom: 20px;
            left: 0;
            width: 100%;
            z-index: 112;
            .progressBar {
                flex: 1;
                height: 20px;
                margin-top: 5px;
                .strip {
                    display: block;
                    width: 100%;
                    height: 5px;
                    margin-top: 7px;
                    background: #fff;

                }
            }
            .circle {
                display: block;
                position: relative;
                top: 7px;
                left: 4px;
                width: 16px;
                height: 16px;
                /*background: red;*/
                .circleSign {
                    display: block;
                    width: 8px;
                    height: 8px;
                    margin: 4px 0 0 5px;
                    background: blue;
                    border-radius: 50%;
                }
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
        .textInput {
            position: absolute;
            width: 70px;
            z-index: 110;
            background: transparent;
            border: 1px solid transparent;
            border-bottom: 2px solid #ff512e;
            outline: none;
        }

    }

    .canvasEdit {
        display: flex;
        align-items: center;
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
        .black, .red, .blue, .orange {
            display: block;
            width: 14px;
            height: 14px;
            border: 1px solid #e6e6e6;
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
