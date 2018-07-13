<template>
    <!--规范-->
    <div class="taskInfoPopStandardContainer">
        <dl class="standardList">
            <dt class="standardTitle">基础规范</dt>
            <dd v-for="(item,index) in dataForm" :key="index" class="standardInfo">
                <span>风格</span>
                <span>{{item}}</span>
            </dd>
        </dl>
        <dl class="standardList">
            <dt class="standardTitle">基础规范</dt>
            <div>
                <li>流程1-流程2-流程3</li>
            </div>
            <dd v-for="(item,index) in dataForm" :key="index" class="standardInfo">
                <span>风格</span>
                <span>{{item}}</span>
            </dd>
        </dl>
        <dl class="standardList">
            <dt class="standardTitle">交稿文件规范</dt>
            <dd v-for="(item,index) in dataForm" :key="index" class="standardInfo">
                <span>风格</span>
                <span>{{item}}</span>
            </dd>
        </dl>
    </div>
</template>

<script>
    export default {
        created() {
        },
        mounted() {
        },
        data() {
            return {

                dataForm: [
                    'DJDJDJDJ',
                    '活跃',
                ]
            }
        },
        methods: {},
        computed: {},
        components: {}
    }
</script>

<style lang="less" scoped>
    .taskInfoPopStandardContainer {
        padding: 0 10px;
        margin-bottom: 40px;
        .standardList {
            .standardTitle{
                font-size: 16px;
                color: #ccc;
            }
            .standardInfo {
                display: flex;
                justify-content: space-between;
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
