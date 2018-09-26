<template>
  <div class="clearfix message_remind_all">
    <div class="message_remind_left">
      <!-- <div class="message_remin_input">
       <input v-model="msgRmind" placeholder="请输入"/>
       <i class="iconfont icon-sousuo"/>
      </div> -->
      <div class="msg_title_all">
        <div class="msg_title" v-for="(itme, index) in objList" :key="index" @click="getObj(itme)">
          <p :class="itme.bojectStyle">{{itme.name}}</p>
          <p v-show="itme.cnt" class='msgStyle'>{{itme.cnt}}</p>
        </div>
      </div>
    </div>
    <div class="message_remind_right">
     <div class="clearfix msg_sign" v-for="(items, index) in msgList" :key="index">
        <div class="msg_sign_box">
          <p>{{items.message}}</p>
          <p>{{items.date}}</p>
        </div>
        <div class="msg_sign_button">
          <p class="read_sign"  v-show="items.state == '1'">已读</p>
          <p class='sign-end' v-show="items.state == '0'" @click="setSigned(index)">标识已读</p>
          <p class='sign-see' v-show="items.state == '0'">查看</p>
        </div>
     </div>
      <div class="message_sign">
       <p @click="setSign"  v-show="msgList.length">标识全部已读</p>
     </div>
    </div>
  </div>
