<template>
    <div class="details">
        <div class="detailsNav">
            <span @click="backTest">测试任务</span> > <span>详情</span>
        </div>
        <div style="display: flex;justify-content: space-between">
            <!-- 基本信息 -->
            <div class="taskInfo">
                <dl>
                <dt>基本信息</dt>
                <dd>
                    <span>任务名称</span><em>{{itemData.test_name}}</em>
                </dd>
                <dd v-if="itemData.test_price">
                    <span>测试费用</span><em>￥{{itemData.test_price}}</em>
                </dd>
                <dd>
                    <span>预计总额</span><em>￥{{itemData.project_max_price}}</em>
                </dd>
                <dd>
                    <span>交稿截止时间</span><em>{{itemData.end_time}}</em>
                </dd>
                <dd>
                    <span>任务类型</span><em>{{itemData.task_type}}</em>
                </dd>
                <dt>文件要求</dt>
                <dd>
                    <p class="yaoqiutext">{{itemData.file_require}}</p>
                </dd>
                <dt>参考附件</dt>
                <dd>
                    <span v-if="!itemData.file||!itemData.file.length">暂无</span>
                    <ul v-else>
                        <li v-for="(item,index) in itemData.file">
                            <a :href="item.response.file_url" target="_blank">{{item.name | substring}} <i class="icon iconfont icon-xiazai"></i></a>
                        </li>
                    </ul>
                </dd>
                <dt>其他说明</dt>
                <dd>
                    <em>{{itemData.description}}</em>
                </dd>
            </dl>
            </div>
            <div class="ListDiv">
                <div class="ListTitle">
                    <span>报名服务商({{joinList.length}})</span>
                    <!--报名时间剩余{{bidEndTime}}天-->
                    <div>
                        <!--状态4表示该任务目前还没有选择确认报价 状态为1相反 已选择报价-->
                        <button v-if="bidEndTime < 0 && itemData.test_price" class="notAll" @click="notAll">都不满意?</button>
                        <button v-if="bidEndTime < 0 && !itemData.test_price && itemData.status == 1" class="notAll" @click="notAll">都不满意?</button>
                        <button v-if="bidEndTime < 0 && !itemData.test_price && itemData.status == 4" class="qrbjBtn" @click="lookModa2 = true" :class="{'noNum':social.length<=0}" :disabled="social.length<=0">确认报价</button>
                        <!--<button v-if="!itemData.test_price && itemData.status == 4" class="qrbjBtn" @click="lookModa2 = true" :class="{'noNum':social.length<=0}" :disabled="social.length<=0">确认报价</button>-->
                    </div>
                </div>
                <!-- 服务商列表 -->
                <div class="ykjList" v-if="itemData.test_price">
                    <!-- 列表信息 -->
                    <div class="tableHead">
                        <span class="shit28">服务商</span>
                        <span>报名时间</span>
                        <span>稿件</span>
                        <span>上传时间</span>
                        <span>招标结果</span>
                        <span>操作</span>
                    </div>
                    <div class="bidList">
                        <ul>
                            <li v-for="item in joinList">
                                <span class="shit28">{{item.company}}</span>
                                <span>{{item.apply_time  | timeCover}}</span>
                                <span v-if="item.file">已上传</span>
                                <span v-else>未上传</span>
                                <span v-if="item.file">{{item.file.upload_time | timeCover}}</span>
                                <span v-else>---</span>
                                <span>{{item.status_text}}</span>
                                <span><i @click.stop="lookOver(item.id,item.file,item.company,item.test_id)">查看</i></span>
                            </li>
                        </ul>
                            <!--<span :class="item.bid_status==4 || item.bid_status==1 ? 'zhongbiao' : 'luoxuan'">{{item.status_text}}</span>-->
                        <!--<up-load style="margin-left:14%;" v-if="flag"></up-load>-->
                    </div>
                </div>
                <!-- 报价商列表 -->
                <div class="baojiaList" v-if="!itemData.test_price && itemData.status == 4">
                    <div class="tableHead">
                        <span>服务商</span>
                        <span>测试报价</span>
                        <span>报价时间</span>
                    </div>
                    <CheckboxGroup v-model="social">
                        <ul class="baojiaUl">
                            <li v-for="item in joinList">
                                <em v-if="bidEndTime < 0 && itemData.status == 4"><Checkbox :label="item.id">{{item.company}}</Checkbox></em>
                                <em v-else>{{item.company}}</em>
                                <em>￥{{item.bid_price}}</em>
                                <em>{{item.apply_time | timeCover}}</em>
                            </li>
                        </ul>
                    </CheckboxGroup>
                </div>
                <!-- 已选择报价 -->
                <div class="haveChosenList"
                     v-if="!itemData.test_price && itemData.status == 1 ||
                      !itemData.test_price && itemData.status == 2 ||
                      !itemData.test_price && itemData.status == 0 ||
                      !itemData.test_price && itemData.status == 5">
                    <div class="tableHead">
                        <span class="shit26">服务商</span>
                        <span>报价</span>
                        <span>报价时间</span>
                        <span>稿件</span>
                        <span>上传时间</span>
                        <span>招标结果</span>
                        <span>操作</span>
                    </div>
                    <ul>
                        <li v-for="item in joinList">
                            <span class="shit26">{{item.company}}</span>
                            <span>￥{{item.bid_price}}</span>
                            <span>{{item.apply_time | timeCover}}</span>
                            <span v-if="item.file">已上传</span>
                            <span v-else>未上传</span>
                            <span v-if="item.file">{{item.file.upload_time | timeCover}}</span>
                            <span v-else>---</span>
                            <span>{{item.status_text}}</span>
                            <span @click.stop="lookOver(item.id,item.file,item.company,item.test_id)">查看</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Modal组件 -->
        <div class="ykjPop">
            <Modal
                v-model="lookModal"
                :closable="false"
                :transfer="false"
                width="900px">
                <look-over :lookDate="lookDate" v-on:chanageStatu="chanageStatu"></look-over>
                <div slot="header" style="padding:5px 0px;"><span style="font-size:16px;color:#fff;font-weight:lighter;">查看详情</span></div>
                <div slot="footer"></div>
            </Modal>
        </div>
        <div class="baojiPop">
            <Modal
                    v-model="lookModa2"
                    :transfer="false"
                    width="400px"
                    @on-ok="oKcomfirmFun">
                <div slot="header" style="padding:5px 0px;"><span style="font-size:16px;color:#fff;">确认 {{social.length}} 家服务商报价</span></div>
                <div class="contentText"><br/>确认后服务商将开始制作测试稿件!<br/><br/></div>
            </Modal>
        </div>
    </div>
