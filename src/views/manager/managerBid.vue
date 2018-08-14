<template>
   <div class="bid_all">
      <div class="clearfix bid_head">
         <p class="bid_head_msg">投标</p>
         <p class="bid_head_but iconfont icon-shenglve-"></p>
      </div>
       <!-- bid main -->
      <div class="bid_main">
         <div class="bid_main_top">
           <i-circle
            :size="140"
            :trail-width="8"
            :stroke-width="8"
            :percent="bidList.win_rate"
            stroke-linecap="square"
            trail-color="#fcf0d4"
            stroke-color="#fcc44a">
            <div class="demo-Circle-custom">
              <p class="bid_fen"><span class="bid_number">{{bidList.win_rate}}</span>%</p>
              <p class="bid_zhong">中标率</p>
              <p class="bid_left_title">
                 <span class="iconfont icon-xiangshang01"></span>
                 <span>+{{bidList.add}}%</span>
               </p>
            </div>
           </i-circle>
        </div>
        <div class="bid_main_bottom">
           <div class="bid_bottom_bx">
              <p class="bid_sign">{{bidList.total}}</p>
              <p class="brief">已报名</p>
           </div>
            <div class="bid_bottom_bx bid_bx_center">
              <p class="bid_hand">{{bidList.file}}</p>
              <p class="brief">已交稿</p>
           </div>
            <div class="bid_bottom_bx">
              <p class="bid_hit">{{bidList.win_bid}}</p>
              <p class="brief">已中标</p>
           </div>
        </div>
      </div>
   </div>
</template>
<script>
export default {
  props:['bidList'],
  data () {
    return {  
    }
  }
}
</script>
<style lang='less'>
.bid_all{
 width: 100%;
 height: 100%;
 padding: 20px;
 border-radius: 4px;
 background: #fdfdfd;
}
.bid_head{
 width: 100%;
 height: 30px;
 line-height: 30px;
}
.bid_head_msg{
  float: left;
  font-size: 16px;
  color: #bdbdbd;
}
.bid_head_but{
  float: right;
  font-size: 30px!important;
  color: rgb(210,210,210);
  cursor: pointer;
}
.bid_main{
  width: 100%;
  @wo: 30px;
  height: calc(~"100% - @{wo}");
  &_top{
    width: 100%;
    @widths: 60px;
    height: calc(~"100% - @{widths}");
    display: flex;
    justify-content: center;
    align-items: center;
    .demo-Circle-custom{
      & .bid_fen{
        font-size: 12px;
        color: #bdbdbd;
      }
      .bid_number {
        font-size: 20px;
        color: #fcc44a;
      }
      .bid_zhong {
        font-size: 12px;
        margin: 5px 0;
        color: #bdbdbd;
      }
    }
  }
  &_bottom{
   width: 100%;
   height: 60px;
   display: flex;
   justify-content: center;
   align-items: center;
   .bid_bx_center{
     margin: 0px 100px;
   }
   .bid_bottom_bx{
     height: 100%;
     .bid_sign,.bid_hand,.bid_hit{
       font-size: 20px;
       text-align: center;
     }
     .bid_sign{
       color: #fcc44a;
     }
     .bid_hand{
        color: #7cbefc;
     }
     .bid_hit{
        color: #ff898e;
     }
     .brief{
       color: #777777;
       font-size: 12px;
       text-align: center;
     }
   }
  }
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
  font-size: 40px;
  color: rgb(24,191,164);
  font-weight: 400;
}
.bid_right_msg{
  font-size: 40px;
  color: rgb(206,206,206);
  font-weight: 400;
}
.bid_left_title{
 color: rgb(255,51,0);
}
.bid_left_title>span:last-child{
  font-size: 14px;
}
</style>
