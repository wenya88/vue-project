<template>
  <div class="authList">
    <div class="itemList" v-for="(item,index) in authList" :key="index">
      <div class="title">{{item.name}}</div>
      <div class="content">{{item.summary}}</div>   <!--item.auth_id-->
      <i-switch size="large" v-model="item.auth=='0'?false:true" @on-change="changeSwitch" @click.native="authID(item.auth_id)">
        <span slot="open">开启</span>
        <span slot="close">关闭</span>
      </i-switch>
    </div>
  </div>
</template>

<script>
var qs = require('querystring');
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
       switchFlah: Boolean
    }
  },
  methods: {
    changeSwitch(res) {
      this.switchFlah=res
    },
    authID(id){
      //  console.log(id,this.switchFlah)
       if (this.switchFlah) {
        var data = {
          id: sessionStorage.postId,
          auth: 'no_auth',
          name: id,
          type: 1
        }
        // Cookies.set('access', 1);
      } else {
        var data = {
          id: sessionStorage.postId,
          auth: 'no_auth',
          name: id,
          type: 0
        }
      }
      this.$axios.post(this.GLOBAL.baseRouter+'system/auth/auth-update', qs.stringify(data))
      .then(res => res.data)
      .then(res => {
        if(res.err_code == 0) {
          // 修改成功
        }
      })
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
