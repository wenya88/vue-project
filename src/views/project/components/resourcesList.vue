<template>
    <div class="menauBarContainer">
        <div class="menauBar">
            <ul class="projectClassfly">
                <li v-for="(item,index) in TwoMenuList" :class="{'currenSty':index == selectIndex}"
                    @click="selectTaskType(index,item.id)">{{ item.tasktype_name || null }}<span>( {{item.cnt}} )</span>
                </li>
            </ul>

            <ul class="screenBar">
                <li>
                    <my-sort :sortList="ndsSortList" @choiced="filterFTime" v-if="sortShow == 'frist'"></my-sort>
                    <my-sort :sortList="nsfkSortList" @choiced="filterSTime" v-if="sortShow == 'second'"></my-sort>
                    <my-sort :sortList="khdsSortList" @choiced="filterTTime" v-if="sortShow == 'third'"></my-sort>
                    <my-sort :sortList="khfkSortList" @choiced="filterFoTime" v-if="sortShow == 'fourth'"></my-sort>
                </li>
                <li class="searchBar">
                    <div>
                        <input type="text" v-model="searchInput" placeholder="任务 / 负责人" @keyup.enter="fetchData"/>
                        <button @click="fetchData"></button>
                    </div>
                </li>
            </ul>
        </div>

        <div class="tab-main" :style="`min-height: ${boxHeight}px;`">
            <Row type="flex" justify="start" class="code-row-bg">
                <Col span="6" v-for="(item,index) in listData" :key="index">
                <!--<div class="card" @click="fetchFileData(item.stage_id,item.stage_file.type,item.stage_file.file,item.task_id,item)">-->
                <div class="card" @click="fetchFileData(item)">
                    <div class="card-box">

                        <img v-if="item.stage_file.type == 'image'" class="card-box-pic"
                             :src="item.stage_file.file+'?x-oss-process=image/resize,l_500'"/>
                        <!--?x-oss-process=video/snapshot,t_2000,f_jpg oss获取视频的缩略图 添加在视频路径后面-->
                        <img v-else-if="item.stage_file.type == 'video'" class="card-box-pic"
                             :src="item.stage_file.file+'?x-oss-process=video/snapshot,t_2000,f_jpg'"/>
                        <img v-else-if="item.stage_file.type == '3d'" class="card-box-pic"
                             :src="item.stage_file.thumb+'?x-oss-process=image/resize,l_500'"/>

                        <div class="tips">
                            <div style="display: flex;justify-content: space-between">
                                <p class="omit">{{item.tasktype_name}}&emsp;{{item.task_name}}</p>
                                <p class="omit">{{item.create_date}} </p>
                            </div>
                            <div style="display: flex">
                                <div class="userImg">
                                    <img class="icon" src="../../../images/icon/3D.png"/>
                                    <span style="text-align: center">{{item.run_uname}}</span>
                                </div>
                                <i class="line"></i>
                                <table class="card-table">
                                    <tr>
                                        <td class="w25">待审天数</td>
                                        <td class="w25">完成阶段</td>
                                        <td class="w25">剩余时间</td>
                                    </tr>
                                    <tr class="fb">
                                        <td class="w25">
                                            <span class="orange-span">{{parseInt((date - item.create_time) / 86400)}}</span>/天
                                        </td>
                                        <td class="w25">
                                                <span class="orange-span"
                                                      v-if="item.tasktype_stage_now">{{item.tasktype_stage_now.stage_name}}</span>
                                            <span class="orange-span" v-else>暂无上传阶段</span>
                                        </td>
                                        <td class="w25">
                                            <span class="orange-span">{{parseInt((item.expect_end_time - date) / 86400)}}</span>天
                                        </td>
                                    </tr>
                                </table>
                            </div>

                        </div>

                    </div>
                </div>
                </Col>
            </Row>
            <span class="more" @click="changePageIndex()">{{moreText}}</span>
        </div>
    </div>
</template>

