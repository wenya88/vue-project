
<template>
  <!-- 模型插槽 -->

  <body>
    <div id="maind"></div>
  </body>
</template>
<script>
// import THREE from "three";//node库中的内容
// import FBXLoader from "three-fbx-loader";//node库中的内容-非官方存在内容错误,但是能使用
// import OrbitControls from "three-orbitcontrols";
// import THREE from "./threeFile/js/FBXLoader.js";
// import FBXLoader from "./threeFile/js/FBXLoader.js";//本地，但是会引起全局变量冲突
// import OrbitControls from "./threeFile/js/OrbitControls.js";
// var THREE = require('./threeFile/js/three.js');
// var FBXLoader = require('./threeFile/js/FBXLoader.js');
// var OrbitControls = require('./threeFile/js/OrbitControls.js');
// $LAB
//   .setOptions({AlwaysPreserveOrder:true})
//   .script("../src/views/project/components/threeFile/js/three.js")
//   .script("../src/views/project/components/threeFile/js/inflate.min.js")
//   .script("../src/views/project/components/threeFile/js/OrbitControls.js")
//   .script("../src/views/project/components/threeFile/js/FBXLoader.js").wait(function(){
//       console.log(THREE);
//   });
var qs = require("querystring");
var Zlib = require('zlib');
import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'

