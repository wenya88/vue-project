<!-- 任务列表组件 -->
<template>
<<<<<<< HEAD
    <div class=" taskListContainer">
        <section class="WaitingToStart">
            <p class="title">未开始({{dataList_type.start.length}})</p>
            <template v-if="dataList_type.start.length>1">
                <div class="list" @click.stop="changeTaskListItem(items)" v-for="(items,index) in dataList_type.start"
                     :key="index">
                    <p class="title">{{items.name}}</p>
                    <div class="BottomInfo">
                        <span>{{items.expect_work_day}}工作日</span>
                        <span>{{timeType(items.expect_start_date)}}-{{timeType(items.expect_end_date)}}</span>
                        <span>{{items.remark_name}}</span>
                    </div>
                    <Icon @click.native.stop="delButton(items)" class="close" type="close-circled"></Icon>
                </div>
            </template>
        </section>
        <section class="perform">
            <p class="title">进行中({{dataList_type.underWay.length}})</p>
            <template v-if="dataList_type.underWay.length>1">
                <div class="list" @click="changeTaskListItem(items)" v-for="(items,index) in dataList_type.underWay"
                     :key="index">
                    <template>
                        <p class="pause">暂停中</p>
                        <p class="sign"></p>
                    </template>
                    <p class="title">{{items.name}}</p>
                    <div class="BottomInfo">
                        <span>{{items.expect_work_day}}工作日</span>
                        <span>{{timeType(items.expect_start_date)}}-{{timeType(items.expect_end_date)}}</span>
                        <span>{{items.remark_name}}</span>
                    </div>
                    <Icon @click.native.stop="delButton(items)" class="close" type="close-circled"></Icon>
                </div>
            </template>
        </section>
        <section class="complete">
            <p class="title">已完成({{dataList_type.end.length}})</p>
            <template v-if="dataList_type.end.length>1">
                <div class="list" @click="changeTaskListItem(items)" v-for="(items,index) in dataList_type.end"
                     :key="index">
                    <p class="title">{{items.name}}</p>
                    <div class="BottomInfo">
                        <span>{{items.expect_work_day}}工作日</span>
                        <span>{{timeType(items.expect_start_date)}}-{{timeType(items.expect_end_date)}}</span>
                        <span>{{items.remark_name}}</span>
                    </div>
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
//        this.$refs.table.clearCurrentRow();
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
=======
  <div class=" taskListContainer" >
      <!--<Table-->
        <!--height='660'-->
        <!--:columns="columnsTask"-->
        <!--:data="dataList"-->
        <!--:ellipsis="true"-->
        <!--size="large"-->
        <!--highlight-row-->
        <!--:loading="loading"-->
        <!--ref="table"-->
        <!--@on-current-change="changeTaskListItem"-->
        <!--&gt;-->
      <!--</Table>-->
         <template>
             <section  class="WaitingToStart">
                 <p class="title">未开始({{dataList_type.start.length}})</p>
                 <template v-if="dataList_type.start.length>1">
                     <div class="list"  @click.stop ="changeTaskListItem(items)" v-for="(items,index) in dataList_type.start" :key="index"  >
                         <p class="title">{{items.name}}</p>
                         <div class="BottomInfo">
                             <span>{{items.expect_work_day}}工作日</span>
                             <span>{{timeType(items.expect_start_date)}}-{{timeType(items.expect_end_date)}}</span>
                             <span>{{items.remark_name}}</span>
                         </div>
                         <Icon @click.native.stop="delButton(items)" class="close" type="close-circled"></Icon>
                     </div>
                 </template>
             </section>
             <section  class="perform">
                 <p class="title">进行中({{dataList_type.underWay.length}})</p>
                 <template v-if="dataList_type.underWay.length>1">
                     <div class="list" @click="changeTaskListItem(items)" v-for="(items,index) in dataList_type.underWay" :key="index"  >
                         <template  >
                             <p class="pause">暂停中</p>
                             <p class="sign" ></p>
                         </template>
                         <p class="title">{{items.name}}</p>
                         <div class="BottomInfo">
                             <span>{{items.expect_work_day}}工作日</span>
                             <span>{{timeType(items.expect_start_date)}}-{{timeType(items.expect_end_date)}}</span>
                             <span>{{items.remark_name}}</span>
                         </div>
                         <Icon @click.native.stop="delButton(items)" class="close" type="close-circled"></Icon>
                     </div>
                 </template>
             </section>
             <section  class="complete">
                 <p class="title">已完成({{dataList_type.end.length}})</p>
                 <template v-if="dataList_type.end.length>1" >
                     <div class="list"  @click="changeTaskListItem(items)" v-for="(items,index) in dataList_type.end" :key="index">
                         <p class="title">{{items.name}}</p>
                         <div class="BottomInfo">
                             <span>{{items.expect_work_day}}工作日</span>
                             <span>{{timeType(items.expect_start_date)}}-{{timeType(items.expect_end_date)}}</span>
                             <span>{{items.remark_name}}</span>
                         </div>
                         <Icon @click.native.stop="delButton(items)" class="close" type="close-circled"></Icon>
                     </div>
                 </template>
             </section>
         </template>



      <!-- <Table 
        height='660' 
        :columns="columnsTask_del" 
        :data="dataList_del" 
        size="large"
        :loading="loading"
        disabled-hover="dellisthighlight"
        ref="del"
        class="tasklistdel"
        @on-current-change="changeTaskListDel"
        >
      </Table> -->
    </div>
