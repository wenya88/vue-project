<template>
    <div class="emitInvite">
                <Row :gutter="24">
                    <Col span="12">
                        项目名称<br/>
                        <Input v-model="projectName" style="width:100%" placeholder="输入项目名称"></Input>
                    </Col>
                    <Col span="12">
                        项目预计总额（元）<br/>
                        <Input v-model="projectMinPrice" style="width:47.9%" placeholder="最低金额"></Input> ~
                        <Input v-model="projectMaxPrice" style="width:48%" placeholder="最高金额"></Input>
                    </Col>
                
                    <Col span="12">
                        项目研发时间<br/>
                        <DatePicker type="date" :options="endDateOptions" placeholder="开始" style="width: 47.9%" @on-change="startTime" :value="startDate"></DatePicker> ~
                        <DatePicker type="date" :options="endDateOptions" placeholder="结束" style="width: 48%" @on-change="endTime" :value="endDate"></DatePicker>
                    </Col>
                    <Col span="12">
                        反馈截止时间<br/>
                        <DatePicker type="date" :options="endDateOptions" placeholder="截止时间" style="width: 100%" @on-change="joinEndTime" :value="joinEndDate"></DatePicker>
                    </Col>
                    <Col span=24>
                        项目说明<br/>
                        <Input v-model="description" type="textarea" placeholder="请输入说明" style="width:100%"></Input>
                    </Col>
                    <Col span="24">
                        附件<br/>
                        <Upload
                            ref="fileUpload"
                            :default-file-list="defaultList"
                            multiple
                            :on-success="fileSuccess"
                            :on-remove="fileRemove"
                            :max-size="2048"
                            :on-exceeded-size="fileMaxSize"
                            :action="fileup"
                        >
                            <Button type="ghost" icon="ios-cloud-upload-outline"  style="width:767px">点击/拖入可上传</Button>
                        </Upload>
                    </Col>
                    <Col span="24" v-show="coopComList">
                        选择外包邀请公司({{inviteCompany.length}})<br />
                        <dl>
                            <dt>
                                <Checkbox
                                    :indeterminate="indeterminate"
                                    :value="checkAll"
                                    @click.prevent.native="handleCheckAll">全选</Checkbox>
                                <em>
                                    <Input v-model="searchData" style="width:200px" size="small" placeholder="公司名称" @keyup.13.native="commitSearch">
                                        <Button slot="append" icon="ios-search" size="small" @click="commitSearch"></Button>
                                    </Input>
                                </em>
                            </dt>
                            <dd>
                                <Row :gutter="24">
                                    <CheckboxGroup v-model="inviteCompany" @on-change="checkAllGroupChange">
                                        <Col span="8" v-for="item in coopListData" :key="item.id">
                                            <Checkbox :label="item.company_id">{{item.company}}</Checkbox>
                                        </Col>
                                    </CheckboxGroup>
                                </Row>
                            </dd>
                        </dl>
                    </Col>
                    <Col span="24" v-show="detailsComList">
                        已邀请公司({{detailsData.length}})<br/>
                        <Table :columns="detailsTitle" :data="detailsData" height="230" size="small"></Table>
                    </Col>
                </Row>
    </div>
