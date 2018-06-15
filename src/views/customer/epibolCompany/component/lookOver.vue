<template>
    <div class="lookOver">
        <div class="lookImg">
            <img :src="lookDate.file">
        </div>
        <div class="fooder">
            <p>{{lookDate.company}}&nbsp;</p>
            <p>稿件源文件：<a :href="lookDate.file">下载</a></p>
            <p>
                <Button type="success" @click.native="bidStatus(1)">设为中标</Button>
                <Button type="info" @click.native="bidStatus(4)">加入合作公司库</Button>
                <Button type="error" @click.native="bidStatus(2)">不满意</Button>
            </p>
            <div class="clear"></div>
        </div>
    </div>
</template>
<script>
var qs=require('querystring')
export default {
    props:['lookDate'],
    methods:{
        bidStatus(status){
            let url=this.GLOBAL.baseRouter+'task/company/update-bid-status';
            this.$axios.post(url,qs.stringify({bid_id:this.lookDate.id,status:status})).then(()=>{
                this.$Message.success('提交成功');
                this.$bus.emit("chanageStatu")
            },()=>{
                this.$Message.error('提交失败')
            })
        }
    }
}
</script>
