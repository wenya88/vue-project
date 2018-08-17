<template>
    <div class="comInvite">
       <div class="bidList">
            <dl>
                <dt>
                    <span>项目名称</span>
                    <span>项目预计金额</span>
                    <span>项目时间</span>
                    <span>已反馈/已邀请</span>
                    <span>反馈截止</span>
                    <span>状态</span>
                    <span>操作</span>
                    <div class="clear"></div>
                </dt>
                <dd v-for="item in intivesData" :key="item.id">
                    <span>{{item.project_name}}</span>
                    <span>{{item.project_min_price}} ~ {{item.project_max_price}}</span>
                    <span>{{item.start_time}} ~ {{item.end_time}}</span>
                    <span><s>{{item.feedback_num}}</s>/{{item.invite_num}}</span>
                    <span>{{item.join_end_time}}</span>
                    <span>{{item.status_text}}</span>
                    <span><i @click="details(
                        item.id,
                        item.project_name,
                        item.project_min_price,
                        item.project_max_price,
                        item.start_time,
                        item.end_time,
                        item.join_end_time
                        )">详情</i></span>
                    <div class="clear"></div>
                </dd>
            </dl>
       </div>
        <!-- Modal组件 -->
        <Modal
            v-model="applModal"
            :title="companyTitle"
            @on-ok="companyOk"
            @on-cancel="companyCancel"
            ok-text="发送邀请"
            :closable="false"
            width="800px"
            >
            <emit-invite ref="addCoop"></emit-invite>
            <div slot="footer" v-if="footer"></div>
        </Modal>
    </div>
</template>
<script>
import emitInvite from './emitInvite';
var qs=require('querystring')
export default {
    data(){
        return{
            applModal:false,
            companyTitle:'',
            inviteData:[],
            footer:false
        }
    },
    props:{
        intivesData:{
            type:Array
        }
    },
    components:{
        emitInvite:emitInvite
    },
    mounted(){
        this.$bus.on('emitInvite',val=>{
            this.inviteData=val
        })
    },
    methods:{
        // 新增邀请
        newAdd(){
            this.applModal=true;
            this.footer=false;
            this.companyTitle='增加邀请';
            this.$refs.addCoop.coopCompany();
        },
        // 详情
        details(id,pName,pMinPrice,pMaxPrice,sTime,eTime,joinETime){
            let obj={
                id:id,
                project_name:pName,
                project_min_price:pMinPrice,
                project_max_price:pMaxPrice,
                start_time:sTime,
                end_time:eTime,
                join_end_time:joinETime
            };
            this.applModal=true;
            this.footer=true;
            this.companyTitle='邀请详情';
            this.$refs.addCoop.defauDetails(obj);
            this.$refs.addCoop.companyListInfo();
        },
        // 发送邀请
        companyOk(){
          
            let url=this.GLOBAL.baseRouter+'task/company/add-invite';
            this.$axios.post(url,qs.stringify(this.inviteData)).then(msg=>{
                if(msg.data.err_code==0){
                    this.$Message.success('发送成功!');
                    this.$refs.addCoop.ScuessClear();
                    this.$bus.emit('inviteScuess')
                }else if(msg.data.err_code>0){
                    this.$Message.warning(msg.data.err_message);
                    this.applModal=true;
                }
            },()=>{
                this.$Message.error('发送失败!');
                 this.applModal=true;
            })
        },
        // 关闭邀请
        companyCancel(){
            this.$bus.emit('inviteSuccess')
        }
    }
}
</script>
