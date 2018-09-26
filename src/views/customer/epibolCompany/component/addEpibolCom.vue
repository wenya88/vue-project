<template>
     <div class="addRow">
        <dl>
            <dt class="title">基本信息</dt>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>任务名称</dt>
            <dd>
                <Input v-model="postData.test_name" placeholder="输入项目名称" style="width: 400px" :disabled='flag'></Input>
            </dd>
            <div class="clear"></div>
        </dl>
        <!--<dl>-->
            <!--<dt>任务图片</dt>-->
            <!--<dd class="ImaUpload">-->
                <!--<upload-box v-on:FileUploadedSuccess="FileUploadedSuccess" :id="uploadCallbackData.id1">-->
                    <!--<template slot='upload'>-->
                        <!--<div id="browse1" class="uploadElement">-->
                            <!--<p v-if="uploadCallbackData.showFlag1"><Icon type="plus"></Icon> 上传图片</p>-->
                            <!--<img v-else v-for="img in uploadCallbackData.callbackData1" :src="JSON.parse(img.response).file_url"/>-->
                        <!--</div>-->
                    <!--</template>-->
                <!--</upload-box>-->
            <!--</dd>-->
            <!--<div class="clear"></div>-->
        <!--</dl>-->
        <dl>
            <dt>测试费用（元）</dt>
            <dd class="testTaskPrice">
                <RadioGroup v-model="xuqiuFlag.animal">
                    <Radio label="1">
                        <span>服务商报价</span>
                    </Radio>
                    <Radio label="2">
                        <span>我方报价</span>
                    </Radio>
                </RadioGroup>
                <p v-if="xuqiuFlag.animal == 1">测试任务发布成功后，参与投标的服务方报价</p>
                <Input v-if="xuqiuFlag.animal == 2" v-model="postData.test_price"  placeholder="测试费用" style="width: 400px;margin-top: 5px" :disabled='flag'></Input>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>项目预计总额（元）</dt>
            <dd>
                <!--<Input v-model="lowMoney" placeholder="最低金额" style="width: 193px"  :disabled='flag'></Input>-->
                <!--~-->
                <Input v-model="postData.project_max_price" placeholder="项目预计总额" :disabled='flag'></Input>
            </dd>
            <div class="clear"></div>
        </dl>
         <dl>
             <dt>报名截止时间</dt>
             <dd>
                 <DatePicker :options="endDateOptions" type="date" placeholder="选择结束时间" style="width: 400px" @on-change="changeEnrollDate" :value="postData.bid_end_time" :disabled='flag'></DatePicker>
             </dd>
             <div class="clear"></div>
         </dl>
        <dl>
            <dt>投稿截止时间</dt>
            <dd>
                <DatePicker :options="endDateOptions" type="date" placeholder="选择结束时间" style="width: 400px" @on-change="changeDate" :value="postData.end_time" :disabled='flag'></DatePicker>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt class="title">测试任务要求</dt>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>任务类型</dt>
            <dd>
                <Select v-model="postData.task_type" style="width:400px">
                    <Option value="原画">原画</Option>
                    <Option value="UI">UI</Option>
                    <Option value="角色">角色</Option>
                    <Option value="场景">场景</Option>
                    <Option value="动作">动作</Option>
                    <Option value="特效">特效</Option>
                    <Option value="其它">其它</Option>
                </Select>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>交稿要求</dt>
            <dd>
                <Input v-model="postData.file_require" type="textarea" placeholder="交稿要求.." style="width:400px;font-size: 12px" :autosize="{minRows: 2,maxRows: 5}" :disabled='flag'></Input>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>参考附件</dt>
            <dd>
                <upload-box v-on:FileUploadedSuccess="FileUploadedSuccess2" :id="uploadCallbackData.id2">
                    <template slot='upload'>
                        <div id="browse2" >
                            <Button type="ghost" icon="ios-cloud-upload-outline"  style="width:400px">点击上传</Button>
                        </div>
                    </template>
                </upload-box>
                <p class="listP" v-for="(item,index) in postData.file" style="width:400px">
                    <span>{{item.name | substring}}</span>
                    <i><Icon type="ios-close" @click="delUploadFile(index)"></Icon></i>
                </p>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>其它说明</dt>
            <dd>
                <Input v-model="postData.description" type="textarea" placeholder="其它说明.." style="width:400px;font-size: 12px" :autosize="{minRows: 2,maxRows: 5}" :disabled='flag'></Input>
            </dd>
            <div class="clear"></div>
        </dl>
    </div>