<script>
    var qs = require('querystring');

    import mySort from '../../main-components/sort';
    import browsetask from '../task/browseTaskPop';
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: 'resourcesList',
        components: {
            mySort,
            browsetask
        },
        props: {
            sortShow: {
                type: String,
                defaule: '',
            }
        },
        data() {
            return {
                resourceStatus: '',
                isTabModal: false,
                page: 1,
                date: (Date.parse(new Date())) / 1000,
                model: '',
                model1: '',
                selTaskType: '',
                searchInput: '',
                boxHeight: 300,
                listData: [],
                moreText: '加载更多',
                loading: false,
                followList: [
                    {
                        value: 0,
                        label: '不限'
                    }, {
                        value: 1,
                        label: '是'
                    }
                ],
                TwoMenuList: {},
                selectIndex: null
            }
        },
        mounted() {
            this.getTaskList();
            switch (this.sortShow) {
                case 'frist':
                    this.filterFTime(0);
                    break;
                case 'second':
                    this.filterSTime(0);
                    break;
                case 'third':
                    this.filterTTime(0);
                    break;
                case 'fourth':
                    this.filterFoTime(0);
                    break;
            }
        },
        computed: {
            ...mapGetters({
                ndsSortList: 'getNdsSortList',
                nsfkSortList: 'getNsfkSortList',
                khdsSortList: 'getKhdsSortList',
                khfkSortList: 'getKhfkSortList',
                statusList: 'getStatusList',
                taskList: 'getTaskType',
                subProjectList: 'getSubProjectList'
            }),
        },
        methods: {
            ...mapMutations(['setPrimaryMission', 'setDetailAll', 'setUserStatus','setToName']),
            change(status) {
                this.$Message.info(`Status: ${status}`);
            },
            /**
             * 文件筛选条件
             */
            filterFTime(val) {
                if (val == 0) {
                    this.sortStatus = 'stage_create_time';
                    this.page = 1;
                } else if (val == 1) {
                    this.sortStatus = 'stage_create_time';
                    this.orderBy = 'asc'
                    this.page = 1;
                } else if (val == 2) {
                    this.sortStatus = 'expect_end_time';
                    this.orderBy = 'asc'
                    this.page = 1;
                }
                this.fetchData()
            },
            filterSTime(val) {
                if (val == 0) {
                    this.sortStatus = 'inside_audit_time';
                    this.page = 1;
                    // } else if (val == 1) {
                    //   this.sortStatus = 'inside_audit_time';
                    // this.page = 1;
                } else if (val == 1) {
                    this.sortStatus = 'expect_end_time';
                    this.page = 1;
                }
                this.fetchData()
            },
            filterTTime(val) {
                if (val == 0) {
                    this.sortStatus = 'inside_audit_time';
                    this.page = 1;
                } else if (val == 1) {
                    this.sortStatus = 'inside_audit_time';
                    this.page = 1;
                } else if (val == 2) {
                    this.sortStatus = 'expect_end_time';
                    this.page = 1;
                }
                this.fetchData()
            },
            filterFoTime(val) {
                if (val == 0) {
                    this.sortStatus = 'client_audit_time';
                    this.page = 1;
                } else if (val == 1) {
                    this.sortStatus = 'client_audit_time';
                    this.page = 1;
                } else if (val == 2) {
                    this.sortStatus = 'expect_end_time';
                    this.page = 1;
                }
                this.fetchData()
            },
            /**
             * 从store中把任务类型获取出来
             */
            getTaskList() {
                let data = {
                    company_id: 1
                }
                this.$store.dispatch('fetchTaskList', qs.stringify(data));
            },
            changePageIndex() {
                this.page += 1;
                this.fetchData(sessionStorage.resourcesStatus);
            },
            changeTabs() {
                this.page = 1;
                this.fetchData(sessionStorage.resourcesStatus)
            },
            /**
             * 获取阶段数据
             */
            fetchData() {
                this.listData = []
                let status = sessionStorage.resourcesStatus
                this.$Loading.start();
                let data = {
                    status: status,
                    search: this.searchInput,
                    order: this.sortStatus,
                    tasktype_id: this.selTaskType,
                    page: this.page,
                    order_by: this.orderBy,
                    project_id: sessionStorage.projectID
                }
                this.$axios.post(this.GLOBAL.baseRouter + 'task/task/stage-page', qs.stringify(data))
                    .then(res => res.data)
                    .then(res => {
                        if (res.err_code == 0) {
                            if (this.page == 1) {
                                this.listData = res.data;
                            } else {
                                this.listData.push.apply(this.listData, res.data);
                            }
                            this.searchInput = ''
                            if (parseInt(this.page) == res.page.count_page && parseInt(this.page) != 1) {
                                this.moreText = '没有更多内容'
                            } else if (parseInt(this.page) == 1 && res.data.length > 0) {
                                this.moreText = ''
                            } else {
                                this.moreText = '暂无内容'
                            }
                            this.$Loading.finish();
                        } else {
                            this.$Loading.error();
                        }
                    })
            },
            /**
             * 获取阶段文件中某个文件的详情
             * 阶段id  必传
             * 阶段  非必传
             */
            fetchFileData(item) {
//      this.isTabModal = true;
//                this.$store.commit('changeComponentID', {taskId: item.task_id, stageId: item.stage_id});

//                this.$store.commit('clearComponentFileURl');
                this.setToName('quality');
                this.$store.commit('changeComponentTaskID', item.task_id);
                this.$store.commit('changeComponentFileURl', item.stage_file.file);
                    // 是否显示编辑信息
                //sessionStorage.AllowEdit=_this.AllowEdit;
                item.id = item.task_id;
                this.setPrimaryMission(item);
                this.setDetailAll(item);
//        this.setUserStatus('member');
                this.$router.push({path: '/project/details'});

//      this.$refs.browsetask.initBrowseTaskPop(taskId,type);//根据ID和类型初始化弹窗
//      this.$refs.browsetask.setEditDisabled(true);//设置弹窗能否编辑


                if (this.status == '1') {
                    sessionStorage.AllowEdit = 'Allow';
                } else {
                    sessionStorage.AllowEdit = 'Other';
                }
            },
            closeTabmodal() {
                this.isTabModal = false;
            },
            /*获取各阶段二级菜单*/
            getTaskTwoMenuList(status) {
                let data = {
                    project_id: sessionStorage.projectID,
                    status: status
                }
                this.$axios.post(this.GLOBAL.baseRouter + 'task/task/stage-tasktype-count', qs.stringify(data)).then(res => res.data).then(res => {
                    if (res.err_code == 0) {
                        this.TwoMenuList = res.data;
                    }
                })
            },
            /*根据选择的二级菜单获取对应的数据*/
            selectTaskType(index, type) {
                this.selectIndex = index;
                this.selTaskType = type;
                this.fetchData();
            }
        }
    }
