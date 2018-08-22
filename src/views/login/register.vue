<template>
    <Form :model="register">
        <FormItem>
            <Input v-model="register.userName" placeholder="请输入邮箱账号"></Input>
            <i class="iconfont icon-youxiang1"></i>
        </FormItem>
        <FormItem>
            <Input v-model="register.passwd" :type="pwpic.pwdType" placeholder="请输入密码"></Input>
            <i class="iconfont icon-mima1"></i>
            <span 
                :class="[pwpic.pwdType=='password'?'iconfont icon-chakanmima1 lookPas':'iconfont icon-chakanmima lookPas']" 
                @click="changeType()">
            </span>
        </FormItem>
        <FormItem>
            <Input v-model="register.passwdCheck" :type="pwpic2.pwdType2" placeholder="请再次输入密码"></Input>
            <i class="iconfont icon-mima1"></i>
            <span 
                :class="[pwpic2.pwdType2=='password'?'iconfont icon-chakanmima1 lookPas':'iconfont icon-chakanmima lookPas']" 
                @click="changeType2()">
            </span>
        </FormItem>
    </Form>
</template>
<script>
export default {
   data(){
       return{
           pwpic: {
                pwdType: "password",
            },
            pwpic2: {
                pwdType2: "password",
            },
           register: {
                userName: '',
                passwd: '',
                passwdCheck: ''
            },
       }
   },
   updated(){
       this.upDate();
   },
   methods:{
        upDate(){
            this.$bus.emit('registerData',this.register)
        },
        changeType() {
            this.pwpic.pwdType = this.pwpic.pwdType == 'password' ? 'text' : 'password';
        },
        changeType2() {
            this.pwpic2.pwdType2 = this.pwpic2.pwdType2 == 'password' ? 'text' : 'password';
        },
   } 

}
</script>
