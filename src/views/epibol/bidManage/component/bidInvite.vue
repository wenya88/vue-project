<template>
    <div class="newBidList">
            <dl>
                <dd v-for="item in inviteData" :key="item.id">
                    <div class="title">
                        {{item.project_name}}
                    </div>
                    <div><i class="iconL"></i><i class="iconR"></i></div>
                    <div class="content">
                        <div class="projectStatis">
                            <p>项目统计</p>
                            ￥<span>{{item.project_min_price}} ~ {{item.project_max_price}}</span>
                        </div>
                        <div class="projectInfo">
                            <p>项目时间</p>
                            <p class="date">{{item.description}}</p>
                            <p>项目时间</p>
                            <p class="date">{{item.start_time}} ~ {{item.end_time}}</p>
                        </div>
                    </div>
                </dd>
            </dl>
        </div>
    <!-- <div class="bidList invite">
        <dl>
            <dt>
                <span>项目名称</span>
                <span>项目预计总额</span>
                <span>时间要求</span>
                <span>邀请方</span>
                <span>邀请反馈</span>
                <div class="clear"></div>
            </dt>
            <dd v-for="item in inviteData">
                <span>{{item.project_name}}
                    <Tooltip :content="item.description" placement="top-start">
                        <Button><Icon type="android-textsms"></Icon></Button>
                    </Tooltip>
                </span>
                <span>￥{{item.project_min_price}} ~ ￥{{item.project_max_price}}</span>
                <span>{{item.start_time}} 至 {{item.end_time}}</span>
                <span>{{item.company_name}}</span>
                <span>
                    <em  v-show="item.status==0 && item.join_end_time>Math.round(new Date().getTime()/1000)">
                        <Button type="primary" @click.native="updateInvite(item.id,1)">确认</Button> <Button type="error" @click.native="updateInvite(item.id,2)">拒绝</Button>
                    </em>
                    <em v-show="item.status==0 && item.join_end_time<Math.round(new Date().getTime()/1000)">
                        已过期
                    </em>
                    <em v-show="item.status==1 || item.status==2">{{item.status==1?'已接受':'已拒绝'}}</em>
                </span>
                <div class="clear"></div>
            </dd>
        </dl>
    </div> -->
</template>
<script>
var qs=require('querystring')
export default {
    props:{
        inviteData:{
            type:Array
        }
    },
    methods:{
        // 更新状态
        updateInvite(id,status){
            this.$Loading.start();
            let url=this.GLOBAL.baseRouter+'task/company/update-invite-status';
            let params={
                id:id,
                status:status
            };
            this.$axios.post(url,qs.stringify(params)).then(()=>{
                this.$Loading.finish();
                this.$Message.success('提交成功');
                this.$bus.emit('updataSuccess')
            },()=>{
                this.$Loading.error();
            })
        }
    }
}
</script>

