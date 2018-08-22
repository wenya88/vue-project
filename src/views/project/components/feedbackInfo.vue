<template>
    <div class="feedbackInfoContainer" v-if="feedbackData">
        <div v-if="identity">
            <div class="feedbackInfo">
                <!--<div v-if="内部反馈" class="feedbackInfo">-->
                <span><p>状态</p><br/>{{feedbackData.status | filtStat}}</span>

                <span><p>等待时间</p><br/><Icon type="android-time"></Icon> <span
                        style="color: #3bceb6">{{feedbackData.clientDay}}</span></span>
                <span><p>审核人</p><br/>
                        <img :src="feedbackData.inside_audit_headimage?feedbackData.inside_audit_remarkname :  './threeFile/liyuanba.png'"
                             style="width: 33px;height: 33px;border-radius: 50%;vertical-align: middle;margin-right: 10px;"
                             alt="">
                        {{feedbackData.company_name}}
                </span>
            </div>

        </div>
        <div v-else-if="feedbackData.status === '1' " class="VideoAllowEdit">
            <!--<div v-if="内部待审1 " class="VideoAllowEdit">-->
            <i class="project_opinion tagimage"></i>
            <span style="color: #868788;margin-left: 20px;line-height: 30px;">审核意见</span>
            <span class="text">
    <textarea name="" id="EditInput" placeholder="请输入你要反馈的内容" v-model="FeedbackValue"></textarea>
                <!--<input type="text"  id="EditInput" v-model="FeedbackValue">-->
    </span>
            <span class="EditSub">
    <button class="actionPost" @click="commitEidt('edit')">需修改</button>
    </span>
            <span class="EditSub">
    <button class="subPass" @click="commitEidt('ok')">通过</button>
    </span>
        </div>
        <div v-else-if="feedbackData.status === '3'||feedbackData.status === '4'||feedbackData.status === '5'"
             class="feedbackInfo">
            <!--<div v-if="内部反馈" class="feedbackInfo">-->

            <div v-if="feedbackData.status === '5'"><p>状态</p><br/>
                <Icon type="checkmark-circled" size="16" style="color: #3bceb6"></Icon>
                {{feedbackData.status | filtStat}}
            </div>
            <div v-else><p>状态</p><br/>{{feedbackData.status | filtStat}}</div>

            <div><p>修改调整</p><br/> <span
                    style="color: #3bceb6">{{feedbackData.file[0].tag ? feedbackData.file[0].tag.length : 0}}</span>处
            </div>
            <div style="flex:1;text-align: center"><p>反馈描述</p><br/> {{feedbackData.feedback}}</div>

            <div><p>审核人</p><br/>

                <template v-if="feedbackData.status === '3'">
                    <img :src="feedbackData.inside_audit_headimage?feedbackData.inside_audit_remarkname :  './threeFile/liyuanba.png'"
                         style="width: 33px;height: 33px;border-radius: 50%;vertical-align: middle;margin-right: 10px;"
                         alt="">
                    {{feedbackData.company_name}}
                </template>
                <template v-if="feedbackData.status === '4'||feedbackData.status === '5'">
                    <i class="iconfont icon-hezuobaoxiangongsi" style="vertical-align: middle;font-size: 18px;"></i>
                    {{feedbackData.inside_audit_remarkname ? feedbackData.inside_audit_remarkname : ''}}
                </template>

            </div>
        </div>
        <div v-else-if="feedbackData.status === '2'" class="feedbackInfo">
            <!--<div v-if="客户待审" class="feedbackInfo">-->
            <span><p>状态</p><br/>{{feedbackData.status | filtStat}}</span>
            <span><p>等待时间</p><br/><Icon type="android-time"></Icon> <span
                    style="color: #3bceb6">{{feedbackData.clientDay}}</span></span>
            <span><p>审核人</p><br/><i class="iconfont icon-hezuobaoxiangongsi"
                                    style="vertical-align: middle;font-size: 18px;"></i>{{feedbackData.company_name}}</span>
        </div>

    </div>

</template>

