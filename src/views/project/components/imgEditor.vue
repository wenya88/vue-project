<template>
    <div class="newImgEditor">
        <div class="imgEditorCom">
            <!-- 加载动画 -->
            <OnLoad id="onload"></OnLoad>
            <div class="imgFocus">
                <!-- 控制canvas -->
                <div :class="[canvasSign?'controlCanvas showCanvas':'controlCanvas hideCanvas']">
                    <span @click="canvasHidden"><s class="iconfont icon-tuichu"></s>退出标注</span>
                </div>
                <!-- 标注层 -->
                <div class="sginCanvas" id="signx">
                    <!-- 修改编辑层 -->
                    <div class="editSginDiv">
                        <textarea id="sginText"></textarea>
                        <div class="signButton"><span class="sginEditCommit">修改</span><span
                                class="editSignbox">取消</span></div>
                    </div>
                    <!-- 画布层 -->
                    <canvas id="cav" width="1400" height="750" v-show="hiddenSign">
                        <span>浏览器不支持画布标注！o(╯□╰)o</span>
                    </canvas>
                    <!-- 控件层 -->
                    <div class="oControl"></div>
                    <!-- 图片层 -->
                    <img :src="url" class="ImgOnlod" id="oImg"/>
                </div>
            </div>
            <!-- 工具条 -->
            <div class="toolBar" style="overflow: hidden">
                <!--成员任何状态不可见编辑条  管理可见-->
                <div v-if="userPost.postId != '3'">
                    <!--管理人员在状态为1（内部待审时可见编辑标注按钮）其它状态不可见-->
                    <span v-if="StateFeedBack == 1">
                        <span :class="[canvasSign?'barLeft barselet':'barLeft']" @click="canvasHidden"><Icon type="edit" class="add"></Icon>{{barText}}</span>
                        <span class="clearCanvas" @click="clearCanvas" v-show="canvasSign"><s class="iconfont icon-qingchu"></s>清除标注</span>
                    </span>
                    <span class="barRight">
                        <s><i class="iconfont icon-qimai-guanjiancizhishuduibi"></i>查看上次反馈</s>
                        <s @click="sginHidden"><i class="iconfont icon-yincang"></i>{{hiddenSignText}}</s>
                    </span>
                </div>

                <div class="clear"></div>
            </div>
            <!-- 标注提交 -->
            <!--<div v-if="AllowEditRow" class="AllowEdit">-->
                <!--<span class="EditIcon"></span>-->
                <!--<span class="EditInput">-->
                <!--<input type="text" placeholder="请输入你要反馈的内容" id="EditInput" v-model="FeedbackValue" AUTOCOMPLETE="off">-->
            <!--</span>-->
                <!--<span class="EditSub">-->
                <!--<button @click="commitEidt('edit')">需修改</button>-->
                <!--<button @click="commitEidt('ok')">通过</button>-->
            <!--</span>-->
            <!--</div>-->
            <!-- 反馈信息 -->
            <!--<div v-if="SataeInfo" class="feedbackInfo">-->
                <!--<span><p>状态</p><br/>{{StateFeedBack | filtStat}}</span>-->
                <!--<span><p>等待时间</p><br/><Icon type="android-time"></Icon><span-->
                        <!--style="color: #3bceb6">{{insTime > cliTiem ? insDate : cliDate}}</span></span>-->
                <!--<span><p>审核人</p><br/><i class="iconfont icon-hezuobaoxiangongsi"-->
                                        <!--style="vertical-align: text-bottom;font-size: 18px;"></i></span>-->
                <!--<div class="clear"></div>-->
            <!--</div>-->
            <!--{{testData}}-->
            <feedbackInfo  ref="feedback" v-on:commitEidt="commitEidt" :fileId="fileId" :testData="testData"></feedbackInfo>
        </div>
    </div>
