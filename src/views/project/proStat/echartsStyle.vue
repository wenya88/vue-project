<template>
    <div>
        <h4>任务工时统计</h4>
        <div id="echartStyle"></div>
    </div>
</template>
<style>
    #echartStyle{height:400px;margin-top:20px;}
</style>
<script>
  export default{
    mounted(){
      this.myCharts()
    },
    methods:{
      myCharts(){
        var echarts = require('echarts');
        var myChart = echarts.init(document.getElementById('echartStyle'));
        // 绘制图表
        myChart.setOption({
          color:['#37a2da',"#67e0e3","#ffdb5c","#ff9f7f","#e062ae"],
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series : [
            {
              name: '访问来源',
              type: 'pie',
              radius : '66%',
              center: ['50%', '60%'],
              data:[
                {value:35, name:'李大胖'},
                {value:310, name:'张二小'},
                {value:234, name:'赵四小姐'},
                {value:135, name:'张子强'},
                {value:1548, name:'赛金花'}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
      }
    }
  }

</script>

