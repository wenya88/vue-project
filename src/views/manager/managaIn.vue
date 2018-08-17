<template>
   <div class="income">
      <p class="income_head">收入</p>
      <Row class="income_row">
        <Col span="12" class="income_row_dashad">
          <div class="clearfix income_row_children">
            <img src="../../images/managaer_one.png" class="income_row_img"/>
            <div class="income_row_box">
              <p class="income_row_num">￥<span class="income_num">{{data.income}}</span></p>
              <P class="income_row_title">已收款</p>
            </div>
          </div>
        </Col>
        <Col span="12" class="income_row_right">
          <div class="clearfix income_row_children">
            <img src="../../images/manager_four.png" class="income_row_img"/>
            <div class="income_row_box">
              <p class="income_row_nums">￥<span class="income_num">{{data.wait_income}}</span></p>
              <P class="income_row_title">未收款</p>
            </div>
          </div>
        </Col>
      </Row>
   </div>
</template>
<script>
export default {
  props:['data'],
  data () {
    return {
    }
  }
}
</script>
<style lang="less">
.income{
 width: 100%;
 height: 100%;
 border-radius: 4px;
 padding: 0px 20px;
 background: #fdfdfd;
 &_head{
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: #bdbdbd;
 }
 &_row{
   height: 80px!important;
   padding-bottom: 20px;
   &_dashad{
    height: 100%;
    border-right: 1px dashed rgb(224,224,224);
   }
   &_right{
    height: 100%;
   }
   &_children {
     height: 100%;
     display: flex;
     justify-content: center;
     align-items:flex-end;
   }
  &_img{
    float: left;
    height: 50px;
    width: 50px;
  }
  &_box{
    float: left;
    margin-left: 10px;
  }
  &_num{
    font-size: 12px;
    color: #3bceb6;
  }
  &_nums{
    font-size: 12px;
    color: #7cbefc;
  }
  .income_num{
   font-size: 20px;
  }
  &_title{
    font-size: 12px;
    text-align: center;
  }
 }
}
</style>