</template>
<script>
    import uploadBox from '../../../../components/upload.vue';
export default {
    components: {
        uploadBox
    },
    data(){
        return{
            xuqiuFlag:{
              flag:true,
              animal:'1'
            },
            postData:{
                id:null,
                create_demand:1,
                test_name:null,
                task_type:null,
                test_price:null,
                project_max_price:null,
                bid_end_time:null,
                end_time:null,
                file_require:null,
                description:null,
                file:null
            },
            flag:false,
            endDateOptions:{
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            uploadCallbackData:{
                // id1:'browse1',
                id2:'browse2',
                // callbackData1:[],
                // showFlag1:true,
                callbackData2:[],
            }
        }
    },
    computed:{
        fileup(){
            this.postData.file = this.$store.state.app.uploadFile
            return this.$store.state.app.uploadFile
        }
    },
    methods:{
        //改变报名日期
        changeEnrollDate(date){
            this.postData.bid_end_time=date;
        },
        // 改变日期
        changeDate(date){
            this.postData.end_time=date;
        },
        //上传回调  建议保留 说不定什么时候又需要了
        // FileUploadedSuccess(data){
        //     this.uploadCallbackData.callbackData1 = this.fileup;
        //     this.uploadCallbackData.showFlag1 = false;
        // },
        FileUploadedSuccess2(){
            this.postData.file = this.fileup;
            // this.uploadCallbackData.callbackData2 = this.fileup;
        },
        delUploadFile(index){
            this.postData.file.splice(index,1);
        }
    },
    watch:{
        xuqiuFlag:{
            handler(val){
                if(val.animal == 1){
                    this.postData.test_price = null
                }
            },
            deep:true
        }
    },
    updated(){
        this.postData.picture = 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3429908815,845996252&fm=27&gp=0.jpg';
        this.$bus.emit('emitAddData',this.postData,this.xuqiuFlag.animal);
    },
    filters:{
        substring(val){
            return val.replace(/https:\/\/yhc-1.oss-cn-shanghai.aliyuncs.com\/file-upload\//,'');
        }
    }
}
</script>
<style lang="less" scoped>
@import '../style/addEpibolCom.less';
    .uploadElement{
        display: inline-block;
        border: 1px solid #d7dde4;
        min-width: 100px;
        height: 100px;
        line-height: 100px;
        overflow: hidden;
        padding: 1px 0;
        /*padding: 7px;*/
        font-size: 12px;
        border-radius: 3px;
        color: #babfc5;
        cursor: pointer;
        &:hover{
            border-color: #3bceb6!important;
            box-shadow: 0 0 3px #3bceb6!important;
        }
        p{
            display: inline-block;
            width: 100%;
            text-align: center;
        }
        img{
            width: 100px;
            height: 100px;
            padding: 1px;
        }
    }
    .listP{
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        i{
            font-style: normal;
            vertical-align: middle;
            margin-left: 50px;
            &:hover{
                cursor: pointer;
                color: #3bceb6;
            }
        }
    }
    .testTaskPrice{
        .ivu-radio-checked .ivu-radio-inner{
            border-color: #3bceb6 !important;
        }
        .ivu-radio-inner:after{
            background-color:#3bceb6 !important;
        }
        p{
            height: 32px;
            line-height: 32px;
            margin-top: 5px;
            color: #3bceb6;
        }
    }
</style>