</template>
<script>
    var qs = require('querystring');
    import OnLoad from './onLoad.vue';
    import {imgSign} from './imgEditorTwo/imgSign.js';
    import {imgCanvas} from './imgEditorTwo/imgCanvas.js';
    import {canvasControl} from './imgEditorTwo/imgControl.js';
    import {AutoResizeImage} from './imgEditorTwo/autoResizeImage.js';
    import feedbackInfo from './feedbackInfo.vue';
    import Cookies from 'js-cookie';
    import api from 'api';
    export default {
        props:{
            testData:{
                type:Object,
                default:function () {
                    return {}
                }
            }
        },
        components: {
            OnLoad: OnLoad,
            feedbackInfo:feedbackInfo
        },
        data() {
            return {
                fileId:null,
                data: [],
                IMGdata: [],
                url: '',
                TID: 80,
                TaskID: 0,
                IMGlist: [],
                AllowEditRow: false,
                SataeInfo: false,
                StateFeedBack: 0,
                insTime: 0,
                cliTiem: 0,
                insDate: 0,
                cliDate: 0,
                liIndex: 0,
                FeedbackValue: '',
                onload: true,
                fileID: 0,
                stageID: 0,
                AllowEdit: false,//是否允许标注
                barText: '标注反馈',
                hiddenSign: true,
                canvasSign: false,
                hiddenSignText: '隐藏标记',
                userPost:{
                    postName:'',
                    postId:null
                },
                OSSdata:{}
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
            this.initImgEditor();
            this.loadWH();
            // this.$bus.on('moveEdit',() => {
            //     console.log(222)
            // });
            this.userInfos();
        },
        destroyed() {
            this.clearSession();
        },
        computed: {
            storeTaskID() {
                return this.$store.state.ImgVedioStatus.TaskID
            },
            storeStageId(){
                return this.$store.state.ImgVedioStatus.stageId
            },
            storeFileURl() {
                return this.$store.state.ImgVedioStatus.FileURl
            },
            fileup() {
                return this.$store.state.paySkip.fileUpload
            }
        },
        methods: {
            // clearSession
            clearSession() {
                sessionStorage.removeItem('ImgData');//存图片标注信息
                sessionStorage.removeItem('totalNum');//存图片放大缩小信息
            },
            // clearCanvas
            clearCanvas() {
                this.$Modal.confirm({
                    title: "清除标注",
                    content: "是否确定清除画布上面的内容,清除后将无法撤消！",
                    onOk: () => {
                        this.$Message.info('清除成功！└(^o^)┘');
                        imgCanvas("true");
                    },
                });
            },
            // hideSgin
            canvasHidden() {
                let cav = document.getElementById("cav")
                if (this.canvasSign) {
                    this.barText = "标注反馈";
                    cav.style.zIndex = "12";
                    this.canvasSign = !this.canvasSign;
                } else {
                    this.barText = "退出标注";
                    cav.style.zIndex = "14";
                    this.canvasSign = !this.canvasSign;
                }
            },
            sginHidden() {
                if (this.hiddenSign) {
                    $(".signIndex").css("display", "none");
                    this.hiddenSign = !this.hiddenSign;
                    this.hiddenSignText = "显示标记"
                } else {
                    $(".signIndex").css("display", "block");
                    this.hiddenSign = !this.hiddenSign;
                    this.hiddenSignText = "隐藏标记"
                }

            },
            //colseWindow
            InfoRefresh() {
                this.$bus.emit('InfoRefresh')
            },
            initImgEditor(TestData) {
                // this.getStageInfo();
                this.url = this.storeFileURl;
                this.get(TestData);
                this.onLoad();
                this.clearSession();
            },
            GetImgInfo(width, height) {
                let arrWH = [width, height]
                this.$store.commit('getImgEditorWH', arrWH);
            },
            onLoad(cControl = "false") {
                let _this = this;
                let el = document.getElementsByClassName("ImgOnlod")[0];
                let el2 = document.getElementById("onload");
                let sgin = document.getElementsByClassName("sginCanvas")[0];
                let controlDiv = document.getElementsByClassName("oControl")[0];
                let imgFocus = document.getElementsByClassName("imgFocus")[0];
                el.onload =  () => {
                    el2.style.display = "none";
                    let maxH = parseInt(imgFocus.style.height)
                    let maxW = parseInt(imgFocus.style.width);
                    this.GetImgInfo(el.naturalWidth, el.naturalHeight);
                    //  autoZoom
                    if ((el.height - maxH) > 50) {
                        AutoResizeImage(0, maxH, el);
                    } else {
                        AutoResizeImage(maxW, 0, el);
                    }
                    if (el.width > maxW && el.height < maxH) {
                        AutoResizeImage(maxW, 0, el);
                    }

                    let canvasW = el.width;
                    let canvasH = el.height;
                    let canID = document.getElementById("cav");

                    //  sginDiv
                    sgin.style.width = canvasW + "px";
                    sgin.style.height = canvasH + "px";
                    sgin.style.marginTop = -(canvasH / 2) + "px";
                    sgin.style.marginLeft = -(canvasW / 2) + "px";

                    //  controlDiv
                    controlDiv.style.width = canvasW + "px";
                    controlDiv.style.height = canvasH + "px";

                    // canvasDiv
                    canID.width = canvasW;
                    canID.height = canvasH;

                    imgCanvas(cControl, canvasW, canvasH,this);
                    canvasControl();

                }
            },
            loadWH() {
                let sw = $(".single-page-con").width() - 500;
                let sh = $(".single-page-con").height() - 200;
                $(".imgFocus").height(sh);//先注解
                $(".imgEditorCom,.imgFocus").width(sw);//先注解
                $(".toolBar").css("margin-top", sh + 5)//先注解
            },
            defue() {
                // sign
                imgSign(this.AllowEdit,this);
            },
            //edit
            commitEidt({type,FeedbackValue,isTestTask,uploadID}) {
                if(isTestTask){
                    $LAB
                        .script("/static/html2canvas.min.js").wait(() => {
                        this.getHtml2canvas('signx').then((mainUrl)=>{
                            let obj = {
                                upload_id : uploadID,
                                state :  type == 'ok' ? 1 : 2,
                                feedback :  FeedbackValue,
                                tag : [{
                                    file_id:this.fileID,
                                    tag:sessionStorage.ImgData != undefined ? JSON.parse(sessionStorage.ImgData) : '[]',
                                    label:mainUrl
                                }]
                            }
                            let testTaskHttp = async ()=>{
                                const testTaskHttpData = await api.testTaskUpLoad(obj);
                                if(testTaskHttpData.data.err_code == 0){
                                    this.$Message.success(testTaskHttpData.data.err_message);
                                    this.initImgEditor(this.testData);
                                    sessionStorage.removeItem('ImgData');
                                    this.$refs.feedback.init(true)
                                }else {
                                    this.$Message.error(testTaskHttpData.data.err_message);
                                }
                            }
                            testTaskHttp();
                        })
                    })
                }else {
                    let url = this.GLOBAL.baseRouter + 'task/task/inside-audit';
                    if (type == 'edit') {
                        $LAB
                            .script("/static/html2canvas.min.js").wait(() => {
                                this.getHtml2canvas('signx').then((mainUrl)=>{
                                    let EDITparams = {
                                        "stage_id": this.stageID,
                                        "audit": 2,
                                        "feedback": FeedbackValue,
                                        "file": JSON.stringify([{
                                            "file_id": this.fileID,
                                            "tag": sessionStorage.ImgData != undefined ? JSON.parse(sessionStorage.ImgData) : '[]',
                                            "label": mainUrl
                                        }])
                                    }
                                    // Sgin upload
                                    this.$axios.post(url, qs.stringify(EDITparams)).then(msg => {
                                        this.$Message.success(msg.data.err_message);
                                        this.initImgEditor();
                                        sessionStorage.removeItem('ImgData');
                                        this.$refs.feedback.init(false)
                                    }, () => {
                                        this.$Message.error(msg.data.err_message);
                                    })
                                })

                        })
                    } else if (type == 'ok') {
                        let Okparams = {
                            "stage_id": this.stageID,
                            "audit": 1,//1为通过审核,2为不通过
                            "feedback": '',
                            "file": [JSON.stringify({
                                "file_id": this.fileID,
                                "tag": []
                            })]
                        }
                        this.$axios.post(url, qs.stringify(Okparams)).then(msg => {
                            this.$Message.success(msg.data.err_message);
                            this.initImgEditor();
                            sessionStorage.removeItem('ImgData');
                            this.$refs.feedback.init(false)
                        }, () => {
                            this.$Message.error(msg.data.err_message);
                        })
                    }
                }
            },
            imgdef() {
                $.sign.bindSign('#signx');
                $.sign.loadingSign(this.data);
            },
            changeState(state) {
                //  controlImgSign
                if (state == '1' || state == '2') {
                    this.AllowEditRow = true;
                    this.SataeInfo = false;
                    this.AllowEdit = true;
                } else if (state == '3' || state == '4' || state == '5') {
                    this.AllowEditRow = false
                    this.SataeInfo = true;
                } else {
                    this.AllowEditRow = false;
                    this.SataeInfo = false;
                }
            },
            get(TestData) {
                //如果没有TestData 表示普通任务 否则 测试任务
                if(!TestData){
                    //  getImgSignInfo
                    let TaskID = this.storeTaskID
                    if (TaskID == 0 || TaskID === null) {
                        return false;
                    }
                    let _this = this;
                    let url = this.GLOBAL.baseRouter + 'task/task/task-stage&task_id=' + TaskID;
                    _this.$axios.get(url).then(function (msg) {
                        let Sdate = msg.data;

                        if (Sdate.err_code == 0) {

                            _this.IMGlist = [];
                            _this.IMGlist = Sdate.data;

                            _this.IMGlist.forEach((val, index) => {
                                if (val.file.file == _this.storeFileURl) {
                                    // 设置初始化值
                                    _this.data = val.file.tag;
                                    _this.StateFeedBack = parseInt(val.status);
                                    _this.insTime = val.inside_audit_time;
                                    _this.cliTiem = val.client_audit_time;
                                    _this.insDate = val.inside_audit_date;
                                    _this.cliDate = val.client_audit_date;
                                    _this.liIndex = index;
                                    _this.fileID = val.file.id;
                                    _this.stageID = val.file.stage_id;
                                    _this.fileId = val.file.stage_id
                                }
                            })
                            _this.changeState(_this.StateFeedBack);
                            // 把StageID传到提交
                            let stageID = _this.stageID;
                            let fileID = _this.fileID;
                            _this.defue();
                            _this.imgdef();
                        } else {
                            return
                        }
                    }, () => {
                        _this.$Message.error('请求失败')
                    })
                }else {
                    this.StateFeedBack = parseInt(TestData.upload.status);
                    let fileArr = TestData.upload.file;
                    let mainFile = fileArr.filter(function (curren,index,arr) {
                        return curren.is_main == 1;
                    })
                    this.fileID = mainFile[0].id;
                    this.defue();
                    this.imgdef();
                }
            },


            //getUserInfo
            userInfos(){
                let Infos = JSON.parse(Cookies.get('company'));
                switch (Infos.post_id){
                    case '1':
                        this.userPost.postName = '经理';
                        this.userPost.postId = '1';
                        break;
                    case '2':
                        this.userPost.postName = '组长';
                        this.userPost.postId = '2';
                        break;
                    case '3':
                        this.userPost.postName = '成员';
                        this.userPost.postId = '3';
                        break;

                }
            },
            // 截取缩略图
            getHtml2canvas(el){
                let _this = this;
                var ele = document.getElementById(el);
                return new Promise((resolve,reject)=>{
                    html2canvas(ele,{ useCORS: true }).then(function(canvas) {
                        var dataURL = canvas.toDataURL('image/png');
                        // dataURL = dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
                        resolve(_this.getImgkey(dataURL));
                    })
                })
            },
            // 转blob方法
            convertImgDataToBlob(base64Data) {
                var format = "image/jpeg";
                var base64 = base64Data;
                var code = window.atob(base64.split(",")[1]);
                var aBuffer = new window.ArrayBuffer(code.length);
                var uBuffer = new window.Uint8Array(aBuffer);
                for(var i = 0; i < code.length; i++){
                    uBuffer[i] = code.charCodeAt(i) & 0xff ;
                }
                // console.info([aBuffer]);
                // console.info(uBuffer);
                // console.info(uBuffer.buffer);
                // console.info(uBuffer.buffer==aBuffer); //true
                var blob=null;
                try{
                    blob = new Blob([uBuffer], {type : format});
                }
                catch(e){
                    window.BlobBuilder = window.BlobBuilder ||
                        window.WebKitBlobBuilder ||
                        window.MozBlobBuilder ||
                        window.MSBlobBuilder;
                    if(e.name == 'TypeError' && window.BlobBuilder){
                        var bb = new window.BlobBuilder();
                        bb.append(uBuffer.buffer);
                        blob = bb.getBlob("image/jpeg");
                    }
                    else if(e.name == "InvalidStateError"){
                        blob = new Blob([aBuffer], {type : format});
                    }
                    else{
                    }
                }
                return blob;
            },
            // 获取秘钥
            getImgkey(dataURL) {
                let _this = this;
                let url = this.GLOBAL.baseRouter + "/file/oss/oss";
                return new Promise((resolve, reject) => {
                    this.$axios.post(url,qs.stringify({type:'upload'})).then(data => {
                        _this.OSSdata = data.data;
                        resolve(_this.uploadOss(dataURL,data.data));
                    })
                })
            },
            //上传OSS
            uploadOss(base64Codes,ossData){
                var option = ossData;
                var UploadUrl = ossData.host;
                var file = this.convertImgDataToBlob(base64Codes);
                var tt = new File([file],'tt',{type:'image/jpeg'});
                var formData = new FormData();
                formData.append('key', option.dir+this.GenNonDuplicateID());
                formData.append('policy', option.policy);
                formData.append('OSSAccessKeyId', option.accessid);
                formData.append('success_action_status', '200');
                formData.append('signature', option.signature);
                formData.append('callback',option.callback);
                formData.append("file", tt);
                // console.log(1010101,formData);
                return new Promise((resolve,reject)=>{
                    $.ajax({
                        url:UploadUrl,
                        data:formData,
                        processData:false,
                        cache: false,
                        async: false,
                        contentType: false,
                        dataType: 'JSON',
                        type : 'post',
                        // headers:{"Content-Type":"multipart/form-data"},
                        success:function(data){
                            if(data.Status == 'Ok'){
                                resolve(data.file_url);
                            }
                        },
                        error:function(data) {
                            if(data.status == 403){
                                this.$Message.info('上传超时，请重新上传！');
                            }
                        }
                    });
                })
            },
            // 生成不重复随机文件名
            GenNonDuplicateID() {
                var randomStr = Number(Math.random().toString().substr(3,12) + Date.now()).toString(36);
                return randomStr.substring(0,randomStr.length - 4);
            }
        }

    }
</script>
<style lang='less'>
    @import './imgEditorTwo/style/imgEditor.less';
</style>
