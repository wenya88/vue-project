<style lang="less">
    @import "./home.less";
</style>
<template>
    <div class="home-main">
        <Button type="primary" @click="linkTo('/home/login')">登录</Button>
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
        }
    }
};
</script>
