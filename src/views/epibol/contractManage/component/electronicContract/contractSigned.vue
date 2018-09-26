<template>
    <div class="contractSignedContainer">
        <div class="cpmtractMain">
            <iframe class="pdf-viewer" v-if="pdfUrl" :src='`/static/pdf/web/viewer.html?file=${pdfUrl}`' width="100%"
                    height="100%">
                您的浏览器不支持PDF阅读
            </iframe>
        </div>
        <!--获取验证码-->
        <Modal
                v-model="modal1"
                class="signatureCode"
                width="350"
                @on-ok="ok"
                @on-cancel="cancel">
            <!--<section slot="header" style="opacity: 0">11</section>-->

            <section>
                <p class="text" v-if="codeTime===0">没有收到合同签章码?
                    <Button type="primary" @click="getTsignCode">点击获取</Button>
                </p>
                <p class="text" v-else>签章确认码已发送（{{codeTime}}）</p>
                <p class="prompt">发送至手机“{{phone}}” ，请注意查收！</p>

                <p class="title"><i class="icon">!</i>输入签章确认码代表自愿签署合同</p>
                <Input v-model="code" placeholder="输入签章确认码" style="width: 270px"></Input>
            </section>
            <Button slot="footer" type="primary" @click="submit">确认签章</Button>


        </Modal>
        <!--不符合条件的弹窗-->
        <Modal
                v-model="modal2"
                class="signaturePrompt"
                width="350"
                @on-ok="ok"
                @on-cancel="cancel">
            <p slot="header" style="color: #fff">无法完成合同签章</p>

            <ul class="promptList" v-if="promptInfo.confirm[0]">
                <p >成功签章我方需满足以下条件</p>
                <li><span>完成公司认证</span>
                    <Icon  :class="{'green':promptInfo.confirm[0].is_confirm}" type="checkmark-circled"></Icon>
                </li>
                <li>完善公司电子签名资料
                    <Icon :class="{'green':promptInfo.confirm[0].is_sign}" type="checkmark-circled"></Icon>
                </li>
                <li>指定公司“签章人”
                    <Icon :class="{'green':promptInfo.confirm[0].is_signer}" type="checkmark-circled"></Icon>
                </li>
            </ul>

            <Button slot="footer" type="primary" @click="modal2 = false">我知道了</Button>
        </Modal>
        <!--成功-->
        <Modal
                v-model="modal3"
                class="signaturePrompt"
                width="350"
        >
            <p style="color: #fff" slot="header">我方成功签署合同</p>
            <div slot="footer">
                <Button @click="lookContract()" type="primary">查看合同</Button>
                <Button @click="toList()">返回合同列表</Button>
            </div>

        </Modal>
    </div>
</template>

