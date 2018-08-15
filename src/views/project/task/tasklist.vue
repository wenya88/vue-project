<!-- 任务列表组件 -->
<template>
    <div class=" taskListContainer">
        <section class="WaitingToStart">
            <p class="title"><Icon type="android-radio-button-off" style="vertical-align: middle" class="green"></Icon> 未进行（<span class="green">{{dataList_type.start.length}}</span>）</p>
            <template v-if="dataList_type.start.length>0">
                <div class="list" @click.stop="changeTaskListItem(items)" v-for="(items,index) in dataList_type.start"
                     :key="index">
                    <p class="title">{{items.name}}</p>
                    <div class="BottomInfo">
                        <span style="color: #777777">{{items.expect_work_day}}工作日({{timeType(items.expect_start_date)}}-{{timeType(items.expect_end_date)}})</span>

                        <span>
                            <img  class="headImg" src="./QQ图片20180719133401.jpg"  alt=""><span style="vertical-align: top" >{{items.remark_name}}</span>
                       </span>
                    </div>
                    <Icon @click.native.stop="delButton(items)" class="close" type="close-circled"></Icon>
                </div>
            </template>
        </section>
        <section class="perform">
            <p class="title"><Icon type="android-radio-button-off" style="vertical-align: middle" class="blue"></Icon> 进行中（<span class="blue">{{dataList_type.underWay.length}}</span>）</p>
            <template v-if="dataList_type.underWay.length>0">
                <div class="list" @click="changeTaskListItem(items)" v-for="(items,index) in dataList_type.underWay"
                     :key="index">
                    <template>
                        <p class="pause">暂停中</p>
                        <p class="sign"></p>
                    </template>
                    <p class="title">{{items.name}}</p>
                    <div class="BottomInfo">
                        <span style="color: #777777" >{{items.expect_work_day}}工作日({{timeType(items.expect_start_date)}}-{{timeType(items.expect_end_date)}})</span>
                       <span>
                            <img  class="headImg" src="./QQ图片20180719133401.jpg"  alt=""><span style="vertical-align: top" >{{items.remark_name}}</span>
                       </span>
                    </div>
                    <Icon @click.native.stop="delButton(items)" class="close" type="close-circled"></Icon>
                </div>
            </template>
        </section>
        <section class="complete">
            <p class="title"><Icon type="android-radio-button-off" style="vertical-align: middle" class="orange"></Icon> 已完成（<span class="orange">{{dataList_type.end.length}}</span>）</p>
            <template v-if="dataList_type.end.length>0">
                <div class="list" @click="changeTaskListItem(items)" v-for="(items,index) in dataList_type.end"
                     :key="index">
                    <p class="title">{{items.name}}</p>
                    <div class="BottomInfo">
                        <span style="color: #777777">{{items.expect_work_day}}工作日({{timeType(items.expect_start_date)}}-{{timeType(items.expect_end_date)}})</span>

                        <span>
                            <img  class="headImg" src="./QQ图片20180719133401.jpg"  alt=""><span style="vertical-align: top" >{{items.remark_name}}</span>
                       </span>                    </div>
                    <Icon @click.native.stop="delButton(items)" class="close" type="close-circled"></Icon>
                </div>
            </template>
        </section>
    </div>
