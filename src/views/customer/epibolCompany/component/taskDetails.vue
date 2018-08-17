<template>
    <div class="details">
        <!-- 基本信息 -->
        <div class="taskInfo">
            <task-info></task-info>
        </div>
        <!-- 服务商列表 -->
        <div class="facilList bidManage">
            <div class="facilTitle">
                <span>报名服务商({{joinList.length}})</span>
                <em @click="notAll">都不满意?</em>
                <div class="clear"></div>
            </div>
            <!-- 列表信息 -->
            <div class="bidList">
                <dl>
                    <dt>
                      <span>服务商</span>
                      <span>报名时间</span>
                      <span>稿件</span>
                      <span>上传时间</span>
                      <span>招标结果</span>
                      <span>操作</span>
                      <div class="clear"></div>
                    </dt>
                </dl>
                <dd v-for="item in joinList">
                    <span>{{item.company}}</span>
                    <span>{{item.apply_time}}</span>
                    <span>{{item.file==null?'未上传':'已上传'}}</span>
                    <span>{{item.upload_times}}</span>
                    <span>{{item.status_text}}</span>
                    <span><i @click.stop="lookOver(item.id,item.file,item.company)">查看</i></span>
                    <div class="clear"></div>
                </dd>
                <up-load style="margin-left:14%;" v-if="flag"></up-load>
            </div>
        </div>
        <div class="clear"></div>
        <!-- Modal组件 -->
        <Modal
            v-model="lookModal"
            :closable="false"
            :transfer="false"
            width="900px">
            <look-over :lookDate="lookDate"></look-over>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
var qs=require('querystring')
import lookOver from './lookOver';
import upLoad from '../../../project/components/onLoad'
import taskInfo from './addEpibolCom.vue';
export default {
    data(){
        return{
            flag:true,
            lookModal:false,
            lookDate:Object,
            id:null,
            Tid:null,
            joinList:[]
        }
    },
    components:{
        taskInfo:taskInfo,
        upLoad:upLoad,
        lookOver:lookOver
    },
    mounted(){
        this.$bus.on("chanageStatu",()=>{
            this.taskDetaGet();
            this.lookModal=false;
        })
    },
    methods:{
        //  全都不满意
        notAll(){
            let url=this.GLOBAL.baseRouter+'task/company/all-out';
            this.$axios.post(url,qs.stringify({test_id:this.Tid})).then(()=>{
                this.$Message.success("提交成功!");
                this.$bus.emit("chanageStatu");
            },()=>{
                this.$Message.error("提交失败!")
            })
        },
        //清空列表
        clearList(){
            this.lookModal=false;
        },
        // 查看
        lookOver(id,file,company){
            let obj={
                id:id,
                file:file,
                company:company
            }
            this.lookDate=obj;
            this.lookModal=true;
        },
        // 获取详情数据
        taskDetaGet(id=this.id){
            this.id=id;
            this.flag=true;
            let url=this.GLOBAL.baseRouter+'task/company/test-task-info';
            this.$axios.post(url,qs.stringify({id:id})).then(msg=>{
                if(msg.data.err_code==0){
                    this.flag=false
                    this.joinList=msg.data.join_list;
                    this.Tid=msg.data.id;
                }
            })
        }
    }
}
</script>
