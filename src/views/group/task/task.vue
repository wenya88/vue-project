<style>
    @import "../../../../src/styles/task/task.css";
</style>
<template>
    <div class="layout">
        <Layout>
            <Layout>
                <Layout>
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                        <Modal :styles="{top: '30px'}" v-model="handleRender" width="1300" @on-cancel="cancelisM">
                            <div class="icon-header">
                                <Row :gutter="40">
                                    <Col span="4">
                                    <Icon type="ios-star-outline" size="23"></Icon>
                                    </Col>
                                    <Col span="4">
                                    <Icon type="ios-trash-outline" size="23"></Icon>
                                    </Col>
                                </Row>
                            </div>
                            <div slot="header">
                            </div>
                            <Tabs type="card" @on-click="clickFun">
                                <TabPane label="基本管理">
                                    <bea-n v-if="contShow === 0" :datl="formLeft"></bea-n>
                                </TabPane>
                                <TabPane label="子任务">
                                    <sub-task v-if="contShow === 1" :datl="formLeft"></sub-task>
                                </TabPane>
                                <TabPane label="日志">
                                    <jou-rnal v-if="contShow === 2" :datl="formLeft"></jou-rnal>
                                </TabPane>
                            </Tabs>
                            <div slot="footer">
                                <!--<Button type="error" size="large"></Button>-->
                            </div>
                        </Modal>
                        <Modal :styles="{top: '30px'}" v-model="excelModal" width="1300">
                            <div slot="header"></div>
                            <div><h2 style="color: #2b85e4;">批量导入任务</h2></div>
                            <div style="height: 500px">
                                <div style="margin-top: 30px">
                                    <Steps :current="1">
                                        <Step title="上传任务excel文件"></Step>
                                        <Step title="匹配任务字段"></Step>
                                        <Step title="核对确认数据"></Step>
                                        <Step title="批量导入完成"></Step>
                                    </Steps>
                                </div>
                                <div style="margin: 20px 0 20px 0;color: #2b85e4;"><h3>请上传任务excel文件</h3></div>
                                <div>
                                    <Row>
                                        <Col span="12">
                                        <Upload action="//jsonplaceholder.typicode.com/posts/">
                                            <Input v-model="value13" placeholder="限xlsx / xls格式" style="width: 800px;">
                                            <Button type="ghost" slot="append" icon="ios-cloud-upload-outline"
                                                    style="background: #2b85e4;color: #fff;">上传文件
                                            </Button>
                                            </Input>
                                        </Upload>
                                        </Col>
                                    </Row>
                                </div>
                                <h3 style="margin: 20px 0 20px 0">按照系统标准模板编写，批量导入更便捷 <span style="color: #2b85e4;">下载参考模版</span>
                                </h3>
                                <Button type="primary" style="position: absolute;bottom: 50px;width: 200px">下一步</Button>
                            </div>
                            <div slot="footer"></div>
                        </Modal>
                        <Modal :styles="{top: '30px'}" v-model="addModal" width="1300" @on-cancel="addtaskList">
                            <div class="icon-header">
                                <Row :gutter="40">
                                    <Col span="4">
                                    <Icon type="ios-star-outline" size="23"></Icon>
                                    </Col>
                                    <Col span="4">
                                    <Icon type="ios-trash-outline" size="23"></Icon>
                                    </Col>
                                </Row>
                            </div>
                            <div slot="header">
                            </div>
                            <Tabs type="card" @on-click="clickFun2">
                                <TabPane label="基本管理">
                                    <add-bean v-if="contShow2 === 0" :admoda="formLeft"></add-bean>
                                </TabPane>
                                <TabPane label="子任务">
                                    <addsub-task v-if="contShow2 === 1" :admoda="formLeft"></addsub-task>
                                </TabPane>
                            </Tabs>
                            <div slot="footer">
                                <!--<Button type="error" size="large"></Button>-->
                            </div>
                        </Modal>
                        <div style="width: 70%">
                            <Row type="flex" justify="start" class="code-row-bg">
                                <Col span="2">
                                <Button type="primary" class="btton-right" @click="excelModal = true">Excle导入</Button>
                                </Col>
                                <Col span="2">
                                <Button type="success" @click="addModal = true,contShow2 = 0">新增任务</Button>
                                </Col>
                            </Row>
                        </div>
                        <Table :columns="columnsTask" :ellipsis="true" :data="dataList" size="small" ref="table"></Table>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    </div>
