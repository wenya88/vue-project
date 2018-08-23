<template >
<div>
   <div class="msg_button_fix" id='drag_msg' @mousedown="downs">消息<span class="showNumbers" v-if="allNum">{{allNum}}</span></div>
   <div class="real_all" v-if="isShow">
     <div class="clearfix real_header_box">
        <div class="header_project project_is_actice" @click="getReal(0)">
          <!-- <p class='header_project_image'><img src='../../images/chat-icon.png'></p> -->
          <p>项目沟通</p>
          <!-- <span v-if="nums">({{nums}})</span> -->
        </div>
        <div class="header_project" @click="getReal(1)">消息提醒<span v-show="MsgIdx">({{MsgIdx}})</span></div>
        <div class="left-option">
            <p class="option-she iconfont icon-ymy-setup-copy" @click="setIsSetShow" v-if='isMsg'></p>
            <p class="close_all" @click="closeMsg">x</p>
        </div>
     </div>
     <real-message v-if="!isMsg"></real-message>
     <remind v-else></remind>
   </div>
 </div>
</template>
<script>
import realMessage from './realMessage.vue'
import remind from './remindMsg.vue'
import {mapMutations} from 'vuex'
var qs = require('querystring')
export default {
  // props:['visidy'],
  data () {
    return {
      isShow: false,
      isMsg: false,
      allNum: 0,
      nums: 0,
      MsgIdx: 0
    }
  },
  components: {
    realMessage,
    remind
  },
  computed: {
    getList () {
      return this.$store.state.nums
    },
    getNum () {
      return this.$store.state.msgNum
    },
    getUseList () {
      return this.$store.state.useList
    },
    getNotic () {
      return this.$store.state.noticeList
    }
  },
  watch: {
    getList (e) {
      const nums = e
      var index = 0
      for (let i in nums) {
        index+= Number(nums[i])
      }
      this.nums = index
    },
    getUseList (e) {
      this.getAllMsg()
    },
    getNotic (e) {
      this.getAllMsg()
    },
    getNum (e) {
      this.MsgIdx = JSON.parse(e)
    }
  },
  mounted () {
    this.unreadMsg()
  },
  methods: {
    ...mapMutations(['setIsSetShow']),
    // 获取总数
    getAllMsg () {
      const list = this.$store.state.useList
      var index = 0
      var length = 0
      if (localStorage.numList) {
         const numForm = JSON.parse(localStorage.numList)
          for (let i in numForm) {
            index+=numForm[i]
          }
      }
      if (localStorage.noticeList) {
        length = JSON.parse(localStorage.noticeList).length
      }
      if (!this.isShow) {
       this.allNum = list.length - index + length
      } else {
       this.allNum = 0
      }
    },
    // 获取未读消息
    unreadMsg () {
       const url = this.GLOBAL.baseRouter+"/system/user/get-notice-list"
       const list = this.$store.state.noticeList
       var leng = 1
       if(list.length) {
         leng = list.length - 1
       }
       const items = {
         index: leng,
         size: 30,
       }
       this.$axios.post(url, qs.stringify(items)).then(data => {
         const userList = data.data.data
         const list = this.$store.state.noticeList
         var lists = []
         if (list) {
           lists = userList.concat(list)
         }
         const listFrom = {}
         var index = 0
         lists.forEach(items => {
           if (items.state === '0') {
            if (!listFrom[items.type]) {
              listFrom[items.type] = 0
            }
            listFrom[items.type]+= 1
           }
         })
         for (let i in listFrom) {
            index+= listFrom[i]
         }
         this.MsgIdx = index
       }, error => {
         console.log('错误', error)
       })
    },
    downs (e) {
      const windHight = $(window).height() // 获取当前可视化窗口高度
      const windWidth = $(window).width() // 获取当前可视化窗口宽度
      const elements = document.getElementById('drag_msg')
      const odivHeight = elements.clientHeight // 获取元素高度
      const odivWidth = elements.clientWidth // 获取元素宽度
      const firstTime = new Date().getTime() // 定义一个开始时间
      let odiv = e.target  // 获取目标元素
      // 算出鼠标相对元素的位置
      let disX = e.clientX - odiv.offsetLeft
      let disY = e.clientY - odiv.offsetTop
      const fun = function(e) {
        // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        var left = e.clientX - disX
        var top = e.clientY - disY
        if (windWidth - e.clientX - odivWidth < 5) {
          left = windWidth - odivWidth
        } else if (e.clientX - disX< 0) {
          left = 0
        }
        if (windHight - e.clientY - odivHeight < 5) {
          top = windHight - odivHeight
        } else if (e.clientY - disY < 0) {
          top = 0
        }
        // 移动当前元素
        odiv.style.left = left + 'px'
        odiv.style.top = top + 'px'
      }
      const that = this
      const upFun = function(e) {
        const lastTime = new Date().getTime()
        if (lastTime - firstTime < 200) {
          document.onclick = that.geMsg()
        }
        document.removeEventListener('mousemove', fun, false)
        document.removeEventListener('mouseup', fun, false)
      }
      document.addEventListener('mousemove', fun, false)
      document.addEventListener('mouseup', upFun, false)
      
    },
    // 关闭信息
    geMsg () {
      this.isShow = true
      this.allNum = 0
      this.isMsg = false
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
  cursor: pointer;
  position:fixed;
  bottom: 200px;
  right: 20px;
  margin-bottom: -25px;
  z-index: 999;
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
 z-index: 999;
 background: #ffffff;
 border-right: 2px solid rgba(49,187,159);
 border-left: 2px solid rgba(49,187,159);
}
.real_header_box{
  width: 100%;
  height: 50px;
  background:url('../../images/chat.png');
  background-size: 100% 100%;
}
.header_project{
  float: left;
  font-size: 16px;
  height: 48px;
  text-align: center;
  width: 100px;
  line-height: 48px;
  margin-left: 20px;
  cursor: pointer;
  color: #ffffff;
  font-weight: bolder;
}
.header_project_image{
  width: 30px;
  height:20px;
}
.project_is_actice{
  border-bottom: 2px solid  rgba(49,187,159,1)!important;
  color: rgba(49,187,159,1)!important;
}
.left-option{
  float: right;
  width: 80px;
  height: 100%;
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
.option-she{
  font-size: 20px;
  margin-top: 10px;
  cursor: pointer;
  float: left;
}
.showNumbers{
  display: block;
  height: 30px;
  width: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  background: rgba(255,153,0,1);
  color: #ffffff;
  position: absolute;
  top: -13px;
  right: -13px;
}
</style>
