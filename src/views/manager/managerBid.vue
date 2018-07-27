<template>
   <div class="bid_all">
      <div class="clearfix bid_head">
         <p class="bid_head_msg">投标</p>
         <p class="bid_head_but">详情&gt;</p>
      </div>
       <!-- bid main -->
      <div class="bid_main">
         <div class="bid_main_left">
            <div class="bid_left_head">
               <p class="bid_baifen">30%</p>
               <p class="bid_left_title">
                 <span class="iconfont icon-xiangshang01"></span>
                 <span>+2%</span>
               </p>
            </div>
            <p class="bid_lefe_alt">中标率</p>
         </div>
         <!-- bid main right -->
         <div class="bid_main_right">
             <div>
                <div class="bid_right_head">
                   <p class="bid_right_msg">200</p>
                </div>
                <p class="bid_lefe_alt">已报名</p>
             </div>
             <div>
                <div class="bid_right_head">
                   <p class="bid_right_msg">85</p>
                </div>
                <p class="bid_lefe_alt">已交稿</p>
             </div>
             <div>
                <div class="bid_right_head">
                   <p class="bid_right_msg">17</p>
                </div>
                <p class="bid_lefe_alt">已中标</p>
             </div>
         </div>
      </div>
   </div>
</template>
<script>
export default {
  data () {
    return {  
    }
  }
}
</script>
<style scoped>
.bid_all{
 width: 100%;
 height: 100%;
 padding: 20px;
}
.bid_head{
 width: 100%;
 height: 60px;
}
.bid_head_msg{
  float: left;
  font-size: 20px;
}
.bid_head_but{
  float: right;
  font-size: 16px;
  color: rgb(210,210,210);
  cursor: pointer;
}
.bid_main{
  width: 100%;
  height: calc(100% - 60px);
}
.bid_main_left{
 float: left;
}
.bid_main_right{
  float: right;
}
.bid_lefe_alt{
  font-size: 16px;
}
.bid_left_head,
.bid_right_head{
  height: 120px;
}
.bid_main_right>div{
 float: left;
 width: 100px;
 text-align: center;
 margin-right: 30px;
}
.bid_baifen{
  font-size: 26px;
  color: rgb(24,191,164);
  font-weight: bold;
}
.bid_right_msg{
  font-size: 26px;
  color: rgb(206,206,206);
  font-weight: bold;
}
.bid_left_title{
 color: rgb(255,51,0);
}
.bid_left_title>span:last-child{
  font-size: 14px;
}
</style>
