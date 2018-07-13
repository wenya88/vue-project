<template>
    <div class="editContract">
        <Alert type="warning" show-icon v-show="editInfo==13">
            修改说明:
            <template slot="desc">
                {{description}}
            </template>
        </Alert>
        <div class="contractInfo">
            <dl>
                <dd>
                    <em>
                        <b>所属项目</b>
                        <Select v-model="myProject" filterable>
                            <Option v-for="item in projectPage" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </em>
                    <em>
                        <b>甲方公司</b>
                        <Input v-model="companyA" @on-enter="search" @on-blur="search">
                            <Button slot="append" :icon="loadingStatus" @click.native="search" :loading="loading"></Button>
                        </Input>
                    </em>
                    <div class="clear"></div>
                </dd>
                <dd>
                    <em>
                        <b>对接人</b>
                        <Input v-model="oneAccess"></Input>
                    </em>
                    <em>
                        <b>联系方式</b>
                        <Input v-model="contact"></Input>
                    </em>
                    <div class="clear"></div>
                </dd>
                <dd>
                    <em class="block">
                        <b>项目总额</b>
                        <Input v-model="totalNum"></Input>
                    </em>
                    <div class="clear"></div>
                </dd>
                <dd>
                    <em>
                        <b>首付金额</b>
                        <Input v-model="downPay"></Input>
                    </em>
                    <em>
                        <b>尾款金额</b>
                        <Input v-model="finalPay"></Input>
                    </em>
                    <div class="clear"></div>
                </dd>
                <dd>
                    <em>
                        <b>合同开始时间</b>
                        <DatePicker type="date" :options="startData" placeholder="开始时间" style="width:100%" @on-change="startDate" :value="startTiem"></DatePicker>
                    </em>
                    <em>
                        <b>合同结束时间</b>
                        <DatePicker type="date" :options="startData" placeholder="结束时间" style="width:100%" @on-change="endData" :value="endTiem"></DatePicker>
                    </em>
                    <div class="clear"></div>
                </dd>
                <dd>
                    <em>
                        <b>上传合同</b>
                        <file-upload ref="fileUp"></file-upload>
                    </em>
                    <div class="clear"></div>
                </dd>
                <dd>
                    <em>
                        <b>商务代表</b>
                        <Select v-model="agentUser" filterable>
                            <Option v-for="item in projectUserData" :value="item.user_id" :key="item.user_id">{{ item.realname }}</Option>
                        </Select>
                    </em>
                    <em>
                        <b>项目负责人</b>
                        <Select v-model="projectUser" filterable>
                            <Option v-for="item in projectUserData" :value="item.user_id" :key="item.user_id">{{ item.realname }}</Option>
                        </Select>
                    </em>
                    <div class="clear"></div>
                </dd>
            </dl>
        </div>
    </div>
</template>
<script>
import fileUpload from './fileupload';
var qs=require('querystring')
export default {
    data(){
        return{
            editInfo:null,
            description:'',
            startData: {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            loading:false,
            companyA:'',
            loadingStatus:'ios-search',
            //----------------
            myProject:'',
            companyAID:'',
            oneAccess:'',
            contact:'',
            totalNum:'',
            downPay:'',
            finalPay:'',
            startTiem:'',
            endTiem:'',
            accFile:[],
            projectData:[],
            agentUser:'',
            projectUser:'',
            Cid:null,
        }
    },
    mounted(){
        this.$refs.fileUp.setWidth(668) //初始化附件宽度
        this.$bus.on('contractFileData',(val)=>{
            this.accFile=JSON.stringify(val);
        })
    },
    computed:{
        projectPage(){
            return this.$store.state.paySkip.projectData;
        },
        projectUserData(){
            return this.$store.state.paySkip.userData;
        }

    },
    components:{
        fileUpload:fileUpload
    },
    methods:{
        // 搜索
        search(){
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
                console.log(msg.data.id)
            },()=>{
                _this.$Loading.error();
            })
        },
        clearData(){
            this.loadingStatus='ios-search';
            this.companyAID='';
            this.myProject='';
            this.companyA='';
            this.oneAccess='';
            this.contact='';
            this.totalNum='';
            this.downPay='';
            this.finalPay='';
            this.startTiem='';
            this.endTiem='';
            this.accFile=[];
            this.projectData=[];
            this.agentUser='';
            this.projectUser='';
            this.$refs.fileUp.clearFileData();
            this.Cid=null
        },
        updataContract(){
            let obj={
                id:this.Cid,
                project_id:this.myProject,
                company_id:1,
                create_user:sessionStorage.userId,
                contract_price:this.totalNum,
                first_payment:this.downPay,
                last_payment:this.finalPay,
                customer_id:this.companyAID,
                customer_people:this.oneAccess,
                customer_phone:this.contact,
                business_people:this.agentUser,
                manager:this.projectUser,
                files:this.accFile,
                start_time:this.startTiem,
                end_time:this.endTiem
            }
            this.$bus.emit('addContractData',obj)
        },
        startDate(date){
            this.startTiem=date;
        },
        endData(data){
            this.endTiem=data;
        },
        editContractData(data){
            this.Cid=data.id;
            this.myProject=data.project_id;
            this.totalNum=data.contract_price;
            this.oneAccess=data.customer_people;
            this.contact=data.customer_phone;
            this.agentUser=data.business_people_id;
            this.projectUser=data.manager_id;
            this.downPay=data.first_payment;
            this.finalPay=data.last_payment;
            this.startTiem=data.start_time;
            this.endTiem=data.end_time;
            this.accFile=data.files==""?[]:JSON.parse(data.files);
            this.companyA=data.customer_name;
            this.companyAID=data.customer_id;
            if(this.accFile!=""){
                this.$refs.fileUp.defaFile(this.accFile);
            };
            this.editInfo=data.status;
            this.description=data.description;
        }
    },
    watch:{
        accFile(val){
            this.updataContract();
        }
    },
    updated(){
        this.updataContract();
    }
}
</script>
