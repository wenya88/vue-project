<template>
   <div class="real_time_box">
     <div class="load_real">
    <GeminiScrollbar class="crollbar">
      <div class="realTime_interface" @mousewheel="getScoller">
         <span class="chat_load" @click="getMoreMsg">查看更多消息</span>
         <div v-for="(item, index) in datalist" :key="index" class="ko">
         <div v-if ='item.user_id !== userMsg.id' class="clearfix">
           <img :src="item.headimage" class="chats-image-left"/>
           <div class="chat-msg-left">
            <div class="clearfix realTime_message">
              <p class="realTime_time_text">{{item.remark_name}}</p>
              <p class="realTime_time">{{item.date}}</p>
            </div>
            <div class="clearfix">
              <p class="triangle_type iconfont icon-ymy-leftchat-copy"></p>
              <p class="chat-own-no">
              <span :class="`Send_content is_own_no ${item.group_id}`" v-html="item.message">
                <!-- {{item.message}} -->
              </span>
              </p>
            </div>
           </div>
         </div>
         <!-- 第二个 -->
         <div class="clearfix ko" v-else>
            <img :src="userMsg.headimage" class="chats-image-right"/>
           <div class="chat-msg-right">
           <div class="realTime_message_own">
             <p class="realTime_time_text">我</p>
             <p class="realTime_time">{{item.date}}</p>
           </div>
           <div class="is_own_float clearfix">
             <p class="triangle_type_own iconfont icon-ymy-chat-copy"></p>
             <p class="chat-own">
             <span class="Send_content is_own ${item.group_id}" v-html="item.message">
               <!-- {{item.message}} -->
             </span>
             </p>
           </div>
           </div>
         </div>
         </div>
      </div>
       </GeminiScrollbar>
       </div>
      <form class="send_information_box">
          <div id='file_id'>
              <span class="pace">
                <i class="iconfont icon-biaoqing1"/>
              </span>
              <span class="file_class_father">
                <i class="iconfont icon-tupian1"/>
                <uploader :uploadObj='uploadobj' :ids='file'></uploader>
              </span>
              <span>
                <i class="iconfont icon-wenjianjia"/>
                <uploader :uploadObj='uploadobj' :ids="wenjian"></uploader>
              </span>
          </div>
         <div class="send_message_remind">
           <div :class="`send_input ${data.absold ? '' : 'disable'}`" contenteditable="true" id="testInput" @keyup.enter="submit" @keydown="keyIn($event)"></div>
           <div class="clearfix send_message_children" v-show="isShowMessage">
             <p>有<span class="message_num" v-show="isLook">{{readNum}}</span><span :class="!isLook ? 'message_num':'message_nums' "><span v-show="isLook" class="message_numed">/</span>{{messageNum}}</span>条您的消息未读</p>
             <p @click="closeMessage">x</p>
             <p @click="getSee" v-if="!isLook">查看</p>
             <p @click="getSeed" v-else>下一条</p>
           </div>
         </div>
         <!-- @人员框 -->
         <div class="send_information_person" :style="personPosi" v-show="sendShow">
           <!-- <GeminiScrollbar class="scollr_person"> -->
           <ul class="send_ul_style">
             <li v-for='(item, index) in useList' :key="index" @click="personDone(item)">{{item.remark_name}}</li>
           </ul>
           <!-- </GeminiScrollbar> -->
         </div>
         <div class="clearfix send_Function_button">
           <p :class="`button_send ${data.absold ? '' : 'disable'}`" @click="submit">回车发送</p>
         </div>
      </form>
   </div>
