<template>
    <main class="projectMemberContainer">
        <section class="member">
            <p class="title" v-if="memberArray">已加入项目组（<span style="color: red">{{memberArray.length}}</span>）</p>
            <ul class="cardList">
                <template v-if="memberArray">
                    <li class="cardBox" v-for="(item,index) in memberArray" :key="index">
                        <div class="card">
                            <Icon @click.native="removeShow(item.id)" class="sign" type="close-round"></Icon>
                            <img  :src="item.headimage ? item.headimage : imgHead" alt="头像">
                            <p>{{item.remark_name}}</p>
                            <div style="color: #a1a1a1">{{item.department_name}}</div>
                            <p>{{item.job}}</p>
                        </div>
                    </li>
                </template>
                <Spin v-if="!memberArray" size="large" fix>
                    <Icon type="load-c" size=18        class="demo-spin-icon-load"></Icon>
                    <div>加载中...</div>
                </Spin>
            </ul>
            <Modal
                    class="removeCard"
                    title="该成员移除项目？"
                    v-model="removeModal"
                    width="300"
                    @on-ok="removeCard"
                    :closable="false">
                <div style="color: #FF6600">
                    说明：如果该成员负责相关任务，移除后任务将暂停，任务执行人将空缺
                </div>
            </Modal>
        </section>
        <section class="whole">
            <p class="title">公司成员</p>
            <template v-if="items">
                <ul v-for="(item,index) in items" :key="index">
                    <li class="wholeTitle">
                        <span>{{item.department_name}}</span>
                        <Icon style="cursor: pointer" @click.native="addShow(item.members)" type="plus-round"></Icon>
                    </li>
                    <div class="wholeList">
                        <p v-for="(member,i) in item.members" :key="i">
                        <span v-if="!member.is_join" @click="onCard(member.member_id)">
                            <img :src="member.headimage ? member.headimage : imgHead" alt="">{{member.remark_name}}
                            <Icon class="icon" type="plus-round"></Icon></span>
                            <span v-else @click="onCard(member.member_id)" class="pitchOn">
                                <img :src="member.headimage ? member.headimage : imgHead" alt="">{{member.remark_name}}
                                <Icon class="icon" type="checkmark-circled"></Icon>
                            </span>
                        </p>
                    </div>
                </ul>
            </template>
            <Modal
                    class="removeCard"
                    v-model="addModal"
                    width="200"
                    @on-ok="addGroup"
                    :closable="false">
                <div style="color: #FF6600">
                    部门成员全部加入项目？
                </div>
            </Modal>
        </section>
    </main>
</template>

<script>
    import qs from 'querystring'

    export default {
        created() {

        },
        mounted() {
            this.getItems()
            this.getMemberArray()
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
            }
        },
        computed: {},
        components: {}
    }
</script>

<style lang="less" scoped>
    @black: black;
    @gray: #F2F2F2;

    .projectMemberContainer {
        display: flex;
        height: 100%;
        .member, .whole {
            flex: 1;
            .title {
                padding: 30px 0 30px 35px;
                font-size: 16px;
                color: @black;
                font-weight: 600;
            }
        }
        .member {
            border-right: 1px solid #e4e4e4;
            .cardList {
                position: relative;
                height: 100%;
                .demo-spin-icon-load {
                    animation: ani-demo-spin 1s linear infinite;
                }
                .cardBox {
                    float: left;
                    width: 25%;
                    .card {
                        position: relative;
                        height: 200px;
                        padding: 25px 0;
                        margin: 10px 20px 0 0px;
                        text-align: center;
                        background: @gray;
                        border-radius: 4px;
                        box-shadow: 2px 2px 4px 0 #999;
                        p {
                            font-size: 14px;
                            color: @black;
                        }
                        img {
                            width: 85px;
                            height: 85px;
                            box-shadow: 0 0 2px 0 @black;
                            border-radius: 50%;
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
                }
                &::after {
                    content: ' ';
                    display: block;
                    clear: both;
                }

            }
        }
        .whole {
            .wholeTitle {
                display: flex;
                margin: 0 10px;
                padding: 4px 25px;
                font-size: 16px;
                font-weight: 600;
                color: @black;
                background: @gray;
                border-right: 4px;
                justify-content: space-between;
                align-items: center;
            }
            .wholeList {
                display: flex;
                padding: 0 35px 35px 35px;
                flex-wrap: wrap;
                p {
                    width: 25%;
                    margin: 15px 0;
                    text-align: center;
                    align-items: center;
                    img {
                        position: absolute;
                        top: 50%;
                        left: 4px;
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        transform: translateY(-50%);
                    }
                    .pitchOn {
                        background-color: #18d96c;
                        box-shadow: 2px 2px 4px 0 #434343;
                        color: #fff;
                        .icon {
                            color: #60ff11;
                        }
                    }
                    span {
                        position: relative;
                        display: block;
                        width: 66%;
                        min-width: 100px;
                        height: 40px;
                        line-height: 40px;
                        color: #999;
                        border-radius: 20px;
                        box-shadow: 0 0 2px 0 #999;
                        cursor: pointer;
                        .icon {
                            position: absolute;
                            top: 50%;
                            right: 14px;
                            font-size: 14px;
                            transform: translateY(-50%);
                        }
                        &:active {
                            transform: translate3d(1px, 1px, 0);
                            opacity: .9;
                        }
                    }
                }
            }
        }
    }
</style>
