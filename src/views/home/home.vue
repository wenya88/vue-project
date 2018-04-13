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
            this.$axios.get('/login/logout')
            .then( res => res.data)
            .then( res => {
                console.log(res)
                // if(res.responseCode == 1) {
                //     localStorage.removeItem('token');
                //     this.$router.push('/')
                // }
            })
        }
    }
};
</script>
