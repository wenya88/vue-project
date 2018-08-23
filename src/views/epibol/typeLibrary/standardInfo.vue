<style lang="less" scoped>

</style>
<template>
    <Content class="taskClassLibrary"  :style="{padding: '0 0 70px', minHeight: '280px', background: '#fff'}">
        <div class="taskClassLiHeader"><span>规范名称</span><button>保存</button></div>
        <Form class="taskClassLiContener" :model="formLeft" label-position="left" :label-width="100">
            <Row>
                <Col span="16">
                    <span class="titleH2">制作流程规范</span>
                    <!--流程核心-->
                    <div class="stepCentral">
                        <Steps v-if="fstandard"  :current="current" direction="vertical" size="small">
                            <Step v-for="(step,index) in fstandard" class="stepContainer"  :key="index">

                                <div class="stepRight">
                                    <!--步骤名称-->
                                    <div>
                                        <div v-show="!step.flowTIlteShow" @click="step.flowTIlteShow = !step.flowTIlteShow" class="title" style="cursor: pointer">{{step.stage_name}}</div>
                                        <p  class="acmSign" v-if="fstandard.length === index+1" >交稿阶段</p>
                                        <input v-show="step.flowTIlteShow"  @blur="step.flowTIlteShow = !step.flowTIlteShow" v-model="step.stage_name" class="title" type="text"/>
                                    </div>
                                    <!---->
                                    <div>
                                        <ul class="stepsUl">
                                            <li class="stepsList" v-for="(list,i) in step.require" :key="i">
                                                <Input v-model="list.text" placeholder="输入对该阶段要求" :disabled="disabled" class="borderBottomSty"></Input>
                                                <!--规范列表-->



                                                <Taskselect :dataList="norms" :disabled="disabled" v-on:addNormsFun ="addNorms" :callbackStatus="callbackStatus"></Taskselect>




                                                <!--<Select v-model="list.norm" size="small" class="standard" :disabled="disabled">-->
                                                    <!--<Option v-for="item in norms" :label="item.name" :value="item.id" :key="item.id">-->
                                                        <!--{{ item.name }}-->
                                                    <!--</Option>-->
                                                <!--</Select>-->




                                                <div  class="priorityContainer" >
                                                    <p class="priority"  :class="`priority${list.level}`" >{{list.level|priorityValue}}</p>
                                                    <div v-if="!disabled" class="priorityList" >
                                                        <p class="priority priority3" @click="editPriority('3',index,i)">高</p>
                                                        <p class="priority priority2" @click="editPriority('2',index,i)">中</p>
                                                        <p class="priority priority1" @click="editPriority('1',index,i)">低</p>
                                                    </div>
                                                </div>
                                                <Icon v-if="!disabled" type="trash-b" class="delIcon" @click="delFlowNorm(index,i)":disabled="disabled"></Icon>
                                            </li>
                                            <!--审核选项-->
                                            <Select  v-if="project" v-model="step.review" multiple style="position:absolute;top:-20px;right:20px;width:212px;">
                                                <Option v-for="item in reviewList" :value="item.id" :key="item.id">{{ item.label }}</Option>
                                            </Select>
                                        </ul>
                                        <!--流程info增加-->
                                        <div class="stepsUl">
                                            {{step.show}}
                                            <div v-show="step.show" class="stepsList">
                                                <Input v-model="stepInfoList.text" placeholder="请输入对该阶段要求" :disabled="disabled"></Input>
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
                                            <Icon v-show="!step.show" v-if="!disabled" class="addguifan" @click.native="flowAddShow(index)" type="plus"
                                                  style="margin-left:10px;font-size: 12px;cursor: pointer":disabled="disabled"></Icon>
                                        </div>
                                    </div>
                                </div>

                            </Step>
                        </Steps>
                        <div>
                            <Icon @click.native="addSteps" v-if="!disabled" style="font-size:36px;color: #39f;cursor: pointer;padding: 10px;" type="plus-circled":disabled="disabled"></Icon>
                        </div>

                    </div>
                </Col>

                <Col span="8">
                    <div class="contenerRight">
                        <ul>
                            <li>
                                <!--内容规范-->
                                <slot name="item"></slot>
                                <!--任务类型名称-->
                                <span class="titleH2">规范名称</span>
                                <section v-if="!project" class="taskTypeName">
                                    <div v-if="!disabled" v-show="boxShow" class="taskTypeNameBox">
                                        <div v-for="(item,index) in TaskIdentity" :key="index" style="display: flex;flex-wrap: wrap">
                                            <img :src="item.url" @click="secMarkers(item,'icon')" :class="{'iconColor':identification.iconBorder === item.id}" class="identification" width="30" height="36">
                                            <!--<Icon @click.native="secMarkers(item,'icon')" class="identification"-->
                                            <!--:class="{'iconColor':identification.iconBorder === item.icon}" :type="item.icon":disabled="disabled"></Icon>-->
                                            <div @click="secMarkers(item)" class="identification"
                                                 :class="{'iconColor':identification.iconColor === item.color}">
                                                <p class="signColor" :style="{background:item.color}"></p>
                                            </div>
                                        </div>
                                        <Button @click="addMarkers(true)" type="text">确认</Button>
                                        <Button @click="addMarkers(false)" type="text">取消</Button>
                                    </div>
                                    <Input placeholder="名称" v-model="typename.typename" :disabled="disabled"></Input>
                                    <span @click="showMarkers" class="btn">
                                        <img v-if="identification.icon" :src="identification.icon"   :style="{filter: `drop-shadow(${identification.iconColor?identification.iconColor:'black'} 0px -30px)`,width:'30px',color:identification.color}"
                                             style="height:36px;margin-top:30px;">
                                        <template v-else>识别图标</template>
                                    </span>
                                </section>
                            </li>
                            <li>
                                <!--制作规范-->
                                <p class="titleFloat">
                                    <span class="titleH2">制作规范</span>
                                    <Icon v-if="!fileShow&& !disabled" class="addguifan"  @click="fileListAdd" type="plus"></Icon>
                                </p>
                                <template v-if="pstandard.length>0" >
                                    <Row v-for="(item,index) in pstandard" :key="'pstandard'+index" class="fileAttr">
                                        <Col span="12">
                                        <AutoComplete v-model="item.name" placeholder="规范名称" clearable :disabled="disabled">
                                            <!-- <Option v-for="item in reqData" :value="item.config_name" :key="item.conf">{{ item.config_name }}</Option> -->
                                        </AutoComplete>
                                        </Col>
                                        <Col span="12">
                                        <AutoComplete v-model="item.values" placeholder="描述" clearable :disabled="disabled">
                                            <!-- <Option v-for="item in reqData" :value="item.value" :key="item.conf">{{ item.value }}</Option> -->
                                        </AutoComplete>
                                        </Col>
                                        <Icon v-if="!disabled" @click.native="removeFileat(index)" type="trash-b" class="delIcon":disabled="disabled"></Icon>
                                    </Row>
                                </template>
                                <!--文件添加-->
                                <template v-if="fileShow">
                                    <Col span="12">
                                        <AutoComplete v-model="fileAddName" placeholder="规范名称" clearable :disabled="disabled">
                                            <!-- <Option v-for="item in reqData" :value="item.config_name" :key="item.conf">{{ item.config_name }}</Option> -->
                                        </AutoComplete>
                                    </Col>
                                    <Col span="12">
                                        <AutoComplete v-model="fileAddMain" placeholder="描述" clearable :disabled="disabled">
                                            <!-- <Option v-for="item in reqData" :value="item.value" :key="item.conf">{{ item.value }}</Option> -->
                                        </AutoComplete>
                                    </Col>
                                    <Button type="text" @click="addFileat()">确认</Button><Button type="text" @click="closeFileat()">取消</Button>
                                </template>
                            </li>
                            <li>
                                <!--文稿文件规范-->
                                <p class="titleFloat">
                                    <span class="titleH2">文稿文件规范</span>
                                    <Icon v-if="!OtherfileShow&&!disabled" class="addguifan"  @click="OtherfileAdd" type="plus"></Icon>
                                </p>
                                <template v-if="tstandard.length>0">
                                    <div v-for="(item,index) in tstandard" :key="'tstandard'+index" class="attachingTask">
                                        <Col span="12">
                                        <AutoComplete v-model="item.name" placeholder="规范名称" clearable :disabled="disabled"></AutoComplete>
                                        </Col>
                                        <Col span="12">
                                        <AutoComplete v-model="item.values" placeholder="描述" clearable :disabled="disabled"></AutoComplete>
                                        </Col>
                                        <Icon   v-if="!disabled" @click.native="delOtherfile(index)" type="trash-b" class="delIcon":disabled="disabled"></Icon>
                                    </div>
                                </template>

                                <template v-if="OtherfileShow">
                                    <Col span="12">
                                    <AutoComplete v-model="OtherfileName" placeholder="规范名称" clearable :disabled="disabled"></AutoComplete>
                                    </Col>
                                    <Col span="12">
                                    <AutoComplete v-model="OtherfileMain" placeholder="描述" clearable :disabled="disabled"></AutoComplete>
                                    </Col>
                                    <Button type="text" @click="addJunctShow">确认</Button>
                                    <Button type="text" @click="closeOtherfile">取消</Button>
                                </template>
                            </li>
                        </ul>
                    </div>
                </Col>
            </Row>
        </Form>




        <!--规范增加-->
        <h4 :style="{paddingBottom:'10px', marginTop:'20px'}">编辑规范</h4>
        <Button type="primary" @click="modal1 = true">增加规范</Button>
        <Button type="primary" @click="modal2 = true">删除规范</Button>
        <Button v-if="isSubmit||project"  type="primary" style="display: block;margin: 0 auto;width: 200px" @click="submitTaskClas">保存</Button>
        <Modal v-model="modal1" @on-ok="addNorms">
            <section>
                <div style="margin-bottom: 5px">
                    <span>增加标签&emsp;：&emsp;</span>
                    <Input v-model="normValue" placeholder="增加规范标签" style="width: 200px"></Input>
                </div>
            </section>
        </Modal>
        <Modal
                v-model="modal2"

                @on-ok="delNorms"
        >
            <div>删除</div>
            <Select v-model="delnormsValue" size="small" class="standard">
                <Option v-for="item in norms" :label="item.name" :value="item.id" :key="item.id">
                    {{ item.name }}
                </Option>
            </Select>
        </Modal>
    </Content>

