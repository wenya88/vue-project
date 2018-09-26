<template>
  <div class="remind_all">
    <div class="remind_message">
      <ul class="remind_message_ul">
        <li @click="getClick(0)" v-if="false">投标<span v-show="froms.bid">({{froms.bid}})</span></li>
        <li @click="getClick(1)" v-if="false">合同<span v-show="froms.contract">({{froms.contract}})</span></li>
        <li @click="getClick(0)" class="remind_active">项目<span v-show="froms.project">({{froms.project}})</span></li>
        <li @click="getClick(1)">任务<span v-show="froms.task">({{froms.task}})</span></li>
        <li @click="getClick(4)" v-if="false">系统<span v-show="froms.system">({{froms.system}})</span></li>
      </ul>
      <!-- <span @click="setMsg">设置</span> -->
   </div>
   <div class="remind_children">
     <remind-children v-show="!setshow" @listform = 'getlist'></remind-children>
     <set-rmind v-show="setshow"></set-rmind>
   </div>
  </div>
</template>
<script>
import remindChildren from './remindChildren.vue'
import setRmind from './setramind.vue'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      // isSet: false,
      tabNum: 2,
      froms: {}
    }
  },
  components: {
    remindChildren,
    setRmind
  },
  mounted () {
   this.getClick(0)
  },
  computed: {
    ...mapState({
      setshow(data) {
         return data.app.isSetShow
      }
    })
  },
  methods: {
    // 点击事件
    getClick (index) {
      // this.project_id = index
      // this.$set(this, 'project_id', index)
      this.$store.state.tabNum = index
      const doucments = document.getElementsByClassName('remind_message_ul')[0]
      const children = Array.from(doucments.children)
      children.forEach(elments => {
        elments.classList.remove('remind_active')
      })
      children[index].classList.add('remind_active')
    },
    // setMsg () {
    //   this.isSet = !this.isSet
    // },
    // 获取消息
    getlist(e) {
      const froms = e
      // if (!froms.bid) {
      //   froms.bid = 0
      // }
      if (!froms.task) {
        froms.task = 0
      }
      // if (!froms.contract) {
      //   froms.contract = 0
      // }
      if (!froms.project) {
        froms.project = 0
      }
      // if (!froms.system) {
      //   froms.system = 0
      // }
      this.froms = froms
      var index = 0
      for (let i in froms) {
        index+= froms[i]
      }
      this.$store.state.msgNum = JSON.stringify(index)
      localStorage.msgNum = JSON.stringify(index)
    }
  }
}
</script>
<style scoped>
.remind_all{
  width: 100%;
  height: 100%;
}
.remind_message{
 width: 100%;
 height: 50px;
 position: relative;
}
.remind_message>span{
 position: absolute;
 bottom: 5px;
 right: 5px;
 cursor: pointer;
}
.remind_message_ul{
 width: 100%;
 height: 100%;
 background: rgb(212,244,239);
}
.remind_message_ul>li{
  float: left;
  width: 80px;
  height: 30px;
  font-size: 14px;
  line-height: 30px;
  text-align: center;
  margin: 10px 0 0 20px;
  list-style: none;
  cursor: pointer;
  border-radius: 4px;
}
.remind_active{
 font-weight: bolder;
 background: #fdfdfd;
 color: #3bceb6;
}
.remind_children{
 width: 100%;
 height: calc(100% - 30px);
}
</style>
