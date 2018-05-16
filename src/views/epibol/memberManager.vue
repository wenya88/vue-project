<template>
  <div id="membermanager">
    <Button class="addBtn" type="primary" size="large" icon="plus-round" @click.native="clickInviteMember">添加成员</Button>
    <Tabs size="small">
        <TabPane label="成员管理">
            <Layout>
                <Sider>
                    <membertype
                    @click="switchDataPage"
                    title="成都有限公司"
                    number="41" 
                    :deptList='deptList'
                    :dutyList='dutyList'
                    @deptEdit="editDept"
                    @deptDel="delDept"
                    @dutyEdit="editDuty">
                    <div slot="addDept">
                        <div class="addDept" @click="addDept()"><Icon type="plus" color="#31BB9F" size="16"></Icon>增加部门</div>
                    </div>
                    <div slot="addDuty">
                        <div class="addDept" @click="addDuty()"><Icon type="plus" color="#31BB9F" size="16"></Icon>增加职能</div>
                    </div>
                    </membertype>
                </Sider>
                <Layout>
                    <!-- <Header>
                        <Button type="primary" size="large" icon="plus-round" @click="clickInviteMember">添加成员</Button>
                    </Header> -->
                    <Content>
                        <memberlist ref="list"></memberlist>
                        <memberinvite ref="invite"></memberinvite>
                    </Content>
                </Layout>
            </Layout>    
        </TabPane>
        <TabPane label="权限设置">
            
        </TabPane> 
    </Tabs>
    <Modal
        v-model="editModel"
        :title="deptStatus == 'add' ? '新增部门' : '编辑部门'"
        @on-ok="ok(deptStatus)"
        @on-cancel="cancel">
        <Input v-model="deptName" placeholder="请输入部门名称" style="width: 300px"></Input>
    </Modal>
    <Modal
        v-model="delModal"
        title="确认删除部门？"
        @on-ok="delOk"
        @on-cancel="cancel">
        <p>删除部门后成员将移入“未分配部门”</p>
    </Modal>
    <Modal
        v-model="dutyModel"
        :title="dutyStatus == 'add' ? '新增职能' : '编辑职能'"
        @on-ok="okDuty(dutyStatus)"
        @on-cancel="cancel">
        <Input v-model="dutyName" placeholder="请输入职能名称" style="width: 300px"></Input>
    </Modal>
  </div>
</template>

<script>
var qs = require('querystring');
import { mapGetters } from 'vuex'
import memberlist from './mmComponents/memberList.vue';
import membertype from './mmComponents/memberType.vue';
// import membercontroller from './mmComponents/memberController.vue';
import memberinvite from './mmComponents/memberInvite.vue';

