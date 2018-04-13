<template>
    <div>
        <h4>成员任务统计</h4>
        <div id="echartTask"></div>
    </div>
</template>
<style>
    #echartTask{height:400px;margin-top:20px;}
</style>
<script>
  export default{
    mounted(){
      this.myCharts()
    },
    methods:{
      myCharts(){
        var echarts = require('echarts');
        var myChart = echarts.init(document.getElementById('echartTask'));
        // 绘制图表
        myChart.setOption({

          color:['#37a2da','#67e0e3','#ffdb5c','#a768b9','#ff9f7f','#fb7293','#e7bcf3','#8378ea','#96bfff','#37a2da'],
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data:['UI','原型','动作','杨二车娜母','范海星','杨二郎','李寺寺','陈K歌','周星星','薛一般']
          },
          series: [
            {
              name:'访问来源',
              type:'pie',
              selectedMode: 'single',
              radius: [0, '30%'],

              label: {
                normal: {
                  position: 'inner'
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data:[
                {value:335, name:'UI', selected:true},
                {value:679, name:'原型'},
                {value:1548, name:'动作'}
              ]
            },
            {
              name:'统计',
              type:'pie',
              radius: ['40%', '55%'],
              label: {
                normal: {
                  formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                  backgroundColor: '#eee',
                  borderColor: '#aaa',
                  borderWidth: 1,
                  borderRadius: 4,
                  // shadowBlur:3,
                  // shadowOffsetX: 2,
                  // shadowOffsetY: 2,
                  // shadowColor: '#999',
                  // padding: [0, 7],
                  rich: {
                    a: {
                      color: '#999',
                      lineHeight: 22,
                      align: 'center'
                    },
                    // abg: {
                    //     backgroundColor: '#333',
                    //     width: '100%',
                    //     align: 'right',
                    //     height: 22,
                    //     borderRadius: [4, 4, 0, 0]
                    // },
                    hr: {
                      borderColor: '#aaa',
                      width: '100%',
                      borderWidth: 0.5,
                      height: 0
                    },
                    b: {
                      fontSize: 16,
                      lineHeight: 33
                    },
                    per: {
                      color: '#eee',
                      backgroundColor: '#334455',
                      padding: [2, 4],
                      borderRadius: 2
                    }
                  }
                }
              },
              data:[
                {value:335, name:'杨二车娜母'},
                {value:310, name:'范海星'},
                {value:234, name:'杨二郎'},
                {value:135, name:'李寺寺'},
                {value:1048, name:'陈K歌'},
                {value:251, name:'周星星'},
                {value:147, name:'薛一般'}
              ]
            }
          ]

        });
      }
    }
  }

</script>

