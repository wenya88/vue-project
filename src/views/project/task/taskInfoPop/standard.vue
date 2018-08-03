<template>
    <!--规范-->
    <div class="taskInfoPopStandardContainer">
        <dl class="standardList">
            <dt class="standardTitle">基础规范</dt>
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
            <div>
                <ul class="flowChartUl">
                   <template v-if="infoDetails">
                       <li v-for="(item,index) in infoDetails.stage" class="flowChart"
                           @click="getFlowInfo(item)"
                       >
                           <span v-if="index !== 0">———</span>{{item.stage_name}}
                       </li>
                   </template>
                </ul>
            </div>
            <dd v-if="flowChartText" v-for="(item,index) in flowChartText" :key="index" class="standardInfo">
            <span>{{item.norm_name}}</span>
            <div>
                <span>{{item.text}}</span>
                <span  class="level" :class="'level'+item.level" >{{item.level}}</span>
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
                standardType:{
                    progess :[],
                    file:[],
                    connect:[],
                    hand:[],
                },
                flowChartText:[]
            }
        },
        methods: {
            getFlowInfo(item){
                if(item.require){
                    this.flowChartText = item.require
                }
            }
        },
        computed: {
            ...mapState({
                infoDetails(data){
                    return data.project.detail.taskInfo
                }
            })
        },
        watch:{
            infoDetails(data){
            }
        },
        components: {}
    }
</script>

<style lang="less" scoped>
    .taskInfoPopStandardContainer {
        padding: 0 10px;
        margin-bottom: 40px;
        .standardList {
            .flowChartUl{
                display: flex;
            }
            .standardTitle{
                font-size: 16px;
                color: #ccc;
            }
            .standardInfo {
                display: flex;
                justify-content: space-between;
            }
            .level{
                padding: 0 5px;
                color: #fff;
            }
            .level3{
              background: red;
            }
            .level2{
                background: orange;
            }
            .level1{
                background: #8c8c8c;
            }
        }
        dl{
            margin-bottom:65px ;
        }
        dd{
            padding: 10px 0;
        }
    }
</style>
