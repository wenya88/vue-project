<template>
    <div class="electronicContractContainer">
        <main-native>
            <div class="main-header-style iconfont"><span class="main-header-title"><i></i>{{$route.meta.title}}</span>
            </div>
        </main-native>
        <div class="contractContainer">
            <ul class="stepList">
                <li v-for="(item,index) in stepList" :key="index" @click="selectStep(index,'nav')"
                    :class="{'active':nameKey === index}">{{item}}
                    <Icon v-if="index !== 0&&(nameKey+1 !== index)&&(nameKey !== index)" class="icon"
                          type="ios-arrow-right"></Icon>
                    <i v-if="index !== 0" :class="[{'triangle':nameKey+1 === index},'icon1']"></i>
                </li>
            </ul>
            <div class="contract">
                <section class="contractMain">
                    <div style="height: 90%;">
                        <keep-alive>
                            <basic-info v-if="nameKey==0" ref="editContract"
                                        v-on:changeIsSubmit="changeIsSubmit"></basic-info>
                            <contract-cost v-if="nameKey==1" :contractCostData="contractCostData"
                                           v-on:changeIsSubmit="changeIsSubmit"
                                           ref="costData"></contract-cost>
                            <confirm-contract :aCertified="aCertified" :bCertified="bCertified"
                                              v-on:showSigna="showSignaShow" ref="contract"
                                              v-if="nameKey==2"></confirm-contract>
                            <contract-signed ref="signed" v-if="nameKey==3"></contract-signed>
                        </keep-alive>
                    </div>

                </section>
                <section class="contractPrompt">
                    <contract-prompt ref="prompt" :nameKey="nameKey"></contract-prompt>
                </section>
            </div>
        </div>
        <!--<div class="nextRow">-->
        <!--<Button type="success" v-show="nameKey!==0" @click.native="lastStep">上一步-->
        <!--</Button>-->
        <!--<Button type="success" @click.native="nextStep" v-show="nameKey!==stepList.length-1">下一步-->
        <!--</Button>-->
        <!--</div>-->
        <div class="submitButton" style="">
            <Button v-if="nameKey===1" type="primary" style="margin-top: 10px" @click="nameKey = 0">上一步</Button>
            <Button v-if="nameKey===0||nameKey===1" type="primary" style="margin-top: 10px"
                    @click="selectStep(nameKey+1)">下一步
            </Button>
            <!--确认合同-->
            <Button v-if="nameKey===2 && confirmButton" type="primary" style="margin-top: 10px"
                    @click="confirmContract">确认合同
            </Button>
            <!--<Button v-if="nameKey===2 && !confirmButton" type="primary" style="margin-top: 10px">合同已确认</Button>-->
            <!--签章-->
            <div v-if="nameKey===3" class="sign">
                <Button v-if="confirmInfo&&!confirmInfo.signer_name">无签章权限</Button>
                <template v-else-if="showSigna">
                    <i class="icon">!</i><span>双方确认签章后该合同将有具有法律效应，请仔细确认合同条款</span>
                    <Button type="primary" @click="showSignature">确认签章</Button>
                </template>
            </div>
        </div>
    </div>
</template>

