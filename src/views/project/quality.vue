<template>
  <div class="quality">
    <Tabs value="name1" :animated="false">
      <TabPane :label="fristName" name="name1">
        <div class="tab-main">
           <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="8">
              <div class="card" @click="modal1 = true">
                <div class="card-box">
                  <img class="card-box-pic" src="../../images/logo.png" @mouseover="overShow()" @mouseout="outHide()" />
                  <div class="tips" :class="{show:showText,hide:hideText}">
                    <span class="tag">场景</span>宇宙之战杀人之机器人<span class="date">上传：{{param.date}}</span>
                  </div>
                </div>
                <table class="card-table">
                  <tr>
                    <td class="w25">待审天数</td>
                    <td class="w25">完成阶段</td>
                    <td class="w25">剩余时间</td>
                    <td class="w25" rowspan="2">
                      <img class="icon" src="../../images/logo.png"/>
                      张娇颖
                    </td>
                  </tr>
                  <tr class="fb">
                    <td class="w25"><span>5</span>/天</td>
                    <td class="w25"><span>3</span>/5</td>
                    <td class="w25"><span>12</span>/天</td>
                  </tr>
                </table>
              </div>
            </Col>
          </Row>  
        </div>
      </TabPane>
      <TabPane :label="secondName" name="name2">标签二的内容</TabPane>
      <TabPane :label="thirdName" name="name3">标签三的内容</TabPane>
      <TabPane :label="fourthName" name="name4">标签三的内容</TabPane>
    </Tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      param: {
        num: 0,
        num1: 0,
        num2: 0,
        num3: 0,
        date: '2017-1-6 14:16'
      },
      fristName: '',
      secondName: '',
      thirdName: '',
      fourthName: '',
      showText: false,
      hideText: true,
    }
  },
  mounted() {
    this.fristName = '内部待审(' + this.param.num + ')'
    this.secondName = '内审已反馈(' + this.param.num1 + ')'
    this.thirdName = '客户待审(' + this.param.num2 + ')'
    this.fourthName = '客户已反馈(' + this.param.num3 + ')'
  },
  methods: {
    overShow() {
      this.showText = !this.showText
      this.hideText = !this.hideText
    },
    outHide() {
      this.showText = !this.showText
      this.hideText = !this.hideText
    }
  }
}
</script>

<style lang='less'>
@import "./project.less";
</style>