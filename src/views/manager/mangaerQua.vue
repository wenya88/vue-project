<template>
   <div class="qua_all">
     <div class="clearfix qua_head">
        <p class="qua_head_msg">质量</p>
        <p class="qua_head_but  iconfont icon-shenglve-"></p>
    </div>
    <div class="qua_main">
       <div class="qua_main_sicle">
          <i-circle
            :size="120"
            :trail-width="8"
            :stroke-width="8"
            :percent="quaList.average"
            stroke-linecap="square"
            trail-color="#fcf0d4"
            stroke-color="#fcc44a">
            <div class="demo-Circle-custom">
              <p><span class="quaScore">{{quaList.average}}</span><span class="scoreTitle">分</span></p>
              <Rate disabled  allow-half v-model="quaList.average" class="qua_rate" />
            </div>
          </i-circle>
         <p class="qua_task_color"></p>
         <p class="qua_task_fen">任务平均分值</p>
       </div>
        <div class="qua_main_sicle">
          <i-circle
            :size="120"
            :trail-width="8"
            :stroke-width="8"
            :percent="quaList.average"
            stroke-linecap="square"
            trail-color="#cef2ec"
            stroke-color="#3bceb6">
            <div class="demo-Circle-custom">
              <p class="inside_num">{{quaList.inside_pass}}<span class="scoreTitle">%</span></p>
              <p class="bottom_title_style">平均修改{{quaList.inside_average}}次</p>
            </div>
          </i-circle>
         <p class="qua_inside_color"></p>
         <p class="qua_task_fen">内部通过率</p>
       </div>
        <div class="qua_main_sicle">
          <i-circle
            :size="120"
            :trail-width="8"
            :stroke-width="8"
            :percent="quaList.average"
            stroke-linecap="square"
            trail-color="#e1f0fd"
            stroke-color="#7cbefc">
            <div class="demo-Circle-custom">
               <p class="custom_num">{{quaList.outside_pass}}<span class="scoreTitle">%</span></p>
               <p class="bottom_title_style">平均修改{{quaList.outside_average}}次</p>
            </div>
          </i-circle>
         <p class="qua_customer_color"></p>
         <p class="qua_task_fen">客户通过率</p>
       </div>
       <!-- <div class="qua_main_left">
          <div class="qua_left_radius">
             <p><span class="quaScore">{{quaList.average}}</span><span class="scoreTitle">分</span></p>
             <Rate disabled  allow-half v-model="quaList.average" />
          </div>
          <div class="qua_left_msg">
             <p class="qua_msg_score">任务平均分值</p>
          </div>
       </div>
       <div class="qua_main_position">
          <div>
             <p class="qua_poition_msg">平均修改{{quaList.inside_average}}次</p>
             <p class="qua_poition_score">{{quaList.inside_pass}}</p>
          </div>
           <div class="qua_poistion_title">
             <p class="qua_msg_score">内部通过率</p>
          </div>
       </div>
       <div class="qua_main_right">
           <div>
             <p class="qua_poition_msg">平均修改{{quaList.outside_average}}次</p>
             <p class="qua_poition_score">{{quaList.outside_pass}}</p>
          </div>
           <div class="qua_poistion_title">
             <p class="qua_msg_score">客户通过率</p>
          </div>
       </div> -->
    </div>
   </div>
</template>
<script>
export default {
  props: ['quaList'],
  data () {
    return {
     valueHalf: 4.5
    }
  }
}
</script>
<style scoped>
.qua_all{
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #fdfdfd;
  border-radius: 4px;
 }
 .qua_head{
 width: 100%;
 height: 30px;
 line-height: 30px;
}
.qua_head_msg{
  float: left;
  font-size: 16px;
  color: #bdbdbd;
}
.qua_head_but{
  float: right;
  font-size: 30px;
  color: rgb(210,210,210);
  cursor: pointer;
}
.custom_num{
  font-size: 20px;
  color: #7cbefc;
}
.inside_num{
  font-size: 20px;
  color: #3bceb6;
}
.bottom_title_style{
  color: #bdbdbd;
  font-size: 12px;
  margin-top: 5px;
}
.qua_main{
  width: 100%;
  height: calc(100% - 30px);
  /* position: relative; */
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.qua_main_sicle{
  width: 120px;
}
.qua_task_color{
 width: 80px;
 height: 5px;
 margin: 30px auto;
 background: -webkit-linear-gradient(left, #ffffff , #fcf0d4, #ffffff); /* Safari 5.1 - 6.0 */
 background: -o-linear-gradient(left, #ffffff, #fcf0d4, #ffffff); /* Opera 11.1 - 12.0 */
 background: -moz-linear-gradient(left, #ffffff, #fcf0d4, #ffffff); /* Firefox 3.6 - 15 */
 background: linear-gradient(to left, #ffffff, #fcf0d4, #ffffff); /* 标准的语法 */
}
.qua_inside_color{
 width: 80px;
 height: 5px;
 margin: 30px auto;
 background: -webkit-linear-gradient(left, #ffffff , #cef2ec, #ffffff); /* Safari 5.1 - 6.0 */
 background: -o-linear-gradient(left, #ffffff, #cef2ec, #ffffff); /* Opera 11.1 - 12.0 */
 background: -moz-linear-gradient(left, #ffffff, #cef2ec, #ffffff); /* Firefox 3.6 - 15 */
 background: linear-gradient(to left, #ffffff, #cef2ec, #ffffff); /* 标准的语法 */
}
.qua_customer_color{
  width: 80px;
  height: 5px;
  margin: 30px auto;
  background: -webkit-linear-gradient(left, #ffffff , #e1f0fd, #ffffff); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(left, #ffffff, #e1f0fd, #ffffff); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(left, #ffffff, #e1f0fd, #ffffff); /* Firefox 3.6 - 15 */
  background: linear-gradient(to left, #ffffff, #e1f0fd, #ffffff); /* 标准的语法 */
}
.qua_task_fen{
  text-align: center;
  font-size: 12px;
}
.qua_main_left{
  float: left;
  height: 100%;
  text-align: center;
}
.qua_main_right{
  float: right;
  height: 100%;
  margin-right: 10px;
  text-align: center;
}
.qua_main_position{
  width: 100px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.qua_left_radius{
  width: 120px;
  height: 120px;
  border-radius: 50%;
  padding-top: 20px;
  text-align: center;
  background: rgb(223,246,243);
}
.quaScore{
  font-size: 20px;
  color: #fcc44a;
  font-weight: 400;
  margin-bottom: 10px;
}
.scoreTitle{
  font-size: 12px;
  color: #bdbdbd;
  margin-left: 5px;   
}
.ivu-rate{
 font-size: 12px!important;
}
.qua_left_msg{
  margin-top: 50px;
}
.qua_msg_score{
 font-size: 16px;
 text-align: center;
}
.qua_poition_msg{
  width: 100px;
  height: 30px;
  font-size: 14px;
  border-radius: 4px;
  text-align: center;
  line-height: 30px;
  margin-top: 20px;
  color: rgb(188,188,188);
  background: rgb(235,235,235);
}
.qua_poition_score{
  font-size: 40px;
  color: rgb(174,174,174);
  text-align: center;
}
.qua_poistion_title{
  margin-top: 60px;
}
.qua_rate{
  margin-top: 5px;
}
</style>
<style>
 .qua_rate .ivu-rate-star{
  margin-right: 1px!important
}
</style>

