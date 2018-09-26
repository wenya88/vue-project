<template>
    <div style="height: 100%">
        <div class="certificationSealerContainer" v-if="isAttestation">
            <!--是否获取信息-->
            <template v-if="formData.signer&&pageType||!pageType">
                <!--经办人-->
                <section class="agentContainer" v-if="pageType===0">
                    <div class="title">
                        <Button type="primary" @click="operatorShow">
                            <Icon type="ios-plus-outline" size="16"></Icon>
                            添加经办人
                        </Button>
                    </div>
                    <!--<div class="agentList operatorInfoList" >-->
                    <!--<div v-for="(item,index) in operatorList" :key="index">-->
                    <!--{{item.remark_name}}-->
                    <!--</div>-->
                    <!--</div>-->
                    <section v-for="(item,index) in operatorList" :key="index" class=" agentContainerList">
                        <div class="signTextContainer">
                            <p class="signText">经办人</p>
                        </div>
                        <div class="operatorInfo">
                            <div class="operatorExhibition">
                                <div>
                                    <img v-if="item.headimage" :src="item.headimage" alt="">
                                    <img v-else src="../../../images/leader.png" alt="">
                                </div>
                                <span>{{item.remark_name}}</span>
                                <Icon type="chatbox-working"></Icon>
                            </div>
                            <ul class="agentInfoList">
                                <li><span style="color: #cfcfcf;">实名认证</span>
                                    <p>
                                        <Icon :class="{'green':item.is_confirm}" type="checkmark-circled"
                                              size="16"></Icon>
                                    </p>
                                </li>
                                <li><span style="color: #cfcfcf;">电子签名</span>
                                    <p>
                                        <Icon :class="{'green':item.is_sign}" type="checkmark-circled"
                                              size="16"></Icon>
                                    </p>
                                </li>
                                <li><span style="color: #cfcfcf;">职能</span>
                                    <p>{{item.post_name}}</p></li>
                                <li><span style="color: #cfcfcf;">联系方式</span>
                                    <p>{{item.phone}}
                                        <Icon
                                                style="padding: 0 8px;color:#62d8c5 " type="checkmark-circled"
                                                size="16"></Icon>
                                        已认证
                                    </p>
                                </li>

                            </ul>
                        </div>
                        <div class="editButton">
                            <Icon type="edit" @click.native="operatorShow" class="icon"></Icon>
                            <Icon type="trash-a" @click.native="delOperator(item)" class="icon"></Icon>
                        </div>
                    </section>


                </section>
                <!-- 签章人-->
                <section v-else-if="pageType===1" class="operatorList">
                    <div class="signTextContainer">
                        <p class="signText">签章人</p>
                        <span @click="operatorShow">更换签章人</span>
                    </div>
                    <div class="operatorInfo">
                        <div class="operatorExhibition">
                            <div>
                                <img :src="formData.signer_headimage" alt="">
                            </div>
                            <span>{{formData.signer_name}}</span>
                            <Icon type="chatbox-working"></Icon>
                        </div>
                        <ul class="operatorInfoList">
                            <li><span style="color: #cfcfcf;">职务</span><span>{{formData.signer_post}}</span></li>
                            <li><span style="color: #cfcfcf;">手机</span><span>{{formData.signer_phone}}<Icon
                                    style="padding: 0 8px;color:#62d8c5 " type="checkmark-circled" size="16"></Icon>已认证</span>
                            </li>
                            <li><span style="color: #cfcfcf;">实名认证</span>
                                <Icon :class="{'green':formData.is_confirm}" type="checkmark-circled"
                                      size="16"></Icon>
                            </li>
                        </ul>
                    </div>
                </section>
                <section class="promptContainer">
                    <p class="title">说明</p>
                    <ul class="promptList" v-if="pageType">
                        <li>1、合同签章人负责电子合同最后签章</li>
                        <li>2、团队成员才能设置为签章人</li>
                        <li>3、签章人必须完善手机信息，并通过验证</li>
                        <li>4、电子合同经经办人确认后，签章人才能电子签章</li>
                    </ul>
                    <ul v-else class="promptList">
                        <li>1、合同经办人负责合同条款的确认</li>
                        <li>2、团队成员才能设置为经办人</li>
                        <li>3、公司设置经办人才能建立电子合同</li>
                        <li>4、被指派为经办人成员，须完善实名认证与电子签名资料完才能生成有效电子合同</li>
                        <li>5、经办人确认电子合同条款后，才能继续电子签章</li>
                    </ul>
                </section>
            </template>
            <div v-else style="margin-top: 300px;height: 100%;text-align: center;">
                <div v-if="pageType===1" @click="operatorShow">
                    <p>点击设置签章人</p>
                    <p>公司拥有签章人才能完成电子合同签章</p>
                </div>
                <div v-else @click="operatorShow">
                    <p>点击设置经办人</p>
                    <p>公司拥有经办人才能完成合同</p>
                </div>
            </div>


        </div>
        <h3 v-else style="margin-top: 300px;height: 100%;text-align: center;">请先完成企业认证</h3>
        <Modal
                class="addOperatorModal"
                v-model="modal1"
                width="662"
                ok-text="确认增加"
                @on-ok="submit"
                :title="pageType?'修改签章人':'增加合同经办人'"
        >
            <ul class="signTextContainerList">
                <li v-for="(item,index) in sealerNameList" :key="index" @click="selectSigner(item,index)"
                    :class="{'activeButton':item.active}">
                    <img v-if="item.headimage" class="headImage" :src="item.headimage"></img>
                    <img v-else class="headImage" src="../../../images/leader.png"></img>
                    <div :title="item.remark_name" class="title">{{item.remark_name}}</div>
                    <Icon v-if="!item.active" class="icon" type="ios-plus-outline" size="16"></Icon>
                    <Icon v-else :class="[{'green':item.active},'icon']" size="16" type="checkmark-circled"></Icon>
                </li>
            </ul>
        </Modal>
    </div>
