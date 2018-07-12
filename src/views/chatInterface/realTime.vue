<template>
   <div class="real_time_box">
<<<<<<< HEAD
     <div class="load_real">
      <div v-if='loading' class="chat_load">
          <span>加载中...</span>
     </div>
    <GeminiScrollbar class="crollbar">
      <div class="realTime_interface" @mousedown="down">
         <div v-for="(item, index) in datalist" :key="index" class="ko">
         <div v-if ='item.user_id !== userMsg.id'>
           <div class="clearfix realTime_message">
             <img :src="item.headimage">
=======
     <GeminiScrollbar class="crollbar">
      <div class="realTime_interface">
         <div v-for="(item, index) in datalist" :key="index" class="ko">
         <div v-if ='item.user_id !== userMsg.id'>
           <div class="clearfix realTime_message">
             <img src="../../images/meinv.jpg">
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
             <p class="realTime_time_text">{{item.remark_name}}</p>
             <p class="realTime_time">{{item.date}}</p>
           </div>
           <div>
             <p class="triangle_type"></p>
             <p>
<<<<<<< HEAD
             <span :class="`Send_content is_own_no ${item.group_id}`" v-html="item.message">
               <!-- {{item.message}} -->
=======
             <span :class="`Send_content is_own_no ${item.group_id}`">
               {{item.message}}
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
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
<<<<<<< HEAD
             <span class="Send_content is_own ${item.group_id}" v-html="item.message">
               <!-- {{item.message}} -->
=======
             <span class="Send_content is_own ${item.group_id}">
               {{item.message}}
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
             </span>
             </p>
           </div>
         </div>
         </div>
      </div>
       </GeminiScrollbar>
<<<<<<< HEAD
       </div>
=======
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
      <form class="send_information_box">
         <div class="send_message_remind">
           <div :class="`send_input ${data.absold ? '' : 'disable'}`" contenteditable="true" id="testInput" @keyup.enter="submit" @keydown="keyIn($event)"></div>
           <div class="clearfix send_message_children" v-show="isShowMessage">
<<<<<<< HEAD
             <p>有<span class="message_num" v-show="isLook">{{readNum}}</span><span :class="!isLook ? 'message_num':'message_nums' "><span v-show="isLook" class="message_numed">/</span>{{messageNum}}</span>条您的消息未读</p>
=======
             <p>有<span class="message_num" v-show="isLook">1</span><span :class="!isLook ? 'message_num':'message_nums' "><span v-show="isLook" class="message_numed">/</span>{{messageNum}}</span>条您的消息未读</p>
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
             <p @click="closeMessage">x</p>
             <p @click="getSee" v-if="!isLook">查看</p>
             <p @click="getSeed" v-else>下一条</p>
           </div>
         </div>
         <!-- @人员框 -->
         <div class="send_information_person" :style="personPosi" v-show="sendShow">
           <!-- <GeminiScrollbar class="scollr_person"> -->
           <ul class="send_ul_style">
<<<<<<< HEAD
             <li v-for='(item, index) in useList' :key="index" @click="personDone(item)">{{item.remark_name}}</li>
=======
             <li v-for='(item, index) in useList' :key="index" @click="personDone(item.name)">{{item.name}}</li>
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
           </ul>
           <!-- </GeminiScrollbar> -->
         </div>
         <div class="clearfix send_Function_button">
<<<<<<< HEAD
           <div id='file_id'>
=======
           <div>
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
              <span class="pace">
                <i class="iconfont icon-biaoqing1"/>
              </span>
              <span class="file_class_father">
<<<<<<< HEAD
                <i class="iconfont icon-tupian1" id="file" @click='getImage'/>
                <!-- <input type="file" class="file_class"/> -->
              </span>
              <span>
                <i class="iconfont icon-wenjianjia" id="wenjian" @click='getFiles'/>
