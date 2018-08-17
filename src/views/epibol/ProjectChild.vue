<template>
    <div class="task_page_all">
        <div class="task_msg_bx" v-for="(item, index) in list" :key="index" v-if="list.length">
            <div class="task_msg_left">
                <div class="task_name">
                    <div class="task_name_title">
                        <p class="task_introduce" @click="getTask(item.id)">{{item.task_name}}</p>
                        <p class="project-name">{{item.project_name}}</p>
                    </div>
                    <div class="task_msg_right">
                        <p class="progress_task_all" v-if="!item.progress"><span class="task_progress_name">{{item.progress_name}}</span><span>{{item.progress}}</span>/<span class="task-total">{{item.total}}</span></p>
                    </div>
                </div>
                <div class="task_man_day">
                    <p class="task_work_msg">{{item.workDay}}个工作日({{item.expect_start_time}} ~ {{item.expect_end_time}})</p>
                    <!-- <p class="task_work_time">{{item.expect_start_time}} ~ {{item.expect_end_time}}</p> -->
                    <p class="task_work_img"><img :src="item.headimage"/><span>{{item.task_person}}</span></p>
                </div>
            </div>
            <!-- <div class="task_msg_right">
               <p class="progress_task_all"><span class="task_progress_name">{{item.progress_name}}</span><span>{{item.progress}}</span>/<span>{{item.total}}</span></p>
            </div> -->
        </div>
        <div v-if="!list.length">
            <div class='no_task'>
                <p class="icon_no iconfont icon-meiyoushuju"></p>
                <p>没有当前任务哦</p>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapMutations} from 'vuex'
    export default {
        props: ['list'],
        data () {
            return {
            }
        },
        methods: {
            ...mapMutations(['setDetailAll']),
            // 跳转详情页
            getTask (id) {
                const item = {
                    id: id
                }
                this.setDetailAll(item)
                this.$router.push('/project/details')
            }
        }
    }
</script>
<style lang="less">
    .task_page_all{
        width: 100%;
        min-height: 100%;
        padding: 0 1px;
        .no_task{
            width: 200px;
            height: 200px;
            margin: 0 auto;
            margin-top: 150px;
            text-align: center;
            font-size: 18px;
            .icon_no{
                font-size: 60px;
                color: rgb(210,210,210);
            }
        }
        .task_msg_bx{
            width: 100%;
            height: 120px;
            border: 1px solid #eef1f2;
            margin-bottom: 20px;
            padding:10px;
            //  background: #fdfdfd;
            border-radius: 4px;
            .task_msg_left{
                //  @task: 120px;
                width: 100%;
                height: 100%;
                float: left;
                .task_name{
                    width: 100%;
                    height: 60px;
                    .task_name_title{
                        float: left;
                        @title: 120px;
                        width: calc(~"100% - @{title}");
                        height: 100%;
                        .project-name{
                            color: #bdbdbd;
                            font-size: 14px;
                        }
                    }
                    .task_msg_right{
                        width: 120px;
                        height: 100%;
                        // line-height: 80px;
                        text-align: right;
                        float: left;
                        .progress_task_all{
                            height: 30px;
                            line-height: 30px;
                            font-size: 16px;
                            .task-total{
                                color: #3bceb6;
                            }
                        }
                        .task_progress_name{
                            font-size: 18px;
                            margin-right: 10px;
                            color: #3bceb6;
                        }
                    }
                }
                .task_introduce{
                    width: 100%;
                    height: 30px;
                    line-height: 30px;
                    font-size: 16px;
                    cursor: pointer;
                }
                .task_man_day{
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    color: #bdbdbd;
                    .task_work_msg{
                        float: left;
                    }
                    .task_work_time{
                        float: left;
                        margin-left: 20px;
                    }
                    .task_work_img{
                        float: right;
                        // margin-left: 80px;
                        img{
                            width: 30px;
                            height: 30px;
                            // margin-top: 10px;
                            float: left;
                            border-radius: 50%;
                        }
                        span{
                            float: left;
                            margin-left: 10px;
                        }
                    }
                }
            }
        }
    }
</style>
