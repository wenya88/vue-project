<template>

    <div class="epibolTaskClassContainer">
        <main-native>
            <div v-for="(item,index) in routers" :key="index"
                 :class="[{'color':nowIndex === index},'main-header-style','iconfont']"
                 @click="toPath(index,item.path)">
                <span class="main-header-title"><i></i>{{item.name}}</span>
            </div>
        </main-native>

        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>

</template>

<script>
    const routerList = []
    import mainNative from '@/views/main-components/mainNative.vue';

    export default {
        created() {
            this.initBorder()
        },
        mounted() {
        },
        data() {
            return {
                nowIndex: null,
                routers: [
                    {name: '制作规范库', path: '/epibol/taskClass'},
                    {name: '企业资料', path: '/epibol/taskClass/companyInformation'},
//                    {name: '企业认证', path: '/epibol/taskClass/companyCertification'},
//                    {name: '电子签名', path: '/epibol/taskClass/companySignature'},
//                    {name: '合同签章人', path: '/epibol/taskClass/companyContract'},
                ]
            }
        },
        methods: {
            initBorder(){
                this.routers.forEach((item,index) => {
                    if(item.path === this.$route.path){
                        this.nowIndex = index
                    }
                })
            },
            toPath(index, path) {
                this.nowIndex = index
                this.$router.push({path: path})
            }
        },
        computed: {},
        components: {
            mainNative
        }
    }
</script>

<style lang="less" scoped>
    .epibolTaskClassContainer {
        height: 100%;
        .color {
            border-bottom: 2px solid #3bceb6;
        }
        .main-header-style {
            margin-right: 10px;
            /*..main-haeder-native .main-header-style .main-header-title{*/
            /*border-bottom: 1px solid transparent; 2px solid #3bceb6*/
            /*}*/
            .main-header-title {
                border-bottom: 2px solid transparent;
            }
        }

    }
</style>
