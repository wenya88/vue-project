<template>
   <div class="pjt_all">
     <div class="clearfix pjt_head">
        <p class="pjt_head_msg">项目</p>
        <p class="pjt_head_but iconfont icon-shenglve-"></p>
    </div>
    <div class="pjt_main" id="pjt_bx">
    </div>
   </div>
</template>
<script>
export default {
  props: ['jectList'],
  data () {
    return {
    }
  },
  mounted () {
    // this.$nextTick(() => {
    //    this.getEcharts()
    // })
  },
  watch: {
    jectList: function(e) {
       this.getEcharts()
    }
  },
  methods: {
    // echars
    getEcharts () {
      let echarts = require('echarts');
      const obj = this.jectList
      const datas = [
        {value:obj.doing, name: '实施项目'},
        {value:obj.inside, name: '内部项目'},
        {value:obj.outside, name: '外包项目、子项目'},
        {value:obj.pause,name: '已暂停'}
      ]
      const myCharts = echarts.init(document.getElementById('pjt_bx'))
      myCharts.setOption({
        color: ['#7cbefc', '#fcc44a', '#3bceb6', '#bdbdbd'],
        series: [
          {
            name:'访问来源',
            type:'pie',
            // selectedMode: 'single',
            radius: [0, '30%'],
          },
          {
            name:'访问来源',
            type:'pie',
            radius: ['40%', '55%'],
            label: {
                normal: {
                    formatter: '{c|{c}}{b|个\n{b}}  ',
                    rich: {
                        c: {
                          fontSize: 20
                        },
                        b: {
                            color: '#777777'
                        }
                     }
                }
            },
            data: datas
          }
        ]
      })
    }
  }
}
</script>
<style scoped>
.pjt_all{
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #fdfdfd;
  border-radius: 4px;
 }
 .pjt_head{
 width: 100%;
 height: 30px;
 line-height: 30px;
}
.pjt_head_msg{
  float: left;
  font-size: 16px;
  color: #bdbdbd;
}
.pjt_head_but{
  float: right;
  font-size: 30px;
  color: rgb(210,210,210);
  cursor: pointer;
}
.pjt_main{
  width: 100%;
  height: calc(100% - 30px);
}
.pjc_main_left{
  float: left;
  height: 100%;
}
.pjc_main_right{
  float: right;
  height: 100%;
  margin-right: 100px;
}
.numClass{
   font-size: 40px;
   color: rgb(24,191,164);
   font-weight: 400;
}
.titleClass{
  font-size: 16px;
  color: rgb(206,206,206);
  margin-left: 5px;
}
.pjc_name{
  font-size: 16px;
  /* margin-top: 10px; */
}
.pjc_last_bx{
 margin-top: 20px;
}
</style>
