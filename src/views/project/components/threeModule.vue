<template>
    <!-- 模型插槽 -->
    <div id='base3D'>
        <body id="mainId">
            <div id="menu_1"></div>
            <div id="info"></div>
        </body>
        <div id="menu_progress" >
        </div>
        <!-- <div class="editTool" v-if="(userPost.postId != '3' && signData.status == 1) || 
                                    ((userPost.postId != '3' && testData.is_test) && testData.upload.status == 1)">
            <i class="project_instrument tagimage"></i>
            <p class="canvasEditText">审核工具</p>
            <Icon type="paintbrush"
                  class="icon" title="修改标记"></Icon>
            <Icon type="paintbucket" class="icon"
                  title="修改颜色"></Icon>
        </div> -->
        <feedback-Info ref="feedback" v-on:commitEidt="onSubmit" :fileId="fileId" :testData="testData">
        </feedback-Info>
    </div>
</template>
<script>
    var qs = require("querystring");
    import feedbackInfo from './feedbackInfo.vue'
    import {mapState} from 'vuex'
    import api from 'api';
    import Cookies from 'js-cookie';

    export default {
        props: {
            memberUpload: {
                type: String,
                default: ''
            },
            height: {
                type: Number,
                default: 0
            },
            testData:{
                type:Object,
                default:function () {
                    return {}
                }
            }
        },
        data() {
            return {
                uniqueness: null,
                fileId: null,
                file_BaseUrl:'',
                feedbackData: '',
                AllowEditRow: false,
                SataeInfo: false,
                fileKey: "",
                file_obj: {},
                fbxurl: '',
                isAnimationShow:false,
                animationProgressData:{
                    value:0,//进度值
                    min:0,//最大值
                    max:10,//最小值
                    pervalue:0,
                    timeNow:0,
                    button:{},
                },
                threeDControl:{},
                PermissionLevel:{
                    MANAJER:1,
                    LEADER:2,
                    MENBER:3,
                    COMMERCIAL:4,
                },
                //
                signData: {},
                userPost:{
                    postName:'',
                    postId:null
                }
            };
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
        computed: {
            storeFileURl() {
                return this.$store.state.ImgVedioStatus.FileURl
            },
            storeTaskID() {
                return this.$store.state.ImgVedioStatus.TaskID
            },
        },
        mounted() {
            this.userInfos();
            // 设置3d文件高度
            if (!this.height) {
                document.querySelector('#mainId').style.height = document.body.offsetHeight * 0.7 + 'px';
            } else {
                document.querySelector('#mainId').style.height = this.height + 'px';
            }
            if (!this.memberUpload) {
                if(this.testData && this.testData.is_test == 1){
                    this.onload();
                }else {
                    this.getSign();
                    this.getId();
                }
            } else {
                this.onload();
            }
        },
        methods: {
            async getId() {
                let url = this.GLOBAL.baseRouter + 'task/task/task-stage&task_id=' + this.storeTaskID;
                this.$axios.get(url).then(({data}) => {
                    if(data.data)
                        this.fileID = data.data[0].file.task_id;
                }, () => {
                    this.$Message.error('请求失败')
                })
            },
            onSubmit({type, FeedbackValue,isTestTask,uploadID}) {
                if(isTestTask){
                    let obj = {
                        upload_id : uploadID,
                        state :  type == 'ok' ? 1 : 2,
                        feedback :  type == 'ok' ? ' ' : FeedbackValue,
                        tag : [{
                            file_id:this.fileID,
                            tag:sessionStorage.ImgData != undefined ? JSON.parse(sessionStorage.ImgData) : '[]',
                            label:null
                        }]
                    }

                    let testTaskHttp = async ()=>{
                        const testTaskHttpData = await api.testTaskUpLoad(obj);
                        if(testTaskHttpData.data.err_code == 0){
                            this.$Message.success(testTaskHttpData.data.err_message);
                        }else {
                            this.$Message.error(testTaskHttpData.data.err_message);
                        }
                    }
                    testTaskHttp();
                }else {
                    let url = null;
                    if (this.signData.status == 1) {  // 内部审核
                        url = this.GLOBAL.baseRouter + 'task/task/inside-audit';
                        this.AllowEditRow = true;
                    } else if (this.signData.status == 2) {  // 客户审核
                        url = this.GLOBAL.baseRouter + 'task/task/client-audit';
                        this.AllowEditRow = true;
                    } else {
                        this.AllowEditRow = false;
                    }
                    if (type == 'ok') {
                        let okParams = {
                            "stage_id": this.signData.id,
                            "audit": 1,//1为通过审核,2为不通过
                            "feedback": '',
                            "file": [JSON.stringify({
                                "file_id": this.fileID,
                                "tag": []
                            })]
                        }
                        this.$axios.post(url, qs.stringify(okParams))
                            .then(res => res.data)
                            .then(res => {
                                if (res.err_code == 0) {
                                    this.$Message.success(res.err_message);
                                    this.$refs.feedback.init()
                                }
                            })
                    } else if (type == 'edit') {
                        let editParams = {
                            "stage_id": this.signData.id,
                            "audit": 2,
                            "feedback": FeedbackValue,
                            "file": JSON.stringify([{
                                "file_id": this.fileID,
                                "tag": sessionStorage.threeData != undefined ? JSON.parse(sessionStorage.threeData) : '[]',
                                "label": ""
                            }])
                        }
                        this.$axios.post(url, qs.stringify(editParams))
                            .then(res => res.data)
                            .then(res => {
                                if (res.err_code == 0) {
                                    sessionStorage.removeItem('threeData');
                                    this.$Message.success(res.err_message);
                                    this.$refs.feedback.init()
                                }
                            })
                    }
                }



            },
            onload() {
                if (!this.uniqueness) {
                    this.uniqueness = true;
                    if (window.THREE) {
                        // console.log('THREE has ready1')
                        this.newFBXMedel();
                    } else {
                        $LAB
                            .script("/static/three/three.js").wait()
                            .script("/static/three/inflate.min.js").wait()
                            .script("/static/three/FBXLoader.js").wait()
                            .script("/static/three/CSS3DRenderer.js").wait()
                            .script("/static/three/DDSLoader.js").wait()
                            // .script("/static/three/dat.gui.min.js").wait()
                            .script("/static/three/OrbitControls.js").wait(() => {
                                // console.log('THREE is ready2');
                                this.newFBXMedel();
                            }
                        )
                    }
                }
            },
            initBaseUrl(){
                let _url = this.storeFileURl;
                let index = _url .lastIndexOf("/");  
                this.file_BaseUrl = decodeURI(_url.substring(0, index));
            },
            animationProgressStart(val)
            {
                if(this.threeDControl && this.threeDControl!={})
                {
                    // console.log(this.threeDControl.domElement);
                    
                    // this.threeDControl.enabled = false;
                    // this.clock.oldTime = this.animationProgressData.value;
                    // console.log('animationProgressStart');
                }
            },
            animationProgressEnd(val)
            {
                if(this.threeDControl && this.threeDControl!={})
                {
                    // this.threeDControl.enabled = true;
                    // console.log('animationProgressEnd');
                }
            },
            animationRun(e)
            {
                if(this.obj && this.objMix)
                {
                    let _action = this.objMix.clipAction( this.obj.animations[0], null );
                    if(_action.paused)//已暂停
                    {
                        this.clock.start();
                        this.clock.elapsedTime = this.animationProgressData.timeNow;
                    }
                    else//未暂停
                    {
                        this.animationProgressData.timeNow = this.clock.elapsedTime;
                        this.clock.stop();
                    }
                    _action.paused = !_action.paused; 
                }
            },
            newFBXMedel() {
                this.initBaseUrl();
                var _this = this;
                var container, stats, controls;//容器、状态、控制器
                var camera, scene, renderer, light, renderer2;//相机、场景、渲染、灯光
                var clock = new THREE.Clock();//时钟
                clock.start();
                _this.clock = clock;
                var skeletonShow;//骨骼助手
                var mixers = [];
                var Data = [];
                var editText = [];
                var signTexts = [], getSignTexts = [];
                var mouse = new THREE.Vector2();
                var raycaster = new THREE.Raycaster();
                var urlObject;//加载的物体
                var urlAnimate = {};//加载的物体的动画
                var boxRange = {x: 1, y: 1, z: 1};
                var file_BaseUrl = this.file_BaseUrl;
                var progress_drag_button_bool = false;
                var mainLeft = document.getElementById('mainId').getBoundingClientRect().left;
                var mainbouding = document.getElementById('mainId').getBoundingClientRect();
                // console.log(mainbouding);
                
                init(this.storeFileURl);//初始化
                showSign(this.signData)  // 显示获取到的标记
                animate();//动画
                
                //角色灯
                function creatLight() {
                    let light = new THREE.HemisphereLight(0xffffff, 0x444444);
                    light.position.set(0, 200, 0);
                    return light;
                }

                //场景灯
                function creatDirectionalLight() {
                    let light = new THREE.DirectionalLight(0xffffff);
                    light.position.set(0, 200, 100);
                    light.castShadow = true;
                    light.shadow.camera.top = 180;
                    light.shadow.camera.bottom = -100;
                    light.shadow.camera.left = -120;
                    light.shadow.camera.right = 120;
                    return light;
                }

                //地面
                function creatGround() {
                    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({
                        color: 0x999999,
                        depthWrite: false
                    }));
                    mesh.rotation.x = -Math.PI / 2;
                    mesh.receiveShadow = true;
                    return mesh;
                }

                //地面助手
                function creatGridHelp() {
                    var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
                    grid.material.opacity = 0.2;
                    grid.material.transparent = true;
                    return grid;
                }

                //创建场景
                function creatScene() {
                    var scene = new THREE.Scene();
                    scene.background = new THREE.Color(0xa0a0a0);
                    // scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );
                    scene.add(creatLight());
                    scene.add(creatDirectionalLight());
                    scene.add(creatGround());
                    scene.add(creatGridHelp());
                    return scene;
                }

                //读取模型
                function loadModel(url) {
                    let type = "fbx";//这里的类型根据文件的类型使用不同的读取方式
                    if (type == "fbx") {
                        loadFBXModel(url);
                    }
                }

                //fbx读取
                function loadFBXModel(url) {
                    var loader = new THREE.FBXLoader();
                    loader.load(url, function (object) {
                        object_addAnimateControl(object);//处理动画
                        
                        object_fixCamera(object);//镜头
                        object.traverse(function (child) {
                            if (child.isMesh) {
                                child.castShadow = true;
                                child.receiveShadow = true;
                            }
                        });
                        scene.add(object);
                        urlObject = object;
                        _this.obj = urlObject;
                        creatObjectInfo(object);
                    });
                }
                //增加动画控制器
                function object_addAnimateControl(object)
                {
                    if(object.animations && object.animations.length >0)
                    {
                        object.mixer = new THREE.AnimationMixer(object);
                        mixers.push(object.mixer);
                        _this.objMix = object.mixer;
                        object.mixer.clipAction(object.animations[0]).play();
                        object_addSkeletonHelp(object);//骨骼助手
                        createAnimateGui(object);//动画UI
                    }  
                }
                //生成物体骨骼
                function object_addSkeletonHelp(object)
                {
                    skeletonShow = new THREE.SkeletonHelper( object );
                    skeletonShow.material.linewidth = 1.5;
                    skeletonShow.visible = true;
                    scene.add( skeletonShow );
                }
                //根据物体大小调整镜头
                function object_fixCamera(object)
                {
                    var box = new THREE.Box3();
                        box.expandByObject(object);
                        boxRange.x = parseFloat(box.max.x);
                        boxRange.y = parseFloat(box.max.y);
                        boxRange.z = parseFloat(box.max.z);

                        camera.position.set(0, (parseFloat(box.max.z) < 2 ? 0.5 : parseFloat(box.max.z)) * 5, 
                                            (parseFloat(box.max.y) < 2 ? 3 : parseFloat(box.max.y)) * 1.8);
                        object_initController(object);
                }
                function object_initController(urlObject)
                {
                    //轨道控制插件
                    controls = new THREE.OrbitControls(camera, document.getElementById("mainId"));
                    controls.target.set(urlObject.position.x, 
                                        urlObject.position.y+boxRange.y/2, 
                                        urlObject.position.z);
                    // controls.zoom0 = 2;
                    // controls.target.set(0,0,0);
                    controls.update();
                    // console.log(controls);
                    _this.threeDControl = controls;
                }
                function createAnimateGui(object)
                {
                    _this.isAnimationShow = true;

                    let anime_frame = object.animations[0].tracks.length;
                    let anime_time = object.animations[0].duration;
                    // console.log(anime_time);
                    
                    urlAnimate.time = anime_time;
                    urlAnimate.frame = anime_frame;
                    urlAnimate.framerate = anime_frame/anime_time;//这里有可能不足一秒
                    urlAnimate.perframe = anime_time/anime_frame;//
                    // console.log(urlAnimate);

                    _this.animationProgressData.max = anime_time*10000;
                    document.querySelector('#menu_progress').style.top = mainbouding.top 
                                                                        +mainbouding.height 
                                                                        -40 +'px';//40为div宽度                                                 
                    document.querySelector('#menu_progress').style.width = mainbouding.width 
                                                                            -10
                                                                            +'px';//40为div宽度
                    
                    var button_2 = document.createElement( 'button' );
                    button_2.id = 'progress_button';
                    button_2.innerHTML  = "暂停";
                    button_2.addEventListener('click',function(){
                        var bonesClip = urlObject.animations[0];
                        var action = urlObject.mixer.clipAction( bonesClip, null );
                        
                        button_2.innerHTML = action.paused ? '播放':'暂停';
                        if(action.paused)//已暂停,点击后继续播放
                        {
                            _this.clock.start();
                            if(_this.animationProgressData.value)
                            {
                                console.log(_this.animationProgressData.value);
                                _this.clock.elapsedTime = _this.animationProgressData.value;
                                urlObject.mixer._actions[0].time = _this.clock.elapsedTime;
                            }   
                            else
                                _this.clock.elapsedTime = _this.animationProgressData.timeNow;
                        }
                        else//未暂停,点击后暂停
                        {
                            _this.animationProgressData.timeNow = _this.clock.elapsedTime;
                            _this.clock.stop();
                            
                        }
                        action.paused = !action.paused;
                        console.log(urlObject.mixer);
                        
                    })
                    menu_progress.appendChild( button_2 );

                    var progress = document.createElement( 'div' );
                    progress.type = 'range';
                    progress.id = 'three_progress';
                    progress.value = 50;

                    var dragbutton = document.createElement( 'div' );
                    var lineDiv_left = getPosition(progress).left; //长线条的横坐标
                    dragbutton.id = 'progress_drag_button';
                    _this.animationProgressData.button = dragbutton;
                    _this.animationProgressData.max = mainbouding.width*0.8-8;
                    // console.log(_this.animationProgressData.max,urlAnimate.time);
                    _this.animationProgressData.pervalue = _this.animationProgressData.max/urlAnimate.time;//每秒多少像素
                    // console.log(_this.animationProgressData.pervalue);
                    
                    progress.addEventListener('mousedown',function(e){
                        console.log('mousedown');
                        
                        e.stopPropagation();
                        progress_drag_button_bool = true;
                        var minDiv_left = e.clientX - mainLeft - progress.offsetLeft-5;
                        if(minDiv_left<0)
                        {
                            minDiv_left=0;
                        }
                        if(minDiv_left>_this.animationProgressData.max)
                        {
                            minDiv_left = _this.animationProgressData.max;
                        }
                        _this.animationProgressData.value = minDiv_left*_this.animationProgressData.pervalue;
                        _this.clock.elapsedTime = minDiv_left / _this.animationProgressData.pervalue;
                        urlObject.mixer._actions[0].time = minDiv_left / _this.animationProgressData.pervalue;
                        dragbutton.style.left = minDiv_left + "px";  
                    },false)
                    
                    base3D.addEventListener('mousemove',function(e){
                        if(progress_drag_button_bool)
                        {
                            var minDiv_left = e.clientX - mainLeft - progress.offsetLeft-5;
                            if(minDiv_left<0)
                            {
                                minDiv_left=0;
                            }
                            if(minDiv_left>_this.animationProgressData.max)
                            {
                                minDiv_left = _this.animationProgressData.max;
                            }
                            _this.animationProgressData.value = minDiv_left/_this.animationProgressData.pervalue;
                            _this.clock.elapsedTime = minDiv_left / _this.animationProgressData.pervalue;
                            urlObject.mixer._actions[0].time = minDiv_left / _this.animationProgressData.pervalue;
                            dragbutton.style.left = minDiv_left + "px";
                        }
                    },false)
                    base3D.addEventListener('mouseup',function(e){
                        progress_drag_button_bool = false;
                    },false)

                    progress.appendChild(dragbutton);
                    menu_progress.appendChild( progress );
                }
                //获取元素的绝对位置
                function getPosition(node) {
                    // console.log(node);
                    var left = node.offsetLeft; //获取元素相对于其父元素的left值var left
                    var top = node.offsetTop;
                    var current = node.offsetParent; // 取得元素的offsetParent
                    　 // 一直循环直到根元素
                    
                    while(current != null) {　　
                        left += current.offsetLeft;　　
                        top += current.offsetTop;　　
                        current = current.offsetParent;　　
                    }
                    // console.log(left,top);
                    
                    return {
                        "left": left,
                        "top": top
                    };
                }
                function checkMesh(node){
                    var child = node.children,
                    arr = [];
                    if(child){
                        child.forEach(function(node){
                            if(node.type == 'SkinnedMesh' || node.type == 'Mesh')
                            {
                                arr = arr.concat(node);
                            }
                            else
                            {
                                arr = arr.concat(checkMesh(node));
                            } 
                        });
                    }
                    return arr;
                }
                function creatObjectInfo(object3d)
                {
                    let _info_list = [
                        {name:'名称 ： ',at:'name'},
                        {name:'根坐标 ： ',at:'position'},
                        {name:'大小比例 ： ',at:'scale'},
                        // {name:'动作数量 ： ',at:'animations.length'},
                        {name:'坐标轴类型 ： ',at:'rotation._order'}
                    ];
                    var _list = document.createElement( 'ul' );
                    for(let i=0;i<_info_list.length;i++){
                        let _attribute;
                        try{
                            _attribute = eval('JSON.stringify(object3d.'+_info_list[i].at+')');
                            // console.log(_attribute);
                        }
                        catch(exception)
                        {
                            _attribute = '';
                            console.log('错误');
                        }
                        var _l = document.createElement( 'li' );
                        _l.innerHTML = _info_list[i].name + _attribute;
                        _list.appendChild(_l);
                    }
                    var _meshObject= checkMesh(object3d);
                    if(_meshObject)
                    {
                        for(let i=0;i<_meshObject.length;i++)
                        {
                            let _num = (_meshObject.length<=1)?'':(i+1);
                    
                            var _l1 = document.createElement( 'li' );
                            _l1.innerHTML = '面数'+_num+' ： '+_meshObject[i].geometry.attributes.faceLength.array;
                            _list.appendChild(_l1);
                            var _l1 = document.createElement( 'li' );
                            _l1.innerHTML = '顶点数'+_num+' ： '+_meshObject[i].geometry.attributes.vertsLenght.array;
                            _list.appendChild(_l1);
                            if(_meshObject[i].skeleton)
                            {
                                var _l1 = document.createElement( 'li' );
                                _l1.innerHTML = '骨骼数量'+_num+' ：'+_meshObject[i].skeleton.boneInverses.length;
                                _list.appendChild(_l1);
                            }
                            if(_meshObject[i].material.length)
                            {
                                for(let j=0;j<_meshObject[i].material.length;j++)
                                {
                                    let _subnum = (_meshObject[i].material.length<=1)?'':(j+1);
                                    addMeshInfo(_list,_meshObject[i].material[j],_subnum);
                                }
                            }
                            else
                            {
                                addMeshInfo(_list,_meshObject[i],_num);
                            }
                            
                        }                     
                    }
                    info.appendChild(_list);
                }
                function addMeshInfo(_list,_object,_num)
                {
                    let _meshObject;
                    if(_object.material)
                    {
                        _meshObject = _object.material;
                    }
                    else
                    {
                        _meshObject = _object;
                    }
                    var _l1 = document.createElement( 'li' );
                    _l1.innerHTML = '材质名'+_num+' ： '+_meshObject.name;
                    _list.appendChild(_l1);
                    var _l1 = document.createElement( 'li' );
                    _l1.innerHTML = '贴图名'+_num+' ： '+_meshObject.map.RelativeFilename;
                    _list.appendChild(_l1);
                    var t = new Image();
                        let name = _meshObject.map.RelativeFilename;
                        var addrLast = '';
                        if(name.indexOf("\\") != -1)
                        {
                            var index = name.lastIndexOf("\\");
                            //js 获取字符串中最后一个斜杠后面的内容
                            addrLast = decodeURI(name.substring(index + 1, name.length));
                        }
                        else
                        {
                            addrLast = name;
                        }
                        t.src = file_BaseUrl +'/'+ addrLast;
                        t.onload = function(){
                            var _l1 = document.createElement( 'li' );
                            _l1.innerHTML = '贴图尺寸'+_num+' : '+_meshObject.map.image.height
                                                    +'*'
                                                    +_meshObject.map.image.width;
                            _list.appendChild(_l1);
                        }
                }
                function createGui()
                {
                    var button_1 = document.createElement( 'button' );
                    button_1.id = 'three_button';
                    button_1.innerHTML  = "打印属性";
                    button_1.addEventListener('click',function(){
                        console.log(controls.getAzimuthalAngle());
                        console.log(controls.getPolarAngle());
                        
                        console.log(controls);
                        console.log(urlObject);
                        console.log(boxRange);
                        console.log(camera.position);
                    })
                    menu_1.appendChild( button_1 );

                    var button_2 = document.createElement( 'button' );
                    button_2.id = 'three_button';
                    button_2.innerHTML  = "自动旋转";
                    button_2.addEventListener('click',function(){
                        controls.autoRotate = !controls.autoRotate;
                    })
                    menu_1.appendChild( button_2 );

                    var button_3 = document.createElement( 'button' );
                    button_3.id = 'three_button';
                    button_3.innerHTML  = "显示骨骼";
                    button_3.addEventListener('click',function(){
                        if(skeletonShow)
                            skeletonShow.visible = !skeletonShow.visible;
                    });
                    menu_1.appendChild( button_3 );

                    // menu_1.appendChild( document.createElement( 'hr' ) );

                    let _option = [
                        {_value : 'left_45', _innerHTML : '左俯视视图', _posx : 4, _posy : 0},
                        {_value : 'right_45', _innerHTML : '左俯视视图', _posx : -4, _posy : 0},
                        {_value : 'front', _innerHTML : '正前视图', _posx : 0, _posy : -9},
                        {_value : 'back', _innerHTML : '正后视视图', _posx : 1, _posy : -9},
                        {_value : 'left', _innerHTML : '正左视视图', _posx : 2, _posy : -9},
                        {_value : 'right', _innerHTML : '正右视视图', _posx : -2, _posy : -9},
                        {_value : 'top', _innerHTML : '正上视视图', _posx : 0, _posy : 2},
                    ];
                    for(let i=0 ; i<_option.length ; i++){
                        var option = document.createElement( 'button');
                        option.id = 'three_button';
                        option.value = _option[i]._value;
                        option.innerHTML = _option[i]._innerHTML;
                        option.posx = _option[i]._posx;
                        option.posy = _option[i]._posy;
                        option.addEventListener('click',function(o){
                            controls.outSetRotateZero();
                            controls.reset();
                            controls.outSetRotateLeft((o.srcElement.posx==0)?0:(Math.PI/o.srcElement.posx));
                            controls.outSetRotateUp((o.srcElement.posy==0)?0:(Math.PI/o.srcElement.posy));
                            controls.outPan(0,boxRange.y/4);
                            controls.update(); 
                        });
                        menu_1.appendChild(option);
                    }
                }
                function checkObjectMesh(obj) {
                    let objs = [];
                    for (let i = 0; i < obj.children.length; i++) {
                        if (obj.children[i].type == 'Mesh') {
                            objs.push(obj.children[i]);
                        }
                        else {
                            if (obj.children[i].children.length > 0) {
                                var childrens = checkObjectMesh(obj.children[i]);
                                for (let j = 0; j < childrens.length; j++) {
                                    objs.push(childrens[j]);
                                }
                            }
                        }
                    }
                    return objs;
                }

                //读取贴图
                function loadTexture(url, type) {
                    if (type == "dds") {
                        return loadDDSTexture(url);
                    }
                }

                //读取贴图--dds
                function loadDDSTexture(url) {
                    var dds_loader = new THREE.DDSLoader();
                    return dds_loader.load(url, function (texture) {
                        texture.magFilter = THREE.LinearFilter;
                        texture.minFilter = THREE.LinearFilter;
                        texture.mapping = THREE.UVMapping;
                        texture.needsUpdate = true;
                    });
                }

                //
                function init(url) {
                    //获得div并添加容器
                    container = document.createElement('div');
                    document.getElementById("mainId").appendChild(container);
                    //设置相机(可视角度,canvas宽高比,近距离,远距离)
                    // console.log(window.innerWidth,window.innerHeight);
                    let _width = container.width;
                    let _height = container.height;
                    // console.log(document.getElementById("mainId").offsetWidth,document.getElementById("mainId").offsetHeight);
                    camera = new THREE.PerspectiveCamera(60, document.getElementById("mainId").offsetWidth / document.getElementById("mainId").offsetHeight, 1, 2000);
                    // camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
                    camera.position.set(0, 200, 300);
                    //场景
                    scene = creatScene();
                    //加载
                    loadModel(url);
                    //渲染
                    initRender();
                    //UI
                    createGui();
                    window.addEventListener('resize', onWindowResize, false);
                }
                //初始化渲染组件
                function initRender() {
                    //render1初始化
                    renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
                    renderer.setPixelRatio(window.devicePixelRatio);
                    renderer.setSize(document.getElementById("mainId").offsetWidth, document.getElementById("mainId").offsetHeight);
                    renderer.shadowMap.enabled = true;
                    renderer.domElement.addEventListener('dblclick', onDocumentMouseDown, true);
                    document.getElementById("mainId").appendChild(renderer.domElement);
                    //render2初始化
                    renderer2 = new THREE.CSS3DRenderer();
                    renderer2.setSize(document.getElementById("mainId").offsetWidth, document.getElementById("mainId").offsetHeight);
                    renderer2.domElement.style.position = 'absolute';
                    renderer2.domElement.style.top = 0;
                    renderer2.domElement.className = 'signcover';
                    renderer2.domElement.style.zindex = -1;
                    document.getElementById("mainId").appendChild(renderer2.domElement);
                    renderer2.domElement.addEventListener('dblclick', onDocumentMouseDown, true);
                }


                let ratio = null;

                // 鼠标左键标注
                function onDocumentMouseDown(e) {
                    // console.log(e);
                    var rect = renderer2.domElement.getBoundingClientRect();
                    mouse.x = ( ( e.clientX - rect.left ) / rect.width ) * 2 - 1;
                    mouse.y = -( ( e.clientY - rect.top ) / rect.height ) * 2 + 1;
                    ratio = e.clientX/mouse.x
                    e.preventDefault();
                    //mouse.x = (e.clientX / document.getElementById("mainId").offsetWidth) * 2 - 1;
                    //mouse.y = -(e.clientY / document.getElementById("mainId").offsetHeight) * 2 + 1;
                    //mouse.X = (e.clientX /  window.innerWidth) * 2 + 1;
                    //mouse.y = -(e.clientY /  window.innerHeight) * 2 + 1;
                    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
                    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
                    // var raycaster = new THREE.Raycaster();
                    // raycaster.setFromCamera( new THREE.Vector2( mouse.x, mouse.y ), camera );
                    var intersects = raycaster.intersectObjects(urlObject.children, true);
                    if (intersects.length > 0) {
                        if (intersects[0].object.type == "Mesh"||intersects[0].object.type == "SkinnedMesh") {
                            showText(intersects[0].point);
                        }

                    }
                }

                // 标记编辑框
                function showText(point) {
                    // console.log(point)
                    // let signcover=document.getElementsByClassName("signcover")[0];
                    sessionStorage.point = JSON.stringify(point);
                    var indexId = 0, x, y, z, removeId, removeHtml;
                    var element = document.createElement('div');
                    element.innerHTML = "<div class='inputSignBox'>" +
                        "<div class='outSignbox'>X</div>" +
                        "<div class='signbox' contenteditable='true' id='inputText' tabindex='-1'><em id='deflutText'>输入标记</em></div>" +
                        "<div class='sureSign'>标注</div>" +
                        "</div>";
                    // signcover.firstChild.appendChild( element )
                    // console.log(signcover)
                    //添加编辑
                    $(document).on('click', '#inputText', function () {
                        $(this).focus();
                        $('.signbox em').remove();
                    });
                    //编辑框聚焦
                    $(document).on('click', '.outSignbox', function () {
                        $('.inputSignBox').remove();
                    });
                    //退出编辑
                    $(document).on('click', '.sureSign', function () {
                        if ($('.signbox em').length > 0) {
                            $('.inputSignBox').remove();
                        } else if ($('.signbox').text().length <= 0) {
                            $('.inputSignBox').remove();
                        } else {
                            indexId++;
                            var text = $.trim($('.signbox').text());
                            $('.inputSignBox').remove();
                            // 显示标记的内容
                            signText(JSON.parse(sessionStorage.point), indexId, text)
                            var mes = {x: point.x, y: point.y, z: point.z, message: text};
                            Data[Data.length] = mes;
                            sessionStorage.threeData = JSON.stringify(Data);
                        }
                    });
                    //弹出取消标记
                    $(document).on('mouseenter', '[id*=Ts]', function (e) {
                        var m = $(this).attr('id').replace(/[^0-9]/ig, "");   // m为id后面的数字
                        removeHtml = $(this).prop("outerHTML")   // 获取当前的html
                        e.stopPropagation();
                        removeId = m;
                        $('.chooseBox').remove();
                        x = $(this).attr('x');
                        y = $(this).attr('y');
                        z = $(this).attr('z');
                        $(this).append("<div class='chooseBox'><ul><li id='deleteSign'>X</li></ul></div>");
                    });
                    //删除标记
                    $(document).on('click', '#deleteSign', function () {
                        // 移除sessionStorage.threeData中的值
                        deleteData(x, y, z);
                        // 移除场景中相对于的物体对象
                        removeSign(x, y, z);
                    });
                    //点击消失
                    $(document).click(function () {
                        $('.chooseBox').remove();
                    });

                    var object = new THREE.CSS3DObject(element);
                    object.position.x = point.x;
                    object.position.y = point.y;
                    object.position.z = point.z;
                    // object.rotation.x = Math.random();
                    // object.rotation.y = Math.random();
                    // object.rotation.z = Math.random();
                    object.rotation.x = camera.rotation.x;
                    object.rotation.y = camera.rotation.y;
                    object.rotation.z = camera.rotation.z;


                    object.scale.x = (boxRange.x>100)?(0.8):(boxRange.x) * 0.01;
                    object.scale.y = (boxRange.y>100)?(0.8):(boxRange.y) * 0.01;
                    // console.log(object.scale);
                    
                    scene.add(object);
                    editText.push(object);
                    // console.log('显示标记框',editText)
                }

                // 显示标记
                function signText(point, id, text) {
                    var objectName = 'sign' + id
                    var signtext = document.createElement('div');
                    signtext.innerHTML = "<div class='signIndex' id='Ts" + id + "' theSign='" + text + "' x='" + point.x + "' y='" + point.y + "' z='" + point.z + "'>" + "<div class='hintBox'" + "title=" + text + ">" + text + "</div>" + "</div>";
                    setTimeout(() => {
                        function jisuan(num) {
                            return parseInt(num * ratio).toString()
                        }
                        let signIndex = document.querySelectorAll('.signIndex');
                        Array.from(signIndex).map((signDom) => {
                            signDom.style.width = jisuan(12) + 'px';
                            signDom.style.height = jisuan(17) + 'px';
                            signDom.style.marginTop = jisuan(-17) + 'px';
                            signDom.style.marginLeft = jisuan(-6) + 'px';
                            signDom.style.backgroundSize = jisuan(12) + 'px' + ' ' + jisuan(17) + 'px';
                            signDom.style.height = jisuan(-6) + 'px';
                        })
                    }, 100)

                    var signObject = new THREE.CSS3DObject(signtext);
                    signObject.position.x = point.x;
                    signObject.position.y = point.y;
                    signObject.position.z = point.z;
                    signObject.rotation.x = camera.rotation.x;
                    signObject.rotation.y = camera.rotation.y;
                    signObject.rotation.z = camera.rotation.z;
                    signObject.name = objectName   // 给物体对象设置特定name

                    signObject.scale.x = 0.5;
                    signObject.scale.y = 0.5;
                    scene.add(signObject);
                    signTexts.push(signObject);

                    // console.log('显示标记',signTexts)
                }

                // 删除标记记录
                function deleteData(x, y, z) {
                    for (var i = 0; i < Data.length; i++) {
                        if (Data[i].x == x && Data[i].y == y && Data[i].z == z) {
                            Data.splice(i, 1);
                            sessionStorage.threeData = JSON.stringify(Data);
                            break;
                        } else {
                            continue;
                        }
                    }
                }

                // 从场景中移除标注
                function removeSign(x, y, z) {
                    for (var n = 0; n < signTexts.length; n++) {
                        if (signTexts[n].position.x == x && signTexts[n].position.y == y && signTexts[n].position.z == z) {
                            var htmlSign = scene.getObjectByName(signTexts[n].name)   // 获取特定name的物体对象
                        }
                    }
                    scene.remove(htmlSign);
                }

                // 调用接口获取到标记并显示标记
                function showSign(signObj) {
                    let getShowSign = null
                    if (signObj && signObj.file) {
                        getShowSign = signObj.file.tag;
                    }
                    if (getShowSign) {
                        getShowSign.forEach((item, index) => {
                            // console.log(item)
                            getSignText(item.x, item.y, item.z, index, item.message)
                        })
                    }
                }
                //创建复合标记对象
                function creatHotpost(_intersects)
                {
                    //建立复合对象
                    var object = new THREE.Object3D();
                    object._text = creatHotPostTextEmpty(_intersects.point);//;//标记显示内容
                    object._effectPosition = _intersects.point;//标记位置
                    _intersects._face = [_intersects.face.a,_intersects.face.b,_intersects.face.c];
                    object._intersects = _intersects;
                    initSkinnedPosition(object._intersects);
                    object._barycoord = creatBarycoord(_intersects);//在初始化皮肤位置之后
                    return object;
                }
                //创建空的标记文本和背景，这里可以改成其他对象类型和样式
                function creatHotPostTextEmpty(_rayPoint)
                {
                    var element = document.createElement( 'div' );
                        element.textContent = 'tip:';
                        element.style.width = '10px';
                        element.style.height = '10px';
                        element.style.opacity = ( 100 < 5 ) ? 0.5 : 1;
                        element.style.background = new THREE.Color( Math.random() * 0xffffff ).getStyle();
                    
                    var _text = new THREE.CSS3DObject( element );
                        _text.position.x = _rayPoint.x;
                        _text.position.y = _rayPoint.y;
                        _text.position.z = _rayPoint.z;
                        // object.rotation.x = Math.random();
                        // object.rotation.y = Math.random();
                        // object.rotation.z = Math.random();
                        _text.rotation.x = camera.rotation.x;
                        _text.rotation.y = camera.rotation.y;
                        _text.rotation.z = camera.rotation.z;

                        _text.scale.x = 0.5;
                        _text.scale.y = 0.5;
                        return _text;
                }
                //更新CPU皮肤位置数据
                function _cpuSkinningVertex(in_skinnedMesh, in_face, in_barycoord, in_effectPosition)
                {
                    var _Vector4_1 = new THREE.Vector4(0,0,0,1), 
                        _Vector4_2 = new THREE.Vector4(0,0,0,1), 
                        _Vector4_3 = new THREE.Vector4(0,0,0,1), 
                        _Vector4_4 = new THREE.Vector4(0,0,0,1), 
                        _Vector4_5 = new THREE.Vector4(0,0,0,1), 
                        _Vector4_6 = new THREE.Vector4(0,0,0,0), 
                        _Vector4_7 = new THREE.Vector4(0,0,0,0), 
                        _vector4_array_1 = [], //骨骼矩阵数组
                        _vector4_array_2 = [];//三角位置临时变量

                    //初始化数组
                    for (let  l = 0; l < 3; ++l)
                    {
                        _vector4_array_2.push(new THREE.Vector4(0,0,0,0));
                    }
                    //临时变量
                    var _attributes   = in_skinnedMesh.geometry.attributes,     //SkinnedMesh几何缓存的属性
                        _bones        = in_skinnedMesh.skeleton.bones,          //SkinnedMesh骨架的骨骼
                        _boneInverses = in_skinnedMesh.skeleton.boneInverses;   //SkinnedMesh骨架的反向骨骼
                    //处理实时的骨骼信息
                    for (let m = 0; m < _bones.length; ++m)
                    {
                        _vector4_array_1.push(new THREE.Matrix4);//初始化骨骼矩阵数组
                        //世界坐标*反向骨骼
                        _vector4_array_1[m].multiplyMatrices( _bones[m].matrixWorld, _boneInverses[m])//Matrix4.第一个矩阵*第二个矩阵
                    }
                    //处理SkinnedMesh的BufferGeometry数据
                    var _position = _attributes.position,      //位置
                        _skinWeight = _attributes.skinWeight,  //权重
                        _skinIndex = _attributes.skinIndex,     //索引
                        _position_array = _position.array, 
                        _position_itemSize = _position.itemSize,     //position-BufferAttribute的关联值数量
                        _skinWeight_array = _skinWeight.array , 
                        _skinWeight_itemSize = _skinWeight.itemSize, //skinWeight-BufferAttribute的关联值数量
                        _skinIndex_array = _skinIndex.array, 
                        _skinIndex_itemSize = _skinIndex.itemSize;  //skinIndex-BufferAttribute的关联值数量
                    if (_position < 3 || _position > 4 || 4 != _skinWeight_itemSize || 4 != _skinIndex_itemSize)
                    {
                        console.log("wrong position data format!");
                    }
                    else 
                    {
                        var S = function(_vector, _point, _rotation) {
                            var _x = _point.x, _y = _point.y, _z = _point.z , _w = _point.w , 
                                matrix_E = _vector.elements;//Matrix4矩阵元素
                            return  _point.x = (matrix_E[0] * _x + matrix_E[4] * _y + matrix_E[8] * _z + matrix_E[12] * _w) * _rotation,
                                    _point.y = (matrix_E[1] * _x + matrix_E[5] * _y + matrix_E[9] * _z + matrix_E[13] * _w) * _rotation,
                                    _point.z = (matrix_E[2] * _x + matrix_E[6] * _y + matrix_E[10] * _z + matrix_E[14] * _w) * _rotation,
                                    _point.w = (matrix_E[3] * _x + matrix_E[7] * _y + matrix_E[11] * _z + matrix_E[15] * _w) * _rotation,
                                    _point
                        };
                        //3次循环，填入更新后的位置
                        for (m = 0; m < in_face.length; ++m) {
                            var w = in_face[m] * _skinWeight_itemSize , 
                                P = in_face[m] * _position_itemSize;

                                _Vector4_1.x = _position_array[P + 0],//3
                                _Vector4_1.y = _position_array[P + 1],//4
                                _Vector4_1.z = _position_array[P + 2],//5
                                _Vector4_1.w = 1,
                                _Vector4_2.x = _position_array[P + 0],//3
                                _Vector4_2.y = _position_array[P + 1],//4
                                _Vector4_2.z = _position_array[P + 2],//5
                                _Vector4_2.w = 1,
                                _Vector4_3.x = _position_array[P + 0],//3
                                _Vector4_3.y = _position_array[P + 1],//4
                                _Vector4_3.z = _position_array[P + 2],//5
                                _Vector4_3.w = 1,
                                _Vector4_4.x = _position_array[P + 0],//3
                                _Vector4_4.y = _position_array[P + 1],//4
                                _Vector4_4.z = _position_array[P + 2],//5
                                _Vector4_4.w = 1,

                                _Vector4_6.x = _skinWeight_array[w + 0],//4
                                _Vector4_6.y = _skinWeight_array[w + 1],//5
                                _Vector4_6.z = _skinWeight_array[w + 2],//6
                                _Vector4_6.w = _skinWeight_array[w + 3],//7

                                _Vector4_7.x = _skinIndex_array[w + 0],//4
                                _Vector4_7.y = _skinIndex_array[w + 1],//5
                                _Vector4_7.z = _skinIndex_array[w + 2],//6
                                _Vector4_7.w = _skinIndex_array[w + 3],//7

                                S(_vector4_array_1[_Vector4_7.x], _Vector4_1, _Vector4_6.x),
                                S(_vector4_array_1[_Vector4_7.y], _Vector4_2, _Vector4_6.y),
                                S(_vector4_array_1[_Vector4_7.z], _Vector4_3, _Vector4_6.z),
                                S(_vector4_array_1[_Vector4_7.w], _Vector4_4, _Vector4_6.w),

                                _Vector4_5.x = _Vector4_1.x + _Vector4_2.x + _Vector4_3.x + _Vector4_4.x,
                                _Vector4_5.y = _Vector4_1.y + _Vector4_2.y + _Vector4_3.y + _Vector4_4.y,
                                _Vector4_5.z = _Vector4_1.z + _Vector4_2.z + _Vector4_3.z + _Vector4_4.z,
                                _Vector4_5.w = 1,

                                _vector4_array_2[m].copy(_Vector4_5);
                        }

                        //设置数据
                        in_effectPosition.set(0, 0, 0);
                        // console.log(_vector4_array_2);
                        in_effectPosition.addScaledVector(_vector4_array_2[0], in_barycoord.x);
                        in_effectPosition.addScaledVector(_vector4_array_2[1], in_barycoord.y);
                        in_effectPosition.addScaledVector(_vector4_array_2[2], in_barycoord.z);
                        // console.log(in_effectPosition);
                    }
                        
                }
                //获得重心
                function creatBarycoord(_intersects)
                {
                    var _object = _intersects.object;
                    var _face = _intersects.face;
                    var _vertexEC = _object.__skinnedPosition.__vertexElementCount, //实时的skinned位置和三角形数量？
                        l = _face.a * _vertexEC + 0, 
                        _p1 = new THREE.Vector3(_object.__skinnedPosition[l],
                                            _object.__skinnedPosition[l + 1],
                                            _object.__skinnedPosition[l + 2]), 
                        u = _face.b * _vertexEC + 0, 
                        _p2 = new THREE.Vector3(_object.__skinnedPosition[u],
                                            _object.__skinnedPosition[u + 1],
                                            _object.__skinnedPosition[u + 2]), 
                        p = _face.c * _vertexEC + 0, 
                        _p3 = new THREE.Vector3(_object.__skinnedPosition[p],
                                            _object.__skinnedPosition[p + 1],
                                            _object.__skinnedPosition[p + 2]);
                    return THREE.Triangle.getBarycoord(_intersects.point,_p1,_p2,_p3);
                }
                //初始化皮肤位置
                function initSkinnedPosition(_intersects)
                {
                    //处理一个暂时不知道什么用的三角形
                        //同时用三角面的3个值(a,b,c)生成3个点
                        _intersects.object.__skinnedPosition || (_intersects.object.__skinnedPosition = new Float32Array(_intersects.object.geometry.attributes.position.array.length),
                        _intersects.object.__skinnedPosition.__vertexElementCount = _intersects.object.geometry.attributes.position.itemSize);
                        var _attributes = _intersects.object.geometry.attributes;
                        var _bones = _intersects.object.skeleton.bones;
                        var _boneInverses = _intersects.object.skeleton.boneInverses;
                        var _boneArray=[];
                        for(let a=0;a<_bones.length;a++)
                        {
                            _boneArray.push(new THREE.Matrix4);
                            _boneArray[a].multiplyMatrices(_bones[a].matrixWorld, _boneInverses[a]);
                        }

                        var s = _attributes.position
                            , h = _attributes.skinWeight
                            , l = _attributes.skinIndex
                            , c = s.array
                            , u = s.itemSize
                            , d = h.array
                            , p = h.itemSize
                            , E = l.array
                            , f = l.itemSize;
                        var m = new THREE.Vector4(0,0,0,1)
                                , g = new THREE.Vector4(0,0,0,1)
                                , T = new THREE.Vector4(0,0,0,1)
                                , _ = new THREE.Vector4(0,0,0,1)
                                , R = new THREE.Vector4(0,0,0,1)
                                , v = new THREE.Vector4(0,0,0,0)
                                , y = new THREE.Vector4(0,0,0,0)
                                , H = function(e, t, r) {
                                var i = t.x
                                    , n = t.y
                                    , a = t.z
                                    , o = t.w
                                    , s = e.elements;
                                return t.x = (s[0] * i + s[4] * n + s[8] * a + s[12] * o) * r,
                                    t.y = (s[1] * i + s[5] * n + s[9] * a + s[13] * o) * r,
                                    t.z = (s[2] * i + s[6] * n + s[10] * a + s[14] * o) * r,
                                    t.w = (s[3] * i + s[7] * n + s[11] * a + s[15] * o) * r,
                                    t
                            };
                        (new THREE.Matrix4).getInverse(_intersects.object.matrixWorld);
                        for (var x = 0, b = 0; x < c.length; x += u,b += f)
                        {
                                    m.x = c[x + 0],
                                    m.y = c[x + 1],
                                    m.z = c[x + 2],
                                    m.w = 1,
                                    g.x = c[x + 0],
                                    g.y = c[x + 1],
                                    g.z = c[x + 2],
                                    g.w = 1,
                                    T.x = c[x + 0],
                                    T.y = c[x + 1],
                                    T.z = c[x + 2],
                                    T.w = 1,
                                    _.x = c[x + 0],
                                    _.y = c[x + 1],
                                    _.z = c[x + 2],
                                    _.w = 1,
                                    v.x = d[b + 0],
                                    v.y = d[b + 1],
                                    v.z = d[b + 2],
                                    v.w = d[b + 3],
                                    y.x = E[b + 0],
                                    y.y = E[b + 1],
                                    y.z = E[b + 2],
                                    y.w = E[b + 3],
                                    H(_boneArray[y.x], m, v.x),
                                    H(_boneArray[y.y], g, v.y),
                                    H(_boneArray[y.z], T, v.z),
                                    H(_boneArray[y.w], _, v.w),
                                    R.x = m.x + g.x + T.x + _.x,
                                    R.y = m.y + g.y + T.y + _.y,
                                    R.z = m.z + g.z + T.z + _.z,
                                    R.w = 1,
                            _intersects.object.__skinnedPosition[x+0] = R.x;
                            _intersects.object.__skinnedPosition[x+1] = R.y;
                            _intersects.object.__skinnedPosition[x+2] = R.z;
                        }
                }
                //更新标记
                function updateHotpost()
                {
                }
                //窗口重置
                function onWindowResize() {
                    camera.aspect = document.getElementById("mainId").offsetWidth / document.getElementById("mainId").offsetHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(document.getElementById("mainId").offsetWidth, document.getElementById("mainId").offsetHeight);
                }

                // 获取到坐标点和标注信息
                function getSignText(x, y, z, id, text) {   // x,y,z为坐标，id为下标，text为标注内容
                    var objectName = 'getsign' + id
                    var signtext = document.createElement('div');
                    signtext.innerHTML = "<div class='signIndex' id='Ts" + id + "' theSign='" + text + "' x='" + x + "' y='" + y + "' z='" + z + "'>" + "<div class='hintBox'" + "title=" + text + ">" + text + "</div>" + "</div>";
                    //signIndex.style.width=12+'px'
                    //signIndex.style.height=12+'px'
                    var getSignObject = new THREE.CSS3DObject(signtext);
                    getSignObject.position.x = x;
                    getSignObject.position.y = y;
                    getSignObject.position.z = z;
                    getSignObject.rotation.x = camera.rotation.x;
                    getSignObject.rotation.y = camera.rotation.y;
                    getSignObject.rotation.z = camera.rotation.z;
                    getSignObject.name = objectName   // 给物体对象设置特定name

                    getSignObject.scale.x = 0.5;
                    getSignObject.scale.y = 0.5;
                    scene.add(getSignObject);
                    getSignTexts.push(getSignObject);
                    // console.log('显示获取标记',getSignTexts)
                }

                //动画
                function animate() {
                    requestAnimationFrame(animate);
                    if (mixers.length > 0) {
                        for (var i = 0; i < mixers.length; i++) {
                            mixers[i].update(clock.getDelta());
                        }
                        //urlAnimate.framerate,帧数/时间
                        //urlAnimate.perframe,时间/帧数
                        //_this.animationProgressData
                        if(clock.elapsedTime<urlAnimate.time)
                        {
                            if(_this.animationProgressData)
                            {
                                //按帧播放版本
                                // _this.animationProgressData.value = clock.elapsedTime/urlAnimate.perframe;
                                //按时间模仿版本
                                _this.animationProgressData.value = clock.elapsedTime ;
                                // console.log(_this.animationProgressData.value);
                                
                                _this.animationProgressData.button.style.left = _this.animationProgressData.value * _this.animationProgressData.pervalue + "px";
                                // console.log(clock.elapsedTime);
                                
                            }   
                        }
                        else
                        {
                            clock.elapsedTime=0;
                        }
                    } 
                    if(controls)
                        controls.update();
                    // updateCrossFadeControls();
                    renderer.render(scene, camera);
                    renderer2.render(scene, camera);
                }

                function updateCrossFadeControls() {
                    crossFadeControls.forEach( function ( control ) {
                        // control.setDisabled();
                    } );
                }
            },
            getSign() {
                let TaskID = this.storeTaskID
                if (TaskID == 0 || TaskID === null) {
                    return false;
                }

                let url = this.GLOBAL.baseRouter + 'task/task/task-stage&task_id=' + TaskID;
                this.$axios.get(url)
                    .then(res => res.data)
                    .then(res => {
                        if (res.err_code == 0) {
                            
                            
                            this.signList = res.data; 
                            this.signList.forEach((item, index) => {
                                // console.log(item);
                                if (item.file.is_main === '1') {
                                    console.log(item);
                                    console.log(item.status);
                                    this.signData = item;
                                    this.onload();

                                    this.fileId = item.file.stage_id
                                }
                            });
                        }
                    })
            },
            //getUserInfo
            userInfos(){
                let Infos = JSON.parse(Cookies.get('company'));
                console.log(Infos);
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
            }
        },
        components: {
            feedbackInfo
        }
    };
