<template>
    <!-- 招标详情 -->
    <div class="appDetails">
        <main-native>
            <div class="main-header-style iconfont"><span class="main-header-title"><i></i>{{this.$route.meta.title}}</span></div>
        </main-native>
          <!-- 信息 -->
        <div class="detailsList">
            <div class="detailHead">
                <span class="projectName">{{detailsData.test_name}}</span>
                <span class="projectStatus" :class="{'okStatus':okStatua}"><Icon type="ios-minus-outline"></Icon> {{taskStatusText}}</span>
                <span class="projectStage">测试</span>
                <Icon class="hrartIco" type="heart"></Icon>
            </div>

            <div class="Tabs">
                <span v-for="(tab,index) in tabsInfo.tabsArr" :class="{'Tabchecked':index == tabsInfo.currenIndex}" @click="tabsInfo.currenIndex = index">{{tab.tabTitle}}</span>
            </div>

            <template v-if="tabsInfo.currenIndex==0">
                <dl>
                    <!--<dd><span>外包方</span><em>{{detailsData.demand_company_name||'暂无'}}</em><div class="clear"></div></dd>-->
                    <dd><span>所属项目</span><em>{{detailsData.test_name}}</em><div class="clear"></div></dd>
                    <!--<dd><span>测试金额</span><em class="num">￥{{detailsData.test_price||'0.00'}}</em><div class="clear"></div></dd>-->
                    <dd><span>项目预计总额</span><em class="num">￥{{detailsData.project_max_price||'0.00'}}</em><div class="clear"></div></dd>
                    <dd><span>投搞截止</span><em class="num">{{detailsData.end_time||'00:00:00'}}</em><div class="clear"></div></dd>
                    <dd><span>实施人员</span>
                        <em>
                            <Select v-model="pesValue1" :disabled="disabledFlag" style="width:100px" size="small" :placeholder="detailsData.execute_user_name||'未指定'" @on-change="changeUserName(detailsData.id)">
                                <Option v-for="item in personnel" :value="item.id" :key="item.id">{{ item.remark_name||'暂无' }}</Option>
                            </Select>
                        </em>
                        <div class="clear"></div>
                    </dd>
                    <dd><span>负责人员</span>
                        <em>
                            <Select v-model="pesValue2" :disabled="disabledFlag" style="width:100px" size="small" :placeholder="detailsData.leader_name||'未指定'" @on-change="changeUserName(detailsData.id)">
                                <Option v-for="item in personnel" :value="item.id" :key="item.id">{{ item.remark_name||'暂无' }}</Option>
                            </Select>
                        </em>
                        <div class="clear"></div>
                    </dd>
                    <dt>任务类型</dt>
                    <dd>
                        <Icon type="android-color-palette" style="font-size: 20px;color: #1ac0df"></Icon>
                        <em>类型是啥？</em>
                        <div class="clear"></div>
                    </dd>
                    <!--<dt>稿件要求</dt>-->
                    <dd class="description">
                        {{detailsData.file_require == null ? '暂无' : detailsData.file_require||'暂无'}}
                    </dd>
                    <dt>参考文件</dt>
                    <dd style="line-height: 20px">
                        <ul>
                            <li v-for="item in detailsData.file" style="padding: 5px 0">
                                {{item.name | substring}}
                                <em><a :href="JSON.parse(item.response).file_url" :download="item.name" target="_blank"><i class="icon iconfont icon-xiazai"></i></a></em>
                            </li>
                        </ul>
                        <div class="clear"></div>
                    </dd>
                    <dt>其他说明</dt>
                    <dd style="line-height: 25px">
                        {{detailsData.description ? detailsData.description : '暂无' }}
                    </dd>
                </dl>
            </template>
            <template v-else>
                <ul class="testLogList" v-if="testTaskLog">
                    <li v-for="li in testTaskLog">
                        <span class="timeLog">{{li.create_time | timeCover}}</span>
                        <span class="textLog">{{li.text}}</span>
                    </li>
                </ul>
            </template>
        </div>
        <!-- 文件 -->
        <div class="bottomDivSty">
            <div class="detailsComponent">
                <div v-if="isHaveFile" class="notIMG">暂无文件</div>
                <filebrowse v-else ref="filebrowse"></filebrowse>
            </div>
        </div>
    </div>
