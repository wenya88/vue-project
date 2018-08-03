<template>
   <div class="tem_all">
     <div class="clearfix tem_head">
        <p class="tem_head_msg">团队</p>
        <p class="tem_head_but">详情&gt;</p>
    </div>
    <div class="tem_main">
      <div>
         <div id="rader"></div>
         <p class="canvas_msg">成员能力分布</p>
      </div>
      <div>
         <div id="free"></div>
         <p class="canvas_msg">成员平均空闲率</p>
       </div>
    </div>
   </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  mounted() {
    this.getRadar()
    this.getFree()
  },
  methods: {
    // 获取雷达图
    getRadar () {
       let echarts = require('echarts');
       var myCharts = echarts.init(document.getElementById('rader'))
       myCharts.setOption({
         tooltip: {
           trigger: 'axis'
         },
         radar: [
           {
              indicator: [
                {text: '次时代', max: 80},
                {text: '图标', max: 80},
                {text: '动作', max: 80},
                {text: 'ul', max: 80},
                {text: '原画', max: 80}
              ],
              center: ['50%','55%'],
              radius: 80
           },
         ],
         series: [
           {
              type: 'radar',
              tooltip: {
                trigger: 'item'
              },
              itemStyle: {
                normal: {
                  color: 'rgb(224,234,207)',
                  areaStyle: {
                    type: 'default'
                  }
                }
              },
              data: [
                {
                  value: [60,73,85,40,80],
                }
              ]
           },
         ]
       })
    },
    // 获取饼图
    getFree () {
       const echarts = require('echarts');
       var myCharts = echarts.init(document.getElementById('free'))
       myCharts.setOption({
         tooltip : {
           trigger: 'item',
           formatter: "{a} <br/>{b} : {c} ({d}%)"
         },
         color:['rgb(213,220,148)', 'rgb(248,225,130)'],
         series : [
           {
              name: '访问来源',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:[
                {value:335, name:'25%'},
                {value:310, name:'75%'},
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
       })
    }
  }
}
</script>
<style scoped>
.tem_all{
  width: 100%;
  height: 100%;
  padding: 20px;
 }
 .tem_head{
 width: 100%;
 height: 60px;
}
.tem_head_msg{
  float: left;
  font-size: 20px;
}
.tem_head_but{
  float: right;
  font-size: 16px;
  color: rgb(210,210,210);
  cursor: pointer;
}
.tem_main{
  width: 100%;
  height: 200px;
  position: relative;
}
.tem_main>div{
  width: 50%;
  height: 100%;
  float: left;
}
.canvas_msg{
  font-size: 16px;
  text-align: center;
}
#rader,
#free{
  width: 100%;
  height: 160px;
  float: left;
  margin-bottom: 10px;
}
</style>
