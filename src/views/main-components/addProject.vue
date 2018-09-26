<template>
    <div class="addProjectContainer">
        <div class="addRow">
            <dl>
                <dt>项目合同</dt>
                <dd>
                    <Select v-model="proCont" filterable  style="width: 400px">
                        <Option v-for="item in ContList" :value="item.id" :key="item.id"> {{item.contract_name}}  (编号:{{item.contract_id}})</Option>
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
                <dt>项目图片</dt>
                <dd style="width:235px;height:130px;">
                    <div class="ImaUpload">
                        <div v-if="uploadList" class="demo-upload-list" >
                                <img :src="uploadList">
                                <div v-if="uploadList" class="demo-upload-list-cover">
                                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)" size="30"></Icon>
                                </div>
                        </div>

                        <file-upload v-else v-on:FileUploadedSuccess="FileUploadedSuccess">
                            <!--<template slot="upload">-->
                                <!--<button id="browse" class="browse">选择文件</button>-->
                                <!--<p class="button">选择文件</p>-->
                            <!--</template>-->
                        </file-upload>

                        <!--<Upload-->
                            <!--ref="upload"-->
                            <!--:show-upload-list="false"-->
                            <!--:on-success="handleSuccess"-->
                            <!--:max-size="2048"-->
                            <!--:format="['jpg','jpeg','png']"-->
                            <!--:on-format-error="handleFormatError"-->
                            <!--:on-exceeded-size="handleMaxSize"-->
                            <!--:before-upload="handleBeforeUpload"-->
                            <!--type="drag"-->
                            <!--:action="fileup"-->
                            <!--style="display:block;width:100%;">-->
                            <!--<div style="width:100%;display:block;padding:33px 10px 33px 10px;">-->
                                <!--<p style="font-size:16px;"><Icon type="plus"></Icon> 上传图片</p>-->
                            <!--</div>-->
                        <!--</Upload>-->
                    </div>
                </dd>
                <dt style="height:30px;">状态</dt>
                <dd style="height:30px;">
                    <i-switch size="large" v-model="state" @on-chanage="chanState">
                        <span slot="open">开启</span>
                        <span slot="close">暂停</span>
                    </i-switch>
                </dd>
                <dt style="height:30px;">项目标签</dt>
                <dd style="height:30px;">
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
                <dt style="height:30px;">项目负责人</dt>
                <dd style="height:30px;">
                    <Tag v-for="(item,index) in manageCount" :name="item.name" closable @on-close="CloseManage" @click.native="editTtag(index)">{{ item.name }}</Tag>
                    <Button icon="ios-plus-empty" type="dashed" size="small" @click.native="AddManage" v-if="manageCount.length>0?false:true">
                        添加项目负责人
                        <div class="addLabel" v-show="addManageDIV" style="width:245px;">
                            <Select v-model="MangageVal"  style="width: 140px;" class="MangaSelect">
                                <Option v-for="item in manageData" :value="item.id" :key="item.id">{{ item.remark_name }}</Option>
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
    import fileUpload from '@/components/upload'
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
            uploadList:null,
            url:[],
            LabelVal:'',
            MangageVal:'',
            addLabDIV:false,
            addManageDIV:false,
            manageData:[],
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
                        MListObj.name=val.remark_name;
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
        // 图片删除
        handleRemove (file) {
            this.uploadList = null
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
            let url=_this.GLOBAL.baseRouter+'task/project/get-contract-list&company_id='+1;
            let manageURL=_this.GLOBAL.baseRouter+'task/project/get-company-member';
            _this.$axios.get(url).then(msgData=>{
                 _this.ContList=msgData.data.data;
            });
            _this.$axios.get(manageURL).then(ManageData=>{
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
            obj.uploadurl=this.uploadList,
            obj.Pid=this.Pid
            this.$bus.emit("AddProInfo",obj);

        },
        FileUploadedSuccess({data}){
            this.uploadList = JSON.parse(data.response).file_url
        }
    },
    mounted(){
        this.getCont();
        this.$bus.on("submitOk",()=>{
            this.uploadList = null
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
           this.uploadList=val.EPpicture;
           this.state=val.EPstatus==2?false:true;
           this.MangageVal=val.EPleader;
           this.projectTitle="编辑项目";

           if(val.EpmanangeName.name!="NotName"){//管理人员姓名
               this.manageCount = [];
               this.manageCount.push(val.EpmanangeName);
           }
           //显示图片
//           this.uploadList.push({
//                url: val.EPpicture,
//                showProgress: false,
//                status: "finished"
//           });
        })
    },
    updated(){
       this.EmitData();
    },
    components:{
        fileUpload
    }


}
</script>
<style lang="less">
@import './style/addProject.less';
    .addProjectContainer{
        .uploadContainer{
            margin-top: 0;
            .button{
                width: 100%;
                height: 100%;
                line-height: 100px;
                color: #ccc;
                border: 1px dashed #ccc;
                background: #Fff;
            }
            &:hover{
                .button{
                    border: 1px dashed #39f;
                }
            }
        }
    }
</style>
