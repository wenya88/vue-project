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
import statisMenu from './statistics/component/statisMenu';
import statisHome from './statistics/component/statisHome';
export default {
    data(){
        return{
           contneComponent:statisHome
        }
    },
    components:{
        statisMenu:statisMenu
    }
}
</script>
<style lang="less">
@import './statistics/style/statistics.less';
</style>


