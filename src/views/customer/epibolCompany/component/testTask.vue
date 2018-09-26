<template>
    <div>
        <div class="bidListShit" v-if="!detailsModal">
                <div class="tableHeade">
                    <span class="shit1">测试任务</span>
                    <span>测试费用(元)</span>
                    <span>项目预计总额(元)</span>
                    <span class="shit4">报名服务商</span>
                    <span>报名/报价截止</span>
                    <span>投稿截止</span>
                    <span>状态</span>
                    <span class="shit8">操作</span>
                </div>
                <dl>
                    <dd v-for="item in testTaskData" :key="item.id">
                      <span  class="shit1">
                          <em>
                              {{item.test_name}}
                          </em>
                      </span>
                      <span>
                          <em v-if="item.test_price">￥{{item.test_price}}</em>
                          <em v-else>服务商报价</em>
                      </span>
                      <span>
                          ￥{{item.project_max_price}}
                      </span>
                      <span class="shit4">
                          {{item.join_num}} 家
                      </span>
                      <span>
                          {{item.bid_end_time}}
                      </span>
                      <span>
                          {{item.end_time}}
                      </span>
                      <span>
                          {{item.status_text}}
                      </span>
                      <span class="shit8">
                          <!--<p v-if="item.status==0?true:false">-->
                            <!--&lt;!&ndash;<i @click="editTask(item)"  class="iconfont icon-bianji2"></i>&ndash;&gt;-->

                            <!--<i @click="details(item)">查看详情</i>-->
                            <!--&lt;!&ndash;&nbsp;&nbsp;<router-link :to="'/customer/payManage/'+item.id"  class="pay">去支付</router-link>&ndash;&gt;-->
                          <!--</p>-->

                            <i @click="details(item)">详情</i>
                          <i v-if="item.shengyuDay > 0" @click="deleteTask(item.id)" class="iconfont icon-shanchu"></i>
                            <i v-if="item.status==0" class="goPay" @click="goPayFun(item)">去支付</i>
                      </span>
                      <div class="clear"></div>
                    </dd>
                  </dl>
            <!-- Modal组件 -->
            <Modal
                v-model="applModal"
                :title="testTitle"
                @on-ok="submitOk"
                width="600px"
                :styles="{top: '30px'}">
                <add-epibol ref="addEpibol"></add-epibol>
                <div slot="footer">
                    <Button type="text" size="large" @click="applModal=!applModal">取消</Button>
                    <Button type="primary" size="large" @click="submitOk">确认添加</Button>
                </div>
            </Modal>
        </div>

        <!-- 详情 -->
        <div v-else>
           <task-deatails ref="taskDeta"></task-deatails>
        </div>
    </div>
