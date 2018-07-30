<template>
   <div class="manager_page_all">
      <div class="clearfix manager_page_header">
         <div class="manager_head_left">
            <p class="scope_overview">经营概览</p>
         </div>
         <div class="clearfix manager_head_right">
            <div class="mag-5 mangaer_rve">
               <div class="mangaer_box_rve">
                  <p class="income_msg">收入</p>
                  <div class="clearfix income_msg_details">
                    <p class="receivables">
                     <span>已收款：</span>
                     <span>￥198455</span>
                    </p>
                    <p class="payment">
                      <span>未付款：</span>
                      <span>￥6456465</span>
                    </p>
                  </div>
               </div>
            </div>
            <div class="mag-5 mangaer_rvs">
               <div class="mangaer_box_rves">
                  <p class="income_msg">支付</p>
                  <div class="clearfix income_msg_details">
                    <p class="receivables">
                     <span>已支付：</span>
                     <span>￥198455</span>
                    </p>
                    <p class="payment">
                      <span>未支付：</span>
                      <span>￥6456465</span>
                    </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <!-- main -->
      <div class="clearfix mangaer_main">
        <Row>
        <!-- 投标 -->
        <Col class="mangaer_main_bid" span="8">
           <mangaer-bid></mangaer-bid>
        </Col>
        <!-- 签单 -->
        <Col class="mangaer_main_Sign" span="16">
           <div class="mangaer_Sign_children">
             <mangaer-sign></mangaer-sign>
           </div>
        </Col>
        <!-- 项目 -->
        <Col class="mangaer_main_project" span="8">

        </Col>
         <!-- 质量 -->
        <Col class="mangaer_main_quality" span="8">
           <div class="mangaer_quality_children">

           </div>
        </Col>
         <!-- 团队 -->
        <Col class="mangaer_main_team" span="8">
            <div class="mangaer_team_children">

           </div>
        </Col>
        </Row>
      </div>
   </div>
</template>
<script>
import mangaerBid from './managerBid.vue'
import mangaerSign from './mangaerSign.vue'
export default {
  data () {
    return {      
    }
  },
  components: {
    mangaerBid,
    mangaerSign
  },
}
</script>
<style scoped>
.manager_page_all{
  width: 100%;
  min-height: 100%;
  padding: 20px;
}
.manager_page_header{
  width: 100%;
  height: 120px;
  padding: 10px 20px;
  background: rgb(240,240,240);
}
.mag-1{
 width: 10%;
 float: left;
}
.mag-2{
 width: 20%;
 float: left;
}
.mag-3{
 width: 30%;
 float: left;
}
.mag-4{
 width: 40%;
 float: left;
}
.mag-5{
 width: 50%;
 float: left;
}
.mag-6{
 width: 60%;
 float: left;
}
.mag-7{
 width: 70%;
 float: left;
}
.mag-8{
 width: 80%;
 float: left;
}
.mag-9{
 width: 90%;
 float: left;
}
.mag-10{
 width: 100%;
 float: left;
}
.manager_head_left{
  width: 200px;
  padding-top: 10px;
  float: left;
}
.manager_head_right{
  width: calc(100% - 200px);
  float: left;
}
.manager_head_right>div{
  height: 100%;
}
.manager_page_header>div{
  height: 100%;
}
.mangaer_rve,
.mangaer_rvs{
  border-left: 1px solid rgb(210,210,210);
}
.scope_overview{
  font-size: 20px;
  letter-spacing: 5px;
}
.mangaer_box_rve,
.mangaer_box_rves{
  width: 80%;
  height: 100%;
  margin: auto;
  padding-top: 10px;
  /* background: red; */
}
.income_msg{
 font-size: 20px;
}
.income_msg_details{
 width: 100%;
 margin-top: 20px;
}
.receivables{
  float: left;
}
.receivables>span:first-child,
.payment>span:first-child{
  font-size: 16px;
}
.receivables>span:last-child,
.payment>span:last-child{
  font-size: 20px;
  Color: rgb(24,191,164);
  font-weight: bold;
}
.payment{
  float: right;
}
.mangaer_main{
 width: 100%;
 padding-top: 30px;
}
.mangaer_main_bid{
  height: 300px;
  background: rgb(240,240,240);
}
.mangaer_Sign_children{
  width: 100%;
  height: 100%;
  background: rgb(240,240,240);
}
.mangaer_main_Sign{
  height: 300px;
  padding-left: 10px;
}
.mangaer_main_project,
.mangaer_main_quality,
.mangaer_main_team{
  /* width: 33.333333%; */
  height: 300px;
  margin-top: 20px;
  /* float: left; */
}
.mangaer_main_quality,
.mangaer_main_team{
  padding-left: 10px;
}
.mangaer_quality_children{
  width: 100%;
  height: 100%;
}
.mangaer_team_children{
  width: 100%;
  height: 100%;
}
</style>


