<template>
    <div>
        <main-native>
            <div class="main-header-style iconfont"><i v-if="!islink"></i>{{this.$route.meta.title}}</div>
        </main-native>
        <div class="projectMemberContainer">
            <div class="member">
                <p class="title" v-if="memberArray">已加入项目组(<span> {{ memberArray.length }} </span>)</p>
                <ul class="cardList">
                    <template v-if="memberArray">
                        <li class="cardBox" v-for="(item,index) in memberArray" :key="index">
                            <div class="card">
                                <img  :src="item.headimage ? item.headimage : imgHead" alt="头像">
                                <p>{{item.remark_name}}</p>
                            </div>
                            <div class="job">
                                <!--<span>{{item.department_name || 'Null'}}</span>-->
                                <span>{{item.job || 'Null'}}</span>
                            </div>
                            <i class="deleteI" @click="removeShow(item.id)"></i>
                        </li>
                    </template>
                    <Spin v-if="!memberArray" size="large" fix>
                        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                        <div>加载中...</div>
                    </Spin>
                </ul>
                <Modal
                        v-model="removeModal"
                        title="该成员移除项目？"
                        width="380"
                        @on-ok="removeCard">
                    <p style="color: #FF6600" >说明：如果该成员负责相关任务，移除后任务将暂停，任务执行人将空缺。</p>
                </Modal>
            </div>
            <div class="whole">
                <p class="title">公司成员</p>
                <template v-if="items">
                    <div class="departmentList" v-for="(item,index) in items" :key="index">
                        <p class="wholeTitle">
                            <span>{{item.department_name}}</span>
                            <i class="ivu-icon" @click="addShow(item.members)"></i>
                        </p>
                        <div class="persionList">
                            <ul>
                                <li v-for="(member,i) in item.members" :key="i" :class="{'activeSty':member.is_join}" @click="onCard(member.member_id)">
                                    <div>
                                        <img :src="member.headimage ? member.headimage : imgHead"/>
                                        <span> {{ member.remark_name }} </span>
                                    </div>
                                    <i class="ivu-icon"></i>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Modal
                            v-model="addModal"
                            title="移入项目"
                            width="380"
                            @on-ok="addGroup">
                        <p style="color: #FF6600" >说明：部门成员全部加入项目？</p>
                    </Modal>
                </template>
            </div>
        </div>
    </div>


</template>

<script>
    import qs from 'querystring'
    import mainNative from '../../../main-components/mainNative.vue';
    export default {
        props:{
            'islink':{
                type:Boolean,
                default:false
            }
        },
        mounted() {
            this.getItems();
            this.getMemberArray();
            this.autoH();
        },
        data() {
            return {
                imgHead:require('./image/timg.jpg'),
                projectID: sessionStorage.getItem('projectID'),
                beDeletedId: null,
                beAddId: null,
                removeModal: false,
                addModal: false,
                memberArray: null,
                items: null
            }
        },
        methods: {
            // 所有成员
            getItems() {
                this._ajax('task/company/get-members', {project_id: this.projectID})
                    .then(({data}) => {
                        if (data.err_code === 0) {
                            this.items = data.data
                            console.log(11, this.items)
                        }
                    })
            },
            // 已经添加的成员
            getMemberArray() {
                this._ajax('task/company/joined-members', {project_id: this.projectID})
                    .then(({data}) => {
                        if (data.err_code === 0) {
                            this.memberArray = data.data
                        }
                    })
            },
            /* 删除弹窗*/
            removeShow(index) {
                this.removeModal = true;
                this.beDeletedId = index;
            },
            /* 删除卡片*/
            removeCard() {
                this._ajax('task/company/remove-member', {id: this.beDeletedId})
                    .then(({data}) => {
                        if (data.err_code === 0) {
                            this._messageSuccess(data.msg);
                            this.getMemberArray();
                            this.getItems();
                        } else {
                            this._messageError(data.msg)
                        }
                    })
            },
            // 添加
            onCard(member_id) {
                this._ajax('task/company/join-the-project', {project_id: this.projectID, member_ids: member_id})
                    .then(({data}) => {
                        if (data.err_code === 0) {
                            this._messageSuccess(data.msg);
                            this.getMemberArray();
                            this.getItems();
                        } else {
                            this._messageError(data.msg)
                        }
                    })
            },
            addShow(members) {
                this.addModal = true;
                let ids = [];
                members.map((item, index) => {
                    if (!item.is_join) {
                        ids.push(item.member_id);
                    }
                });
                this.beAddId = ids.join(',');
            },
            addGroup() {
                if (!this.beAddId) {
                    this._messageError('成员不能为空')
                }
                this._ajax('task/company/join-the-project', {project_id: this.projectID, member_ids: this.beAddId})
                    .then(({data}) => {
                        if (data.err_code === 0) {
                            this._messageSuccess(data.msg);
                            this.getMemberArray();
                            this.getItems();
                        } else {
                            this._messageError(data.msg)
                        }
                    })
            },
            _ajax(url, data) {
                return this.$axios.post(this.GLOBAL.baseRouter + url, qs.stringify(data))
            },
            _messageSuccess(data) {
                this.$Message.success(data)
            },
            _messageError(data) {
                this.$Message.error(data)
            },
            // 设置行高
            autoH(){
                $('.projectMemberContainer').height($(window).height()-124)
            },
        },
        computed: {},
        components: {
            mainNative
        },
        watch:{
            '$route'(){
                this.getItems();
                this.getMemberArray();
            }
        }
    }
