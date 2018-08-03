<template>
  <div class="sign_all">
    <div class="clearfix sign_head">
        <p class="sign_head_msg">合同</p>
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
       <ul class="year_bx">
         <li v-for="(item, index) in yearList" :key="index">
           <p @click="getYear(index)" :class="item.backClass">{{item.year}}</p>
         </li>
       </ul>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      yearList: [
        {year: 2018, backClass: 'yearClass'},
        {year: 2017, backClass: ''},
        {year: 2016, backClass: ''}
      ],
      yearName: 0
    }
  },
  mounted () {
    this.getYear(0)
  },
  methods: {
    // 获取数据
    getYear (index) {
      const list = this.yearList
      list.forEach((item, idx) => {
        if (index === idx) {
          item.backClass =  'yearClass'
        } else {
          item.backClass =  ''
        }
      })
      this.yearName = list[index].year
      this.getEcharts()
    },
    // echarts 数据图
    getEcharts () {
      let echarts = require('echarts');
      const myCharts = echarts.init(document.getElementById('sign_box'))
      const yearName = this.yearName
      const bidNum = [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90] // 合同数量
      const bidMeng = [220, 182, 191, 234, 290, 330, 310,191, 234, 290, 330, 310 ] // 合同金额
      let textMsg = function (parames) {
        const  tempStr = parames + "\n" + yearName;
        return tempStr
          console.log('数据', parames)
      }
      myCharts.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          icon:'stack',
          left: 'left',
          data:['合同数量','合同金额']
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
          axisLabel: {
            formatter: textMsg
          },
          data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        },
        yAxis: {
          type: 'value',
          show: false,
        },
        series: [
          {
            name:'合同数量',
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
            data:bidNum
          },
          {
            name:'合同金额',
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
            data:bidMeng
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
  position: relative;
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
  font-size: 40px;
  color: rgb(24,191,164);
  font-weight: 400;
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
.year_bx{
  position: absolute;
  right: 20px;
  top: 10px;
}
.year_bx>li{
  float: left;
  margin-right: 10px;
  font-size: 16px;
  cursor: pointer;
  color: rgb(210,210,210);
}
.yearClass{
  color: rgb(24,191,164);
}
</style>

