<template>
    <div>
        <Row>
            <i-col span="12"><EchartsLine></EchartsLine></i-col>
            <i-col span="12"><EchartsHours></EchartsHours></i-col>
        </Row>
        <Row>
            <i-col span="12"><EchartsStyle></EchartsStyle></i-col>
            <i-col span="12"><EchartsTask></EchartsTask></i-col>
        </Row>
        <Row>
            <i-col span="12"><EchartsTypeTask></EchartsTypeTask></i-col>
            <i-col span="12"><EchartsState></EchartsState></i-col>
        </Row>
    </div>

</template>
<script>
    import EchartsLine from './proStat/echartsLine.vue';
    import EchartsHours from './proStat/echartsHours.vue';
    import EchartsStyle from './proStat/echartsStyle.vue';
    import EchartsTask from './proStat/echartsTask.vue';
    import EchartsTypeTask from './proStat/echartsTypeTask.vue';
    import EchartsState from './proStat/echartsState.vue'
    export default{
      components:{
        EchartsLine,
        EchartsHours,
        EchartsStyle,
        EchartsTask,
        EchartsTypeTask,
        EchartsState
      }
    }
</script>

