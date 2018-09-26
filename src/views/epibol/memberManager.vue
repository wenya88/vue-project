<template>
    <div class="membermanager">
        <main-native>
            <div class="main-header-style iconfont">
                <ul class="setMenuList">
                    <li v-for="(item,index) in tabsInfo.tabs"   :key="index" :class="{'checked':index == tabsInfo.tabIndex}" @click="tabsInfo.tabIndex = index">
                        {{ item.tab }}
                    </li>
                </ul>
            </div>
        </main-native>

        <div class="search" v-show="tabsInfo.tabIndex == 0">
            <!-- <input class="search-input" type="search" placeholder="备注/手机名/邮箱">
            <Icon @click="searchList" type="search"></Icon> -->
            <Button class="addBtn"  size="large" icon="person-add" @click.native="clickInviteMember">添加成员</Button>
        </div>

        <div style="margin-top: 30px">
            <template v-if="tabsInfo.tabIndex == 0">
                <Layout>
                    <Sider>
                        <membertype :title="title" :number="number" :deptList='deptList' :dutyList='dutyList' @openDept="deptData" @openDuty="dutyData" @deptEdit="editDept" @deptDel="delDept" @dutyDel="delDuty" @dutyEdit="editDuty">
                            <div slot="addDept">
                                <div class="addDept" @click="addDept()">
                                    <!-- <Icon type="plus" color="#31BB9F" size="16"></Icon>增加部门</div> -->
                                    <i class="icon iconfont icon-jia" ></i></div>
                            </div>
                            <div slot="addDuty">
                                <div class="addDept" @click="addDuty()">
                                    <i class="icon iconfont icon-jia" ></i></div>
                                <!-- <Icon type="plus" color="#31BB9F" size="16"></Icon>增加职能</div> -->
                            </div>
                        </membertype>
                    </Sider>
                    <Layout>
                        <Content>
                            <memberlist ref="list" @choiseRow="selectMember" :deptList='deptList'></memberlist>
                            <memberinvite @test="deptData()" ref="invite">
                            </memberinvite>
                            <membermessage
                                    ref="message"
                                    :param="param"
                                    @cancel='close()'
                                    @revised='editMember(param.id,param.remark_name,param.department_id,param.post_id)'
                                    @removed='delMember(param.id)'
                                    :editStatus="true"></membermessage>
                        </Content>
                    </Layout>
                </Layout>
            </template>

            <template  v-if="tabsInfo.tabIndex == 1">
                <Layout>
                    <Sider>
                        <auth-type :title="title" :number="number" :postList="postList" @openAuth="authData"></auth-type>
                        <!-- <i class="icon iconfont icon-jia" ></i> -->
                    </Sider>
                    <Layout>
                        <Content>
                            <auth-message ref="authMesg" :tabs="authList"></auth-message>
                        </Content>
                    </Layout>
                </Layout>
            </template>
        </div>

        <Modal v-model="editModel" :title="deptStatus == 'add' ? '新增部门' : '编辑部门'" @on-ok="ok(deptStatus)" @on-cancel="cancel">
            <Input v-model="deptName" placeholder="请输入部门名称" style="width: 300px"></Input>
        </Modal>
        <Modal v-model="delModal" title="确认删除部门？" @on-ok="delOk" @on-cancel="cancel">
            <p>删除部门后成员将移入“未分配部门”</p>
        </Modal>
        <Modal v-model="dutyModel" :title="dutyStatus == 'add' ? '新增职能' : '编辑职能'" @on-ok="okDuty(dutyStatus)" @on-cancel="cancel">
            <Input v-model="dutyName" placeholder="请输入职能名称" style="width: 300px"></Input>
        </Modal>
        <Modal v-model="delDutyModal" title="确认删除职能？" @on-ok="delDutyOk" @on-cancel="cancel">
            <p>删除职能后成员将移入“自定义角色”</p>
        </Modal>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
var qs = require('querystring');
import { mapGetters } from 'vuex'
import memberlist from './mmComponents/memberList.vue';
import membertype from './mmComponents/memberType.vue';
// import membercontroller from './mmComponents/memberController.vue';
import memberinvite from './mmComponents/memberInvite.vue';
import membermessage from './mmComponents/memberMessage.vue';
import Cookie from 'js-cookie'

