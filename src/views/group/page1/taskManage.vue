<template>
    <iframe id="show-iframe"  frameborder=0 name="showHere" scrolling=auto src="src/views/group/page1/gantt/gantt.html"></iframe>
</template>

<script>
  export default {
    data () {
      return {
       // src:request('gantt/gannt.html')
      }
    },
    mounted(){
      let oIframe = document.getElementById('show-iframe');
      let deviceWidth = document.documentElement.clientWidth-210;
      let deviceHeight = document.documentElement.clientHeight-85;
      oIframe.style.width = deviceWidth + 'px';
      oIframe.style.height = deviceHeight + 'px';
    },
  }

</script>