<script>

    const stepList = ['基础信息', '费用及付款', '确认合同', '合同签章'];
    import qs from 'querystring'
    import Cookies from 'js-cookie'
    import {mapState, mapMutations, mapActions} from 'vuex'
    import api from 'api'
    import mainNative from '@/views/main-components/mainNative.vue';
    import basicInfo from '@/views/epibol/contractManage/component/contractData/basicInfo'
    import contractCost from '@/views/epibol/contractManage/component/contractData/contractCost'
    import confirmContract from './confirmContract'     // 确认
    import contractSigned from './contractSigned'       // 签章
    import contractPrompt from './contractPrompt'       // 提示

    export default {
        created() {
        },
        mounted() {
            this.$bus.on('addContractData', (val) => {
                this.newData = val;
            })
            this.$bus.on("addContractCost", (val) => {
                this.newCost = val;
            });

            this.getCompanyType()
            this.contractInfo()
            this.refresh()
            this.getconfirmInfo() // 获取签章信息

        },
        data() {
            return {
                isSubmit: false,
                showSigna: true,
                companyType: null, // 公司甲乙  0 乙 1甲
                basicInfoData: {},
                contractCostData: [],
                nameKey: 0,
                stepList: stepList,     //步骤条
                guide: false,            //提示引导
                newData: null,
                newCost: null,
                is_over: 0,
                aCertified: false,
                bCertified: false,
            }
        },
        methods: {
            ...mapActions(['getconfirmInfo']),
            ...mapMutations(['setContractId', 'setInfo']),
            //确认公司甲乙
            getCompanyType() {
                if (Cookies.get('company')) {
                    this.companyType = JSON.parse(Cookies.get('company')).type;
                }
            },
            contractInfo() {
                if (this.contractID != null) {
                    this.$Loading.start();
                    let url = this.GLOBAL.baseRouter + "task/contract/contract-info";
                    let params = {
                        "contract_id": this.contractID
                    }
                    this.$axios.post(url, qs.stringify(params)).then(msg => {
                        this.$Loading.finish();
                        this.contractCostData = [];
                        this.setInfo(msg.data)
                        let contractCost = [
                            {
                                "price_list": msg.data.price_list,
                                "step_list": msg.data.step_list
                            }
                        ];
                        // 清单及付款
                        this.contractCostData = contractCost;
                        // 基本信息
                        this.basicInfoData = msg.data;
                        delete this.basicInfoData.price_list;
                        delete this.basicInfoData.step_list;

                        // 1信息已完善 0未完善
                        this.is_over = msg.data.is_over
                        // 信息完善
                        if (this.is_over === 1) {
                            this.$refs.prompt.initPrompt()
                        } else {
                            this.$refs.prompt.initPrompt(true)
                        }

                        this.activeButton(msg)


                        this.$refs.editContract.editContract(this.basicInfoData);

                    }, () => {
                        this.$Message.error("请求失败!")
                        this.$Loading.error();
                    })
                } else {
                    this.$refs.prompt.initPrompt(true)
                }
            },
            // 确认合同
            async confirmContract() {

                if (this.companyType === 0) {
                    // 乙
                    let {data} = await api.getConfirmContract({contract_id: this.contractID})
                    if (data.err_code === 0) {
                        // 成功
                        this.bCertified = true
                        this.$refs.contract.getTsignPdf() // 修改pdf
                    }
                } else {
                    // 甲
                    this.setContractStatus()
                }

            },
            // 合同和签章按钮状态
            activeButton(msg) {
                // 根据状态是否可编辑
                if (this.companyType === 1) {
                    this.$store.commit('changContractStatus', true)

                }
                else if (msg.data.status === 1) {
                    this.$store.commit('changContractStatus', true)
                }

                // 乙方
                if (msg.data.company_text === '确认合同') {

                    this.bCertified = true
//                    this.$refs.contract.changeCertified(0, true)
                }
                // 甲方
                if (msg.data.customer_text === '合同已确认') {
                    this.aCertified = true
//                    this.$refs.contract.changeCertified(1, true)
                }

                // 签章
                if ((msg.data.company_signServiceId && this.companyType === 0) || (msg.data.costomer_signServiceId && this.companyType === 1)) {
                    this.showSigna = false
                }

            },
            showSignaShow() {
                this.showSigna = false
            },
            refresh() {
                if (this.companyType === 1 && !this.contractID) {
                    this.$router.back(-1)
                }
            },
            //添加合同和新增
            commitContract() {
                // 没有修改的时候不能提交
                if (!this.isSubmit) {
                    return
                }


                this.$Loading.start();
                let url = this.GLOBAL.baseRouter + "task/contract/add-contract";
                if (this.newData) {
                    this.newData.network = 2; //电子合同2
                }
                let parms = {
                    basic_list: JSON.stringify(this.newData),
                }
                this.addInfo = '添加成功!'


                if (this.contractID !== null) {
                    this.addInfo = '修改成功!'
                    url = this.GLOBAL.baseRouter + "task/contract/edit-contract"
                    // 未设置关联项目时要删除
                    if (!this.newData.project_id) {
                        delete this.newData.project_id
                    }

                    let price = this.contractCostData[0] ? this.contractCostData[0].price_list : ''
                    let step = this.contractCostData[0] ? this.contractCostData[0].step_list : ''

                    parms = {
                        contract_id: this.contractID,
                        basic_list: JSON.stringify(this.newData),
                        price_list: JSON.stringify(this.newCost ? this.newCost.price_list : price),
                        step_list: JSON.stringify(this.newCost ? this.newCost.step_list : step)
                    }

                    if (this.contractCostData[0] && this.contractCostData[0].price_list.length === 0) {

                        delete  parms.price_list
                    }
                    if (this.contractCostData[0] && this.contractCostData[0].step_list.length === 0) {
                        delete  parms.step_list
                    }

                }
                this.$axios.post(url, qs.stringify(parms)).then(msg => {
                    if (msg.data.err_code > 0) {
                        this.$Message.warning(msg.data.err_message);
                    } else {
                        this.isSubmit = false
                        if (this.contractID !== null) {
                            // 更新
                            this.$Message.success(this.addInfo);
                            // 必须是第二步更新
                            if (this.newCost) {
                                console.log('验证第一步更新的情况')
                                this.is_over = 1
                                this.$refs.prompt.initPrompt()
                                this.$refs.contract.getTsignPdf()
                            }
                        } else {
                            //添加
                            this.$store.commit('getContractIDCommit', msg.data.err_message.data.id);//传contrac_ID
                        }
                    }
                }, () => {
                    this.$Loading.error();
                    this.$Message.error('提交失败！')
                })
            },
            showSignature() {
                // 信息未认证
                if (!this.confirmInfo) {
                    this.$refs.signed.modal2 = true //弹窗提示
                    return false
                }
                this.$refs.signed.showSignature()
            },
            // 下一步
            selectStep(index, type) {

                if (type === 'nav' && !this.is_over) {
                    return false
                }


                // 基础信息进入下一步
                if (this.nameKey === 0 && index === 1) {
                    if (this.newData.customer_id === '0') {
                        this.$Message.info('请等待公司验证');
                        return
                    } else if (this.firstSub()) {
                        return
                    }
                }

                // 付款进入下一步
                if (this.nameKey === 1 && index === 2) {
                    if (this.costUpload()) {
                        return
                    }
                }


                if (index === 3 && (!this.bCertified || !this.aCertified)) {
                    return
                }

                this.nameKey = index;


                // 改变通知状态
                if (this.$refs.prompt) {
                    this.$refs.prompt.changePrompt(this.nameKey)
                }


            },
            firstSub() {
                let contractName = this.$refs.editContract.contractName;
                let contractTime = this.$refs.editContract.contractTime;
                let agentUser = this.$refs.editContract.agentUser;
                let projectUser = this.$refs.editContract.projectUser;
                let companyA = this.$refs.editContract.companyA;
                let oneAccess = this.$refs.editContract.oneAccess;
                let contact = this.$refs.editContract.contact;
                if (!contractName || !contractTime || !agentUser || !projectUser || !projectUser || !companyA || !oneAccess || !contact) {
                    this.$Message.error('请先完善信息')
                    return true
                }

                this.commitContract()

            },
            costUpload() {
                let key = this.$refs.costData.priceData[0].key != '';
                let finish_date = this.$refs.costData.priceData[0].key != '';
                let unitprice = this.$refs.costData.priceData[0].unitprice != null;
                let count = this.$refs.costData.priceData[0].count != 0;

//                let contractNum = this.$refs.costData.contractPayDate[0].num != 0;
//                let contractAmount = this.$refs.costData.contractPayDate[0].amount != '';
//                let contractNum1 = this.$refs.costData.contractPayDate[1].num != 0;
//                let contractAmount1 = this.$refs.costData.contractPayDate[1].amount != '';


                if (!key || !unitprice || !count) {
                    this.$Message.error('请先完善信息')
                    return true
                }
//                if (!key  || !unitprice || !count || !contractNum || !contractAmount || !contractNum1 || !contractAmount1) {
//                    this.$Message.error('请先完善信息')
//                    return true
//                }
                this.commitContract()
            },
            changeIsSubmit() {
                this.isSubmit = true
            },
            // 甲方确认
            setContractStatus() {
                this.$Loading.start();
                let url = this.GLOBAL.baseRouter + 'task/demand-contract/set-contract-status';
                let params = {
                    "contract_id": this.contractID,
                    "status": 0
                }
                this.$axios.post(url, qs.stringify(params)).then(msg => {
                    this.$Loading.finish();
                    if (msg.data.err_code == 0) {
                        // 甲成功
                        this.aCertified = true
                        this.$refs.contract.getTsignPdf() // 修改pdf
                    } else {
                        this.$Message.error(msg.data.err_message)
                    }
                })

            },
            lastStep() {
                this.nameKey--
            }, nextStep() {
                this.nameKey++
            },
        },
        computed: {
            ...mapState({
                confirmInfo(value) {

                    return value.paySkip.confirmInfo
                }
            }),
            contractID() {

                return this.$store.state.paySkip.contractID
            },
            // 确认按钮
            confirmButton() {
                // 甲
                if (this.companyType === 1 && this.aCertified) {
                    return false
                } else if (this.companyType === 0 && this.bCertified) {
                    return false
                }
                return true
            }

        },
        components: {
            mainNative,
            basicInfo,
            contractCost,
            contractPrompt,
            confirmContract,
            contractSigned,

        }
    }
