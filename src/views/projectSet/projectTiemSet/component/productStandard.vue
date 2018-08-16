<template>
    <div class="projectSpeContainer">
        <!--tab头部-->
        <section class="tabHead">
            <ul class="typeTabsContainer">
                <li class="typeTab" v-for="(item,index) in typeTabs" @click.stop="projectTasktype(item,index)"
                    :class="{'tabGreen':index === tabsColor}" :key="index">{{item.tasktype_name}}
                    <i @click.stop="closeType(item)" class="closeSign">X</i>
                </li>
            </ul>
            <div class="addType">
                <div class="addButton">
                    <Dropdown trigger="click" style="margin-left: 20px">
                        <span class="typeMenu">
                            <Icon type="plus-round"></Icon>
                            <span>添加规范</span>
                        </span>
                        <DropdownMenu style="padding: 10px;" slot="list">
                            <div class="header">
                                <p v-for="(item,index) in specification" :key="index"
                                   :class="menuColor === index?'fonsW':''"
                                   @click="selecSpecification(item.children,index)">
                                    {{item.name}}({{item.children.length}})</p>
                            </div>
                            <dl v-for="(item,i) in StandardizeSec" :key="i">
                                <dt>{{item.name}}</dt>
                                <!--:class="index === btnSign[0] && i === btnSign[1]?'sign':''"-->
                                <ul class="typeList">
                                    <li class="type" :class="children.border?'sign':''"
                                        @click="greenSign(index,i,children)" v-for="(children,index) in item.children">
                                        <img v-if="children.icon_url" width="16" height="16" :src="children.icon_url"
                                             alt=""
                                             :style="{filter: `drop-shadow(${children.color?children.color:'black'} 0px -20px)`}">
                                        <span>{{children.tasktype_name}}</span>
                                        <Icon v-if="children.border" type="checkmark-circled"
                                              style="padding-left: 5px;color: #00d900;line-height: 30px;"></Icon>
                                    </li>
                                </ul>
                            </dl>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
        </section>
        <!--规范表单-->
        <standard-info v-if="typeTabs.length>0" v-on:update="infoUpdate" ref="tree" :project="true" :attrContent="attrContent" :ruleList="ruleList">
            <div slot="item">
                <h4 :style="{paddingBottom:'10px', marginTop:'20px'}">内容规范</h4>
                <Row v-for="(item,index) in attrContent" :key="'attrContent'+index" class="fileAttr">
                    <Col span="5">
                    <AutoComplete v-model="item.name" placeholder="额外属性名称" clearable :disabled="disabled">
                        <!-- <Option v-for="item in reqData" :value="item.config_name" :key="item.conf">{{ item.config_name }}</Option> -->
                    </AutoComplete>
                    </Col>
                    <Col span="10">
                    <AutoComplete v-model="item.values" placeholder="额外属性说明" clearable style="margin-left:20px" :disabled="disabled">
                        <!-- <Option v-for="item in reqData" :value="item.value" :key="item.conf">{{ item.value }}</Option> -->
                    </AutoComplete>
                    </Col>
                    <Icon @click.native="removeAttrContent(index)" type="trash-b" class="delIcon"></Icon>
                </Row>
                <template v-if="attrContentW.show" :style='{margin:"10px 0"}'>
                    <Col span="5">
                    <AutoComplete v-model="attrContentW.name" placeholder="额外属性名称" clearable>
                        <!-- <Option v-for="item in reqData" :value="item.config_name" :key="item.conf">{{ item.config_name }}</Option> -->
                    </AutoComplete>
                    </Col>
                    <Col span="10">
                    <AutoComplete v-model="attrContentW.values" placeholder="额外属性说明" clearable style="margin-left:20px">
                        <!-- <Option v-for="item in reqData" :value="item.value" :key="item.conf">{{ item.value }}</Option> -->
                    </AutoComplete>
                    </Col>
                    <Button type="text" @click="addAttrContent()">确认</Button>
                    <Button type="text" @click="closeattrContent()">取消</Button>
                </template>

                <Button v-if="!attrContentW.show && !disabled" icon="plus-round" type="text" long
                        style="width:140px;color: #31bb9f"
                        @click.native="attrContentW.show=!attrContentW.show"
                      >
                    增加内容规范
                </Button>

                <h4 :style="{paddingBottom:'10px', marginTop:'20px'}">规格规范</h4>
                <Row v-for="(item,index) in ruleList" :key="'ruleList'+index" class="fileAttr">
                    <Col span="5">
                    <AutoComplete v-model="item.name" placeholder="额外属性名称" clearable :disabled="disabled">
                        <!-- <Option v-for="item in reqData" :value="item.config_name" :key="item.conf">{{ item.config_name }}</Option> -->
                    </AutoComplete>
                    </Col>
                    <Col span="10">
                    <AutoComplete v-model="item.values" placeholder="额外属性说明" clearable style="margin-left:20px" :disabled="disabled">
                        <!-- <Option v-for="item in reqData" :value="item.value" :key="item.conf">{{ item.value }}</Option> -->
                    </AutoComplete>
                    </Col>
                    <Icon @click.native="removeRuleList(index)" type="trash-b" class="delIcon"></Icon>
                </Row>
                <template v-if="ruleListW.show" :style='{margin:"10px 0"}'>
                    <Col span="5">
                    <AutoComplete v-model="ruleListW.name" placeholder="额外属性名称" clearable>
                        <!-- <Option v-for="item in reqData" :value="item.config_name" :key="item.conf">{{ item.config_name }}</Option> -->
                    </AutoComplete>
                    </Col>
                    <Col span="10">
                    <AutoComplete v-model="ruleListW.values" placeholder="额外属性说明" clearable style="margin-left:20px">
                        <!-- <Option v-for="item in reqData" :value="item.value" :key="item.conf">{{ item.value }}</Option> -->
                    </AutoComplete>
                    </Col>
                    <Button type="text" @click="addruleList()">确认</Button>
                    <Button type="text" @click="closeruleList()">取消</Button>
                </template>

                <Button  v-if="!ruleListW.show && !disabled" icon="plus-round" type="text" long
                        @click="ruleListW.show=!ruleListW.show" style="width:140px;color: #31bb9f">
                    增加制作规范
                </Button>
            </div>
        </standard-info>
        <div v-else style="text-align: center;height: 100%;margin-top: 120px;font-size: 20px">请从右上角添加规范哦</div>
    </div>
