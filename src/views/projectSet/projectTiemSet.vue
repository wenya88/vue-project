<template>
<div>
    <div class="projectSetMenu">
        <span v-for="(item,index) in prjectMenu" :class="{checked:index==mIndex}" @click="switchSet(index,item.state)" :key="index">{{item.name}}</span>
    </div>
    <div class="projectSetRow">
        <keep-alive>
            <component :is="componentChecked"></component>
        </keep-alive>
    </div>
</div>
</template>
<script>
var qs=require('querystring');
import timeSet from './projectTiemSet/component/timeSet'
import peopleSet from './projectTiemSet/component/peopleSet'
export default {
    data(){
        return{
            prjectMenu:[
                {'name':'项目工作时间','state':'workTime'},
                {'name':'项目成员设置','state':'peopleSet'}
            ],
            mIndex:0,
            menuFlag:true,
            componentChecked:timeSet
        }
    },
    mounted(){
      this.autoH();
    },
    methods:{
       autoH(){
           $(".projectSetMenu").height($(window).height()-160)
       },
       switchSet(index,state){
           this.mIndex=index;
           switch(state){
                case 'workTime':
                    this.componentChecked=timeSet
                    break;
                case 'peopleSet':
                    this.componentChecked=peopleSet
                    break;
           }
       }
    }
}
</script>
<style lang="less">
@import './projectTiemSet/style/timeSet.less';
</style>