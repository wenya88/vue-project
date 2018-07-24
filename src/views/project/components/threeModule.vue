
<template>
  <!-- 模型插槽 -->
  <body>
    <div id="maind">
    </div>
  </body>
</template>
<script>
var qs = require("querystring");

export default {
  data() {
    return {
      fileKey: "",
      file_obj: {},
      fbxurl: '',
      cityList: [
        {
          value: 0,
          label: 'M_atk'
        },
        {
          value: 1,
          label: 'M_idle'
        },
        {
          value: 2,
          label: 'L_atk'
        },
        {
          value: 3,
          label: 'L_idle'
        }
      ],
      model1: ''
    };
  },
  mounted() {
    if (window.THREE) {
      // console.log('THREE has ready1')
      this.newFBXMedel();
    } else {
      $LAB
        .script("./src/views/project/components/threeFile/js/three.js").wait()
        .script("./src/views/project/components/threeFile/js/inflate.min.js").wait()
        .script("./src/views/project/components/threeFile/js/FBXLoader.js").wait()
        .script("./src/views/project/components/threeFile/js/CSS3DRenderer.js").wait()
        .script("./src/views/project/components/threeFile/js/OrbitControls.js").wait(() => {
          // console.log('THREE is ready2');
          this.newFBXMedel();
        })
    }
    // this.newFBXMedel();
  },
  computed: {
    storeFileURl(){
      return this.$store.state.ImgVedioStatus.FileURl
    }
  },
  methods: {
    newFBXMedel() {
      // this.getThreeFileKey();
      var container, stats, controls;//容器、统计?、控制器
      var camera, scene, renderer, light, renderer2;//相机、场景、渲染、灯光
      var clock = new THREE.Clock();//时钟
      var mixers = [];
      var Data = [];
      var editText = [];
			var signTexts = [];

      var mouse = new THREE.Vector2();
			var raycaster = new THREE.Raycaster();
      var urlObject;

      var divHeight = 100%
      // init(this.storeFileURl);//初始化
      init();
      animate();//动画
      function init() {
        //获得div并添加容器
        container = document.createElement('div');
        document.getElementById("maind").appendChild(container);
        //设置相机(可视角度,canvas宽高比,近距离,远距离)
        // camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 2000);    
        camera = new THREE.PerspectiveCamera(65, document.getElementById("maind").offsetWidth / (window.innerHeight/2+20), 1, 2000);    
        camera.position.set(0, 200, 300);
        //轨道控制插件
        controls = new THREE.OrbitControls(camera);
        controls.target.set(0, 100, 0);
        controls.update();
        //场景
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xa0a0a0);
        scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
        //半球光
        light = new THREE.HemisphereLight(0xffffff, 0x444444);
        light.position.set(0, 200, 0);
        scene.add(light);
        //日光
        light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, 200, 100);
        light.castShadow = true;
        light.shadow.camera.top = 180;
        light.shadow.camera.bottom = -100;
        light.shadow.camera.left = -120;
        light.shadow.camera.right = 120;
        scene.add(light);
        //mesh
        var mesh = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(2000, 2000),
          new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        scene.add(mesh);
        //地面
        var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        scene.add(grid);
        //加载
        var loader = new THREE.FBXLoader();
        // let url3 = "http://192.168.2.19/index.php?r=file/file/get-file&fid=1145";
        // let url = '../src/views/project/components/threeFile/M_atk.fbx';
        // let url4 = "https://threejs.org/examples/models/fbx/Samba%20Dancing.fbx";
        // console.log(loader);
        let url = 'https://yhc-1.oss-cn-shanghai.aliyuncs.com/test/M_atk.FBX'
        
        loader.load(url, function(object) {
          // console.log(url2);
          object.mixer = new THREE.AnimationMixer(object);
          mixers.push(object.mixer);
          var action = object.mixer.clipAction(object.animations[0]);
          action.play();
          object.traverse(function(child) {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          scene.add(object);
          urlObject = object;
        });
        //渲染
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        // renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setSize(document.getElementById("maind").offsetWidth, window.innerHeight/2+20);
        // renderer.setSize(document.getElementById("maind").offsetWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);
        // window.addEventListener('resize', onWindowResize, false);

        renderer2 = new THREE.CSS3DRenderer();
        // renderer2.setSize( window.innerWidth, window.innerHeight );
        renderer2.setSize(document.getElementById("maind").offsetWidth, window.innerHeight/2+20);
        // renderer2.setSize(document.getElementById("maind").offsetWidth, window.innerHeight);
				renderer2.domElement.style.position = 'absolute';
        renderer2.domElement.style.top = 0;
        renderer2.domElement.className = 'signcover'
				container.appendChild( renderer2.domElement );
				renderer2.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );

        window.addEventListener( 'resize', onWindowResize, false );
        

      }

      // 鼠标右键标注
			function onDocumentMouseDown(e) {
				e.preventDefault();
				if(e.buttons === 2) {
					//将鼠标点击位置的屏幕坐标转成threejs中的标准坐标,具体解释见代码释义
					mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
					mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
					
					//新建一个三维单位向量 假设z方向就是0.5
					//根据照相机，把这个向量转换到视点坐标系
					var vector = new THREE.Vector3(mouse.x, mouse.y,0.5).unproject(camera);
					//在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
					var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
					
					//射线和模型求交，选中一系列直线
					var intersects = raycaster.intersectObjects(urlObject.children);
					if (intersects.length > 0) {
						//选中第一个射线相交的物体
						// SELECTED = intersects[0].object;
						var intersected = intersects[0].object;
						showText(intersects[0].point);
					}
					e.stopPropagation();
				}
      }
			
			function showText(point) {
        console.log(point)
        // let signcover=document.getElementsByClassName("signcover")[0];
        sessionStorage.point = JSON.stringify(point);
        var indexId = 0, x, y, z, removeId, removeHtml;
				var element = document.createElement( 'div' );
          element.innerHTML = "<div class='inputSignBox'>"+
          "<div class='outSignbox'>X</div>"+
          "<div class='signbox' contenteditable='true' id='inputText' tabindex='-1'><em id='deflutText'>输入标记</em></div>"+
          "<div class='sureSign'>标注</div>"+
          "</div>";
        // signcover.firstChild.appendChild( element )
          // console.log(signcover)
					//添加编辑
          $(document).on('click','#inputText',function(){
            $(this).focus();
            $('.signbox em').remove();
          });
          //编辑框聚焦
          $(document).on('click','.outSignbox',function(){
            $('.inputSignBox').remove();
          });
          //退出编辑
          $(document).on('click','.sureSign',function(){
            if($('.signbox em').length>0){
              $('.inputSignBox').remove();
            }else if($('.signbox').text().length<=0){
              $('.inputSignBox').remove();
            }else{
              indexId++;
              var text=$.trim($('.signbox').text());
							$('.inputSignBox').remove();
							// 显示标记的内容
              signText(JSON.parse(sessionStorage.point),indexId,text)
              var mes={x:point.x,y:point.y,z:point.z,message:text};
              Data[Data.length]=mes;
              sessionStorage.threeData=JSON.stringify(Data);
            }
					});
					//弹出取消标记
					$(document).on('mouseenter','[id*=Ts]',function(e){
						var m=$(this).attr('id').replace(/[^0-9]/ig, "");   // m为id后面的数字
						removeHtml = $(this).prop("outerHTML")   // 获取当前的html
              e.stopPropagation();
              removeId=m;
							$('.chooseBox').remove();
							x=$(this).attr('x');
							y=$(this).attr('y');
							z=$(this).attr('z');
              $(this).append("<div class='chooseBox'><ul><li id='deleteSign'>X</li></ul></div>");
					});
					//删除标记
          $(document).on('click','#deleteSign',function(){
						// 移除sessionStorage.threeData中的值
						deleteData(x,y,z);
						// 移除场景中相对于的物体对象
						removeSign(x,y,z);
          });
          //点击消失
          $(document).click(function(){
            $('.chooseBox').remove();
					});
					
        var object = new THREE.CSS3DObject( element );
					object.position.x = point.x;
					object.position.y = point.y;
					object.position.z = point.z;
					// object.rotation.x = Math.random();
					// object.rotation.y = Math.random();
					// object.rotation.z = Math.random();
					object.rotation.x = camera.rotation.x;
					object.rotation.y = camera.rotation.y;
				 	object.rotation.z = camera.rotation.z;


					object.scale.x = 0.5;
					object.scale.y = 0.5;
					scene.add( object );
					
					editText.push(object);
					// console.log(editText);	
			}

      // 显示标记
      function signText(point,id,text) {
				var objectName = 'sign'+id
        var signtext = document.createElement('div');
				signtext.innerHTML = "<div class='signIndex' id='Ts"+id+"' theSign='"+text+"' x='"+point.x+"' y='"+point.y+"' z='"+point.z+"'>"+"<div class='hintBox'"+"title="+text+">"+text+"</div>"+"</div>";
				
        var signObject = new THREE.CSS3DObject( signtext );
        signObject.position.x = point.x;
        signObject.position.y = point.y;
        signObject.position.z = point.z;
        signObject.rotation.x = camera.rotation.x;
        signObject.rotation.y = camera.rotation.y;
        signObject.rotation.z = camera.rotation.z;
				signObject.name = objectName   // 给物体对象设置特定name

        signObject.scale.x = 0.5;
        signObject.scale.y = 0.5;
				scene.add( signObject );
				signTexts.push(signObject);
			}
			// 删除标记记录
			function deleteData(x,y,z){
				for(var i=0;i<Data.length;i++){
					if(Data[i].x==x&&Data[i].y==y&&Data[i].z==z){
						Data.splice(i,1);
						sessionStorage.threeData=JSON.stringify(Data);
						break;
					}else{
						continue;
					}
				}
			}
			// 从场景中移除标注
			function removeSign(x,y,z) {
				for(var n=0;n<signTexts.length;n++) {
					if(signTexts[n].position.x==x&&signTexts[n].position.y==y&&signTexts[n].position.z==z) {
						var htmlSign = scene.getObjectByName(signTexts[n].name)   // 获取特定name的物体对象
					}
				}
				scene.remove( htmlSign );
			}
      //窗口重置
      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
      //动画
      function animate() {
        requestAnimationFrame(animate);
        // if (mixers.length > 0) {
        //   for (var i = 0; i < mixers.length; i++) {
        //     mixers[i].update(clock.getDelta());
        //   }
        // }
        renderer.render(scene, camera);
        renderer2.render( scene, camera );
      }
    }
  }
};
</script>
<style>
body {
  font-family: Monospace;
  background-color: #ebeff2;
  color: #fff;
  margin: 0px;
  overflow: hidden;
}
</style>
<style scoped>
@import "threeFile/style/sign.css";
</style>
