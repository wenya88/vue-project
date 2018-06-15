<template>
    <div class="bidList">
                <dl>
                    <dt>
                      <span>测试任务</span>
                      <span>测试费用(元)</span>
                      <span>项目预计总额(元)</span>
                      <span>报名服务商</span>
                      <span>投稿截止</span>
                      <span>状态</span>
                      <span>操作</span>
                      <div class="clear"></div>
                    </dt>
                    <dd v-for="item in testTaskData" :key="item.id">
                      <span>
                          <img :src="item.picture" />
                          <em>
                              {{item.test_name}}
                          </em>
                      </span>
                      <span>
                          ￥{{item.test_price}}
                      </span>
                      <span>
                          ￥{{item.project_min_price}} ~ ￥{{item.project_min_price}}
                      </span>
                      <span>
                          {{item.join_num}} 家
                      </span>
                      <span>
                          {{item.end_time}}
                      </span>
                      <span>
                          {{item.status_text}}
                      </span>
                      <span>
                          <p v-if="item.status==0?true:false">
                              <router-link :to="'/customer/payManage/'+item.id"  class="pay">支付</router-link>
                              <br/>
                              <i @click="editTask(
                                  item.id,
                                  item.test_name,
                                  item.test_price,
                                  item.project_min_price,
                                  item.project_max_price,
                                  item.end_time,
                                  item.file_require,
                                  item.picture,
                                  item.description,
                                  item.file
                              )">编辑</i>
                            <i @click="deleteTask(item.id)">删除</i>
                        </p>
                            <i v-if="item.status>0?true:false" @click="details(
                                  item.id,
                                  item.test_name,
                                  item.test_price,
                                  item.project_min_price,
                                  item.project_max_price,
                                  item.end_time,
                                  item.file_require,
                                  item.picture,
                                  item.description,
                                  item.file
                              )">详情</i>
                      </span>
                      <div class="clear"></div>
                    </dd>
                  </dl>
        <!-- Modal组件 -->
        <Modal
            v-model="applModal"
            :title="testTitle"
            @on-ok="submitOk"
            @on-cancel="cancelModal"
            :closable="false"
            width="600px"
            :styles="{top: '30px'}">
            <add-epibol ref="addEpibol"></add-epibol>
        </Modal>
        <!-- 详情 -->
        <Modal
            v-model="detailsModal"
            :closable="false"
            @on-cancel="detailsCance"
            :mask-closable="false"
            :styles="{top: '30px'}"
            width="1500px">
            <task-deatails ref="taskDeta"></task-deatails>
            <div slot="footer">
                <Button type="ghost" @click.native="detailsCance" size="small">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
var qs=require('querystring')
import taskDeatails from './taskDetails.vue';
import addEpibolCom from './addEpibolCom.vue';
export default {
    data(){
        return{
            applModal:false,
            addDate:[],
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
        this.$bus.on('emitAddData',val=>{
            this.addDate=val
        });
    },
    props:{
        testTaskData:{
            type:Array
        }
    },
    methods:{
        //   初始化高
      autoH(){
          $(".bidList").height($(window).height()-210)
      },
        //   新增
      newAdd(){
          let _this=this;
          _this.applModal=true;
          _this.testTitle="增加测试任务"
      },
        //   取消
      cancelModal(){
         this.$bus.emit('clearEpiboComData');
      },
      detailsCance(){
          this.$bus.emit('clearEpiboComData');
          this.$refs.taskDeta.clearList();
          this.joinList=[];
          this.detailsModal=false;
      },
    
    //   招标详情
      details(id,testName,testPrice,projectMinPrice,projectMaxPrice,endTime,fileRequire,picture,description,file){
          let taskObj={
            id:id,
            testName:testName,
            testPrice:testPrice,
            projectMinPrice:projectMinPrice,
            projectMaxPrice:projectMaxPrice,
            endTime:endTime,
            fileRequire:fileRequire,
            picture:picture,
            description:description,
            file:file,
            flag:true
        };
        this.$bus.emit('emitEditTask',taskObj);
        this.detailsModal=true;
        this.$refs.taskDeta.taskDetaGet(id);
        
      },
    //   编辑任务
    editTask(id,testName,testPrice,projectMinPrice,projectMaxPrice,endTime,fileRequire,picture,description,file){
        let taskObj={
            id:id,
            testName:testName,
            testPrice:testPrice,
            projectMinPrice:projectMinPrice,
            projectMaxPrice:projectMaxPrice,
            endTime:endTime,
            fileRequire:fileRequire,
            picture:picture,
            description:description,
            file:file,
            flag:false
        }
        this.$bus.emit('emitEditTask',taskObj);
        this.applModal=true;
        this.testTitle="编辑测试任务";
    },
    //   删除
    deleteTask(Tid){
        if(window.confirm('你确定要删除吗？')){
                let _this=this;
                let url=_this.GLOBAL.baseRouter+'task/company/delete-test-task';
                _this.$axios.post(url,qs.stringify({id:Tid})).then(()=>{
                    _this.$Message.success('删除成功!')
                    _this.$bus.emit('submitOk');
                })
        }else{
                return
        }
        
    },
      //   提交新增
      submitOk(){
        let _this=this;
        let params={
            id:this.addDate.id,
            create_demand:1,
            test_name:this.addDate.taskName,
            test_price:this.addDate.testMoney,
            project_min_price:this.addDate.lowMoney,
            project_max_price:this.addDate.tallMoney,
            end_time:this.addDate.testDate,
            file_require:this.addDate.textTaskAsk,
            picture:this.addDate.uploadurl,
            description:this.addDate.otherExplain,
            file:JSON.stringify(this.addDate.accFile)
        };
        //新增
        if(params.id==null){
            let url=_this.GLOBAL.baseRouter+'task/company/add-test-task';
            _this.$axios.post(url,qs.stringify(params)).then((msg)=>{
                if(msg.data.err_code>0){
                    _this.$Message.error(msg.data.err_message);
                    _this.applModal=true;
                }else if(msg.data.err_code==0){
                    _this.$Message.success('提交成功');
                    _this.$bus.emit('submitOk');
                }
            },()=>{
                _this.$Message.error('提交失败,请重试');
                _this.applModal=true;
            })
        }else{ //修改测试任务
            let url=_this.GLOBAL.baseRouter+'task/company/edit-test-task';
            _this.$axios.post(url,qs.stringify(params)).then((msg)=>{
                if(msg.data.err_code>0){
                    _this.$Message.error(msg.data.err_message);
                    _this.applModal=true;
                }else if(msg.data.err_code==0){
                    _this.$Message.success('提交成功');
                    _this.$bus.emit('submitOk');
                }
            },()=>{
                _this.$Message.error('提交失败,请重试');
                _this.applModal=true;
            })
         }
        }
    }
}
</script>

