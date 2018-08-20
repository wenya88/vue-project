<template>
  <div class="pigeonhole">
    <div class="menauBar">
      <ul class="projectClassfly">
        <li>原画<span>( 20 )</span></li>
        <li class="currenSty">动作<span>( 60 )</span></li>
        <li>特效<span>( 30 )</span></li>
        <li>场景<span>( 5 )</span></li>
      </ul>

      <ul class="screenBar">
        <!--<li>-->
        <!--<dl>-->
        <!--<dd class="byAsc">送审时间</dd>-->
        <!--<dd class="byDesc">待审天数</dd>-->
        <!--<dd>剩余时间</dd>-->
        <!--</dl>-->
        <!--</li>-->
        <li class="searchBar">
          <div>
            <input type="text" v-model="searchInput" placeholder="任务 / 负责人" @keyup.enter="fetchData"/>
            <button @click="fetchData"></button>
          </div>
        </li>
        <li class="allDownBtn">
          <button @click="downloadFile('project',null)">全部下载</button>
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
            <img class="card-box-pic" :src="item.image[0]"/>
          </div>
          <div class="showHiden">
            <div class="RcardBlock">
              <div class="left">
                <img class="cardPic" :src="item.image[0]"/>
                <span>{{item.name}}</span>
              </div>
              <div class="right">
                <span>{{item.tasktype_name}}</span><i>原画</i>
                <span class="dowmloadFile" @click="downloadFile('task',item.id)">下载文件</span>
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
                formLeft: {}
            }
        },
        computed: {
            ...mapGetters({
                taskList: 'getTaskType',
                subProjectList: 'getSubProjectList'
            })
        },
        created() {
            this.fetchData();
            this.getTaskList();
        },
        methods: {
            ...mapMutations(['setPrimaryMission','setDetailAll','setUserStatus']),
            fetchData() {
                // console.log(this.tasktype)
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
                        // console.log(res)
                        if(res.err_code == 0) {
                            // console.log(res.data);
                            this.fileData = res.data
                            // console.log(this.fileData)
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
            downloadFile(type, id) {
                let data = {
                    type:type,
                    id:id || sessionStorage.projectID
                };
                this.$axios.post(this.GLOBAL.baseRouter+'task/task/pack', qs.stringify(data))
                    .then(res => res.data)
                    .then(res => {
                        if(res.err_code == 0) {
                            // let key = {
                            //   url_key: res.url_key
                            // }


                            // window.open('http://192.168.2.19/index.php?r=file/file/download&url_key='+ res.url_key, '_blank');



                            // this.$axios.post(this.GLOBAL.baseRouter+'file/file/download', qs.stringify(key))
                            // .then(res => res.data)
                            // .then(res => {
                            //   window.open(urls, '_blank')
                            //   console.log(res)
                            // })
                        }else {
                            this.$Message.warning(res.err_message);
                        }
                    })
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
                console.log(113,item)
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
        }
    }
</script>

<style lang='less' scoped>
  @import "./style/project.less";
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
    }
  }
</style>
