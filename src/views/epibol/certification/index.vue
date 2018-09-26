<template>
    <div class="companyInformation">
        <ul class="navList">
            <li v-for="(item,index) in navList" :key="index" @click="changeNav(index)"
                :class="{'navActive':currentNav === index}">{{item}}
            </li>
        </ul>
        <section class="infoList">
            <keep-alive>
                <company-certification v-if="currentNav === 0"></company-certification>
                <company-signature v-if="currentNav === 1"></company-signature>
            </keep-alive>
            <company-contract ref="contract"  :pageType="currentNav === 2?1:0" v-if="currentNav === 2||currentNav === 3" :key="currentNav"></company-contract>

            <!--<company-agent  ref="agent" v-if="currentNav === 3" ></company-agent>-->
        </section>
    </div>
</template>

<script>
    import companyCertification from './companyCertification' // 企业认证
    import companySignature from './companySignature'  // 电子签名
    import companyContract from './companyContract'     // currentNav === 2 签章人 currentNav === 3 经办人
//    import companyAgent from './companyAgent'     // 经办人
    export default {
        name: 'companyInformation',
        created() {
        },
        mounted() {

        },
        data() {
            return {
                currentNav: 0,
                navList: ['企业认证', '电子签名', '签章人','经办人']
            }
        },
        methods: {
            changeNav(index) {
                this.currentNav = index
            }
        },
        computed: {},
        components: {
            companyCertification,
            companySignature,
            companyContract,
//            companyAgent
        }
    }
</script>

<style lang="less" scoped>
    .companyInformation {
        height: 100%;
        display: flex;
        padding: 30px 0;
        .navList {
            min-width: 350px;
            height: 230px;
            padding: 28px;
            margin-right: 27px;
            background: #fff;
            border-radius: 4px;
            li {
                height: 44px;
                padding-left: 46px;
                line-height: 44px;
                color: #777777;
            }
            .navActive {
                background: #ccf2ec;
            }
        }
        .infoList {
            flex: 1;
            background: #fff;
            border-radius: 4px;
        }
    }
</style>