<script>
    import api from 'api'
    import {mapState} from 'vuex'

    export default {
        created() {
        },
        mounted() {
            this.getTsignPdf()
            this.getPhone()
        },
        data() {
            return {
                modal1: false,
                modal2: false,
                modal3: false,
                codeTime: 120,
                phone: null,
                code: '',
                pdfUrl: null,
            }
        },
        methods: {
            // 验证码时间
            setCodeTime() {
                if (this.codeTime <= 0) {
                    this.codeTime = 120
                }
                const timeId = setInterval(() => {
                    this.codeTime--
                    if (this.codeTime <= 0) {
                        this.codeTime = 0
                        clearInterval(timeId)
                    }
                }, 1000)
            },
            // 签章弹窗
            showSignature() {
                this.modal1 = true
                this.getTsignCode()
            },
            // 获取验证码
            async getTsignCode() {
                if (this.codeTime !== 120) {
                    return
                }
                let {data} = await api.getTsignCode()
                if (data.err_code === 0) {
                    this.setCodeTime()
                }
            },
            async getTsignPdf() {
                this.$Spin.show({
                    render: (h) => {
                        return h('div', [
                            h('Icon', {
                                'class': 'demo-spin-icon-load',
                                props: {
                                    type: 'load-c',
                                    size: 18
                                }
                            }),
                            h('div', 'pdf生成中，请稍后')
                        ])
                    }
                });
                let {data} = await api.getTsignPdf({contract_id: this.contractId})
                if (data.err_code === 0 && data.data) {
                    await   this.ajax(data.data)
                }
            },
            ajax(url) {
                let a = 0
                const ajax = new XMLHttpRequest()
                ajax.open('post', url)
                ajax.onreadystatechange = (res) => {
                    if (res.currentTarget.status === 200) {
                        this.pdfUrl = url
                        this.$Spin.hide();
                    }
                }
                ajax.send()

                const timeId = setInterval(() => {
                    const ajax = new XMLHttpRequest()
                    ajax.open('post', url)
                    ajax.onreadystatechange = (res) => {
                        a++
                        if (res.currentTarget.status === 200) {
                            this.pdfUrl = url
                            this.$Spin.hide();
                            clearInterval(timeId)
                        }
                        else if (a >= 10) {
                            this.$Message.error('数据请求发生错误');
                            this.$Spin.hide();
                            clearInterval(timeId)

                        }

                    }
                    ajax.send()
                }, 1000)
            },
            async submit() {
                if (this.code === '') {
                    this.$message.error('验证码不能为空')
                    return false
                }
                this.modal1 = false
                let {data} = await api.getCreateCertificate({code: this.code, contract_id: this.contractId})
                if (data.err_code === 0) {
                    this.$emit('showSigna')
                    this.modal3 = true
                    this.getTsignPdf()
                } else if (data.err_code === 1) {
                    this.$Message.error(data.err_message)
                }
            },
            // 获取手机号
            async getPhone() {
                let {data} = await api.getconfirmInfo()
                /*已认证*/
                if (data.err_code === 0 && data.data) {
                    let formData = data.data
                    this.phone = formData.signer_phone
                }
            },
            // 进入合同列表页
            toList() {
                this.modal3 = false
                this.$router.push({path: '/epibol/contractManage'})
            },
            lookContract() {
                this.modal3 = false
            },

            ok() {
            },
            cancel() {
            },
        },
        computed: {
            ...mapState({
                contractId(value) {
                    return value.paySkip.contractID
                },
                promptInfo(value) {
                    return value.paySkip.promptInfo
                },

            })
        },

        components: {}
    }
</script>

<style lang="less" scoped>
    .contractSignedContainer {
        position: relative;
        width: 100%;
        height: 100%;
        .confirmContract {
            display: flex;
            /*position: absolute;*/
            /*left: 0;*/
            /*bottom: 0;*/
            /*width: 100%;*/
            /*text-align: center;*/
            /*line-height: 40px;*/
            .company {
                flex: 1;
                display: flex;
                i {
                    font-size: 30px;
                }
                span {
                    margin-left: 15px;
                    .title {
                        color: #bdbdbd;
                    }
                    .name {
                        color: #777777;
                    }
                }
            }
        }
        .cpmtractMain {
            height: 100%;
            margin-top: 30px;
            border: 1px solid #eef1f2;
            padding: 25px 40px;
        }
    }

    .signatureCode,.signaturePrompt {
        .text {
            font-size: 16px;
            color: #48d0b9;
        }
        .prompt {
            border-bottom: 1px solid #d7dde4;
            padding: 15px 0;
            margin-bottom: 15px;
            color: #ccc;
        }
        .title {
            font-size: 14px;
            margin-bottom: 10px;
            color: #fcc44a;
            .icon {
                display: inline-block;
                width: 13px;
                height: 13px;
                margin-right: 5px;
                color: #fcc44a;
                border: 1px solid #fcc44a;
                border-radius: 50%;
                text-align: center;
                line-height: 13px;
            }
        }
        .promptList {
            font-size: 16px;
            p {
                margin-bottom: 10px;
            }
            li {
                display: flex;
                margin-bottom: 5px;
                font-size: 14px;
                justify-content: space-between;
                .green{
                    color: #3bceb6;
                }
            }
        }

    }
</style>
<style lang="less">
    .signatureCode {
        .ivu-modal-header {
            background: #fff;
        }
    }

    .signatureCode, .signaturePrompt {

        .ivu-modal-footer {
            border-top: 1px solid transparent;
        }
    }
</style>


