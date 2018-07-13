<template>
    <div>
        <div class="projectSetMenu">
            <span v-for="(item,index) in prjectMenu" :class="{checked:index==mIndex}"
                  @click="switchSet(index,item.state)" :key="index">{{item.name}}</span>
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

    export default {
        data() {
            return {
                prjectMenu: [
                    {'name': '项目制作规范', 'state': 'productStandard'},
                    {'name': '项目工作时间', 'state': 'workTime'},
                    {'name': '项目成员设置', 'state': 'peopleSet'},
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
        }
    }
</script>
<style lang="less">
    @import './projectTiemSet/style/timeSet.less';
</style>