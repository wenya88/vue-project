<template>
  <div class="excel">
    <!-- <html-preview></html-preview> -->
    <Steps :current="current">
      <Step title="步骤1"></Step>
      <Step title="步骤2"></Step>
      <Step title="步骤3"></Step>
      <Step title="步骤4"></Step>
    </Steps>
    <div class="center">
      <excel-upload :fcert="cert" @analysisNext="next" :frist="stepStatus" v-if="current==0"></excel-upload>
      <excel-analysis v-else-if="current==1"></excel-analysis>
    </div>
    <div class="footer"> 
      <Button type="primary" @click="pre" :style="`display: ${displayPre}`">上一步</Button>
      <Button type="primary" @click="next" :style="`display: ${displayNext}`">下一步</Button> 
      <!-- <Button type="primary" @analysisNext="test" :style="`display: ${displayNext}`">下一步1111</Button> -->
    </div> 
  </div>
</template>

<script>
import ExcelUpload from '../../main-components/excel/ExcelUpload'
import ExcelAnalysis from '../../main-components/excel/ExcelAnalysis'
export default {
  components: {
    ExcelUpload,
    ExcelAnalysis,
  },
  data() {
    return {
      current: 0,
      displayPre: 'none',
      displayNext: 'inline-block',
      uploadFile: true,
      cert: '',
      stepStatus: true
    }
  },
  created() {
    if(this.current == 0) {
      this.displayNext = 'none';
    }
  },
  methods: {
    pre() {
      this.current -= 1;
      this.displayPre = 'inline-block';
      this.displayNext = 'inline-block';
      if (this.current == 0) {
        this.displayPre = 'none';
        this.displayNext = 'none';
        this.stepStatus = true;
      }
    },
    next() {
      this.current += 1;
      this.displayPre = 'inline-block';
      this.displayNext = 'inline-block';
      this.stepStatus = false;
      if (this.current == 3) {
        this.displayPre = 'inline-block';
        this.displayNext = 'none';
      }
    },
    /**
     * 获取上传文件的凭证
     */
    getCert() {
      this.$axios.get(this.GLOBAL.baseRouter+'file/file/upload-cert')
      .then(res => res.data)
      .then(res => {
        if(res.err_code == 0) {
          this.cert = res.upload_cert
        } else {
          this.$Modal.error({
            title: '获取上传凭证时发生错误',
            content: res.err_message
          });
        }
      })
    },
    /**
     * 外部显示弹窗接口
     */
    isShowPage(isShow) {
      if (isShow.constructor == Boolean) {
        // console.log(isShow);
        this.showAddNew = isShow;
        sessionStorage.analysisExcel = {}
        this.getCert()
      }
      else {
        // console.log(false);
        this.showAddNew = false;
      }
    }
  }
}
</script>

<style>
.ivu-steps .ivu-steps-main{
  display: inline-block !important;
}
</style>
<style scoped>
.excel{
  min-height: 700px;
}
.footer{
  position: absolute;
  bottom: 5px;;
}
</style>

