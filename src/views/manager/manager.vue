<template>
    <div class="manager_page_all">
        <p class="manager_file_head"><span class="manager_icon iconfont icon-bar-chart"></span>经营概览</p>
        <div class="clearfix manager_page_header" v-if="manager.manager_page_header">
            <div class='left_manager_head'>
                <managaer-in :data='business_concept'></managaer-in>
            </div>
            <div class="right_manager_head">
                <managex :data='business_concept'></managex>
            </div>
        </div>
        <!-- main -->
        <div class="clearfix mangaer_main">
            <Row>
                <!-- 投标 -->

                <Col v-if="manager.mangaer_main_bid" class="mangaer_main_bid" span="8">
                <mangaer-bid :bidList='bid'></mangaer-bid>
                </Col>
                <!-- 签单 -->

                <Col v-if="manager.mangaer_main_Sign" class="mangaer_main_Sign" span="16">
                <div class="mangaer_Sign_children">
                    <mangaer-sign :contList='contract'></mangaer-sign>
                </div>
                </Col>
                <!-- 项目 -->

                <Col v-if="manager.mangaer_main_project" class="mangaer_main_project" span="8">
                <mangaer-pject :jectList='project'></mangaer-pject>
                </Col>
                <!-- 质量 -->

                <Col v-if="manager.mangaer_main_quality" class="mangaer_main_quality" span="8">
                <div class="mangaer_quality_children">
                    <mangaer-qua :quaList='quality'></mangaer-qua>
                </div>
                </Col>
                <!-- 团队 -->
                <Col v-if="manager.mangaer_main_team" class="mangaer_main_team" span="8">
                <div class="mangaer_team_children">
                    <mangaer-tem :teamList='team'></mangaer-tem>
                </div>
                </Col>
            </Row>
        </div>
    </div>
</template>
<script>
    var qs = require('querystring')
    import {mapState} from 'vuex'
    import mangaerBid from './managerBid.vue'
    import mangaerSign from './mangaerSign.vue'
    import mangaerPject from './mangaerPject.vue'
    import mangaerQua from './mangaerQua.vue'
    import mangaerTem from './managaerTem.vue'
    import managaerIn from './managaIn.vue'
    import managex from './managex.vue'
    export default {
        data () {
            return {
                bid: {},
                team: {},
                quality: {},
                project: {},
                contract: [],
                business_concept: {}
            }
        },
        components: {
            mangaerBid,
            mangaerSign,
            mangaerPject,
            mangaerQua,

            mangaerTem,
            managaerIn,
            managex
        },
        mounted () {
            this.getData()
        },
        methods: {
            // 获取数据
            getData () {
                const url = this.GLOBAL.baseRouter+"/task/working-place/manager-wp"
                const items = {
                }
                this.$axios.post(url, qs.stringify(items)).then(data => {
                    const objData = data.data
                    console.log('经理数据', data.data)
                    objData.bid.add = objData.bid.add.split('%')[0]
                    objData.bid.win_rate = Number(objData.bid.win_rate.split('%')[0])
                    objData.quality.outside_pass = objData.quality.outside_pass.split('%')[0]
                    objData.quality.inside_pass = objData.quality.inside_pass.split('%')[0]
                    this.bid = objData.bid
                    this.team = objData.team
                    this.quality = objData.quality
                    this.project = objData.project
                    this.contract = objData.contract
                    this.business_concept = objData.business_concept
                })
            }
        },
        computed:{
            ...mapState({
                manager(value){
                    return value.app.manager
                }
            })
        }
    }
</script>
<style scoped>
    .manager_page_all{
        width: 100%;
        min-height: 100%;

    }
    .manager_file_head{
      height: 80px;
      line-height: 80px;
      font-size: 20px;
    }
    .manager_icon{
      font-size: 20px;
      color: #3bceb6;
      margin-right: 5px;
    }
    .manager_page_header{
        width: 100%;
        height: 120px;
        /* margin-top: 30px; */
    }
    .mag-1{
        width: 10%;
        float: left;
    }
    .mag-2{
        width: 20%;
        float: left;
    }
    .mag-3{
        width: 30%;
        float: left;
    }
    .mag-4{
        width: 40%;
        float: left;
    }
    .mag-5{
        width: 50%;
        float: left;
    }
    .mag-6{
        width: 60%;
        float: left;
    }
    .mag-7{
        width: 70%;
        float: left;
    }
    .mag-8{
        width: 80%;
        float: left;
    }
    .mag-9{
        width: 90%;
        float: left;
    }
    .mag-10{
        width: 100%;
        float: left;
    }
    .left_manager_head{
        width: 50%;
        height: 100%;
        float: left;
        padding-right: 15px;
    }
    .right_manager_head{
        width: 50%;
        height: 100%;
        float: left;
        padding-left: 15px;
    }
    .manager_head_left{
        width: 200px;
        padding-top: 10px;
        float: left;
    }
    .manager_head_right{
        width: calc(100% - 200px);
        float: left;
    }
    .manager_head_right>div{
        height: 100%;
    }
    .manager_page_header>div{
        height: 100%;
    }
    .mangaer_rve,
    .mangaer_rvs{
        border-left: 1px solid rgb(210,210,210);
    }
    .scope_overview{
        font-size: 26px;
        letter-spacing: 5px;
    }
    .mangaer_box_rve,
    .mangaer_box_rves{
        width: 80%;
        height: 100%;
        margin: auto;
        padding-top: 10px;
        /* background: red; */
    }
    .income_msg{
        font-size: 20px;
    }
    .income_msg_details{
        width: 100%;
        margin-top: 20px;
    }
    .receivables{
        float: left;
    }
    .receivables>span:first-child,
    .payment>span:first-child{
        font-size: 16px;
    }
    .receivables>span:last-child,
    .payment>span:last-child{
        font-size: 30px;
        Color: rgb(24,191,164);
        font-weight: 400;
    }
    .payment{
        float: right;
    }
    .mangaer_main{
        width: 100%;
        padding-top: 30px;
    }
    .mangaer_main_bid{
        height: 300px;
        background: rgb(240,240,240);
    }
    .mangaer_Sign_children{
        width: 100%;
        height: 100%;
        background: rgb(240,240,240);
    }
    .mangaer_main_Sign{
        height: 300px;
        padding-left: 30px;
    }
    .mangaer_main_project,
    .mangaer_main_quality,
    .mangaer_main_team{
        /* width: 33.333333%; */
        height: 300px;
        margin-top: 30px;
        /* float: left; */
    }
    .mangaer_main_quality,
    .mangaer_main_team{
        padding-left: 30px;
    }
    .mangaer_quality_children{
        width: 100%;
        height: 100%;
        background: rgb(240,240,240);
    }
    .mangaer_team_children{
        width: 100%;
        height: 100%;
        background: rgb(240,240,240);
    }
</style>

