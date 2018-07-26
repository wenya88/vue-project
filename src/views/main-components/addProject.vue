<template>
    <div>
        <div slot="header" style="height:30px;">
            <b class="font16">{{projectTitle}}</b>
        </div>
        
        <div class="addRow">
            <dl>
                <dt>项目合同</dt>
                <dd>
                    <Select v-model="proCont" filterable  style="width: 400px">
                        <Option v-for="item in ContList" :value="item.id" :key="item.id">{{ item.company_name }}   合同编号:{{item.contract_id}}</Option>
                    </Select>
                </dd>
                <dt>项目名称</dt>
                <dd>
                    <Input v-model="proName" placeholder="输入项目名称" style="width: 400px"></Input>
                </dd>
                <dt>开始时间</dt>
                <dd>
                    <DatePicker type="date" placeholder="开始时间" style="width: 180px" @on-change="HstartDate" :value="startDate"></DatePicker>
                    <span class="span">至</span>
                    <DatePicker type="date" placeholder="结束时间" style="width: 180px" @on-change="HendDate" :value="endDate"></DatePicker>
                </dd>
                <dt>项目图片 <span>[说明：图片小于1M，限JPG，PNG格式，建议大小100*70]</span></dt>
                <dd style="width:235px;">
                    <div class="ImaUpload">
                        <div class="demo-upload-list" v-for="item in uploadList">
                            <template v-if="item.status === 'finished'">
                                <img :src="item.url">
                                <div class="demo-upload-list-cover">
                                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)" size="30"></Icon>
                                </div>
                            </template>
                            <template v-else>
                                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                            </template>
                        </div>
                        <Upload
                            ref="upload"
                            :show-upload-list="false"
                            :on-success="handleSuccess"
                            :max-size="2048" 
                            :format="['jpg','jpeg','png']"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            :before-upload="handleBeforeUpload"
                            type="drag"
                            :action="fileup"
                            style="display:block;width:100%;">
                            <div style="width:100%;display:block;padding:33px 10px 33px 10px;">
                                <p style="font-size:16px;"><Icon type="plus"></Icon> 上传图片</p>   
                            </div>
                        </Upload>
                    </div>
                </dd>
                <dt>状态</dt>
                <dd>
                    <i-switch size="large" v-model="state" @on-chanage="chanState">
                        <span slot="open">开启</span>
                        <span slot="close">暂停</span>
                    </i-switch>
                </dd>
                <dt>项目标签</dt>
                <dd>
                    <Tag v-for="item in count" :key="item" :name="item" closable @on-close="Closelabel">{{ item }}</Tag>
                    <Button icon="ios-plus-empty" type="dashed" size="small" @click.stop="Addlabel">
                        增加
                        <div class="addLabel" v-show="addLabDIV">
                            <Input v-model="LabelVal" placeholder="请输入标签" style="width: 100px;" @keyup.13.native="submitLabel($event)" autofocus></Input>
                            <Button type="primary" size="small" @click.native.stop="submitLabel" @on-enter="submitLabel">添加</Button>&nbsp;
                            <Button size="small" @click.stop="closeAddDIV">取消</Button>
                        </div>
                    </Button>
                </dd>
                <dt>项目经理</dt>
                <dd>
                    <Tag v-for="(item,index) in manageCount" :key="item.name" :name="item.name" closable @on-close="CloseManage" @click.native="editTtag(index)">{{ item.name }}</Tag>
                    <Button icon="ios-plus-empty" type="dashed" size="small" @click.native="AddManage" v-if="manageCount.length>0?false:true">
                        添加项目经理    
                        <div class="addLabel" v-show="addManageDIV" style="width:245px;">
                            <Select v-model="MangageVal" filterable  style="width: 140px;" class="MangaSelect">
                                <Option v-for="item in manageData" :value="item.id" :key="item.id">{{ item.realname }}</Option>
                            </Select>
                            <Button type="primary" size="small" @click.native.stop="submitManage">添加</Button>&nbsp;
                            <Button size="small" @click.native.stop="closeManageDIV">取消</Button>
                        </div>
                    </Button>
                </dd>
                
            </dl>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            Pid:0,
            proCont:'',
            ContList:[],
            proName:'',
            startDate:'',
            endDate:'',
            count: [],
            manageCount:[],
            state:true,
            uploadList:[],
            uploadurl:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3429908815,845996252&fm=27&gp=0.jpg',
            url:[],
            LabelVal:'',
            MangageVal:'',
            addLabDIV:false,
            addManageDIV:false,
            manageData:[],
            FocusLabelVal:false,
            projectTitle:'新建项目'
        }
    },
    computed:{
        fileup(){
            return this.$store.state.paySkip.fileUpload
        },
    },
    methods:{
        // 编辑标签
        editTtag(item){
            this.MangageVal=item;
            this.addManageDIV=true;
            this.manageCount.splice(0,1)
        },
        // 开始时间
        HstartDate(date){
            this.startDate=date;
            this.EmitData();
        },
        // 结束时间
        HendDate(date){
            this.endDate=date;
            this.EmitData()
        },
        // 添加标签
        Addlabel () {
            this.addLabDIV=true;
            this.LabelVal=''
        },
        submitLabel(){
            this.count.push(this.LabelVal);
            this.addLabDIV=false;
            this.FocusLabelVal=true;
        },
        closeAddDIV(){
            this.addLabDIV=false;
        },
        // 删除标签
        Closelabel (event, name) {
                const index = this.count.indexOf(name);
                this.count.splice(index, 1);
        },
        // 添加经理
        AddManage () {
            this.addManageDIV=true;
            this.MangageVal=''
        },
        submitManage(){
            if(this.MangageVal==''){
                 this.$Message.error('不能为空！');
                return
            }else{
                let MListObj={}
                this.manageData.forEach(val=>{
                    if(val.id==this.MangageVal){
                        MListObj.name=val.realname;
                    }
                })
                this.manageCount.push(MListObj);
                this.addManageDIV=false;
            }
            
        },
        closeManageDIV(){
            this.addManageDIV=false;
        },
        // 删除经理
        CloseManage (event, name) {
                const index = this.manageCount.indexOf(name);
                this.manageCount.splice(index, 1);
        },
        // 状态改变
        chanState(){
            this.state=!this.state
        },
        // 图片上传
        handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleSuccess (res, file) {
            file.url = this.url;
            this.uploadurl=this.uploadList[0].response.file.url;
            // this.$bus.emit('MainFile',this.uploadList)
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式是不正确的',
                desc: '文件格式 ' + file.name + ' 不正确，请选择jpg或png格式.'
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '文件大小超过限制',
                desc: '文件  ' + file.name + ' 太大了，不超过 2M.'
            });
        },
        handleBeforeUpload (file) {
            this.url=window.URL.createObjectURL(file);
        },
        // 获取公司合同和管理人员列表
        getCont(){
            let _this=this;
            let url=_this.$axios.get(_this.GLOBAL.baseRouter+'task/project/get-contract-list&company_id='+1);
            let manageURL=_this.$axios.get(_this.GLOBAL.baseRouter+'task/project/get-company-member');
            _this.$axios.all([url,manageURL]).then(([msgData,ManageData])=>{
                _this.ContList=msgData.data.data;
                _this.manageData=ManageData.data.data;
            })
        },
        // 发送数据
        EmitData(){
            let obj={}
            obj.proCont=this.proCont,
            obj.proName=this.proName,
            obj.startDate=this.startDate,
            obj.endDate=this.endDate,
            obj.count=this.count,
            obj.manageCount=this.MangageVal,
            obj.state=Number(this.state)==1?1:2,
            obj.uploadurl=this.uploadurl,
            obj.Pid=this.Pid
            this.$bus.emit("AddProInfo",obj);
            
        }
    },
    mounted(){
        this.uploadList = this.$refs.upload.fileList;
        this.getCont();
        this.$bus.on("submitOk",()=>{
            if(this.$refs.upload.fileList.length>0){
                this.$refs.upload.fileList.splice(0)
            };
            this.proCont="";
            this.proName="";
            this.startDate="";
            this.endDate="";
            this.count=[];
            this.state=true;
            this.manageCount=[];
        });
        this.$bus.on("EditProData",(val)=>{
           this.Pid=val.EPid;
           this.proCont=val.EPcontract;
           this.proName=val.EPname;
           this.startDate=val.EPstartTime;
           this.endDate=val.EPendTime;
           this.count=val.EPtag==''?[]:val.EPtag;
           this.uploadurl=val.EPpicture;
           this.state=val.EPstatus==2?false:true;
           this.MangageVal=val.EPleader;
           this.projectTitle="编辑项目";
           console.log(val)

           if(val.EpmanangeName.name!="NotName"){//管理人员姓名
               this.manageCount.push(val.EpmanangeName);
           }
           //显示图片
           this.uploadList.push({
                url: val.EPpicture,
                showProgress: false,
                status: "finished"
           });
        })
    },
    updated(){
       this.EmitData()
    }
  
}
</script>
<style lang="less">
@import './style/addProject.less';
</style>
