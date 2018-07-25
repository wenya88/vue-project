<template>
  <div class="authList">
    <div class="itemList" v-for="(item,index) in authList" :key="index">
      <div class="title">{{item.modelName}}</div>
      <div class="content">{{item.modelMessage}}</div>
      <i-switch size="large" v-model="item.status">
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
    line-height: 36px;
    .title, .content{
      width: 80%;
      float: left;
    }
  }
}
</style>
