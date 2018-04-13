<template>
    <div>
        <h4>全任务状态分布</h4>
        <div id="echartState"></div>
    </div>
</template>
<style>
    #echartState{height:400px;margin-top:20px;}
</style>
<script>
  export default{
    mounted(){
      this.myCharts()
    },
    methods:{
      myCharts(){
        var echarts = require('echarts');
        var myChart = echarts.init(document.getElementById('echartState'));
        var app = {};
        var posList = [
          'left', 'right', 'top', 'bottom',
          'inside',
          'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
          'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
        ];

        app.configParameters = {
          rotate: {
            min: -90,
            max: 90
          },
          align: {
            options: {
              left: 'left',
              center: 'center',
              right: 'right'
            }
          },
          verticalAlign: {
            options: {
              top: 'top',
              middle: 'middle',
              bottom: 'bottom'
            }
          },
          position: {
            options: echarts.util.reduce(posList, function (map, pos) {
              map[pos] = pos;
              return map;
            }, {})
          },
          distance: {
            min: 0,
            max: 100
          }
        };

        app.config = {
          rotate: 90,
          align: 'left',
          verticalAlign: 'middle',
          position: 'insideBottom',
          distance: 15,
          onChange: function () {
            var labelOption = {
              normal: {
                rotate: app.config.rotate,
                align: app.config.align,
                verticalAlign: app.config.verticalAlign,
                position: app.config.position,
                distance: app.config.distance
              }
            };
            myChart.setOption({
              series: [{
                label: labelOption
              }, {
                label: labelOption
              }, {
                label: labelOption
              }, {
                label: labelOption
              }]
            });
          }
        };


        var labelOption = {
          normal: {
            show: true,
            position: app.config.position,
            distance: app.config.distance,
            align: app.config.align,
            verticalAlign: app.config.verticalAlign,
            rotate: app.config.rotate,
            formatter: '{c}  {name|{a}}',
            rich: {
              name: {
//		                textBorderColor: '#000',
                color: '#333'
              }
            },
            textStyle : {          // 直线指示器样式设置
              color: '#333',
              fontSize:12
            },
          }
        };

        myChart.setOption({

          color: ['#99cccc', '#f4e5ce', '#ffcccc'],
          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'shadow'
            },
//		        formatter: '{b0}<br />{a} : {c}'
          },
          legend: {
            data: ['原画', '3D原型', 'UI']
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              mark: {show: false},
              dataView: {show: false, readOnly: false},
              magicType: {show: false, type: ['line', 'bar', 'stack', 'tiled']},
              restore: {show: false},
              saveAsImage: {show: false}
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              axisTick: {show: false},
              data: ['等待开始', '进行中', '已完成', '暂时'],
            }
          ],
          yAxis: [
            {
              type: 'value',

            }
          ],
          dataZoom: [{
            show: true,
            realtime: true,
            start: 10,
            end: 90,
            fillerColor:"rgba(190,221,216,0.8)",
            height: 20
          }],
          series: [
            {
              name: '原画',
              type: 'bar',
              barGap: 0,
              label: labelOption,
              data: [10, 332, 301, 334],

            },
            {
              name: '3D原型',
              type: 'bar',
              label: labelOption,
              data: [220, 182, 191, 234]
            },
            {
              name: 'UI',
              type: 'bar',
              label: labelOption,
              data: [150, 232, 201, 154]
            }
          ]

        })
        if (option && typeof option === "object") {
          myChart.setOption(option, true);
        }
      }
    }
  }

</script>

