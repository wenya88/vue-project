<template>
    <!--资源-->
    <div class="resourceContainer">
        <div class="box">
            <Steps :current="0" direction="vertical" >
                <Step  v-for="(item,index) in formItem" :title="item.name" :key="index" @click.native="showimg(item)" >
                    <div class="content">
                        <div class="resourceTitle">
                            <p  class="resourceStatus" style="text-align: right">{{item.status | stateData}}</p>
                            <p style="color: #c5c5c5">{{item.create_time|time}}</p>
                        </div>

                        <div class="file" >
                            <p class="textB3" >上传文件规格</p>
                            <ul>
                                <li  v-for="(item,index) in imgEditorWH" :key="index" class="fileList">
                                    <span>宽高</span>
                                    <span>{{item}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Step>
            </Steps>
        </div>
        <!--<h1>{{imgEditorWH}}</h1>-->
    </div>
</template>

<script>
    import api from 'api'
    import {mapState} from 'vuex'
    export default {
        created() {
        },
        mounted() {
        },
        data() {
            return {
                formItem:[]
            }
        },
        methods: {
            init(data){
                if(data){
                    data.stage_list.map((item,index) => {
                        if(data.stage[index]){
                            this.getstage(item.id,data.stage[index].stage_name)
                        }
                    })
                }

            },
            async getstage(params,name){
                let {data} = await api.taskStageInfo({id:params});
                data.name = name;
                this.formItem.push(data);

            },
            showimg(data){
                let url = null,task_id = null,type = null;
                if(data && data.file){
                    data.file.map((item) => {
                        if(item.is_main === '1'){
                            url = item.file;
                            task_id = item.task_id;
                            type = item.type;
                        }
                    });
                    this.$bus.emit('initFileBrowse',{taskid:task_id,type:type});
                    this.$store.commit('changeComponentTaskID', task_id);
                    this.$store.commit('changeComponentFileURl', url);
                }

            }
        },
        computed: {
            ...mapState({
                infoDetails(data){
                    return data.project.detail.taskInfo
                },
                imgEditorWH(data){
                    return data.paySkip.imgEditorWH
                }
            })
        },
        watch:{
            infoDetails(data){
                this.init(data)
            }
        },
        filters:{
            time(data){
                data = data.length === 10 ?data*1000:data;
                return  `${new Date(data).toLocaleDateString()} ：${new Date(data).toTimeString().split(' ')[0]}`;
            },
            stateData(data){

                let state = null;
                switch (data)
                {
                    case '1':
                        state='内部待审';
                        break;
                    case '2':
                        state='客户待审';
                        break;
                    case '3':
                        state='内部已反馈';
                        break;
                    case '4':
                        state='客户已反馈';
                        break;
                    case '5':
                        state='审核通过';
                        break;

                }
                return state
            }
        },
        components: {}
    }
</script>

<style lang="less" >
    @green:#3bceb6;
    @gray:#c5c5c5;
    .resourceContainer {
        .ivu-steps-head{
            top:31px;
            background: #fff !important;
        }
        .ivu-steps-tail>i{
            background: transparent !important;
        }
        .ivu-steps-head-inner{
            width: 30px !important;
            height: 30px !important;
            line-height: 30px !important;
            font-size: 16px !important;
            background: @green !important;
            border: 1px solid @green !important;
            span{
                color: #fff !important;
            }
        }


        .ivu-steps-item{
            padding: 0 20px;
            border-bottom: 1px solid #f2f9f9;
        }
        .textB3{
            color: #b3b3b3;
        }
        .box{
            .ivu-steps .ivu-steps-title{
                margin-left: 43px;
                color: @green !important;
            }
        }
        .content {
            width: 350px;
            font-size: 14px;
            .resourceTitle{
                position: absolute;
                top:0;
                right: 0;
            }
            .file{
                margin: 45px 0 8px 0;
                p{
                    margin: 5px 0;
                }
                .fileList{
                    display: flex;
                    height: 30px;
                    line-height: 30px;
                    padding: 0 10px;
                    margin-bottom: 15px;
                    justify-content: space-between;
                    color: #808181;
                    background: #f2f2f2;
                    border-radius: 4px;
                }
            }

            .resourceStatus{
                color: @green;
            }

        }
    }
</style>
