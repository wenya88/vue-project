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
      <excel-upload></excel-upload>
    </div>
    <div class="footer">
      <Button type="primary" @click="pre" :style="`display: ${displayPre}`">上一步</Button>
       <!-- <Button type="primary" :style="`display: ${displayNext}`" v-if="uploadFile">下222一步</Button>  -->
      <Button type="primary" @click="next" :style="`display: ${displayNext}`">下一步</Button>
    </div>
  </div>
</template>

<script>
import ExcelUpload from '../main-components/excel/ExcelUpload'
export default {
  components: {
    ExcelUpload,
  },
  data() {
    return {
      current: 0,
      displayPre: 'none',
      displayNext: 'inline-block',
      uploadFile: true
    }
  },
  methods: {
    pre() {
      this.current -= 1;
      this.displayPre = 'inline-block';
      this.displayNext = 'inline-block';
      if (this.current == 0) {
        this.displayPre = 'none';
        this.displayNext = 'inline-block';
      }
    },
    next() {
      this.current += 1;
      this.displayPre = 'inline-block';
      this.displayNext = 'inline-block';
      if (this.current == 3) {
        this.displayPre = 'inline-block';
        this.displayNext = 'none';
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
.footer{
  position: absolute;
  bottom: 0;
}
</style>

