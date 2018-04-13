<template>
    <div>
        <div id="EPie"></div>
    </div>
</template>
<style>
    #EPie{height:350px;padding-top:10px;}
</style>
<script>
  export default{
    mounted(){
      this.echarts2()
    },
    methods:{
      echarts2(){
        var echarts = require('echarts');
        var echartHours =echarts.init(document.getElementById('EPie'));
        // 绘制图表
        echartHours.setOption({
//        backgroundColor: '#ffffff',
          name: 'a',
          tooltip: {
            trigger: 'axis', //按x轴显示
            show: true,
            axisPointer: {
              lineStyle: {
                color: 'none', //不显示线条
              },
            },
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            textStyle: {
              align: 'left',
              fontSize: 12,
              color: '#333333',
            },
            extraCssText: 'box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2)' //添加阴影
          },
          color: ['#0580f2', '#faa732', '#e1575d'],
          grid: {
            left: '0%',
            right: '0%',
            top: '12%',
            bottom: '10%',
            containLabel: true
          },
          legend: {
            show: true,
            icon: 'circle',
            x: 'center',
            y:'top',
            itemWidth: 10,
            itemHeight: 10,
            data: ['制作进度', '内部审核', '客户审核']
          },
          xAxis: {
            show: true,
            type: 'category',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#eeeeee',
              }
            },
            axisLabel: {
              textStyle: {
                fontSize: 14,
                color: '#999999'
              }
            },
            data: ['3/1', '3/8', '3/15', '3/22', '3/29', '4/6']
          },
          yAxis: {
            show: false,
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#f2f3f7'
              }
            },
            axisLabel: {
              textStyle: {
                fontSize: 12,
                color: '#999999'
              }
            }
          },
          series: [{
            name: '制作进度',
            type: 'line',
            symbol: 'circle',
            itemStyle: {
              emphasis: {
                symbol: 'circle',
              }
            },
            symbolSize: [8, 8],
            data: [1, 0, 1, 4, 10],
//            label: {normal: {
//              show: true
//            }},
          }, {
            name: '内部审核',
            type: 'line',
            symbol: 'circle',
            symbolSize: [8, 8],
            data: [2, 1, 3, 3, 5],
//            label: {normal: {
//              show: true
//            }},
          }, {
            name: '客户审核',
            type: 'line',
            symbol: 'circle',
            symbolSize: [8, 8],
            data: [4, 4, 4, 10, 15],
//            label: {normal: {
//              show: true
//            }},
          },
            {
              type: 'bar',
              barWidth: '1',
              data: [0, 0, 0, 0,20],
              color: '#48b',


            }]
        });

      }
    }
  }
</script>