=======
                <i class="iconfont icon-tupian1"/>
                <input type="file" class="file_class"/>
              </span>
              <span>
                <i class="iconfont icon-wenjianjia"/>
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
              </span>
           </div>
           <p :class="`button_send ${data.absold ? '' : 'disable'}`" @click="submit">回车发送</p>
         </div>
      </form>
   </div>
</template>
<script>
import {screenshot} from './screenshot.js'
<<<<<<< HEAD
var qs = require('querystring')
=======
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
export default {
  props: ['data'],
  data () {
    return {
      value: '',
      datalist: [],
      messageNum: 0,
<<<<<<< HEAD
      sendShow: false,
      isLook: false,
      loading: false,
      readNum: 0,
=======
      nowName: '陈莉莉',
      sendShow: false,
      isLook: false,
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
      websock: null,
      isShowMessage: false,
      scollArray: [],
      personPosi: {
        left: '',
        top: ''
      },
      userMsg: {},
      lastSelection: {},
<<<<<<< HEAD
      useList: [],
      configure:{}
    }
  },
  mounted () {
    this.getPjUser()
    this.getOss()
    if (!this.data.absold) {
      this.datalist= []
=======
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
    }
  },
  mounted () {
    // localStorage.removeItem('useList')
    // console.log(this.data.absold)
    if (!this.data.absold) {
      this.datalist= []
      // this.$store.state.useList = []
      // localStorage.removeItem('useList')
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
    }
    this.userMsge()
    this.init()
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
<<<<<<< HEAD
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
=======
    }
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
  },
  watch: {
    getList(e) {
      this.submitMsg(e)
<<<<<<< HEAD
      // this.getName()
    },
    // getBob(e) {
    //   // console.log('截屏图片', e)
    // },
    getImg (e) {
      const blob = this.$store.state.blob
      if (!blob) {
        const imgs = `<img src = '${e}' style='max-width: 100px; max-height: 100px '></img>`
        this.getSong(imgs)
      } 
      else {
        const url = e
        $('.send_input').find('img').last().attr('src', url)
      }
    },
    getFile (e) {
      const file = e
      const files = `<p class="file_upload">上传文件${e.fileName}<a href="${e.fileDown}" class="file_upload_ltext">下载</a></p>`
      this.getSong(files)
    },
    data: function (e) {
      var obj = this.$store.state.useList
      this.submitMsg(obj)
=======
      // console.log('数据s', e)
    },
     data: function (e) {
      var obj = this.$store.state.useList
      this.submitMsg(obj)
      // console.log('变换', e)
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
    }
  },
  // updated () {
  //   this.geyEmoji()
  // },
  methods: {
<<<<<<< HEAD
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
      let url =  this.GLOBAL.baseRouter+"/file/oss/oss"
      const items = {
        type: 'group-chat',
        group: `${this.data.id}`
      }
      this.$axios.post(url, qs.stringify(items)).then(data => {
        const obj = data.data
        const configure = {
          'key' : obj.dir + obj.random,
          'policy': obj.policy,
          'OSSAccessKeyId': obj.accessid, 
          'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
          'callback' : obj.callback,
          'signature': obj.signature,
 
        }
        this.configure = {
          'url': obj.host,
          'multipart_params': configure
        }
        this.initial()
      }, error => {
        console.log('报错', error)
      })
    },
    getFiles() {
      this.$store.state.blob = false
    },
    getImage() {
      this.$store.state.blob = false
    },
    // 上传
    initial () {
      // this.pluploads()
      this.pluploads({
        severUrl: this.configure.url,
        size: '10mb',
        button: ['file', 'wenjian'],
        upContainer: 'file_id',
        data: this.configure
      })
    },
    // down事件 实现下拉功能
    down (e) {
      let odiv = e.target  // 获取目标元素
      // 算出鼠标相对元素的位置
      const firstTime = new Date().getTime() // 定义一个开始时间
      let disY = e.clientY - odiv.offsetTop
      const that = this
      const fun = function (e) {
        // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
         var top = e.clientY - disY
         if (top < 0) {
           odiv.style.top = '0px'
         } else if (top > 50) {
           that.loading = true
         } else if (top > 70) {
           odiv.style.top = 70 + 'px'
         }
      }
      const upFun = function (e) {
        // document.onmousemove = null
        document.removeEventListener('mousemove', fun, false)
        document.removeEventListener('mouseup', upFun, false)
        const lastTime = new Date().getTime()
        if (lastTime - firstTime > 180) {
          that.getMoreMsg()
        }
        odiv.style.top = '0px'
        that.loading = false
      }
      document.addEventListener('mousemove', fun, false)
      document.addEventListener('mouseup', upFun, false) 
    },
    // 获取历史信息
    getMoreMsg () {
       const url = this.GLOBAL.baseRouter+"/system/user/get-group-chat-log"
       const list = this.$store.state.useList
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
         const oldList = data.data.data
         console.log('获取的数据', oldList)
         oldList.forEach(items => {
           items.isRead = true
         })
         this.$store.state.useList = list.concat(oldList)
         localStorage.useList = JSON.stringify(list.concat(oldList))
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
=======
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
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
              //  alert(1111)
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
<<<<<<< HEAD
=======
          // console.log('offset', offset)
          // const lefts = offset.left - 600
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
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
<<<<<<< HEAD
    personDone (e) {
      const person = e.remark_name
      const personId = `person_${e.user_id}`
=======
    personDone (person) {
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
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
<<<<<<< HEAD
      spanNode.id = personId
=======
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
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
<<<<<<< HEAD
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
=======
      const list = Array.from(this.datalist)
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
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
    },
    // 查看
    getSee () {
      this.isLook = true
<<<<<<< HEAD
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
      const listLocal = JSON.parse(localStorage.useList)
      useList.forEach((items, index) => {
        if (items.isRead == false ) {
          if (index == (list[this.readNum - 1])) {
            items.isRead = true
            listLocal[index].isRead = true
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
          this.readNum = 0
      }
=======
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
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
    },
    // 关闭标签
    closeMessage () {
      this.isShowMessage = false
    },
    submit () { // 提交内容
      $('.send_input').find('div').remove()
      this.sendShow = false // 发送关闭@框
<<<<<<< HEAD
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
      // const kkkkk = this.searchSubStr(elementss, '<img>')
      // const blob = this.$store.state.blob
      // var elements = ''
      // if (!blob) {
      //   elements = $('.send_input').text().replace(/&nbsp;/g,"")
      // } else {
       const elements =  $('.send_input').html().replace(/&nbsp;/g,"")
      // }
=======
      const elements = $('.send_input').html().replace(/&nbsp;/g,"")
      // console.log('1111', elements)
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
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
<<<<<<< HEAD
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
=======
      var newList = []
      list.forEach((elements, index) => {
        const str = this.data.id
        if (str === elements.group_id) {
           newList.push(elements)
          //  console.log('11111', elements)
        }
      })
      this.$set(this, 'datalist', newList)
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
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
<<<<<<< HEAD
=======
        // this.threadPoxi(msgData)
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
      }
    },
  },
  beforeDestroy () {
<<<<<<< HEAD
=======
    // alert(1)
    // this.websock.close()
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
  }
}
</script>
<style scoped>
.real_time_box{
 width: 100%;
 height: 100%;
}
<<<<<<< HEAD
.chat_load{
 width: 100%;
 height: 50px;
 line-height: 50px;
 text-align: center;
 color: rgba(24,191,164,.8);
}
.chat_load > p {
 font-size: 16px;
}
.load_real{
 width: 100%;
 height: calc(100% - 150px);
 position: relative;
 overflow: hidden;
}
.realTime_interface{
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 0 10px;
  min-height: 100%;
  /* overflow-y: auto; */
}
.crollbar{
 /* height: calc(100% - 150px); */
=======
.realTime_interface{
  box-sizing: border-box;
  width: 100%;
  padding: 0 10px;
  height: 100%;
  /* overflow-y: auto; */
}
.crollbar{
 height: calc(100% - 150px);
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
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
