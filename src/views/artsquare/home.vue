<template>
  <div>
      <main-native>
          <div class="main-header-style iconfont"><span class="main-header-title"><i></i>{{this.$route.meta.title}}</span></div>
      </main-native>
      <task-list :taskData="taskData"></task-list>
  </div>
</template>
<script>
var qs=require('querystring');
import taskList from './component/taskList';
import mainNative from '../main-components/mainNative.vue';
import api from 'api';
export default {
  data(){
    return{
      taskData:[]
    }
  },
  components:{
      taskList:taskList,
      mainNative:mainNative
  },
  mounted(){
    this.taskListData();
    this.$bus.on('joinSuccess',()=>{
       this.taskListData();
    })
  },
  methods:{
    //列表数据
    async taskListData(){
        const taskHall = await api.getTaskHall();
        if(taskHall.data.err_code == 0){
            this.taskData=taskHall.data.data;
        }else {
            this.$Message.error('请求失败!')
        }
    }
  }
}
</script>
<style lang="less" >
@import './style/taskHome.less';
</style>
