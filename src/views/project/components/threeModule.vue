
<template>
  <!-- 模型插槽 -->
    <body>
        <div id="maind"></div>
    </body>
</template>
<script>
import * as THREE from "three";//node库中的内容
import FBXLoader from "three-fbx-loader";//node库中的内容-非官方存在内容错误,但是能使用
import OrbitControls from "three-orbitcontrols";
// import THREE from "./threeFile/js/three.js";
// import FBXLoader from "./threeFile/js/FBXLoader.js";//本地，但是会引起全局变量冲突
// import * as OrbitControls from "./threeFile/js/OrbitControls.js";
// var THREE = require('./threeFile/js/three.js');
// var FBXLoader = require('./threeFile/js/FBXLoader.js');
// var OrbitControls = require('./threeFile/js/OrbitControls.js');

export default {
  data() {
    return {};
  },
  mounted() {
    // this.fbxThree();
    this.newFBXMedel();
  },
  methods: {
    newFBXMedel()
    {
        var container, stats, controls;//容器、统计?、控制器
        var camera, scene, renderer, light;//相机、场景、渲染、灯光

        var clock = new THREE.Clock();//时钟

        var mixers = [];

        init();//初始化
			  animate();//动画

        function init() {
          //获得div并添加容器
          container = document.createElement( 'div' );
          document.getElementById("maind").appendChild( container );
          //设置相机(视角,纵横比,近距离,远距离)
          camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 1, 2000 );
          camera.position.set( 0, 200, 300 );
          //轨道控制插件
          controls = new OrbitControls( camera );
				  controls.target.set( 0, 100, 0 );
          controls.update();
          //场景
          scene = new THREE.Scene();
				  scene.background = new THREE.Color( 0xa0a0a0 );
          scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );
          //半球光
          light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
				  light.position.set( 0, 200, 0 );
          scene.add( light );
          //日光
          light = new THREE.DirectionalLight( 0xffffff );
          light.position.set( 0, 200, 100 );
          light.castShadow = true;
          light.shadow.camera.top = 180;
          light.shadow.camera.bottom = -100;
          light.shadow.camera.left = -120;
          light.shadow.camera.right = 120;
          scene.add( light );
          //mesh
          var mesh = new THREE.Mesh( 
            new THREE.PlaneBufferGeometry( 2000, 2000 ), 
            new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
				  mesh.rotation.x = - Math.PI / 2;
				  mesh.receiveShadow = true;
          scene.add( mesh );
          //地面
          var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
          grid.material.opacity = 0.2;
          grid.material.transparent = true;
          scene.add( grid );
          //加载
          var loader = new FBXLoader();
          let url3 = "http://192.168.2.19/index.php?r=file/file/get-file&fid=1145";
          let url2 = '../src/views/project/components/threeFile/test.fbx';
          let url4 = "https://threejs.org/examples/models/fbx/Samba%20Dancing.fbx"
          let url5 = "https://mixamo-storage-prod.s3-us-west-2.amazonaws.com/system/character/6415d7c5-300f-4321-b1e2-33d68912e124/tmp/character.fbx?response-content-disposition=attachment%3B%20filename%3Dkachujin_g_rosales.fbx&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAIOWIZXMI6ROJOVJA%2F20180518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20180518T061543Z&X-Amz-Expires=300&X-Amz-Security-Token=FQoDYXdzELf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDCsk91Wfi0eG1I0TkiK3A%2Bp9cXePOo5mRWiIWCjappmRDYkBibXalac7cDlwHNYtkCdt4n1SJi2z1sb8CbMaZW8nVD8XLM4DIWtTCPfgTxn%2F8oEdhdm8N%2Fx7iuuoYmjehK21jQanybRPKvOUoByEehFUewolRmY6lARaJnSTT%2FeAYaAWswZx5zxLxy1BMcNiJ3zGNn3AH0%2B5VN8%2Fg3DM8QENcS5nA0EmAEiw3CKgqV%2FHYcRq58Ei3NUdM9U1%2FJPjUATrujQ5Ou59QonwmzCqC362hKcmQhs50M6qlzrSInbAmXf8D8zvjAn%2FGrSkyFOHuNyy4Sv%2FKHCcB5dZJkPsMit7zneV90WtB%2BIKd%2FGp5Hs50V3wOT0ltgwUcS1g26YLPwEcE11JcNwVYymQ5yT%2B3sCo46MulX0Gkd%2Bz%2FaKvNCUK5eOnteDJkLZUvwsJBcpwMDf5JfP0b61psZzAbug0q45gjbTWwPE%2ByrUpcvbEUjml3%2BFPvdAJHwCPEzOhSoNnGWQFVNBtTDsNTYVLGWrXpPWxBi1FUo3MiuwuFCnN%2BdtHakUIj7ONP%2F%2BvCk%2F1mW8BojU188yA3BD%2BJoK3z9CB6KTpFnH7AnAos8j51wU%3D&X-Amz-SignedHeaders=host&X-Amz-Signature=2a09aa4e88ee0f905b56f351e0968280c8c6450008b6372cee6c315250e89c2b"
          loader.load(url2 , function ( object ) {
            console.log(object);
            
            object.mixer = new THREE.AnimationMixer( object );
            mixers.push( object.mixer );
            var action = object.mixer.clipAction( object.animations[ 0 ] );
            action.play();
            object.traverse( function ( child ) {
              if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            } );
            scene.add( object );
          } );
          //渲染
          renderer = new THREE.WebGLRenderer( { antialias: true } );
          renderer.setPixelRatio( window.devicePixelRatio );
          renderer.setSize( window.innerWidth, window.innerHeight );
          renderer.shadowMap.enabled = true;
          container.appendChild( renderer.domElement );
          window.addEventListener( 'resize', onWindowResize, false );
          // stats
          // stats = new Stats();
          // container.appendChild( stats.dom );
        }
        //窗口重置
        function onWindowResize() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize( window.innerWidth, window.innerHeight );
        }
        //动画
        function animate() {
          requestAnimationFrame( animate );
          if ( mixers.length > 0 ) {
            for ( var i = 0; i < mixers.length; i ++ ) {
              mixers[ i ].update( clock.getDelta() );
            }
          }
          renderer.render( scene, camera );
          // stats.update();
			  }
    },
    fbxModel()
    {
      //获得div
      var container = document.createElement("div");
      document.getElementById("maind").appendChild(container);
      //设置相机(视角,纵横比,近距离,远距离)
      let camera = new THREE.PerspectiveCamera(95,window.innerWidth / window.innerHeight,1,2000);
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
      let controls = new OrbitControls(camera);
      controls.target.set(0, 100, 0);
      controls.update();

      var scene = new THREE.Scene();
      scene.add(mesh);
      scene.add(grid);

      var loader = new FBXLoader();
      let url3 = "http://192.168.2.19/index.php?r=file/file/get-file&fid=1145";
      loader.load(url3, function (object3d) {
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
        camera = new THREE.PerspectiveCamera(95,window.innerWidth / window.innerHeight,1,2000);
        camera.position.set(0, 200, 300);
        //轨道控制插件
        controls = new OrbitControls(camera);
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
        let url3 = "http://192.168.2.19/index.php?r=file/file/get-file&fid=1145"
        let url4 = "https://threejs.org/examples/models/fbx/Samba%20Dancing.fbx"
        let url5 = "http://192.168.2.19/3d/Samba%20Dancing.fbx"
        var loader = new FBXLoader();

        loader.load(url4,function(object) {
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
