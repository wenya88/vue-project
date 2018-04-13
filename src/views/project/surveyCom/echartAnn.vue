<template>
    <div>
        <div id="EAnn"></div>
    </div>
</template>
<style>
    #EAnn{height:350px;padding-top:10px;}
</style>
<script>
  export default{
    mounted(){
      this.echarts2()
    },
    methods:{
      echarts2(){
        var echarts = require('echarts');
        var echartHours =echarts.init(document.getElementById('EAnn'));
        // 绘制图表
        echartHours.setOption({
          color:['#f66bbf','#37a2da','#ffdb5c','#67e0e3','#ff9f7f'],
          tooltip: {
            // trigger: 'item',
            // formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'horizontal',
            x: 'center',
            y:'top',
            icon: 'circle',
            data:['动作','特效','模型'],
            itemWidth: 10,
            itemHeight: 10,
          },
          series: [
            {
              // name:'访问来源',
              type:'pie',
              radius: ['40%', '80%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data:[
                {value:335, name:'动作'},
                {value:310, name:'特效'},
                {value:234, name:'模型'}
              ]
            }
          ]

        });

      }
    }
  }
</script>

