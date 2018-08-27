<template>
    <div>
        <div class="headerNavBar" >
            <ul class="setMenuList">
                <li v-for="(item,index) in prjectMenu" v-if="projectSet[item.role]" :class="{checked:index==mIndex}" @click="switchSet(index,item.state)" :key="index">{{item.name}}</li>
            </ul>
        </div>
        <div class="projectSetRow">
            <keep-alive>
                <component :is="componentChecked"></component>
            </keep-alive>
        </div>
    </div>
</template>
<script>
    import qs from 'querystring'
    import timeSet from './projectTiemSet/component/timeSet'
    import peopleSet from './projectTiemSet/component/peopleSet'
    import productStandard from './projectTiemSet/component/productStandard'
    import {mapState} from 'vuex'
    export default {
        data() {
            return {
                prjectMenu: [
                    {'name': '项目制作规范', 'state': 'productStandard',role:'projectNorm'},
                    {'name': '项目工作时间', 'state': 'workTime',role:'projectTitle'},
                    {'name': '项目成员设置', 'state': 'peopleSet',role:'projectsetMember'},
                ],
                mIndex: 0,
                menuFlag: true,
                componentChecked: productStandard
            }
        },
        mounted() {
            this.autoH();
        },
        methods: {
            autoH() {
                $(".projectSetMenu").height($(window).height() - 160)
            },
            switchSet(index, state) {
                this.mIndex = index;
                switch (state) {
                    case 'workTime':
                        this.componentChecked = timeSet;
                        break;
                    case 'peopleSet':
                        this.componentChecked = peopleSet;

                        break;
                    case 'productStandard':
                        this.componentChecked = productStandard;
                        break;
                }
            }
        },
        computed:{
            ...mapState({
                projectSet(data){
                    return data.app.projectSet
                }
            })
        }
    }
</script>
<style lang="less">
    @import './projectTiemSet/style/timeSet.less';
    .headerNavBar{
        /*display: flex;*/
        /*position: absolute;*/
        /*top: 0;*/
        /*left: 200px;*/
        /*height: 64px;*/
        /*z-index: 999;*/
        /*align-items: flex-end;*/
        /*padding-left: 40px;*/
    }

</style>
