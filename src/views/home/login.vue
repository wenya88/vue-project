<template>
  <div class="entrance">
    <div class="purple"></div>
    <div class="yellow"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  created() {
    // console.log(body.offsetHeight)
  },
  methods: {
    
  }
}
</script>

<style scoped lang="less">
.main-content{
  position: absolute !important;
  top: 0 !important;
  .single-page-con{
    top: 0 !important;
    z-index: 100 !important;
  }
}
.entrance{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .purple{
    border-top: 100px solid #fb3;
    // border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    height: 100%;
    width: 50%;
    margin: 0 0 20px 0;
  }
}
</style>
