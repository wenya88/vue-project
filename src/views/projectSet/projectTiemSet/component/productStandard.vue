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
                <div class="addTypeBox">
                    <div class="addButton">
                        <Dropdown trigger="click" style="padding: 9px 14px 9px 14px;border-radius: 4px">
                        <span class="typeMenu">
                            <Icon type="ios-plus-outline" size="18"></Icon>
                            <span style="vertical-align: top">添加规范</span>
                        </span>
                            <DropdownMenu style="padding: 10px;height: 800px;overflow-y: auto;min-width: 630px;" slot="list">
                                <div class="header">

                                    <div v-for="(item,index) in specification" :key="index"

                                         :class="[menuColor === index?'fonsW':'','titleWdith']"

                                         @click="selecSpecification(item.children,index)">
                                        {{item.name}}({{item.children.length}})

                                    </div>
                                </div>
                                <dl v-for="(item,index) in StandardizeSec" :key="index">
                                    <dt>{{item.name}}</dt>
                                    <!--:class="index === btnSign[0] && i === btnSign[1]?'sign':''"-->
                                    <ul class="typeList">
                                        <li class="typeBox" @click="greenSign(index,i,children)"
                                            v-for="(children,i) in item.children">
                                            <div class="type" :title="children.tasktype_name" :class="children.border?'sign':''">
                                                <!--<div class="type" :class="menuColor === index && listColor === i?'sign':''" >-->
                                                <!--<img v-if="children.icon_url" width="16" height="16" :src="children.icon_url"-->
                                                <!--alt=""-->
                                                <!--:style="{filter: `drop-shadow(${children.color?children.color:'black'} 0px -20px)`}">-->
                                                <span>{{children.tasktype_name}}</span>

                                                <Icon class="icon" v-if="children.border"
                                                      type="checkmark-circled"></Icon>
                                            </div>
                                        </li>
                                    </ul>
                                </dl>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </section>
        <!--规范表单-->
        <standard-info v-if="typeTabs.length>0" ref="tree" :project="true"
                       :attrContent="attrContent" :ruleList="ruleList">
            <div slot="item">

                <ul>
                    <li>
                        <p class="titleFloat">
                            <span class="titleH2">内容规范</span>
                            <Icon v-if="!attrContentW.show && !disabled" class="addguifan" type="plus"
                                  @click.native="attrContentW.show=!attrContentW.show"></Icon>
                        </p>
                        <Row v-for="(item,index) in attrContent" :key="'attrContent'+index" class="fileAttr">
                            <Col span="12">
                            <AutoComplete v-model="item.name" placeholder="规范名称" clearable :disabled="disabled">
                                <!-- <Option v-for="item in reqData" :value="item.config_name" :key="item.conf">{{ item.config_name }}</Option> -->
                            </AutoComplete>
                            </Col>
                            <Col span="12">
                            <AutoComplete v-model="item.values" placeholder="规范描述" clearable style="margin-left:20px"
                                          :disabled="disabled">
                                <!-- <Option v-for="item in reqData" :value="item.value" :key="item.conf">{{ item.value }}</Option> -->
                            </AutoComplete>
                            </Col>
                            <Icon @click.native="removeAttrContent(index)" type="trash-b" class="delIcon"></Icon>
                        </Row>
                        <template v-if="attrContentW.show" :style='{margin:"10px 0"}'>
                            <Col span="12">
                            <AutoComplete v-model="attrContentW.name" placeholder="规范名称" clearable>
                                <!-- <Option v-for="item in reqData" :value="item.config_name" :key="item.conf">{{ item.config_name }}</Option> -->
                            </AutoComplete>
                            </Col>
                            <Col span="12">
                            <AutoComplete v-model="attrContentW.values" placeholder="规范描述" clearable
                                          style="margin-left:20px">
                                <!-- <Option v-for="item in reqData" :value="item.value" :key="item.conf">{{ item.value }}</Option> -->
                            </AutoComplete>
                            </Col>
                            <Button type="text" @click="addAttrContent()">确认</Button>
                            <Button type="text" @click="closeattrContent()">取消</Button>
                        </template>
                    </li>
                    <li>
                        <p class="titleFloat">
                            <span class="titleH2">规格规范</span>
                            <Icon v-if="!ruleListW.show && !disabled" class="addguifan"
                                  @click="ruleListW.show=!ruleListW.show" type="plus"></Icon>
                        </p>
                        <Row v-for="(item,index) in ruleList" :key="'ruleList'+index" class="fileAttr">
                            <Col span="12">
                            <AutoComplete v-model="item.name" placeholder="规范名称" clearable :disabled="disabled">
                                <!-- <Option v-for="item in reqData" :value="item.config_name" :key="item.conf">{{ item.config_name }}</Option> -->
                            </AutoComplete>
                            </Col>
                            <Col span="12">
                            <AutoComplete v-model="item.values" placeholder="规范描述" clearable style="margin-left:20px"
                                          :disabled="disabled">
                                <!-- <Option v-for="item in re  qData" :value="item.value" :key="item.conf">{{ item.value }}</Option> -->
                            </AutoComplete>
                            </Col>
                            <Icon @click.native="removeRuleList(index)" type="trash-b" class="delIcon"></Icon>
                        </Row>
                        <template v-if="ruleListW.show" :style='{margin:"10px 0"}'>
                            <Col span="12">
                            <AutoComplete v-model="ruleListW.name" placeholder="规范名称" clearable>
                                <!-- <Option v-for="item in reqData" :value="item.config_name" :key="item.conf">{{ item.config_name }}</Option> -->
                            </AutoComplete>
                            </Col>
                            <Col span="12">
                            <AutoComplete v-model="ruleListW.values" placeholder="规范描述" clearable
                                          style="margin-left:20px">
                                <!-- <Option v-for="item in reqData" :value="item.value" :key="item.conf">{{ item.value }}</Option> -->
                            </AutoComplete>
                            </Col>
                            <Button type="text" @click="addruleList()">确认</Button>
                            <Button type="text" @click="closeruleList()">取消</Button>
                        </template>

                    </li>
                </ul>
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
            this.infoinit();

        },
        data() {
            return {
                listColor: null,
                disabled: false,
                menuColor: 0,
                tabsTypeId: null,
                project_id: sessionStorage.getItem('projectID'),
                btnSign: [],
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
            async infoinit() {
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
                            if (res.data.data) {
                                res.data.data.map((item) => {
                                    this.typeList.push(item.children)
                                })
                            }
                            this.menuColor = 0;
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
                            this.typeTabs.map((tab, i) => {
                                if (item.id == tab.tasktype_id) {
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
                }, 500)

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
            async projectTasktype(item, index) {
                let obj = null;
                this.clearData();
                if (this.$refs.tree) {
                    this.$refs.tree.clearInfo();
                }
                if (item !== 'init') {
                    obj = {id: item.id};
                    this.tabsColor = index;
                } else if (item === 'init' && this.typeTabs.length > 0) {
                    obj = {id: this.typeTabs[0].id};
                } else {
                    return false
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
            selecSpecification(data, index) {
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
                this.ruleList.push({name: this.ruleListW.name, values: this.ruleListW.values, type: 'hand'});
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
                let addSwitch = false
                this.typeTabs.map((item) => {
                    if (item.tasktype_id == children.id) {
                        addSwitch = true
                    }
                });

                if (addSwitch) {
                    return false
                }

//                this.listColor.push(i);
//                this.btnSign.push(index) ;
                this.$axios.post(this.GLOBAL.baseRouter + 'task/project-tasktype/add', qs.stringify({
                    project_id: this.project_id,
                    tasktype_id: children.id
                }))
                    .then(({data}) => {
                        if (data.err_code === 0) {
                            this.projectTasktype({id: data.id}, this.typeTabs.length);
                            this.listInit();
//                            this.menuInit();
                            this.refreshListSign(index,i);
                        } else {
                            this.$Message.error(data.err_message);
                        }
                    });

            },
            // 刷新列表
            refreshListSign(index, i) {

                this.specification.map((items, itemsIndex) => {
                    if (this.menuColor === itemsIndex) {
                        items.children.map((item, itemIndex) => {
                            if (index === itemIndex) {

                                item.children.map((child, childIndex) => {

                                    if (i === childIndex) {
                                        this.$set(child, 'border', true)
                                    }
                                });
                            }
                        })
                    }
                });


            },
            // 情况数据
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
    @green: #3bceb6;
    @btn: #b8f1c6;
    @bor: #009900;
    @gray: #eef1f2;
    .projectSpeContainer {
        .tabHead {
            display: flex;
            padding-bottom: 30px;
            background: @gray;

            .typeTabsContainer {
                display: flex;

                padding: 21px 0 0 0;
                background: @gray;
                border-bottom: 1px solid @green;

                .typeTab {
                    position: relative;
                    padding: 10px 22px;
                    font-size: 16px;
                    color: #777777;
                    cursor: pointer;

                    &:hover {
                        .closeSign {
                            opacity: 1;
                        }
                    }
                    .closeSign {
                        display: block;
                        position: absolute;
                        top: 3px;
                        right: 3px;
                        width: 16px;
                        height: 16px;
                        text-align: center;
                        line-height: 16px;
                        font-size: 12px;
                        color: #fff;
                        background: #f0816b;
                        border-radius: 50%;
                        opacity: 0;
                    }
                }
                .tabGreen {
                    color: #fff;
                    background: @green;
                    border-radius: 6px 6px 0 0;
                }
            }
            .addType {
                position: relative;
                flex: 1;
                min-height: 66px;
                background: @gray;
                border-bottom: 1px solid @green;
                .addTypeBox {
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: 44px 80px;
                    background: #eef1f2;

                }
                .addButton {
                    position: absolute;
                    top: 26px;
                    right: 30px;
                    /*padding: 10px 14px;*/
                    text-align: center;

                    .ivu-dropdown, .ivu-select-dropdown {
                        top: 50px !important;
                        right: 0;

                        left: auto !important;
                        overflow-y: auto;
                        border: 1px solid @green;

                    }
                    &:before{
                        /*display: block;*/
                        /*content: ' ';*/
                        /*position: absolute;*/
                        /*top:30px;*/
                        /*left: 24px;*/
                        /*width: 0;*/
                        /*height: 0;*/
                        /*border-top: 14px solid transparent;*/
                        /*border-right: 14px solid transparent;*/
                        /*border-left: 14px solid transparent;*/
                        /*border-bottom: 14px solid #fff;*/
                        /*z-index: 901;*/


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
                    /*justify-content: flex-end;*/
                    .fonsW {

                        color: @green;
                    }
                    .titleWdith {
                        min-width: 160px;
                        text-align: center;
                    }
                    p {
                        min-width: 100px;
                        margin: 0 6px;
                        text-align: center;
                        color: #777;
                        word-break: keep-all;
                        white-space: nowrap;
                        cursor: pointer;
                    }
                }
                dt {

                    height: 30px;
                    padding-left: 20px;
                    line-height: 30px;
                    font-size: 14px;
                    color: #777;
                }
                .typeList {
                    display: flex;
                    padding-left: 20px;
                    margin: 14px 0 25px 0;
                    font-size: 14px;
                    flex-wrap: wrap;
                    cursor: pointer;
                    .typeBox {
                        position: relative;
                        padding: 0 20px;
                        margin-left: 15px;
                    }
                    .type {
                        display: flex;
                        min-width: 90px;
                        max-width: 90px;
                        height: 30px;
                        padding: 0 4px 0 7px;
                        text-align: center;
                        line-height: 30px;
                        color: #bdbdbd;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                        img {
                            margin: 29px 4px 0 0;
                        }
                        .icon {
                            position: absolute;
                            top: 0;
                            right: 0;
                            padding-left: 5px;
                            color: #3bceb6;
                            line-height: 30px;
                        }

                    }
                    .sign {
                        color: @green;
                        background: #c4f0e9;
                        border: 1px solid @green;
                        border-radius: 4px;
                        img {
                            margin: 27px 4px 0 0;
                        }
                    }
                }

            }
        }
    }
</style>
