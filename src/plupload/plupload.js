import plupload from 'plupload/js/plupload.min.js'
import store  from '@/store/index'
// severUrl 上传地址
// size 限制大小
// button 触发按钮
// upContainer 上传容器
exports.install = ((Vue, options) => {
    Vue.prototype.pluploads = (object => {
        //实例化一个plupload上传对象
     window.uploader = new plupload.Uploader({
        browse_button : object.button, // 触发文件选择对话框的按钮，为那个元素id
        runtimes : 'html5,flash,silverlight,html4',
        url : object.severUrl, // 服务器端的上传页面地址
        flash_swf_url : 'js/Moxie.swf', // swf文件，当需要使用swf方式进行上传时需要配置该参数
        max_file_size: !object.size ? '10MB' : object.size, // 限制为2MB
        container: document.getElementById(object.upContainer),
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
      var data = object.data
      uploader.setOption(data)
      // 在实例对象上调用init()方法进行初始化
      console.log('传入data', data)
      uploader.init()
      //图片选择完毕触发
      uploader.bind('FilesAdded',function(uploader,files){
        // uploader.start(); //调用实例对象的start()方法开始上传文件，当然你也可以在其他地方调用该方法
        // var times = setTimeout(function() {
            uploader.start()
        //     clearTimeout(times)
        // }, 1000)
      })
    //   document.getElementById('file').addEventListener('click', function () {
    //     uploader.start()
    //   }, false)
      uploader.bind('UploadProgress', function(uploader, files) {
         console.log('显示', files)
      })
      // 图片上传成功触发，ps:data是返回值（第三个参数是返回值）
      uploader.bind('FileUploaded',function(uploader, files, data){
        const datas = JSON.parse(data.response)
        const mimeType = datas.mimeType.split('/')[0]
        if (mimeType == 'image') {
         store.state.img = datas.file_url
        } else {
          console.log(1111)
          store.state.file = {
            fileName: files.name,
            fileDown: datas.file_url
          }
        }
         console.log('上传成功', files.name, data)
      })
      // 上传发生错误时
      uploader.bind('Error', function (uploader, error) {
        console.log('上传错误', error)
      })
    })
})