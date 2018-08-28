<template>
    <div :id="biddingColor.echartID" class="echartLine"></div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    props:{
        biddingColor:{
            type:Object
        }
    },
    mounted(){
        this.myCharts(this.biddingColor.Cstart,this.biddingColor.Cend,this.biddingColor.Cline,this.biddingColor.echartID);
    },
    methods:{
        myCharts(Cstart,Cend,Cline,echartID){
            let echarts = require('echarts');
            let myChart = echarts.init(document.getElementById(echartID));
            // 绘制图表
            myChart.setOption({
                // echartStart
                tooltip: {
                    trigger: 'axis',
                   // backgroundColor: 'rgba(92,201,173,0.8)'  // 工具提示背景
                },
                grid: {
                    left: '2%',
                    right: '1%',
                    bottom: '2%',
                    top:'5%',
                    containLabel: true
                },
                toolbox: {},
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['一月','二月','三月','四月','五月','六月','七月'],
                    axisLabel: {
                        inside: false,
                        textStyle: {
                            color: '#9f9f9f',
                            padding:[5,10,0,0]
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                },
                yAxis: {
                    type: 'value',
                    splitLine:{
                        show:true,
                        lineStyle:{
                                color:'#eef1f2',
                                width: 1,
                            }
                    },
                    axisLabel: {
                        inside: false,
                        textStyle: { // Y轴文字颜色,距离
                            color: '#9f9f9f',
                            padding:[0,10,0,0]
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    splitNumber:3 // Y轴刻度值
                },
                series: [
                    {
                        name:'中标率',
                        type:'line',
                        stack: '总量',
                        data:[120, 132, 101, 134, 90, 230, 210],
                        color:Cline, // 折线颜色
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: Cstart // 渐变开始颜色
                                }, {
                                    offset: 1,
                                    color: Cend // 渐变结束颜色
                                }])
                            }
                        },
                    },
                ]
                // echartEnd
            })
        }
    }
}
</script>
<style>
    .echartLine{
        height:200px;
    }
</style>

