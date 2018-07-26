<template>
  <div>
    <Tree :data="data" show-checkbox></Tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [{
        title: 'parent 1',
        expand: true,
        children: [{
          title: 'parent 1-1',
          expand: true,
          children: [{
            title: 'leaf 1-1-1'
          },
          {
            title: 'leaf 1-1-2'
          }]
        }, {
          title: 'parent 1-2',
          expand: true,
          children: [{
            title: 'leaf 1-2-1'
          },
          {
            title: 'leaf 1-2-1'
          }]
        }]
      }, {
        title: 'parent 1',
        expand: true,
        children: [{
          title: 'parent 1-1',
          expand: true,
          children: [{
            title: 'leaf 1-1-1'
          },
          {
            title: 'leaf 1-1-2'
          }]
        }, {
          title: 'parent 1-2',
          expand: true,
          children: [{
            title: 'leaf 1-2-1'
          },
          {
            title: 'leaf 1-2-1'
          }]
        }]
      }]
    }
  }
}
</script>

<style scoped>
.ivu-tree-children{
  border-bottom: 1px solid;
}
</style>
