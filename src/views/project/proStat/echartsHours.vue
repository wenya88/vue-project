<template>
    <div>
        <h4>成员工时统计</h4>
        <div id="EHours"></div>
    </div>
</template>
<style>
    #EHours{height:400px;}
</style>
<script>

  // 基于准备好的dom，初始化echarts实例
    export default{
      mounted(){
        this.echarts2()
      },
      methods:{
        echarts2(){
          var echarts = require('echarts');
          var echartHours =echarts.init(document.getElementById('EHours'));
          // 绘制图表
          echartHours.setOption({
            tooltip: {
              trigger: 'axis',
              backgroundColor: 'rgba(255,255,255,1)',
              borderColor: '#d6d6d6',
              borderWidth: 1,
              padding:12,
              textStyle: {
                color: '#000'
              },
            },
            color:['#d7d7d7','#00cc00'],
            xAxis: {
              data: ['李小小', '李大大', '张小风', '张小风','李大大','李小小'],
              axisTick: {show: false},
            },
            legend: {
              data: ['预定工时', '已用工时']
            },
            yAxis: {
              splitLine: {show: false}
            },
            animationDurationUpdate: 100,
            dataZoom: [{
              show: true,
              realtime: true,
              start: 0,
              end: 90,
              fillerColor:"rgba(190,221,216,0.8)",
              height: 20
            }],

            series: [

              {
                name:'预定工时',
                type: 'bar',
                silent: true,
                barWidth: 40,
                barGap: '-100%',
                data: [70, 60, 60, 60,60,70]
              },
              {
                name:'已用工时',
                type: 'bar',
                barWidth: 40,
                z: 10,
                data: [35, 60, 13, 25,52,56],
                label: {
                  normal: {
                    show: true,
                    position: 'top',
                    textStyle: {
                      color: 'black'
                    }
                  }
                }
              }
            ],
          });

        }
      }
    }
</script>

