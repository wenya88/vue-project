<template>
    <div style="height:100%">
        <h4>每日任务统计</h4>
        <div class="taskTip"><span>任务数量：<b>120</b> </span><span>已完成：<b>120</b> </span><span>剩作：<b>0</b> </span><span>待审文件：<b>12</b></span></div>
        <div id="echartLine"></div>
    </div>
</template>
<style>
    .taskTip{position:absolute;margin-top:5px;margin-left:40px;}
    .taskTip span{margin-right:20px;}
    .taskTip span b{color:#ff9900;}
</style>
<script>
  export default{
    mounted(){
       this.autoHeight(); 
       this.myCharts();
    },
    updated(){
    },
    methods:{
      autoHeight(){
          let getH=document.body.clientHeight-200;
          document.getElementById("echartLine").style.height=getH+"px";
      },
      myCharts(){
        var echarts = require('echarts');
        var myChart = echarts.init(document.getElementById('echartLine'));
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255,255,255,1)',
            borderColor: '#d6d6d6',
            borderWidth: 1,
            padding:12,
            textStyle: {
              color: '#000'
            },
            formatter: '时间 ：{b0}<br />{a} : {c}'
          },
          color:['#828282','#18bfa4','#ff9900'],
          legend: {
            x:'right',
            data:[
              {	name:'预计线',
                textStyle:{
                  color:'#333'
                }

              },
              {	name:'实际线',
                textStyle:{
                  color:'#18bfa4'
                }
              },
              {	name:'质量沟通',
                textStyle:{
                  color:'#ff9900'
                }
              }
            ],

          },
          grid: {
            left: '0px',
            right: '30px',
            bottom: '50px',
            top:'30px',
            containLabel: true
          },

          xAxis: {
            type: 'category',
            boundaryGap: false,
            splitLine:{
              show:true,
              lineStyle:{
                color:'#ccc',
                width: 1,
                type:'dotted'
              }
            },
            splitArea: {
              show: true,
              areaStyle: {
                color:['rgba(234,244,237,0.2)']
              }
            },
            axisLine:{
              lineStyle:{
                color:'#18bfa4'
              }
            },
            data: ['2018-3-1','2018-3-2','2018-3-3','2018-3-4','2018-3-5','2018-3-6','2018-3-7','2018-3-8','2018-3-9','2018-3-10','2018-3-11']
          },
          yAxis: {
            type: 'value',
            splitLine:{
              show:true,
              lineStyle:{
                color:'#ccc',
                width: 1,
                type:'dotted',
              }

            },
            axisLine:{
              lineStyle:{
                color:'#18bfa4'
              }
            },
          },
          dataZoom: [{
            height: 30,
            show: true,
            realtime: true,
            start: 10,
            end: 80,
            fillerColor:"rgba(190,221,216,0.8)",

          }],
          series: [
            {
              name:'预计线',
              type:'line',
              data:[100, 90, 80, 70, 60, 50, 40,30,20,10,0],
              itemStyle : {normal:{
                lineStyle:{
                  color:'#828282',
                  type:'dotted'
                },
                borderWidth:4
              }

              }
            },
            {
              name:'实际线',
              type:'line',
              data:[100, 95, 86, 74, 65, 52, 42,32,25,12,0],
              itemStyle : {normal:{
                lineStyle:{
                  color:'#18bfa4',
                  type:'dotted'
                },
                borderWidth:4
              }
              }
            },
            {
              name:'质量沟通',
              type:'line',
              data:[100, 91, 82, 70, 68, 55, 49,39,20,14,0],
              itemStyle : {normal:{
                lineStyle:{
                  color:'#ff9900',
                  type:'dotted'
                },
                borderWidth:4
              }
              }
            },

          ]
        });
      }
    }
  }

</script>

