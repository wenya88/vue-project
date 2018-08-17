<!-- 任务日志组件 -->
<template>
    <div >
        <Timeline>
        <TimelineItem v-for="(item,index) in taskLogData" :key="index">
            {{ item.time+"----"}}
            <span>{{ "["+item.nickname +"]"}}</span>
            <!-- <span>{{" "+item.action+" "}}</span> -->
            <span>{{ item.text }}</span>
            <span style="color: #ed3f14">{{item.nickname}}</span>
        </TimelineItem>
        </Timeline>
    </div>
</template>
<script>

export default {
    data() {
        return {
            taskLogData:[]
        }
    },
    methods: {
        inittaskLogData(taskLogData)
        {          
            this.taskLogData = taskLogData;
        }
    }
};
</script>