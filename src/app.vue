<template>
    <div id="main" class="app-main">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
      data () {
            return {
                theme: this.$store.state.app.themeColor
            };
        },
        created() {
         if (localStorage.token) {
          const msgData = JSON.stringify({
            action: 'login',
            token: localStorage.token
          })
          this.$connectSoket.connectSocket(msgData)
         }
        },
        mounted () {
         
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
