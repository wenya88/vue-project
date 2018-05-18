<style lang="less">
   @import '../../styles/home.less';
</style>
<template>
    <div class="SuvCont">
        <Row class="headerTitle">
            <i-col span="22">
                    <h2>新双无战意外包项目 <span>负责人：李哥</span></h2>
                    <h5>2018-3-24  至  2018-4-25</h5>
            </i-col>
        </Row>
        <div class="rowColumn">
            <div class="column">
                <dl>
                    <dt><Icon type="podium"></Icon><span>项目进度</span></dt>
                    <dd class="border">
                        <div class="div"><Eann></Eann></div>
                        <div class="div"><Epie></Epie></div>
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
                            <!-- <Timeline-item :color="[Kitem.stage_id==dataList[0].stage_id?dark:gray]" v-for="Kitem in dataList"> -->
                                <Timeline-item color="lightgray" v-for="(Kitem,index) in dataList" :key="index">
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
                            <!-- <Timeline-item :color="[Litem.stage_id==dataList[0].stage_id?dark:gray]" v-for="Litem in dataList"> -->
                            <Timeline-item color="lightgray" v-for="(Litem,index) in dataList" :key="index">
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
    components: {ICol, Row,Epie,Eann,Calend},
    mounted(){
      this.get();
    },
    data(){
      return{
        dataList:[],
        dark:'#ff8c00',
        gray:'#d3d3d3'
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
        let url =this.GLOBAL.baseRouter + 'task/task/stage-page';
        _this.$axios.get(url).then(function (data) {
          _this.dataList=data.data.data.slice(0,8);
        }, function (error) {
          console.log(error)
        });
      },
    }

  };
</script>