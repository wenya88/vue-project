<style>
@import "../../../styles/task/task.css";

.main-header-con {
    z-index: 0 !important;
}
</style>
<template>
    <div class="layout">
        <Layout>
            <Layout>
                <Layout>
                    <div style="background: #FFFFFF">
                        <div class="btnStting">
                            <Button type="success" @click="showaddFormodal">新增任务</Button>
                            <Button type="primary" @click="showExcelmodal">Excle导入</Button>
                        </div>
                    </div>
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                        <tab-modal :editData="formLeft" v-show="isTabModal" @close="closeTabmodal"></tab-modal>
                        <excel-modal v-show="isexcelModal" @close="closeModal"></excel-modal>
                        <addform-modal :addData="formLeft" v-show="isaddFormModal" @close="addcloseModal"></addform-modal>
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
import tabModal from "../components/task/tabModal";
import excelModal from "../components/task/excelModal";
import addformModal from "../components/task/addformModal";
import {
    gettasklistData,
    deletetaskData,
    updatetaskData,
    addtasklistData,
    gettasklistDetails,
    cateList,
    getChildList
} from "../../../config/env.js";
// import Caspanel from "iview/src/components/cascader/caspanel";
import Layout from "iview/src/components/layout/layout";

export default {
    components: {
        tabModal,
        excelModal,
        addformModal,
        Layout,
        Icon,
        'v-sub': sub
    },
    data() {
        return {
            isTabModal: false,
            isexcelModal: false,
            isaddFormModal: false,
            formLeft: {
                id: '',
                name: '',
                project: '',
                project_child: '',
                tasktype_id: '',
                expect_start_time: '',
                expect_end_time: '',
                run_uname: '',
                stage_name: ''
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
                },
                {
                    title: "类型",
                    // key: "status",
                    align: 'center',
                    ellipsis: true,
                },
                {
                    title: "实施阶段",
                    align: 'center',
                    width: '300px',
                    ellipsis: true,
                    render: function(h) {
                        let current = this.progress;
                        return h('Steps', {
                            props: {
                                current: current,
                                size: 'small',
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
                                        cIs.showTabmodal(params.index);
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
         * modal
         */
        //开启
        showExcelmodal: function() {
            this.isexcelModal = true
        },
        //model 数据
        showTabmodal: function(index) {
            this.isTabModal = true
            this.formLeft = this.dataList[index];
        },
        showaddFormodal: function() {
            this.isaddFormModal = true
        },
        //关闭
        closeModal: function() {
            this.isexcelModal = false;
        },
        //当modal关闭时，执行编辑保存方法
        closeTabmodal: function() {
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
            this.isTabModal = false;
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
            this.$http.get(url, { params: params }).then(function(res) {
                call(res);
            }, function(error) {
                this.$Message.error('数据加载出错了！请刷新浏览器');
            });
        },
        // 新增任务列表
        addcloseModal: function() {
            let cIs = this;
            let dateForm = {};
            dateForm.father = cIs.formLeft.father ? cIs.formLeft.father : 0;
            dateForm.name = cIs.formLeft.name;
            dateForm.project = '1';
            dateForm.project_child = cIs.formLeft.project_child;
            dateForm.tasktype_id = cIs.formLeft.tasktype_id;
            dateForm.expect_start_time = cIs.formLeft.expect_start_time;
            dateForm.expect_end_time = cIs.formLeft.expect_end_time;
            dateForm.description = cIs.formLeft.description;
            cIs.forEachData();
            this.get(addtasklistData, dateForm,
                () => {
                    cIs.forEachData();
                    cIs.userFormSearch = null
                }
            );
            this.isaddFormModal = false;
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
                            dataColortd[i].cellClassName = { status_text: "demo-table-info-cell-start" }
                        } else if (statusText === '2' || colorText === '执行中') {
                            dataColortd[i].cellClassName = { status_text: "demo-table-info-cell-execution" }
                        } else if (statusText === '3' || colorText === '暂停') {
                            dataColortd[i].cellClassName = { status_text: "demo-table-info-cell-pause" }
                        } else if (statusText === '4' || colorText === '完成') {
                            dataColortd[i].cellClassName = { status_text: "demo-table-info-cell-complete" }
                        }
                        ;
                        //判断主列表下是否含有子列表
                        if (dataColortd[i].child != undefined) {
                            dataColortd[i]._expanded = false;
                        } else {
                            dataColortd[i]._disableExpand = true;
                        }
                        // //获取主列表阶段进度
                        let current = dataColortd[i].progress;

                    }
                    cIs.dataList = dataColortd;
                }
            );
        },
     
    }
}

</script>

