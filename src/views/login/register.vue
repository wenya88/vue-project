<template>
    <Form :model="register">
        <FormItem>
            <Input v-model="register.userName" placeholder="请输入邮箱账号"></Input>
            <div class="inputPosition">
                <i class="iconfont icon-youxiang1"></i>
            </div>
        </FormItem>
        <FormItem>
            <Input v-model="register.passwd" :type="pwpic.pwdType" placeholder="请输入密码"></Input>
            <div class="inputPosition">
                <i class="iconfont icon-mima1"></i>
                <span 
                    :class="[pwpic.pwdType=='password'?'iconfont icon-chakanmima1 lookPas':'iconfont icon-chakanmima lookPas']" 
                    @click="changeType()">
                </span>
            </div>
        </FormItem>
        <FormItem>
            <Input v-model="register.passwdCheck" :type="pwpic2.pwdType2" placeholder="请再次输入密码"></Input>
            <div class="inputPosition">
                <i class="iconfont icon-mima1"></i>
                <span 
                    :class="[pwpic2.pwdType2=='password'?'iconfont icon-chakanmima1 lookPas':'iconfont icon-chakanmima lookPas']" 
                    @click="changeType2()">
                </span>
            </div>
        </FormItem>
         <div class="errorHint" v-if="errorHint.hintFlag"><span class="iconfont icon-cuowu1"></span>{{errorHint.hintData}}</div>
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
            errorHint:{
                hintFlag:false,
                hintData:''
            }
       }
   },
   updated(){
       this.upDate();
   },
   methods:{
       errorInfo(data){
            this.errorHint.hintData=data;
            this.errorHint.hintFlag=true;
        },
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