import authType from './mmComponents/authType.vue';
import authMessage from './mmComponents/authMessage.vue';
import {mapState} from 'vuex'
import mainNative from '../main-components/mainNative.vue';
export default {
    // data() {
    //     ownMemberTypes:[],
    //     //ownMemberList:[]
    // },
    components: {
        memberlist,
        membertype,
        // membercontroller,
        memberinvite,
        membermessage,
        authType,
        authMessage,
        mainNative
    },
    data() {
        return {
            tabsType: 'member',
            num: 1,
            showAddNewTodo: false,
            newToDoItemValue: '',
            memberinfolist: [],
            interiormemberinfolist: [],
            editModel: false,
            deptStatus: 'add',
            deptName: '',
            deptId: 0,
            delModal: false,
            delDutyModal: false,
            dutyModel: false,
            dutyStatus: 'add',
            dutyId: 0,
            dutyName: '',
            param: {},
            title: '',
            number: '',
            tabsInfo:{
                tabs:[
                    {tab:'成员管理',name:'member'},
                    {tab:'权限设置',name:'auth'}
                ],
                tabIndex:0
            }
        };
    },
    created() {

        let company = JSON.parse(Cookies.get('company'))
        // console.log(typeof company.member_id)
        this.title = company.company_name;
        this.number = company.member_count+''
    },
    mounted() {
        this.deptListData();
        this.dutyListData();
        this.authListData();
        // console.log(112,this.deptList)

    },
    computed: {
        ...mapState({
            memberMgt(data){
                return data.app.memberMgt
            },
            roleMgt(data){
                return data.app.roleMgt
            }
        }),
        ...mapGetters({
            deptList: 'getDeptList',
            dutyList: 'getDutyList',
            postList: 'getPostList',
            authList: 'getAuthList'
        }),
    },
    updated() {
        this.initialLoad();
        // this.deptListData();
        // this.dutyListData();
        // this.number+=1

    },
    methods: {
        searchList(){
            // alert('1111')
        },
        initialLoad(){
            if(this.postList.length>0){
                // console.log("/////"+this.postList)
                this.authData(0, 1, this.postList)
            }
        },
        updateDate(memberType) {
            this.$emit('init');
        },

        /**
         * 获取部门列表
         */
        deptListData() {
            let data = {
                company_id: 1
            }
            this.$store.dispatch('fetchDeptList', qs.stringify(data));
        },
        /**
         * 获取职位列表
         */
        dutyListData() {
            let data = {
                company_id: 1
            }
            this.$store.dispatch('fetchDutyList', qs.stringify(data));
        },
        /**
         * 获取权限列表
         */
        authListData() {
            let data = {}
            this.$store.dispatch('fetchAuthList', qs.stringify(data));
        },
        /**
         * 根据成员部门获取列表
         */
        deptData(index, comId, deptId) {
            this.$refs.list.deptData(comId, deptId);
            sessionStorage.memberStyle = 'dept';
            sessionStorage.comId = comId;
            sessionStorage.deptId = deptId;
            // console.log(index,comId,deptId)
        },
        /**
         * 切换成员类型数据页面消息
         */
        dutyData(index, comId, dutyId) {
            this.$refs.list.dutyData(comId, dutyId);
            sessionStorage.memberStyle = 'duty';
            sessionStorage.comId = comId;
            sessionStorage.dutyId = dutyId;
        },
        // 切换职位类型获取对应数据
        authData(index, postId, postList) {
            // console.log(index, postId, postList)
            sessionStorage.postId = postId;
            this.$bus.emit("changeAuth",postId,postList)
        },
        addDept() {
            this.deptStatus = 'add';
            this.editModel = true;
            // alert(111)
        },
        editDept(id, name) {
            this.deptStatus = 'edit';
            this.editModel = true;
            this.deptId = id;
            this.deptName = name;
        },
        ok(name) {
            if (name == 'add') {
                let data = {
                    company_id: 1,
                    name: this.deptName
                }
                this.$axios.post(this.GLOBAL.baseRouter + 'task/department/add', qs.stringify(data))
                    .then(res => res.data)
                    .then(res => {
                        if (res.err_code == 0) {
                            this.deptListData();
                            this.deptName = '';
                            this.$Message.success('创建部门成功');
                        } else {
                            this.$Message.error('创建部门失败');
                        }
                    })
            } else if (name == 'edit') {
                let data = {
                    id: this.deptId,
                    name: this.deptName
                }
                this.$axios.post(this.GLOBAL.baseRouter + 'task/department/update', qs.stringify(data))
                    .then(res => res.data)
                    .then(res => {
                        if (res.err_code == 0) {
                            this.deptListData();
                            this.deptName = '';
                            this.$Message.success('修改部门名称成功');
                        } else {
                            this.$Message.error('修改部门名称失败');
                        }
                    })
            }
            // this.$Message.info('Clicked ok');
        },
        cancel() {
            this.deptName = '';
        },
        /**
         * 删除部门
         */
        delDept(id) {
            this.delModal = true;
            this.deptId = id;
        },
        delOk() {
            let data = {
                id: this.deptId
            }
            this.$axios.post(this.GLOBAL.baseRouter + 'task/department/delete', qs.stringify(data))
                .then(res => res.data)
                .then(res => {
                    if (res.err_code == 0) {
                        this.deptListData();
                        this.$Message.success('删除部门成功');
                        window.location.reload();

                    } else {
                        this.$Message.error('删除部门失败');
                    }
                })
        },
        delDuty(id) {
            this.delDutyModal = true;
            this.dutyId = id;
        },
        delDutyOk() {
            let data = {
                id: this.dutyId
            }
            this.$axios.post(this.GLOBAL.baseRouter + 'task/post/delete', qs.stringify(data))
                .then(res => res.data)
                .then(res => {
                    if (res.err_code == 0) {
                        this.dutyListData();
                        this.$Message.success('删除职能成功');
                    } else {
                        this.$Message.error('删除职能失败');
                    }
                })
        },
        addDuty() {
            this.dutyStatus = 'add';
            this.dutyModel = true;

        },
        editDuty(id, name) {
            this.dutyStatus = 'edit';
            this.dutyModel = true;
            this.dutyId = id;
            this.dutyName = name;
        },
        okDuty(name) {
            if (name == 'add') {
                let data = {
                    company_id: 1,
                    name: this.dutyName
                }

                this.$axios.post(this.GLOBAL.baseRouter + 'task/post/add', qs.stringify(data))
                    .then(res => res.data)
                    .then(res => {
                        if (res.err_code == 0) {
                            this.dutyListData();
                            // this.deptListData();
                            this.dutyName = '';
                            this.$Message.success('创建职能成功');

                        } else {
                            this.$Message.error('创建职能失败');
                        }
                    })
            } else if (name == 'edit') {
                let data = {
                    id: this.dutyId,
                    name: this.dutyName
                }
                this.$axios.post(this.GLOBAL.baseRouter + 'task/post/update', qs.stringify(data))
                    .then(res => res.data)
                    .then(res => {
                        if (res.err_code == 0) {
                            this.dutyListData();
                            this.$Message.success('修改职能名称成功');
                        } else {
                            this.$Message.error('修改职能名称失败');
                        }
                    })
            }
            // this.$Message.info('Clicked ok');

        },
        /**
         * 暂时，会移动到用户控制组件中
         */
        clickInviteMember() {
            //this.showAddNewTodo = true;
            this.$refs.invite.isShowPage(true);
            // window.location.reload();
        },
        selectMember(index) {
            // alert(111111111);
            let data = {
                id: index.id
            }

            this.$axios.post(this.GLOBAL.baseRouter + 'task/company/member-info', qs.stringify(data))
                .then(res => res.data)
                .then(res => {
                    if (res.err_code == 0) {
                        this.$refs.message.isShowPage(true);
                        this.param = res;
                        this.param.post_id = Number(this.param.post_id);
                        this.param.department_id = Number(this.param.department_id);
                        // console.log('param',this.param)
                    }
                })
        },
        close() {},
        /**
         * 修改成员信息
         * id 成员id
         * rname 成员备注名
         * did 部门id
         * pid 职位id
         */
        editMember(id,rname,did,pid) {
            let data = {
                id: id,
                remark_name: rname,
                department_id: did,
                post_id: pid
            }
            this.$axios.post(this.GLOBAL.baseRouter+'task/company/member-update', qs.stringify(data))
            .then(res => res.data)
            .then(res => {
                if(res.err_code == 0) {
                    this.$Message.success('成功修改该成员信息');
                    // console.log(111)
                    //刷新当前表格
                    if(sessionStorage.memberStyle == 'dept') {
                        this.$refs.list.deptData(sessionStorage.comId, sessionStorage.deptId);
                        this.deptData()

                    } else if(sessionStorage.memberStyle == 'duty') {
                        this.$refs.list.dutyData(sessionStorage.comId, sessionStorage.dutyId);
                        this.dutyData()
                    }
                    //关闭弹窗
                }
                if(sessionStorage.memberStyle == 'dept'){

                    this.deptListData();
                     this.$refs.list.deptData(sessionStorage.comId, sessionStorage.deptId);
                }else if(sessionStorage.memberStyle == 'duty'){
                    this.dutyListData();
                    this.$refs.list.dutyData(sessionStorage.comId, sessionStorage.dutyId);

                }
                    this.$refs.message.isShowPage(false);

            })
        },
        /**
         * 移除成员
         */
        delMember(id) {
            this.$Modal.confirm({
                title: '移除成员',
                content: '<p>是否确定永久的移除改成员？</p>',
                okText: '是',
                cancelText: '否',
                onOk: () => {
                    let data = {
                        id: id
                    }
                    this.$axios.post(this.GLOBAL.baseRouter+'task/company/member-delete', qs.stringify(data))
                    .then(res => res.data)
                    .then(res => {
                        if(res.err_code == 0) {
                            this.deptListData();
                            this.dutyListData();


                            this.$Message.success('成功移除该成员');
                            //刷新当前表格
                            //  window.location.reload();
                            if(sessionStorage.memberStyle == 'dept') {
                                this.$refs.list.deptData(sessionStorage.comId, sessionStorage.deptId);

                            } else if(sessionStorage.memberStyle == 'duty') {
                                this.$refs.list.dutyData(sessionStorage.comId, sessionStorage.dutyId);
                            }
                            //关闭弹窗
                            this.$refs.message.isShowPage(false);

                        }
                                let company = JSON.parse(Cookies.get('company'))
                                // console.log(company.member_count)
                                // this.title = company.company_name;
                            // console.log((this.deptList[0]))
                            this.number=String(company.member_count-1)

                    })
                }
            });
        },
        /**
         * 增加一行艺术家用户信息
         */
        addInviteMember() {
            var info = {
                id: this.num,
                account: "account" + this.num,
                name: "name" + this.num,
                profession: "profession" + this.num
            };
            this.num++;
            this.memberinfolist.push(info);
            // console.log(info);
        },
        /**
         * 增加一行内部用户信息
         */
        addInteriorMember() {
            var info = {
                id: this.num,
                account: "account" + this.num,
                name: "name" + this.num,
                profession: "profession" + this.num
            };
            this.interiormemberinfolist.push(info);
            // console.log(info);
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
            // console.log(info);
        },
        /**
         * 删除一行内部用户信息
         */
        delInteriorMember(info) {
            // console.log(info);
        }
    }
}
</script>

