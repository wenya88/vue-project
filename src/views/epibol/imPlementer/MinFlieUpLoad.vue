<template>
    <div>
        <div>
            <p>OBJ<span>提供3D源文件</span></p>
            <p>PSD<span>要上传源文件</span></p>
            <p>PSD<span>侧面源文件</span></p>
        </div>
        <div class="demo-upload-list" v-for="item in MuploadList">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <Upload
            ref="upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            action="/file/file/file-upload"
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="camera" size="20"></Icon>
            </div>
        </Upload>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                defaultList: [],
                imgName: '',
                visible: false,
                MuploadList: [],
                // MinFile:[],
                url:[]
            }
        },
        methods: {
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                // this.MinFile.splice(fileList.indexOf(file), 1)
            },
            handleSuccess (res, file) {
                file.url = this.url;
            },
           handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式是不正确的',
                    desc: '文件格式 ' + file.name + ' 不正确，请选择jpg或png格式.'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '文件大小超过限制',
                    desc: '文件  ' + file.name + ' 太大了，不超过 2M.'
                });
            },
            handleBeforeUpload (file) {
                this.url=window.URL.createObjectURL(file);
                // let fileArr=file.name;
                // let fileTrr=fileArr.lastIndexOf('.')+1
                // let fileSrr=fileArr.substring(fileTrr,fileArr.length)
                // if(fileSrr=='png'||fileSrr=='jpg'){
                //     this.MinFile.push(file);
                // }
            },
        },
        mounted () {
            let _this=this
            _this.MuploadList = _this.$refs.upload.fileList;
            _this.$bus.on('RemoveFile',(val)=>{
               _this.$refs.upload.fileList.splice(0);
            });
        },
        watch:{
            MuploadList(val){
                this.$bus.emit('MinFile',val)
            }
        }

    }
</script>
<style>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