</template>
<script>
    var qs = require("querystring");
    import tasklistline from "./taskListLine";
    import {mapMutations, mapState} from 'vuex'

    export default {
        props: {
            subtask: {
                type: String,
                default: '',
            }
        },
        components: {},
        data() {
            return {
                projectId: sessionStorage.getItem('projectID'),
                dataList_type: {
                    start: [],
                    underWay: [],
                    end: [],
                },
                currentMsg: {},
                loading: true,
                dellisthighlight: false,
                /*-----*/
                dataList: [],
                dataList_del: [],
                columnsTask: [
                    // {
                    //   type: 'expand',
                    //   width: 20,
                    //   render: (h, params) => {
                    //     console.log(params);

                    //     return h(tasklistline, {//子任务下拉
                    //       props: {
                    //         taskrow: params.child
                    //       }
                    //     });
                    //   }
                    // },
                    {
                        title: "任务名",
                        key: "name",
                        align: "left",
                        ellipsis: true,
                        width: 340
                    },
                    {
                        title: "状态",
                        key: "status_text",
                        align: "right",
                        ellipsis: true,
                        width: 120
                    },
                    {
                        title: "类型",
                        key: "tasktype_name",
                        align: "right",
                        ellipsis: true,
                        width: 100
                    },
                    {
                        title: "负责人",
                        key: "remark_name",
                        align: "right",
                        ellipsis: true,
                        width: 154
                    },
                    {
                        title: "实施阶段",
                        key: "stage",
                        align: "left",
                        ellipsis: true,
                        width: 280,
                        render: function (h, params) {
                            //console.log(params);
                            let steplist = [];
                            let present = parseInt(params.row.progress) + 1;
                            for (let i = 0; i < params.row.stage.length; i++) {
                                let str = "";
                                if ((present - 1) == i)
                                    str = params.row.stage[i].stage_name;
                                steplist.push(
                                    h("Step", {
                                        props: {
                                            title: str,
                                        }
                                    })
                                );
                            }
                            return h("Steps",
                                {props: {current: present - 1, size: "small"}},
                                steplist
                            );
                        }
                    },
                    {
                        title: "任务文件",
                        align: "center",
                        ellipsis: true,
                        key: "file_id",
                        width: 140
                    },
                    {
                        title: "文件最近更新",
                        align: "right",
                        key: "update_date",
                        ellipsis: false,
                        width: 120
                    },
                    {
                        title: "到期时间",
                        align: "right",
                        key: "expect_end_date",
                        ellipsis: false,
                        width: 120
                    },
                    {
                        title: "操作",
                        align: "right",
                        width: 84,
                        render: (h, params) => {
                            return h("div", [
                                // h(
                                //   "Button",
                                //   {
                                //     props: {
                                //       type: "text",
                                //       size: "small"
                                //     },
                                //     style: {
                                //       marginLeft: "12px"
                                //     },
                                //     on: {
                                //       click: () => {
                                //         this.showTaskDetail(params.index);
                                //       }
                                //     }
                                //   },
                                //   "编辑"
                                // ),
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "text",
                                            size: "small",
                                            confirm: true,
                                            title: "确认删除该任务?",
                                            transfer: true
                                        },
                                        style: "dellisttask",
                                        on: {
                                            click: ($event) => {
                                                this.removetasklistData(params.index, $event);
                                            }
                                        }
                                    },
                                    "删除"
                                )
                            ]);
                        }
                    }
                ],
                columnsTask_del: [
                    {
                        title: "删除",
                        key: "name",
                        align: "center",
                        width: 80,
                        render: (h, params) => {
                            return h("div", [
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "text",
                                            size: "small",
                                            confirm: true,
                                            title: "确认删除该任务?",
                                            transfer: true
                                        },
                                        style: "dellisttask",
                                        on: {
                                            click: ($event) => {//render不支持.
                                                this.removetasklistData(params.index, $event);
                                            }
                                        }
                                    },
                                    "删除"
                                )
                            ]);
                        }
                    },
                ]
            };
        },
        mounted() {
            this.initTaskListFromId();
            this.$bus.on('clearExcleData', () => {
                this.refreshTaskList();
            })
        },
        methods: {
            ...mapMutations(['setPrimaryMission']),
            delButton(items) {
                this.$axios.post(this.GLOBAL.baseRouter + "/task/task/delete", qs.stringify({id: items.id}))
                    .then(res => {
                        this.$bus.emit('refreshCurrentTaskList');
                        this.refreshTaskList();
                        this.$Message.success('删除任务成功');
                    })
                    .catch(error => {
                        this.$Message.error("删除任务失败，请重试！");
                        return false;
                    });
            },

            //打开任务详情
            showTaskDetail: function (index) {
//      this.$emit('showTaskDetails',this.dataList[index]);
            },
            //点击切换任务项
            changeTaskListItem(currentRow, oldRow) {
                if (this.subtask === 'true') {
                    this.$emit('editWindow', currentRow)
                } else if (currentRow != null)//clearCurrentRow有BUG会重复调用，第二次进来就会是个空数据
                {
                    this.$emit('showTaskDetails', currentRow);
//                    this.$refs.table.clearCurrentRow();
                    this.setPrimaryMission(currentRow)


                }
            },
            //删除
            changeTaskListDel(currentRow, oldRow) {
                if (currentRow != null)//clearCurrentRow有BUG会重复调用，第二次进来就会是个空数据
                {
                    console.log("changeTaskListDel");
                }
            },
            exportData(type) {
                if (type === 1) {
                    this.$refs.table.exportCsv({
                        filename: "原始数据的处理"
                    });
                } else if (type === 2) {
                    this.$refs.table.exportCsv({
                        filename: "排序和过滤数据",
                        original: false
                    });
                } else if (type === 3) {
                    this.$refs.table.exportCsv({
                        filename: "自定义数据",
                        columns: this.columnsTask.filter((col, sub) => sub < 4),
                        data: this.dataList.filter((data, sub) => sub < 4)
                    });
                }
            },
            //参与人滚动条
            handleReachBottom() {
                // return new Promise(resolve => {
                //   setTimeout(() => {
                //     const last = this.list1[this.list1.length - 1];
                //     for (let i = 1; i < 11; i++) {
                //       this.list1.push(last + i);
                //     }
                //     resolve();
                //   }, 2000);
                // });
            },
            //删除数据
            removetasklistData(index, $event) {
                $event.cancelBubble = true;
                this.$axios.post(this.GLOBAL.baseRouter + "/task/task/delete", qs.stringify({id: this.dataList[index].id}))
                    .then(res => {
                        this.$Message.error("删除任务成功");
                        this.$bus.emit('refreshCurrentTaskList');
                        this.refreshTaskList();
                    })
                    .catch(error => {
                        this.$Message.error("删除任务失败，请重试！");
                        return false;
                    });
                return true;
            },
            //遍历主任务列表数据
            initTaskListFromId(data, type, item) {
                if (data == null)
                    data = {}
                if (data === 'all') {
                    this.getTaskList(data);
                } else if (type === 'member') {
                    this.getTaskList(data.run_uid, 'member', item);
                } else {
                    let msg = {}
                    if (!data.project_child_id)//主项目
                    {
                        msg.project_id = data.project_id ? data.project_id : sessionStorage.projectID;
                    }
                    else {
                        msg.project_child_id = data.project_child_id;
                    }
                    this.currentMsg = msg;
                    this.getTaskList(msg);
                }
            },
            //刷新当前列表
            refreshTaskList() {
                this.loading = true;
                this.getTaskList(this.currentMsg);
            },
            getTaskList(msg, type, item) {

                if (msg === 'all') {
                    msg = {project_id: this.projectId}
                } else if (type === 'member') {
                    let child_id = item.child_id ? item.child_id : '';
                    msg = {user_id: msg, project_id: this.projectId, project_child_id: child_id}
                } else if (this.primaryMission && this.subtask) {
                    // 子任务 只需要father 其余都不要
                    msg = {father: this.primaryMission.id}
                }
                // 进入任务详情，只展示子任务
                this.$axios.post(this.GLOBAL.baseRouter + 'task/task/list', qs.stringify(msg))
                    .then(res => res.data)
                    .then(res => {

                            this.dataList = res.data;
                            this.formatTaskList(this.dataList);//颠倒顺序
                            this.typeSelection();
                            this.loading = false;
                            this.dataList_del = [];
                            this.dataList.forEach(
                                (element) => {
                                    this.dataList_del.push({
                                        name: "删除",
                                        id: element.id
                                    });
                                });
                        }
                    )
                    .catch(error => {
                        console.log(error);
                        return true;
                        this.$Message.error("获取任务列表失败，请重试！");
                    });
                return true;

            },
            // 排序
            formatTaskList(taskData) {
                if (Array.isArray(taskData)) {
                    taskData.map((item, index, arr) => {
                        arr[index].createStamp = new Date(item.create_time).getTime()
                    });
                }

                this.sortDataList(this.dataList)
//      for (var i = 0; i < taskData.length; i++) {
//          this.setTaskStatus(taskData[i]);
//          taskData[i].update_date = this.TimeFormatMinute(taskData[i].update_date);
//          taskData[i].expect_end_date = this.TimeFormatDay(taskData[i].expect_end_date);
//
//          // if (taskData[i].child != null) {
//          //   taskData[i]._expanded = true;
//          // }
//        }
            },
            TimeFormatDay(str) {
                return str ? str.substr(0, str.search(/ /)) : "";
            },
            TimeFormatMinute(str) {
                return str ? str.substr(0, str.lastIndexOf(":")) : "";
            },
            //任务状态
            setTaskStatus(taskDatastatus) {
                switch (taskDatastatus.status) {
                    case "1":
                        taskDatastatus.cellClassName = {status_text: "demo-table-info-cell-start"};
                        break;
                    case "2":
                        taskDatastatus.cellClassName = {status_text: "demo-table-info-cell-execution"};
                        break;
                    case "3":
                        taskDatastatus.cellClassName = {status_text: "demo-table-info-cell-pause"};
                        break;
                    case "4":
                        taskDatastatus.cellClassName = {status_text: "demo-table-info-cell-complete"};
                        break;
                }
            },
            typeSelection() {
                this.dataList_type = {
                    start: [],
                    underWay: [],
                    end: [],
                };
                if (Array.isArray(this.dataList)) {
                    this.dataList.map((items) => {
                        switch (items.status) {
                            case '1':
                                this.dataList_type.start.push(items);
                                break;
                            case '2':
                                this.dataList_type.underWay.push(items);
                                break;
                            case '3':
                                this.dataList_type.underWay.push(items);
                                break;
                            case '4':
                                this.dataList_type.end.push(items);
                                break;
                        }

                    })
                }
            },
            timeType(time) {
                return time.split(' ')[0].split('-')[1] + '/' + time.split(' ')[0].split('-')[2]
            },
            sortDataList(time) {
                time = time.sort((a, b) => {
                    return b.createStamp - a.createStamp;
                })

            }
        },
        computed: {
            ...mapState({
                primaryMission(data) {
                    return data.project.primaryMission
                }
            })
        }
    };
