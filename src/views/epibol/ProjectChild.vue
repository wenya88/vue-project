<template>
   <div class="task_page_all">
      <div class="task_msg_bx" v-for="(item, index) in list" :key="index" v-if="list.length">
        <div class="task_msg_left">
           <p class="task_introduce">{{item.task_name}}</p>
           <div class="task_man_day">
             <p class="task_work_msg">{{item.workDay}}个工作日</p>
             <p class="task_work_time">{{item.expect_start_time}} ~ {{item.expect_end_time}}</p>
             <p class="task_work_img"><img :src="item.headimage"/><span>{{item.task_person}}</span></p>
           </div>
         </div>
        <div class="task_msg_right">
           <p class="progress_task_all"><span class="task_progress_name">{{item.progress_name}}</span><span>{{item.progress}}</span>/<span>{{item.total}}</span></p>
        </div>
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
export default {
  props: ['list'],
  data () {
    return {
    }
  }
}
</script>
<style lang="less">
.task_page_all{
 width: 100%;
 min-height: 100%;
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
   height: 80px;
   border-bottom: 1px solid rgb(228,228,228);
   .task_msg_right{
      width: 120px;
      height: 100%;
      line-height: 80px;
      text-align: right;
      float: left;
      .progress_task_all{
        font-size: 16px;
      }
      .task_progress_name{
        font-size: 18px;
          margin-right: 10px;
      }
    }
    .task_msg_left{
       @task: 120px;
       width: calc(~"100% - @{task}");
       height: 100%;
       float: left;
       .task_introduce{
          width: 100%;
          height: 30px;
          font-size: 16px;
        }
        .task_man_day{
           width: 100%;
           height: 50px;
           line-height: 50px;
           color: rgb(200,200,200);
           .task_work_msg{
              float: left;
            }
           .task_work_time{
              float: left;
              margin-left: 20px;
            }
            .task_work_img{
              float: left;
              margin-left: 80px;
              img{
                width: 30px;
                height: 30px;
                margin-top: 10px;
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
