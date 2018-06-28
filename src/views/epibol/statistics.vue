<template>
    <div>
        <div class="projectStatisLeft">
            <dl>
                <dt><Icon type="ios-infinite" size="25" style="float:left;"></Icon><span>任务</span><div class="clear"></div></dt>
                <dd>
                    <a href="javascript:;" v-for="(item,index) in Porject" @click="actionName(item.key,index)" :class="{show:index==Lindex}">{{item.name}}</a>
                </dd>
                <dt><Icon type="ios-infinite" size="25" style="float:left;"></Icon><span>成员</span><div class="clear"></div></dt>
                <dd>
                    <a href="javascript:;" v-for="(item,index) in Member" @click="actionMember(item.key,index)" :class="{show:index==Mindex}">{{item.name}}</a>
                </dd>
            </dl>
        </div>
        <div class="projectStatisRight">
            <keep-alive>
                <component :is="ActionCom"></component>
            </keep-alive>
        </div>
    </div>
</template>
<script>
    import echartsDayTask from './proStat/echartsDayTask.vue';
    import EchartsTaskPlan from './proStat/echartsTaskPlan.vue'
    import EchartsHours from './proStat/echartsHours.vue';
    import EchartsStyle from './proStat/echartsStyle.vue';
    import EchartsTask from './proStat/echartsTask.vue';
    import EchartsTypeTask from './proStat/echartsTypeTask.vue';
    import EchartsState from './proStat/echartsState.vue'
    export default{
      data(){
          return{
              Porject:[
                  {
                      "name":"每日任务动态",
                      "key":echartsDayTask,
                  },
                  {
                      "name":"项目任务进度",
                      "key":EchartsTaskPlan,
                  },
                  {
                      "name":"任务状态统计",
                      "key":EchartsState,
                  },
                  {
                      "name":"任务类型工时",
                      "key":EchartsTypeTask,
                  }
              ],
            Member:[
                {
                    "name":"成员任务统计",
                    "key":EchartsTask,
                },
                {
                    "name":"成员工时进度",
                    "key":EchartsHours,
                },
                {
                    "name":"成员工时占比",
                    "key":EchartsStyle,
                }
            ],
            compName:null,
            Lindex:0,
            Mindex:null,
          }
      },
      mounted(){
          this.compName=this.Porject[0].key;
      },
      computed:{
          ActionCom(){
              return this.compName
          }
      },
      methods:{
          actionName(key,index){
              this.compName=key;
              this.Lindex=index;
              this.Mindex=null
          },
          actionMember(key,index){
              this.compName=key;
              this.Mindex=index;
              this.Lindex=null;
          }
      },
    }
</script>
<style lang="less">
@import '../../styles/schedule.less';
</style>

