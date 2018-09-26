<template>
    <div class="main-haeder-native">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "main-native"
    }
</script>

<style lang="less" scoped>
    @green:#3bceb6;
    .main-haeder-native{
        display: flex;
        position: absolute;
        top: 0;
        left: 200px;
        height: 52px;
        z-index: 999;
        align-items: flex-end;
        padding-left: 40px;

        .main-header-style{
            .main-header-title{
                border-bottom: 2px solid @green;
                padding-bottom: 5px;
                display: inline-block;
                i{
                    font-style: normal;
                    &:before{
                        content: '\e657';
                        font-size: 20px;
                        color: @green;
                        margin-right: 5px;
                    }
                }
            }
        }
        .setMenuList{
            li {
                min-width: 80px;
                text-align: center;
                float: left;
                display: inline-block;
                padding-bottom: 10px;
                border-bottom: 3px solid transparent;
                margin: 0 15px;
                font-size: 14px;
                cursor: pointer;
                &.checked{
                    color: #3bceb6!important;
                    border-bottom: 2px solid #3bceb6!important;
                }
            }
        }
        .nativeItems{
            a {
                display: inline-block;
                padding-bottom: 10px;
                border-bottom: 2px solid transparent;
                margin: 0 15px;
                font-size: 14px;
                cursor: pointer;
                color: #777;
                width: 70px;
                text-align: center;
                &.router-link-active{
                    color: #3bceb6!important;
                    border-bottom: 2px solid #3bceb6!important;
                }
            }
        }
    }

</style>
