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
<template>
  <!-- 模型插槽 -->
  <div id="maind"></div>
</template>
<script>
import * as THREE from "three";
import FBXLoader from "three-fbx-loader";
import OrbitControls from "three-orbitcontrols";
import Stats from "../components/threeFile/js/libs/stats.min.js";
export default {
  data() {
    return {};
  },
  mounted() {
    this.fbxThree();
  },
  methods: {
    fbxThree() {
      var container, stats, controls;
      var camera, scene, renderer, light;
      var clock = new THREE.Clock();
      var mixers = [];
      init();
      animate();
      function init() {
        container = document.createElement("div");
        document.getElementById("maind").appendChild(container);
        camera = new THREE.PerspectiveCamera(
          95,
          window.innerWidth / window.innerHeight,
          1,
          2000
        );
        camera.position.set(100, 200, 300);
        controls = new OrbitControls(camera);
        controls.target.set(0, 100, 0);
        controls.update();
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xa0a0a0);
        scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
        light = new THREE.HemisphereLight(0xffffff, 0x444444);
        light.position.set(0, 200, 0);
        scene.add(light);
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
        var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        scene.add(grid);
        // 模型
        // https://hopepdm.github.io/modelview/model/hand.fbx
        var loader = new FBXLoader();
        loader.load(
          "./threeFile/image_module/fbx/2k/M_atk.FBX",
          function(object) {
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
          function() {},
          function(err) {
            console.log(err);
          }
        );
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);
        window.addEventListener("resize", onWindowResize, false);
        // stats
        stats = new Stats();
        container.appendChild(stats.dom);
      }
      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
      //
      function animate() {
        requestAnimationFrame(animate);
        if (mixers.length > 0) {
          for (var i = 0; i < mixers.length; i++) {
            mixers[i].update(clock.getDelta());
          }
        }
        renderer.render(scene, camera);
        stats.update();
      }
    }
  }
};
</script>
