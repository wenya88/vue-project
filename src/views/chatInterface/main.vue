<template >
<div>
   <div class="msg_button_fix" @click="geMsg">消息</div>
   <div class="real_all" v-if="isShow">
     <div class="clearfix real_header_box">
        <p class="header_project project_is_actice" @click="getReal(0)">项目沟通(15)</p>
        <p class="header_project" @click="getReal(1)">消息提醒(10)</p>
        <p class="close_all" @click="closeMsg">x</p>
     </div>
     <real-message v-if="!isMsg"></real-message>
     <remind v-else></remind>
   </div>
 </div>
</template>
<script>
import realMessage from './realMessage.vue'
import remind from './remindMsg.vue'
export default {
  // props:['visidy'],
  data () {
    return {
      isShow: false,
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
    // 关闭信息
    geMsg () {
      this.isShow = true
    },
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
.msg_button_fix{
  width: 50px;
  height: 50px;
  border-radius: 50%;
  color: #ffffff;
  text-align: center;
  font-size: 16px;
  line-height: 50px;
  background: rgb(24,191,164);
  position:fixed;
  cursor: pointer;
  bottom: 50%;
  right: 20px;
  margin-bottom: -25px;
  box-shadow: 0px 2px 19px rgb(231,231,231);
}
.msg_button_fix:hover {
  animation: myfix 2s ease-in-out 0s 1 alternate forwards;
}
@keyframes myfix {
  0% {
    opacity: .5;
    width: 50px;
    height: 50px;
  }
  50%{
    opacity: .6;
    width: 55px;
    height: 55px;
    line-height: 55px;
  }
  100%{
    opacity: 1;
    width: 50px;
    height: 50px;
    line-height: 50px;
  }
}
.real_all{
 position: fixed;
 top: 0;
 right: 0;
 height: 100%;
 width: 600px;
 z-index: 9999;
 background: #ffffff;
 border-right: 2px solid rgba(49,187,159);
 border-left: 2px solid rgba(49,187,159);
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