</template>
<script>
// import BidImgEdite from '../../../project/components/BidImgEdit';
import mainNative from '../../../main-components/mainNative.vue';    //公用头文件
import filebrowse from "../../../project/components/fileBrowseManager.vue";        //公共资源类型组件
var qs=require('querystring');
import api from 'api';
import {mapState, mapMutations} from 'vuex';
import Cookies from 'js-cookie';
export default {
    data(){
        return{
            okStatua:false,
            detailsData:{},
            personnel:[],
            pesValue1:'',
            pesValue2:'',
            fileType:'NULL',
            tabsInfo:{
                tabsArr:[
                    {'tabTitle':'基本'},
                    {'tabTitle':'日志'}
                ],
                currenIndex:0
            },
            isHaveFile:true,
            taskStatusText:'进行中',
            testTaskLog:[],
            disabledFlag:false,
            userPost:{
                postName:'',
                postId:null
            },

        }
    },
    components:{
        mainNative:mainNative,
        filebrowse:filebrowse
    },
    methods:{
        ...mapMutations(['setTaskInfo', 'changeComponentTaskID', 'changeComponentFileURl']),
        //获取基础数据
        async init(){
            let userInfos = JSON.parse(Cookies.get('company'));
            let id = this.$route.params.id;
            let type = this.$route.params.type;

            const TestTaskInfo = await api.getTestTaskInfo(id);
            const companyUserList = await api.getcompanyUserList({company_id:userInfos.company_id});
            const TestTaskBidInfos = await api.getTestTaskBidinfos({bid_id:id,type:type});
            const TestTaskLog = await api.getTestTaskLog({bid_id:id})

            if(TestTaskInfo.data.err_code == 0){
                this.detailsData = TestTaskInfo.data||{};
            }
            if(companyUserList.data.err_code == 0){
                this.personnel = companyUserList.data.data||[];
            }
            if(TestTaskLog.data.err_code == 0){
                this.testTaskLog = [...TestTaskLog.data.data]
            }
            if(TestTaskBidInfos.data.err_code == 0){
                let isData = TestTaskBidInfos.data.data.upload;
                TestTaskBidInfos.data.data.is_test = 1;
                if(isData!=false){
                    let status = isData.status;
                    if(status == 1){
                        this.taskStatusText = '待审核';
                        this.okStatua = false;
                    }else if(status == 2){
                        this.taskStatusText = '已通过';
                        this.okStatua = true;
                    }else if(status == 3){
                        this.taskStatusText = '未通过';
                        this.okStatua = false;
                    }
                    this.isHaveFile = false;
                    let mainFile = isData.file.filter(function (crren,index,arr) {
                        return crren.is_main == 1;
                    })

                    this.changeComponentTaskID(id);
                    this.changeComponentFileURl(mainFile[0].file);
                    this.$nextTick(function () {
                        this.$refs.filebrowse.initFileBrowse(id,mainFile[0].type,TestTaskBidInfos.data.data);  //招标ID，文件类型,数据信息
                    })
                }else {
                    this.taskStatusText = '进行中';
                    this.isHaveFile = true;
                    this.okStatua = false;
                }
            }
        },
        //改变实施人员
        async changeUserName(id){

            let data={
                bid:this.detailsData.id,
                execute_user:this.pesValue1,
                leader_user:this.pesValue2
            }
            const setRelatedUser = await api.setRelatedUser(data);
            if(setRelatedUser.data.err_code == 0){
                this.$Message.success(setRelatedUser.data.err_message);
                this.$bus.emit('setExecuteUser');
            }
        },
        //获取当前用户post
        userInfos(){
            let Infos = JSON.parse(Cookies.get('company'));
            switch (Infos.post_id){
                case '1':
                    this.userPost.postName = '经理';
                    this.userPost.postId = '1';
                    this.disabledFlag = false;
                    break;
                case '2':
                    this.userPost.postName = '组长';
                    this.userPost.postId = '2';
                    this.disabledFlag = false;
                    break;
                case '3':
                    this.userPost.postName = '成员';
                    this.userPost.postId = '3';
                    this.disabledFlag = true;
                    break;

            }
        }
    },
    mounted(){
        //动态设置高度
        $('.appDetails').height($(window).height()-112);
        this.userInfos();
    },
    created(){
        //获取基础数据
        this.init();
    },
    filters:{
        substring:function (val) {
            return val.length > 30 ? '...'+val.substring(val.length,15):val;
        },
        timeCover:function (val) {
            let day = new Date(val * 1000);
            return day.getFullYear()+'-'+(day.getMonth()+1)+'-'+day.getDate()
        }
    }
}
</script>
<style lang="less" scoped>
@green:#3bceb6;
.appDetails{
   margin-top: 30px;
    .detailsList{
        float:left;width:23%;padding: 15px 20px;height: 100%;background: #fff;border-radius: 5px;min-width: 300px;overflow:auto;
        .detailHead{
            height: 30px;
            line-height: 30px;
            .projectName{
                font-size: 16px;
                margin-right: 10px;
            };
            .projectStatus{
                background: orange;
                color: #fff;
                padding: 3px 10px;
                border-radius: 10px;
                margin-right: 10px;
            };
            .okStatus{
                background: @green !important;
            }
            .projectStage{
                border: 1px solid @green;
                padding: 2px;
                border-radius: 3px;
                color: @green;
            }
            .hrartIco{
                float: right;
                color: #de1111;
                line-height: 30px;
                font-size: 18px;
            }
        }
        .Tabs{
            display: flex;
            margin-top: 10px;
            span{
                display: inline-block;
                width: 50%;
                border: 1px solid #f3f3f3;
                text-align: center;
                padding: 4px 0;
                cursor: pointer;
                font-size: 13px;
                border-radius: 3px;
                &.Tabchecked{
                    color: @green;
                }
            }
        }
        dd{
            line-height:45px;
            border-bottom: 1px solid #f9f9f9;
            span{
                float: left;
                color: #b1b1b1;
                font-size: 13px;
            }
            em{
                float: right;font-style:normal;
                font-size: 14px;
                color: #7d7777;
                a{
                    color:@green;
                    &:hover{
                        text-decoration-line:underline;
                    }
                }
            }
            .num{
                color:@green;
            }
            .file{
                color:#888;
            }
        }
        dt{
            margin-top:20px;font-size:14px;color: #b1b1b1;font-size: 13px;
        }
        .description{
            background:#fafafa;border:1px solid #f0f0f0;padding:5px;line-height:18px;margin-top:10px;border-radius:6px;color: #9e9c9c;
        }
        .downFile{
            cursor: pointer;
        }

        .testLogList{
            margin-top: 10px;
            li{
                padding: 10px 0;
                .timeLog{color: @green;font-size: 13px;}
                .textLog{margin-left: 20px;color: #b1b1b1;font-size: 12px}
            }
        }
    }
    .bottomDivSty{
        margin-left:24%;height: 100%;display: flex;flex-direction: column;justify-content: space-between;
        .detailsComponent{
            border-radius: 5px;
            overflow: hidden;
            height: 100%;
            .notIMG{
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                padding: 0!important;
            }
        }
        .footerStatus{
            /*display: inline-block;*/
            height: 14%;
            border: 1px solid red;
        }
    }
    }


</style>
