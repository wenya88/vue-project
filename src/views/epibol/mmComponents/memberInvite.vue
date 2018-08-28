<template>
    <Modal v-model="showAddNew" width=720>
        <Tabs value="1" v-model="status" @on-click="changeTabs()">
            <TabPane label="添加研发成员" name="1">
                <transition-group name="memberinfo">
                    <table border=0 style="table-layout:fixed;border-collapse:separate;border-spacing:0px 20px;" key="list">
                        <tr>
                            <td width=260px>邮箱</td>
                            <td width=120px>备注名称</td>
                            <td width=120px>部门</td>
                            <td width=120px>职位</td>
                          
                        </tr>
                        <tr>
                            <td width=280>
                                <Input v-model="inviteData.email" placeholder="邮箱" style="width: 260px" />
                            </td>
                            <td width=140>
                                <Input v-model="inviteData.remark_name" placeholder="备注名称" style="width: 120px" />
                            </td>
                            <td width=140>
                                <Select v-model.number="inviteData.department_id" style="width:120px">
                                    <Option v-for="item in deptList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </td>
                            <td width=140>
                                <Select v-model.number="inviteData.post_id" style="width:120px">
                                    <Option v-for="item in dutyList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </td>
                        </tr>
                        <tr v-for="item in memberinfolist" :key="item.id">
                            <td width=280>
                                <Input v-model="item.account" placeholder="邮箱" style="width: 260px" />
                            </td>
                            <td width=140>
                                <Input v-model="item.name" placeholder="备注名称" style="width: 120px" />
                            </td>
                            <td width=140>
                                <Select v-model.number="inviteData.department_id" style="width:120px">
                                    <Option v-for="item in deptList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </td>
                            <td width=140>
                                <Select v-model.number="inviteData.post_id" style="width:120px">
                                    <Option v-for="item in dutyList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </td>
                            <!-- <td TOP=50%><Button size="small" type="ghost" style="top:50%" @click="delInviteMember(item)">-</Button></td> -->
                        </tr>
                    </table>
                </transition-group>
                <!-- <Button size="small" type="ghost" align="right" @click="addInviteMember">+</Button> -->
            </TabPane>

            <TabPane label="添加非研发成员" name="2">
                <transition-group name="memberinfo">
                    <table border=0 style="table-layout:fixed;border-collapse:separate;border-spacing:0px 20px;" key="list">
                        <tr>
                            <td width=300px>登录用户名</td>
                            <td width=120px colspan='2'>登录密码</td>
                        </tr>
                        <tr>
                            <td width=320>
                                <Input v-model="addData.account" placeholder="登录用户名" style="width: 300px" />
                            </td>
                            <td width=320 colspan='2'>
                                <Input v-model="addData.password" type="password" placeholder="登录密码" style="width: 300px" />
                            </td>
                        </tr>
                        <tr>
                            <td width=300px>备注名</td>
                            <td width=120px>所属部门</td>
                            <td width=120px>职位</td>
                        </tr>
                        <tr>
                            <td width=320>
                                <Input v-model="addData.realname" placeholder="备注名" style="width: 300px" />
                            </td>
                            <td width=160>
                                <Select v-model.number="addData.department_id" style="width:140px">
                                    <Option v-for="item in deptList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </td>
                            <td width=160>
                                <Select v-model.number="addData.post_id" style="width:140px">
                                    <Option v-for="item in dutyList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </td>
                        </tr>
                        <!-- <tr>
                            <td width=300px>手机</td>
                            <td width=120px colspan='2'>邮箱</td>
                        </tr>
                        <tr>
                            <td width=320>
                                <Input v-model="addData.phone" placeholder="手机" style="width: 300px" />
                            </td>
                            <td width=320 colspan='2'>
                                <Input v-model="addData.email" placeholder="邮箱" style="width: 300px" />
                            </td>
                        </tr> -->
                    </table>
                </transition-group>
                <!-- <Button size="small" type="ghost" align="right" @click="addInteriorMember">+</Button> -->
            </TabPane>
        </Tabs>
        <div slot="footer">
            <Button size="large" type="primary" @click="inviteMember(inviteData)" v-if="invite">邀请</Button>
            <Button size="large" type="primary" @click="addMember(addData)" v-else>添加</Button>
        </div>
    </Modal>
</template>

