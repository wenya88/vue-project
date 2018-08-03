<template>
   <div class="pjt_all">
     <div class="clearfix pjt_head">
        <p class="pjt_head_msg">项目</p>
        <p class="pjt_head_but">详情&gt;</p>
    </div>
    <div class="pjt_main">
       <div class="pjc_main_left">
          <div>
             <p><span class="numClass">3</span><span class="titleClass">个</span></p>
             <p class="pjc_name">实施项目</p>
          </div>
          <div class="pjc_last_bx">
             <p><span class="numClass">20</span><span class="titleClass">个</span></p>
             <p class="pjc_name">内部项目</p>
          </div>
       </div>
       <div class="pjc_main_right">
          <div>
            <p><span class="numClass">5</span><span class="titleClass">个</span></p>
            <p class="pjc_name">已暂停</p>
          </div>
          <div class="pjc_last_bx">
            <p><span class="numClass">38</span><span class="titleClass">个</span></p>
            <p class="pjc_name">外包项目/子项目</p>
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
.pjt_all{
  width: 100%;
  height: 100%;
  padding: 20px;
  background: rgb(240,240,240);
 }
 .pjt_head{
 width: 100%;
 height: 60px;
}
.pjt_head_msg{
  float: left;
  font-size: 20px;
}
.pjt_head_but{
  float: right;
  font-size: 16px;
  color: rgb(210,210,210);
  cursor: pointer;
}
.pjt_main{
  width: 100%;
  height: 200px;
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