</template>

<script>
    import api from 'api'

    export default {
        created() {
            this.initsealer()
            this.getOperatorList()

            this.initCurrent()
        },
        mounted() {

            this.$bus.on('attestation', () => {
                this.attestation()
            })


        },
        props: {
            pageType: {
                type: Number
            }
        },
        data() {
            return {
                operatorList: [],// 经办人列表
                modal1: false,
                value: '',
                formData: {
                    work: '',
                    signer_phone: '',
                    is_confirm: false,
                    signer_headimage: '',
                    signer: '',
                    signer_name: '',
                    signer_post: '',
                },
                signer_name: '',
                signer_phone: '',
                headimage: '',
                sealerNameList: [],
                isAttestation: false,
                user_id: [],
                signer: [],

            }
        },
        methods: {

            operatorShow() {
                this.active()
                this.modal1 = true
                this.user_id = []

            },
            //信息初始化
            async initCurrent() {
                let {data} = await api.getconfirmInfo()
                if (data.err_code === 0 && data.data) {
                    /*已认证*/
                    this.attestation()

                    if (this.pageType === 1) {
                        this.formData = data.data
                        this.formData.signer_headimage = this.formData.signer_headimage || require('../../../images/leader.png')
                    }
//                    this.value = formData.signer_phone ? `${formData.signer_name}(${formData.signer_phone})` : formData.signer_name
//                    this.headimage
                }
            },

            // 签章人信息列表
            async initsealer() {

                let {data} = await api.getSignerList()
                this.sealerNameList = data.data
                this.active()
            },
            //选择
            selectSigner(item, index) {
                this.sealerNameList.map((item, i) => {
                    if (index === i) {
                        this.$set(item, 'active', true)
                    } else if (this.pageType) {
                        this.$set(item, 'active', false)
                    }
                })
                if (this.pageType === 1) {
                    this.signer = item.user_id
                } else {
                    this.user_id.push(item.user_id)
                }

            },
            active() {
                if (this.sealerNameList) {
                    this.sealerNameList.map((item) => {
                        this.$set(item, 'active', false)
                    })

                    this.sealerNameList.map((items, index) => {
                        if (this.pageType) {
                            if (this.formData.signer === items.user_id) {
                                this.$set(items, 'active', true)
                            }
                        }
                        else {
                            this.operatorList.map((item, idx) => {
                                if (items.user_id === item.operator_id) {
                                    this.$set(items, 'active', true)
                                }
                            })
                        }
                    })

                }
            },
            operatorActive() {
                this.sealerNameList.map((items, index) => {

                })
            },
            // 添加签章人
            async submit() {

                if (this.pageType === 1) {
                    let {data} = await api.getTsignSigner({
                        signer: this.signer,
                    })
                    if (data.err_code === 0) {
                        this.$Message.success(data.err_message);
                        this.initCurrent()
                        this.initsealer()
                    } else {
                        this.$Message.error(data.err_message);
                    }
                } else {
                    this.addOperator()
                }

            },

            attestation() {
                this.isAttestation = true
            },
            /*--------------------------------------    经办人api    --------------------------------------*/
            // 已选择经办人列表
            async getOperatorList() {
                let {data} = await api.getOperatorList()
                if (data.err_code === 0 && data.data) {
                    this.operatorList = data.data
                }
            },
            // 添加经办人
            async addOperator() {
                let isAdd = false
                if (this.user_id) {
                    await Promise.all(this.user_id).then(async (item) => {
                        let {data} = await api.setOperator({operator: item})
                        if (data.err_code === 0) {
                            isAdd = true
                        }
                    })
                    if (isAdd) {
                        this.getOperatorList()
                    }
                }
            },
            //删除经办人
            async delOperator(item) {
                let {data} = await api.delOperator({operator: item.operator_id})
                if (data.err_code === 0) {
                    this.getOperatorList()
                    this.$Message.success(data.err_message)
                } else {
                    this.$Message.error(data.err_message)

                }
            },
        },
        computed: {},
        components: {}
    }
