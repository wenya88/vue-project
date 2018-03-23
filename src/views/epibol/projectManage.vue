<template>
  <div>
    <!-- @click="linkTo('/system/authority/authorityAdd',{level: menuItem.level,type: menuItem.type,parentPrivNo: menuItem.privNo})" -->
    <Button type="primary" @click="linkTo('/project')">普通项目</Button>
    <Button type="primary" @click="linkTo('/project')">分包项目</Button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  computed: {
    
  },
  methods: {
    linkTo(url, params) {
      if (params) {
        this.$router.push({ path: url, query: params });
      }
      else {
        this.$router.push(url)
      }
    }
  }
}
</script>

<style>

</style>
