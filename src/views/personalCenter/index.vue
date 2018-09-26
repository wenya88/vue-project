<template>
    <div>
        <main-native>
            <!--<div class="main-header-style iconfont"><span class="main-header-title"><i></i>{{this.$route.meta.title}}</span></div>-->
            <div class="main-header-style iconfont"><span class="main-header-title"><i></i><router-link tag="span" to="/home/personalCenter">个人资料</router-link></span></div>
            <div class="main-header-style iconfont"><span class="main-header-title"><i></i><router-link tag="span" to="/home/personalCenter/b">实名认证</router-link></span></div>
            <div class="main-header-style iconfont"><span class="main-header-title"><i></i><router-link tag="span" to="/home/personalCenter/c">电子签名</router-link></span></div>

        </main-native>
        <div class="personalContainer">

            <!-- <Menu class="menuList"   active-name="1">
                <MenuGroup>
                    <MenuItem name="1">
                        <Icon type="document-text"></Icon>
                        个人资料
                    </MenuItem>
                    <!-- <MenuItem name="2">
                        <Icon type="navicon-round"></Icon>
                        个人主页管理
                    </MenuItem>
                    <MenuItem name="3">
                        <Icon type="clipboard"></Icon>
                        团队信息
                    </MenuItem> -->
            <!--</MenuGroup>-->
            <!--</Menu>-->
            <router-view class="menuMain"></router-view>
        </div>
    </div>
</template>
<script>
    import mainNative from '../main-components/mainNative.vue';

    export default {
        data() {
            return {
                theme2:'primary'
            }
        },
        components:{
            mainNative
        },
        created() {

        },
        methods: {

        }
    }
</script>

<style lang="less" >
    .single-page{
        height: 100%;
    }
    .personalContainer{
        .ivu-menu{
            background: #fff !important;
            z-index: 2;
            .ivu-menu-vertical,.ivu-menu-item{
                &:hover{
                    background: #ccc!important;
                }
            }
        }
        display: flex;
        /*height: 100%;*/
        /*margin-left: 150px;*/
        .menuList{
            width: 120px;
        }
        .menuMain{
            flex:1;
        }
    }

</style>