</script>

<style lang="less" scoped>
    @green: #62d8c5;
    .certificationSealerContainer {
        padding: 30px;
        display: flex;
        .agentContainerList, .operatorList {
            flex: 1;
            margin-right: 30px;
            border: 1px solid #eef1f2;
            border-radius: 4px;
            .signTextContainer {
                position: relative;
                height: 55px;
                padding-right: 30px;
                text-align: right;
                line-height: 55px;
                overflow: hidden;
                .signText {
                    position: absolute;
                    top: 6px;
                    left: -30px;
                    width: 100px;
                    height: 26px;
                    text-align: center;
                    line-height: 26px;
                    transform: rotate(-45deg);
                    color: #fff;
                    background: @green;
                }
                span {
                    color: @green;
                    cursor: pointer;
                }
            }

        }
        .agentContainerList {
            position: relative;
            height: 230px;
            margin-top: 30px;
            .editButton {
                position: absolute;
                top: 0;
                right: 0;
                .icon {
                    padding: 5px;
                    margin: 10px 5px 0 0;
                    color: #bebebe;
                    font-size: 16px;
                    cursor: pointer;
                }
            }
        }
        .operatorList {
            height: 370px;
        }
        .operatorInfo {
            display: flex;
            height: 89%;
            padding: 0 30px 78px 0;
            .operatorExhibition {
                width: 240px;
                text-align: center;
                border-right: 1px dashed #e0e0e0;
                img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                }
            }
            .agentInfoList, .operatorInfoList {
                width: 100%;
                padding: 0 0 0 35px;
                li {
                    margin-bottom: 100px;
                    justify-content: space-between;
                    .green {
                        color: #62d8c5;
                    }
                }
            }
            .operatorInfoList {
                li {
                    display: flex;
                }
            }
            .agentInfoList {
                display: flex;
                li {
                    text-align: center;
                    flex: 1;
                    p {
                        margin-top: 90px;

                    }
                }
            }

        }
        .promptContainer {
            min-width: 400px;
            height: 500px;
            background: #fefaf2;
            color: #777777;
            .title {
                height: 50px;
                padding-left: 30px;
                line-height: 50px;
                border-bottom: 1px solid #fdeabf;

            }
            .promptList {
                padding: 30px 0 0 30px;
                li {
                    margin-bottom: 30px;
                }
            }
        }
        .agentContainer {
            flex: 1;
            margin-right: 30px;

            .title {
                text-align: right;
            }

        }

    }

</style>
<style lang="less">
    .addOperatorModal {
        .ivu-modal-footer {
            border-top: 1px solid transparent;
        }
        .ivu-modal-body {
            padding: 32px 40px 0 40px;
        }
        .signTextContainerList {
            display: flex;
            flex-wrap: wrap;
            text-align: center;
            li {
                display: flex;
            }
            .title {
                width: 70px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap
            }

            .activeButton {
                display: flex;
                border: 1px solid #62d8c5 !important;

            }
            .green {
                color: #62d8c5 !important;
            }
            li {
                min-width: 120px;
                max-width: 120px;
                height: 40px;
                padding: 5px 0;
                margin-right: 20px;
                margin-bottom: 30px;
                line-height: 30px;
                border: 1px solid #eef1f2;
                border-radius: 4px;
                cursor: pointer;
                .headImage {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                }

                span, .headImage {
                    vertical-align: middle;
                }
                .icon {
                    margin-top: 7px;
                }
            }
            li:nth-of-type(4n) {
                margin-right: 0 !important;
            }

        }

    }
</style>


