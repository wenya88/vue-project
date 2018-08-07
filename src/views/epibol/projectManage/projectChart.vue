<template>
    <div class="projectChartBox">
        <!-- ChartNav -->
        <div class="chartNavBox">
            <div class="chartNav" :style="`width:${pWeek.length*140}px`">
                <span class="week" v-for="(item,index) in pWeek" :key="index" :style="`left:${index==0?10:(index*140)+10}px`">
                    <span class="weekValue">{{item}}</span>
                </span>
            </div>
        </div>
        <!-- ChartData -->
        <div class="projectChart" id="range">
            <div class="dataSelet" v-if="dataFlgt">
                <Select v-model="dataValue" style="width:50px" size="small">
                    <Option v-for="item in dateList" :value="item.type" :key="item.val">{{ item.val }}</Option>
                </Select>
            </div>
            <div class="chartRow" id="move" :style="`width:${pWeek.length*140}px;`">
                <!--当前时间线-->
                <div class="projectSignLien" :style="`left:${(dayLine*20)+20}px`"></div>
                <!-- 项目 -->
                <div :class="[item.status==3?'projectOver chartList':'chartList']" v-for="(item,index) in projectData" :key="item.id"
                  :style="`margin-left:${item.xdays*20+'px'};margin-top:${item.xdays>item.dayGap&&index>0?'-100px':''}
                      ;margin-top:${item.xdays+item.total_day<item.MindayGap&&index>0?'-100px':''}`" 
                >
                    <div class="chartFloat" :style="`width:${Math.abs(item.total_day)*20+'px'}`">
                        
                        <div class="projectInfo">
                            <div class="infoShow" v-if="item.total_day*20>100">
                                <div class="company">
                                    <h1>
                                        {{item.name}}
                                        <i class="iconfont icon-g-status-zanting" v-if="item.status==2"></i>
                                        <i class="iconfont icon-wancheng" v-if="item.status==3"></i>
                                    </h1>
                                    <div class="title">
                                        {{item.company==null?'-':item.company}}
                                    </div>
                                    <div class="day">
                                        {{item.start_date}} ~ {{item.end_date}} <span v-if="item.total_day>13">( {{item.last_day}} )</span>
                                    </div>
                                </div>
                                <div class="perInfo" v-if="item.total_day>13">
                                    <img :src="item.picture"><br/>
                                    {{item.create_username}}<br/>
                                    <span class="over" v-if="item.status==3">已完成</span>
                                </div>
                                <div class="clear"></div>
                            </div>

                            <div v-else class="infoHidden">
                                <Tooltip :content="item|fileContent" placement="top-start">
                                    <span class="span">{{item.name}}</span>
                                </Tooltip>
                            </div>
                        </div>
                        <div style="margin-bottom:-7px;">
                            <Progress :percent="Number(item.rate_task)>100.1?100:Number(item.rate_task)" :stroke-width="3" :hideInfo="true" status="active"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
var {runMove,initW}=require('./chartMove.js');
var qs=require('querystring')
export default {
    data(){
        return{
            pWeek:[],
            projectData:[],
            dayLine:null,
            dateList:[
                {"val":"年","type":"year"},
                {"val":"月","type":"month"},
                {"val":"周","type":"week"},
            ],
            dataValue:'week',
            dataFlgt:false

        }
    },
    mounted(){
        this.getChartData();
        this.autoH();
        runMove();
        this.$bus.on('submitOk',()=>{
            this.getChartData();
        })
    },
    filters:{
        fileContent(val){
            return val.name +"　"+ val.start_date+" ~ "+val.end_date
        }
    },
    updated(){
        initW(this.dayLine);
    },
    methods:{
        autoH(){
            let pcH=document.getElementById('range');
            let pcB=document.getElementsByClassName("projectChartBox")[0];
            let pcNav=document.getElementsByClassName('chartNavBox')[0];
            let dH=document.documentElement.offsetHeight;
            let dW=document.documentElement.offsetWidth;
            pcH.style.height=dH-183+"px";
            pcH.style.width=dW-160+"px";
            pcB.style.height=dH-118+"px";
            pcNav.style.width=pcH.style.width;//chartNav
           
        },
        getChartData(){
            let url=this.GLOBAL.baseRouter+'task/project/page';
            let params={}
            this.$axios.post(url,qs.stringify(params)).then(msg=>{
                if(msg.data.err_code==0){
                    this.pWeek=msg.data.date;

                    // DayLine
                    let day=new Date();
                    let y=day.getFullYear();
                    let m=day.getMonth()+1;
                    let d=day.getDate();
                    let cuDate=y+'/'+m+'/'+d;
                    let cTime=Math.round(new Date(cuDate)/1000);
                    let pDate=this.pWeek[0].replace(/-/g,'/');
                    let pTime=Math.round(new Date(pDate)/1000);

                    this.dayLine=(cTime-pTime)/86400;

                    let gap_num=[];
                    let gap_numMin=[];
                    msg.data.project.forEach(val => {
                        gap_num.push({dayGap:val.total_day+val.xdays})
                        gap_numMin.push({MindayGap:val.xdays})           
                    });
                    // Max
                    gap_num.unshift({dayGap:0});
                    gap_num.splice(gap_num.length-1,1)
                    
                    //Min
                    gap_numMin.unshift({MindayGap:0});
                    gap_numMin.splice(gap_numMin.length-1,1)

                    for(let i=0;i<msg.data.project.length;i++){
                        msg.data.project[i].dayGap=gap_num[i].dayGap;
                        msg.data.project[i].MindayGap=gap_numMin[i].MindayGap;
                    }
                    this.projectData=msg.data.project;
                }else{
                    this.$Message.error(msg.data.err_message)
                }
            })
        }
    }
}
</script>
