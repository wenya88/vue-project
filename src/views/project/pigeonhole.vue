<template>
  <div class="pigeonhole">
    <div class="menauBar">
      <ul class="projectClassfly">
        <li v-for="(item,index) in TwoMenuList" :class="{'currenSty':index== typeIndex}" @click="selectTaskType(index,item.id)">{{ item.tasktype_name }}<span>( {{item.cnt}} )</span></li>
      </ul>

      <ul class="screenBar">
        <li class="searchBar">
          <div>
            <input type="text" v-model="searchInput" placeholder="任务 / 负责人" @keyup.enter="fetchData"/>
            <button @click="fetchData"></button>
          </div>
        </li>
        <li class="allDownBtn">
            <button v-if="isALLAutoDownFlag" class="downloading" title="打包完成后将自动下载">打包中<i class="ivu-icon animationB"></i></button>
            <button v-else class="downbtn" @click="downloadFile('project','')" title="打包完成后将自动下载">全部下载</button>
        </li>
      </ul>

      <!--<Row type="flex" justify="space-between" class="code-row-bg">-->
      <!--<Col span="16">-->
      <!--<Button type="primary" @click="downloadFile('',projectID)">全部下载</Button>-->
      <!--</Col>-->
      <!--<Col span="2"> 类型:-->
      <!--<Select v-model="selTaskType" style="width:80px" @on-change="fetchData()">-->
      <!--<OptionGroup :label="item.name" v-for="(item,index) in taskList" :key="index">-->
      <!--<Option v-for="items in item.tasktype" :value="items.id" :key="items.id">{{ items.tasktype_name }}</Option>-->
      <!--</OptionGroup>-->
      <!--</Select>-->
      <!--</Col>-->
      <!--<Col span="2"> 关注:-->
      <!--<Select v-model="model" style="width:80px">-->
      <!--<Option v-for="item in followList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
      <!--</Select>-->
      <!--</Col>-->
      <!--<Col span="4">-->
      <!--<Input-->
      <!--v-model="searchInput"-->
      <!--icon="search"-->
      <!--placeholder="任务 / 负责人"-->
      <!--style="width: 200px;float: right;margin-right: 20px;"-->
      <!--@keyup.enter.native="fetchData()"></Input>-->
      <!--</Col>-->
      <!--</Row>-->
      <!--<my-input :placeholder="text" @enter="fetchData()"></my-input>-->


    </div>
    <div class="tab-main" :style="`min-height: ${boxHeight}px;`">
      <Row type="flex" justify="start" class="code-row-bg">
          <Col span="6" v-for="(item,index) in fileData" :key="index">
            <div class="card">
              <div class="card-box" @click="fetchFileData(item.id,item.stage_file.type,item.stage_file.file,item)">
                <!-- <Icon type="heart" color="red" v-if=""></Icon>
                <Icon type="pause" v-else-if=""></Icon> -->
                <img  v-if="item.image[0]" class="card-box-pic" :src="item.image[0]"/>
                <img v-else src="./task/QQ图片20180719133401.jpg"  class="card-box-pic"  alt="">

              </div>
              <div class="showHiden">
                <div class="RcardBlock">
                  <div class="left">
                    <img class="cardPic" :src="item.image[0]"/>
                    <span>{{item.remark_name}}</span>
                  </div>
                  <div class="right">
                    <span>{{item.name}}</span><i>原画</i>

                    <span v-for="itemStatus in clickItem" v-show="itemStatus.id == item.id">
                        <span v-if="itemStatus.status" class="dowmloadFilefalse" title="打包完成后将自动下载">打包中<b class="ivu-icon animationB"></b></span>
                        <span v-else class="dowmloadFile" title="打包完成后将自动下载" @click="downloadFile('task',item.id)">下载文件</span>
                    </span>

                  </div>
                </div>
              </div>
            </div>
        </Col>
      </Row>
    </div>
    <!-- <div slot="three">
      <ImgEditor v-if="imgConponent"></ImgEditor>
      <VidEditor v-if="vidConponent"></VidEditor>
      <div v-if="NotType" class="notIMG">暂未上传任务文件</div>
    </div>  -->
    <Modal
            v-model="isTabModal"
            width="1200"
            :styles="{top: '150px'}"
            :closable="false"
            okText= '保存'
            cancelText='取消'
            @on-cancle="closeTabmodal"
    >
      <browsetask ref="pigeonholetask" v-on:opentabmodal = 'openTabmodal'></browsetask>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
    var qs = require('querystring');
    import browsetask from './task/browseTaskPop';
    import { mapGetters ,mapMutations} from 'vuex';
    export default {
        name: 'pigeonhole',
        components: {
            browsetask,
        },
        data() {
            return {
                date: (Date.parse(new Date()))/1000,
                searchInput: '',
                fileData: [],
                text: '任务 / 负责人',
                selTaskType: '',
                taskType: '',
                subpId: null,
                boxHeight: 300,
                status: '4',
                projectID: sessionStorage.projectID,
                followList: [
                    {
                        value: 0,
                        label: '不限'
                    }, {
                        value: 1,
                        label: '是'
                    }
                ],
                model: '',
                searchInput: '',
                isTabModal: false,
                imgConponent: false,
                vidConponent: false,
                NotType: false,
                formLeft: {},
                TwoMenuList:{},
                typeIndex:null,
                isALLAutoDownFlag:false,
                clickItem:[]
            }
        },
        watch:{
            downComplateArr(val){
                let clickItemArr = this.clickItem;
                let complateArr = this.downComplateArr;
                if(complateArr.length > 0){
                    // console.log(clickItemArr.length);
                    // console.log(complateArr.length);
                    for(let i=0;i<clickItemArr.length;i++){
                        if(clickItemArr[i].id == complateArr[0].id && clickItemArr[i].type == complateArr[0].type){
                            clickItemArr[i].id = complateArr[0].id;
                            clickItemArr[i].type = complateArr[0].type;
                            clickItemArr[i].status = complateArr[0].status;
                            this.$store.commit('resetArr',true);
                        }
                    }
                }
            },
            downloadStatus(val){
                if(val) {
                    this.isALLAutoDownFlag = false;
                    this.$store.state.downloadStatus = false;
                }
            }
        },
        computed: {
            ...mapGetters({
                taskList: 'getTaskType',
                subProjectList: 'getSubProjectList'
            }),
            downloadStatus(){
                return this.$store.state.downloadStatus;
            },
            downComplateArr(){
                return this.$store.state.downComplateArr;
            }
        },
        created() {
            this.fetchData();
            this.getTaskList();
            this.getTwoMenuList();
        },
        methods: {
            ...mapMutations(['setPrimaryMission','setDetailAll','setUserStatus']),
            fetchData() {
                let data = {
                    status: this.status,
                    tasktype: this.selTaskType,
                    project_id: sessionStorage.projectID,
                    project_child_id: '',
                    search: this.searchInput
                }
                this.$axios.post(this.GLOBAL.baseRouter+'task/task/page',qs.stringify(data))
                    .then(res => res.data)
                    .then(res => {
                        if(res.err_code == 0) {
                            this.fileData = res.data;
                            this.clickItem = [];
                            for(var item in res.data){
                                this.clickItem.push({id:res.data[item].id,status:false,type:'task'})
                            }
                            console.log(this.clickItem);
                        }
                    })
            },
            /**
             * 从store中把任务类型获取出来
             */
            getTaskList() {
                let data = {
                    company_id: 1
                }
                this.$store.dispatch('fetchTaskList', qs.stringify(data));
            },
            downloadFile(type,id) {
                let data = {
                    type:type,
                    id:id || sessionStorage.projectID
                };
                this.$axios.post(this.GLOBAL.baseRouter+'task/task/pack', qs.stringify(data))
                    .then(res => res.data)
                    .then(res => {
                        if(res.err_code == 0) {
                            //如果没有url发起webSocket
                            if(!res.download_url){
                                this.sendWebsocket(type,id);
                            }else {
                                let hostUrl = 'https://yhc-1.oss-cn-shanghai.aliyuncs.com/'+res.download_url;
                                var a = document.createElement('a');
                                a.href = hostUrl;
                                // a.download = "proposed_file_name";
                                a.click();
                            }
                        }else if(res.err_code == 10030){
                            this.$Message.warning(res.err_message);
                            this.sendWebsocket(type,id);
                        }else {
                            this.$Message.warning(res.err_message);
                        }
                    })
            },
            sendWebsocket(type,id){
                if(type=='task'){
                    let len = this.clickItem.length;
                    for(let i=0;i<len;i++){
                        if(this.clickItem[i].id == id){
                            this.clickItem[i].status = true;
                        }
                    }
                }else {
                    this.isALLAutoDownFlag = true;    //是否展示全部下载加载按钮
                }
                const data = JSON.stringify({
                    action:'download_url',
                    type:type,
                    id:id || sessionStorage.projectID
                });
                // console.log(data);
                webSocket.send(data);
            },
            closeTabmodal() {
                this.isTabModal = false;
            },
            openTabmodal() {
                this.isTabModal = true;
            },
            fetchFileData(taskId,type,file,item) {
//      this.isTabModal = true;
//      this.$store.commit('changeComponentTaskID',taskId);
//      this.$store.commit('changeComponentFileURl',file);
//      sessionStorage.AllowEdit=undefined;
//      this.$refs.pigeonholetask.initBrowseTaskPop(taskId,type);//根据ID和类型初始化弹窗
//      this.$refs.pigeonholetask.setEditDisabled(true);//设置弹窗能否编辑
                this.$store.commit('changeComponentTaskID',taskId);
                this.$store.commit('changeComponentFileURl',file);
                this.setPrimaryMission(item);
                this.setDetailAll(item);
                this.$router.push({path:'/project/details'});
                this.$Loading.start();
                this.boxHeight = 0;
                // this.$axios.post(this.GLOBAL.baseRouter+'task/task/info', qs.stringify(data))
                // .then(res => res.data)
                // .then(res => {
                //   console.log(res)
                //
                //   this.formLeft = res;
                //   // this.$Loading.finish();
                //   // this.getSubProject(res.project_id)
                //   this.taskType = res.tasktype_id+''
                //   this.subpId = res.project_child
                // })
            },
            /*归档二级分类*/
            getTwoMenuList(status){
                let data ={
                    project_id:sessionStorage.projectID,
                    status:status||4
                }
                this.$axios.post(this.GLOBAL.baseRouter+'task/task/task-tasktype-count', qs.stringify(data)).then(res=>res.data).then(res =>{
                    if(res.err_code == 0){
                        this.TwoMenuList = res.data;
                    }
                })
            },
            /*根据选择的二级标签查询数据*/
            selectTaskType(index,type){
                this.typeIndex = index;
                this.selTaskType = type;
                this.fetchData();
            }
        }
    }
