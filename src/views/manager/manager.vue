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
                    <p>
                     <span></span>
                     <span></span>
                    </p>
                    <p>
                      <span></span>
                      <span></span>
                    </p>
                  </div>
               </div>
            </div>
            <div class="mag-5 mangaer_rvs">
               <div class="mangaer_box_rves">
               </div>
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
  background: red;
}
.income_msg{
 font-size: 20px;
}
.income_msg_details{
 width: 100%;
}
</style>


