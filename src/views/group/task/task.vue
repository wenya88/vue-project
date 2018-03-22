<style>
    /*.btton-right {*/
    /*float: right;*/
    /*}*/

    .ivu-table .demo-table-info-cell-state span {
        background-color: #19be6b;
        color: #fff;
        padding: 4px;
    }

    .ivu-table .demo-table-info-cell-stateT span {
        background-color: #ff9900;
        color: #fff;
        padding: 4px;

    }

    .area_model {
        height: 500px;
        border: 1px solid #d7dde4;
        margin: 0 0 0 20px;
    }

    .ivu-tabs-bar {
        border-bottom: none !important;
    }

    .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
        border-bottom: 1px solid #d7dde4 !important;
        border-radius: 4px 4px 4px 4px !important;
        /*background: #00a050 !important;*/
        /*color: #FFFFFF !important;*/
    }

    .ivu-modal-header {
        border-bottom: 0 !important;
    }

    /*上传图片*/
    .demo-upload-list {
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
    }

    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }

    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }

    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }

    .car-bg {
        background: #00a854;
        color: #fff;
        text-align: center;
    }

    .dropBig .ivu-select-dropdown {
        width: 300px !important;
        left: 0 !important;
        top: -10px !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    .scrollBorder .ivu-card-bordered {
        border: 0;
        padding: 0;
        margin: 0 !important;
    }

    .scrollBorder .ivu-card-body {
        padding: 0;
    }

    .meberli li {
        border-bottom: 1px solid #cccccc;
        cursor: pointer;
        text-align: center;
    }

    .memberList {
        border-right: #cccccc solid 1px;
        padding-right: 0 !important;
    }

    .active {
        background: #39f;
        color: #FFFFFF;
    }

    .subtaskArea {
        max-width: 760px;
    }
    .icon-header{
        float: right;
        margin-right: 30px;
    }
</style>
<template>
    <div class="layout">
        <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
            <Modal :styles="{top: '30px'}" v-model="handleRender" width="1300" >
                <div slot="header">
                    <div class="icon-header">
                    <Row :gutter="40">
                        <Col span="4"> <Icon type="ios-star-outline" size="29"></Icon></Col>
                        <Col span="4"><Icon type="ios-trash-outline" size="29"></Icon></Col>
                    </Row>
                    </div>
                </div>
                <Tabs type="card">
                    <TabPane label="基本管理">
                        <div>
                            <Row>
                                <Col span="17" push="7">
                                <div class="area_model" align="center">
                                    模型
                                </div>
                                </Col>
                                <Col span="7" pull="17">
                                <Form :model="formLeft" label-position="left" :label-width="80">
                                    <FormItem label="任务名称">
                                        <Input v-model="formLeft.name"></Input>
                                        <!--@on-blur="blurTj()"-->
                                    </FormItem>
                                    <FormItem label="任务时间">
                                        <DatePicker :value="formLeft.create_time"
                                                    format="yyyy年MM月dd日" type="date"
                                                    placeholder="选择时间" style="width: 100%"></DatePicker>
                                        <!--@on-blur="blurTj()"-->
                                    </FormItem>
                                    <FormItem label="子项目">
                                        <Select v-model="model1">
                                            <Option v-for="item in cityList" :value="item.value"
                                                    :key="item.value"></Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem label="参与人">
                                        <Tag v-for="item in fruit" :key="item" :name="item" closable
                                             @on-close="handleClose2" type="border">{{item}}
                                        </Tag>
                                        <Dropdown trigger="click" class="dropBig">
                                            <a href="javascript:void(0)">
                                                <Button icon="ios-plus-empty" type="dashed" size="small">
                                                    添加
                                                </Button>
                                            </a>
                                            <DropdownMenu slot="list">
                                                <Input v-model="value1" placeholder="参与人姓名/名字首字母" clearable
                                                       style="width: 100%"></Input>
                                                <Row :gutter="16">
                                                    <Col span="10" class="demo-tabs-style2 memberList">
                                                    <ul class="meberli">
                                                        <li
                                                                v-for="(item,index) in tabs"
                                                                :class="{active:index == num}"
                                                                @click="memberList(index)">{{item}}
                                                        </li>
                                                    </ul>
                                                    </Col>
                                                    <Col span="12" align="center" class="scrollBorder">
                                                    <Scroll :on-reach-bottom="handleReachBottom">
                                                        <div class="tabCon">
                                                            <div
                                                                    v-for='(itemCon,index) in tabContents'
                                                                    v-show="index == num">
                                                                <Card dis-hover>

                                                                    <CheckboxGroup v-model="fruit">
                                                                        <Checkbox :label="i"
                                                                                  v-for='(i,d) in itemCon'></Checkbox>
                                                                    </CheckboxGroup>

                                                                </Card>
                                                            </div>
                                                        </div>
                                                    </Scroll>
                                                    </Col>
                                                </Row>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </FormItem>
                                    <FormItem label="任务类型">
                                        <Select v-model="model2">
                                            <Option v-for="item in cityList1" :value="item.value"
                                                    :key="item.value"></Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem label="文件要求">
                                        <div>
                                            <Card :bordered="true" style="text-align: center">
                                                <Row>
                                                    <Col :xs="{ span: 5, offset: 1 }" :lg="{ span: 6, offset: 2 }"
                                                         class="car-bg">
                                                    模型</Col>
                                                    <Col :xs="{ span: 11, offset: 1 }" :lg="{ span: 6, offset: 2 }">
                                                    PSD</Col>
                                                    <Col :xs="{ span: 5, offset: 1 }" :lg="{ span: 6, offset: 2 }">
                                                    贴图</Col>
                                                </Row>
                                                <Tag>大小：8000*200</Tag>
                                                <Tag>分辨率：72PDI</Tag>
                                                <Tag>坐标：默认归零</Tag>
                                                <Tag>贴面：2000</Tag>
                                            </Card>
                                        </div>
                                    </FormItem>
                                    <h2 style="color: #39f;margin-bottom: 20px">
                                        <Icon type="grid"></Icon>
                                        任务要求
                                    </h2>
                                    <FormItem label="参考图片">
                                        <div class="demo-upload-list" v-for="item in uploadList">
                                            <template v-if="item.status === 'finished'">
                                                <img :src="item.url">
                                                <div class="demo-upload-list-cover">
                                                    <!--<Icon type="ios-eye-outline"-->
                                                    <!--@click.native="handleView(item.name)"></Icon>-->
                                                    <Icon type="ios-trash-outline"
                                                          @click.native="handleRemove(item)"></Icon>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <Progress v-if="item.showProgress" :percent="item.percentage"
                                                          hide-info></Progress>
                                            </template>
                                        </div>
                                        <Upload
                                                ref="upload"
                                                :show-upload-list="false"
                                                :default-file-list="defaultList"
                                                :on-success="handleSuccess"
                                                :format="['jpg','jpeg','png']"
                                                :max-size="2048"
                                                :on-format-error="handleFormatError"
                                                :on-exceeded-size="handleMaxSize"
                                                :before-upload="handleBeforeUpload"
                                                multiple
                                                type="drag"
                                                action="//jsonplaceholder.typicode.com/posts/"
                                                style="display: inline-block;width:80px;">
                                            <div style="width: 80px;height:58px;line-height: 28px;">
                                                <Icon type="camera" size="20"></Icon>
                                                <p>可拖拽上传</p>
                                            </div>
                                        </Upload>
                                    </FormItem>
                                    <FormItem label="参考附件">
                                        <Upload
                                                :format="['jpg','jpeg','png']"
                                                multiple
                                                action="//jsonplaceholder.typicode.com/posts/">
                                            <Button type="ghost" icon="ios-cloud-upload-outline">上传
                                            </Button>
                                        </Upload>
                                    </FormItem>
                                    <FormItem label="要求说明">
                                        <Input v-model="formLeft.head" type="textarea"
                                               :autosize="{minRows: 2,maxRows: 5}" placeholder="补充说明"></Input>
                                        <!--@on-blur="blurTj()"-->
                                    </FormItem>
                                </Form>
                                </Col>
                            </Row>
                        </div>
                    </TabPane>
                    <TabPane label="子任务">
                        <Row>
                            <Col span="15">
                            <div class="subtaskArea">
                                <Progress :percent="45" status="active" style="margin-bottom: 30px"></Progress>
                                <Button type="primary" size="small" style="margin-bottom: 10px">增加子任务</Button>
                                <Table border :columns="subtaskCum" :data="subtaskData"></Table>
                            </div>
                            </Col>
                            <Col span="9">
                            <div>
                                <Form :model="formLeft" label-position="left" :label-width="80">
                                    <FormItem label="任务名称">
                                        <Input v-model="formLeft.name"></Input>
                                        <!--@on-blur="blurTj()"-->
                                    </FormItem>
                                    <FormItem label="任务时间">
                                        <DatePicker :value="formLeft.create_time"
                                                    format="yyyy年MM月dd日" type="date"
                                                    placeholder="选择时间" style="width: 100%"></DatePicker>
                                        <!--@on-blur="blurTj()"-->
                                    </FormItem>
                                    <FormItem label="子项目">
                                        <Select v-model="model1">
                                            <Option v-for="item in cityList" :value="item.value"
                                                    :key="item.value"></Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem label="参与人">
                                        <Tag v-for="item in fruit" :key="item" :name="item" closable
                                             @on-close="handleClose2" type="border">{{item}}
                                        </Tag>
                                        <Dropdown trigger="click" class="dropBig">
                                            <a href="javascript:void(0)">
                                                <Button icon="ios-plus-empty" type="dashed" size="small">
                                                    添加
                                                </Button>
                                            </a>
                                            <DropdownMenu slot="list">
                                                <Input v-model="value1" placeholder="参与人姓名/名字首字母" clearable
                                                       style="width: 100%"></Input>
                                                <Row :gutter="16">
                                                    <Col span="10" class="demo-tabs-style2 memberList">
                                                    <ul class="meberli">
                                                        <li
                                                                v-for="(item,index) in tabs"
                                                                :class="{active:index == num}"
                                                                @click="memberList(index)">{{item}}
                                                        </li>
                                                    </ul>
                                                    </Col>
                                                    <Col span="12" align="center" class="scrollBorder">
                                                    <Scroll :on-reach-bottom="handleReachBottom">
                                                        <div class="tabCon">
                                                            <div
                                                                    v-for='(itemCon,index) in tabContents'
                                                                    v-show="index == num">
                                                                <Card dis-hover>

                                                                    <CheckboxGroup v-model="fruit">
                                                                        <Checkbox :label="i"
                                                                                  v-for='(i,d) in itemCon'></Checkbox>
                                                                    </CheckboxGroup>

                                                                </Card>
                                                            </div>
                                                        </div>
                                                    </Scroll>
                                                    </Col>
                                                </Row>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </FormItem>
                                    <FormItem label="任务类型">
                                        <Select v-model="model2">
                                            <Option v-for="item in cityList1" :value="item.value"
                                                    :key="item.value"></Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem label="文件要求">
                                        <div>
                                            <Card :bordered="true" style="text-align: center">
                                                <Row>
                                                    <Col :xs="{ span: 5, offset: 1 }" :lg="{ span: 6, offset: 2 }"
                                                         class="car-bg">
                                                    模型</Col>
                                                    <Col :xs="{ span: 11, offset: 1 }" :lg="{ span: 6, offset: 2 }">
                                                    PSD</Col>
                                                    <Col :xs="{ span: 5, offset: 1 }" :lg="{ span: 6, offset: 2 }">
                                                    贴图</Col>
                                                </Row>
                                                <Tag>大小：8000*200</Tag>
                                                <Tag>分辨率：72PDI</Tag>
                                                <Tag>坐标：默认归零</Tag>
                                                <Tag>贴面：2000</Tag>
                                            </Card>
                                        </div>
                                    </FormItem>
                                    <h2 style="color: #39f;margin-bottom: 20px">
                                        <Icon type="grid"></Icon>
                                        任务要求
                                    </h2>
                                    <FormItem label="参考图片">
                                        <div class="demo-upload-list" v-for="item in uploadList">
                                            <template v-if="item.status === 'finished'">
                                                <img :src="item.url">
                                                <div class="demo-upload-list-cover">
                                                    <!--<Icon type="ios-eye-outline"-->
                                                    <!--@click.native="handleView(item.name)"></Icon>-->
                                                    <Icon type="ios-trash-outline"
                                                          @click.native="handleRemove(item)"></Icon>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <Progress v-if="item.showProgress" :percent="item.percentage"
                                                          hide-info></Progress>
                                            </template>
                                        </div>
                                        <Upload
                                                ref="upload"
                                                :show-upload-list="false"
                                                :default-file-list="defaultList"
                                                :on-success="handleSuccess"
                                                :format="['jpg','jpeg','png']"
                                                :max-size="2048"
                                                :on-format-error="handleFormatError"
                                                :on-exceeded-size="handleMaxSize"
                                                :before-upload="handleBeforeUpload"
                                                multiple
                                                type="drag"
                                                action="//jsonplaceholder.typicode.com/posts/"
                                                style="display: inline-block;width:80px;">
                                            <div style="width: 80px;height:58px;line-height: 28px;">
                                                <Icon type="camera" size="20"></Icon>
                                                <p>可拖拽上传</p>
                                            </div>
                                        </Upload>
                                    </FormItem>
                                    <FormItem label="参考附件">
                                        <Upload
                                                :format="['jpg','jpeg','png']"
                                                multiple
                                                action="//jsonplaceholder.typicode.com/posts/">
                                            <Button type="ghost" icon="ios-cloud-upload-outline">上传
                                            </Button>
                                        </Upload>
                                    </FormItem>
                                    <FormItem label="要求说明">
                                        <Input v-model="formLeft.head" type="textarea"
                                               :autosize="{minRows: 2,maxRows: 5}" placeholder="补充说明"></Input>
                                        <!--@on-blur="blurTj()"-->
                                    </FormItem>
                                </Form>
                            </div>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane label="日志">
                        <Timeline>
                            <TimelineItem>2018-2-28:16:14:13<span>李小小</span><span>创建任务</span><span>任务名称</span><span
                                    style="color: #ed3f14">无</span> 美国队长3D模型
                            </TimelineItem>
                            <TimelineItem>2018-2-28:16:14:13<span>李小小</span><span>创建任务</span></TimelineItem>
                            <TimelineItem>2018-2-28:16:14:13<span>李小小</span><span>创建任务</span></TimelineItem>
                        </Timeline>
                    </TabPane>
                </Tabs>
                <div slot="footer">
                    <!--<Button type="error" size="large">ssd</Button>-->
                </div>
            </Modal>
            <Table :columns="columns8" :data="dataList" size="small" ref="table"></Table>
        </Content>
    </div>
</template>
<script>
    import sub from './sub.vue';
    import Icon from "iview/src/components/icon/icon";
    import UploadList from "iview/src/components/upload/upload-list";
    import {gettasklist} from "../../../config/env.js";
    import Caspanel from "iview/src/components/cascader/caspanel";

    export default {
        components: {
            Caspanel,
            UploadList,
            Icon,
            'v-sub': sub
        },
        data() {
            return {
                subtaskCum: [
                    {
                        title: '子任务名称',
                        key: 'subtaskName',
                        align: 'center',
                    },
                    {
                        title: '进度',
                        key: 'schedule',
                        align: 'center',
                    },
                    {
                        title: '操作',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                subtaskData: [
                    {
                        subtaskName: '暂无名称',
                        schedule: '暂无进度',
                    },
                ],
                tabs: ["全部成员(33)", "3D模型(11)", "地编组(11)", "次世代(11)"],
                tabContents: [['李霄霄', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅', '王二帅'], ['赵三娃', '陈无敌'], ['哈哈', '嘻嘻洗洗'], ['哇娃娃', '呜呜呜呜',]],
                num: 1,
                value1: '',
                fruit: [],
                editInlineData: [],
                editInlineColumns: [],
                //上传图片
                defaultList: [
                    {
                        'name': 'a42bdcc1178e62b4694c830f028db5c0',
                        'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
                    },
                    {
                        'name': 'bc7521e033abdd1e92222d733590f104',
                        'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
                    }
                ],
                imgName: '',
                visible: false,
                uploadList: [],
                //下拉裂变
                cityList: [
                    {
                        value: '原画组',
                    },
                    {
                        value: '地编组',
                    },
                    {
                        value: '原画组',
                    },
                ],
                model1: '',
                cityList1: [
                    {
                        value: '原画组',
                    },
                ],
                model2: '',
                formLeft: {
                    name: '',
                },
                //弹出层
                handleRender: false,
                columns8: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(sub, {
                                props: {
                                    row: params.row,
                                },
                            })
                        }
                    },
                    {
                        title: "任务名称",
                        key: "name",
                        align: 'center',
                    },
                    {
                        title: "状态",
                        key: "status",
                        align: 'center',
                        width: 90,
                        sortable: true,
                    },
                    {
                        title: "类型",
                        key: "type",
                        align: 'center',
                    },
                    {
                        title: "参与/负责人",
                        align: 'center',
                        render: function (h, params) {
                            console.log(params.row.name)
                            return h('div', [
                                h('Avatar', {
                                    props: {
                                        shape: 'circle',
                                        size: 'small',
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    attrs: {
                                        src: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
                                    },
                                }),
                                h('span', {}, params.row.head),
                            ])
                        },
                    },
                    {
                        title: "任务文件",
                        align: 'center',
                    },
                    {
                        title: "进度阶段",
                        align: 'center',
                        width: '300px',
                        render: function (h) {
                            return h('Steps', [
                                h('Step', {
                                    props: {
                                        direction: 'vertical',
                                        size: 'small'
                                    },
                                }),
                                h('Step', {
                                    props: {
                                        size: 'small',
                                        direction: 'vertical',
                                    },
                                }),
                                h('Step', {
                                    props: {
                                        size: 'small',
                                        direction: 'vertical',
                                    },
                                }),
                                h('Step', {
                                    props: {
                                        size: 'small',
                                        direction: 'vertical',
                                    },
                                }),
                                h('Step', {
                                    props: {
                                        size: 'small',
                                        direction: 'vertical',
                                    },
                                })
                            ]);
                        }
                    },
                    {
                        title: "进度比例",
                        align: 'center',
                    },
                    {
                        title: "已进行",
                        align: 'center',
                    },
                    {
                        title: "最近更新",
                        align: 'center',
                    },
                    {
                        title: "到期日",
                        key: "create_time",
                        align: 'center',
                        width: '100px',
                    },
                    {
                        title: "操作",
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            let cIs = this;
                                            cIs.handleRender = true;
                                            cIs.show(params.index)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            let cIs = this;
                                            cIs.remove(params.index);
                                        }
                                    }
                                }, '删除')
                            ]);
                        },
                    },
                ],
                dataList: [
                    {
                        status: "实施中",
                        name: "架构处理",
                        timeremaining: "19%",
                        principal: "大大",
                        type: "原画",
                        cellClassName: {
                            status: 'demo-table-info-cell-stateT'
                        },
                    },
                ]
            }
        },
        mounted() {
            let cIs = this;
            console.log(cIs)
            this.get(gettasklist,
                {},
                (res) => {
                    cIs.dataList = res.data.params.list;
                }
            );
            this.uploadList = this.$refs.upload.fileList;
        },
        methods: {
            //滚动条
            handleReachBottom() {
                return new Promise(resolve => {
                    setTimeout(() => {
                        const last = this.list1[this.list1.length - 1];
                        for (let i = 1; i < 11; i++) {
                            this.list1.push(last + i);
                        }
                        resolve();
                    }, 2000);
                });
            },
            memberList(index) {
                this.num = index;
            },
            handleOpen() {
                this.visible = true;
            },
            handleClose() {
                this.visible = false;
            },
            getData() {
                this.editInlineColumns = tableData.editInlineColumns;
                this.editInlineData = tableData.editInlineData;
            },
            exportData(type) {
                if (type === 1) {
                    this.$refs.table.exportCsv({
                        filename: 'The original data'
                    });
                } else if (type === 2) {
                    this.$refs.table.exportCsv({
                        filename: 'Sorting and filtering data',
                        original: false
                    });
                } else if (type === 3) {
                    this.$refs.table.exportCsv({
                        filename: 'Custom data',
                        columns: this.columns8.filter((col, sub) => sub < 4),
                        data: this.dataList.filter((data, sub) => sub < 4)
                    });
                }
            },
            // handleAdd() {
            //     if (this.count.length) {
            //         this.count.push(this.count[this.count.length - 1] + 1);
            //     } else {
            //         this.count.push(0);
            //     }
            // },
            handleClose2(event, name) {
                const index = this.fruit.indexOf(name);
                this.fruit.splice(index, 1);
            },
            //上传图片
            // handleView(name) {
            //     this.imgName = name;
            //     this.visible = true;
            // },
            handleRemove(file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess(res, file) {
                file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
                file.name = '7eb99afb9d5f317c912f08b5212fd69a';
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: 'The file format is incorrect',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                });
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc: 'File  ' + file.name + ' is too large, no more than 2M.'
                });
            },
            handleBeforeUpload() {
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: 'Up to five pictures can be uploaded.'
                    });
                }
                return check;
            },
            /**
             * get请求
             */
            get(url, params, call) {
                /*获取列表信息*/
                this.$http.get(url, {params: params}).then(function (res) {
                    call(res);
                }, function (error) {
                    console.log("error");
                });
            },
            //model 数据
            show(index) {
                this.formLeft = this.dataList[index];
            },
            //失去焦点，发送数据
            // blurTj() {
            //     console.log(this.formLeft);
            //     this.get(updatetasklist,
            //         this.formLeft,
            //         (callSave) => {
            //             console.log(callSave)
            //         }
            //     );
            // },
            //删除数据
            // remove(index) {
            //     this.get(deletetasklist,
            //         this.formLeft,
            //         (callSave) => {
            //             console.log(callSave)
            //         }
            //     );
            //     this.dataList.splice(index, 1);
            // }
        }
    }

</script>