</script>
<style>
    html, body {
        height: 100%;
    }
    body {
        font-family: Monospace;
        background-color: #ebeff2;
        color: #fff;
        margin: 0px;
        overflow: hidden;
    }
    /* #mainId{
        position: absolute;
    } */
    #info {
        position: absolute;
        top: 0px;
        right: 0px;
        width: 200px;
        height: auto;
        background: #00000049;
        text-align: left;
        padding: 0;
        margin: 4px 4px;
        z-index: 100;
    }
    #info li{
        color: #ffffff;
        font-size:12px;
        margin: 4px 4px;
    }
    #three_progress {
        /* z-index: 101; */
        /* background: rgba(138, 138, 138, 0); */
        background-color: #9a9da3;
        /* border: 1px solid #3bceb6; */
        /* cursor: pointer; */
        width: 80%;
        height: 6px;
        position: absolute;
        left:90px;
        margin : 10px 0px;
    }
    #three_progress:before {
        width: 100%;
        height: 150%;
        display: block;
        border-top:1px dashed #33ffff;
    }
    #progress_drag_button{
        z-index: 101;
        position: absolute;
        left:0px;
        width:14px;
        height:14px;
        background:#3bceb6;
        border-radius:50%;
        margin : -4px 0px;
        padding: 0px;
        cursor: pointer;
    }
    #progress_button {
        color: #fdfdfd;
        font-size:12px;
        background: rgba(255, 255, 255, 0);
        /* border: 1px solid #3bceb6; */
        margin : 3px 5px;
        cursor: pointer;
        width: 80px;
        height: 24px;
        position: absolute;
        left:0px;
    }
    #menu_progress {
        position: absolute;
        top :719px;
        height: 30px;

        text-align: left;
        padding: 0;
        margin: 4px 4px;
        z-index: 101;
        background: #00000049;
    }
    #menu_1 {
        position: absolute;
        top :0px;
        left:0px;
        width: 80px;
        height: auto;
        text-align: left;
        padding: 0;
        margin: 4px 4px;
        z-index: 100;
        background: #00000049;
    }
    #three_button {
        color: #fdfdfd;
        font-size:12px;
        background: rgba(255, 255, 255, 0);
        border: 1px solid #3bceb6;
        /* padding: 5px 10px; */
        cursor: pointer;
        width: 80px;
        height: 24px;
    }
    #three_button:hover {
        background-color: #3bceb6;
    }
    #three_button:active {
        color: #000000;
        background-color: #3bceb6;
    }
    select {
        /* color: #bcbcbc; */
        /* background: rgba(255, 255, 255, 0); */
        /* border: 1px solid #3bceb6; */
        /* padding: 5px 10px; */
        /* cursor: pointer; */
        /* width: 100px; */
        /* height: 32px; */
        /* z-index: 100; */
    }
</style>
<style scoped lang="less">
    @import "threeFile/style/feek.less";
</style>
<style scoped>
    @import "threeFile/style/sign.css";
</style>
