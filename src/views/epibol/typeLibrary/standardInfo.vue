<template>
    <Content class="taskClassLibrary" :style="{padding: '0 0 70px', minHeight: '280px', background: '#fff'}">

        <Form class="spaceTb" :model="formLeft" label-position="left" :label-width="100">
            <!--内容规范-->
            <slot name="item"></slot>
            <!--任务类型名称-->
            <h4 :style="{paddingBottom:'10px'}">规范名称</h4>
            <section v-if="!project" class="taskTypeName">
                <div v-show="boxShow" class="taskTypeNameBox">
                    <div v-for="(item,index) in TaskIdentity" :key="index" style="display: flex;flex-wrap: wrap">
                        <img :src="item.url" @click="secMarkers(item,'icon')" :class="{'iconColor':identification.iconBorder === item.id}" class="identification" width="30" height="36">
                        <!--<Icon @click.native="secMarkers(item,'icon')" class="identification"-->
                              <!--:class="{'iconColor':identification.iconBorder === item.icon}" :type="item.icon"></Icon>-->
                        <div @click="secMarkers(item)" class="identification"
                             :class="{'iconColor':identification.iconColor === item.color}">
                            <p class="signColor" :style="{background:item.color}"></p>
                        </div>
                    </div>
                    <Button @click="addMarkers(true)" type="text">确认</Button>
                    <Button @click="addMarkers(false)" type="text">取消</Button>
                </div>
                  <Input   :style="{width:'300px',paddingBottom:'20px'}" placeholder="新建任务类型" v-model="typename.typename"></Input>
                  <button @click="showMarkers" class="btn">
                      <img v-if="identification.icon" :src="identification.icon"   :style="{filter: `drop-shadow(${identification.iconColor?identification.iconColor:'black'} 0px -30px)`,width:'30px',color:identification.color}"
                           style="height:36px;margin-top:30px;">
                      <template v-else>任务标识</template>
                  </button>
            </section>
            <h4 :style="{paddingBottom:'10px'}">制作规范</h4>
          <template v-if="pstandard.length>0" >
              <Row v-for="(item,index) in pstandard" :key="'pstandard'+index" class="fileAttr">
                  <Col span="5">
                  <AutoComplete v-model="item.name" placeholder="额外属性名称" clearable>
                      <!-- <Option v-for="item in reqData" :value="item.config_name" :key="item.conf">{{ item.config_name }}</Option> -->
                  </AutoComplete>
                  </Col>
                  <Col span="10">
                  <AutoComplete v-model="item.values" placeholder="额外属性说明" clearable style="margin-left:20px">
                      <!-- <Option v-for="item in reqData" :value="item.value" :key="item.conf">{{ item.value }}</Option> -->
                  </AutoComplete>
                  </Col>
                  <Icon @click.native="removeFileat(index)" type="trash-b" class="delIcon"></Icon>
              </Row>
          </template>
            <!--文件添加-->
            <template v-if="fileShow" :style='{margin:"10px 0"}'>
                <Col span="5">
                <AutoComplete v-model="fileAddName" placeholder="额外属性名称" clearable>
                    <!-- <Option v-for="item in reqData" :value="item.config_name" :key="item.conf">{{ item.config_name }}</Option> -->
                </AutoComplete>
                </Col>
                <Col span="10">
                <AutoComplete v-model="fileAddMain" placeholder="额外属性说明" clearable style="margin-left:20px">
                    <!-- <Option v-for="item in reqData" :value="item.value" :key="item.conf">{{ item.value }}</Option> -->
                </AutoComplete>
                </Col>
                <Button type="text" @click="addFileat()">确认</Button>
                <Button type="text" @click="closeFileat()">取消</Button>
            </template>

            <Button v-if="!fileShow" icon="plus-round" type="dashed" long @click="fileListAdd" style="width:718px">
                增加制作规范
            </Button>

            <!--流程规范-->
            <!--规范增加-->
            <h4 :style="{paddingBottom:'10px'}">制作流程规范</h4>
            <Button type="primary" @click="modal1 = true">增加标签</Button>
            <Button type="primary" @click="modal2 = true">删除标签</Button>
            <Modal
                    v-model="modal1"
                    title="增加标签"
                    @on-ok="addNorms"
            >
                <section>
                    <div style="margin-bottom: 5px">
                        <span>规范标签&emsp;：&emsp;</span>
                        <Input v-model="normValue" placeholder="增加规范标签" style="width: 200px"></Input>
                    </div>
                </section>
            </Modal>
            <Modal
                    v-model="modal2"
                    title="删除标签"
                    @on-ok="delNorms"
            >
                <Select v-model="delnormsValue" size="small" class="standard">
                    <Option v-for="item in norms" :label="item.name" :value="item.id" :key="item.id">
                        {{ item.name }}
                    </Option>
                </Select>
            </Modal>
            <!--流程核心-->
            <div style="display: flex;padding: 10px 0 0 40px;">
                <div style="flex: 12">
                    <Steps v-if="fstandard" :style="{width:'800px'}" :current="current" direction="vertical" size="small">
                        <Step v-for="(step,index) in fstandard" class="stepContainer"  :key="index">
                            <!--步骤名称-->
                            <div v-show="!step.flowTIlteShow" @click="step.flowTIlteShow = !step.flowTIlteShow" class="title" style="cursor: pointer">{{step.stage_name}}</div>
                            <p  class="acmSign" v-if="fstandard.length === index+1" >交稿阶段</p>
                            <input v-show="step.flowTIlteShow"  @blur="step.flowTIlteShow = !step.flowTIlteShow" v-model="step.stage_name" class="title" type="text"/>
                            <!---->
                            <ul class="stepsUl">

                                <li class="stepsList" v-for="(list,i) in step.require" :key="i">
                                    <Input v-model="list.text" placeholder="Enter something..."
                                           style="width: 400px"></Input>
                                    <!--规范列表-->
                                    <Select v-model="list.norm" size="small" class="standard">
                                        <Option v-for="item in norms" :label="item.name" :value="item.id" :key="item.id">
                                            {{ item.name }}
                                        </Option>
                                    </Select>
                                    <div class="priorityContainer">
                                        <p class="priority"  :class="`priority${list.level}`" >{{list.level|priorityValue}}</p>
                                        <div class="priorityList" >
                                            <p class="priority priority3" @click="editPriority('3',index,i)">高</p>
                                            <p class="priority priority2" @click="editPriority('2',index,i)">中</p>
                                            <p class="priority priority1" @click="editPriority('1',index,i)">低</p>
                                        </div>
                                    </div>
                                    <Icon type="trash-b" class="delIcon" @click="delFlowNorm(index,i)"></Icon>
                                </li>
                                <!--审核选项-->
                                <Select  v-if="project" v-model="step.review" multiple style="position:absolute;top:-20px;left:454px;width:212px;">
                                    <Option v-for="item in reviewList" :value="item.id" :key="item.id">{{ item.label }}</Option>
                                </Select>
                            </ul>
                            <!--流程info增加-->
                            <div class="stepsUl">
                                {{step.show}}
                                <div v-show="step.show" class="stepsList">
                                    <Input v-model="stepInfoList.text" placeholder="请输入对该阶段要求"
                                           style="width: 400px"></Input>
                                    <Select v-model="stepInfoList.norm" class="standard" size="small">
                                        <Option v-for="item in norms" :value="item.id" :key="item.id">
                                            {{ item.name }}
                                        </Option>
                                    </Select>
                                    <div class="priorityContainer">
                                        <p class="priority" style="border: 1px solid #ccc;" :class="`priority${stepInfoList.level}`" >{{stepInfoList.level|priorityValue}}</p>
                                        <div class="priorityList">
                                            <p class="priority priority3" @click="editPriority('3')">高</p>
                                            <p class="priority priority2" @click="editPriority('2')">中</p>
                                            <p class="priority priority1" @click="editPriority('1')">低</p>
                                        </div>
                                    </div>
                                    <Button @click="stepAdd(index)" type="text">确认</Button>
                                    <Button @click="closeStepList(index)" type="text">取消</Button>
                                </div>
                                    <Icon v-show="!step.show" @click.native="flowAddShow(index)" type="plus"
                                      style="margin-left:10px;font-size: 12px;cursor: pointer"></Icon>
                            </div>
                        </Step>
                    </Steps>
                </div>
                <div style="flex: 12" >
                    <Icon @click.native="addSteps" style="font-size:36px;color: #39f;cursor: pointer;padding: 10px;" type="plus-circled"></Icon>
                </div>

            </div>

            <h3 :style="{padding:'20px 0 0px'}">文稿文件规范</h3>
            <template v-if="tstandard.length>0">
                <div v-for="(item,index) in tstandard" :key="'tstandard'+index" class="attachingTask" :style='{margin:"20px 0"}'>
                    <Col span="5">
                    <AutoComplete v-model="item.name" placeholder="输入格式，如“max”" clearable></AutoComplete>
                    </Col>
                    <Col span="10">
                    <AutoComplete v-model="item.values" placeholder="附加文件描述..." clearable
                                  style="margin-left:20px"></AutoComplete>
                    </Col>
                    <Icon @click.native="delOtherfile(index)" type="trash-b" class="delIcon"></Icon>
                </div>
            </template>

            <template v-if="OtherfileShow">
                <Col span="5">
                <AutoComplete v-model="OtherfileName" placeholder="输入格式，如“max”" clearable></AutoComplete>
                </Col>
                <Col span="10">
                <AutoComplete v-model="OtherfileMain" placeholder="附加文件描述..." clearable
                              style="margin-left:20px"></AutoComplete>
                </Col>
                <Button type="text" @click="addJunctShow">确认</Button>
                <Button type="text" @click="closeOtherfile">取消</Button>
            </template>
            <Button v-if="!OtherfileShow" style="width:718px" icon="plus-round" type="dashed" @click="OtherfileAdd">
                增加文稿规范
            </Button>
        </Form>
        <Col span="10">
        <Button v-if="isSubmit||project"  type="primary" style="float: right;width: 200px" @click="submitTaskClas">提交</Button>
        <Button v-else  type="error" style="float: right;width: 200px" >系统默认无法修改</Button>
        </Col>
    </Content>

