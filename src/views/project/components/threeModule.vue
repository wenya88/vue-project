
<template>
  <!-- 模型插槽 -->

  <body>
    <div id="maind">
      <!-- <Select v-model="model1" style="width:200px" @on-change="model3D()">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select> -->
      <!-- <ul>
        <li v-for="(valuename, keys, index) in file_obj" :key="index">{{keys}}</li>
      </ul> -->
    </div>
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
// require("../../../js/labjs.min.js");
// var lab = require('lab');
// var Zlib = require('zlib');
// import JSZip from 'jszip'
// import JSZipUtils from 'jszip-utils'

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
  created() {
    // this.getBaseData();
  },
  // mounted() {
  //   // this.fbxThree();
  //   this.newFBXMedel();
  // },
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
    //请求3D文件凭证
    getThreeFileKey() {
      let msg = {
        id: "1253,1254,1255",
        type: "package"
      }
      this.$axios.post(this.GLOBAL.baseRouter + 'file/file/get-file-key', qs.stringify(msg))
        .then(res => res.data)
        .then(res => {
          // console.log(res);
          this.fileKey = res.url_key;
          this.loadThreeFile();
        }
        )
        .catch(error => {
          // console.log(error);

          this.$Message.error("获取任务信息失败，请重试！");
        });
    },
    // getBaseData() {
    //   var Zip = new JSZip();
    //   console.log(Zip)
    //   let url = 'http://192.168.2.19/index.php?r=file/file/download&url_key=' + this.fileKey;
    //   var xmlhttp = null;
    //   if(window.XMLHttpRequest) {
    //     xmlhttp = new window.XMLHttpRequest()
    //   } else {
    //     xmlhttp = new window.ActiveXObject('Microsoft.XMLHTTP')
    //   }
    //   xmlhttp.open('GET', url, true)
    //   xmlhttp.withCredentials = true

    //   if('responseType' in xmlhttp) {
    //     xmlhttp.responseType = 'arraybuffer'
    //   }

    //   if(xmlhttp.overrideMimeType) {
    //     xmlhttp.overrideMimeType('text.plain; charset=x-user-defined')
    //   }
    //   xmlhttp.send()
    //   xmlhttp.onreadystatechange = function() {
    //     if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
    //       var file = xmlhttp.response || xmlhttp.responseText

    //       JSZip.loadAsync(file).then(function(zip) {
    //         console.log(zip)
    //       })
    //     }
    //   }
    // },
    handleFileName(filename) {
      var returnObj = {}
      var str = ''
      var parentMax = null
      var curParent = null
      // 文件名的处理
      if (filename.indexOf('/') !== -1) {
        var fileNameArr = filename.split('/')
        for (var i = 0; i < fileNameArr.length; i++) {
          if (i === 0) {
            returnObj[fileNameArr[0]] = {}
            parentMax = fileNameArr[0]
          } else {
            if (i === 1) {
              if (this.fileTypeNameJudge(fileNameArr[1]).file_status === 0) {
                returnObj[fileNameArr[0]][fileNameArr[1]] = fileNameArr[1]
              } else {
                returnObj[fileNameArr[0]][fileNameArr[1]] = {}
                curParent = fileNameArr[1]
                str = fileNameArr[1]
              }
            } else {
              str = str + '/' + fileNameArr[i]
            }
          }
        }
      } else {
        // 如果没有'/'则是文件，不是文件夹
        returnObj[filename] = filename
      }
      var firstafter = {}
      if (str !== '') {
        firstafter = this.handleFileName(str)
      }
      if (curParent != null) {
        returnObj[parentMax] = firstafter
        // console.log(returnObj[parentMax])
      }
      return returnObj
    },
    //获得下载文件包
    loadThreeFile() {
      var self = this
      let url = 'http://192.168.2.19/index.php?r=file/file/download&url_key=' + self.fileKey
      JSZipUtils.getBinaryContent(url, (err, data) => {
        if (err) {
          throw err; // or handle err
        }
        // console.log('解压',data);

        JSZip.loadAsync(data).then((zip) => {
          // console.log('压缩包',zip);
          // console.log(zip.files);
          zip.forEach((relativePath, zipEntry) => {
            var fileName = zipEntry.name
            // console.log('111',zipEntry.name)
            if (zipEntry.name.slice(zipEntry.name.length - 1) !== '/') {  //  后面是斜线的不要，因为是目录即文件夹
              // console.log('222',zip.folder(zipEntry.name))
              zip.file(zipEntry.name).async('base64').then(function success(text) {
                var indexDB = window.indexedDB   //创建indexDB数据库对象
                var curDb = null
                var req = indexDB.open('kangruideIndexDB')
                req.onupgradeneeded = function() {
                  //创建表的结构
                  var db = req.result
                  db.createObjectStore('upload_review', {
                    autoIncrement: 'file_id' //指明当前数据id自增长（indexDB）
                  })
                }
                req.onsuccess = function() {
                  // 在成功后对象的result属性为本次申请的结果
                  curDb = req.result // curDb为数据库对象，用来操作数据表，维护数据表
                  var tran = curDb.transaction(['upload_review'], 'readwrite')
                  var objectStore = tran.objectStore('upload_review')

                  // 把text信息放入这个对象里
                  var zipFile = {
                    file_name: fileName,
                    file_content: text
                  }
                  var adduser = objectStore.add(zipFile)  // 为当前数据表增加记录
                  adduser.onsuccess = function() {
                    // console.log('333',self.file_obj);
                    var fileObj = JSON.parse(JSON.stringify(self.file_obj))

                    var fileReturnObj = self.handleFileName(fileName)
                    // console.log('444',fileReturnObj)
                    for (var i in fileReturnObj) {
                      // 先判断这层目录是否存在，如存在则添加，不存在则创建
                      if (fileObj[i]) {
                        fileObj[i] = Object.assign(fileObj[i], fileReturnObj[i])
                      } else {
                        fileObj[i] = fileReturnObj[i]
                      }
                    }
                    self.file_obj = JSON.parse(JSON.stringify(fileObj))
                    var file_arr = []
                    for (var i in self.file_obj) {
                      file_arr.push(self.file_obj[i])
                    }
                    // console.log('555',file_arr)
                    this.fbxurl = file_arr[0]
                    sessionStorage.fbxurl = file_arr[0]
                    // console.log('666',this.fbxurl)
                  }
                }
              }, function error(e) {

              })
            }
          })
        });
      });
    },
    newFBXMedel() {
      
      // this.getThreeFileKey();
      var container, stats, controls;//容器、统计?、控制器
      var camera, scene, renderer, light;//相机、场景、渲染、灯光
      var clock = new THREE.Clock();//时钟
      var mixers = [];
      init(this.storeFileURl);//初始化
      // init();
      animate();//动画
      function init(url) {
        //获得div并添加容器
        container = document.createElement('div');
        document.getElementById("maind").appendChild(container);
        //设置相机(视角,纵横比,近距离,远距离)
        camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.set(0, 200, 300);
        //轨道控制插件
        controls = new THREE.OrbitControls(camera);
        controls.target.set(0, -50, 0);
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
        renderer.setSize(window.innerWidth, window.innerHeight);
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