</template>
<script>
import {screenshot} from './screenshot.js'
var qs = require('querystring')
export default {
  props: ['data'],
  data () {
    return {
      value: '',
      datalist: [],
      messageNum: 0,
      sendShow: false,
      isLook: false,
      loading: false,
      readNum: 0,
      file: 'file',
      wenjian: 'wenjian',
      websock: null,
      isShowMessage: false,
      scollArray: [],
      personPosi: {
        left: '',
        top: ''
      },
      userMsg: {},
      lastSelection: {},
      useList: [],
      configure:{},
      uploadobj:{}
    }
  },
  mounted () {
    this.getPjUser()
    if (!this.data.absold) {
      this.datalist= []
    }
    this.userMsge()
    this.init()
    this.getOss()
    screenshot()
    // this.isLogin()
    this.scrollToBottom()
    this.getName()
  },
  updated () {
    this.geyEmoji()
  },
  computed : {
    getList () {
      return this.$store.state.useList
    },
    getImg () {
      return this.$store.state.img
    },
    getFile () {
      return this.$store.state.file
    },
    // getBob () {
    //   return this.$store.state.blob
    // }
  },
  watch: {
    getList(e) {
      this.submitMsg(e)
      // this.getName()
    },
    // getBob(e) {
    //   // console.log('截屏图片', e)
    // },
    getImg (e) {
      const blob = this.$store.state.blob
      if (!blob) {
        const imgs = `<img src = '${e}' style='max-width: 260px; max-height: 140px; border-radius: 4px;'></img>`
        this.getSong(imgs)
      } 
      else {
        const url = e
        $('.send_input').find('img').last().attr('src', url)
      }
    },
    getFile (e) {
      const file = e
      const files = `
      <div class="file_upload"><p class="file-up-name">
      <span class='clearfix file-up-icon iconfont icon-ymy-folder-copy'></span><span>上传文件${e.fileName}</span></p>
      <a href="${e.fileDown}" class="file_upload_ltext">下载</a>
      </div>`
      this.getSong(files)
    },
    data: function (e) {
      var obj = this.$store.state.useList
      this.submitMsg(obj)
      this.getOss()
    }
  },
  // updated () {
  //   this.geyEmoji()
  // },
  methods: {
    // 发送
    getSong (obj) {
      var list = []
      const sendTime = this.getTime()
      if (localStorage.useList) {
        list = JSON.parse(localStorage.useList)
      }
      const imgMsg = {
        action:'group-chat',
        group_id: this.data.id,
        message: obj,
        user_id: this.userMsg.id,
        remark_name: this.data.remark_name,
        date: sendTime
      }
      //  const message = JSON.stringify({
      //    img: e
      //  })
       const imgSend = JSON.stringify({
        action:'group-chat',
        group_id: this.data.id,
        msg: obj,
        user_id: this.userMsg.id,
        remark_name: this.data.remark_name,
        date: sendTime
      })
      list.push(imgMsg)
      webSocket.send(imgSend)
      this.$store.state.useList = list
      localStorage.useList = JSON.stringify(list)
    },
    // 获取凭证
    getOss () {
      // let url =  this.GLOBAL.baseRouter+"/file/oss/oss"
      this.uploadobj = {
        type: 'group-chat',
        group: `${this.data.id}`
      }
    },
    getFiles() {
      this.$store.state.blob = false
      // this.getOss()
    },
    getImage() {
      this.$store.state.blob = false
    }, 
    // 获取历史信息
    getMoreMsg () {
       const url = this.GLOBAL.baseRouter+"/system/user/get-group-chat-log"
       const list = this.datalist
       const lists = this.$store.state.useList
       var leng = 0
       if (list.length) {
         leng = list.length - 1
       }
       const items = {
         id: this.data.id, // 群组id
         index: leng, // 本地消息数量-1
         size: 5, //  需要返回的数量
       }
       this.$axios.post(url, qs.stringify(items)).then(data => {
         const oldList = data.data.data.reverse()
         oldList.forEach(items => {
           items.isRead = true
         })
         this.$store.state.useList = oldList.concat(lists)
         localStorage.useList = JSON.stringify(oldList.concat(lists))
       }, error => {
         console.log('错误', error)
       })
    },
    // 获取项目成员
    getPjUser() {
       const url = this.GLOBAL.baseRouter+"/task/company/joined-members"
       const projectId = this.data.id.split('_') 
       const items = {
         project_id: Number(projectId[1])
       }
       this.$axios.post(url, qs.stringify(items)).then(data => {
         this.useList = data.data.data
       }, error => {
         console.log('错误', error)
       })
    },
    // 获取用户信息
    userMsge () {
      this.userMsg= JSON.parse(localStorage.userMsg)
      const obj = this.$store.state.useList
      this.submitMsg(obj)
    },
    init () {
      $('.pace').bind(
        {
          click: function (event) {
            if (!$('#sinaEmotion').is(':visible')) {
              $(this).sinaEmotion()
              event.stopPropagation()

              $('#sina-emotion').attr('style', `bottom:40px;right:105px;display:block;z-index:9999;`)
              $('#sina-emotion').find('.face').attr('style', 'height: 30px;')
            }
          }
        })
    }, // 显示表情
    // 滚动到底模块
    // 滚动到底
    scrollToBottom () {
      // var times = setTimeout(() => {
      // 滚动条长度
      const documents = document.getElementsByClassName('realTime_interface')[0]
      const dcment = document.getElementsByClassName('gm-scroll-view')[0]
      const cententHeught = dcment.clientHeight
      const scrollHeights = documents.scrollHeight
      const currentDistance = scrollHeights - cententHeught
      // 当前滚动条距离顶部的距离
      var currentScrollY = dcment.scrollTop
      if (currentDistance > 0 && currentDistance > currentScrollY) {
        currentScrollY = Math.ceil((currentDistance - currentScrollY)) + currentScrollY
        currentScrollY = currentScrollY > currentDistance ? currentDistance : currentScrollY
        dcment.scrollTop = currentScrollY
        // this.scrollToBottom()
      }
    },
    // 鼠标滑轮事件
    getScoller () {
      const dcment = document.getElementsByClassName('gm-scroll-view')[0]
      const documents = document.getElementsByClassName('realTime_interface')[0]
      const cententHeught = dcment.clientHeight
      const scrollHeights = documents.scrollHeight
      const currentDistance = scrollHeights - cententHeught
      const currentScrollY = dcment.scrollTop
      if (currentDistance > 0) {
         if (currentScrollY === 0) {
           this.getMoreMsg()
           this.$nextTick(() => {
             dcment.scrollTop = 200
           })
      }
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
    personDone (e) {
      const person = e.remark_name
      const personId = `person_${e.user_id}`
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
      spanNode.id = personId
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
      // const list = Array.from(this.datalist)
      // var nameArray = []
      if (this.messageNum !== 0) {
        this.isShowMessage = true
      } else {
        this.isShowMessage = false
      }
      // list.forEach((element, index) => {
        
      // })
      // this.scollArray = nameArray
    },
    // 查看
    getSee () {
      this.isLook = true
      this.getLook()
    },
    getSeed () {
      const index = this.messageNum
      this.getLook()
    },
    getLook () {
      const list = Array.from(this.scollArray)
      // const firstScoll = list[index].offset
      this.readNum+= 1
      const useList = this.$store.state.useList
      const listLocal = JSON.parse(localStorage.useList) // 获取本地储存数据
      useList.forEach((items, index) => {
        if (items.isRead == false ) { // 设有未读的
          if (index == (list[this.readNum - 1])) { // 当前的数据index和储存@下标相同
            items.isRead = true // store里面 设为true
            listLocal[index].isRead = true // localstore 设为true
          }
        }
      })
      localStorage.useList = JSON.stringify(listLocal)
      const num = list[this.readNum - 1]
      const firstScoll = $('.Send_content').eq(num).offset().top
      const dcment = document.getElementsByClassName('gm-scroll-view')[0]
      dcment.scrollTop = firstScoll
      if (this.readNum > list.length - 1) {
          this.isShowMessage = false
          this.readNum = 1
      }
    },
    // 关闭标签
    closeMessage () {
      this.isShowMessage = false
    },
    submit () { // 提交内容
      $('.send_input').find('div').remove()
      this.sendShow = false // 发送关闭@框
      const personTxt = document.getElementById('testInput').getElementsByClassName('at-text')
      for (let i = 0; i < personTxt.length; i++) {
        const personTxts = personTxt[i].innerText
        const personTxtId = personTxt[i].getAttribute('id')
        const persons = personTxts.split('@')[1]
        const persons_id = personTxtId.split('_')[1]
        const name_call = JSON.stringify({
          call_person: persons,
          call_id: `person_${persons_id}`,
          call_class: 'at-text',
          isRead: false
        })
       personTxt[i].innerHTML = name_call
      }
      const blob = this.$store.state.blob
      const elements =  $('.send_input').html().replace(/&nbsp;/g,"")
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
      const dataList = this.datalist
      this.$nextTick(() => {
        webSocket.send(shuju)
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
      var listLocal = []
      if (localStorage.useList) {
         listLocal = JSON.parse(localStorage.useList)
      }
      const userID = this.userMsg.id
      var newList = []
      this.messageNum = 0
      this.scollArray = []
      this.nuRead = []
      list.forEach((elements, index) => {
        const str = this.data.id
        if (str === elements.group_id) {
          const msgTxt = elements.message
          var msgTxted = null
          const numberStart = this.searchSubStr(msgTxt, '{')
          const numberEnd = this.searchSubStr(msgTxt, '}')
          var startTexts = msgTxt.substring(0, numberStart[0])
          numberStart.forEach((items, indexs) => {
            numberEnd.forEach((ited, idx) => {
              if (indexs == idx) {
                const ks = JSON.parse(msgTxt.substring(items, ited + 1))
                const callID = ks.call_id.split('_')[1] // 获取@ 用户名
                if (userID == callID) {  // 和当前用户相同就显示
                if (!elements.isRead) { // 是否已读或者没有
                    this.messageNum+= 1
                    this.scollArray.push(index)
                    elements.isRead = false
                    listLocal[index].isRead = false
                }
                  // this.nuRead.push(elements)
                }
                const startText = `<span class ='${ks.call_id}' style = 'color:rgba(49,187,159,1);' > @${ks.call_person}</span>`
                const nextStart = indexs + 1
                var nextText = ''
                var endText = ''
                if ( idx + 1 < numberEnd.length) {
                  nextText = msgTxt.substring(idx + 1, numberStart[nextStart])
                } else {
                  endText = msgTxt.substring(numberEnd[idx] + 1, msgTxt.length)
                }
                startTexts+= startText + nextText + endText
                elements.message = startTexts
              }
            })
          })
           newList.push(elements)
        }
      })
      this.$set(this, 'datalist', newList)
      this.getName()
    },
    // 获取字符串位置
    searchSubStr (str, subStr){
        var positions = []
        var pos = str.indexOf(subStr)
        while ( pos > -1) {
            positions.push(pos);
            pos = str.indexOf(subStr, pos + 1);
        }
        return positions
    },
    geyEmoji () {
      $('.Send_content').each(function(){
        const elems = $(this).html()
        $(this).html(elems).parseEmotion()
      })
    },
    isLogin () {
      if (localStorage.token) {
        const msgData = JSON.stringify({
          action: 'login',
          token: localStorage.token
        })
      }
    },
  },
}
</script>
<style scoped>
.real_time_box{
 width: 100%;
 height: 100%;
}
/* .chat_load{
 width: 100%;
 height: 50px;
 line-height: 50px;
 text-align: center;
 color: rgba(24,191,164,.8);
}
.chat_load > p {
 font-size: 16px;
} */
.chat_load{
  display: inline-block;
  width: 80px;
  position: absolute;
  top: 5px;
  left: 50%;
  margin-left: -40px;
  color: rgba(24,191,164,.8);
  cursor: pointer;
}
.load_real{
 width: 100%;
 height: calc(100% - 150px);
 position: relative;
 overflow: hidden;
}
.realTime_interface{
  box-sizing: border-box;
  position: relative;
  width: 100%;
  padding: 20px 10px 10px 10px;
  min-height: 100%;
}
.crollbar{
 /* height: calc(100% - 150px); */
}
.send_information_box,
.send_information_emoji{
  position: relative;
  width: 100%;
  height: 100px;
}
.send_information_box{
  border-top:1px solid #eef1f2; 
}
.send_message_remind{
  position: relative;
  width: 100%;
  height: 60px;
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
 height: 60px;
 overflow-y: auto;
 text-indent: 2em;
 line-height: 20px;
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
  line-height: 20px;
  /* margin-left: 5px; */
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
#file_id{
  width: 100%;
  height: 40px;
}
#file_id span{
 display: block;
 width: 20px;
 height: 20px;
 float: left;
 margin-top: 15px;
 margin-left: 15px;
 position: relative;
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
