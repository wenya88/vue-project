<template>
  <div class="sign_all">
    <div class="clearfix sign_head">
        <p class="sign_head_msg">投标</p>
        <p class="sign_head_but">详情&gt;</p>
    </div>
    <div class="sign_main">
      <div class="sign_main_left">
        <div class="sign_left_head">
          <span class="sign_baifen">￥585245.4</span>
          <span class="sign_wan">万</span>
        </div>
        <p class="sign_lefe_alt"><span>去年同比</span><span class="sign_left_title"><i class="iconfont icon-xiangshang01"/>+2%</span></p>
       </div>
       <div class="sign_main_right" id="sign_box">
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
  mounted () {
    this.getEcharts()
  },
  methods: {
    // echarts 数据图
    getEcharts () {
      var echarts = require('echarts');
      const myCharts = echarts.init(document.getElementById('sign_box'))
      myCharts.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          icon:'stack',
          left: 'left',
          data:['邮件营销','联盟广告']
        },
        grid: {
          left: 'left',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            show: false
          },
          data: ['周一/n2018','周二','周三','周四','周五','周六','周日']
        },
        yAxis: {
          type: 'value',
          show: false,
        },
        series: [
          {
            name:'邮件营销',
            type:'line',
            stack: '总量',
            itemStyle:{
              normal: {
                color:'rgb(255,153,0)',
                lineStyle:{
                  type:'dotted'
                }
              }  
            },
            data:[120, 132, 101, 134, 90, 230, 210]
          },
          {
            name:'联盟广告',
            type:'line',
            stack: '总量',
            itemStyle:{
              normal: {
                color:'rgb(49,187,159)',
                lineStyle:{
                  type:'dotted'
                }
              }
            },
            data:[220, 182, 191, 234, 290, 330, 310]
          }
        ]
      })
    }
  }
}
</script>
<style scoped>
 .sign_all{
  width: 100%;
  height: 100%;
  padding: 20px;
 }
.sign_head{
 width: 100%;
 height: 60px;
}
.sign_head_msg{
  float: left;
  font-size: 20px;
}
.sign_head_but{
  float: right;
  font-size: 16px;
  color: rgb(210,210,210);
  cursor: pointer;
}
.sign_main{
  width: 100%;
  height: calc(100% - 60px);
}
.sign_main_left{
 float: left;
}
.sign_main_right{
  float: right;
  height: 100%;
  width: 700px;
}
.sign_lefe_alt{
  font-size: 16px;
}
.sign_left_head{
  height: 120px;
}
.sign_baifen{
  font-size: 26px;
  color: rgb(24,191,164);
  font-weight: bold;
}
.sign_left_title{
  color: rgb(255,51,0);
  margin-left: 10px;
}
.sign_wan{
  font-size: 16px;
  color: rgb(215,215,215);
  margin-left: 5px;
}
</style>