export default {
    // data() {
    //     ownMemberTypes:[],
    //     //ownMemberList:[]
    // },
  components: {
    memberlist,
    membertype,
    // membercontroller,
    memberinvite
  },
  data(){
      return{
        num:1,
        showAddNewTodo: false,
        newToDoItemValue: '',
        memberinfolist: [],
        interiormemberinfolist: [],
        deptList: [],
        dutyList: [],
        editModel: false,
        deptStatus: 'add',
        deptName: '',
        deptId: 0,
        delModal: false,
        dutyModel: false,
        dutyStatus: 'add',
        dutyId: 0,
        dutyName: ''
      };
  },
  created() {
      this.fetchDeptList();
      this.fetchDutyList();
  },
  computed:{

  },
  methods:{
    updateDate(memberType) {
        this.$emit('init');
        // console.log("updateDate");
    },
    /**
     * 获取部门列表
     */
    fetchDeptList() {
        let data = {
            company_id: 1
        }
        this.$axios.post(this.GLOBAL.baseRouter+'task/department/list', qs.stringify(data))
        .then(res => res.data)
        .then(res => {
            this.deptList = res.data
        })
    },
    /**
     * 获取职位列表
     */
    fetchDutyList() {
        let data = {
            company_id: 1
        }
        this.$axios.post(this.GLOBAL.baseRouter+'task/post/list', qs.stringify(data))
        .then(res => res.data)
        .then(res => {
            this.dutyList = res.data
        })
    },
    addDept() {
        this.deptStatus = 'add';
        this.editModel = true;
    },
    editDept(id,name) {
        this.deptStatus = 'edit';
        this.editModel = true;
        this.deptId = id;
        this.deptName = name;
    },
    ok(name) {
        if(name == 'add') {
            let data = {
                company_id: 1,
                name: this.deptName
            }
            this.$axios.post(this.GLOBAL.baseRouter+'task/department/add', qs.stringify(data))
            .then(res => res.data)
            .then(res => {
                if(res.err_code == 0) {
                    this.fetchDeptList();
                    this.$Message.success('创建部门成功');
                } else {
                    this.$Message.error('创建部门失败');
                }
            })
        } else if(name == 'edit') {
            let data = {
                id: this.deptId,
                name: this.deptName
            }
            this.$axios.post(this.GLOBAL.baseRouter+'task/department/update', qs.stringify(data))
            .then(res => res.data)
            .then(res => {
                if(res.err_code == 0) {
                    this.fetchDeptList();
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
        this.$axios.post(this.GLOBAL.baseRouter+'task/department/delete', qs.stringify(data))
        .then(res => res.data)
        .then(res => {
            if(res.err_code == 0) {
                this.fetchDeptList();
                this.$Message.success('删除部门成功');
            } else {
                this.$Message.error('删除部门失败');
            }
        })
    },
    addDuty() {
        this.dutyStatus = 'add';
        this.dutyModel = true;
    },
    editDuty(id,name) {
        this.dutyStatus = 'edit';
        this.dutyModel = true;
        this.dutyId = id;
        this.dutyName = name;
    },
    okDuty(name) {
        if(name == 'add') {
            let data = {
                company_id: 1,
                name: this.dutyName
            }
            this.$axios.post(this.GLOBAL.baseRouter+'task/post/add', qs.stringify(data))
            .then(res => res.data)
            .then(res => {
                if(res.err_code == 0) {
                    this.fetchDutyList();
                    this.$Message.success('创建职能成功');
                } else {
                    this.$Message.error('创建职能失败');
                }
            })
        } else if(name == 'edit') {
            let data = {
                id: this.dutyId,
                name: this.dutyName
            }
            this.$axios.post(this.GLOBAL.baseRouter+'task/post/update', qs.stringify(data))
            .then(res => res.data)
            .then(res => {
                if(res.err_code == 0) {
                    this.fetchDutyList();
                    this.$Message.success('修改职能名称成功');
                } else {
                    this.$Message.error('修改职能名称失败');
                }
            })
        }
        // this.$Message.info('Clicked ok');
    },
    /**
     * 切换成员类型数据页面消息
     */
    switchDataPage(memberType) {
        this.$refs.list.initData();
        // console.log('switchDataPage');
    },
    /**
     * 暂时，会移动到用户控制组件中
     */
    clickInviteMember() {
        console.log("clickInviteMember");
        //this.showAddNewTodo = true;
        this.$refs.invite.isShowPage(true);
    },
    /**
     * 增加一行艺术家用户信息
     */
    addInviteMember() {
        var info = {
            id: this.num,
            account : "account"+this.num,
            name : "name"+this.num,
            profession : "profession"+this.num
            };
        this.num++;
        this.memberinfolist.push(info);
        console.log(info);
    },
    /**
     * 增加一行内部用户信息
     */
    addInteriorMember() {
        var info = {
            id: this.num,
            account : "account"+this.num,
            name : "name"+this.num,
            profession : "profession"+this.num
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
        console.log(info);
    }
  }
}
</script>

<style scoped>
.ivu-layout-sider, .ivu-layout-header{
    background: #fff;
}
.addBtn{
    position: absolute;
    right: 10px;
    z-index: 10;
}
.addDept{
    color: #31BB9F;
    font-size: 14px;
    line-height: 50px;
    padding: 0 20px;
    cursor: pointer;
}
</style>
