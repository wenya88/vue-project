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
<<<<<<< HEAD
                ishow: false,
                positionX: 0,
                positionY: 0
=======
                ishow: false
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
            };
        },
        created() {
        //  console.log('数据', localStorage.token)
        },
        computed: {
          getishow () {
            this.ishow = this.$store.state.msgShow
            if (localStorage.token) {
              const msgData = JSON.stringify({
              action: 'login',
              token: localStorage.token
            })
            this.$connectSoket.connectSocket(msgData)
            }
            if (localStorage.useList) {
              this.$store.state.useList = JSON.parse(localStorage.useList)
            }
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
<<<<<<< HEAD
          localStorage.removeItem('msgShow')
        },
        methods: {
          down (e) {
            console.log('down', e)
          },
          move (e) {
            console.log('move', e)
          },
          up (e) {
            console.log('up', e)
          }
=======
        },
        methods: {
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
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
<<<<<<< HEAD
    position: relative;
=======
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
}
.app-main{
    width: 100%;
    height: 100%;
}
</style>
