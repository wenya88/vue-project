<template>
  <Tabs value="name1">
        <TabPane label="任务类型库" name="name1">
          <tasktype></tasktype>
        </TabPane>
        <TabPane label="公司主页" name="name2"></TabPane>
    </Tabs>
  
</template>

<script>
import tasktype from './components/taskType.vue';
export default {
  components:{
    tasktype
  }
}
</script>

<style>

</style>
