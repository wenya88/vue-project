<template>
  <div class="remind_all">
    <div class="remind_message">
      <ul class="remind_message_ul">
        <li @click="getClick(0)" class="remind_active">投标<span>(2)</span></li>
        <li @click="getClick(1)">合同<span></span></li>
        <li @click="getClick(2)">项目<span>(1)</span></li>
        <li @click="getClick(3)">任务<span>(2)</span></li>
        <li @click="getClick(4)">系统<span>(3)</span></li>
      </ul>
      <span @click="setMsg">设置</span>
   </div>
   <div class="remind_children">
     <remind-children v-show="!isSet"></remind-children>
     <set-rmind v-show="isSet"></set-rmind>
   </div>
  </div>
</template>
<script>
import remindChildren from './remindChildren.vue'
import setRmind from './setramind.vue'
export default {
  data () {
    return {
      isSet: false,
      tabNum: 2
    }
  },
  components: {
    remindChildren,
    setRmind
  },
  mounted () {
   this.getClick(2)
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
    setMsg () {
      this.isSet = true
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
 background: rgb(215,247,239);
}
.remind_message_ul>li{
  float: left;
  height: 30px;
  font-size: 14px;
  margin: 10px 0 0 20px;
  list-style: none;
  cursor: pointer;
}
.remind_active{
 font-weight: bolder;
}
.remind_children{
 width: 100%;
 height: calc(100% - 30px);
}
</style>
