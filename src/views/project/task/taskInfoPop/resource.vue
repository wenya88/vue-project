<template>
    <!--资源-->
    <div class="resourceContainer">
        <div class="red">
            <Steps :current="2" class="red" direction="vertical">
                <Step title="线条" content="这里是该步骤的描述信息">
                    <div class="content">
                        <div class="resourceTitle">
                            <p  class="resourceStatus" style="text-align: right">已完成</p>
                            <p>2017.2.1-2017.2.2</p>
                        </div>
                        <div class="file">
                            <p>上传文件规格</p>
                            <ul>
                                <li class="fileList">
                                    <span>大小</span>
                                    <span>1212*3465</span>
                                </li><li class="fileList">
                                <span>大小</span>
                                <span>1212*3465</span>
                            </li>
                            </ul>
                        </div>
                    </div>
                </Step>
                <Step title="已完成" ></Step>
            </Steps>

        </div>
    </div>
</template>

<script>
    export default {
        created() {
        },
        mounted() {
        },
        data() {
            return {}
        },
        methods: {},
        computed: {},
        components: {}
    }
</script>

<style lang="less" >
    @green:#009900;
    .resourceContainer {
        .ivu-steps-head{
            background: #f5f7f6 !important;
        }
        .red{
            .ivu-steps .ivu-steps-title{
                background: #f5f7f6 ;
                color: red !important;
            }
        }
        .content {
            width: 350px;
            font-size: 14px;
            .resourceTitle{
                position: absolute;
                top:0;
                right: 0;
            }
            .file{
                margin: 45px 0 8px 0;
                p{
                    margin: 5px 0;
                }
                .fileList{
                    display: flex;
                    padding: 0 10px;
                    margin-bottom: 7px;
                    justify-content: space-between;
                    background: #f2f2f2;
                    border-radius: 10px;
                }
            }

            .resourceStatus{
                margin-top: 17px;
                color: @green;
            }

        }
    }
</style>
