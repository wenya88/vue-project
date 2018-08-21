<style lang="less">
@import './login.less';
</style>

<template>
    <div class="login">
        <div class="login-purple" :style="`border-top:${bodyHight}px solid #3bceb6`"></div>
        <div class="bg" :style="`height:${bodyHight}px`"></div>
        <div class="login-yellow" :style="`border-bottom:${bodyHight}px solid #fff`"></div>
        <div class="login-con">
            <div class="loginFooder">蜀ICP备18023414号</div>
            <div class="form-bannger"></div>
            <!-- 注册 -->
            <div class="form-con" v-if="isRegister" @keydown.enter="onRegister()">
                <div class="form-con-logoImg">欢迎加入斑驳</div>
                <reg-ister></reg-ister>
                <div>
                    <Button @click="onRegister()" type="primary" long>注 册</Button>
                    <p class="loginText">已有帐号，去<span @click="changeMode('register')">登录</span></p>
                </div>
            </div>

            <!-- 登录 -->
            <div class="form-con" v-else @keydown.enter="onSubmit()">
                <div class="form-con-logoImg">欢迎登录斑驳</div>
                <login-com></login-com>
                <div>
                    <Button @click="onSubmit()" type="primary" long>登 录</Button>
                    <p class="loginText">没有帐号，去<span @click="changeMode('login')">注册</span></p>
                </div>
            </div>
        </div>
       
    </div>
</template>

<script>
var qs = require('querystring');
var jsencrypt = require('jsencrypt');
var md5 = require('md5');
import axios from 'axios'
import Cookies from 'js-cookie';
// import { getPublicKey } from '../server/index';
import regIster from './login/register';
import loginCom from './login/loginCom';
export default {
    data() {
        return {
            isRegister: false,
            bodyHight: 500,
            publicKey: '',
            register:{},
            loginform:{}
        };
    },
    components:{
        regIster:regIster,
        loginCom:loginCom
    },
    /**
     * 页面加载前
     * */
    created() {
        this.bodyHight = document.documentElement.clientHeight;
        let inviteCode = this.$route.query.invate_code;
        // console.log(this.$route.query.invate_code)
        if (inviteCode) {
            Cookies.set('invate_code', inviteCode)
        } else {
            Cookies.set('invate_code', null)
        }
    },
    mounted() {
        this.fetchKey();
        localStorage.removeItem('msgShow')
        this.$store.state.msgShow = false;
        this.$bus.on('registerData',val=>{
            this.register=val;
        });
        this.$bus.on('loginData',val=>{
            this.loginform=val;
        })
    },
    methods: {
        // 链接websoket
        changeMode(mode) {
            if (mode == 'login') {
                this.isRegister = true;
                this.loginform.userName = '';
                this.loginform.password = '';
            } else if (mode == 'register') {
                this.isRegister = false;
                this.register.userName = '';
                this.register.password = '';
                this.register.passwdCheck = '';
            }
        },
        fetchKey() {
            this.$axios.get(this.GLOBAL.baseRouter + 'system/login/get-public-secret-key')
                .then(res => res.data)
                .then(res => {
                    if (res.err_code == 0) {
                        this.publicKey = res.public_key
                    }
                })
            // getPublicKey().then(res => {
            //     console.log(res)
            // })
        },
        onRegister() {
            let encrypt = new JSEncrypt();
            encrypt.setPublicKey(this.publicKey);
            let password = encrypt.encrypt(md5(md5(this.register.passwd)));
            let pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
            let data = {
                account: this.register.userName,
                password: password
            };
            if(this.register.passwd==''||this.register.passwdCheck==''){
                this.$Message.error('密码不能为空!');
                return 
            }else if(this.register.passwd!=this.register.passwdCheck){
                this.$Message.error('两次密码不一致!');
                return 
            }else if(!pattern.test(this.register.userName)){
                this.$Message.error('用户名须为邮箱帐号！');
                return 
            }
            this.$axios.post(this.GLOBAL.baseRouter + 'system/login/register', qs.stringify(data))
                .then(res => res.data)
                .then(res => {
                    if (res.err_code == 0) {
                            this.loginform.email = this.register.userName;
                            this.loginform.password = this.register.passwd;
                            this.onSubmit();
                    } else {
                        this.$Message.warning(res.err_message);
                    }
            })
        },
        onSubmit() {
            let encrypt = new JSEncrypt();
            encrypt.setPublicKey(this.publicKey);
            let password = encrypt.encrypt(md5(md5(this.loginform.password)));
            let data = {
                account: this.loginform.email,
                password: password
            };
            // Cookies.set('password', this.form.password);
            this.$axios.post(this.GLOBAL.baseRouter+'system/login/login', qs.stringify(data))
                    .then(res => res.data)
                    .then(res => {
                        if(res.err_code == 0) {
                            Cookies.set('user', this.loginform.email);
                            localStorage.token = res.token
                            this.$store.state.msgShow = true
                            localStorage.msgShow = true
                            if (localStorage.useList) {
                              this.$store.state.useList = JSON.parse(localStorage.useList)
                            }
                            axios.defaults.headers.common['token'] = res.token;
                            this.$router.push('/home/home')
                            this.$store.dispatch('getMenulistRole');
                        } else {
                            this.$Message.warning(res.err_message);
                        }
            })
                    // Cookies.set('user', this.form.userName);
                    // this.$router.push({
                    //     name: 'home_index'
                    // });
        }
    }
};
</script>

