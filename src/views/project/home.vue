<style lang="less">
   @import '../../styles/home.less';
</style>
<template>
    <div class="SuvCont">
        <Row class="headerTitle">
            <i-col span="22">
                    <h2>{{proData.name}} <span>负责人：{{proData.realname==" "?proData.nickname:proData.realname}}</span></h2>
                    <h5>{{proData.start_time}}  至  {{proData.end_time}}</h5>
            </i-col>
        </Row>
        <div class="rowColumn">
            <div class="column">
                <dl>
                    <dt><Icon type="podium"></Icon><span>项目进度</span></dt>
                    <dd class="border">
                        <div class="div">
                                <Eann :EannData="EannData" ref="EannEchart"></Eann>
                        </div>
                        <div class="div">
                                <Epie :EpieData="EpieData" ref="EpieEchart"></Epie>
                        </div>
                        <div class="clear"></div>
                    </dd>
                </dl>
            </div>
            <div class="column">
                <Calend></Calend>
            </div>
            <div class="clear"></div>
        </div>
        <div class="rowColumn">
            <div class="column">
                <dl>
                    <dt><Icon type="compose"></Icon><span>客户已反馈</span><em class="more"><router-link to="">查看全部</router-link></em></dt>
                    <dd class="border padding">
                        <Timeline>
                                <div v-if="statusFBack==''" class="notData">暂无数据</div>
                                <Timeline-item color="lightgray" v-for="(Kitem,index) in statusFBack" :key="index">
                                <Icon type="record" slot="dot"></Icon>
                                <span class="time">{{Kitem.client_audit_time|fromatDate}}</span>
                                <span>{{Kitem.task_name}}</span>
                                <span><i>{{Kitem.tag_count}}处修改</i></span>
                                <span><img :src="Kitem.thumb">{{Kitem.run_uname}}</span>
                            </Timeline-item>
                        </Timeline>
                    </dd>
                </dl>
            </div>
            <div class="column">
                <dl>
                    <dt><Icon type="android-clipboard"></Icon><span>内部待审</span><em class="more"><router-link to="">查看全部</router-link></em></dt>
                    <dd class="border padding inside">
                        <Timeline>
                            <div v-if="statusTrial==''" class="notData">暂无数据</div>
                            <Timeline-item color="lightgray" v-for="(Litem,index) in statusTrial" :key="index">
                                <Icon type="record" slot="dot"></Icon>
                                <span class="time">{{Litem.inside_audit_time|fromatDate}} <em>上传</em></span>
                                <span>{{Litem.task_name}}</span>
                                <span><img :src="Litem.thumb">{{Litem.run_uname}}</span>
                            </Timeline-item>

                        </Timeline>
                    </dd>
                </dl>
            </div>
            <div class="clear"></div>
        </div>
    </div>
</template>

<script>
  import Row from '../../../node_modules/iview/src/components/grid/row'
  import ICol from '../../../node_modules/iview/src/components/grid/col'
  import Epie from './surveyCom/echartPie.vue'
  import Eann from './surveyCom/echartAnn.vue'
  import Calend from "../main-components/calend/calend.vue"
  import {surveyListData} from '../../../src/config/env.js'
  export default {
    data(){
      return{
        dataList:[],
        dark:'#ff8c00',
        gray:'#d3d3d3',
        projectID:0,
        proData:[],
        EannData:[],
        EpieData:[]
      }
    },
    components: {ICol, Row,Epie,Eann,Calend},
    mounted(){
      this.projectID=sessionStorage.projectID;
      this.get();
    },
    updated(){
        this.$refs.EannEchart.echarts2();
        this.$refs.EpieEchart.EchaData();
        this.$refs.EpieEchart.echarts2();
       
    },
    computed:{
        statusTrial(){
           return this.dataList.filter(val=>{
                return val.status==1
            })
        },
        statusFBack(){
            return this.dataList.filter(val=>{
                return val.status==4
            })
        }
    },
    filters:{
      fromatDate(value){
        let unTime=value;
        let nuTimeSt = new Date(unTime* 1000);
        let ndtody=new Date();
        let TimeD=parseInt((ndtody-nuTimeSt)/1000/60/60)

        if(TimeD<=24){
           return value=TimeD+"小时前";
        }else if(TimeD<=48){
          return value="1天前";
        }else if(TimeD<=96){
          return value="2天前";
        }else{
          return value="几天前";
        }
      }

    },
    methods:{
      get(){
        let _this=this  
        let url =_this.$axios.get(_this.GLOBAL.baseRouter+'task/task/stage-page&status=4&status=1&project_id='+_this.projectID);
        let proUrl=_this.$axios.get(_this.GLOBAL.baseRouter+'task/total/project-info-progress&project_id='+_this.projectID);
        _this.$axios.all([url,proUrl]).then(([Urldata,ProData])=>{

        //   项目信息
          _this.proData=ProData.data.data.project_info;
          _this.EannData=ProData.data.data.data1;
          _this.EpieData=ProData.data.data.data2;
                    
        //   反馈和内部审核
          _this.dataList=Urldata.data.data;
        }, (error)=>{
          console.log(error)
        });
      },
    }

  };
</script>