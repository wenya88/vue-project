<template>
    <div class="statisics">
        <!-- Menu -->
        <div class="statisics-menu">
            <statis-menu></statis-menu>
        </div>
        <!-- //MenuEnd -->
        <!-- statisicsContent -->
        <div class="statisics-content">
            <component :is="contneComponent"></component>
        </div>
        <!-- //statisicsContentEnd -->
        <div class="clear"></div>
    </div>
</template>
<script>
    import mainNative from '../main-components/mainNative.vue';
    export default {
        data(){
            return{
                menuData:[
                    {
                        icon:'icon-zhexiantu',
                        title:'统计概况',
                        Titem:[
                            {title:'概况'}
                        ]
                    },
                    {
                        icon:'icon-zhaobiao',
                        title:'投标',
                        Titem:[
                            {title:'中标率'},
                            {title:'落标原因统计'}
                        ]
                    },
                    {
                        icon:'icon-jiaoyi',
                        title:'交易',
                        Titem:[
                            {title:'成交项目'},
                            {title:'交易财务'}
                        ]
                    },
                    {
                        icon:'icon-icon-project',
                        title:'项目',
                        Titem:[
                            {title:'任务资源'},
                            {title:'通过率'}
                        ]
                    },
                    {
                        icon:'icon-tuandui1',
                        title:'团队',
                        Titem:[
                            {title:'团队能力'},
                            {title:'个人能力'},
                            {title:'工时统计'},
                            {title:'任务平均用时'},
                            {title:'类型平均延误用时'},
                            {title:'稿件通过率'}
                        ]
                    }

                ]
            }
        },
        methods:{
            selectMenu(name){
                console.log(name)
            }
        },
        components:{
            mainNative
        }
    }
</script>
<style lang="less">
@import './statistics/style/statistics.less';
</style>


