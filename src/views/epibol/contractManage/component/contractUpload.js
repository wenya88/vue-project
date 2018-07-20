import  plupload from 'plupload/js/plupload.min.js';
const fileUpload=function(data){
    let contractCBack=document.getElementById('contractUpLoadButton');
    let uploadURl=null
    if(data!=undefined){
        uploadURl=data.host
        console.log(uploadURl)
    }
    let selectfiles=document.getElementById('selectfiles');
    window.uploader = new plupload.Uploader({
        runtimes : 'html5,flash,silverlight,html4',
        browse_button : selectfiles, 
        multi_selection: false,
        url :'',
    
        filters: {
            mime_types : [ //只允许上传图片和zip,rar文件
                { title : "Image files", extensions : "jpg,gif,png,bmp" }, 
                { title : "Zip files", extensions : "zip,rar" }
            ],
            max_file_size : '10mb', //最大只能上传10mb的文件
            prevent_duplicates : true //不允许选取重复文件

        },
        init:{
            // addFile
            FilesAdded:function(up, files) {
                console.log(files)
                contractCBack.click();
            },
            // upLoadSuccess
            FileUploaded: function(up, file, info) {
               console.log("!!!"+file)
            },

            // upLoadError
            Error: function(up, err) {
                console.log("error")
            }
        }
    });
    uploader.init();
}

export {
    fileUpload,
}