</script>

<style lang="less" scoped>
    .menauBarContainer {
        .omit {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .card {
            position: relative;
            .showHiden {
                display: none
            }

            &:hover {
                cursor: pointer;
                .showHiden {
                    display: block
                }
            }
        }

        .RcardBlock {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(rgba(0, 0, 0, 0.02), rgb(0, 0, 0, 1));
            width: 100%;
            padding: 10px 0;
            color: #fff;
            font-size: 14px;
            i, span, p {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            /*i{font-style: normal;display: inline-block;font-size: 12px;border: 1px solid #df9b36;color: #df9b36;padding: 0 1px;border-radius: 3px;line-height: 14px}*/
            /*span{display: flex;align-items: center;padding: 0 10px;}*/
            .left, .right {
                display: flex;
                align-items: center;
            }
            .left {
                padding-left: 10px;
                img {
                    width: 40px;
                    height: 40px;
                    border-radius: 100%
                }
                span {
                    margin-left: 10px;
                    width: 60px;
                    max-width: 60px
                }
            }

            .right {
                border-left: 1px dashed rgba(188, 188, 188, 0.64);
                ul {
                    display: flex;
                    li {
                        font-size: 12px;
                        padding: 0 5px;
                        text-align: center;
                        span {
                            color: #df9b36;
                        }
                    }
                }
            }
        }
    }

</style>
