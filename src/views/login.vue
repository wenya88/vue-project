<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login">
        <div class="login-purple" :style="`border-top:${bodyHight}px solid #544c93`"></div>
        <div class="bg" :style="`height:${bodyHight}px`"></div>
        <div class="login-yellow" :style="`border-bottom:${bodyHight}px solid #ffbe36`"></div>
        <div class="login-con">
            <div class="title" v-if="isRegister">注册<span @click="changeMode('register')">登录</span></div>
            <div class="title" v-else>登录<span @click="changeMode('login')"><Icon type="person-add"></Icon> 注册</span></div>
            <div class="form-con" v-if="isRegister" @keydown.enter="onRegister()">
                <Form ref="register" :model="register" :rules="ruleCustom">
                    <FormItem prop="userName">
                        <div class="itemname">邮箱账号</div>
                        <Input v-model="register.userName" placeholder="请输入邮箱账号"></Input>
                    </FormItem>
                    <FormItem prop="passwd">
                        <div class="itemname">密码</div>
                        <Input v-model="register.passwd" :type="pwpic.pwdType" placeholder="请输入密码"></Input>
                        <img :src="pwpic.src" @click="changeType()"/>
                    </FormItem>
                    <FormItem prop="passwdCheck">
                        <div class="itemname">再次输入密码</div>
                        <Input v-model="register.passwdCheck" id="a" :type="pwpic2.pwdType2" placeholder="请再次输入密码"></Input>
                        <img :src="pwpic2.src" @click="changeType2()"/>
                    </FormItem>
                    <FormItem>
                        <Button @click="onRegister()" type="primary" long>注 册</Button>
                    </FormItem> 
                </Form>
            </div>
            <div class="form-con" v-else @keydown.enter="onSubmit()">
                <Form ref="login" :model="loginform" :rules="rules">
                    <FormItem prop="email">
                        <div class="itemname">邮箱账号</div>
                        <Input v-model="loginform.email" placeholder="请输入邮箱账号"></Input>
                    </FormItem>
                    <FormItem prop="password">
                        <div class="itemname">密码</div>
                        <Input v-model="loginform.password" :type="pwpic3.pwdType3" placeholder="请输入密码"></Input>
                        <img :src="pwpic3.src" @click="changeType3()"/>
                    </FormItem>
                    <FormItem>
                        <Button @click="onSubmit()" type="primary" long>登 录</Button>
                    </FormItem>
                </Form>
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
import {authLogin} from "../config/env.js";
import src from '../images/close_eyes.png'
import src2 from '../images/open_eyes.png'
export default {
    data () {
        // const validatePass = (rule, value, callback) => {
        //     if (value === '') {
        //         callback(new Error('请输入密码'));
        //     } else {
        //         if (this.register.passwd !== '') {
        //             // 对第二个密码框单独验证
        //             this.$refs.register.validateField('passwdCheck');
        //         }
        //         callback();
        //     }
        // };
        // const validatePassCheck = (rule, value, callback) => {
        //     if (value === '') {
        //         callback(new Error('请再次输入密码'));
        //     } else if (value !== this.register.passwd) {
        //         callback(new Error('两次密码不一致!'));
        //     } else {
        //         callback();
        //     }
        // };
        return {
            isRegister: false,
            bodyHight: 500,
            publicKey: '',
            pwpic:{
                pwdType:"password",
                src
            },
            pwpic2:{
                pwdType2:"password",
                src
            },
            pwpic3:{
                pwdType3:"password",
                src
            },
            loginform: {
                email: '',
                password: ''
            },
            register: {
                userName: '',
                passwd: '',
                passwdCheck: ''
            },
            rules: {
                email: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                // ],
                // passwd: [
                //     { validator: validatePass, trigger: 'blur' }
                // ],
                // passwdCheck: [
                //     { validator: validatePassCheck, trigger: 'blur' }
                ]
            },
            ruleCustom: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                passwd: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ],
                passwdCheck: [
                    { required: true, message: '请确认密码', trigger: 'blur' }
                ]
                // passwd: [
                //     { validator: validatePass, trigger: 'blur' }
                // ],
                // passwdCheck: [
                //     { validator: validatePassCheck, trigger: 'blur' }
                // ]
            }
        };
    },
    /**
     * 页面加载前
     * */
    created() {
        this.bodyHight = document.documentElement.clientHeight;
        let inviteCode = this.$route.query.invate_code;
        // console.log(this.$route.query.invate_code)
        if(inviteCode) {
            Cookies.set('invate_code', inviteCode)
        } else {
            Cookies.set('invate_code', null)
        }
    },
    mounted() {
        this.fetchKey();
    },
    methods: {geMode(mode) {
            if(mode == 'login') {
                this.isRegister = true;
                this.loginform.userName = '';
                this.loginform.password = '';
            } else if(mode == 'register') {
                this.isRegister = false;
                this.register.userName = '';
                this.register.password = '';
                this.register.passwdCheck = '';
            }
        },
        fetchKey() {
            // this.$axios.get(authLogin+'/get-public-secret-key')
            this.$axios.get(this.GLOBAL.baseRouter+'system/login/get-public-secret-key')
            .then(res => res.data)
            .then(res => {
                if(res.err_code == 0) {
                    this.publicKey = res.public_key
                }
            })
        },
        onRegister() {
            let encrypt = new JSEncrypt();
            encrypt.setPublicKey(this.publicKey);
            let password = encrypt.encrypt(md5(md5(this.register.passwd)));
            let data = {
                account: this.register.userName,
                password: password
            };
            this.$refs.register.validate((valid) => {
                if (valid) {
                    this.$axios.post(this.GLOBAL.baseRouter+'system/login/register', qs.stringify(data))
                    .then(res => res.data)
                    .then(res => {
                        if(res.err_code == 0) {
                            this.loginform.userName = this.register.userName;
                            this.loginform.password = this.register.passwd;
                            this.onSubmit();
                        } else {
                            this.$Message.warning(res.err_message);
                        }
                    })
                } else {
                    this.$Message.error('Fail!');
                }
            });
        },
        onSubmit() {
            let encrypt = new JSEncrypt();
            encrypt.setPublicKey(this.publicKey);
            let password = encrypt.encrypt(md5(md5(this.loginform.password)));
            let data = {
                account: this.loginform.email,
                password: password
            };
            this.$refs.login.validate((valid) => {
                if (valid) {
                    // Cookies.set('password', this.form.password);
                    this.$axios.post(this.GLOBAL.baseRouter+'system/login/login', qs.stringify(data))
                    .then(res => res.data)
                    .then(res => {
                        if(res.err_code == 0) {
                            Cookies.set('user', this.loginform.email);
                            localStorage.token = res.token
                            axios.defaults.headers.common['token'] = res.token;
                            this.$router.push('/home/home')
                        } else {
                            this.$Message.warning(res.err_message);
                        }
                    })
                    // Cookies.set('user', this.form.userName);
                    // this.$router.push({
                    //     name: 'home_index'
                    // });
                }
            });
        },
        changeType(){
            this.pwpic.pwdType = this.pwpic.pwdType === 'password' ? 'text' : 'password';
            this.pwpic.src = this.pwpic.src == src ? src2 : src;
        },
        changeType2(){
            this.pwpic2.pwdType2 = this.pwpic2.pwdType2 === 'password' ? 'text' : 'password';
            this.pwpic2.src = this.pwpic2.src == src ? src2 : src;
        },
        changeType3(){
            this.pwpic3.pwdType3 = this.pwpic3.pwdType3 === 'password' ? 'text' : 'password';
            this.pwpic3.src = this.pwpic3.src == src ? src2 : src;
        }
    }
};
</script>

<style>

</style>