</template>
<script>
var qs=require('querystring')
import taskDeatails from './taskDetails.vue';
import addEpibolCom from './addEpibolCom.vue';
import api from 'api';
export default {
    data(){
        return{
            applModal:false,
            addDate:{
                postData:{},
                animalStatus:null
            },
            animalStatus:null,
            detailsModal:false,
            testTitle:''
        }
    },
    components:{
        addEpibol:addEpibolCom,
        taskDeatails:taskDeatails
    },
    mounted(){
        this.autoH();
        this.$bus.on('emitAddData',(data,status)=>{
            this.addDate.postData = data;
            this.addDate.animalStatus = status;
        })
        this.$bus.on('callbackTest',()=>{
            this.detailsModal=false;
            this.$bus.emit('submitOk');
        });
    },
    props:['testTaskData'],
    methods:{
        //   初始化高
        autoH(){
          $(".bidListShit").height($(window).height()-210)
      },
        newAdd(){
          let _this=this;
          _this.applModal=true;
          _this.testTitle="增加测试任务"
        },
        //招标详情
        details(item){
        this.detailsModal=true;
        this.$nextTick(()=>{
            this.$refs.taskDeta.taskDetaGet(item.id,item);
        })
        this.$bus.emit('showDetails')
      },
        //提交新增
        submitOk(){
            let _this = this;
            let params = this.addDate.postData;
            let status = this.addDate.animalStatus;
            if(params.file){
                params.file = JSON.stringify(params.file)
            }
            if(!params.test_name){
                this.$Message.error("请填写任务名称!")
            }else if(status == 2){
                if(!params.test_price){
                    this.$Message.error("请填写测试费用!")
                }else if(isNaN(params.test_price)){
                    this.$Message.error("金额必须为数字!")
                }else if(params.test_price <= 0){
                    this.$Message.error("金额不能小于0!")
                }else {
                    check();
                }
            }else {
                params.test_price = null;
                check();
            }
            function check() {
                if(!params.project_max_price){
                    _this.$Message.error("请填写项目总额!")
                }else if(isNaN(params.project_max_price)){
                    _this.$Message.error("金额必须为数字!")
                    params.project_max_price = null;
                }else if(params.project_max_price <=0){
                    _this.$Message.error("金额不能小于0!")
                    params.project_max_price = null;
                }else if(!params.bid_end_time){
                    _this.$Message.error("请选择报名截止日期!")
                }else if(!params.end_time){
                    _this.$Message.error("请选择投稿截止日期!")
                } else if(parseInt(new Date(params.end_time).getTime()) < parseInt(new Date(params.bid_end_time).getTime())){
                    _this.$Message.error("交稿时间不能小于报名时间!")
                    params.end_time = null;
                }else {
                    //新增
                    let url=_this.GLOBAL.baseRouter+'task/company/add-test-task';
                    _this.$axios.post(url,qs.stringify(params)).then((msg)=>{
                        if(msg.data.err_code==0){
                            _this.$Message.success('提交成功');
                            _this.$bus.emit('submitOk');
                            _this.applModal=false;
                            for(var key in params){
                                params[key] = null;
                            }
                        }else {
                            _this.$Message.error(msg.data.err_message);
                            _this.applModal=true;
                        }
                    },()=>{
                        _this.$Message.error('提交失败,请重试');
                        _this.applModal=true;
                    })
                }
            }

        },
        //删除
        deleteTask(Tid){
            if(window.confirm('你确定要删除吗？')){
                let _this=this;
                let url=_this.GLOBAL.baseRouter+'task/company/delete-test-task';
                _this.$axios.post(url,qs.stringify({id:Tid})).then((res)=>{
                    if(res.data.err_code == 0){
                        _this.$Message.success('删除成功!')
                        _this.$bus.emit('submitOk');
                    }else {
                        _this.$Message.error("删除失败!");
                    }
                })
            }
        },

        //支付
        async goPayFun(item){
            const pay = await api.paytoyi({id:item.id});
            if(pay.data.err_code==0){
              this.$Message.success(pay.data.err_message);
              this.$emit('referList');
            }else {
              this.$Message.error('支付失败！')
            }
        }
    }
}
</script>
<style type="text/css" lang="less" scoped>
    /*看不懂以前的样式 也不想改 还是自己写样式吧*/
    .bidListShit{
        display: flex;
        flex-direction: column;
        .tableHeade{
            color: #bdbdbd;
            height: 46px;
            line-height: 46px;
            font-weight: lighter;
            background-color: #fdfdfd;
            border-bottom: 1px solid #e1e1e1;
            margin-bottom: 0;
            padding: 0 10px;
        }
        dl {overflow: auto;height: 100%}
        dd {
            border-bottom: 1px solid #e1e1e1;
            background: #fff;
            margin: 0;
            color: #777;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: lighter;
            padding: 0 10px;
            height: 60px;
            line-height: 60px;
            i, em {
                font-style: normal;
            }
            .pay{
                background: #3bceb6;
                color: #fff;
                padding: 0 10px;
                border-radius: 3px;
            }
        }
        .tableHeade, dd {
            span {
                display: inline-block;
                text-align: center;
                width: 11.4%;
            }
            .shit1 {
                width: 20%;
                text-align: left;
            }
            .shit4 {
                width: 8%;
            }
            .shit8 {
                text-align: right;
            }
            .goPay{
                font-style: normal;
                padding: 5px 10px;
                background: #17ceb1;
                color: #fff;
                border-radius: 3px;
                font-size: 13px;
                &:hover{
                    background: #17eccf;
                    cursor: pointer;
                }
            }
        }

    }
</style>

