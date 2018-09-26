<!-- 新增任务弹窗-->
<template>
    <div class="addtask">
        <h1>新增任务</h1>
        <br />
        <addtask ref="add"></addtask>
    </div>
</template>
<script>
import addtask from "./taskDetails";
export default {
    components:{
        addtask
    },
    data(){
        return {
            addTaskData:{}
        }
    },
    mounted() {},
    methods: {
        accretionTaskPop(projectInfo) {
            this.$refs.add.initTaskDetailFromNew(projectInfo);
        },
        //保存所有的任务信息，包含子任务
        saveTaskDetail(id) {
            if(id){
                //保存父任务
                return this.$refs.add.saveTaskDetails(null,id);
            }else{
                return this.$refs.add.saveTaskDetails(null);

            }
            //保存父任务
            // return true;
        },
        clearAllData(){
            this.$refs.add.clearAllData()
        }
    }
}
</script>
<style scoped>
.addtask {
  padding: 0px 0px 0px -20px;
}
</style>