</script>

<style lang="less" scoped>
    @black: #d9d9d9;
    @gray: #999;
    @green:#c4f0e9;
    @ddd: #eeeeee;
    @green2:#44ccc0;

    .projectMemberContainer {
        display: flex;
        justify-content: space-between;
        overflow: hidden;
        padding: 30px 0;
        .member, .whole {
            background: #fff;padding: 30px;overflow: hidden;
            .title {
                font-size: 16px;
                color: @gray;
                span{color: @green}
            }
        }
        .member {
            width: 35%;
            .cardList {
                margin-top: 15px;
                /*display: flex;*/
                /*justify-content: space-between;*/
                /*flex-wrap: wrap;*/
                padding: 2px;
                height: 100%;
                overflow: auto;
                .demo-spin-icon-load {
                    animation: ani-demo-spin 1s linear infinite;
                }
                .cardBox {
                    float: left;
                    position: relative;
                    width: 30%;
                    /*margin-bottom: 20px;*/
                    border-radius: 5px;
                    overflow: hidden;
                    margin: 0 8px 20px 8px;
                    min-width: 132px;
                    .card {
                        background: url("./image/autherBG.png") no-repeat;
                        background-size: 100% 100%;
                        text-align: center;
                        padding: 30px 0;
                        p {
                            font-size: 14px;
                            color: #fff;
                        }
                        img {
                            display: inline-block;
                            width: 50px;
                            height: 50px;
                            border-radius: 100%;
                            background: #ccc;
                            overflow: hidden;
                        }


                        .sign {
                            display: none;
                            position: absolute;
                            top: 6px;
                            right: 6px;
                            padding: 2px;
                            font-size: 12px;
                            color: #fff;
                            background: red;
                            cursor: pointer;
                        }
                        &:hover {
                            transform: scale(1.05);
                            transition: transform .3s;

                            .sign {
                                display: block;
                            }
                        }
                    }
                    .job{
                        border-radius: 5px;text-align: center;padding: 20px 0;border-left: 1px solid @ddd;border-right: 1px solid @ddd;border-bottom: 1px solid @ddd;
                        span{
                            display: inline-block;border: 1px solid orange;color: orange;padding: 2px 5px;font-size: 14px;border-radius: 3px;
                        }
                    }
                    .deleteI{
                        position: absolute;
                        top: 0;
                        right: 0;
                        display: inline-block;
                        width: 30px;
                        height: 30px;
                        background: url("./image/delectIco.png") no-repeat;
                        background-position: 7px -44px;
                    }
                    &:hover{
                        cursor: pointer;
                        .deleteI{
                            background: url("./image/delectIco.png") no-repeat rgba(0,0,0,.3);
                            background-position: 7px 7px;
                        }
                    }
                }
                &::after {
                    content: ' ';
                    display: block;
                    clear: both;
                }

            }
        }
        .whole {
            width: 63%;
            .departmentList{
                margin-top: 15px;
                height: 100%;
                overflow: auto;
                .wholeTitle {
                    display: flex;
                    justify-content: space-between;
                    padding: 4px 25px;
                    font-size: 16px;
                    background: @green;
                    color: @green2;
                    padding: 18px 20px;
                    border-radius: 5px;
                    min-width: 140px;
                    i{
                        display: inline-block;font-style: normal;text-align: center;cursor: pointer;
                        width: 20px;height: 20px;line-height: 18px;border-radius: 100%;border: 1px solid @green2;
                        &:after{content: "\F217";color: @green2;font-size: 15px;}
                    }
                }
                .persionList{
                    ul{
                        display: flex;flex-wrap: wrap;padding: 0 6px;
                        li{
                            display: flex;justify-content: space-between;align-items: center;border: 1px solid @ddd;padding: 10px;min-width: 143px;margin: 30px 20px 0 20px;border-radius: 5px;cursor: pointer;
                            div{
                                display: flex;justify-content: center;align-items: center;margin-right: 20px;
                                img{
                                    display: inline-block;width: 28px;height: 28px;border-radius: 100%;background: #ccc;
                                }
                                span{margin-left:5px}
                            }

                            i{
                                display: inline-block;font-style: normal;text-align: center;cursor: pointer;
                                width: 20px;height: 20px;line-height: 18px;border-radius: 100%;border: 1px solid @green2;
                                &:after{content: "\F217";color: @green2;font-size: 15px;}
                            }
                            &.activeSty{
                                border: 1px solid @green2;background: #bff7ee;
                                i{
                                    border: none;
                                    &:after{content: "\F3FF";color: @green2;font-size: 22px;}
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