</template>
<script>
var qs = require("querystring");
import tasklistline from "./taskListLine";
import {mapMutations,mapState} from 'vuex'

export default {
    props:{
        subtask:{
            type:String,
            default:'',
        }
    },
  components: {
  },
  data() {
    return {
        projectId:sessionStorage.getItem('projectID'),
        dataList_type:{
            start:[],
            underWay:[],
            end:[],
        },
      currentMsg:{},
      loading:true,
      dellisthighlight:false,
      /*-----*/
      dataList: [],
      dataList_del:[],
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
          key:"stage",
          align: "left",
          ellipsis: true,
          width: 280,
          render: function(h, params) {
            //console.log(params);
            let steplist = [];
            let present = parseInt(params.row.progress)+1;
            for(let i=0;i<params.row.stage.length;i++)
            {
              let str="";
              if((present-1) == i)
                str = params.row.stage[i].stage_name;
              steplist.push(
                h("Step",{
                  props: {
                    title: str,
                    }
                })
              );
            }
            return h("Steps",
                  {props: {current: present-1,size: "small"}},
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
                      this.removetasklistData(params.index,$event);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      columnsTask_del:[
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
                            this.removetasklistData(params.index,$event);
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
    this.$bus.on('clearExcleData',()=>{
      this.refreshTaskList();
    })
  },
  methods: {
      ...mapMutations(['setPrimaryMission']),
      delButton(items){
          this.$axios.post(this.GLOBAL.baseRouter + "/task/task/delete", qs.stringify({id:items.id}))
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
    showTaskDetail: function(index) {
//      this.$emit('showTaskDetails',this.dataList[index]);
    },
    //点击切换任务项
    changeTaskListItem(currentRow,oldRow)
    {
        if(this.subtask === 'true'){
            this.$emit('editWindow',currentRow)
        }else if(currentRow != null)//clearCurrentRow有BUG会重复调用，第二次进来就会是个空数据
      {
        this.$emit('showTaskDetails',currentRow);
//        this.$refs.table.clearCurrentRow();
          this.setPrimaryMission(currentRow)
      }
    },
    //删除
    changeTaskListDel(currentRow,oldRow)
    {
      if(currentRow != null)//clearCurrentRow有BUG会重复调用，第二次进来就会是个空数据
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
    removetasklistData(index,$event) {
      $event.cancelBubble = true;
      this.$axios.post(this.GLOBAL.baseRouter + "/task/task/delete", qs.stringify({id:this.dataList[index].id}))
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
    initTaskListFromId(data,type,item) {
        if(data == null)
            data={}
         if(data === 'all'){
            this.getTaskList(data);
        }else if(type === 'member'){
            this.getTaskList(data.run_uid,'member',item);
        }else{
            let msg = {}
            if(!data.project_child_id)//主项目
            {
                msg.project_id = data.project_id?data.project_id:sessionStorage.projectID;
            }
            else
            {
                msg.project_child_id = data.project_child_id;
            }
            this.currentMsg = msg;
            this.getTaskList(msg);
        }
    },
    //刷新当前列表
    refreshTaskList()
    {
      this.loading = true;
      this.getTaskList(this.currentMsg);
    },
    getTaskList(msg,type,item)
    {

        if(msg === 'all'){
            msg = {project_id:this.projectId}
        }else if(type === 'member'){
            let child_id = item.child_id ? item.child_id : '';
            msg = {user_id:msg,project_id:this.projectId,project_child_id:child_id}
        }else if(this.primaryMission && this.subtask) {
            // 子任务 只需要father 其余都不要
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
//            this.$axios.post(this.GLOBAL.baseRouter + 'task/task/info', qs.stringify({id: this.primaryMission.id}))
//                .then(({data}) => {
//                    this.dataList = data.child
//                    this.typeSelection();
//                    console.log(this.dataList)
//                })
//            this.dataList = this.primaryMission.child;
<<<<<<< HEAD
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
=======
             msg = {father:this.primaryMission.id}
        }
            // 进入任务详情，只展示子任务
            this.$axios.post(this.GLOBAL.baseRouter + 'task/task/list',qs.stringify(msg))
                .then( res => res.data)
                .then( res => {
                        this.dataList = res.data;
                        this.formatTaskList(this.dataList);//颠倒顺序
                        this.typeSelection();
                        this.loading = false;
                        this.dataList_del=[];
                        this.dataList.forEach(
                            (element) => {
                                this.dataList_del.push({
                                    name:"删除",
                                    id:element.id
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
    formatTaskList(taskData)
    {
        if(Array.isArray(taskData)){
            taskData.map((item,index,arr) => {
                arr[index].createStamp = new Date(item.create_time).getTime()
            });
        }

        this.sortDataList(this.dataList)
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
//      for (var i = 0; i < taskData.length; i++) {
//          this.setTaskStatus(taskData[i]);
//          taskData[i].update_date = this.TimeFormatMinute(taskData[i].update_date);
//          taskData[i].expect_end_date = this.TimeFormatDay(taskData[i].expect_end_date);
//
//          // if (taskData[i].child != null) {
//          //   taskData[i]._expanded = true;
//          // }
//        }
<<<<<<< HEAD
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
                return time.split(' ')[0].split('-').join('/')
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
        height: 90%;
        padding-left: 10px;
        overflow: auto;
        .WaitingToStart, .perform, .complete, .suspended {
            float: left;
            width: 33.3%;
            height: 700px;
            .title {
=======
    },
    TimeFormatDay(str)
    {  
      return str ? str.substr(0,str.search(/ /)) : "";
    },
    TimeFormatMinute(str)
    {  
      return str ? str.substr(0,str.lastIndexOf(":")) : "";
    },
    //任务状态
    setTaskStatus(taskDatastatus)
    {
      switch(taskDatastatus.status)
      {
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
      typeSelection(){
           this.dataList_type = {
               start:[],
               underWay:[],
               end:[],
           };
           if(Array.isArray(this.dataList)){
               this.dataList.map((items)=>{
                   switch (items.status)
                   {
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
           console.log('最终数组',this.dataList_type)
      },
      timeType(time){
       return  time.split(' ')[0].split('-').join('/')
      },
      sortDataList(time){
       time = time.sort((a, b) => {
              return b.createStamp - a.createStamp;
          })

      }
  },
    computed:{
        ...mapState({
            primaryMission(data){
                return data.project.primaryMission
            }
        })
    }
};
</script>
<style lang="less">
@import "../../../styles/task/task.css";

.taskListContainer {
   height: 100%;
    padding-left: 10px;
    overflow: auto;
        .WaitingToStart,.perform,.complete,.suspended{
            float: left;
            width: 33.3%;
            height: 700px;
            .title{
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
                margin: 5px 0;
                font-size: 16px;
                text-align: center;
            }
<<<<<<< HEAD
            .list {
                position: relative;
                margin: 0 10px 10px 0;
=======
            .list{
                position: relative;
                margin:  0 10px 10px 0;
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
                color: #fff;
                box-shadow: 2px 2px 2px #525252;
                border-radius: 4px;
                transition: all .3s;
<<<<<<< HEAD
                .BottomInfo {
=======
                .BottomInfo{
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
                    display: flex;
                    padding: 0 5px;
                    justify-content: space-between;
                }
                .pause {
                    position: absolute;
                    top: 0;
                    left: -3px;
                    z-index: 3;

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
<<<<<<< HEAD
                .close {
                    position: absolute;
                    top: 0;
                    right: 0;
                    margin: 2px 2px 0 0;
=======
                .close{
                    position: absolute;
                    top:0;
                    right: 0;
                    margin: 2px 2px 0 0 ;
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
                    font-size: 18px;
                    opacity: 0;
                    cursor: pointer;
                }

<<<<<<< HEAD
                .title {
=======
                .title{
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
                    margin-bottom: 60px;
                    color: #fff;
                }
                text-align: center;
                background: #48C5B5;
<<<<<<< HEAD
                &:hover {
                    transform: scale(1.02);
                    .close {
=======
                &:hover{
                    transform: scale(1.02);
                    .close{
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
                        opacity: 1;
                    }
                }
            }
<<<<<<< HEAD
            &::after {
=======
            &::after{
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
                content: ' ';
                display: block;
                clear: left;
            }
        }

<<<<<<< HEAD
    }

    .main-header-con {
        z-index: 0 !important;
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
=======
}


.main-header-con {
  z-index: 0 !important;
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
.tasklistfather{
  display:inline-block;
  overflow:hidden;
}
.tasklist{
    width:1400px;
    z-index: 1;
    float:left;
    padding: 0 0px 0 0;
}
.tasklistdel{
    width:82px;
    z-index: 1;
    float:left;
    padding: 0 0 0 -2px;
}
.dellisttask{
  width:80px;
  position:absolute;
  z-index: 2;
  marginLeft: 12px;
  display:block;
}
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
</style>

