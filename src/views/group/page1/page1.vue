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
</style>
<template>
    <div class="layout">
        <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
            <Modal v-model="handleRender" width="1000">
                <p slot="header" style="color:#f60;text-align:center">
                    <span>标题</span>
                </p>
                <div style="text-align:center">
                    <p>内容</p>
                </div>
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

    export default {
        components: {
            'v-sub': sub
        },
        data() {
            return {
                handleRender:false,
                modal2: false,
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
                        filters: [
                            {
                                label: '1',
                                value: 1,

                            },
                            {
                                label: '2',
                                value: 2
                            }
                        ],
                        filterMultiple: false,
                        filterMethod(value, row) {
                            if (value === 1) {
                                return row.show > 4000;
                            } else if (value === 2) {
                                return row.show < 4000;
                            }
                        }
                    },
                    {
                        title: "状态",
                        key: "state",
                        align: 'center',
                        width: 80,
                    },
                    {
                        title: "类型",
                        key: "type",
                        align: 'center',
                        filters: [
                            {
                                label: '1',
                                value: 1
                            },
                            {
                                label: '2',
                                value: 2
                            }
                        ],
                        filterMultiple: false,
                        filterMethod(value, row) {
                            if (value === 1) {
                                return row.show > 4000;
                            } else if (value === 2) {
                                return row.show < 4000;
                            }
                        },
                    },
                    {
                        title: "进度",
                        sortable: true,
                        align: 'center',
                        render: function (h) {
                            return h('Steps', [
                                //   props {
                                //     size: 'small'
                                // },
                                h('Step', {
                                    props: {
                                        direction: 'vertical',
                                    },
                                    attrs: {size: 'small'}
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
                        title: "剩余时间",
                        key: "timeremaining",
                        sortable: true,
                        align: 'center',
                    },
                    {
                        title: "参与/负责人",
                        align: 'center',
                        render: function (h) {
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
                                h('span', {
                                    style: {
                                        marginRight: '15px'
                                    },
                                }, '大大'),
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
                                h('span', {}, '小小'),
                            ])
                        },
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
                                            console.log(this);
                                            this.handleRender = true;
                                        }
                                    }
                                }, '编辑'),
                            ]);
                        },
                    },
                ],
                dataList: [
                    // {
                    //     state: "实施中",
                    //     name: "架构处理",
                    //     timeremaining: "19%",
                    //     principal: "大大",
                    //     type: "原画",
                    //     cellClassName: {
                    //         state: 'demo-table-info-cell-stateT'
                    //     },
                    // },
                    // {
                    //     state: "已完成",
                    //     name: "架构处理",
                    //     timeremaining: "1%",
                    //     principal: "哈哈",
                    //     type: "场景",
                    //     cellClassName: {
                    //         state: 'demo-table-info-cell-state',
                    //     }
                    // }
                ]
            }
        },
        mounted() {
            this.get();
        },
        methods: {
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
            /**
             * get请求
             */
            get: function () {
                /*发送请求*/
                var url = "http://192.168.2.19/product/code/yhc_api/web/interface/api?method=gettasklist";
                var params = {
                    name: "xmg123"
                }
                let cIs = this;
                this.$http.get(url, params).then(function (res) {
                    cIs.dataList = res.data.params.list;
                    console.log(res.data);
                }, function (error) {
                });
            },
        }
    }

</script>

