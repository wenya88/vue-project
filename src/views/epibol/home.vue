<template>
    <div class="homePage">
        <!-- 首页头部 -->
        <main-native>
            <div class="main-header-style iconfont"><span class="main-header-title"><i></i>{{this.$route.meta.title}}</span></div>
        </main-native>
        <div class="pageHeader">

        </div>
        <!-- 首页内容 -->
        <div class="pageContent">
            <!-- 公司信息 -->
            <div class="companyInfo">
                <!-- LOGO -->
                <div class="companyLog">
                   LOGO
                </div>
                <!-- content -->
                <div class="contentRow">
                    <p>
                        <span>能力范围</span>
                        <em>人物原画、场景原画、3D模型、3D场景、动作、特效、次世代场景</em>
                        <div class="clear"></div>
                    </p>
                    <p>
                        <span>满意率</span>
                        <em>100%</em>
                        <div class="clear"></div>
                    </p>
                    <p>
                        <span>质量</span>
                        <em>4.96</em>
                        <div class="clear"></div>
                    </p>
                    <p>
                        <span>速度</span>
                        <em>4.96</em>
                        <div class="clear"></div>
                    </p>
                    <p>
                        <span>服务</span>
                        <em>4.96</em>
                        <div class="clear"></div>
                    </p>
                </div>
            </div>
            <!-- 公司内容 -->
            <div class="companyContent">
                 <!-- 头部 -->
                <div class="contentHeader">
                    <div class="companyTitle">
                        <h4>{{companyInfos.company_name}}</h4>
                    </div>
                    <div v-if="standardLibrary" class="companySet" @click="companySet" >
                        <span>设置</span>
                    </div>
                    <div class="clear"></div>
                </div>

                <!-- 内容 -->
                <div class="contentRow">
                    <div class="project" @click="project">
                        <i class="iconfont icon-xiangmu"></i>
                        <span>项目</span>
                    </div>
                    <div  v-if="epibol.callForBids" class="bid" @click="bid">
                        <i class="iconfont icon-toubiao"></i>
                        <span>招标</span>
                    </div>
                    <div v-if="epibol.contract" class="contract" @click="contract">
                        <i class="iconfont icon-hetong"></i>
                        <span>合同</span>
                    </div>
                    <div class="group" @click="group">
                        <i class="iconfont icon-tuandui"></i>
                        <span>团队</span>
                    </div>
                    <div class="statis" @click="statis">
                        <i class="iconfont icon-tongji"></i>
                        <span>统计</span>
                    </div>
                    <!-- <div class="clear"></div> -->
                </div>

            </div>

        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex';
import Cookies from 'js-cookie';
import mainNative from '../main-components/mainNative.vue';
export default {
    data(){
      return{
          companyInfos:{}
      }
    },
    components: {
        mainNative
    },
    methods:{
        companySet(){
            this.$router.push('/epibol/taskClass');
        },
        project(){
            this.$router.push('/epibol/projectManage');
        },
        bid(){
            this.$router.push('/epibol/bidManage');
        },
        contract(){
            if(this.companyInfo.type==1){
                this.$router.push('/customer/contractManage');
            }else{
                this.$router.push('/epibol/contractManage');
            }
        },
        group(){
            this.$router.push('/epibol/memberManager');
        },
        statis(){
            this.$router.push('/epibol/statistics');
        }
    },
    computed:{
        ...mapState({
            standardLibrary(data){
                return data.app.standardLibrary
            },
            epibol(data){
                return data.app.epibol
            },
            companyInfo(data){
                return data.paySkip.company
            }
        })
    },
    created(){
        this.companyInfos = JSON.parse(decodeURI(Cookies.get('company')));
    }
}
</script>

<style lang="less">
@import './home/style/home.less';
</style>
