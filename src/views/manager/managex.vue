<template>
   <div class="incomes">
      <p class="incomes_head">支出</p>
      <Row class="incomes_row">
        <Col span="12" class="incomes_row_dashad">
          <div class="clearfix incomes_row_children">
            <img src="../../images/manager_three.png" class="incomes_row_img"/>
            <div class="incomes_row_box">
              <p class="incomes_row_nume">￥<span class="incomes_numdd">{{data.pay}}</span></p>
              <P class="incomes_row_title">已支付</p>
            </div>
          </div>
        </Col>
        <Col span="12" class="incomes_row_right">
          <div class="clearfix incomes_row_children">
            <img src="../../images/manager_two.png" class="incomes_row_img"/>
            <div class="incomes_row_box">
              <p class="incomes_row_numx">￥<span class="incomes_numdd">{{data.wait_pay}}</span></p>
              <P class="incomes_row_title">未支付</p>
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
.incomes{
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
//    @widths: 30px;
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
  &_nume{
    font-size: 12px;
    color: #fcc44a;
  }
  &_numx{
    font-size: 12px;
    color: #ff898e;
  }
  .incomes_numdd{
    font-size: 20px;
  }
  &_title{
    font-size: 12px;
    text-align: center;
  }
 }
}
</style>
