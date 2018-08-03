<template>
   <div class="qua_all">
     <div class="clearfix qua_head">
        <p class="qua_head_msg">质量</p>
        <p class="qua_head_but">详情&gt;</p>
    </div>
    <div class="qua_main">
       <div class="qua_main_left">
          <div class="qua_left_radius">
             <p><span class="quaScore">{{valueHalf}}</span><span class="scoreTitle">分</span></p>
             <Rate disabled  allow-half v-model="valueHalf" />
          </div>
          <div class="qua_left_msg">
             <p class="qua_msg_score">任务平均分值</p>
          </div>
       </div>
       <div class="qua_main_position">
          <div>
             <p class="qua_poition_msg">平均修改3次</p>
             <p class="qua_poition_score">25%</p>
          </div>
           <div class="qua_poistion_title">
             <p class="qua_msg_score">内部通过率</p>
          </div>
       </div>
       <div class="qua_main_right">
           <div>
             <p class="qua_poition_msg">平均修改2次</p>
             <p class="qua_poition_score">72%</p>
          </div>
           <div class="qua_poistion_title">
             <p class="qua_msg_score">客户通过率</p>
          </div>
       </div>
    </div>
   </div>
</template>
<script>
export default {
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
 }
 .qua_head{
 width: 100%;
 height: 60px;
}
.qua_head_msg{
  float: left;
  font-size: 20px;
}
.qua_head_but{
  float: right;
  font-size: 16px;
  color: rgb(210,210,210);
  cursor: pointer;
}
.qua_main{
  width: 100%;
  height: 200px;
  position: relative;
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
  font-size: 40px;
  color: rgb(24,191,164);
  font-weight: 400;
}
.scoreTitle{
  font-size: 16px;
  color: rgb(206,206,206);
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
</style>
<style>
 .qua_left_radius .ivu-rate-star{
  margin-right: 1px!important
}
</style>

