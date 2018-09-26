<template>
    <div class="ProjectHomePage">
        <main-native>
            <div class="main-header-style iconfont"><span class="main-header-title"><i></i>{{this.$route.meta.title}}</span></div>
        </main-native>
        <!-- 首页头部 -->
        <Row>
            <Col span="24">
                <div class="pageHeader"></div>
            </Col>
        </Row>

        <!-- 首页内容 -->
        <div class="pageContent">
            <Row>
                <Col span="8">
                    <!-- 公司信息 -->
                    <div class="companyInfo">
                        <!-- LOGO -->
                        <div class="companyLog">
                            <img :src="proData.picture" alt="">
                        </div>
                        <!-- content -->
                        <div class="contentRow">
                            <p>
                                <span>负责人</span>
                                <em>{{proData.leader_name!=null?proData.leader_name:'暂无'}}&nbsp;</em>
                            </p>
                            <p>
                                <span>项目时间</span>
                                <em>{{proData.start_time}}~{{proData.end_time}}</em>
                                <em>{{proData.day_num}} 工作日</em>
                            </p>
                            <p>
                                <span>甲方公司</span>
                                <em>{{proData.demand_company==null?'暂无':proData.demand_company.company_name}}</em>
                            </p>
                            <p>
                                <span>甲方对接人</span>
                                <em>{{proData.demand_company==null?'暂无':proData.demand_company.company_people}}</em>
                            </p>
                        </div>
                    </div>
                </Col>
                <Col span="16">
                    <!-- 公司内容 -->
                    <div class="companyContent">
                        <!-- 头部 -->
                        <div class="contentHeader">
                            <div class="companyTitle">
                                <h4>{{proData.name}}&nbsp;</h4>
                                <h5>{{proData.description!=null?proData.description:'项目描述和备注'}}</h5>
                            </div>
                            <div v-if="projectSet.self" class="companySet" @click="companySet">
                            <span>设置</span>
                            </div>
                            <div class="clear"></div>
                        </div>

                        <!-- 内容 -->
                        <div class="contentRow">
                            <div class="taskTitle">
                                <b>资源管理</b> <span>浏览和审核资源</span>
                            </div>
                             <div class="taskRow">
                                <home-echart></home-echart>
                            </div>
                            <div class="MenuRows" v-if="companyType == 0">
                                <ul>
                                    <li v-if="projectSet.projectTask" @click="task">
                                        <img src="./home/image/MenuIco1.png"/>
                                        <div>
                                            <p>任务</p>
                                            <span>制作计划并管理任务或需求</span>
                                        </div>
                                    </li>
                                    <li>
                                        <img src="./home/image/MenuIco2.png"/>
                                        <div>
                                            <p>沟通</p>
                                            <span>沟通关于项目的一切</span>
                                        </div>
                                    </li>
                                    <li v-if="projectSet.projectMember" @click="group">
                                        <img src="./home/image/MenuIco3.png"/>
                                        <div>
                                            <p>团队</p>
                                            <span>管理项目团队</span>
                                        </div>
                                    </li>
                                    <li v-if="projectSet.projectStatistics"  @click="statistics">
                                        <img src="./home/image/MenuIco4.png"/>
                                        <div>
                                            <p>统计</p>
                                            <span>获得您所需的数据</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    </div>
</template>
<script>
var qs=require('querystring')
import vFlare from '@/components/d3flare'
import mainNative from '../main-components/mainNative.vue';
import homeEchart from './components/homeEchart.vue';
import {mapState} from 'vuex';
import Cookies from 'js-cookie';
export default {
    data(){
        return{
            proData:[],
            width:null,
            companyType:JSON.parse(Cookies.get('company')).type
        }
    },
    mounted(){
        this.get();
        this.flare();

    },
    methods:{
        companySet(){
            this.$router.push('/project/setting');
        },
        task(){
            this.$router.push('/project/task');
        },
        group(){
            this.$router.push('/project/projectMember');
        },
        statistics(){
            this.$router.push('/project/statistics');
        },
        get(){
            let _this=this;
            let url=_this.GLOBAL.baseRouter+'task/project/project-info';
            let params={
                id:sessionStorage.projectID
            }
            _this.$Loading.start();
            _this.$axios.post(url,qs.stringify(params)).then(msg=>{
                _this.$Loading.finish();
                if(msg.data.err_code==0){
                    _this.proData=msg.data
                }else{
                    _this.$Message.error(msg.data.err_message)
                }
            },()=>{
                _this.$Loading.error();
                _this.$Message.error('请求失败!')
            })

        },
        flare(){
            this.$nextTick(() => {
                if(this.$refs.resouer){
                    this.width = this.$refs.resouer.offsetWidth+'';
                }
            })
        }
    },
    computed:{
        ...mapState({
            projectSet(data){
                return data.app.projectSet
            }
        })
    },
    components:{
        vFlare,
        mainNative,
        homeEchart
    },

}
</script>
<style lang="less">
 @import './home/style/home.less';
</style>
