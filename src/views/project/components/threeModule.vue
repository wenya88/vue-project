
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
      var camera, scene, renderer, light;//相机、场景、渲染、灯光
      var clock = new THREE.Clock();//时钟
      var mixers = [];
      var divHeight = 100%
      init(this.storeFileURl);//初始化
      // init();
      animate();//动画
      function init() {
        //获得div并添加容器
        container = document.createElement('div');
        document.getElementById("maind").appendChild(container);
        //设置相机(可视角度,canvas宽高比,近距离,远距离)
        camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 2000);    
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
        // let url = 'https://yhc-1.oss-cn-shanghai.aliyuncs.com/test/M_atk.FBX'
        
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
        });
        //渲染
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        // renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setSize(document.getElementById("maind").offsetWidth, window.innerHeight/2+20);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
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
