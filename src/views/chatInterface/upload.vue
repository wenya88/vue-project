<template>
  <div id="contraniner">
     <span :id="ids" @click="getClick"></span>
  </div> 
</template>
<script>
import plupload from 'plupload/js/plupload.min.js'
var qs = require('querystring')
export default {
  props: ['uploadObj', 'ids'],
  data () {
    return {
      configure: {},
      names: ''
    }
  },
  mounted () {
    this.upload()
  },
  watch: {
    uploadObj : function(e) {
    //   console.log('上传', e)
    },
    uploadType: function (e) {
      
    }
  },
  methods: {
    // 点击
    getClick() {
    //   console.log('1111')
      this.$store.state.blob = false
    },
    getData () {
      let url =  this.GLOBAL.baseRouter+"/file/oss/oss";
      const items = this.uploadObj
      this.$axios.post(url, qs.stringify(items)).then(data => {
        const obj = data.data
        const configure = {
          'key' : obj.dir + obj.random + this.names,
          'policy': obj.policy,
          'OSSAccessKeyId': obj.accessid, 
          'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
          'callback' : obj.callback,
          'signature': obj.signature,
 
        };
        this.configure = {
          'url': obj.host,
          'multipart_params': configure
        }
      }, error => {
        console.log('报错', error)
      })
    },
    upload () {
      var that = this
      window.uploader = new plupload.Uploader({
        browse_button : this.ids, // 触发文件选择对话框的按钮，为那个元素id
        runtimes : 'html5,flash,silverlight,html4',
        url : this.configure.url, // 服务器端的上传页面地址
        flash_swf_url : 'js/Moxie.swf', // swf文件，当需要使用swf方式进行上传时需要配置该参数
        max_file_size: '10MB', // 限制为2MB
        container: document.getElementById('contraniner'),
        filters: [{title: "Image files",extensions: "jpg,gif,png"}], // 图片限制
        silverlight_xap_url : 'js/Moxie.xap', // silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数    
        filters: {
          mime_types : [ //只允许上传图片和zip,rar文件
           { title : "Image files", extensions : "jpg,gif,png,bmp" }, 
           { title : "Zip files", extensions : "zip,rar" }
           ],
           max_file_size : '10mb', //最大只能上传10mb的文件
           prevent_duplicates : false //不允许选取重复文件
        },
      })
      // 在实例对象上调用init()方法进行初始化
    //   console.log('传入data', data)
      uploader.init()
      //图片选择完毕触发
      uploader.bind('FilesAdded',function(uploader,files){
        // uploader.start(); //调用实例对象的start()方法开始上传文件，当然你也可以在其他地方调用该方法
        // var times = setTimeout(function() {
            const name = files[0].name.split('.')[1]
            if (name == 'rar' || name == 'zip') {
              that.names = '.' + name
            } else {
              that.names = ''
            }
            that.getData()
            var times = setTimeout(function(){
                uploader.setOption(that.configure)
                uploader.start()
                clearTimeout(times)
            },500)
        //     clearTimeout(times)
        // }, 1000)
      })
    //   document.getElementById('file').addEventListener('click', function () {
    //     uploader.start()
    //   }, false)
      uploader.bind('UploadProgress', function(uploader, files) {
        //  console.log('显示', files)
      })
      // 图片上传成功触发，ps:data是返回值（第三个参数是返回值）
      uploader.bind('FileUploaded',function(uploader, files, data){
        const datas = JSON.parse(data.response)
        const mimeType = datas.mimeType.split('/')[0]
        if (mimeType == 'image') {
         that.$store.state.img = datas.file_url
        } else {
          that.$store.state.file = {
            fileName: files.name,
            fileDown: datas.file_url
          }
          // console.log('刷会', files.name, datas.file_url)
        }
        //  console.log('上传成功',data)
      })
      // 上传发生错误时
      uploader.bind('Error', function (uploader, error) {
        console.log('上传错误', error)
      })
    }
  }
}
</script>
<style scoped>
#contraniner{
 width: 100%;
 height: 100%;
 position: absolute;
 z-index: 999;
 top:0;
 left: 0;
}
#contraniner>span{
 display: block;
 width: 100%;
 height: 100%;
}
</style>
