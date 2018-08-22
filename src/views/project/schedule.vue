<template>
  <div>
      <!-- 项目进度右侧 -->
      <!--<div class="projectPlanRight">-->
          <!--<div class="rightTitle">-->
            <!--<Icon type="android-apps" size="20"></Icon> 子项目进度-->
          <!--</div>-->
          <!--<div class="rightRow">-->
              <!--<div class="line" v-for="item in ChildMsgData">-->
                  <!--<div class="title">{{item.name}}</div>-->
                  <!--<div class="lineRow"><Progress :percent="Number(item.progress)"><span>{{item.complete}}/{{item.total}}</span></Progress></div>-->
                  <!--<div class="clear"></div>-->
              <!--</div>-->
          <!--</div>-->
          <!--<div class="rightTitle" style="border-top:0px;margin-top:15px;">-->
            <!--<Icon type="android-apps" size="20"></Icon> 成员进度-->
          <!--</div>-->
          <!--<div class="rightRow">-->
                <!--<div class="line" v-for="item in memberMsgData">-->
                  <!--<div class="title">-->
                    <!--<div class="demo-avatar">-->
                        <!--<Avatar src="https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar" size="small"/>&nbsp;&nbsp;{{item.realname}}-->
                    <!--</div>-->
                   <!--</div>-->
                  <!--<div class="lineRow"><Progress :percent="Number(item.progress)"><span>{{item.complete}}/{{item.task_num}}</span></Progress></div>-->
                  <!--<div class="clear"></div>-->
                <!--</div>-->
          <!--</div>-->
      <!--</div>-->

      <!-- 项目进度左侧 -->
      <div class="projectPlanLeft" style="height: 882px;overflow: auto;" >
        <!--<div class="projectPlanList">-->
            <!--<Row>-->
                <!--<Col span="16">-->
                  <!--<Row>-->
                    <!--<Col span="6" class="listTitle">-->
                      <!--<i-circle :percent="proPanData" :trail-width="12" :stroke-width="11" stroke-color="#44aa00">-->
                          <!--<span class="demo-Circle-inner" style="font-size:24px">{{proPanData}}%</span>-->
                      <!--</i-circle><br/>-->
                      <!--<span>项目进度</span>-->
                    <!--</Col>-->
                    <!--<Col span="18" class="listLine">-->
                        <!--<div class="line">-->
                            <!--<div class="title">时间进度</div>-->
                            <!--<div class="lineRow"><Progress :percent="ProTiemDate|filtePressTiem" :stroke-width="16">{{ProTiemDate|filteTime}}</Progress></div>-->
                            <!--<div class="clear"></div>-->
                        <!--</div>-->
                        <!--<div class="line">-->
                            <!--<div class="title">即将完成</div>-->
                            <!--<div class="lineRow"><Progress :percent="ProFinhData" :stroke-width="16"></Progress></div>-->
                            <!--<div class="clear"></div>-->
                        <!--</div>-->
                        <!--<div class="line">-->
                            <!--<div class="title">剩余时间</div>-->
                            <!--<div class="lineRow"><Progress :percent="ProSytsData" :stroke-width="16"><span>{{ProSytsData}}天</span></Progress></div>-->
                            <!--<div class="clear"></div>-->
                        <!--</div>-->
                    <!--</Col>-->
                  <!--</Row>-->
                    <!---->
                <!--</Col>-->
                <!--<Col span="8">-->
                      <!--<Row>-->
                          <!--<Col span="12" class="statis">-->
                                <!--<div class="statisTip statisTip3">-->
                                     <!--<span>{{ProPauseNum}}</span><em>个</em>-->
                                <!--</div>-->
                                <!--<div class="statisTitle">-->
                                  <!--暂停中任务-->
                                <!--</div>-->
                          <!--</Col>-->
                          <!--<Col span="12" class="statis">-->
                                <!--<div class="statisTip statisTip2">-->
                                     <!--<span>{{ProTaskData}}</span><em>个</em>-->
                                <!--</div>-->
                                <!--<div class="statisTitle">-->
                                  <!--实施中任务-->
                                <!--</div>-->
                          <!--</Col>-->
                      <!--</Row>-->
                <!--</Col>-->
            <!--</Row>-->
        <!--</div>-->
        
        <!-- Echart -->
        <div class="projectEchart">
            <EchartLine></EchartLine>
        </div>

      </div>
  </div>
</template>
<script>
import EchartLine from './proStat/echartsLine.vue';
import axios from 'axios'
export default {
    data(){
        return{
            proPanData:0,
            ProTiemDate:0,
            ProFinhData:0,
            ProSytsData:0,
            ProTaskData:0,
            ProPauseNum:0,
            ChildMsgData:[],
            memberMsgData:[]
        }
    },
    filters:{
        filteTime(val){
            if(val<0){
                return "0%"
            }else{
                return val
            }
        },
        filtePressTiem(val){
            if(val<0){
                return 0
            }else if(val>100){
                return 101
            }else{
                return val
            }
        }
    },
    components:{EchartLine},
    mounted(){
        this.ProjectPlanGET();
    },
    methods:{
        ProjectPlanGET(){
            let _this=this;
            let projectID=sessionStorage.projectID;
            let ProjectProgess=_this.$axios.get(this.GLOBAL.baseRouter+"/task/total/project-progress&project_id="+projectID);
            let ChlidProjectProgess=_this.$axios.get(this.GLOBAL.baseRouter+"/task/total/child-project-progress&project_id="+projectID);
            let MemberProgess=_this.$axios.get(this.GLOBAL.baseRouter+"/task/total/member-progress&project_id="+projectID);
            axios.all([ProjectProgess,ChlidProjectProgess,MemberProgess]).then(([msg,childMsg,memberMsg])=>{

                    // 项目进度
                    let MsData=msg.data.data;
                    _this.proPanData=Math.round(MsData.project_progress);
                    _this.ProTiemDate=Math.round(MsData.time_progress);
                    _this.ProFinhData=Math.round(MsData.will_finish);
                    _this.ProSytsData=Math.ceil(MsData.syts);
                    _this.ProTaskData=MsData.tasking_num;
                    _this.ProPauseNum=MsData.pause_num;

                    // 子项目进度
                    _this.ChildMsgData=childMsg.data.data;

                    // 成员进度
                    _this.memberMsgData=memberMsg.data.data;
            },()=>{
                console.log("请求失败")
            })
        }
    }
}
</script>

<style lang="less">
@import '../../styles/schedule.less';
</style>