</template>
<script>
var qs = require('querystring')
import {mapState,mapMutations} from 'vuex'
import bus from './bus.js'
export default {
  data () {
    return {
      msgRmind: '',
      typeName: '',
      indexed: 0,
      objList: [],
      userMsg: {},
      noticeList: [],
      msgList: [],
      oldList: [],
      clickItem: {},
      headNum: 0,
      taskNum: 0,
      searchStr: '',
      isSousuo: false
    }
  },
  computed: {
     getTabNum () {
       return this.$store.state.tabNum
     },
     getList() {
      return this.$store.state.noticeList
    }
  },
  watch: {
    getTabNum(e) {
      if (e === 0) {
        this.getHead()
        this.typeName = 'project'
      } else if (e === 1) {
        this.getTask()
        this.typeName = 'task'
      } else {
        this.objList = []
        this.msgList = []
      }
    },
     getList (e) {
      const list = this.objList
      const type = this.typeName
      const index = this.indexed
      const project_id = list[index].project_id
    },
  },
  created () {
    this.getHead()
    // this.getMsgInterface()
    this.getsou()
    this.getMsg()
  },
  methods: {
    ...mapMutations(['setSearched']),
    // 获取收缩消息
    getsou () {
      bus.$on('msg', (e) => {
        this.searchStr = e
        const list = this.objList
        list.forEach(itemed => {
          itemed.bojectStyle = '' // 点击样式  
        })
         this.getListed()
         this.isSousuo = true
      })
    },
    // 获取消息接口
    getMsgInterface () {
      const list = this.objList
      if (list.length) {
        const obj = list[0]
        this.getObj(obj)
      }
    },
    // 搜索列表
    getListed () {
       const type = this.typeName // 切换项目名
       const url = this.GLOBAL.baseRouter+"/system/user/get-notice-list"
       const items = {
         search: this.searchStr,
         index: 0,
         state: -1,
         size: 30,
         type: type
       }
       this.$axios.post(url, qs.stringify(items)).then(data => {
         const msgList = data.data.data
         this.msgList = msgList
       }, error => {
       })
    },
    // 切换项目
    getObj (item) {
      const type = this.typeName // 切换项目名
      const itemId = item.id
      this.clickItem = item
      const list = this.objList
      list.forEach(itemed => {
        itemed.bojectStyle = '' // 点击样式
        if (itemed.id == item.id) {
         itemed.bojectStyle = 'onwStyle'
        }
      })
      const url = this.GLOBAL.baseRouter+"/system/user/get-notice-list"
       const items = {
         search: '',
         index: 0,
         state: -1,
         size: 30,
         id: itemId,
         type: type
       }
       this.$axios.post(url, qs.stringify(items)).then(data => {
         const msgList = data.data.data
         this.msgList = msgList
         this.isSousuo = false
         this.setSearched()
       }, error => {
       })
    },
    // // 获取未读消息
    // unreadMsg() {
    //   let lists = this.noticeList
    //   const type = this.typeName
    //   const listFrom = {}
    //   lists.forEach(items => {
    //     if (items.state == '0') {
    //       if (!listFrom[items.type]) {
    //         listFrom[items.type] = 0
    //       }
    //        listFrom[items.type]+= 1
    //     }
    //   })
      // this.$emit('listform', listFrom)
    // },
    // 获取项目
    getHead () {
      let url = this.GLOBAL.baseRouter+"system/user/notice-project-list"
      const items = {
        search: '',
        state: -1,
        index: 0,
        size: 30,
        // type: 'task'
      }
       this.$axios.post(url, qs.stringify(items)).then(data => {
         const list = data.data.data
         this.objList = list
         this.getMsgInterface()
       }, error => {
       })
    },
    // 获取消息
    getMsg () {
      this.getHeadNum()
      // var that = this
      // let times = setTimeout(() => {
      //   const listFrom = {
      //     task: that.taskNum,
      //     project: that.headNum
      //   }
      //   that.$emit('listform', listFrom)
      //   clearTimeout(times)
      // }, 300)
    },
    // 获取项目未读
    getHeadNum () {
      let url = this.GLOBAL.baseRouter+"system/user/notice-project-list"
      const items = {
        search: '',
        state: -1,
        index: 0,
        size: 30,
        // type: 'task'
      }
       this.$axios.post(url, qs.stringify(items)).then(data => {
         const list = data.data.data
         let index = 0
         list.forEach(item => {
           index+=item.cnt
         })
         this.headNum = index
         this.getTaskNum()
       }, error => {
       })
    },
    getTaskNum () {
      let url = this.GLOBAL.baseRouter+"system/user/notice-task-list"
      const items = {
        search: '',
        state: -1,
        index: 0,
        size: 30,
        // type: 'task'
      }
       this.$axios.post(url, qs.stringify(items)).then(data => {
         const list = data.data.data
         let index = 0
         list.forEach(item => {
           index+=item.cnt
         })
         this.taskNum = index
         const listFrom = {
          task: index,
          project: this.headNum
        }
        this.$emit('listform', listFrom)
       }, error => {
       })
    },
    // 获取msg
    getMsgNum () {
      const headList = this.objList
      const type = this.typeName
      let list = this.noticeList
      if (list) {
        headList.forEach(elemens => {
          elemens.msg = 0
          list.forEach(item => {
            if (item.id == elemens.id) {
              if (item.state == '0') {
                elemens.msg+= 1
              }
            }
          })
        })
      }
    },
    // 获取任务
    getTask () {
      const useMsg = JSON.parse(localStorage.userMsg)
      this.userMsg= useMsg
      // 新接口
      let url = this.GLOBAL.baseRouter+"system/user/notice-task-list"
      const items = {

        state: -1,
        index: 0,
        size: 30,
        // type: 'task'
      }
       this.$axios.post(url, qs.stringify(items)).then(data => {
         const list = data.data.data
         this.objList = list
         this.getMsgInterface()
      }, error => {
        console.log('请求错误')
      })
    },
    // 全部标记已读
    setSign () {
     const list = this.msgList
     msgList.forEach(items => {
       if (items.state !== '1') {
         items.state = '1'
       }
     })
    },
    // 单个标记已读
    setSigned (index) {
      const isSousuo = this.isSousuo
      const lists = this.msgList[index]
      const items = {
        id: lists.msg_id
      }
      let url = this.GLOBAL.baseRouter+"/system/user/read-notice"
      this.$axios.post(url, qs.stringify(items)).then(data => {
         lists.state = '1'
         const item = this.clickItem
         const names = this.typeName
         if (!isSousuo) {
            if (names == 'project') {
              this.getHead()
            } else {
              this.getTask()
            }
            this.getObj(item)
         }
         this.getMsg()
        //  this.getMsgInterface(index)
      })
    }
  }
}
</script>
<style scoped>
.message_remind_all{
  width: 100%;
  height: 100%;
}
.message_remind_left{
  box-sizing: border-box;
  width: 200px;
  height: 100%;
  padding: 0 10px;
  float: left;
}
.onwStyle{
  font-weight: bold;
}
.message_remind_right{
 box-sizing: border-box;
 width: calc(100% - 200px);
 height: 100%;
 float: left;
 padding: 0 10px 100px 10px;
 border-left: 1px solid #eef1f2;
 overflow-y: auto;
}
.message_remin_input{
  width: 100%;
  height: 30px;
  position: relative;
}
.msg_title_all{
 width: 100%;
 height: calc(100% - 30px);
}
.message_remin_input>input{
  width: 100%;
  height: 30px;
  outline: none;
  border: none;
  border-bottom: 1px solid rgb(225,225,225);
}
.message_remin_input>i {
  cursor: pointer;
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 100%;
  text-align: center;
  line-height: 30px;
  font-size: 20px;
  z-index:9;
}
.msg_title{
 width: 100%;
 height: 30px;
 font-size: 14px;
 margin-top: 10px;
}
.msg_title>p{
 float: left;
}
.msg_title>p:first-child{
  width: calc(100% - 70px);
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.msgStyle {
  height: 20px;
  padding: 0 10px;
  border-radius: 10px;
  line-height: 20px;
  background: rgb(255,153,0);
  color: #ffffff;
  margin-top: 5px;
}
.message_sign{
 width: 100%;
 height: 50px;
}
.message_sign>p{
  height: 30px;
  padding: 2px 10px;
  border-radius: 4px;
  margin-top:10px;
  font-size: 14px;
  float: right;
  text-align: center;
  line-height: 30px;
  color: #ffffff;
  cursor: pointer;
  background: #fcc44a;
}
.msg_sign{
 box-sizing: border-box;
 width: 100%;
 min-height: 80px;
 padding: 10px 0;
 border-bottom: 1px solid #eef1f2;
}
.msg_sign_box{
 width: calc(100% - 150px);
 height: 100%;
 float: left;
 overflow: hidden;
}
.msg_sign_box>p{
 width: 100%;
 /* height: 30px; */
 font-size: 14px;
 line-height: 30px;
}
.msg_sign_box>p:last-child
{
  font-size: 14px;
  color: rgb(215,215,215);
}
.msg_sign_button{
 width: 150px;
 height: 100%;
 float: left;
}
.msg_sign_button>p{
 float: right;
 padding: 2px 10px;
 border-radius: 4px;
 color: #ffffff;
 cursor: pointer;
 font-size: 14px;
 margin-top: 15px;
}
.read_sign{
 background: rgb(215,215,215)!important;
 height: 30px!important;
 padding: 0!important;
 width: 50px;
 text-align: center;
 line-height: 30px;
 border-radius: 4px;
}
.sign-see{
  background: #3bceb6;
}
.sign-end{
  background: #fcc44a;
  margin-left: 10px;
}
/* .msg_sign_button>p:nth-child(2){
  background: rgb(134,134,134);
  margin-left: 10px;
} */
</style>
