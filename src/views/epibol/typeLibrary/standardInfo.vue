<template>
    <Content class="taskClassLibrary" :style="{padding: '0 0 70px', minHeight: '280px', background: '#fff'}">

        <Form class="spaceTb" :model="formLeft" label-position="left" :label-width="100">
            <!--内容规范-->
            <slot name="item"></slot>
            <!--任务类型名称-->
            <h4 :style="{paddingBottom:'10px'}">规范名称</h4>
            <section class="taskTypeName">
                <div v-show="boxShow" class="taskTypeNameBox">
                    <div v-for="(item,index) in TaskIdentity" :key="index" style="display: flex;flex-wrap: wrap">
                        <Icon @click.native="secMarkers(item,'icon')" class="identification"
                              :class="{'iconColor':identification.iconBorder === item.icon}" :type="item.icon"></Icon>
                        <div @click="secMarkers(item)" class="identification"
                             :class="{'iconColor':identification.iconColor === item.color}">
                            <p class="signColor" :style="{background:item.color}"></p>
                        </div>
                    </div>
                    <Button @click="addMarkers()" type="text">确认</Button>
                    <Button @click="boxShow = false" type="text">取消</Button>
                </div>
                  <Input   :style="{width:'300px',paddingBottom:'20px'}" placeholder="新建任务类型" v-model="typename.typename"></Input>
                  <button @click="showMarkers" class="btn">
                      <Icon v-if="identification.icon" :type="identification.icon" :style="{color:identification.color}"
                            style="font-size:30px;"></Icon>
                      <template v-else>任务标识</template>
                  </button>
            </section>
            <h4 :style="{paddingBottom:'10px'}">制作规范</h4>
          <template v-if="pstandard.length>0" >
              <Row v-for="(item,index) in pstandard" :key="'pstandard'+index" class="fileAttr">
                  <Col span="5">
                  <AutoComplete v-model="item.key" placeholder="额外属性名称" clearable>
                      <!-- <Option v-for="item in reqData" :value="item.config_name" :key="item.conf">{{ item.config_name }}</Option> -->
                  </AutoComplete>
                  </Col>
                  <Col span="10">
                  <AutoComplete v-model="item.value" placeholder="额外属性说明" clearable style="margin-left:20px">
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
            <Modal
                    v-model="modal1"
                    title="增加标签"

            >
                <section>
                    <div style="margin-bottom: 5px">
                        <span>规范标签&emsp;：&emsp;</span><Input v-model="value" placeholder="增加规范标签"
                                                             style="width: 200px"></Input>
                    </div>
                    <div style="margin-bottom: 5px">
                        <span>优先级标签：&emsp;</span><Input v-model="value" placeholder="增加优先级标签"
                                                        style="width: 200px"></Input>
                    </div>
                </section>
            </Modal>
            <!--流程核心-->
            <div style="display: flex;padding: 10px 0 0 40px;">
                <div style="flex: 12" v-on:mouseenter="dataDetails($event)" v-on:mouseleave="hiddenDetail($event)">
                    <Steps v-if="fstandard" :style="{width:'800px'}" :current="current" direction="vertical" size="small">
                        <Step v-for="(step,index) in fstandard" class="stepContainer"  :key="index">
                            <!--<Input v-model="step.stage_name" class="title" type="text" :title="step.stage_name"></Input>-->
                            <div v-show="!step.flowTIlteShow" @click="step.flowTIlteShow = !step.flowTIlteShow" class="title" style="cursor: pointer">{{step.name}}</div>
                            <input v-show="step.flowTIlteShow"  @blur="step.flowTIlteShow = !step.flowTIlteShow" v-model="step.name" class="title" type="text"/>
                            <ul class="stepsUl">
                                <li class="stepsList" v-for="(list,i) in step.childrens" :key="i">
                                    <Input v-model="list.value" placeholder="Enter something..."
                                           style="width: 400px"></Input>
                                    <Select v-model="list.normId" size="small" class="standard">
                                        <Option v-for="item in norms" :label="item.name" :value="item.id" :key="item.id">
                                            {{ item.name }}
                                        </Option>
                                    </Select>
                                    <div class="priorityContainer">
                                        <p class="priority"  :class="`priority${list.priority}`" >{{list.priority|priorityValue}}</p>
                                        <div class="priorityList" >
                                            <p class="priority priority1" @click="editPriority('1',index,i)">高</p>
                                            <p class="priority priority2" @click="editPriority('2',index,i)">中</p>
                                            <p class="priority priority3" @click="editPriority('3',index,i)">低</p>
                                        </div>
                                    </div>
                                    <Icon type="trash-b" class="delIcon" @click="delFlowNorm(index,i)"></Icon>
                                </li>
                            </ul>
                            <!--流程info增加-->
                            <div class="stepsUl">
                                {{step.show}}
                                <div v-show="step.show" class="stepsList">
                                    <Input v-model="stepInfoList.text" placeholder="请输入对该阶段要求"
                                           style="width: 400px"></Input>
                                    <Select v-model="stepInfoList.type" class="standard" size="small">
                                        <Option v-for="item in norms" :value="item.id" :key="item.id">
                                            {{ item.name }}
                                        </Option>
                                    </Select>
                                    <div class="priorityContainer">
                                        <p class="priority" style="border: 1px solid #ccc;" :class="`priority${stepInfoList.priority}`" >{{stepInfoList.priority|priorityValue}}</p>
                                        <div class="priorityList">
                                            <p class="priority priority1" @click="editPriority('1')">高</p>
                                            <p class="priority priority2" @click="editPriority('2')">中</p>
                                            <p class="priority priority3" @click="editPriority('3')">低</p>
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
                <div style="flex: 12" @click="addSteps">
                    <Icon style="font-size:36px;color: #39f;cursor: pointer" type="plus-circled"></Icon>
                </div>

            </div>

            <h3 :style="{padding:'20px 0 0px'}">文稿文件规范</h3>
            <template v-if="tstandard.length>0">
                <div v-for="(item,index) in tstandard" :key="'tstandard'+index" class="attachingTask" :style='{margin:"20px 0"}'>
                    <Col span="5">
                    <AutoComplete v-model="item.key" placeholder="输入格式，如“max”" clearable></AutoComplete>
                    </Col>
                    <Col span="10">
                    <AutoComplete v-model="item.value" placeholder="附加文件描述..." clearable
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
        <Button type="primary" style="float: right;width: 200px" @click="taskClassubmit">提交</Button>
        </Col>
    </Content>