</script>
<style lang="less">
    @import "../../../styles/task/task.css";
    .taskListContainer {
        height: 87%;

        overflow: auto;
        .green{
            color: #6ce2d3;
        }
        .orange{
            color: #fdd772;
        }
        .blue{
            color: #9ed3fd;
        }

        .WaitingToStart, .perform, .complete, .suspended {
            float: left;
            width: 32%;
            margin-right: 5px;
            background: #fff;
            /*height: 700px;*/

            .title {
                margin: 5px 0;
                font-size: 16px;
                text-align: center;
            }
            .list {
                position: relative;
                margin: 20px;
                color: #ccc;
                /*box-shadow: 2px 2px 2px #525252;*/
                border-radius: 2px;
                transition: all .3s;
                text-align: center;
                background: #fff;
                border: 1px solid #efefef;
                .BottomInfo {
                    display: flex;
                    padding: 20px;
                    justify-content: space-between;
                    .headImg{
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        margin: -10px 5px 0 0;
                    }
                }
                .pause {
                    position: absolute;
                    top: 0;
                    left: -3px;
                    z-index: 3;
                    color: #fff;
                }
                .sign {
                    position: absolute;
                    top: 18px;
                    left: -3px;
                    width: 0;
                    height: 0;
                    margin-top: -20px;
                    border-top: none;
                    border-right: 50px solid transparent;
                    border-bottom: 50px solid transparent;
                    border-left: 50px solid #ff7970;
                    z-index: 2;
                }
                .close {
                    position: absolute;
                    top: 0;
                    right: 0;
                    margin: 2px 2px 0 0;
                    font-size: 18px;
                    opacity: 0;
                    cursor: pointer;
                }

                .title {
                    margin-bottom: 60px;
                    padding-left: 35px;
                    text-align: left;
                    color: #818181;
                }

                &:hover {
                    transform: scale(1.02);
                    .close {
                        opacity: 1;
                    }
                }
            }
            &::after {
                content: ' ';
                display: block;
                clear: left;
            }
        }


    }


    .main-header-con {
        z-index: 1 !important;
    }

    .showAdd {
        display: inline-block;
    }

    .hideAdd {
        display: none;
    }

    .showEdit {
        display: inline-block;
    }

    .hideEdit {
        display: none;
    }

    .dropChild .ivu-select-dropdown {
        width: 300px !important;
        top: 40px !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    .meberli li {
        height: 35px;
        line-height: 35px;
    }

    .pushDa Input {
        width: 100px !important;
        border-right: 0 !important;
        border-radius: 0 !important;
        position: relative;
    }

    .borderNome Input {
        border-radius: 0 !important;
        right: 20px;
        position: relative;
    }

    .btnStting {
        margin-bottom: 10px;
    }

    .tasklistfather {
        display: inline-block;
        overflow: hidden;
    }

    .tasklist {
        width: 1400px;
        z-index: 1;
        float: left;
        padding: 0 0px 0 0;
    }

    .tasklistdel {
        width: 82px;
        z-index: 1;
        float: left;
        padding: 0 0 0 -2px;
    }

    .dellisttask {
        width: 80px;
        position: absolute;
        z-index: 2;
        marginLeft: 12px;
        display: block;
    }
</style>