</template>
<script>

    import {mapState} from 'vuex';
    import qs from 'querystring';
    import api from 'api';
    import Icon from "iview/src/components/icon/icon";
    import Caspanel from "iview/src/components/cascader/caspanel";
    import typeList from "./typeList";
    import Taskselect from "./Taskselect";

    export default {
        components: {
            typeList,
            Caspanel,
            Icon,
            Taskselect
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
                disabled:true, // 禁用
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

                //添加新标签完成后的回调状态
                callbackStatus:false
            };
        },
        mounted() {
            this.projectdisabled()
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
                this.disabled = false;
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
            projectdisabled(){
                if(this.project){
                    this.disabled = false;
                }
            },

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
                    this.$emit('update')
                    this.$bus.emit('treeUpdate') // 刷新左侧树状图
                } else {
                    this.$Message.error(res.data.err_message);
                }
            },
            /*公司级提交*/
            async submitCompany(){
                let url = 'task/task-type/add';
                let obj = null;
                /*更新*/
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
                     /*新增*/
                     obj = {
                         category_id:this.goinfo.parent_id,
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
                this.tstandard.push({name : this.OtherfileName, values: this.OtherfileMain,type:'hand'});
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
                    this.isSubmit = dataDetail.status === 0 || !(dataDetail === 'default');
                    this.disabled = dataDetail.status === 0 || dataDetail === 'default';
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
            async addNorms(val) {
                this.callbackStatus = false;
                let {data} = await api.addNorm({name: val});
                if (data.err_code === 0) {
                    this.callbackStatus = true;
                    this.$Message.success('添加成功！');
                    this.modal1 = false;
                    this.normValue = '';
                    this.getNormslist();

                } else {
                    this.callbackStatus = false;
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
                    case '0':
                        data = '优先级';
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
     @r_green:#3bceb6;
     @r_textcolor:#bebebe;
     @r_green:#3bceb6;
     @r_textcolor:#bebebe;
     /*UI改版样式开始*/
     .taskClassLibrary{
         .taskClassLiHeader{
             display: flex;justify-content: space-between;align-items: center;background: #c4f0e9;padding: 15px 40px;
             span{font-size: 14px;color: @r_green};
             button{background: @r_green;color: #fff;border: 0;font-size: 13px;padding: 8px 30px;border-radius: 3px}
         };
         .taskClassLiContener{
             padding: 30px 40px;
             .titleH2{font-weight: lighter;color: @r_textcolor;font-size: 15px}
             .stepCentral{
                 margin-top: 30px;padding-right: 30px;
             }
             .stepContainer{
                 .ivu-steps-main{
                     width: 100%!important;
                     .stepRight{
                         margin-left: 65px !important;margin-top: 10px;
                         .title{left: -20px !important;z-index: 0!important;}
                     }
                 }
             }
             .addguifan{width: 20px;height: 20px;border: 1px solid orange;text-align: center;line-height: 18px;border-radius: 100%;color: orange}
             .contenerRight{
                 padding-left: 30px;border-left: 1px dashed #e1e1e1;
                 ul li{
                     margin-bottom: 30px;
                     .titleFloat{display: flex;justify-content: space-between};
                     .ivu-input{border-bottom: 1px solid #e2e3e4;}
                 }

             }
         }
     }
     /*UI改版样式结束*/


     .stepContainer{
         .ivu-steps-main{width: 100%!important;}

     }
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
            height: 40px;
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
            line-height: 32px;
            text-align: center;
            color: #657180;
            background: #fff;
            border: none;
            border-bottom: 1px solid #e2e3e4;
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
            /*<!--border-bottom: 1px solid @r_green;-->*/
            &:focus {
                outline: none;
                box-shadow: none;
            }
        }
        .borderBottomSty{border-bottom: 1px solid #e2e3e4;}
        .ivu-steps-main {
            overflow: visible !important;
        }
        .taskTypeName {
            position: relative;
            display: flex;
            .taskTypeNameBox {
                position: absolute;
                top: 31px;
                right: -35px;
                /*left: 300px;*/
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
                line-height: 30px !important;
                font-size: 16px !important;
                background: @r_green !important;
                border: 5px solid #c5f0ea !important;
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
                top: 30px;
                left: -78px;
                width: 80px;
                height: 23px;
                text-align: center;
                font-size: 14px;
                z-index: 3;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                background: #fff;
                z-index: 0;
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
                left: -5px;
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
                /*padding-left: 35px;*/
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
                        opacity: 1;
                        cursor: pointer;
                    }
                    .standard {
                        width: 100px;
                        height: 32px;
                        margin: 0 20px;
                        vertical-align: middle;
                        .ivu-select-selection{border: 1px solid @r_green;text-align: center;color: @r_green}
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
                            width: 36px;
                            height: 36px;
                            /*margin-bottom: 4px;*/
                            font-size: 12px;
                            text-align: center;
                            line-height: 36px;
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
                            top: 36px;
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
        /*padding: 21px 21px;*/
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
