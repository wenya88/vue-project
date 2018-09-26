<template>
    <div class="newContractData">
        <main-native>
            <div class="main-header-style iconfont"><span class="main-header-title"><i></i>{{$route.meta.title}}</span>
            </div>
        </main-native>
        <!-- ContractNav -->
        <div class="contractNav" v-if="!lineFlag">
            <span :class="[nIndex==0?'spanOne':'']"><s>1</s>基本信息</span>
            <span :class="[nIndex==1?'spanTwo':'']"><s>2</s>费用及付款</span>
            <span :class="[nIndex==2?'spanTwo':'']"><s>3</s>确认合同</span>
            <div class="clear"></div>
        </div>
        <div class="detailsNav" v-else>
            <span @click="nIndex=0" :class="[nIndex==0?'show':'']">基本信息</span>
            <span @click="nIndex=1" :class="[nIndex==1?'show':'']">费用及付款</span>
            <span @click="nIndex=2" :class="[nIndex==2?'show':'']">确认合同</span>
        </div>
        <!-- ContractComponent -->
        <keep-alive>
            <basic-info v-if="nIndex==0" ref="editContract" v-on:changeIsSubmit="changeIsSubmit"></basic-info>
            <contract-cost v-if="nIndex==1" :contractCostData="contractCostData" v-on:changeIsSubmit="changeIsSubmit"
                           ref="costData"></contract-cost>
            <confir-contract v-if="nIndex==2" :filesData="filesData" ref="confir"
                             v-on:changeIsSubmit="changeIsSubmit"></confir-contract>
        </keep-alive>
        <!-- nextRow -->
        <div class="nextRow" v-if="!lineFlag">
            <Button type="success" v-show="nIndex==1||nIndex==2?true:false" @click.native="lastStep">上一步</Button>
            <Button type="success" @click.native="nextStep" v-show="nIndex==2?false:true" :disabled="Bdisabled">下一步
            </Button>
            <Button type="warning" v-show="contrateButton&&nIndex==2" @click="commitContract('img')">保存合同</Button>
        </div>
        <!-- stop -->
    </div>
</template>
<script>
    import {mapState, mapMutations} from 'vuex'

    var qs = require('querystring');
    import basicInfo from './contractData/basicInfo';
    import contractCost from './contractData/contractCost';
    import confirContract from './contractData/confirContract';
    import mainNative from '@/views/main-components/mainNative.vue';

    export default {
        data() {
            return {
                isSubmit: false,
                newData: {},//basicInfo
                newCost: {},//contractCost
                newFileLoad: [],//contractFile
                nIndex: 0,
                componentId: 'basic-info',
                addInfo: '',
                contractCostData: [],
                basicInfoData: {},
                filesData: [],
                Bdisabled: false
            }
        },
        components: {
            mainNative: mainNative,
            basicInfo: basicInfo,
            contractCost: contractCost,
            confirContract: confirContract
        },
        computed: {
            contrateButton() {
                return this.$store.state.paySkip.contrateButton;
            },
            contractID() {
                return this.$store.state.paySkip.contractID
            },
            lineFlag() {
                return this.$store.state.paySkip.enterContractFlag;
            }
        },
        destroyed() {
            this.$store.commit('getContractServerButton', false);
        },
        mounted() {
            this.$bus.on('addContractData', (val) => {
                this.newData = val;
            })
            this.$bus.on("addContractCost", (val) => {
                this.newCost = val;
            });
            this.$bus.on("ContractUploadFile", (val) => {
                this.newFileLoad = val;
            })
            this.$bus.on("Bdisabled", val => {
                this.Bdisabled = val
            })
            this.contractInfo();
        },
        methods: {
            ...mapMutations(['setInfo']),
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
                        let contractCost = [
                            {
                                "price_list": msg.data.price_list,
                                "step_list": msg.data.step_list
                            }
                        ];
                        this.setInfo(msg.data)
                        // 清单及付款
                        this.contractCostData = contractCost;

                        //附件
                        this.filesData = msg.data.files;

                        // 基本信息
                        this.basicInfoData = msg.data;
                        delete this.basicInfoData.price_list;
                        delete this.basicInfoData.step_list;
                        this.$refs.editContract.editContract(this.basicInfoData);

                    }, () => {
                        this.$Message.error("请求失败!")
                        this.$Loading.error();
                    })
                }
            },
            commitContract(type) {

                // 没有修改的时候不能提交
                if (!this.isSubmit) {
                    return
                }



                this.$Loading.start();
                let url = this.GLOBAL.baseRouter + "task/contract/add-contract";
                if (this.newData) {
                    this.newData.network = 1; //传统合同1
                }
                let parms = {
                    basic_list: JSON.stringify(this.newData),
                }
                this.addInfo = '添加成功!'
                // 输入甲方公司需要等待转换成id

                if (this.contractID !== null) {
                    this.addInfo = '修改成功!'
                    url = this.GLOBAL.baseRouter + "task/contract/edit-contract"
                    // 未设置关联项目时要删除
                    if (!this.newData.project_id) {
                        delete this.newData.project_id
                    }

                    // 修改过的付款信息 或者info直接获取的付款信息 否则为空
                    let price = this.contractCostData[0] ? this.contractCostData[0].price_list : ''
                    let step = this.contractCostData[0] ? this.contractCostData[0].step_list : ''
                    // 默认传输字段
                    parms = {
                        contract_id: this.contractID,
                        basic_list: JSON.stringify(this.newData),
                        price_list: JSON.stringify(this.newCost ? this.newCost.price_list : price),
                        step_list: JSON.stringify(this.newCost ? this.newCost.step_list : step)
                    }

                    //线下合同单独上传文件
                    if (type === 'img') {
                        parms.files_list = JSON.stringify(this.newFileLoad)
                    }
                    // 第一步的创建和修改删除付款信息
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
                                this.is_over = 1
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
            // next
            nextStep() {
//            if(this.nIndex === 0){
//              this.commitContract()
//            }
                // 基础信息的下一步
                if (this.nIndex === 0) {
                    if (this.firstSub()) {
                        return
                    }
                }

                // 付款进入下一步
                if (this.nIndex === 1) {
                    if (this.costUpload()) {
                        return
                    }
                }

                if (this.nIndex >= 0 && this.nIndex < 2) {
                    this.nIndex++;
                }
                if (this.nIndex == 1) {
                    this.$nextTick(() => {
                        this.$refs.costData.priceChange();
                    })
                }


                // temporary
            },
            // last
            lastStep() {
                if (this.nIndex > 0) {
                    this.nIndex--;
                }
                if (this.nIndex < 1) {
                    this.Bdisabled = false
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
        }

    }
</script>
<style lang="less" scoped>
    @import '../style/contractData.less';
</style>