</template>

<script>
    import qs from 'querystring'
    import api from 'api'
    import standardInfo from '@/views/epibol/typeLibrary/standardInfo.vue'

    export default {
        created() {
        },
        mounted() {
            this.menuInit();
            this.infoinit()
        },
        data() {
            return {
                disabled:false,
                menuColor:0,
                infoUpdate:null,
                tabsTypeId: null,
                project_id: sessionStorage.getItem('projectID'),
                btnSign: [0, 0],
                specification: [],
                StandardizeSec: [],
                typeList: [],
                typeMenu: false,
                tabsColor: 0,
                typeTabs: [],
                attrContentW: {
                    show: false,
                    name: '',
                    main: '',
                },
                ruleListW: {
                    show: false,
                    name: '',
                    main: '',
                },
                attrContent: [{name: "", values: "", type: 'connect'}],
                ruleList: [{name: "", values: "", type: 'hand'}],
            }
        },
        methods: {
            async infoinit(){
                await this.listInit();
                await this.projectTasktype('init')
            },
            /*右侧菜单*/
            menuInit() {
                this.$axios.post(this.GLOBAL.baseRouter + 'task/task-type/cate-list')
                    .then(res => {
                        if (res.data.err_code === 0) {
                            this.forTreeData(res.data.data);
                            this.specification = res.data.data;
                            if( res.data.data){
                                res.data.data.map( (item) => {
                                    this.typeList .push(item.children)
                                })
                            }
                            this.StandardizeSec = res.data.data[0].children
                        } else {
                            this.$Message.error(res.data.err_message);
                        }
                    })
            },

            /*递归遍历*/
            forTreeData(tree) {
                setTimeout(() => {
                    let arrData = (data) => {
                        data.map((item) => {
                            item.btnShow = false;
                            this.typeTabs.map((tab,i) => {
                                if(item.id == tab.tasktype_id){
                                    item.border = true;
                                }
                            });
                            if (item.tasktype && item.tasktype.length > 0) {
                                item.children = item.tasktype;
                            }

                            if (item.children) {
                                arrData(item.children)
                            }
                        });

                        return data
                    };
                    return arrData(tree)
                },500)

            },
            /*查询列表*/
           async listInit() {
                /*接口要修改*/
                const {data} = await api.projectTaskList({project_id: this.project_id});
                        if (data.err_code === 0) {
                            this.typeTabs = data.data
                        } else {
                            this.$Message.error(data.err_message);
                        }
            },
            /*查询详情*/
            async projectTasktype(item,index) {
                this.infoUpdate = {item:item,index:index};
                let obj = null;
                this.clearData();
                this.$refs.tree.clearInfo();
                if(item !== 'init'){
                     obj = {id: item.id};
                    this.tabsColor = index;
                }else if(item === 'init' && this.typeTabs.length>0) {
                     obj = {id: this.typeTabs[0].id};
                }

                let {data} = await api.projectTaskInfo(obj);
                        if (data.err_code === 0) {
                            this.tabsTypeId = data.data.id;
                            this.attrContent = data.data.standard.filter((item) => {
                                return item.type === 'connect'
                            });
                            this.ruleList = data.data.standard.filter((item) => {
                                return item.type === 'hand'
                            });
                            this.$bus.emit('projectInfo', data.data);
                        } else {
                            this.$Message.error(data.err_message);
                        }
            },

            /*删除*/
            closeType(item) {
                this.$axios.post(this.GLOBAL.baseRouter + 'task/project-tasktype/delete', qs.stringify({id: item.id}))
                    .then(({data}) => {
                        if (data.err_code === 0) {
                            this.listInit();
                            this.menuInit();
                        } else {
                            this.$Message.error(data.err_message);
                        }
                    });
            },
            selecSpecification(data,index) {
                this.StandardizeSec = data;
                this.menuColor = index
            },
            addAttrContent() {
                this.attrContent.push({
                    name: this.attrContentW.name,
                    values: this.attrContentW.values,
                    type: 'connect'
                });
                this.attrContentW = {
                    show: false,
                    name: '',
                    main: '',
                }
            },
            closeattrContent() {
                this.attrContentW = {
                    show: false,
                    name: '',
                    main: '',
                }
            },
            addruleList() {
                this.ruleList.push({name: this.ruleListW.name, values: this.ruleListW.values, type: 'file'});
                this.ruleListW = {
                    show: false,
                    name: '',
                    main: '',
                }
            },
            closeruleList() {
                this.ruleListW = {
                    show: false,
                    name: '',
                    main: '',
                }
            },
            removeAttrContent(index) {
                this.attrContent.splice(index, 1);
            },
            removeRuleList(index) {
                this.ruleList.splice(index, 1);
            }
            ,
            /*内容规范的增删修改*/
            addContentat() {
            },
            closeContentat() {
            },
            contentListAdd() {

            },
            removeContentat() {
            },
            /*tab的切换*/
            tabsHandle(index) {

            },
            handleOpen() {
                this.visible = true;
            },
            handleClose() {
                this.visible = false;
            },
            /*添加*/
            greenSign(index, i, children) {
                this.btnSign = [index, i];
                this.$axios.post(this.GLOBAL.baseRouter + 'task/project-tasktype/add', qs.stringify({
                    project_id: this.project_id,
                    tasktype_id: children.id
                }))
                    .then(({data}) => {
                        if (data.err_code === 0) {
                            this.listInit()
                            this.menuInit()
                        } else {
                            this.$Message.error(data.err_message);
                        }
                    });

            },
            clearData() {
                this.ruleList = [{name: "", values: "", type: 'hand'}];
                this.attrContent = [{name: "", values: "", type: 'connect'}];
            },
        },
        computed: {},
        components: {
            standardInfo
        }
    }
