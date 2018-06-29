<template>
     <div class="addRow">
        <dl>
            <dt class="title"><Icon type="grid"></Icon> 基本信息</dt>
            <dt>任务名称</dt>
            <dd>
                <Input v-model="taskName" placeholder="输入项目名称" style="width: 400px" :disabled='flag'></Input>
            </dd>
            <dt>任务图片 <em>( 图片小于1M，限jpg,png,jpeg,建议大小90*45 )</em></dt>
            <dd class="ImaUpload">
               
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
                        :max-size="2048" 
                        :format="['jpg','jpeg','png']"
                        :on-success="handleSuccess"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                        type="drag"
                        :action="fileup"
                        style="display:block;width:220px">
                        <div style="width:100%;display:block;padding:33px 10px 33px 10px;">
                                <p style="font-size:16px;"><Icon type="plus"></Icon> 上传图片</p>   
                        </div>
                </Upload>
            </dd>
            <dt>测试费用（元）</dt>
            <dd>
                <Input v-model="testMoney" placeholder="测试费用" style="width: 400px" :disabled='flag'></Input>
            </dd>
            <dt>项目预计总额（元）</dt>
            <dd>
                <Input v-model="lowMoney" placeholder="最低金额" style="width: 193px"  :disabled='flag'></Input>
                ~
                <Input v-model="tallMoney" placeholder="最高金额" style="width: 193px" :disabled='flag'></Input>
            </dd>
            <dt>投稿截止时间</dt>
            <dd>
                <DatePicker :options="endDateOptions" type="date" placeholder="选择结束时间" style="width: 400px" @on-change="changeDate" :value="testDate" :disabled='flag'></DatePicker>
            </dd>
            <dt class="title"><Icon type="grid"></Icon> 测试任务要求</dt>
            <dt>文件要求</dt>
            <dd>
                <Input v-model="textTaskAsk" style="width: 400px"  :disabled='flag'></Input>
            </dd>
            <dt>参考附件</dt>
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
                    <Button type="ghost" icon="ios-cloud-upload-outline"  style="width:400px">点击/拖入可上传</Button>
                </Upload>
            </dd>
            <dt>其它说明</dt>
            <dd>
                <Input v-model="otherExplain" type="textarea" placeholder="其它说明.." style="width:400px" :disabled='flag'></Input>
            </dd>
        </dl>
    </div>
</template>
<script>
export default {
    data(){
        return{
            proName:'',
            uploadList:[],
            uploadurl:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3429908815,845996252&fm=27&gp=0.jpg',
            url:[],
            otherExplain:'',
            textTaskAsk:'',
            lowMoney:'',
            tallMoney:'',
            testMoney:'',
            taskName:'',
            accFile:[], //附件
            testDate:'',
            id:null,
            defaultList:[],
            flag:false,
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
         this.uploadList = this.$refs.upload.fileList;
         this.$bus.on("clearEpiboComData",()=>{
            if(this.$refs.upload.fileList.length>0){
                this.$refs.upload.fileList.splice(0)
            };
            this.id=null;
            this.taskName='';
            this.testMoney='';
            this.lowMoney='';
            this.tallMoney='';
            this.testDate='';
            this.textTaskAsk='';
            this.otherExplain='';
            this.uploadurl='https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3429908815,845996252&fm=27&gp=0.jpg';
            this.accFile=[];
            this.defaultList=[];
            this.flag=false
        });
        this.$bus.on("emitEditTask",(val)=>{
            this.editTask(val)
        })
    },
    methods:{
        // 编辑信息
        editTask(val){
            this.id=val.id;
            this.taskName=val.testName;
            this.testMoney=val.testPrice;
            this.lowMoney=val.projectMinPrice;
            this.tallMoney=val.projectMaxPrice;
            this.testDate=val.endTime;
            this.textTaskAsk=val.fileRequire;
            this.otherExplain=val.description;
            this.defaultList=val.file;
            this.accFile=val.file;
            this.uploadurl=val.picture;
            this.uploadList.push({
                url:val.picture,
                showProgress: false,
                status: "finished"
           });
           this.flag=val.flag
        },
        // 改变日期
        changeDate(date){
            this.testDate=date;
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
        // 任务图片上传
        handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleSuccess (res, file) {
            file.url = this.url;
            this.uploadurl=this.uploadList[0].response.file.url;
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
        emitData(){
            let obj={
                id:this.id,
                taskName:this.taskName,
                uploadurl:this.uploadurl,
                testMoney:this.testMoney,
                lowMoney:this.lowMoney,
                tallMoney:this.tallMoney,
                testDate:this.testDate,
                textTaskAsk:this.textTaskAsk,
                accFile:this.accFile,
                otherExplain:this.otherExplain
            }
            this.$bus.emit('emitAddData',obj);
        }
    },
    updated(){
        this.emitData();
    }
}
</script>
<style lang="less">
@import '../style/addEpibolCom.less';
</style>
