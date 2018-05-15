<style lang="less">
    @import "./home.less";
</style>
<template>
    <div class="home-main">
        <!-- 主页 -->
         <Button type="primary" @click="logout()">退出登录</Button> 
    </div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
    name: 'home',
    data () {
        return {
            //
        };
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
        logout() {
            this.$axios.get(this.GLOBAL.baseRouter+'system/login/info')
            .then( res => res.data)
            .then( res => {
                if(res.err_code == 0){
                    Cookies.remove('user');
                    localStorage.removeItem('token');
                    this.$router.push('/login');
                }
                // if(res.responseCode == 1) {
                //     localStorage.removeItem('token');
                //     this.$router.push('/')
                // }
            })
        }
    }
};
</script>
