<template>
  <div class="set_radmin">
    <div class="clearfix set_radmin_box">
       <div class="set_msg_title">
         <p>消息弹窗提醒设置</p>
         <p>勾选后相关消息将会弹窗通知</p>
       </div>
       <div class="set_msg_switch">
         <i-switch v-model="checkForm.switch" size="large">
            <span slot="open">允许</span>
            <span slot="close">禁止</span>
        </i-switch>
       </div>
    </div>
    <div class="set_radmin_checkbox">
      <div>
        <p>投标</p>
        <div>
          <CheckboxGroup v-model="checkForm.checkAllGroup">
           <Checkbox label="报名成功"></Checkbox>
           <Checkbox label="上传作品"></Checkbox>
           <Checkbox label="审核反馈"></Checkbox>
           <Checkbox label="投标反馈"></Checkbox>
          </CheckboxGroup>
        </div>
      </div>
      <div>
        <p>合同</p>
        <div>
           <CheckboxGroup v-model="checkForm.checkAllGroup1">
           <Checkbox label="三方合同"></Checkbox>
           <Checkbox label="尾款合同"></Checkbox>
           <Checkbox label="人才培养计划合同"></Checkbox>
           <Checkbox label="劳务合同"></Checkbox>
          </CheckboxGroup>
        </div>
      </div>
      <div>
        <p>项目</p>
        <div>
           <CheckboxGroup v-model="checkForm.checkAllGroup2">
           <Checkbox label="第一项目"></Checkbox>
           <Checkbox label="第二项目"></Checkbox>
           <Checkbox label="第三项目"></Checkbox>
           <Checkbox label="第四项目"></Checkbox>
           <Checkbox label="第五项目"></Checkbox>
          </CheckboxGroup>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      checkForm: {
        switch: true,
        checkAllGroup: [],
        checkAllGroup1: [],
        checkAllGroup2: []
      }
    }
  }
}
</script>
<style scoped>
.set_radmin{
 width: 100%;
 height: 100%;
}
.set_radmin_box{
 box-sizing: border-box;
 width: 100%;
 height: 80px;
 padding: 10px 10px;
 border-bottom: 1px solid rgb(174,174,174);
}
.set_msg_title{
  width: calc(100% - 150px);
  height: 100%;
  float: left;
}
.set_msg_title>p{
 width: 100%;
 height: 30px;
}
.set_msg_title>p:first-child{
  font-weight: bold;
}
.set_msg_title>p:last-child{
  font-size: 14px;
  color: rgb(174,174,174);
}
.set_msg_switch{
  width: 150px;
  height: 100%;
  float: left;
}
.set_msg_switch>span{
  float: right;
}
.set_radmin_checkbox{
  width: 100%;
  height: calc(100% - 80px);
  padding: 10px 20px;
}
.set_radmin_checkbox>div{
 width: 100%;
 height: 80px;
 margin-top: 10px;
}
.set_radmin_checkbox>div>p{
 width: 100%;
 height: 30px;
 line-height: 30px;
 font-size: 16px;
 font-weight: bold;
}
</style>