</script>

<style lang='less' scoped>
  @import "./style/project.less";
  .demo-spin-icon-load,.animationB{
      animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
      from { transform: rotate(0deg);}
      50%  { transform: rotate(180deg);}
      to   { transform: rotate(360deg);}
  }
  .ivu-spin-fix{background: #3bceb6!important;}
  .ivu-icon-load-c:before{color: #fff!important;}
  .card{
    position: relative;
    .showHiden{display: none};
    &:hover{
      cursor: pointer;
      .showHiden{display: block}
    }
  }
  .RcardBlock{
    display: flex;align-items: center;justify-content: space-between;position: absolute;bottom: 0;left: 0;right: 0;
    background: linear-gradient(rgba(0, 0, 0, 0.02), rgb(0, 0, 0,1));
    width:100%;padding: 10px 20px;color: #fff;font-size: 14px;
    i,span{white-space: nowrap;text-overflow:ellipsis;overflow:hidden;}
    i{font-style: normal;display: inline-block;font-size: 12px;border: 1px solid #df9b36;color: #df9b36;padding: 0 1px;border-radius: 3px;line-height: 14px}
    span{display: flex;align-items: center;padding: 0 10px;}
    .left ,.right{display: flex;align-items: center;}
    .left{
      img{width: 40px;height: 40px;border-radius: 100%}
    };
    .right{
      border-left: 1px dashed rgba(188, 188, 188, 0.64);
      .dowmloadFile{
        cursor: pointer;
        &:after{display: inline-block;content: '';width: 13px;height: 13px;background: url("./proStat/image/dowmIconr.png") no-repeat;margin-left: 5px}
      }
        .dowmloadFilefalse{}
        b{
            &:after{content: "\F29C";color: #fff;font-size: 15px;padding: 0 5px}
        }
    }
  }
</style>
