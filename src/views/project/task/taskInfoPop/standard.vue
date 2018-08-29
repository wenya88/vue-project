<template>
    <!--规范-->
    <div class="taskInfoPopStandardContainer">
        <dl class="standardList">
            <dt class="standardTitle">基础规范</dt>
            <!--<dd class="standardInfo">-->
            <!--<span>尺寸</span>-->
            <!--<span>1920*768px</span>-->
            <!--</dd>-->
            <!--<dd class="standardInfo">-->
            <!--<span>风格</span>-->
            <!--<span>中国武侠风</span>-->
            <!--</dd>-->
            <!--<dd class="standardInfo">-->
            <!--<span>4边面</span>-->
            <!--<span>使用正方形贴图</span>-->
            <!--</dd>-->
            <!--<dd class="standardInfo">-->
            <!--<span>双边显示</span>-->
            <!--<span>所有文件 '-s' 开头</span>-->
            <!--</dd>-->
            <template v-if="infoDetails">
                <dd v-for="(item,index) in infoDetails.standard" :key="index" class="standardInfo"
                    v-if="item.type === 'progress' || item.type === 'file' || item.type === 'connect'"
                >
                    <span>{{item.name}}</span>
                    <span>{{item.values}}</span>
                </dd>
            </template>
        </dl>
        <dl class="standardList">
            <dt class="standardTitle">制作流程规范</dt>
            <!--阶段-->
            <div>
                <ul class="flowChartUl">
                    <!--<li class="current">线条<i></i></li>-->
                    <!--<li class="current">初稿<i></i></li>-->
                    <!--<li>立绘<i></i></li>-->
                    <!--<li>精修<i></i></li>-->
                    <template v-if="infoDetails">
                        <li v-for="(item,index) in infoDetails.stage" :class="{'highlight':highlight === index}" class="flowChart"
                            @click="getFlowInfo(item,index)"
                        >
                            <span v-if="index !== 0"></span>{{item.stage_name}}
                            <Icon v-if="index !== infoDetails.stage.length-1" type="arrow-right-a"  class="icon"></Icon>
                        </li>
                    </template>
                </ul>

            </div>
            <!--上传-->
            <dd v-if="flowChartText" v-for="(item,index) in flowChartText" :key="index" class="uploadlist ">
                <span>{{item.norm_name || item.norm}}</span>
                <div>
                    <span>{{item.text}}</span>
                    <span class="level" :class="'level'+item.level">{{item.level|level}}</span>
                </div>
            </dd>
        </dl>
        <dl class="standardList">
            <dt class="standardTitle">交稿文件规范</dt>
            <template v-if="infoDetails">
                <dd v-for="(item,index) in infoDetails.standard" :key="index" class="standardInfo"
                    v-if="item.type === 'hand'"
                >
                    <span>{{item.name}}</span>
                    <span>{{item.values}}</span>
                </dd>
            </template>

        </dl>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        created() {

        },
        mounted() {

        },
        data() {
            return {
                standardType: {
                    progess: [],
                    file: [],
                    connect: [],
                    hand: [],
                },
                flowChartText: [],
                highlight:null,
            }
        },
        methods: {
            getFlowInfo(item,index) {
                this.highlight = index;
                if (item.require) {
                    this.flowChartText = item.require
                }
            }
        },
        computed: {
            ...mapState({
                infoDetails(data) {
                    return data.project.detail.taskInfo
                }
            })
        },
        watch: {
            infoDetails(data) {
            }
        },
        components: {},
        filters:{
            level(value){
                if(value === 1){
                    return '高'
                }else if(value === 2){
                    return '中'
                }else if(value === 3){
                    return '低'
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    @green:#3bceb6;
    .taskInfoPopStandardContainer {
        /*padding: 20px;*/
        .standardList {
            padding: 0 20px;
            border-bottom: 1px solid #f2f9f9;
            .standardTitle {
                font-size: 14px;
                color: #9f9f9f;
                margin: 15px 0
            }
            .level {

                color: #fff;
            }
            .level3 {
                background: red;
            }
            .level2 {
                background: orange;
            }
            .level1 {
                background: #8c8c8c;
            }

            .standardInfo {
                padding: 8px 10px;
                font-size: 13px;
                color: #b3b3b3;
                background: #f6f8f8;
                display: flex;
                justify-content: space-between;
                border-radius: 3px;
                margin-bottom: 15px;
            }
            .flowChartUl {
                display: flex;
                margin-bottom: 20px;
                .highlight{
                    border: 1px solid @green !important;
                    .icon{
                        color: @green;
                    }
                }
                .flowChart {
                    list-style: none;
                    position: relative;
                    border: 1px dashed #ccc;
                    padding: 2px 15px;
                    border-radius: 3px;
                    font-size: 13px;
                    margin-left: 35px;
                    &:nth-child(1) {
                        margin-left: 0 !important;
                    }
                    .icon{
                        position: absolute;
                        top: 25%;
                        right: -25px;
                    }
                }
                .current {
                    border: 1px solid #3dcfb7 !important;
                    color: #3dcfb7 !important;
                    i {
                        background: url("../../proStat/image/JT1.png") no-repeat !important;
                    }
                }
            }


            .uploadlist {
                display: flex;
                justify-content: space-between;
                list-style: none;
                background: url("../../proStat/image/circleIcon.png") no-repeat left center;
                padding: 10px 0 10px 10px;
                font-size: 13px;



        }
                /*list-style: url("../../proStat/image/circleIcon.png");*/

        }
    }

</style>
