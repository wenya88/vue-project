<template>
  <div class="clearfix message_remind_all">
    <div class="message_remind_left">
      <div class="message_remin_input">
       <input v-model="msgRmind" placeholder="请输入"/>
       <i class="iconfont icon-sousuo"/>
      </div>
      <div class="msg_title_all">
        <div class="msg_title" v-for="(itme, index) in objList" :key="index" @click="getObj(index)">
          <p :class="itme.bojectStyle">{{itme.name}}</p>
          <p v-show="itme.msg">{{itme.msg}}</p>
        </div>
      </div>
    </div>
    <div class="message_remind_right">
     <div class="message_sign">
       <p @click="setSign">标识全部已读</p>
     </div>
     <div class="clearfix msg_sign" v-for="(items, index) in msgList" :key="index">
        <div class="msg_sign_box">
          <p>{{items.message}}</p>
          <p>{{items.date}}</p>
        </div>
        <div class="msg_sign_button">
          <p class="read_sign" v-show="items.isRead">已读</p>
          <p v-show="!items.isRead" @click="setSigned(index)">标识已读</p>
          <p v-show="!items.isRead">查看</p>
        </div>
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
      msgList: [
        {
          msg: '你有一封邮件',
          times: '2018/05/27',
          isRead: false
        },
        {
          msg: '你有一封邮件1',
          times: '2018/05/27',
          isRead: false
        },
        {
          msg: '你有一封邮件2',
          times: '2018/05/27',
          isRead: true
        },
        {
          msg: '你有一封邮件3',
          times: '2018/05/27',
          isRead: false
        }
      ]
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
      // console.log('点击11', e)
      if (e === 2) {
        this.getHead()
        this.typeName = 'project'
      } else if (e === 3) {
        this.getTask()
        this.typeName = 'task'
      }
    },
     getList (e) {
      const list = this.objList
      const type = this.typeName
      const index = this.indexed
      const project_id = list[index].project_id
      this.getMsg(type, project_id)
    }
  },
  created () {
    this.getHead()
    this.getObj(0)
  },
  methods: {
    // 切换项目或任务
    getObj (index) {
      const list = this.objList
      const type = this.typeName
      const project_id = list[index].project_id
      for (let i = 0; i<list.length; i++) {
        list[i].bojectStyle = ''
        if (i == index) {
          list[i].bojectStyle = 'onwStyle'
        }
      }
      this.$nextTick(() => {
        this.objList = list
        this.indexed = index
        this.getMsg(type, project_id)
        console.log('项目', index, this.objList)
      })
    },
    // 获取项目
    getHead () {
      if (localStorage.headerList) {
        const headlist = JSON.parse(localStorage.headerList)
        this.objList = headlist
        console.log('headList', headlist)
      } else {
        this.objList = []
      }
    },
    // 获取消息
    getMsg (type, project_id) {
      const msgList = [] // 构建消息list
      const typeList = [] // 构建类型list
      if (localStorage.noticeList) {
        const list = JSON.parse(localStorage.noticeList) // 获取推送消息的总条数
        list.forEach(items => {
          if (items.isRead !== undefined) {
            items.isRead = false //  增加标记，如果没有就添加
          }
          if (type === items.type) {
            typeList.push(items)
          }
        })
        typeList.forEach(elemens => {
          if (project_id === elemens.project_id) {
            msgList.push(elemens)
          }
        })
      }
      this.msgList = msgList
      this.getMsgNum()
    },
    // 获取msg
    getMsgNum () {
      const headForm = {}
      const headList = this.objList
      if (localStorage.noticeList) {
        const list = JSON.parse(localStorage.noticeList)
          headlist.forEach(elems => {
            const formName = `project_${elems.id}`
            headForm[formName] = []
            list.forEach(items => {
            if (items.project_id === elems._id) {
              if (!items.isRead) {
                  headForm[formName].push(items)
              }
            }
          })
        })
        for (let i in headForm) {
          headList.forEach(items => {
             const formName = `project_${items.id}`
             if (i == formName) {
               items.msg = headForm[i].length
             }
          })
        }
        this.objList = headList
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
      this.$axios.get(url, qs.stringify(items)).then(data => {
        this.objList = data.data.data
      }, error => {
        console.log('请求错误')
      })
    },
    // 全部标记已读
    setSign () {
      const list = this.msgList
      const types = list[index].type
      const project_id = list[index].project_id
      list.forEach(elemens => {
        elemens.isRead = true
      })
      const allList = JSON.parse(localStorage.noticeList)
      allList.forEach(items => {
        if (items.type === types) {
          if (items.project_id === project_id) {   
              items.isRead = true
          }
        }
      })
      localStorage.noticeList = JSON.stringify(allList)
    },
    // 单个标记已读
    setSigned (index) {
      const list = this.msgList
      list[index].isRead = true
      const types = list[index].type
      const times = list[index].times
      const project_id = list[index].project_id
      const allList = JSON.parse(localStorage.noticeList)
      allList.forEach(items => {
        if (items.type === types) {
          if (items.project_id === project_id) {
            if (items.times === times) {
              items.isRead = true
            }
          }
        }
      })
      localStorage.noticeList = JSON.stringify(allList)
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
 border-left: 1px solid rgb(225,225,225);
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
  padding: 0 10px;
  border-radius: 10px;
  margin-top:10px;
  float: right;
  text-align: center;
  line-height: 30px;
  color: #ffffff;
  cursor: pointer;
  background: rgb(134,134,134);
}
.msg_sign{
 box-sizing: border-box;
 width: 100%;
 height: 80px;
 padding: 10px 0;
 border-bottom: 1px solid rgb(215,215,215);
}
.msg_sign_box{
 width: calc(100% - 200px);
 height: 100%;
 float: left;
}
.msg_sign_box>p{
 width: 100%;
 height: 30px;
 font-size: 14px;
 line-height: 30px;
}
.msg_sign_box>p:last-child
{
  font-size: 14px;
  color: rgb(215,215,215);
}
.msg_sign_button{
 width: 200px;
 height: 100%;
 float: left;
}
.msg_sign_button>p{
 float: right;
 padding: 0 10px;
 border-radius: 10px;
 color: #ffffff;
 cursor: pointer;
 font-size: 14px;
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
.msg_sign_button>p:last-child{
  background: rgb(24,191,164);
}
.msg_sign_button>p:first-child{
  background: rgb(134,134,134);
  /* margin-left: 10px; */
}
.msg_sign_button>p:nth-child(2){
  background: rgb(134,134,134);
  margin-left: 10px;
}
</style>