</template>
<script>
    import qs from 'querystring'


    import Icon from "iview/src/components/icon/icon";
    import Caspanel from "iview/src/components/cascader/caspanel";
    import typeList from "./typeList";

    export default {
        components: {
            typeList,
            Caspanel,
            Icon
        },
        data() {
            return {
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
                identification: {
                    iconBorder: null,
                    iconColor: null,
                    icon: null,
                    color: null,
                },
                TaskIdentity: [
                    {color: '#33cc6b', icon: 'android-notifications-none'},
                    {color: '#ccabb6', icon: 'ios-game-controller-b-outline'},
                    {color: '#cc62bd', icon: 'ios-star-outline'},
                    {color: '#aacc46', icon: 'ios-stopwatch-outline'},
                    {color: '#53ccc3', icon: 'ios-bolt-outline'},

                ],
                stepInfoList: {
                    text: '',
                    type: '',
                    priority: '优先级',
                },
                fileShow: false,
                fileAddName: '',
                fileAddMain: '',
                OtherfileShow: false,
                OtherfileName: '',
                OtherfileMain: '',
                boxShow: false,
                value: '测试',
                model2: '1',

                // 以上是后面测试添加
                current: 0,
                reqeData: {},
                reqarn: {},
                isInit: Boolean,
                /*--------------------文件类型阶段属性开始------------------------*/
                formLeft: {},
                fileType: "",
                stepCount: [
                    {show: false},
                    {show: false},
                    {show: false},
                    {show: false},
                    {show: false},
                ],
                accesData: [],
                reqData: [],
                attrFile: [{config_name: "", value: ""}],
                otherfile: [{config_name: '', value: ''}],
                /*----------------------文件类型阶段属性结束-----------------------*/
                category_id: 0,
                index: 1,
                acces: [
                    {
                        title: "文件格式",
                        key: "file_format"
                    },
                    {
                        title: "描述",
                        key: "describe"
                    },
                    {
                        title: "操作",
                        width: 150,
                        align: "center",
                        render: (h, params) => {
                            return h("div", [
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "error",
                                            size: "small"
                                        },
                                        on: {
                                            click: () => {
                                                this.remove(params.index);
                                            }
                                        }
                                    },
                                    "移除"
                                )
                            ]);
                        }
                    }
                ]
            };
        },
        mounted() {
            this.newtaskGetNorms();
            this.$bus.on('typesDetail', (data) => {
                this.newtaskTypesDetail(data);
            });
        },
        methods: {
            //hover阶段，删除图标
            dataDetails: function (e) {
                let el = event.currentTarget.children[0].children[0];
                if(el){
                    el.style.display = "inline-block";
                }
            },
            hiddenDetail: function (e) {
                let el = event.currentTarget.children[0].children[0];
                if(el){
                    el.style.display = "";
                }
            },
            //提交任务类别库表单
            taskClassubmit: function () {
                let csbObj = {};
                //类型属性

                csbObj.id = this.clsId;
                csbObj.category_id = this.category_id ? this.category_id : 0;
                csbObj.name = this.listN;
                csbObj.stage = JSON.stringify(this.stepCount);
                //文件属性
                // let main_file = {};
                // main_file.file_name = csb.fileType;
                // main_file.file_format = csb.fileType;
                let files = [];
                // files.push(main_file);
                //任务主文件
                let _attrFile = {
                    file_name: "",
                    file_format: this.fileType,
                    is_main: 1,
                    require: []
                };
                for (let i = 0; i < this.attrFile.length; i++) {
                    let r = {
                        config_id: 0,
                        config_name: this.attrFile[i].config_name,
                        value: this.attrFile[i].value
                    }
                    _attrFile.require.push(r);
                }
                files.push(_attrFile);
                //任务附加文件
                console.log(this.otherfile.length);
                for (let i = 0; i < this.otherfile.length; i++) {
                    let _otherfile = {
                        file_name: "",
                        file_format: this.otherfile[i].file_format,
                        is_main: 0,
                        require: [
                            {
                                config_id: 0,
                                config_name: "",
                                value: this.otherfile[i].value
                            }
                        ]
                    };
                    files.push(_otherfile);
                }
                csbObj.file = JSON.stringify(files);
                let address = "";
                //判断类型是否为ture执行接口
                if (this.isInit) {
                    address = "task/task-type/add";
                } else {
                    address = "task/task-type/update";
                }

                console.log(csbObj);

                this.$axios
                    .post(this.GLOBAL.baseRouter + address, qs.stringify(csbObj))
                    .then(res => {
                        if (res.data.err_code === 0) {
                            this.$Message.success("编辑类型成功！");
                            //this.initPage();
                            this.taskClassforEach();
                            this.refreshPage();
                        } else {
                            this.$Message.error(res.data.err_message);
                        }
                    })
                    .catch(error => {
                        this.$Message.error("加载失败，请重试！");
                    });
            },
            //增加任务附加文件
            addJunctShow(data) {
                this.tstandard.push({key: this.OtherfileName, value: this.OtherfileMain});
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
                    aSp.current += 1;
                    this.fstandard.push({
                        name:'新建阶段',
                        childrens:[{value:'',priority:'1'}],
                        show:false
                    });
                }
            },
            /**
             * 文件属性模块操作
             */
            //增加文件属性
            addFileat() {
                this.pstandard.push({key: this.fileAddName, value: this.fileAddMain});
                this.fileShow = false
                this.fileAddName = '';
                this.fileAddMain = '';
            },
            //移除文件属性
            removeFileat(index) {
                this.pstandard.splice(index, 1);
            },
            //移除沟通确认阶段
            delStep(event, st) {
                if (this.stepCount.length <= 1) {
                    this.stepCount = [
                        {
                            id: 1,
                            stage_name: "默认阶段",
                            is_inside_audit: false,
                            tasktype_id: this.category_id
                        }
                    ];
                    this.$Message.warning("默认阶段，不可刪除");
                } else {
                    const index = this.stepCount.indexOf(st);
                    this.stepCount.splice(index, 1);
                }
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
            //遍历任务类别详情数据
            taskClassforEach() {
                this.clernPage();
                this.get(
                    typeInfo,
                    {
                        id: this.clsId
                    },
                    res => {
                        this.formLeft = res.data;
                        this.listN = res.data.tasktype_name;
                        //任务附加文件列表
                        this.accesData = res.data.file;
                        this.otherfile = [];
                        if (this.accesData != null) {
                            this.accesData.forEach(reqr => {
                                this.forSubmit = reqr.is_main;
                                if (reqr.is_main == 1) {
                                    this.reqData = reqr.require;
                                    this.fileType = reqr.file_format;
                                    this.reqData.forEach((reqFor) => {
                                        this.attrFile.push({
                                            config_name: reqFor.config_name,
                                            value: reqFor.value
                                        });
                                    });
                                } else if (reqr.is_main == 0) {
                                    reqr.value = reqr.require[0].value;
                                    this.otherfile.push(reqr);
                                }
                            });
                        }
                        //沟通确认阶段
                        if (this.formLeft.stage != null) {
                            this.formLeft.stage.forEach(sta => {
                                sta.is_inside_audit = sta.is_inside_audit == 1 ? true : false;
                                this.stepCount.push(sta);
                            });
                        }
                    }
                );
            },
            //从左边列表组件中获取id,name
            getListId(clicktype) {
                console.log(1, clicktype)
                this.isInit = clicktype.isInit;
                this.category_id = clicktype.category_id;
                this.listN = clicktype.liName;
                this.clsId = clicktype.id;

                if (clicktype.isInit) {
                    //新增文件類型-頁面
                    this.initPage();
                } else {
                    this.taskClassforEach();
                }
            },
            //初始化頁面數據
            initPage() {
                this.clernPage();
                this.stepCount.push({
                    id: 1,
                    stage_name: "默认阶段",
                    is_inside_audit: false,
                    tasktype_id: this.category_id
                });
                //清空
                this.otherfile = [];
                this.attrFile = [{config_name: "", value: ""}];
            },
            clernPage() {
                this.stepCount = [];
                this.formLeft = {};
                this.listN = "";
                this.fileType = "";
                this.accesData = [];
                this.reqData = [];
                this.reqfData = [];
                this.otherfile = [];
                this.attrFile = [];
            },
            //刷新当前页面
            refreshPage() {
                this.$Spin.show(
                    {
                        render: h => {
                            return h("div", [
                                h("Icon", {
                                    class: "demo-spin-icon-load",
                                    props: {
                                        type: "load-c",
                                        size: 18
                                    }
                                }),
                                h("div", "Loading")
                            ]);
                        }
                    },
                    location.reload()
                );
                setTimeout(() => {
                    this.$Spin.hide();
                }, 3000);
            },
            //或者select文件格式选择后id
            getSelectId(r) {
                let requ = this.formLeft.file[r]; //文件类型数据
                if (requ) {
                    this.reqeData = requ;
                }
            },
//      ][
            // 确认 取消按钮
            fileListAdd() {
                this.fileShow = !this.fileShow
            },
            closeFileat() {
                this.fileShow = false
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
                this.fstandard[index].childrens.push({normId:this.stepInfoList.type,value:this.stepInfoList.text,priority:this.stepInfoList.priority});
                this.$set(this.fstandard[index],'show',false);
                this.stepInfoList = {
                    text: '',
                    type: '',
                    priority: '优先级'
                };
            },
            closeStepList(index) {
                this.$set(this.fstandard[index], 'show', false);
                this.stepInfoList = {
                    text: '',
                    type: '',
                    priority: '1'
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
                if (type === 'icon') {
                    this.identification.iconBorder = item.icon;
                } else {
                    this.identification.iconColor = item.color;
                }
            },
            addMarkers() {
                this.boxShow = false;
                this.identification.icon = this.identification.iconBorder;
                this.identification.color = this.identification.iconColor;
            },
            newtaskGetNorms() {
                // 获取规范
                this.$axios.post(this.GLOBAL.baseRouter+'newtask/new-task-type/get-norms', qs.stringify())
                    .then(({data})=>{
                    if(data.err_code === 0){
                        this.norms = data.data;

                    }else{
                        this.$Message.error(data.err_message);
                    }
                    })
            },
            newtaskTypesDetail({id,rank}){
              if(rank === 2){
                     this.fileShow = false;
                     this.fileAddName = '';
                     this.fileAddMain = '';
                     this.OtherfileShow = false;
                     this.OtherfileName = '';
                     this.OtherfileMain = '';
                  this.$axios.post(this.GLOBAL.baseRouter+'newtask/new-task-type/get-types-detail', qs.stringify({tid:id}))
                      .then(({data})=>{
                          if(data.err_code === 0){
                              this.typename = data.data.name;
                              this.tstandard = data.data.tstandard;
                              this.pstandard = data.data.pstandard;
                              if(Array.isArray(data.data.fstandard) && data.data){
                                  data.data.fstandard.map((item)=>{
                                      item.show = false;
                                      item.flowTIlteShow = false;
                                  })
                              }
                              this.fstandard = data.data.fstandard;

                          }else{
                              this.$Message.error(data.err_message);
                          }
                      })
              }

            },
            editPriority(type,index,i){
                if(index === 0 || index){
                  this.fstandard[index].childrens[i].priority = type
              }
              else{
                  this.stepInfoList.priority = type
              }

            },
            delFlowNorm(index,i){
                this.fstandard[index].childrens.splice(i,1);
            },
            flowAddShow(index){
                if(this.fstandard){
                    this.stepInfoList = {text: '',type: '',priority: '优先级'};
                    this.fstandard.map((item)=>{
                        item.show = false
                    });
                    this.fstandard[index].show = !this.fstandard[index].show
                }
           }
        },
        filters:{
            priorityValue(value){
                let data = value;
                switch (value) {
                    case '1':
                        data = '高';
                        break;
                    case '2':
                        data = '中';
                        break;
                    case '3':
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
    .taskClassLibrary {

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
            .title {
                position: absolute;
                top: 20px;
                left: -69px;
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
            .stepsUl {
                padding-left: 35px;
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
                           border: 1px solid @yeowll !important;
                            color: @yeowll !important;
                        }
                        .priority2{
                           border: 1px solid @org !important;
                            color: @org !important;
                        }
                        .priority1{
                           border: 1px solid @red !important;
                            color: @red !important;
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
