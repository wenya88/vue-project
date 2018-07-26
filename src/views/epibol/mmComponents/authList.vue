<template>
  <div class="authList">
    <div class="itemList" v-for="(item,index) in authList" :key="index">
      <div class="title">{{item.name}}</div>
      <div class="content">{{item.summary}}</div>
      <i-switch size="large" v-model="item.auth=='0'?false:true">
        <span slot="open">开启</span>
        <span slot="close">关闭</span>
      </i-switch>
    </div>
  </div>
</template>

<script>
export default {
  name: "authList",
  props: {
    authList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style scoped lang="less">
.authList{
  .itemList{
    width: 95%;
    padding: 0 5px;
    float: left;
    line-height: 25px;
    margin-bottom: 20px;
    .title, .content{
      width: 80%;
      float: left;
    }
  }
}
</style>
