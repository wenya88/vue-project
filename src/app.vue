<template>
    <div id="main" class="app-main">
        <router-view></router-view>
        <chat-interface v-if="ishow"></chat-interface>
    </div>
</template>

<script>
    export default {
      data () {
            return {
                theme: this.$store.state.app.themeColor,
                ishow: false
            };
        },
        created() {
        //  console.log('数据', localStorage.token)
         if (localStorage.token) {
          const msgData = JSON.stringify({
            action: 'login',
            token: localStorage.token
          })
          this.$connectSoket.connectSocket(msgData)
         }
        },
        computed: {
          getishow () {
            this.ishow = this.$store.state.msgShow
          }
        },
        watch: {
          getishow(e) {
             console.log('数据', e)
          }
        },
        mounted () {
        //   console.log('数据2', this.$store.state.msgShow)
        },
        beforeDestroy () {
        },
        methods: {
        }
    };
</script>

<style>
@import './styles/fonts/iconfont.css';
html,body{
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    overflow: hidden;
}
.app-main{
    width: 100%;
    height: 100%;
}
</style>