<style scoped lang="less">
.ivu-layout-content{
    background: #EEF1F2!important;
    padding-left: 20px;
}
.ivu-menu-light{
    background: #EEF1F2;
}
.ivu-tabs{
    // margin-left: 20px;
    background: #EEF1F2;

}
.ivu-layout-sider{
    width: 362px!important;
    max-width: 362px!important;
    flex:0 0 362px!important;
}
.ivu-layout-sider,
.ivu-layout-header {
    background: #fff;
}
.addBtn {
    /*position: absolute;*/
    /*right: 18px;*/
    /*z-index: 1;*/
    // margin-top: 15px;
    background: #fff;
    color: #31BB9F;
    border: 0;
}
.icon-jia{
    color: #FCC44A;
    font-size: 24px;
}
.addDept {
    color: #31BB9F;
    font-size: 14px;
    line-height: 50px;
    padding: 0 20px;
    cursor: pointer;
}
.search{
    text-align: right;
    margin-top: 20px;
    /*padding-bottom: 50px;*/
    /*width: 300px;*/
    .search-input{
        padding-left:10px;
        font-size: 14px;
        height: 40px;
        background: #fff;
        border: 0;
        line-height: 40px;
        width: 240px;
    }
    .ivu-icon-search{
        font-size: 20px;
        color: #fff;
        line-height: 40px;
        width: 50px;
        height: 40px;;
        text-align: center;
        background: #31BB9F;
        border-radius: 0 8px 8px 0;
        position: absolute;
        cursor: pointer;
    }
}

</style>
<style lang="less">
// .membermanager{
     .ivu-tabs-nav-wrap{
        height: 60px;
        line-height: 40px;
        margin-top: 15px;
        .ivu-tabs-nav{
            border-bottom: 2px solid #dcdedd;
            .ivu-tabs-ink-bar{
                background: transparent;
            }
            .ivu-tabs-tab{
                font-size: 16px;
            }
            .ivu-tabs-tab-active{
                color: #4ac4b5;
                border-bottom: 2px solid #4ac4b5;
            }
        }
    }
.membermanager{
     background: #EEF1F2;
    .ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-nav-wrap{
        height: 34px;
        line-height: 17px;
        margin-top: 0;

    }
    .ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab{
        margin-right: 0;
        border: none;
        width: 100px;
        text-align: center;
    }

}
</style>

