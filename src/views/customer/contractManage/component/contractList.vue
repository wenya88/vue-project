<template>
    <div>
        <div class="contractRow">
            <dl>
                <dd v-for="(item,index) in contData" :key="index" v-if="item.is_over === 1">
                    <p v-if="item.network === '2'" class="networkSign">电</p>
                    <div class="statusRow">
                        <div :class="[item.status!=0?'status':'status yellow']">
                            <span v-if="item.company_signServiceId&&item.costomer_signServiceId">合同已签章</span>
                            <span v-else> {{item.status_text}}</span>
                        </div>
                        <div class="title">
                            <!--<Dropdown trigger="click" placement="bottom-end">-->
                                <!--<a href="javascript:void(0)">-->
                                    <!--<Icon type="ios-more" size="38"></Icon>-->
                                <!--</a>-->
                                <!--<DropdownMenu slot="list" v-if="">-->
                                    <!--<DropdownItem v-if="item.network === '2'&&!item.company_signServiceId && !item.costomer_signServiceId"-->
                                                  <!--@click.native="networkContDetails(item.id)">编辑-->
                                    <!--</DropdownItem>-->
                                    <!--<DropdownItem-->
                                            <!--v-if="item.network !== '2'||(item.company_signServiceId && item.costomer_signServiceId)"-->
                                            <!--@click.native="contDetails(item.id)">详情-->
                                    <!--</DropdownItem>-->
                                <!--</DropdownMenu>-->
                            <!--</Dropdown>-->
                        </div>
                    </div>
                    <div class="projectName" @click="enter(item)">
                        {{item.contract_name}}
                    </div>
                    <div class="projectMoney" @click="enter(item)">
                        ￥<span>{{item.contract_price}}</span>
                    </div>
                    <div class="projectInfo" @click="enter(item)">
                        <p class="company">
                            <i class="iconfont icon-loudong"></i> {{item.company}}
                        </p>
                        <p class="company">
                            {{item.start_time}} ~ {{item.end_time}}
                        </p>
                    </div>
                </dd>
            </dl>
        </div>
    </div>
</template>
<script>
    var qs = require('querystring');
    import {mapMutations} from 'vuex'
    export default {
        data() {
            return {
                addModal: false,
                modalTitle: null,
                onContractData: Object
            }
        },
        props: {
            contData: {
                type: Array
            }
        },
        filters: {
            filterStat(val) {
                switch (val) {
                    case '1':
                    case '6':
                        return '立即支付'
                        break;
                    case '4':
                    case '9':
                        return '同意结算'
                        break;
                }
            }
        },
        mounted() {
            this.autoH();
        },
        methods: {
            ...mapMutations(['setIsEdit','getContractType']),
            // 初始化高
            autoH() {
                $('.contractRow').height($(window).height() - 210);
            },
            // 电子合同编辑
            networkContDetails(id) {
                this.$store.commit('getContractIDCommit', id);
                this.$router.push('/epibol/addElectronicContract');
            },
            // 详情
            contDetails(id) {
                this.$router.push('/customer/contractData');
                this.$store.commit('getContractIDCommit', id);
            },
            enter(item) {
                if (item.network === '2') {
                    if (item.status <= '0' || (item.status == 1 && (!item.company_signServiceId || !item.costomer_signServiceId))) {
                        this.networkContDetails(item.id)
                        this.setIsEdit(true)
                    } else {
                        this.getContractType(2)
                        this.contDetails(item.id)
                    }
                } else {
                        this.contDetails(item.id)

                }
            }

        }

    }
</script>
