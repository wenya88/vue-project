<template>
    <Content class="companyNormLibrary">
        <ul style="display: flex;height: 100%;">
            <li style="min-width: 300px;">
                <type-list style="height: 100%" ref="tree" :listData="formLeft"></type-list>
            </li>
            <li style="flex: 1">
                <standard-info></standard-info>

            </li>
        </ul>
        <!--<Row style="height: 100%">-->
            <!--<Col span="8" style="height: 100%">-->
                <!--<type-list style="height: 100%" ref="tree" :listData="formLeft"></type-list>-->
            <!--</Col>-->
            <!--<Col span="16">-->
            <!--<Content :style="{padding: '0 0 70px', minHeight: '280px', background: '#fff'}">-->
            <!--</Content>-->
            <!--</Col>-->

        <!--</Row>-->
    </Content>
</template>
<script>
    import qs from 'querystring'

    import Icon from "iview/src/components/icon/icon";
    import Caspanel from "iview/src/components/cascader/caspanel";
    import typeList from "./typeList";
    import standardInfo from "./standardInfo";

    export default {
        components: {
            typeList,
            Caspanel,
            Icon,
            standardInfo
        },
        data() {
            return {
                formLeft: {},
            }
        },
        mounted() {
        },
        methods: {}
    };
</script>
<style lang="less">
    .companyNormLibrary {
        height: 100%;
        background: #eef1f2;
        padding-top: 30px;
    }
</style>