<script>
var qs = require('querystring');
var jsencrypt = require('jsencrypt');
var md5 = require('md5');
import { mapGetters } from 'vuex'
export default {
    name: 'memberinvite',
    props: {
        // inviteData: {
        //     type: Object,
        //     default: ''
        // },
        // addData: {
        //     type: Object,
        //     default: ''
        // }
    },
    data() {
        return {
            num: 0,
            status: '1',
            invite: true,
            showAddNew: false,
            newToDoItemValue: "",
            initmemberinfo: {
                num: 0,
                account: "",
                name: "",
                profession: "",
            },
            memberinfolist: [],
            initinteriormemberinfo: {
                num: 0,
                account: "",
                password: "",
                name: "",
                profession: "",
            },
            interiormemberinfolist: [],
            inviteData: {
                company_id: 1,
                email: '',
                remark_name: '',
                department_id: '',
                post_id: ''
            },
            addData: {
                company_id: 1,
                remark_name: '',
                password: '',
                email: '',
                phone: '',
                department_id: '',
                post_id: ''
            }
        }
    },
    computed: {
        ...mapGetters({
            deptList: 'getDeptList',
            dutyList: 'getDutyList'
        })
    },
    methods: {
        /**
         * 获取加密密码的密钥
         */
        fetchKey() {
            // this.$axios.get(authLogin+'/get-public-secret-key')
            this.$axios.get(this.GLOBAL.baseRouter+'system/login/get-public-secret-key')
            .then(res => res.data)
            .then(res => {
                if(res.err_code == 0) {
                    this.publicKey = res.public_key
                }
            })
        },
        /**
         * tab切换，显示当前tab
         */
        changeTabs() {
            if (this.status == '1') {
                this.invite = true;
            } else if (this.status == '2') {
                this.invite = false;
            }
        },
        /**
         * 部门列表
        */
        deptListData() {
            let data = {
                company_id: 1
            }
            this.$store.dispatch('fetchDeptList', qs.stringify(data));
        },
        /**
         * 职位列表
        */
        dutyListData() {
            let data = {
                company_id: 1
            }
            this.$store.dispatch('fetchDutyList', qs.stringify(data));
        },
        /**
         * 邀请成员
         */
        inviteMember(inviteData) {
            let data = inviteData;
            this.$axios.post(this.GLOBAL.baseRouter + 'task/company/member-invate', qs.stringify(data))
                .then(res => res.data)
                .then(res => {
                    if (res.err_code == 0) {
                        this.$Message.success('邀请成员成功');
                        this.inviteData.email = '';
                        this.inviteData.remark_name = '';
                        this.inviteData.department_id = '';
                        this.inviteData.post_id = '';
                        this.showAddNew = false;
                        const content = location.host+'/#/login?invate_code='+res.invate_code
                        this.$Modal.info({
                            title: '邀请链接',
                            content: content
                        });
                    } else {
                        this.$Message.error(res.err_message);
                    }
                    // console.log(res)
                })
            // console.log(inviteData);
        },
        /**
         * 新增辅助成员
         */
        addMember(addData) {
            this.$axios.get(this.GLOBAL.baseRouter+'system/login/get-public-secret-key')
            .then(res => res.data)
            .then(res => {
                if(res.err_code == 0) {
                    let encrypt = new JSEncrypt();
                    encrypt.setPublicKey(res.public_key);
                    addData.password = encrypt.encrypt(md5(md5(addData.password)));
                    let data = addData;
                    this.$axios.post(this.GLOBAL.baseRouter + 'task/company/member-add', qs.stringify(data))
                        .then(res => res.data)
                        .then(res => {
                            // console.log(res)
                            if(res.err_code == 0) {
                                this.$Message.success('添加辅助成员成功');
                                this.addData.remark_name = '';
                                this.addData.password = '';
                                this.addData.email = '';
                                this.addData.phone = '';
                                this.addData.department_id = '';
                                this.addData.post_id = '';
                                this.showAddNew = false;
                            } else if(res.err_code == 10044) {
                                this.$Message.error('电子邮箱已存在');
                            }
                        })
                }
            })
        },
        /**
         * 增加一行艺术家用户信息
         */
        addInviteMember() {
            this.num++;
            var info = {
                id: this.num,
                account: "",
                name: "",
                profession: "",
            };
            this.memberinfolist.push(info);
            console.log(info);
        },
        /**
         * 增加一行内部用户信息
         */
        addInteriorMember() {
            this.num++;
            var info = {
                id: this.num,
                account: "",
                name: "",
                password: "",
                profession: "",
            };
            this.interiormemberinfolist.push(info);
            console.log(info);
        },
        /**
         * 删除一行艺术家用户信息
         */
        delInviteMember(info) {
            //需要移动到工具函数中
            Array.prototype.indexOf = function(val) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == val) return i;
                }
                return -1;
            };
            //需要移动到工具函数中
            Array.prototype.removeOf = function(val) {
                var index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
            this.memberinfolist.removeOf(info);
            console.log(info);
        },
        /**
         * 删除一行内部用户信息
         */
        delInteriorMember(info) {
            this.interiormemberinfolist.removeOf(info);
            console.log(info);
        },
        /**
         * 外部显示弹窗接口
         */
        isShowPage(isShow) {
            if (isShow.constructor == Boolean) {
                console.log(isShow);
                this.showAddNew = isShow;
            }
            else {
                console.log(false);
                this.showAddNew = false;
            }
        },
        /**
         * 向服务器发送艺术家申请列表
         */
        sendMemberinfoList() {
            if (this.memberinfolist.length < 0) {
                this.memberinfolist.unshift(this.initmemberinfo);
                /*
                axios.post('/user', {
                    firstName: 'Fred',
                    lastName: 'Flintstone'
                })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
                */
            }
            else {
                /*
                axios.post('/user', {
                    firstName: 'Fred',
                    lastName: 'Flintstone'
                })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
                */
            }
        },
        /**
         * 向服务器发送内部账号申请列表
         */
        sendInteriorMemberinfoList() {

        },
    }
}
</script>
<style scoped>
.ivu-tabs {
    padding-bottom: 190px;
}
</style>
