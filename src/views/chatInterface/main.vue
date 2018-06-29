<template >
   <div class="real_all" v-if="isShow">
     <div class="clearfix real_header_box">
        <p class="header_project project_is_actice" @click="getReal(0)">项目沟通(15)</p>
        <p class="header_project" @click="getReal(1)">消息提醒(10)</p>
        <p class="close_all" @click="closeMsg">x</p>
     </div>
     <real-message v-if="!isMsg"></real-message>
     <remind v-else></remind>
   </div>
</template>
<script>
import realMessage from './realMessage.vue'
import remind from './remindMsg.vue'
export default {
  // props:['visidy'],
  data () {
    return {
      isShow: true,
      isMsg: false
    }
  },
  components: {
    realMessage,
    remind
  },
  watch: {
  },
  methods: {
    getReal (index) {
      const elements = document.getElementsByClassName('header_project')
      if (index === 0) {
        elements[index].classList.add('project_is_actice')
        elements[1].classList.remove('project_is_actice')
        this.isMsg = false
      } else {
        elements[index].classList.add('project_is_actice')
        elements[0].classList.remove('project_is_actice')
        this.isMsg = true
      }
    },
    // 关闭
    closeMsg () {
      this.isShow = false
    }
  }
}
</script>
<style scoped>
.real_all{
 position: fixed;
 top: 0;
 left: 0;
 height: 100%;
 width: 600px;
 z-index: 9999;
 background: #ffffff;
 border-right: 2px solid rgba(49,187,159);
}
.real_header_box{
  width: 100%;
  height: 50px;
  background:rgba(215,247,239,1);
}
.header_project{
  float: left;
  font-size: 16px;
  height: 48px;
  line-height: 48px;
  margin-left: 20px;
  cursor: pointer;
  color: #000000;
  font-weight: bolder;
}
.project_is_actice{
  border-bottom: 2px solid  rgba(49,187,159,1)!important;
  color: rgba(49,187,159,1)!important;
}
.close_all{
  width: 20px;
  height: 20px;
  float: right;
  margin: 15px 10px 0 0;
  color: #ffffff;
  text-align: center;
  line-height: 20px;
  cursor: pointer;
  background: rgba(255,0,0);
}
</style>
