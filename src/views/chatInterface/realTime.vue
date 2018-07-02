<template>
   <div class="real_time_box">
     <GeminiScrollbar class="crollbar">
      <div class="realTime_interface">
         <div v-for="(item, index) in dataList" :key="index" class="ko">
         <div v-if ='item.user_id !== userMsg.id'>
           <div class="clearfix realTime_message">
             <img src="../../images/meinv.jpg">
             <p class="realTime_time_text">{{item.remark_name}}</p>
             <p class="realTime_time">{{item.date}}</p>
           </div>
           <div>
             <p class="triangle_type"></p>
             <p>
             <span class="Send_content is_own_no">
               {{item.message}}
             </span>
             </p>
           </div>
         </div>
         <!-- 第二个 -->
         <div class="clearfix ko" v-else>
           <div class="realTime_message_own">
             <img :src="userMsg.headimage">
             <p class="realTime_time_text">我</p>
             <p class="realTime_time">{{item.date}}</p>
           </div>
           <div class="is_own_float">
             <p class="triangle_type_own"></p>
             <p>
             <span class="Send_content is_own">
               {{item.message}}
             </span>
             </p>
           </div>
         </div>
         </div>
      </div>
       </GeminiScrollbar>
      <form class="send_information_box">
         <div class="send_message_remind">
           <div :class="`send_input ${data.absold ? '' : 'disable'}`" contenteditable="true" id="testInput" @keyup.enter="submit" @keydown="keyIn($event)"></div>
           <div class="clearfix send_message_children" v-show="isShowMessage">
             <p>有<span class="message_num" v-show="isLook">1</span><span :class="!isLook ? 'message_num':'message_nums' "><span v-show="isLook" class="message_numed">/</span>{{messageNum}}</span>条您的消息未读</p>
             <p @click="closeMessage">x</p>
             <p @click="getSee" v-if="!isLook">查看</p>
             <p @click="getSeed" v-else>下一条</p>
           </div>
         </div>
         <!-- @人员框 -->
         <div class="send_information_person" :style="personPosi" v-show="sendShow">
           <!-- <GeminiScrollbar class="scollr_person"> -->
           <ul class="send_ul_style">
             <li v-for='(item, index) in useList' :key="index" @click="personDone(item.name)">{{item.name}}</li>
           </ul>
           <!-- </GeminiScrollbar> -->
         </div>
         <div class="clearfix send_Function_button">
           <div>
              <span class="pace">
                <i class="iconfont icon-biaoqing1"/>
              </span>
              <span class="file_class_father">
                <i class="iconfont icon-tupian1"/>
                <input type="file" class="file_class"/>
              </span>
              <span>
                <i class="iconfont icon-wenjianjia"/>
              </span>
           </div>
           <p :class="`button_send ${data.absold ? '' : 'disable'}`" @click="submit">回车发送</p>
         </div>
      </form>
   </div>
