<template>
  <div class="clearfix message_remind_all">
    <div class="message_remind_left">
      <div class="message_remin_input">
       <input v-model="msgRmind" placeholder="请输入"/>
       <i class="iconfont icon-sousuo"/>
      </div>
      <div class="msg_title_all">
        <div class="msg_title" v-for="(itme, index) in objList" :key="index">
          <p>{{itme.obj}}</p>
          <p v-show="itme.msg!==0">{{itme.msg}}</p>
        </div>
      </div>
    </div>
    <div class="message_remind_right">
     <div class="message_sign">
       <p @click="setSign">标识全部已读</p>
     </div>
     <div class="clearfix msg_sign" v-for="(items, index) in msgList" :key="index">
        <div class="msg_sign_box">
          <p>{{items.msg}}</p>
          <p>{{items.times}}</p>
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
export default {
  data () {
    return {
      msgRmind: '',
      objList: [
        {
          obj: '外包项目',
          msg: 10
        },
        {
          obj: '金刚皮肤',
          msg: 0
        },
        {
          obj: '娃哈哈小哪吒',
          msg: 5
        }
      ],
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
  methods: {
    // 全部标记已读
    setSign () {
      const list = this.msgList
      list.forEach(elemens => {
        elemens.isRead = true
      })
    },
    // 单个标记已读
    setSigned (index) {
      const list = this.msgList
      list[index].isRead = true
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
