<template>
  <div class="clearfix message_remind_all">
    <div class="message_remind_left">
      <!-- <div class="message_remin_input">
       <input v-model="msgRmind" placeholder="请输入"/>
       <i class="iconfont icon-sousuo"/>
      </div> -->
      <div class="msg_title_all">
        <div class="msg_title" v-for="(itme, index) in objList" :key="index" @click="getObj(index)">
          <p :class="itme.bojectStyle">{{itme.name}}</p>
          <p v-show="itme.msg">{{itme.msg}}</p>
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
export default {
  data () {
    return {
      msgRmind: '',
      typeName: '',
      indexed: 0,
      objList: [],
      userMsg: {},
      noticeList: [],
      msgList: []
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
      if (e === 2) {
        this.getHead()
        this.typeName = 'project'
      } else if (e === 3) {
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
      // this.getMsg(type, project_id)
    }
  },
  created () {
    this.getHead()
    // this.getObj(0)
    this.getMsgInterface()
  },
  methods: {
    // 获取消息接口
    getMsgInterface () {
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
         this.noticeList = lists
         this.getObj(0)
         this.unreadMsg()
       }, error => {
         console.log('错误', error)
       })
    },
    // 切换项目或任务
    getObj (index) {
      const list = this.objList
      const type = this.typeName // 切换项目名
      const noticeList = Array.from(this.noticeList)
      const lists = []
      if (list.length) {
        const project_id = list[index].id // 获取具体项目的id或任务id
        for (let i = 0; i<list.length; i++) { // 循环
          list[i].bojectStyle = '' // 点击样式
          if (i == index) {
            list[i].bojectStyle = 'onwStyle'
            noticeList.forEach(elemens => {
              if (elemens.type == type) {
                if (elemens.id == project_id) {
                  lists.push(elemens)
                }
              }
            })
          }
        }
      }
      this.$nextTick(() => {
        this.msgList = lists
        this.objList = list // 样式控制
        this.indexed = index // 点击排列顺序
        this.getMsgNum()
      })
    },
    // 获取未读消息
    unreadMsg() {
      const lists = this.noticeList
      const listFrom = {}
      lists.forEach(items => {
        if (items.state === '0') {
          if (!listFrom[items.type]) {
            listFrom[items.type] = 0
          }
           listFrom[items.type]+= 1
        }
      })
      this.$emit('listform', listFrom)
    },
    // 获取项目
    getHead () {
      if (localStorage.headerList) {
        const headlist = JSON.parse(localStorage.headerList)
        this.objList = headlist
        this.typeName = 'project'
      } else {
        this.objList = []
      }
      this.getObj(0)
    },
    // 获取消息
    getMsg (type, project_id) {
     
      // this.getMsgNum()
    },
    // 获取msg
    getMsgNum () {
      const headList = this.objList
      const list = this.noticeList
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
      let url = this.GLOBAL.baseRouter+"task/task/list"
      const items = {
        project_id: '',
        project_child_id: '',
        user_id: useMsg.id
      }
      this.typeName = 'task'
      this.$axios.get(url, qs.stringify(items)).then(data => {
        this.objList = data.data.data
        this.getObj(0)
      }, error => {
        console.log('请求错误')
      })
      // 新接口
      // let url = this.GLOBAL.baseRouter+"system/user/get-notice-list"
      // const items = {
      //   search: '',
      //   state: -1,
      //   index: 0,
      //   size: 10,
      //   type: 'task'
      // }
      //  this.$axios.get(url, qs.stringify(items)).then(data => {
        //  console.log('任务', data)
        // this.objList = data.data.data
        // this.getObj(0)
      // }, error => {
      //   console.log('请求错误')
      // })
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
      const lists = this.msgList[index]
      const items = {
        id: lists.msg_id
      }
      let url = this.GLOBAL.baseRouter+"/system/user/read-notice"
      this.$axios.post(url, qs.stringify(items)).then(data => {
         lists.state = '1'
         this.getMsgInterface()
        console.log('请求错误')
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
 padding: 0 10px;
 border-left: 1px solid #eef1f2;
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
.msg_title>p:last-child {
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
