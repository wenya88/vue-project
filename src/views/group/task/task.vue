<style>
    @import "../../../../src/styles/task/task.css";
</style>
<template>
    <div class="layout">
        <Layout>
            <Layout>
                <Layout>
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                        <Modal :styles="{top: '30px'}" v-model="handleRender" width="1300">
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
                            <Tabs type="card">
                                <TabPane label="基本管理">
                                    <bea-n></bea-n>
                                </TabPane>
                                <TabPane label="子任务">
                                    <sub-task></sub-task>
                                </TabPane>
                                <TabPane label="日志">
                                    <jou-rnal></jou-rnal>
                                </TabPane>
                            </Tabs>
                            <div slot="footer">
                                <!--<Button type="error" size="large">ssd</Button>-->
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
                                            <Button type="ghost" slot="append"  icon="ios-cloud-upload-outline" style="background: #2b85e4;color: #fff;">上传文件</Button>
                                        </Input>
                                        </Upload>
                                        </Col>
                                    </Row>
                                </div>
                                <h3 style="margin: 20px 0 20px 0">按照系统标准模板编写，批量导入更便捷 <span style="color: #2b85e4;">下载参考模版</span></h3>
                                <Button type="primary" style="position: absolute;bottom: 50px;width: 200px">下一步</Button>
                            </div>
                            <div slot="footer"></div>
                        </Modal>
                        <Button type="primary" size="small" class="btton-right" @click="excelModal = true">Excle导入
                        </Button>
                        <Table :columns="columns8" :data="dataList" size="small" ref="table"></Table>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    </div>
</template>
<script>
    import sub from './sub.vue';
    import Icon from "iview/src/components/icon/icon";
    import {gettasklistData} from "../../../config/env.js";
    import Caspanel from "iview/src/components/cascader/caspanel";
    import beaN from './modalContainers/beaN';
    import subTask from './modalContainers/subTask';
    import jouRnal from './modalContainers/jouRnal'
    import Layout from "iview/src/components/layout/layout";

    export default {
        components: {
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
                value13: '',
                formLeft: {
                    name: '',
                },
                //弹出层
                handleRender: false,
                excelModal: false,
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
            //获取数据接口
            let cIs = this;
            this.get(gettasklistData,
                {
                    project_id: 2
                },
                (res) => {
                    console.log(res)
                    cIs.dataList = res.data.params;
                    console.log(dataList)
                }
            );
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
            get(url, params, call) {
                /*获取列表信息*/
                this.$http.get(url,{params: params}).then(function (res) {
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
            //     this.get(gettasklist,
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