</template>
<script>
    import sub from './sub.vue';
    import Icon from "iview/src/components/icon/icon";
    import {
        gettasklistData,
        deletetaskData,
        updatetaskData,
        addtasklistData,
        cateList
    } from "../../../config/env.js";
    import Caspanel from "iview/src/components/cascader/caspanel";
    import beaN from './modalContainers/beaN';
    import subTask from './modalContainers/subTask';
    import jouRnal from './modalContainers/jouRnal';
    import addBean from './addModal/addBean';
    import addsubTask from './addModal/addsubTask';
    import Layout from "iview/src/components/layout/layout";

    export default {
        components: {
            addBean,
            addsubTask,
            Layout,
            beaN,
            subTask,
            jouRnal,
            Caspanel,
            Icon,
            'v-sub': sub
        },
        data() {
            return {
                contShow: '',
                contShow2: '',
                value13: '',
                formLeft: {
                    id: '',
                    name: '',
                    project: '',
                    project_child: '',
                    tasktype_id: '',
                    expect_start_time: '',
                    expect_end_time: '',
                    run_uname:'',
                },
                //弹出层
                handleRender: false,
                excelModal: false,
                addModal: false,
                columnsTask: [
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
                        title: "任务",
                        key: "name",
                        align: 'center',
                        ellipsis:true,
                    },
                    {
                        title: "状态",
                        key: "status_text",
                        sortable: true,
                        align: 'center',
                        ellipsis:true,
                    },
                    {
                        title: "子项目",
                        key: "tasktype_name",
                        align: 'center',
                        ellipsis:true,
                    },
                    {
                        title: "参与人",
                        align: 'center',
                        width: '100px',
                        key: 'run_uname',
                        ellipsis:true,
                        // render: function (h, params) {
                        //     return h('div', [
                        //         h('Avatar', {
                        //             props: {
                        //                 // shape: 'circle',
                        //                 size: 'small',
                        //             },
                        //             style: {
                        //                 marginRight: '5px'
                        //             },
                        //             attrs: {
                        //                 src: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
                        //             },
                        //         }),
                        //         h('span', {}, params.row.name),
                        //     ])
                        // },
                    },
                    {
                        title: "类型",
                        // key: "status",
                        align: 'center',
                        ellipsis:true,
                    },
                    {
                        title: "实施阶段",
                        align: 'center',
                        width: '300px',
                        ellipsis:true,
                        render: function (h) {
                            return h('Steps', {
                                    props: {
                                        current: 1,
                                        key: 'state',
                                        status: 'wait',
                                        size: 'small',
                                        direction: 'horizontal'
                                    }
                                },
                                [
                                    h('Step', {
                                        props: {
                                            title: '1',

                                        },
                                    }),
                                    h('Step', {
                                        props: {
                                            title: '2',
                                        },
                                    }),
                                    h('Step', {
                                        props: {
                                            title: '3',

                                        },
                                    }),
                                    h('Step', {
                                        props: {
                                            title: '4',
                                        },
                                    }),
                                    h('Step', {
                                        props: {
                                            title: '5',
                                        },
                                    })
                                ]);
                        },
                    },
                    {
                        title: "任务文件",
                        align: 'center',
                        ellipsis:true,
                    },
                    {
                        title: "更新时间",
                        align: 'center',
                        key: 'expect_end_date',
                        width: '100px',
                        ellipsis:true,
                    },
                    {
                        title: "已用时",
                        align: 'center',
                        ellipsis:true,
                    },
                    {
                        title: "剩余",
                        align: 'center',
                        ellipsis:true,
                    },
                    {
                        title: "操作",
                        align: 'center',
                        width: '200px',
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
                                            cIs.show(params.index);
                                            cIs.contShow = 0;
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        confirm: true,
                                        title: '您确定要删除这条数据吗?',
                                        transfer: true
                                    },
                                    on: {
                                        click: () => {
                                            let cIs = this;
                                            cIs.removetasklistData(params.index);
                                        }
                                    }
                                }, '删除')
                            ]);
                        },
                    },
                ],
                dataList: []
            }
        },
        mounted() {
            this.forEachData();
        },
        methods: {
            //当modal关闭时，执行编辑保存方法
            cancelisM() {
                let cIs = this;
                let dateForm = {}, detailId = cIs.formLeft.id;
                dateForm.id = detailId;
                dateForm.father = cIs.formLeft.father ? cIs.formLeft.father : 0;
                dateForm.name = cIs.formLeft.name;
                dateForm.project = cIs.formLeft.project;
                // dateForm.project_child = cIs.formLeft.project_child;
                dateForm.tasktype_id = cIs.formLeft.tasktype_id;
                dateForm.expect_start_time = cIs.formLeft.expect_start_time;
                dateForm.expect_end_time = cIs.formLeft.expect_end_time;
                cIs.forEachData();
                this.get(updatetaskData, dateForm,
                    () => {
                        cIs.forEachData();
                    }
                );
                this.$Message.info('关闭并保存');
            },
            clickFun(r) {
                this.contShow = r;
            },
            clickFun2(s) {
                this.contShow2 = s;
            },
            exportData(type) {
                if (type === 1) {
                    this.$refs.table.exportCsv({
                        filename: '原始数据的处理'
                    });
                } else if (type === 2) {
                    this.$refs.table.exportCsv({
                        filename: '排序和过滤数据',
                        original: false
                    });
                } else if (type === 3) {
                    this.$refs.table.exportCsv({
                        filename: '自定义数据',
                        columns: this.columnsTask.filter((col, sub) => sub < 4),
                        data: this.dataList.filter((data, sub) => sub < 4)
                    });
                }
            },
            /**
             * get请求
             */
            get(url, params, call) {
                /*获取列表信息*/
                this.$http.get(url, {params: params}).then(function (res) {
                    call(res);
                }, function (error) {
                    this.$Message.error('数据加载出错了！请刷新浏览器');
                });
            },
            //model 数据
            show(index) {
                this.formLeft = this.dataList[index];
                console.log(this.formLeft);
            },
            // 新增列表
            addtaskList() {
                let cIs = this;
                let dateForm = {};
                dateForm.father = cIs.formLeft.father ? cIs.formLeft.father : 0;
                dateForm.name = cIs.formLeft.name;
                dateForm.project = '1';
                dateForm.project_child = '1';
                dateForm.tasktype_id = cIs.formLeft.tasktype_id;
                dateForm.expect_start_time = '2018-3-29';
                dateForm.expect_end_time ='2018-3-30';
                dateForm.description = cIs.formLeft.description;
                cIs.forEachData();
                this.get(addtasklistData,dateForm,
                    () => {
                        cIs.forEachData();
                        cIs.userFormSearch = null
                    }
                );
            },
            //删除数据
            removetasklistData(index) {
                let cIs = this;
                let removeData = this.dataList[index].id;
                this.get(deletetaskData,
                    {
                        id: removeData
                    },
                    () => {
                        cIs.forEachData();
                    }
                );
            },
            //遍历主任务列表数据
            forEachData() {
                let cIs = this;
                this.get(gettasklistData,
                    {
                        project_id: 1
                    },
                    (res) => {
                        //主任务数据渲染及状态上色
                        let dataColortd = res.data.data;
                        for (var i = 0; i < dataColortd.length; i++) {
                            let statusText = dataColortd[i].status;
                            let colorText = dataColortd[i].status_text;
                            if (statusText === '1' || colorText === '等待开始') {
                                dataColortd[i].cellClassName = {status_text: "demo-table-info-cell-start"}
                            } else if (statusText === '2' || colorText === '执行中') {
                                dataColortd[i].cellClassName = {status_text: "demo-table-info-cell-execution"}
                            } else if (statusText === '3' || colorText === '暂停') {
                                dataColortd[i].cellClassName = {status_text: "demo-table-info-cell-pause"}
                            } else if (statusText === '4' || colorText === '完成') {
                                dataColortd[i].cellClassName = {status_text: "demo-table-info-cell-complete"}
                            }
                            ;
                            //判断主列表下是否含有子列表
                            if (dataColortd[i].child != undefined) {
                                dataColortd[i]._expanded = false;
                            } else {
                                dataColortd[i]._disableExpand = true;
                            }
                        }
                        cIs.dataList = dataColortd;
                    }
                );
                //子项目类型
                // this.get(cateList,
                //     {
                //         company_id: 1
                //     },
                //     (res) => {
                //         //任务类型
                //         this.tasktype ={};
                //         let cateli = res.data.data;
                //         for (var i = 0; i < cateli.length; i++) {
                //             let cateid = cateli[i].tasktype;
                //             console.log(cateid);
                //             if(cateli[i].tasktype != undefined){
                //                 console.log(1);
                //             }else{
                //                 console.log(2);
                //             }
                //         }
                //         cIs.dataList = cateli;
                //     }
                // );
            }
        }
    }

</script>