</script>


<style lang="less" scoped>
    .electronicContractContainer {
        height: 100%;
        /*padding-bottom: 30px;*/
        padding-top: 30px;

        .contractContainer {
            height: 92%;
            padding: 30px;
            background: #fff;
            border-radius: 4px;
            overflow: hidden;
            .stepList {
                display: flex;
                margin-bottom: 30px;
                .active {
                    color: #48d0b9;
                    background: #d2f2ec;
                    .icon1 {
                        background: #d2f2ec;
                    }
                }
                .triangle {

                    border-left: 20px solid #d2f2ec !important;

                }
                li {
                    position: relative;
                    flex: 1;
                    height: 35px;
                    line-height: 35px;
                    text-align: center;
                    color: #777777;
                    background: #eef1f2;
                    .icon {
                        position: absolute;
                        top: 50%;
                        left: 0;
                        font-size: 50px;
                        color: #fff;
                        transform: translateY(-50%);
                        z-index: 3;
                    }
                    .icon1 {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 0;
                        height: 0;
                        border-top: 18px solid transparent;
                        border-left: 20px solid #eef1f2;
                        border-right: 20px solid transparent;
                        border-bottom: 17px solid transparent;
                        color: #dcdcdc;
                        background: #eef1f2;
                        /*transform: translateY(-50%);*/
                    }
                }
            }
            .contract {
                display: flex;
                height: 100%;
                .contractMain {
                    flex: 7;
                    height: 100%;
                    margin-right: 8%;

                }
                .contractPrompt {

                    flex: 3;
                }

            }

        }
        .submitButton {
            margin-top: 2%;
            text-align: right;

        }
        .sign {
            span {
                margin: 0 12px;
                color: #fd989c;

            }
            .icon {
                display: inline-block;
                width: 13px;
                height: 13px;
                color: #fd989c;
                border: 1px solid #fd989c;
                border-radius: 50%;
                text-align: center;
                line-height: 13px;
                /*background: red;*/
            }
        }

    }
</style>
