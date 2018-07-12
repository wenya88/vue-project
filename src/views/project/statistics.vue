<template>
    <div class="newStatis">
        <dl>
            <dt>任务统计</dt>
            <dd>
                <ul>
                    <li>
                        <div class="taskState" @click="actionTask('echartsDayTask')">
                            <div class="title">
                                每日任务动态统计
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="taskSchedule" @click="actionTask('EchartsTaskPlan')">
                            <div class="title">
                                项目任务进度
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="statusSchedule" @click="actionTask('EchartsState')">
                            <div class="title">
                                任务状态统计
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="taskStyle" @click="actionTask('EchartsTypeTask')">
                            <div class="title">
                                任务类型工时
                            </div>
                        </div>
                    </li>
                </ul>
            </dd>
            <dt>成员统计</dt>
            <dd>
                <ul>
                    <li>
                        <div class="memberStask" @click="actionTask('EchartsTask')">
                            <div class="title">
                                成员任务统计
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="memberHours" @click="actionTask('EchartsHours')">
                            <div class="title">
                                成员工时进度
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="hoursPercent" @click="actionTask('EchartsStyle')">
                            <div class="title">
                                成员工时占比
                            </div>
                        </div>
                    </li>
                </ul>
            </dd>
        </dl>
    </div>
</template>
<script>
export default{
    methods:{
           actionTask(status){
               this.$router.push('/project/statisticsDetails/'+status)
        }
    }
}
</script>
<style lang="less">
@import '../../styles/schedule.less';
</style>