</script>

<style lang="less">
    @green: #31bb9f;
    @btn: #b8f1c6;
    @bor: #009900;
    .projectSpeContainer {
        .tabHead {
            display: flex;

            .typeTabsContainer {
                display: flex;
                padding: 21px 0 0 21px;
                background: #fff;
                .typeTab {
                    position: relative;
                    padding: 10px;
                    font-size: 16px;
                    border-bottom: 1px solid @green;
                    cursor: pointer;

                    &:hover {
                        .closeSign {
                            opacity: 1;
                        }
                    }
                    .closeSign {
                        display: block;
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 16px;
                        height: 16px;
                        text-align: center;
                        line-height: 16px;
                        font-size: 12px;
                        color: #fff;
                        background: red;
                        border-radius: 50%;
                        opacity: 0;
                    }
                }
                .tabGreen {
                    border: 1px solid @green !important;
                    border-bottom: none !important;
                }
            }
            .addType {
                position: relative;
                flex: 1;
                min-height: 80px;
                border-bottom: 1px solid @green;
                background: #fff;
                .addButton {
                    position: absolute;
                    top: 18px;
                    right: 30px;
                    .ivu-dropdown, .ivu-select-dropdown {
                        top: 50px !important;
                    }
                }
                .typeMenu {
                    color: @green;
                    cursor: pointer;
                }
                .header {
                    display: flex;
                    margin-bottom: 25px;
                    font-size: 16px;
                    color: #6b6b6b;
                    .fonsW{
                      font-weight: bold;
                        color: black;
                    }
                    p {
                        min-width: 100px;
                        text-align: center;
                        word-break: keep-all;
                        white-space: nowrap;
                        margin: 0 6px;
                        cursor: pointer;
                    }
                }
                dt {
                    height: 30px;
                    padding-left: 20px;
                    line-height: 30px;
                    font-size: 14px;
                    color: black;
                    font-weight: 600;
                }
                .typeList {
                    display: flex;
                    padding-left: 20px;
                    margin: 14px 0 25px 0;
                    font-size: 14px;
                    cursor: pointer;
                    .type {
                        display: flex;
                        min-width: 120px;
                        height: 30px;
                        padding: 0 4px 0 16px;
                        margin-left: 15px;
                        text-align: center;
                        line-height: 30px;
                        color: #6b6b6b;
                        overflow: hidden;
                        img {
                            margin: 29px 4px 0 0;
                        }

                    }
                    .sign {
                        background: @btn;
                        border: 1px solid @bor;
                        border-radius: 8px;
                        img {
                            margin: 27px 4px 0 0;
                        }
                    }
                }

            }
        }
    }
</style>
