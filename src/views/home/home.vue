<style lang="less">
    @import "./home.less";
</style>
<template>
    <div class="home-main">
        <!-- 主页 -->
         <Button type="primary">退出登录</Button>
          <Button type="primary" @click="login">登录</Button>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
var qs = require('querystring');
export default {
    name: 'home',
    data () {
        return {
          isShow: false
        };
    },
    created() {
        // this.userInfo();
        let invateCode = Cookies.get('invate_code');
        if(invateCode) {
            // console.log(invateCode)
            this.invateInfo(invateCode);
        }
        console.log(Cookies.get('company'))
    },
    methods: {
        linkTo(url, params) {
            if (params) {
                this.$router.push({ path: url, query: params });
            }
            else {
                this.$router.push(url)
            }
        },
        login() {
          console.log('数据3', this.$store.state.msgShow)
        },
        userInfo() {
            this.$axios.get(this.GLOBAL.baseRouter+'system/login/info')
            .then( res => res.data)
            .then( res => {
                if(res.err_code == 0){
                    // console.log(res)
                    sessionStorage.userId = res.user.id
                    sessionStorage.user_type = res.user.user_type
                    Cookies.set('post_id', res.company.post_id)
                    // Cookies.set('user_type', res.user.user_type)
                }
                this.$store.dispatch('getMenulistRole');
            })
        },
        invateInfo(code) {
            let data = {
                invate_code: code
            }
            this.$axios.post(this.GLOBAL.baseRouter+'task/company/invate-info', qs.stringify(data))
            .then(res => res.data)
            .then(res => {
                if(res.err_code == 0) {
                    const content = '<p>'+res.company+'</p>'+'<p>邀请您加入'+res.department+'部</p>'+'<p>职位为'+res.post+'</p>';
                    this.$Modal.info({
                        title: '邀请加入',
                        content: content,
                        onOk: () => {
                            // this.$Message.info('Clicked ok');
                            this.$axios.post(this.GLOBAL.baseRouter+'task/company/member-join', qs.stringify(data))
                            .then(res => res.data)
                            .then(res => {
                                if(res.err_code == 0) {
                                    this.$Message.success('成功加入该公司');
                                    Cookies.set('invate_code', null)
                                }
                            })
                        }
                    });
                }
                console.log(res)
            })
        }
    }
};
</script>
