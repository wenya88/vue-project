<template>
    <div class="emitInvite">
        <dl>
            <dt>项目名称</dt>
            <dd><Input v-model="projectName" placeholder="输入项目名称"></Input></dd>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>项目预计总额</dt>
            <dd> <Input v-model="projectMaxPrice" placeholder="项目预计总额"></Input></dd>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>项目研发时间</dt>
            <dd>
                <DatePicker format="yyyy/MM/dd" type="daterange" placeholder="项目研发时间"  @on-change="startTime" style="width:100%" :value="projectDate" ></DatePicker>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>反馈截止时间</dt>
            <dd><DatePicker type="date" :options="endDateOptions" placeholder="截止时间" style="width: 100%" @on-change="joinEndTime" :value="joinEndDate"></DatePicker></dd>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>附件</dt>
            <dd>
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
                    <Button type="ghost" icon="ios-cloud-upload-outline"  style="width:538px">点击/拖入可上传</Button>
                </Upload>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>项目说明</dt>
            <dd>
                <Input v-model="description" type="textarea" placeholder="请输入说明" style="width:100%" :autosize="{minRows: 2,maxRows: 5}"></Input>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl v-show="coopComList">
            <dt>选择外包邀请公司({{inviteCompany.length}})</dt>
            <dd>
                <ul class="ul">
                    <li class="title">
                        <Checkbox
                        :indeterminate="indeterminate"
                        :value="checkAll"
                        @click.prevent.native="handleCheckAll">全选</Checkbox>
                        <em>
                            <Input v-model="searchData" style="width:200px" size="small" placeholder="公司名称" @keyup.13.native="commitSearch">
                                <Button slot="append" icon="ios-search" size="small" @click="commitSearch"></Button>
                            </Input>
                        </em>
                    </li>
                    <li>
                         <CheckboxGroup v-model="inviteCompany" @on-change="checkAllGroupChange">
                            <span class="span" v-for="item in coopListData" :key="item.id">
                                <Checkbox :label="item.company_id">{{item.company}}</Checkbox>
                            </span>
                            <span v-if="coopListData.length==0" class="notCompany">暂无可邀请公司</span>
                        </CheckboxGroup>
                         <div class="clear"></div>
                    </li>
                </ul>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl v-show="detailsComList">
            <dt>已邀请公司({{detailsData.length}})</dt>
            <dd>
                <Table :columns="detailsTitle" :data="detailsData" height="230" size="small"></Table>
            </dd>
            <div class="clear"></div>
        </dl>
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
            projectDate:[],
            detailsTitle:[
                {title:'公司名称',key:'company',width:200},
                {title:'邀请反馈',key:'status',width:100},
                {title:'联系人',key:'contact_people',width:100},
                {title:'联系电话',key:'tel',width:135}
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
            let pTime=[];
            pTime.push(val.start_time);
            pTime.push(val.end_time);
            this.projectDate=pTime;
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
            this.projectDate=[];
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
            this.startDate=date[0];
            this.endDate=date[1];
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
                // project_min_price:this.projectMinPrice,
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
                        this.defaultList=msg.data.file;
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