</template>
<script>
var qs=require('querystring')
import lookOver from './lookOver';
import upLoad from '../../../project/components/onLoad';
import api from 'api'
export default {
    data(){
        return{
            social:[],
            lookModal:false,
            lookModa2:false,
            lookDate:Object,
            id:null,
            Tid:null,
            joinList:[],
            itemData:{},
            isFile:false
        }
    },
    computed:{
      bidEndTime:function () {
          let end = this.itemData.bid_end_time;
          let endTime = new Date(end * 1000);
          let nowTime = new Date();

          let year = parseInt(endTime.getFullYear() - nowTime.getFullYear());
          let month = parseInt((endTime.getMonth()+1) - (nowTime.getMonth()+1));
          let day = parseInt(endTime.getDate() - nowTime.getDate());

          return  year * 365 + month * 30 + day;
      }
    },
    components:{
        upLoad:upLoad,
        lookOver:lookOver
    },
    methods:{
        chanageStatu(){
            this.lookModal = false;
            this.taskDetaGet(this.id);
        },
        backTest(){
            this.$bus.emit('callbackTest');
        },
        //  全都不满意
        notAll(){
            let url=this.GLOBAL.baseRouter+'task/company/all-out';
            this.$axios.post(url,qs.stringify({test_id:this.Tid})).then(()=>{
                this.$Message.success("提交成功!");
            },()=>{
                this.$Message.error("提交失败!")
            })
        },
        //清空列表
        clearList(){
            this.lookModal=false;
        },
        // 查看
        lookOver(id,file,company,testID){
            let obj={
                id:id,
                file:file,
                company:company,
                testID:testID
            }
            this.lookDate=obj;
            this.lookModal=true;
        },
        // 获取详情数据
        async taskDetaGet(id){
            this.id = id;
            const taskDetail = await api.getTaskDetail({id:id});
            if(taskDetail.data.err_code == 0){
                let data = taskDetail.data;
                //因为（一口价array）和（报价JSON）返回的file字段类型不一样 所有需要做一个判断处理 不然会报错  坑逼
                if(!Array.isArray(data.file)){
                    if(data.file){
                        let file = JSON.parse(data.file);
                        file.map(function (creen,index,arr) {
                            return creen.response = JSON.parse(creen.response)
                        })
                        data.file = file;
                        this.isFile = true;
                    }else {
                        this.isFile = false;
                    }
                }
                let nowTime = new Date();
                let bidArr = data.bid;
                let endTime = new Date(data.end_time*1000);
                for(let i=0;i<bidArr.length;i++){

                    let year = parseInt(endTime.getFullYear() - nowTime.getFullYear());
                    let month = parseInt((endTime.getMonth()+1) - (nowTime.getMonth()+1));
                    let day = parseInt(endTime.getDate() - nowTime.getDate());
                    let shenyu = year * 365 + month * 30 + day;
                    bidArr[i].StrEndTime = endTime.getFullYear()+'-'+(endTime.getMonth()+1)+'-'+endTime.getDate();

                    if(shenyu > 0){
                        if(bidArr[i].file){
                            if(bidArr[i].status == 1 || bidArr[i].status == 9 ){
                                bidArr[i].status_text = '中标'
                            }else {
                                bidArr[i].status_text = bidArr[i].status_text
                            }
                        }else {
                            bidArr[i].status_text = '--'
                        }
                    }else {
                        if(bidArr[i].file){
                            if(bidArr[i].status == 1 || bidArr[i].status == 9 ){
                                bidArr[i].status_text = '中标'
                            }else {
                                bidArr[i].status_text = '落标'
                            }
                        }else {
                            bidArr[i].status_text = '落标'
                        }
                    }
                }
                this.itemData = taskDetail.data;
                this.joinList = taskDetail.data.bid;
                console.log(taskDetail.data.bid);
                this.Tid=taskDetail.data.id;
            }
        },
        //甲方选择确认报价
        oKcomfirmFun(){
            let _this = this;
            (async function () {
                let obj = {
                    id:_this.id,
                    bid_id:JSON.stringify(_this.social)
                }
                const choiceData = await api.choiceBidPrice(obj);
                if(choiceData.data.err_code == 0){
                    //更新页面数据
                    _this.$Message.success(choiceData.data.err_message);
                    _this.taskDetaGet(_this.id);
                }else {
                    _this.$Message.error('请求失败！');
                }
            })();
        }
    },
    filters:{
        substring:function (val) {
            return val.length > 30 ? '...'+val.substring(val.length,15):val;
        },
        timeCover:function (val) {
            let day = new Date(val * 1000);
            return day.getFullYear()+'-'+(day.getMonth()+1)+'-'+day.getDate()
        }
    }
}
</script>
<style type="text/css" lang="less">
    .ykjPop{
        .ivu-modal-footer{
            display: none!important;
        }
    }
    .baojiPop{
        .contentText{
            font-size: 15px;
        }
        .ivu-modal-footer{
            display: block!important;
        }
    }
    .ListDiv{
        width: 72%;
        background: #fff;
        .ListTitle{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            span{font-size: 15px}
            button{
                padding: 5px 10px;
                border-radius: 3px;
                background: #fff;
                cursor: pointer;
                color: #fff;
                border: 0;
                &.notAll{
                    background: #ff4653;
                }
                &.qrbjBtn{
                    background: #3bceb6;
                }
                &.noNum{
                    background: #cfcfcf;
                }
            }
        }
    }
    .tableHead{
        color: #bdbdbd;
        height: 46px;
        line-height: 46px;
        font-weight: lighter;
        background-color: #fdfdfd;
        border-top: 1px solid #e1e1e1;
        border-bottom: 1px solid #e1e1e1;
        padding: 0 10px;
        margin-bottom: 0;
        font-size: 14px;
        span{display: inline-block;text-align: center}
    }
    .ykjList{
        .tableHead{
            span{
                width: 14%;
            }
        }
        .bidList{
            ul{
                max-height: 655px;
                overflow: auto;
                li{
                    border-bottom: 1px solid #e1e1e1;
                    font-weight: lighter;
                    padding: 5px 10px;
                    line-height: 35px;
                    span{
                        display: inline-block;
                        width: 14%;
                        font-size: 14px;
                        text-align: center;
                        i{
                            font-style: normal;
                        }
                    }
                }
            }
        }
        .shit28{
            width: 28%!important;
            text-align: left!important;
        }
    }
    .baojiaList{
        .tableHead{
            span{
                width: 33%;
            }
        }
        .baojiaUl{
            max-height: 655px;
            overflow: auto;
            li{
                text-align: center;
                border-bottom: 1px solid #e1e1e1;
                font-weight: lighter;
                padding: 5px 10px;
                line-height: 35px;
                em{
                    display: inline-block;
                    width: 33%;
                    font-style: normal;
                }
                .ivu-checkbox-checked .ivu-checkbox-inner{
                    border-color: #3bceb6;
                    background-color: #3bceb6;
                }
            }
        }
    }
    .haveChosenList{
        .tableHead{
            span{width: 12%;}
        }
        .shit26{
            text-align: left!important;
            width: 26%!important;
        }
        ul{
            max-height: 655px;
            overflow: auto;
            li{
                border-bottom: 1px solid #e1e1e1;
                font-weight: lighter;
                padding: 5px 10px;
                line-height: 35px;
                span{
                    display: inline-block;
                    font-size: 14px;
                    width: 12%;
                    text-align: center;
                    &:last-child{cursor: pointer}
                }
            }
        }
    }
</style>
