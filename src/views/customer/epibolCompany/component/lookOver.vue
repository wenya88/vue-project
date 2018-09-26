<template>
    <div class="lookOver">
        <div class="lookImg">
            <div v-if="isFile" class="NoFile">暂无文件</div>
            <filebrowse v-else ref="filebrowse"></filebrowse>
            <!--<img :src="lookDate.file">-->
        </div>

        <div class="fooder">
            <p class="content">
                <i class='iconfont icon-loudong'></i>
                {{lookDate.company}}<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span  v-if="!isFile">稿件源文件：<a :href="fileDtat.file" target="_blank">下载</a></span>
            </p>
            <p style="float:right" v-if="!isFile">
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
import api from 'api';
import filebrowse from "../../../project/components/fileBrowseManager.vue";        //公共资源类型组件
import {mapState, mapMutations} from 'vuex';
export default {
    data(){
        return{
            isFile:true,
            fileDtat:{}
        }
    },
    components:{
        filebrowse
    },
    props:['lookDate'],
    methods:{
        ...mapMutations(['setTaskInfo', 'changeComponentTaskID', 'changeComponentFileURl']),
        bidStatus(status){
            if(status == 1){
                let _this = this;
                (async function () {
                    let obj = {
                        id:_this.lookDate.testID,
                        bid_id:_this.lookDate.id
                    }
                    const winBid = await api.getWinBid(obj);
                    if(winBid.data.err_code == 0){
                        _this.$Message.success(winBid.data.err_message);
                        _this.$emit("chanageStatu");
                    }else {
                        _this.$Message.error('提交失败')
                    }
                })();
            }else {
                let url=this.GLOBAL.baseRouter+'task/company/update-bid-status';
                this.$axios.post(url,qs.stringify({bid_id:this.lookDate.id,status:status})).then(()=>{
                    this.$Message.success('提交成功');
                    this.$emit("chanageStatu")
                },()=>{
                    this.$Message.error('提交失败')
                })
            }
        },
        async TestTaskBidInfos(id,type){
            const TestTaskBidInfos = await api.getTestTaskBidinfos({bid_id:id,type:type});
            if(TestTaskBidInfos.data.err_code == 0){
                let data = TestTaskBidInfos.data.data.upload;
                TestTaskBidInfos.data.data.is_test = 1;
                if(data != false){
                    this.isFile = false;
                    let mainFile = data.file.filter(function (creen,index,arr) {
                        return creen.is_main == 1;
                    })
                    this.fileDtat = mainFile[0];
                    this.changeComponentTaskID(id);
                    this.changeComponentFileURl(mainFile[0].file);

                    this.$nextTick(function () {
                        this.$refs.filebrowse.initFileBrowse(id,mainFile[0].type,TestTaskBidInfos.data.data);  //招标ID，文件类型,数据信息
                    })
                }else {
                    this.isFile = true;
                }
            }
        }
    },
    watch:{
        lookDate(val){
            this.TestTaskBidInfos(val.id,'pass');
        }
    },
    mounted(){

        // alert(this.Tid)
    }
}
</script>
<style type="text/css" lang="less">
    .lookImg{
        position: relative;
        .NoFile{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            background: #848484;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-size: 20px;
        }
    }

</style>