</template>
<script>
var qs=require('querystring');
export default {
    data(){
        return{
            projectName:'',
            projectMinPrice:'',
            projectMaxPrice:'',
            startDate:null,
            endDate:null,
            joinEndDate:null,
            description:'',
            defaultList:[],
            accFile:[],
            indeterminate: false,
            checkAll: false,
            inviteCompany: [],
            searchData:null,
            coopList:[],
            coopListData:[],
            coopComList:Boolean,
            detailsComList:Boolean,
            Iid:null,
            detailsTitle:[
                {title:'公司名称',key:'company',width:'400'},
                {title:'邀请反馈',key:'status'},
                {title:'联系人',key:'contact_people'},
                {title:'联系电话',key:'tel'}
            ],
            detailsData:[],
            endDateOptions:{
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            }
        }
    },
    computed:{
            fileup(){
                return this.$store.state.paySkip.fileUpload
            },
    },
    mounted(){
        this.coopListGet();
    },
    methods:{
        //清除数据
        ScuessClear(){
            this.clearData()
        },
        // 初始化详情数据
        defauDetails(val){
            this.Iid=val.id;
            this.projectName=val.project_name;
            this.projectMinPrice=val.project_min_price;
            this.projectMaxPrice=val.project_max_price;
            this.startDate=val.start_time;
            this.endDate=val.end_time;
            this.joinEndDate=val.join_end_time;
            this.coopComList=false;
            this.detailsComList=true;
        },
        // 初始化新增数据
        coopCompany(){
            this.Iid=null;
            this.coopComList=true;
            this.detailsComList=false;
        },
        // 清空数据
        clearData(){
            this.projectName='';
            this.projectMinPrice='';
            this.projectMaxPrice='';
            this.startDate='';
            this.endDate='';
            this.joinEndDate='';
            this.description='';
            this.accFile=[];
            this.inviteCompany=[];
            this.defaultList=[];
            this.detailsData=[];
        },
        // 全选
        handleCheckAll () {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;

                if (this.checkAll) {
                    this.inviteCompany = this.coopList;
                } else {
                    this.inviteCompany = [];
                }
            },
            checkAllGroupChange (data) {
                if (data.length === this.coopList.length) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
        },
        // 开始时间
        startTime(date){
            this.startDate=date
        },
        // 结束时间
        endTime(date){
            this.endDate=date
        },
        // 截止时间
        joinEndTime(date){
            this.joinEndDate=date
        },
        // 附件上传
        fileSuccess(res,file){
            this.accFile.push(res.file)
        },
        //删除附件
        fileRemove(res,fileList){
            for(let i=0;i<this.accFile.length;i++){
                if(res.name==this.accFile[i].name){
                    this.accFile.splice(i, 1)
                }
            }
        },
        //超过限制
        fileMaxSize(file){
             this.$Notice.warning({
                title: '文件大小超过限制',
                desc: '文件  ' + file.name + ' 太大了，不超过 2M.'
            });
        },
        // 搜索
        commitSearch(){
            this.coopListGet(this.searchData)
        },
        // 获取公司列表
        coopListGet(search=this.searchData){
            this.coopList=[];
            let url=this.GLOBAL.baseRouter+'task/company/cooperation-list';
            let params={
                demand_id:1,
                search:search,
                page_size:10000
            }
            this.$axios.post(url,qs.stringify(params)).then(msg=>{
                if(msg.data.err_code==0){
                    this.coopListData=msg.data.data
                    msg.data.data.forEach(val => {
                        this.coopList.push(val.company_id)
                    });
                }
            })
        },
        // 发送邀请数据
        emitInviteData(){
            let srtCom=this.inviteCompany.toString();
            let RsrtCom=srtCom.substring(0,srtCom.length);
            let obj={
                demand_id:1,
                project_name:this.projectName,
                project_min_price:this.projectMinPrice,
                project_max_price:this.projectMaxPrice,
                start_time:this.startDate,
                end_time:this.endDate,
                join_end_time:this.joinEndDate,
                description:this.description,
                file:JSON.stringify(this.accFile),
                invite_company:RsrtCom,
            }
            this.$bus.emit('emitInvite',obj)
        },
        // 获取公司列表信息
        companyListInfo(){
            let url=this.GLOBAL.baseRouter+'task/company/invite-info&id='+this.Iid;
            this.$axios.get(url).then(msg=>{
                if(msg.data.err_code==0){
                    if(msg.data.file!=""){
                        this.defaultList=JSON.parse(msg.data.file);
                    }
                    this.detailsData=msg.data.invite_companys;
                    this.description=msg.data.description;
                }
            })
        }
    },
    updated(){
        this.emitInviteData();
    }
}
</script>
