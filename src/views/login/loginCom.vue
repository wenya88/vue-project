<template>
    <Form :model="loginform">
        <FormItem>
            <Input v-model="loginform.email" placeholder="请输入邮箱账号"></Input>
            <i class="iconfont icon-youxiang1"></i>
        </FormItem>
        <FormItem>
            <Input v-model="loginform.password" :type="pwpic3.pwdType3" placeholder="请输入密码"></Input>
            <i class="iconfont icon-mima1"></i>
            <span 
                :class="[pwpic3.pwdType3=='password'?'iconfont icon-chakanmima1 lookPas':'iconfont icon-chakanmima lookPas']" 
                @click="changeType3()">
            </span>
        </FormItem>
    </Form>
</template>
<script>
export default {
    data(){
        return{
            pwpic3: {
                pwdType3: "password",
            },
            loginform: {
                email: '',
                password: ''
            },
        }
    },
    mounted(){
        this.upDate(); 
    },
    updated(){
       this.upDate(); 
    },
    methods:{
        upDate(){
            this.$bus.emit('loginData',this.loginform)
        },
        changeType3() {
            this.pwpic3.pwdType3 = this.pwpic3.pwdType3 == 'password' ? 'text' : 'password';
        }
    }

}
</script>
