<template>
    <div>
        <main-native>
            <div class="main-header-style iconfont"><span class="main-header-title"><i></i>{{this.$route.meta.title}}</span></div>
        </main-native>
        <div class="newStatis">
            <div class="taskTop">
                <ul>
                    <li>
                        <div class="top">
                            <span>进度</span>
                            <!--<img src="../../views/project/proStat/image/moreIcon.png"/>-->
                        </div>
                        <div class="chars">
                            <div class="charSty charsLeft">
                                <p>任务</p>
                                <!--<p>任务<i></i></p>-->
                                <i-circle :percent="countData.schedule.tasks_complete_rate || 0" :size="102" stroke-color="#3bceb6" trail-color="#d0f3ee">
                                    <b>{{countData.schedule.tasks_complete_rate || 0}}</b><i>%</i>
                                </i-circle>
                                <div class="numbers numbersSty">
                                    <span style="color: #3bceb6">{{countData.schedule.tasks_complete || 0}}</span><i>/{{countData.schedule.tasks_count || 0}}</i>
                                </div>
                            </div>
                            <div class="charSty charsRight">
                                <p>时间</p>
                                <i-circle :percent="countData.schedule.sy_rate || 0" :size="102" stroke-color="#fcc44a" trail-color="#fef1d4">
                                    <b>{{countData.schedule.sy_rate || 0}}</b><i>%</i>
                                </i-circle>
                                <div class="numbersSty">
                                    剩余<span style="color: #fcc44a">{{countData.schedule.sy_time || 0 }}</span>个工作日
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="top">
                            <span>延期</span>
                            <!--<img src="../../views/project/proStat/image/moreIcon.png"/>-->
                        </div>
                        <div class="charsCenter">
                            <!--{{countData}}-->
                            <i-circle
                                    :size="135"
                                    :trail-width="13"
                                    :stroke-width="15"
                                    :percent="countData.delay.tasks_delay_rate || 0"
                                    stroke-linecap="square"
                                    trail-color="#ffe1e3"
                                    stroke-color="#ff898e">
                                <div class="demo-Circle-custom">
                                    <span>{{countData.delay.tasks_delay_rate || 0}}</span><i>%</i>
                                    <p>任务延期率</p>
                                </div>
                            </i-circle>
                            <div class="charsBottom">
                                <div class="left charSty">
                                    <p><span>{{countData.delay.tasks_delay || 0}}</span>个</p>
                                    <p><i>已延期</i></p>
                                </div>
                                <div class="right charSty">
                                    <p><span>{{countData.delay.tasks_expect_delay || 0}}</span>个</p>
                                    <p><i>预估延期</i></p>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="top">
                            <span>质量</span>
                            <!--<img src="../../views/project/proStat/image/moreIcon.png"/>-->
                        </div>
                        <div class="chars">
                            <div class="charSty charsLeft">
                                <div class="adopat">内部通过率</div>
                                <!--<p>任务<i></i></p>-->
                                <i-circle :percent="countData.quality.inside_pass || 0" :size="102" stroke-color="#3bceb6" trail-color="#d0f3ee">
                                    <b>{{countData.quality.inside_pass || 0}}</b><i>%</i>
                                </i-circle>
                                <div class="numbersSty">
                                    内部等待<span style="color: #4fdcc5">{{countData.quality.inside_wait || 0}}</span>个
                                </div>
                            </div>
                            <div class="charSty charsRight">
                                <div class="adopat">客户通过率</div>
                                <i-circle :percent="countData.quality.outside_pass || 0" :size="102" stroke-color="#fcc44a" trail-color="#fef1d4">
                                    <b>{{countData.quality.outside_pass || 0}}</b><i>%</i>
                                </i-circle>
                                <div class="numbersSty">
                                    客户待审<span style="color: #4fdcc5">{{countData.quality.outside_wait || 0}}</span>个
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="taskCenter">
                <div class="taskTitle">任务统计</div>
                <ul>
                    <li @click="actionTask('echartsDayTask')">
                        <img src="../../views/project/proStat/image/countIcon1.png"/> <span>每日任务动态统计</span>
                    </li>
                    <li @click="actionTask('EchartsTaskPlan')">
                        <img src="../../views/project/proStat/image/countIcon2.png"/> <span>项目任务进度</span>
                    </li>
                    <li @click="actionTask('EchartsState')">
                        <img src="../../views/project/proStat/image/countIcon3.png"/> <span>任务状态统计</span>
                    </li>
                    <li @click="actionTask('EchartsTypeTask')">
                        <img src="../../views/project/proStat/image/countIcon4.png"/> <span>任务类型工时</span>
                    </li>
                </ul>
            </div>
            <div class="taskCenter">
                <div class="taskTitle">成员统计</div>
                <ul>
                    <li @click="actionTask('EchartsTask')">
                        <img src="../../views/project/proStat/image/taskIcon1.png"/> <span>成员任务统计</span>
                    </li>
                    <li @click="actionTask('EchartsHours')">
                        <img src="../../views/project/proStat/image/taskIcon2.png"/> <span>成员工时进度</span>
                    </li>
                    <li @click="actionTask('EchartsStyle')">
                        <img src="../../views/project/proStat/image/taskIcon3.png"/> <span>成员工时占比</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    var qs = require('querystring');
    import mainNative from '../main-components/mainNative.vue';
    export default{
        components: {
            mainNative
        },
        data(){
            return{
                countData:{
                    delay:{},
                    quality:{},
                    schedule:{}
                }
            }
        },
        methods:{
            actionTask(status){
                this.$router.push('/project/statisticsDetails/'+status);
            }
        },
        created(){
            let id = sessionStorage.projectID;
            this.$axios.post(this.GLOBAL.baseRouter+'task/count/project-count',qs.stringify({project_id:id})).then((res)=>{
                if(res.data.err_code==0){
                    this.countData.delay = res.data.data.delay||{};
                    this.countData.quality = res.data.data.quality||{};
                    this.countData.schedule = res.data.data.schedule||{};
                }else {
                    console.log('错误：',res.data.err_message);
                }
            })
        }
    }
</script>
<style lang="less">
    @import '../../styles/schedule.less';
</style>

