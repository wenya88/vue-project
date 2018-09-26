<template>

    <div class="uploadContainer">
        <slot name="upload" >
            <button :id="id" class="browse">选择文件</button>
            <p class="button">选择文件</p>
        </slot>
    </div>
</template>

<script>
//    import 'plupload/js/plupload.full.min.js'
    import qs from 'querystring'
    import {mapState, mapMutations} from 'vuex'
    import plupload from 'plupload/js/plupload.min.js'

    /**     传入参数:
     *  ids                     :   用来命名的id
     *  id                      :   dom的id 默认browse
     *  parameter               :   oss接口参数
     *  fileType                :   允许的文件类型
     *  maxFileSize             :   文件大小限制
     *  preventDuplicates       :   是否允许重复文件名
     *  flash_swf_url           :   swf文件
     *  silverlight_xap_url     :   xap文件
     *
     *  slot 插槽 点击按钮一定要加id: browse
     *
     *  FileUploadedSuccess   上传成功回调
     *  UploadProgress        选择文件并确定回调
     *
     * */

    export default {
        props: {
            ids:{
              type:Object,
                default: () => {
                    return {
                        taskId:'0',
                        projectId:'0',
                        stageId:'0',
                    }
                }
            },
            parameter: {
                type: Object,
                default: () => {
                    return {type: 'upload'}
                }
            },
            fileType: {
                type: Array,
                default: () => {
                    return [
                        {title: "Image files", extensions: "psd,tga,tif,dds,exr,hdr,ktx,pvrtc,jpg,gif,png,bmp,jpeg"},
                        {title: "Zip files", extensions: "zip,rar,7zip"},
                        {title: "files", extensions: "mpg,m4v,mp4,flv,3gp,mov,avi,rmvb,mkv,wmv,fbx,3ds,max,lw,mb,dxf,json,obj,mmd,stl,vtk,dds"},
                    ]
                }
            },
            id: {
                type: String,
                default: 'browse'
            }, maxFileSize: {
                type: String,
                default: '100mb'
            },
            preventDuplicates: {
                type: Boolean,
                default: true
            },
            flash_swf_url: {
                type: String,
                default: 'js/Moxie.swf'
            },
            silverlight_xap_url: {
                type: String,
                default: 'js/Moxie.xap'
            }
        },
        created() {
        },
        mounted() {
            /*图片上传*/

            this.upload();

        },

        data() {
            return {
                uploadKey: null,
                imgsrc: '',
                files:null,
                num:0,
            }
        },
        methods: {
            ...mapMutations(['setfileUrl', 'clearfileUrl','setFilenum']),
            // 获取秘钥
            getImgkey() {
                let _this = this;
                let url = this.GLOBAL.baseRouter + "/file/oss/oss";
                return new Promise((resolve, reject) => {
                    if (this.uploadKey === null) {
                        this.$axios.post(url, qs.stringify(this.parameter)).then(data => {
                            this.uploadKey = data.data;
                            _this.$emit('getOSS',data.data);
                            resolve();
                        })
                    } else {
                        resolve();
                    }
                })
            },
            upload() {

                window.uploader = new plupload.Uploader({
                    browse_button: this.id, // 触发文件选择对话框的按钮，为那个元素id
                    runtimes: 'html5,flash,silverlight,html4',
                    url: 'http://59.111.95.148/file/oss/oss', // 服务器端的上传页面地址
                    flash_swf_url: this.flash_swf_url, // swf文件，当需要使用swf方式进行上传时需要配置该参数
                    max_file_size: this.maxFileSize, // 限制为2MB
                    silverlight_xap_url: this.silverlight_xap_url, // silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
                    filters: {
                        mime_types: this.fileType,
                        max_file_size: this.maxFileSize, //最大只能上传10mb的文件
//                        prevent_duplicates: this.preventDuplicates //不允许选取重复文件
                    },
                });
                // 初始化
                uploader.init();

                uploader.bind('UploadProgress',  (uploader, file) => {
                });

                /*上传*/
                uploader.bind('FilesAdded', (uploader, files) => {
                    this.files = files;
                    this.num = 0;
                    this.setFilenum(files.length);
                    this.clearfileUrl();

                    this.getImgkey()
                        .then(() => {
                            var configure = {
                                'url': this.uploadKey.host,
                                'multipart_params': {
                                    'key': this.uploadKey.dir +this.ids.projectId+this.ids.taskId+this.ids.stageId+'/'+ files[0].name,
                                    'policy': this.uploadKey.policy,
                                    'OSSAccessKeyId': this.uploadKey.accessid,
                                    'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                                    'callback': this.uploadKey.callback,
                                    'signature': this.uploadKey.signature,
                                }
                            };
                            uploader.setOption(configure);  //传入签名
                            uploader.start(); // 实例化上传

                        })
                    this.$emit("UploadProgress",{uploader, files});

                });

                // 图片上传成功回调
                uploader.bind('FileUploaded', (uploader, files, data) => {


                    let configure = null;
                    if(this.files.length>1){
                        this.num+=1;
                        let name = this.files[this.num]?this.files[this.num].name:this.files[this.num-1]
                        configure = {
                            'url': this.uploadKey.host,
                            'multipart_params': {
                                'key': this.uploadKey.dir +this.ids.projectId+this.ids.taskId+this.ids.stageId+'/' + name,
                                'policy': this.uploadKey.policy,
                                'OSSAccessKeyId': this.uploadKey.accessid,
                                'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                                'callback': this.uploadKey.callback,
                                'signature': this.uploadKey.signature,
                            }
                        };
                    }else{
                        configure = {
                            'url': this.uploadKey.host,
                            'multipart_params': {
                                'key': this.uploadKey.dir +this.ids.projectId+this.ids.taskId+this.ids.stageId+'/'+files.name,
                                'policy': this.uploadKey.policy,
                                'OSSAccessKeyId': this.uploadKey.accessid,
                                'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                                'callback': this.uploadKey.callback,
                                'signature': this.uploadKey.signature,
                            }
                        };
                    }

                    uploader.setOption(configure);  //传入签名


                    let obj = {uploader: uploader, files: files, data: data};
                    this.imgsrc = JSON.parse(data.response);

                    this.setfileUrl(obj);
                    this.$bus.emit("FileUploaded");
                    this.$emit("FileUploadedSuccess",{uploader, files, data,num:this.num});


                });



            },
        },
        computed: {},
        components: {}
    }
</script>

<style lang="less">
    .uploadContainer {
        position: relative;
        .browse {
            width: 120px;
            height: 30px;
            opacity: 0;
            border-radius: 4px;
        }
        .button {
            position: absolute;
            top: 0;
            left: 0;
            width: 120px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            background: #39f;
            color: #fff;
            border-radius: 4px;
        }
    }
</style>