</template>
<script>

    import {mapState} from 'vuex';
    import qs from 'querystring';
    import api from 'api';
    import Icon from "iview/src/components/icon/icon";
    import Caspanel from "iview/src/components/cascader/caspanel";
    import typeList from "./typeList";

    export default {
        components: {
            typeList,
            Caspanel,
            Icon
        },
        props: {
            project: {
                type: Boolean,
                default: false,
            },
            attrContent: {
                type: Array
            },
            ruleList: {
                type: Array
            }
        },
        data() {
            return {
                goinfo:null,
                createInfo:false,
                delnormsValue:'',
                isSubmit:false,// 提交按钮
                updateId :null, // 更新
                newData:null, // 添加

                reviewList:[{id:0,label:'外部审核'},{id:1,label:'内部审核'}],
                fstandard: [],   // 流程规范
                pstandard: [],   // 制作规范
                tstandard: [],   // 文件规范
                typename: {
                    typename:'',
                    icon:'',
                    color:'',
                },    // 规范名称

                /*调试接口添加*/
                norms:[],
                modal1: false,
                modal2: false,
                identification: {
                    iconBorder: null,
                    iconColor: null,    // 颜色
                    icon: null,         // url路径
                    color: null,
                },
                TaskIdentity: [],
                stepInfoList: {
                    text: '',
                    type: '',
                    level: '优先级',
                },
                fileShow: false,
                fileAddName: '',
                fileAddMain: '',
                OtherfileShow: false,
                OtherfileName: '',
                OtherfileMain: '',
                boxShow: false,
                normValue: '',

                // 以上是后面测试添加
                current: 0,
                formLeft: {},
                accesData: [],
                reqData: [],
                attrFile: [{config_name: "", value: ""}],
                otherfile: [{config_name: '', value: ''}],
            };
        },
        mounted() {
            // 获取规范列表
            this.getNormslist();
            // icon列表
            if(!this.project){
                this.iconList();
            }
            /*进入详情*/
            this.$bus.on('typesDetail', (data) => {
                this.goinfo = data;
                this.newtaskTypesDetail(data);
            });
            this.$bus.on('addType', (data) => {
               this.addType(data);
                this.goinfo = data;
               this.isSubmit = true;
            });
            this.$bus.on('projectInfo', (data) => {
                this.addInfo(data);
                this.tabsTypeId = data.id;
                if(data && data.stage){
                    data.stage.map((item, index) => {
                        this.fstandard[index].review = [];
                        if (item.is_inside_audit == 1) {
                            this.fstandard[index].review.push(1);
                        }
                        if (item.is_client_audit == 1) {
                            this.fstandard[index].review.push(0);
                        }
                    });
                }
            });
        },
        methods: {
            /*获取规范列表*/
            async getNormslist() {
                let {data} = await api.getNorms();
                if (data.err_code === 0) {
                    this.norms = data.data
                } else {
                    this.$Message.error(data.err_message);
                }
            },
            /*获取图标库*/
            async iconList(){
                let {data} = await api.getIconList();
                if (data.err_code === 0) {
                    if (data.data) {
                        data.data.map((item, index) => {
                            switch (index) {
                                case 0:
                                    item.color = '#33cc6b';
                                    break;
                                case 1:
                                    item.color = '#ccabb6';
                                    break;
                                case 2:
                                    item.color = '#cc62bd';
                                    break;
                                case 3:
                                    item.color = '#aacc46';
                                    break;
                                case 4:
                                    item.color = '#53ccc3';
                                    break;
                            }
                        })
                    }
                    this.TaskIdentity = data.data

                } else {
                    this.$Message.error(data.err_message);
                }
            },
            /*提交*/
             submitTaskClas(){
                /*项目级*/
                if(this.project){
                     this.submitProject()
                    return false
                }
                /*公司级*/
               this.submitCompany()
            },
            /*项目级提交*/
            async submitProject(){
                this.fstandard.map((item,index) => {
                    if(item.review.indexOf(0) !== -1){
                        this.fstandard[index].is_client_audit = 1
                    }else{
                        this.fstandard[index].is_client_audit = 0
                    }
                    if(item.review.indexOf(1) !== -1){
                        this.fstandard[index].is_inside_audit = 1
                    }else{
                        this.fstandard[index].is_inside_audit = 0
                    }

                });

                let obj = {
                    id:this.tabsTypeId,
                    name:this.typename.typename,
                    stage:JSON.stringify(this.fstandard),
                    standard : JSON.stringify(this.tstandard.concat(this.pstandard).concat(this.ruleList).concat(this.attrContent)),
                    icon:this.identification.iconBorder,
                    color:this.identification.iconColor,
                };
                let res = await api.taskprojectCateUpdate(obj);
                if (res.data.err_code === 0) {
                    this.$Message.success("保存成功");
                    this.$bus.emit('treeUpdate') // 刷新左侧树状图
                } else {
                    this.$Message.error(res.data.err_message);
                }
            },
            /*公司级提交*/
            async submitCompany(){
                let url = 'task/task-type/add';
                let obj = null;
                 if(this.updateId !== null || this.createInfo){
                    url = 'task/task-type/update';
                     obj = {
                         id:this.updateId,
                         name:this.typename.typename,
                         stage:JSON.stringify(this.fstandard),
                         standard : JSON.stringify(this.tstandard.concat(this.pstandard)),
                         icon:this.identification.iconBorder,
                         color:this.identification.iconColor,
                     };
                }else{
                     obj = {
                         category_id:this.newData.cate_id,
                         name:this.typename.typename,
                         stage:JSON.stringify(this.fstandard),
                         standard : JSON.stringify(this.tstandard.concat(this.pstandard)),
                         icon:this.identification.iconBorder,
                         color:this.identification.iconColor,
                     };

                 }
                let res = await api.taskTypeAdd(obj, url);
                if (res.data.err_code === 0) {
                    this.createInfo = true ;
                    this.newtaskTypesDetail(this.goinfo);
                    this.$Message.success("保存成功");
                    this.$bus.emit('treeUpdate') // 刷新左侧树状图
                } else {
                    this.$Message.error(res.data.err_message);
                }
            },
            //增加任务附加文件
            addJunctShow(data) {
                this.tstandard.push({name : this.OtherfileName, values: this.OtherfileMain,type:'file'});
                this.OtherfileShow = false;
                this.OtherfileName = '';
                this.OtherfileMain = '';
            },
            //移除任务附加文件
            delOtherfile(index) {
                this.tstandard.splice(index, 1);
            },
            //移除任务附加文件tabel
            remove(index) {
                this.accesData.splice(index, 1);
            },
            //沟通确认阶段
            addSteps() {
                let aSp = this;
                if (aSp.fstandard.length >= 100 || aSp.current >= 100) {
                    this.$Message.error("最多只能添加6个阶段");
                    aSp.current = 6;
                } else {
//                    aSp.current += 1;
                    this.fstandard.push({
                        stage_name:'新建阶段',
                        require: [
                            {
                                text: "",
                                level:"优先级",
                                norm: ""
                            }],
                        show:false,
                        flowTIlteShow:false,
                    });
                }
            },
            /**
             * 文件属性模块操作
             */
            //增加文件属性
            addFileat() {
                this.pstandard.push({name: this.fileAddName, values: this.fileAddMain,type:'progress'});
                this.fileShow = false;
                this.fileAddName = '';
                this.fileAddMain = '';
            },
            //移除文件属性
            removeFileat(index) {
                this.pstandard.splice(index, 1);
            },
            /**
             * get请求
             */
            get(url, params, call) {
                /*获取列表信息*/
                this.$http.get(url, {params: params}).then(
                    function (res) {
                        call(res);
                    },
                    function (error) {
                        this.$Message.error("数据加载出错了！请刷新浏览器");
                    }
                );
            },
            // 确认 取消按钮
            fileListAdd() {
                this.fileShow = !this.fileShow
            },
            closeFileat() {
                this.fileShow = false;
                this.fileAddName = '';
                this.fileAddMain = '';
            },
            OtherfileAdd() {
                this.OtherfileShow = !this.OtherfileShow
            },
            closeOtherfile() {
                this.OtherfileShow = false;
                this.OtherfileName = '';
                this.OtherfileMain = '';
            },
            stepAdd(index) {
                console.log(this.fstandard)
                this.fstandard[index].require.push({
                    norm: this.stepInfoList.norm,
                    text: this.stepInfoList.text,
                    level: this.stepInfoList.level
                });
                this.$set(this.fstandard[index],'show',false);
                this.stepInfoList = {
                    text: '',
                    norm: '',
                    level: '1'
                };

            },
            closeStepList(index) {
                this.$set(this.fstandard[index], 'show', false);
                this.stepInfoList = {
                    text: '',
                    norm: '',
                    level: '1'
                };
            },
            // 图标框显示
            showMarkers() {
                this.boxShow = !this.boxShow;
                this.identification.iconBorder = null;
                this.identification.iconColor = null;
            },
            // 图标框边框
            secMarkers(item, type) {
                console.log(item)
                if (type === 'icon') {
                    this.identification.iconBorder = item.id;
                    this.identification.icon = item.url;
                } else {
                    this.identification.iconColor = item.color;
                }
            },
            addMarkers(type) {
                this.boxShow = false;
                if (!type) {
                    this.identification = {
                        iconBorder: null,
                        iconColor: null,
                        icon: null,
                        color: null,
                    }
                }

            },
            async newtaskTypesDetail(dataDetail) {
                // 进入详情
                if (dataDetail.rank === 2 || dataDetail === 'default') {
                    this.isSubmit = dataDetail.status === 0 || dataDetail === 'default'? false :true;
                    let obj = {id:dataDetail.id};
                    this.clearInfo();
                    // 获取更新id
                    this.updateId = dataDetail.id;
                    if(dataDetail === 'default'){
                        obj = {
                            id:this.defId
                        }
                    }
                    let {data} = await api.taskCateinfo(obj);
                    if (data.err_code === 0) {
                               this.addInfo(data)
                    } else {
                        this.$Message.error(data.err_message);
                    }
                }
            },
            addInfo(data){
                this.typename.typename = data.tasktype_name;
                this.tstandard = data.standard.filter((item) => {
                    return item.type === 'file'
                });
                this.pstandard = data.standard.filter((item) => {
                    return item.type === 'progress'
                }); // 制作规范

                if (Array.isArray(data.stage) && data) {
                    data.stage.map((item) => {
                        item.show = false;
                        item.flowTIlteShow = false;
                    })
                }
                this.fstandard = data.stage;

                this.identification.icon = data.icon_url;
                this.identification.iconColor = data.color;
            },
            editPriority(type,index,i){
                if (index === 0 || index) {
                    this.fstandard[index].require[i].level = type
                }
                else {
                    this.stepInfoList.level = type
                }
            },
            delFlowNorm(index,i){
//                console.log(131,this.fstandard[index])
                this.fstandard[index].require.splice(i,1);
            },
            flowAddShow(index){
                if(this.fstandard){
                    this.stepInfoList = {text: '',norm: '',level: '优先级'};
                    this.fstandard.map((item)=>{
                        item.show = false
                    });
                    this.fstandard[index].show = !this.fstandard[index].show
                }
           },
            addType(data){
                this.clearInfo();
                this.newData = data ;
                this.updateId = null;
                this.createInfo = false;

            },
             /*清空页面*/
            clearInfo(){
                this.fileShow = false;
                this.fileAddName = '';
                this.fileAddMain = '';
                this.OtherfileShow = false;
                this.OtherfileName = '';
                this.OtherfileMain = '';
                this.fstandard= [];   // 流程规范
                this.pstandard= [];   // 制作规范
                this.tstandard= [];   // 文件规范
                this.typename = {typename:'', icon:'', color:''};
                this.identification = {iconBorder: null, iconColor: null, icon: null, color: null};
            },
            /*添加规范*/
            async addNorms() {
                let {data} = await api.addNorm({name: this.normValue});
                if (data.err_code === 0) {
                    this.modal1 = false;
                    this.normValue = '';
                    this.getNormslist()
                } else {
                    this.$Message.error(data.err_message);
                }
            },
            /*删除规范*/
            async delNorms() {
                let {data} = await api.deleteNorm({id: this.delnormsValue});

                if (data.err_code === 0) {
                    this.modal2 = false;
                    this.normValue = '';
                    this.getNormslist()
                } else {
                    this.$Message.error(data.err_message);
                }

            }
        },
        computed:{
            ...mapState({
                defId(data){
                    return data.typelib.defId
                }
            })
        },
        watch:{
            // 异步defId数据
            defId(data){
                if(data !== null){
                    this.newtaskTypesDetail('default');
                }
            }
        },
        filters:{
            /*优先级*/
            priorityValue(value){
                let data = value;
                switch (value) {
                    case '3':
                        data = '高';
                        break;
                    case '2':
                        data = '中';
                        break;
                    case '1':
                        data = '低';
                        break;
                }
                return data
            }
        }
    };