<script>
    import qs from 'querystring';
    import api from 'api';
    import {mapState} from 'vuex'

    export default {
        props: {
            fileId: {
                type: String
            }
        },
        created() {
        },
        mounted() {
            if (this.fileId) {
                this.init()
            }
            this.companyInfo()
        },
        data() {
            return {
                companyName: '',
                FeedbackValue: '',
                feedbackData: null,
            }
        },
        methods: {
            async init() {
                let {data} = await api.getStageInfo({id: this.fileId});
                if (data.err_code === 0) {
                    let timestamp = new Date().getTime();
                    let clientDate = (timestamp - parseInt(data.create_time) ) / (3600 * 1000);
                    let clientHours = (timestamp - parseInt(data.create_time) ) / (3600 * 1000 * 24);
                    let insideDate = (timestamp - parseInt(data.expect_end_time) ) / (3600 * 1000);
                    let insideHours = (timestamp - parseInt(data.expect_end_time) ) / (3600 * 1000 * 24);

                    let clientDay = parseInt(clientDate) < 1 ? parseInt(clientHours) + '小时' : parseInt(clientDate) + '天';
                    let insideDay = parseInt(insideDate) < 1 ? parseInt(insideHours) + '小时' : parseInt(insideDate) + '天';

                    data.clientDay = clientDay;
                    data.insideDay = insideDay;
                    this.feedbackData = data;
                }

            },
            async companyInfo() {
//                let projectId = sessionStorage.getItem('projectID');
//                let {data} = await api.getProjectInfo({id:projectId});
//                if(data.err_code === 0){
//                    this.companyName = data.demand_company?data.demand_company.company_name:'--'
//                }

            },
            commitEidt(type) {
                this.$emit('commitEidt', {type: type, FeedbackValue: this.FeedbackValue})
            }
        },
        computed: {
            ...mapState({
                identity(value) {
                    return value.project.userStatus
                }
            })
        },
        components: {},
        watch: {
            fileId(value) {
                if (value) {
                    this.init()
                }
            }
        },
        filters: {
            filtStat(val) {
                if (val == 1) {
                    return '内部待审'
                } else if (val == 2) {
                    return '客户待审'
                } else if (val == 3) {
                    return '内部已反馈'
                } else if (val == 4) {
                    return '客户已反馈'
                } else if (val == 5) {
                    return '审核通过'
                } else {
                    return '--'
                }
            }
        }
    }
</script>


<style lang="less" scoped>
    .feedbackInfoContainer {
        .VideoAllowEdit {
            display: flex;
            width: 100%;
            padding: 24px 0 24px 20px;
            background: #eef1f2;
            .text {
                flex: 1;
                margin: 0 20px;
                #EditInput {
                    width: 100%;
                    height: 80px;
                    color: #bdbdbd;
                    border: 1px solid transparent;
                    resize: none;
                }
            }
            .EditInput {
                width: 74%;
                display: inline-block;
                input {
                    border: 0;
                    border-bottom: 1px solid #ddd;
                    padding: 5px 10px;
                    width: 100%;
                    background: none;
                    line-height: 30px;
                    font-size: 14px;
                }
            }
            .EditSub {
                .actionPost {
                    margin-top: 35px;
                    margin-right: 30px;
                }
                button {
                    width: 125px;
                    height: 40px;
                    border-radius: 4px;
                    background: #3dcfb7;
                    color: #fff;
                    line-height: 40px;
                    border: 0;
                    font-size: 14px;
                    cursor: pointer;
                }
                .subPass {
                    margin-top: 35px;
                    &:extend(.VideoAllowEdit .EditSub button);
                    background: #fcc44a;
                }
            }

        }

        .feedbackInfo {
            width: 100%;
            display: flex;
            background: #eef1f2;
            font-size: 14px;
            padding: 10px;

            span {
                flex: 1;
                padding: 0 40px;
            }
            div {
                padding: 0 40px;
            }
            p {

                color: #cacaca;
                display: inline-block;
                margin-bottom: 6px;
            }
        }
    }

</style>
