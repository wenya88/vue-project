<template>
    <div class="personalContainer">
        <Menu class="menuList"   active-name="1">
            <MenuGroup>
                <MenuItem name="1">
                    <Icon type="document-text"></Icon>
                    个人资料
                </MenuItem>
                <MenuItem name="2">
                    <Icon type="navicon-round"></Icon>
                    个人主页管理
                </MenuItem>
                <MenuItem name="3">
                    <Icon type="clipboard"></Icon>
                    团队信息
                </MenuItem>
            </MenuGroup>
        </Menu>
        <router-view class="menuMain"></router-view>
    </div>

</template>
<script>

    export default {
        data() {
            return {
                theme2:'primary'
            }
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

