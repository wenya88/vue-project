<template>
    <div class="newContractData autoHeight">
            <!-- basicInfo -->
            <div class="basicInfo">
                <ul v-show="lineFlag">
                    <li>合同关联项目</li>
                    <li class="line" v-for="item in projectPage" v-if="item.id==myProject">
                        {{item.id==myProject?item.name:''}}
                    </li>
                    <li>合同名称</li>
                    <li class="line">
                        {{contractName}}
                    </li>
                    <li>合同时间</li>
                    <li class="line">
                        {{contractTime[0]}}~{{contractTime[1]}}
                    </li>
                    <li>
                        <span class="span">商务代表</span><span class="span">项目负责人</span>
                        <div class="clear"></div>
                    </li>
                    <li class="line">
                        <span class="span" v-for="item in projectUserData" v-if="item.user_id==agentUser">
                           {{item.user_id==agentUser?item.realname:''}}
                        </span>
                        <span class="span" v-for="item in projectUserData" v-if="item.user_id==projectUser">
                           {{item.user_id==projectUser?item.realname:''}}
                        </span>
                        <div class="clear"></div>
                    </li>
                    <li>甲方公司</li>
                    <li class="line">
                        {{companyA}}
                    </li>
                    <li>
                        <span class="span">对接人</span><span class="span">联系方式</span>
                        <div class="clear"></div>
                    </li>
                    <li class="line">
                        <span class="span" v-for="item in projectUserData" v-if="item.user_id==oneAccess">
                            {{item.user_id==oneAccess?item.realname:''}}
                        </span>
                        <span class="span">
                           {{contact}}
                        </span>
                        <div class="clear"></div>
                    </li>
                </ul>
                <ul v-show="!lineFlag">
                    <li>合同关联项目</li>
                    <li>
                    <Select v-model="myProject" filterable>
                            <Option v-for="item in projectPage" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    </li>
                    <li>合同名称</li>
                    <li>
                        <Input v-model="contractName" placeholder="请输入合同名称"></Input>
                    </li>
                    <li>合同时间</li>
                    <li>
                        <DatePicker :options="dateTime" type="datetimerange" format="yyyy-MM-dd" placeholder="请选择合同起始时间和结束时间" style="width: 500px" @on-change="changeDate"
                        :value="contractTime.length>0?contractTime:''"
                        ></DatePicker>
                    </li>
                    <li>
                        <span class="span">商务代表</span><span class="span">项目负责人</span>
                        <div class="clear"></div>
                    </li>
                    <li>
                        <span class="span">
                            <Select v-model="agentUser" filterable>
                                <Option v-for="item in projectUserData" :value="item.user_id" :key="item.user_id">{{ item.realname }}</Option>
                            </Select>
                        </span>
                        <span class="span">
                            <Select v-model="projectUser" filterable>
                                <Option v-for="item in projectUserData" :value="item.user_id" :key="item.user_id">{{ item.realname }}</Option>
                            </Select>
                        </span>
                        <div class="clear"></div>
                    </li>
                    <li>甲方公司</li>
                    <li>
                        <Input v-model="companyA" @on-enter="companySearch" @on-blur="companySearch" placeholder="请输入完整的甲方公司名称">
                                <Button slot="append" :icon="loadingStatus" @click.native="companySearch" :loading="loading"></Button>
                        </Input>
                    </li>
                    <li>
                        <span class="span">对接人</span><span class="span">联系方式</span>
                        <div class="clear"></div>
                    </li>
                    <li>
                        <span class="span">
                            <Select v-model="oneAccess" filterable>
                                <Option v-for="item in projectUserData" :value="item.user_id" :key="item.user_id">{{ item.realname }}</Option>
                            </Select>
                        </span>
                        <span class="span">
                            <Input v-model="contact" placeholder="请输入联系方式"></Input>
                        </span>
                        <div class="clear"></div>
                    </li>
                </ul>
            </div>
            
            <!-- contractSchedle -->
            <div class="contractSchedle" v-show="contractStatus.length!=0">
                <div class="Flex">
                    <h1>合同进度</h1>
                    <div class="schedle">
                        <ul>
                            <li v-for="(item,index) in contractStatus" :key="index">
                                <div>
                                    <span :class="[item.status==1?'state':'']" :title="item.key">{{item.key}}</span>
                                    <em class="statusInfo">
                                        <em class="Constate">{{item.status==1?'已完成':''}}</em><br/>
                                        <em>{{item.action_time}}</em>
                                    </em>
                                    <div class="clear"></div>
                                </div>
                                <p>
                                    <em v-if="index==Iindex&&contractStatus.length!=index+1">实施中</em>
                                </p>
                                
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="clear"></div>
    </div>