</script>
<style lang="less">
     @gray: #ccc;
     @yeowll :#ffd66b;
     @org :orange;
     @red :red;
     @red :red;
     @step:#ffcc00;
    .taskClassLibrary {
        .ivu-steps-vertical ,.ivu-steps-item{
            min-height: 102px !important;
        }
        .fileAttr.ivu-row {
            &::after {
                clear: none;
            }
        }

        .fileAttr, .attachingTask {
            margin: 10px 0;
            .delIcon {
                margin-left: 30px;
                padding: 10px;
                font-size: 16px;
                cursor: pointer;
                opacity: 0;
                transition: all .2s;
            }
            &:hover {
                .delIcon {
                    opacity: 1;
                }
            }
        }
        .iconColor {
            border: 1px solid #51c6ff !important;
        }

        .btn {
            width: 221px;
            height: 32px;
            color: #657180;
            background: #fff;
            border: none;
            border-bottom: 1px solid @gray;
            cursor: pointer;
            overflow: hidden;
            &:focus {
                box-shadow: none;

                outline: none;
            }
        }
        .ivu-input {
            border-radius: 0;
            border: none;
            border-bottom: 1px solid @gray;
            &:focus {
                outline: none;
                box-shadow: none;
            }
        }
        .ivu-steps-main {
            overflow: visible !important;
        }
        .taskTypeName {
            position: relative;
            display: flex;
            .taskTypeNameBox {
                position: absolute;
                top: 31px;
                left: 300px;
                width: 221px;
                text-align: center;
                border: 1px solid #ccc;
                background: #fff;
                z-index: 2;
                box-sizing: border-box;
                .identification {
                    padding: 2px 0;
                    flex: 1;
                    font-size: 30px;
                    .signColor {
                        display: block;
                        width: 30px;
                        height: 30px;
                        margin: auto;
                        border: 1px solid #ccc;
                        border-radius: 50%;
                    }
                    &:hover {
                        border: 1px solid #51c6ff;
                    }
                }
                button {
                    width: 49%;
                    &:focus {
                        border: none;
                        box-shadow: none;
                    }
                }
            }
        }
        .stepContainer {
            /*步骤条圈*/
            .ivu-steps.ivu-steps-small,.ivu-steps-head-inner{
                width: 40px !important;
                height: 40px !important;
                line-height: 40px !important;
                font-size: 16px !important;
                background: @step !important;
                border: 1px solid transparent !important;
                span{
                    color: #fff !important;
                }
                .ivu-icon{
                    top: 4px !important;
                    font-size: 30px !important;
                }
            }
            /*步骤条线*/
            .ivu-steps-vertical.ivu-steps-small ,.ivu-steps-tail{
                left: 19px !important;
            }
            /*步骤条title*/
            .title {
                position: absolute;
                top: 40px;
                left: -78px;
                width: 100px;
                height: 23px;
                text-align: center;
                font-size: 14px;
                z-index: 3;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                background: #fff;
                .ivu-input-icon + .ivu-input {
                    height: 21px;
                    padding: 0;
                    font-size: 16px;
                    font-weight: 600;
                    text-align: center;
                    border-radius: 0;
                }
            }
            /*步骤条阶段标记*/
            .acmSign {
                position: absolute;
                top: 63px;
                left: -56px;
                width: 53px;
                height: 18px;
                padding: 0 2px;
                line-height: 18px;
                font-size: 12px;
                background: #00cc00;
                color: #fff;
                border-radius: 6px;
            }
            .stepsUl {
                padding-left: 35px;
                margin-bottom: 10px;
                .stepsList {
                    display: flex;
                    position: relative;
                    padding: 10px 0;
                    font-size: 12px;
                    align-items: center;
                    .delIcon {
                        padding: 10px;
                        margin-left: 10px;
                        font-size: 16px;
                        opacity: 0;
                        cursor: pointer;
                    }
                    .standard {
                        width: 100px;
                        height: 32px;
                        margin: 0 20px;
                        vertical-align: middle;
                        .ivu-select-selection, .ivu-select-selected-value, .ivu-select-placeholder {
                            height: 32px;
                            line-height: 32px;
                        }
                    }
                    .priorityContainer {
                        position: relative;
                        /*top:9px;*/
                        /*right: -52px;*/
                        .priority {
                            width: 42px;
                            height: 42px;
                            margin-bottom: 4px;
                            font-size: 12px;
                            text-align: center;
                            line-height: 42px;
                            background-color: #fff;
                            border-radius: 50%;
                            vertical-align: middle;
                            cursor: pointer;
                        }
                        .priority3{
                            border: 1px solid @red !important;
                            color: @red !important;

                        }
                        .priority2{
                           border: 1px solid @org !important;
                            color: @org !important;
                        }
                        .priority1{
                            border: 1px solid @yeowll !important;
                            color: @yeowll !important;
                        }
                        .priorityList {
                            display: none;
                            position: absolute;
                            top: 46px;
                            left: 0;
                            z-index: 2;
                            background: #fff;
                        }
                        &:hover {
                            .priorityList {
                                display: block;
                            }
                        }
                    }
                    &:hover {
                        .delIcon {
                            opacity: 1;
                            transition: .2s;
                        }
                    }
                }
            }
        }
    }

    .spaceTb {
        padding: 21px 21px;
    }

    .layout-logo {
        width: 100px;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }

    .layout-nav {
        /*width: 500px;*/
        margin: 0 auto;
        margin-right: 20px;
    }

    .stem-logo img {
        max-width: 8rem;
    }

    .stem-l {
        margin-left: 10rem;
    }

    .restdele {
        position: relative;
        color: red;
        top: 10px;
        left: 12px;
        z-index: 999999;
        font-size: 14px;
        cursor: pointer;
    }

    .show {
        display: block;
    }

    .hide {
        display: none;
    }

    .ivu-steps.ivu-steps-small .ivu-steps-content {
        padding: 0 !important;
    }

    /* .hideIconDel {
      display: none;
    } */
</style>
