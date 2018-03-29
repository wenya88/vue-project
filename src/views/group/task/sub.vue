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
            <Table :show-header="false" :columns="columnsTask" :data="dataList" size="small" ref="table"></Table>
        </Content>
    </div>
</template>
<script>
    import {gettasklistData} from "../../../config/env.js";
    import {deletetaskData} from "../../../config/env.js";
    // import {updatetaskData} from "../../../config/env.js";
    // import {addtasklistData} from "../../../config/env.js";
    export default {
        components: {

        },
        data() {
            return {
                columnsTask: [
                    {
                        width: 50,
                    },
                    {
                        title: "任务",
                        key: "name",
                        align: 'center',
                    },
                    {
                        title: "状态",
                        key: "status_text",
                        align: 'center',
                        sortable: true,
                    },
                    {
                        title: "子项目",
                        key: "tasktype_name",
                        align: 'center',
                    },
                    {
                        title: "参与人",
                        align: 'center',
                        render: function (h, params) {
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
                                h('span', {}, params.row.name),
                            ])
                        },
                    },
                    {
                        title: "类型",
                        key: "status",
                        align: 'center',

                    },
                    {
                        title: "实施阶段",
                        align: 'center',
                        width: '300px',
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
                    },
                    {
                        title: "更新时间",
                        align: 'center',
                        key: 'expect_end_date',
                        width: '100px',
                    },
                    {
                        title: "已用时",
                        align: 'center',
                    },
                    {
                        title: "剩余",
                        align: 'center',
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
            /**
             * get请求
             */
            get(url, params, call) {
                /*获取列表信息*/
                this.$http.get(url, {params: params}).then(function (res) {
                    call(res);
                }, function (error) {
                });
            },
            //model 数据
            // show(index) {
            //     this.formLeft = this.dataList[index];
            // },
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
            //遍历列表数据
            forEachData() {
                let cIs = this;
                this.get(gettasklistData,
                    {
                        project_id: 1
                    },
                    (res) => {
                        //任务类型状态
                        let dataColortd = res.data.data;
                        for (var i = 0; i < dataColortd.length; i++) {
                            let colorText = dataColortd[i].status_text;
                            if (colorText === '等待开始'){
                                dataColortd[i].cellClassName = { status_text : "demo-table-info-cell-start" }
                            }else if(colorText === '执行中'){
                                dataColortd[i].cellClassName = { status_text : "demo-table-info-cell-execution" }
                            }else if(colorText === '暂停'){
                                dataColortd[i].cellClassName = { status_text : "demo-table-info-cell-pause" }
                            }else if(colorText === '完成'){
                                dataColortd[i].cellClassName = { status_text : "demo-table-info-cell-complete" }
                            };
                            //判断主列表下是否含有子列表
                            if (dataColortd[i].child !== undefined) {
                                cIs.dataList = dataColortd[i].child;
                            } else {

                            }
                        }
                    }
                );
            }
        },
    }
</script>
