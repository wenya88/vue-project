<style>
    @import "../../../../src/styles/task/task.css";

    td.ivu-table-expanded-cell {
        padding: 0 !important;
    }

    .table_border .ivu-table-wrapper {
        border: 0;
    }
</style>
<template>
    <div class="table_border">
        <Content :style="{background: '#fff'}">
            <Modal :styles="{top: '30px'}" v-model="handleRender" width="1300" @on-cancel="">
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
                    <TabPane label="子任务">
                        <sub-task v-if="contShow === 0" :datl="formLeft"></sub-task>
                    </TabPane>
                    <TabPane label="日志">
                        <jou-rnal v-if="contShow === 1" :datl="formLeft"></jou-rnal>
                    </TabPane>
                </Tabs>
                <div slot="footer">
                    <!--<Button type="error" size="large"></Button>-->
                </div>
            </Modal>
            <Table :show-header="false" :columns="columnsTask" :data="dataList" size="small" ref="table"></Table>
        </Content>
    </div>
</template>
<script>
    import {gettasklistData} from "../../../config/env.js";
    import {deletetaskData} from "../../../config/env.js";
    import subTask from './modalContainers/subTask';
    import jouRnal from './modalContainers/jouRnal';
    import {updatetaskData} from "../../../config/env.js";
    // import {addtasklistData} from "../../../config/env.js";
    export default {
        props: ['datl'],
        components: {subTask, jouRnal},
        data() {
            return {
                //弹出层
                handleRender: false,
                contShow: '',
                columnsTask: [
                    {
                        width: 50,
                        align: 'center',
                    },
                    {
                        title: "任务",
                        key: "name",
                        align: 'center',
                        ellipsis: true,
                    },
                    {
                        title: "状态",
                        key: "status_text",
                        sortable: true,
                        align: 'center',
                        ellipsis: true,
                    },
                    {
                        title: "子项目",
                        key: "tasktype_name",
                        align: 'center',
                        ellipsis: true,
                    },
                    {
                        title: "参与人",
                        align: 'center',
                        width: '100px',
                        key: 'run_uname',
                        ellipsis: true,
                        // render: function (h, params) {
                        //     return h('div', [
                        //         h('Avatar', {
                        //             props: {
                        //                 shape: 'circle',
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
                        // key: "",
                        align: 'center',
                        ellipsis: true,

                    },
                    {
                        title: "实施阶段",
                        align: 'center',
                        width: '300px',
                        ellipsis: true,
                        render: function (h) {
                            return h('Steps', {
                                    props: {
                                        current: 0,
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
                        ellipsis: true,
                    },
                    {
                        title: "更新时间",
                        align: 'center',
                        key: 'expect_end_date',
                        width: '100px',
                        ellipsis: true,
                    },
                    {
                        title: "已用时",
                        align: 'center',
                        ellipsis: true,
                    },
                    {
                        title: "剩余",
                        align: 'center',
                        ellipsis: true,
                    },
                    {
                        title: "操作",
                        align: 'center',
                        width: '200px',
                        ellipsis: true,
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
                                            cIs.showSub(params.index);
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
                                            cIs.removetaskSub(params.index);
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
            this.forEachSubData();
        },
        methods: {
            //当modal关闭时，执行编辑保存方法
            // cancel() {
            //     let cIs = this;
            //     let dateForm = {}, detailId = cIs.formLeft.id;
            //     dateForm.id = detailId;
            //     dateForm.father = cIs.formLeft.father ? cIs.formLeft.father : 0;
            //     dateForm.name = cIs.formLeft.name;
            //     dateForm.project = cIs.formLeft.project;
            //     // dateForm.project_child = cIs.formLeft.project_child;
            //     dateForm.tasktype_id = cIs.formLeft.tasktype_id;
            //     dateForm.expect_start_time = cIs.formLeft.expect_start_time;
            //     dateForm.expect_end_time = cIs.formLeft.expect_end_time;
            //     cIs.forEachData();
            //     this.get(updatetaskData, dateForm,
            //         () => {
            //             cIs.forEachData();
            //         }
            //     );
            //     this.$Message.info('关闭并保存');
            // },
            clickFun(r) {
                this.contShow = r;
            },
            /**
             * 请求数据
             */
            get(url, params, call) {
                /*获取列表信息*/
                this.$http.get(url, {params: params}).then(function (res) {
                    call(res);
                }, function (error) {
                });
            },
            //获取子任务model数据
            showSub(index) {
                this.formLeft = this.dataList[index];
            },
            //删除子任务列表数据
            removetaskSub(index) {
                let cIs = this;
                let removeSubData = this.dataList[index].id;
                this.get(deletetaskData,
                    {
                        id: removeSubData
                    },
                    () => {
                        cIs.forEachSubData();
                    }
                );
            },
            //遍历子任务列表数据
            forEachSubData() {
                let cIs = this;
                this.get(gettasklistData,
                    {
                        project_id: 1
                    },
                    (res) => {
                        //子任务数据渲染及状态上色
                        let dataColortd = res.data.data;
                        for (var i = 0; i < dataColortd.length; i++) {
                            dataColortd[i].status;
                            dataColortd[i].status_text;
                            let child = dataColortd[i].child;
                            if (child) {
                                for (var k = 0; k < child.length; k++) {
                                    console.log(child[k].status);
                                    if (child[k].status === '1' || child[k].status_text === '等待开始') {
                                        child[k].cellClassName = {status_text: "demo-table-info-cell-start"}
                                    } else if (child[k].status === '2' || child[k].status_text === '执行中') {
                                        child[k].cellClassName = {status_text: "demo-table-info-cell-execution"}
                                    } else if (child[k].status === '3' || child[k].status_text === '暂停') {
                                        child[k].cellClassName = {status_text: "demo-table-info-cell-pause"}
                                    } else if (child[k].status === '4' || child[k].status_text === '完成') {
                                        child[k].cellClassName = {status_text: "demo-table-info-cell-complete"}
                                    }
                                }
                            }
                            cIs.dataList = child;
                        }
                    }
                );
            }
        },
    }
</script>