</template>
<script>
var qs=require('querystring');
export default {
    data(){
        return{
            dateTime: {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            loadingStatus:'ios-search',
            loading:false,
            myProject:'',//关联合同项目
            contractName:'',//合同名称
            contractStartTime:'',//合同开始时间
            contractEndTime:'',//合同结束时间
            agentUser:'',//商务代表
            projectUser:'',//项目负责人
            companyA:'',//甲方公司
            companyAID:'', //甲方公司ID
            oneAccess:'',//对接人
            contact:'',//联系方式
            contractTime:[],
            contractStatus:[],
            Iindex:null
        }
    },
    computed:{
        projectPage(){
            return this.$store.state.paySkip.projectData;
        },
        projectUserData(){
            return this.$store.state.paySkip.userData;
        },
        lineFlag(){
            return this.$store.state.paySkip.enterContractFlag;
        }
    },
    mounted(){
        this.autoHeight();
        this.routerGet();
    },
    updated(){
        this.updataContract();
    },
    methods:{
        routerGet(){
            if(this.projectPage.length==0&&this.projectUserData==0){
                this.$router.push('/epibol/contractManage')
            }
        },
        // editContract
        editContract(data){
            this.myProject=data.project_id.toString();
            this.contractName=data.contract_name;
            this.companyA=data.customer_name;
            this.companyAID=data.customer_id;
            this.oneAccess=data.customer_people;
            this.contact=data.customer_phone;
            this.agentUser=data.business_people.toString();
            this.projectUser=data.manager.toString();
            this.contractStartTime=data.start_time;
            this.contractEndTime=data.end_time;
            this.contractTime[0]=data.start_time;
            this.contractTime[1]=data.end_time;
            this.contractStatus=data.status_list;
            
            let Iindex=null
            for(let i=0;i<this.contractStatus.length;i++){
                if(this.contractStatus[i].status==1){
                    Iindex=i
                }
            }
            this.Iindex=Iindex;

        },
        // autoH
        autoHeight(){
            $(".newContractData .autoHeight").height($(window).height()-250);
            $(".contractSchedle").height($(window).height()-290);
        },
        //  发送数据
        updataContract(){
            let obj={
                project_id:this.myProject,
                contract_name:this.contractName,
                customer_id:this.companyAID,
                customer_people:this.oneAccess,
                customer_phone:this.contact,
                business_people:this.agentUser,
                manager:this.projectUser,
                start_time:this.contractStartTime,
                end_time:this.contractEndTime
            }
            this.$bus.emit('addContractData',obj)
        },
        // 改天时间
        changeDate(date){
            this.contractStartTime=date[0];
            this.contractEndTime=date[1];
            this.updataContract();
        },
        // 甲方公司
        companySearch(){
            if(this.companyA==''){
                return
            }
            let _this=this;
            _this.$Loading.start();
            _this.loading=true;
            let url=_this.GLOBAL.baseRouter+'task/company/search-demand';
            let params={
                company_name:_this.companyA
            }
            _this.$axios.post(url,qs.stringify(params)).then(msg=>{
                _this.$Loading.finish();
                _this.loading=false;
                if(msg.data.id!=undefined){
                    _this.loadingStatus='checkmark-circled'
                    _this.companyAID=msg.data.id;
                }else{
                    _this.loadingStatus='close-circled'
                    _this.$Message.error('未找到公司,请重试!')
                }
            },()=>{
                _this.$Loading.error();
            })
        }
    }
}
</script>
<style lang="less">
@import '../../style/contractData.less';
</style>
