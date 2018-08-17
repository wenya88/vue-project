<template>
    <div class="taskList">
        <dl>
            <dd v-for="item in taskData" :key="item.id">
                <div class="tips">
                    <i v-show="item.end_days<=0?false:true">交稿剩余<span>{{item.end_days}}</span>天</i>
                    <s>{{item.task_type==null?'-':item.task_type}}</s>
                    <div class="clear"></div>
                </div>
                <img :src="item.picture" @click="showDetails(item.test_name,item.task_type,item,item.id,item.is_join)">
                <div class="pastDue" v-if="item.end_days<=0?true:false">投稿已结束</div>
                <div class="title">
                    <i>{{item.test_name}}</i>
                    <s>{{item.join_num}}家报名</s>
                    <div class="clear"></div>
                </div>
                <div class="row">
                    <p>测试金额：<i>￥{{item.test_price}}</i></p>
                    <p>项目预计：￥{{item.project_min_price}} ~ ￥{{item.project_max_price}}</p>
                </div>
            </dd>
            <div class="clear"></div>
        </dl>
        <!-- Modal组件 -->
        <Modal
            v-model="taskDetails"
            :closable="false"
            :transfer="false"
            width="700px">
            <task-details :emitDetailsData="detailsData"></task-details>
            <div slot="header" class="taskTitle"><em>{{taskType==null?'-':taskType}}</em><span>{{taskTitle}}</span></div>
            <div slot="footer">
                <Button type="success" long @click="joinTest" :disabled='flag'>{{joinStatut}}</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
var qs=require('querystring')
import taskDetails from './taskDetails';
export default {
    data(){
        return{
          taskDetails:false,
          taskTitle:null,
          taskType:null,
          detailsData:{},
          Tid:null,
          joinStatut:null,
          flag:false
        }
    },
    props:{
        taskData:{
            type:Array
        }
    },
    components:{
        taskDetails:taskDetails
    },
    mounted(){
        this.autoH();
    },
    methods:{
        // 初始化高
        autoH(){
            $(".taskList").height($(window).height()-215)
        },
        showDetails(name,type,item,id,join){
            this.detailsData=item; //发送数据
            this.taskType=type;//标题类型
            this.taskTitle=name;//标题名字
            this.Tid=id;//任务ID
            console.log(join)
            if(join=='1'){
                this.joinStatut='已报名';
                this.flag=true;
            }else{
                this.joinStatut='立即报名';
                this.flag=false;
            }
            this.taskDetails=true;
        },
        // 投标
        joinTest(){
            let url=this.GLOBAL.baseRouter+'task/company/join-test';
            let params={
                id:this.Tid
            }
            this.$Loading.start();
            this.$axios.post(url,qs.stringify(params)).then(msg=>{
                this.$Loading.finish();
                this.$Message.success(msg.data.msg);
                if(msg.data.msg=='投标成功'){
                    this.$bus.emit('joinSuccess');
                    this.joinStatut='已报名';
                    this.flag=true;
                }
            },()=>{
                this.$Loading.error();
                this.$Message.error('')
            })
        }
    }
}
</script>
