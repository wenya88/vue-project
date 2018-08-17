<template>
  <div style="margin-top: 20px;">
    <Spin fix v-if="loadingStatus" style="top: 50%;">
      <Icon type="load-c" size=36 class="demo-spin-icon-load"></Icon>
      <div>上传中</div>
    </Spin>
    <h2>请上传任务excel文件</h2>
    <span style="display:none">{{fcert}}</span>
    <div class="text" v-if="file !== null">{{ file.name }}</div> 
    <div class="text" v-else>限xlsx / xls格式
      <Upload
        :action="uploadUrl"
        :data="{'cert': fcert}"
        name="file"
        :show-upload-list="false"
        :on-progress="handleUpload"
        :on-success="uploadSuccess"
        :on-error="uploadFail"
        accept="xls,xlsx"
        :format="['xls','xlsx']">
        <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
      </Upload>
    </div>
    <Button class="anaBtn" type="primary" @click="analysisExcel()" v-if="frist" :disabled='file==null'>下一步</Button> 
  </div>
</template>

<script>
var qs = require('querystring');
export default {
  name: 'ExcelUpload',
  data() {
    return {
      file: null,
      loadingStatus: false,
      showAddNew: false,
      header: {},
      fileId: 0
    }
  },
  props: {
    fcert: {
      type: String,
      default: ''
    },
    frist:{
      type: Boolean,
      default: true
    }
  },
  computed: {
    uploadUrl() {
      let base = 'http://192.168.2.19/index.php?r=';
      // this.param.cert = this.fcert;
      return base+'file/file/file-upload'
    }
  },
  methods: {
    handleUpload(event,file) {
      this.file = file;
      this.loadingStatus = true
      return false;
    },
    uploadSuccess(res,file) {
      this.loadingStatus = false;
      // console.log('成功',res, file);
      this.fileId = res.file.fid;
      sessionStorage.analysisFileId = res.file.fid
      return false;
    },
    uploadFail(error,file) {
      this.loadingStatus = false;
      // console.log('失败',error);
      return false;
    },
    /**
     * 解析excel
     */
    analysisExcel() {
      this.$emit('analysisNext')
    }
  }
}
</script>
<style>
.ivu-upload-list{
  position: absolute;
  margin: 0;
  top: -5px;
  left: -655px;
  width: 100%;
}
</style>

<style scoped>
.ivu-upload{
  width: 100px;
  /* float: left; */
  /* position: relative;
  top: 10px;
  right: 110px; */
  position: absolute;
  top: 146px;
  left: 56%;
}
.text{
  /* float: left; */
  width: 770px;
  height: 50px;
  border: 1px solid #bcbcbc;
  line-height: 50px;
  padding: 0 10px;
}
.uploadBtn{
  position: absolute;
  left: 10px;
  bottom: 0;
  z-index: 10;
  /* display: none; */
}
.anaBtn{
  position: absolute;
  bottom: 5px;
  z-index: 10;
  /* background: red;  */
  /* display: none; */
}
</style>