export default {
  data() {
    return {
      fileKey:""
    };
  },
  // mounted() {
  //   // this.fbxThree();
  //   this.newFBXMedel();
  // },
  mounted() {
      if (window.THREE) {
        console.log('THREE has ready1')
        this.newFBXMedel();
      } else {
        $LAB
          .script("./src/views/project/components/threeFile/js/three.js").wait()
          .script("./src/views/project/components/threeFile/js/inflate.min.js").wait()
          .script("./src/views/project/components/threeFile/js/FBXLoader.js").wait()
          .script("./src/views/project/components/threeFile/js/OrbitControls.js").wait(() => {
            console.log('THREE is ready2');
            this.newFBXMedel();
            
          })
      }
    // this.newFBXMedel();
  },
  methods: {
    //请求3D文件凭证
    getThreeFileKey()
    {
      let msg = {
        id:"1253,1254,1255",
        type:"package"
      }
      this.$axios.post(this.GLOBAL.baseRouter + 'file/file/get-file-key',qs.stringify(msg))
        .then( res => res.data)
        .then( res => {
                console.log(res);
                this.fileKey = res.url_key;
                this.loadThreeFile();
            }
        )
        .catch(error => {
            console.log(error);
            
            this.$Message.error("获取任务信息失败，请重试！");
        });
    },
    //获得下载文件包
    loadThreeFile()
    {
      let url = 'http://192.168.2.19/index.php?r=file/file/download&url_key='+this.fileKey
      JSZipUtils.getBinaryContent(url, function(err, data) {
          if(err) {
              throw err; // or handle err
          }
          console.log(data);
          
          JSZip.loadAsync(data).then(function (zip) {
              console.log(zip);
              console.log(zip.files);
              
              // ...
              });
          });
      // this.$axios.post(this.GLOBAL.baseRouter + 'file/file/download',qs.stringify({url_key: this.fileKey}))
      // .then( res => res.data)
      // .then( res => {
      //       var new_zip = new JSZip();
      //       console.log(new_zip);
      //       JSZip.loadAsync(res).then(function (zip) {
      //         console.log(zip)
      //       })
      //     }
      // )
      // .catch(error => {
      //     console.log(error);
        
      //     this.$Message.error("获取任务信息失败，请重试！");
      // });
    },
    newFBXMedel() {
      this.getThreeFileKey();
      var container, stats, controls;//容器、统计?、控制器
      var camera, scene, renderer, light;//相机、场景、渲染、灯光

      var clock = new THREE.Clock();//时钟

      var mixers = [];

      init();//初始化
      animate();//动画

      function init() {
        //获得div并添加容器
        container = document.createElement('div');
        document.getElementById("maind").appendChild(container);
        //设置相机(视角,纵横比,近距离,远距离)
        camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.set(100, 200, 300);
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
        let url3 = "http://192.168.2.19/index.php?r=file/file/get-file&fid=1145";
        let url2 = '../src/views/project/components/threeFile/M_atk.fbx';
        let url4 = "https://threejs.org/examples/models/fbx/Samba%20Dancing.fbx";
        console.log(loader);
        
        loader.load(url2, function(object) {
          console.log(object);

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
        });
        //渲染
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
        // stats
        // stats = new Stats();
        // container.appendChild( stats.dom );
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
        if (mixers.length > 0) {
          for (var i = 0; i < mixers.length; i++) {
            mixers[i].update(clock.getDelta());
          }
        }
        renderer.render(scene, camera);
        // stats.update();
      }
    },
    fbxModel() {
      //获得div
      var container = document.createElement("div");
      document.getElementById("maind").appendChild(container);
      //设置相机(视角,纵横比,近距离,远距离)
      let camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 1, 2000);
      camera.position.set(100, 200, 300);

      // 地面
      let mesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(2000, 2000),
        new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
      );
      mesh.rotation.x = -Math.PI / 2;
      mesh.receiveShadow = true;

      let grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
      grid.material.opacity = 0.2;
      grid.material.transparent = true;

      //轨道控制插件
      let controls = new THREE.OrbitControls(camera);
      controls.target.set(0, 100, 0);
      controls.update();

      var scene = new THREE.Scene();
      scene.add(mesh);
      scene.add(grid);

      var loader = new THREE.FBXLoader();
      let url3 = "http://192.168.2.19/index.php?r=file/file/get-file&fid=1145";
      loader.load(url3, function(object3d) {
        scene.add(object3d);
      });
    },
    fbxThree() {
      var container, stats, controls;//容器、统计、控制器
      var camera, scene, renderer, light;//相机、场景、渲染、灯光

      var clock = new THREE.Clock();//时钟

      var mixers = [];

      init();//初始化
      animate();//动画

      function init() {
        //获得div并添加容器
        container = document.createElement("div");
        document.getElementById("maind").appendChild(container);
        //设置相机(视角,纵横比,近距离,远距离)
        camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.set(0, 200, 300);
        //轨道控制插件
        controls = new THREE.OrbitControls(camera);
        controls.target.set(0, 100, 0);
        controls.update();
        //场景
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xa0a0a0);
        scene.fog = new THREE.Fog(0xa0a0a0, 500, 1000);
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
        scene.add(new THREE.CameraHelper(light.shadow.camera));
        // 地面
        var mesh = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(2000, 2000),
          new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
        );
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;
        scene.add(mesh);
        //网格
        var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        scene.add(grid);

        // 模型
        let url1 = "https://hopepdm.github.io/modelview/model/hand.fbx";
        let url2 = "../threeFile/image_module/fbx/2k/M_atk.FBX";
        let url3 = "http://192.168.2.19/index.php?r=file/file/get-file&fid=1145";
        let url4 = "https://threejs.org/examples/models/fbx/Samba%20Dancing.fbx";
        let url5 = "http://192.168.2.19/3d/Samba%20Dancing.fbx";
        var loader = new THREE.FBXLoader();

        loader.load(url4, function(object) {
          console.log(object);
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
        },
          // function() {},
          // function(err) {
          //   console.log(err);
          // }
        );
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);
        window.addEventListener("resize", onWindowResize, false);
        // stats
        // stats = new Stats();
        // container.appendChild(stats.dom);
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
        if (mixers.length > 0) {
          for (var i = 0; i < mixers.length; i++) {
            mixers[i].update(clock.getDelta());
          }
        }
        renderer.render(scene, camera);
        // stats.update();
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




/* #info {
  color: #fff;
  position: absolute;
  top: 10px;
  width: 100%;
  text-align: center;
  z-index: 100;
  display: block;
}
#info a,
.button {
  color: #f00;
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
} */
</style>
