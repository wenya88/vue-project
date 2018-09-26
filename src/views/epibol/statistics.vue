<template>
    <div>
        <main-native>
            <div class="main-header-style iconfont"><span class="main-header-title"><i></i>{{this.$route.meta.title}}</span></div>
        </main-native>
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
    </div>
</template>
<script>
import statisMenu from './statistics/component/statisMenu';
import statisHome from './statistics/component/statisHome';
import mainNative from '../main-components/mainNative.vue';
export default {
    data(){
        return{
           contneComponent:statisHome
        }
    },
    components:{
        statisMenu:statisMenu,
        mainNative:mainNative
    }
}
</script>
<style lang="less">
@import './statistics/style/statistics.less';
</style>