</template>
<script>
import {screenshot} from './screenshot.js'
export default {
  props: ['data'],
  data () {
    return {
      value: '',
      messageNum: 0,
      nowName: '陈莉莉',
      sendShow: false,
      isLook: false,
      websock: null,
      isShowMessage: false,
      scollArray: [],
      personPosi: {
        left: '',
        top: ''
      },
      userMsg: {},
      lastSelection: {},
      useList: [
        {
          name: '李佳'
        },
        {
          name: '王者'
        },
        {
          name: '霸气'
        },
        {
          name: '索隆'
        },
        {
          name: '所有人'
        }
      ],
      dataList: []
    }
  },
  mounted () {
    // localStorage.removeItem('useList')
    // console.log(this.data.absold)
    if (!this.data.absold) {
      this.dataList = []
      // this.$store.state.useList = []
      // localStorage.removeItem('useList')
    }
    this.userMsge()
    this.init()
    screenshot()
    // this.isLogin()
    this.scrollToBottom()
    this.getName()
  },
  computed : {
    getList () {
      var obj = this.$store.state.useList
      //    console.log('true', obj)
      // if (obj.length !== 0) {
      //   console.log('true', obj)
      //  obj = JSON.parse(obj)
      // }
      this.submitMsg(obj)
    }
  },
  watch: {
    getList(e) {
      // console.log('数据', e)
    },
     data: function (e) {
      var obj = this.$store.state.useList
      this.submitMsg(obj)
      console.log('变换', e)
    }
  },
  methods: {
    // 获取用户信息
    userMsge () {
      this.userMsg= JSON.parse(localStorage.userMsg)
    },
    init () {
      $('.pace').bind(
        {
          click: function (event) {
            if (!$('#sinaEmotion').is(':visible')) {
              $(this).sinaEmotion()
              event.stopPropagation()
              //  alert(1111)
              $('#sina-emotion').attr('style', `bottom:40px;right:105px;display:block;z-index:9999;`)
              $('#sina-emotion').find('.face').attr('style', 'height: 30px;')
            }
          }
        })
      // $('.Send_content').each(function () {
      //   const elements = $(this).html()
      //   // console.log(elements)
      //   $(this).html(elements).parseEmotion()
      // })
    }, // 显示表情
    // 滚动到底模块
    // 滚动到底
    scrollToBottom () {
      // var times = setTimeout(() => {
      // 滚动条长度
      const documents = document.getElementsByClassName('realTime_interface')[0]
      const dcment = document.getElementsByClassName('gm-scroll-view')[0]
      const cententHeught = documents.clientHeight
      const scrollHeights = documents.scrollHeight
      const currentDistance = scrollHeights - cententHeught
      // 当前滚动条距离顶部的距离
      var currentScrollY = dcment.scrollTop
      if (currentDistance > 0 && currentDistance > currentScrollY) {
        // console.log('底部', currentDistance, currentScrollY)
        currentScrollY = Math.ceil((currentDistance - currentScrollY)) + currentScrollY
        currentScrollY = currentScrollY > currentDistance ? currentDistance : currentScrollY
        dcment.scrollTop = currentScrollY
        // this.scrollToBottom()
      }
    },
    // 按下按钮所做的事
    keyIn (event) {
      var selection = getSelection()
      var ele = $('#testInput')
      this.sendShow = false
      const e = window.event || event
      if (e.code === 'Digit2' && e.shiftKey) {
        // 保存光标信息
        this.lastSelection = {
          range: selection.getRangeAt(0),
          offset: selection.focusOffset,
          selection: selection
        }
        this.sendShow = true
        this.$nextTick(() => {
          const contentsHeight = document.getElementsByClassName('send_information_person')[0].clientHeight
          const offset = ele.caret('position')
          console.log('offset', offset)
          // const lefts = offset.left - 600
          this.personPosi = {
            left: offset.left + 'px',
            top: offset.top - contentsHeight + 'px'
          }
        })
      } else if (e.code === 'Backspace') {
        // 删除逻辑
        // 1 ：由于在创建时默认会在 @xxx 后添加一个空格，
        // 所以当得知光标位于 @xxx 之后的一个第一个字符后并按下删除按钮时，
        // 应该将光标前的 @xxx 给删除
        // 2 ：当光标位于 @xxx 中间时，按下删除按钮时应该将整个 @xxx 给删除。
        const range = selection.getRangeAt(0)
        const romoveParents = document.getElementById('testInput')
        var removeNode = null
        if (range.startOffset <= 1 && range.startContainer.parentElement.className !== 'at-text') {
          removeNode = range.startContainer.previousElementSibling
        }
        if (range.startContainer.parentElement.className === 'at-text') {
          removeNode = range.startContainer.parentElement
        }
        if (removeNode) {
          romoveParents.removeChild(removeNode)
        }
      }
    },
    // @人员选择
    personDone (person) {
      this.sendShow = false
      document.getElementById('testInput').focus() // 可编辑div获取光标
      // 获取之前保留下来的信息
      const lastSelection = this.lastSelection
      const selection = lastSelection.selection
      const range = lastSelection.range
      const textNode = range.startContainer
      // 删除@符号
      range.setStart(textNode, range.endOffset)
      range.setEnd(textNode, range.endOffset + 1)
      range.deleteContents()
      // 生成显示内容
      const spanNode = document.createElement('span')
      const spanNode1 = document.createElement('span')
      spanNode.setAttribute('style', 'color:rgba(49,187,159,1);')
      spanNode.className = 'at-text'
      spanNode.innerHTML = '@' + person
      spanNode1.innerHTML = '&nbsp;'
      // 将生成内容打包放在 Fragment 中，并获取生成内容的最后一个节点，也就是空格。
      const frag = document.createDocumentFragment()
      var node
      var lastNode
      frag.appendChild(spanNode)
      while ((node = spanNode1.firstChild)) {
        lastNode = frag.appendChild(node)
      }
      // 将 Fragment 中的内容放入 range 中，并将光标放在空格之后。
      range.insertNode(frag)
      selection.extend(lastNode, 1)
      selection.collapseToEnd()
    },
    // @查找
    getName () {
      const list = Array.from(this.dataList)
      var nameArray = []
      list.forEach((element, index) => {
        const isShow = element.message.indexOf('@') !== -1 // 查找是否含有@
        if (isShow) {
          const nameList = element.message.split('@')
          const name = this.nowName
          if (nameList[1] === name) {
            // const dome = document.getElementsByClassName('Send_content')[index]
            // const documents = document.getElementsByClassName('realTime_interface')[0]
            // const dome = $('.Send_content').eq(index).offset().top
            nameArray.push(index)
            this.messageNum = nameArray.length
            if (nameArray.length !== 0) {
              this.isShowMessage = true
            }
            // alert(nameArray.length)
          }
          // alert(nameList[1])
        }
      })
      this.scollArray = nameArray
    },
    // 查看
    getSee () {
      this.isLook = true
      this.getLook(0)
    },
    getSeed () {
      const index = this.messageNum
      var num = 1
      if (num < index) {
        this.getLook(num)
      }
    },
    getLook (index) {
      const list = Array.from(this.scollArray)
      // const firstScoll = list[index].offset
      const num = list[index]
      const firstScoll = $('.Send_content').eq(num).offset().top
      const dcment = document.getElementsByClassName('gm-scroll-view')[0]
      dcment.scrollTop = firstScoll
      this.$nextTick(() => {
        if ((index + 1) === list.length) {
          this.isShowMessage = false
        }
      })
    },
    // 关闭标签
    closeMessage () {
      this.isShowMessage = false
    },
    submit () { // 提交内容
      $('.send_input').find('div').remove()
      this.sendShow = false // 发送关闭@框
      const elements = $('.send_input').html()
      const sendTime = this.getTime()
      var list = this.$store.state.useList
      const shuju = JSON.stringify({
        action:'group-chat',
        group_id: this.data.id,
        msg: elements,
      })
      const shuju2 = {
        action:'group-chat',
        group_id: this.data.id,
        message: elements,
        user_id: this.userMsg.id,
        remark_name: this.data.remark_name,
        date: sendTime
      }
      list.push(shuju2)
      this.$store.state.useList = list
      localStorage.useList = JSON.stringify(list)
      this.$nextTick(() => {
        // this.threadPoxi(shuju)
        console.log('发送数据', shuju)
        webSocket.send(shuju)
        // this.$connectSoket.websocksend(shuju)
        // $('.Send_content').last().html(elements).parseEmotion()
        this.scrollToBottom()
      })
      // })
      $('.send_input').text('')
    },
    // 获取时间
    getTime () {
      const now = new Date(Date.now());
      var year = now.getFullYear()
      var month = now.getMonth() + 1
      month = month < 10 ? ('0' + month) : month
      var date = now.getDate()
      date = date < 10 ? ('0' + date) : date
      var hour = now.getHours()
      hour = hour < 10 ? ('0' + hour) : hour
      var minute = now.getMinutes()
      var second = now.getSeconds()
      minute = minute < 10 ? ('0' + minute) : minute
      second = second < 10 ? ('0' + second) : second
      return year + '/' + month + '/' + date + ' ' + hour + ':' + minute + ':' + second
    },
    submitMsg(obj) {
      const list = Array.from(obj)
      var newList = []
      // const id = this.data.id
      // console.log('11111', list[0])
      list.forEach(elements => {
        const str = this.data.id
        // console.log('11111',str, elements.group_id)
        if (str === elements.group_id) {
           newList.push(elements)
          //  console.log('11111', elements)
        }
      })
      this.dataList = newList
      this.$nextTick(() => {
        $('.Send_content').each(function () {
          const elements = $(this).html()
          // console.log(elements)
          $(this).html(elements).parseEmotion()
        })
      })
    },
    isLogin () {
      if (localStorage.token) {
        const msgData = JSON.stringify({
          action: 'login',
          token: localStorage.token
        })
        // this.threadPoxi(msgData)
      }
    },
  },
  beforeDestroy () {
    // alert(1)
    // this.websock.close()
  }
}
</script>
<style scoped>
.real_time_box{
 width: 100%;
 height: 100%;
}
.realTime_interface{
  box-sizing: border-box;
  width: 100%;
  padding: 0 10px;
  height: 100%;
  /* overflow-y: auto; */
}
.crollbar{
 height: calc(100% - 150px);
}
.send_information_box,
.send_information_emoji{
  position: relative;
  width: 100%;
  height: 100px;
}
.send_message_remind{
  position: relative;
  width: 100%;
  height: 100px;
}
.send_message_children{
 position: absolute;
 top: -50px;
 left: 0;
 width: 100%;
 height: 50px;
 background: rgba(247,247,199,1);
 z-index: 98;
}
.send_message_children>p:nth-child(1) {
  color: rgb(51,51,51);
  font-size: 14px;
  margin-left: 10px;
  line-height: 50px;
  float: left;
}
.send_message_children>p:nth-child(2) {
  color: rgb(255,0,0);
  font-size: 16px;
  float: right;
  font-weight: bold;
  line-height: 50px;
  margin-right: 16px;
  cursor: pointer;
}
.send_message_children>p:nth-child(3) {
  height: 30px;
  padding: 0 10px;
  line-height: 30px;
  border-radius: 10px;
  color: #ffffff;
  font-size: 14px;
  background: rgb(24,191,164);
  float: right;
  margin: 10px 80px 0 0;
  cursor: pointer;
}
.message_num{
  color: rgb(255,0,0);
  padding: 0 3px;
}
.message_nums{
  color: rgb(177,177,168);
}
.message_numed {
  padding-right: 3px;
}
.send_input{
 /* line-height: 0; */
 outline:none;
 border: none;
 width: 100%;
 height: 100px;
 overflow-y: auto;
 text-indent: 2em;
 line-height: 20px;
 background: rgba(231,231,231,1);
}
.send_input:empty:before{
    content: '请输入沟通内容（@可指定接受消息人员）';
    color:#bbb;
}
.send_input:focus:before{
    content:none;
}
.send_Function_button{
 width: 100%;
 height: 50px;
}
.button_send{
  float: right;
  height: 30px;
  padding: 0 10px;
  text-align: center;
  line-height: 30px;
  color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
  /* pointer-events: none; */
  margin: 10px 10px 0 0;
  background: rgba(24,191,164,.8)
}
.disable{
  pointer-events: none;
  background: rgba(231,231,231,.5);
}
.button_send:hover{
  background: rgba(24,191,164,1)
}
.send_Function_button i{
  font-size: 18px;
  line-height: 50px;
  margin-left: 5px;
  cursor: pointer;
}
.send_Function_button>div{
 float: left;
 margin-left: 5px;
}
.file_class_father{
  position: relative;
}
.file_class{
  opacity:0;
  width: 18px;
  height: 18px;
  overflow: hidden;
  filter:alpha(opacity=0);
  position: absolute;
  top:0;
  left:0;
  bottom: 0;
  right:0;
  margin: auto;
  cursor: pointer;
}
.send_information_person{
  position: absolute;
  width: 100px;
  max-height: 200Px;
  z-index: 999999;
  overflow-y: auto;
  background: #ffffff;
  box-shadow: 0px 0px 16px #333333;
}
.scollr_person{
 height: 200px;
}
.send_ul_style{
  width: 100%;
  height: 100%;
}
.send_ul_style>li{
  width: 100%;
  height: 30px;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
}
::-webkit-scrollbar{
  width: 5px;
}
::-webkit-scrollbar-thumb {
background-color:#dddddd;
background-clip:padding-box;
min-height: 28px;
}
</style>
