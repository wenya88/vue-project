<template>
  <div id="membermanager">
    <Layout>
        <Header>
            <membercontroller></membercontroller>
            <Button type="primary" icon="plus-round" @click="click1">添加成员1</Button>
        </Header>
        <Layout>
            <Sider>
                <membertype @on-change="switchDataPage"></membertype>
            </Sider>
            <Content>
                <memberlist ref="list"></memberlist>
            </Content>
            <Modal v-model="showAddNewTodo" width=720>
                <Tabs value="memberInviteTabs">
                <TabPane label="添加研发成员" name="name1">
                    <transition-group name="memberinfo">
                        <table border=0 style="table-layout:fixed;border-collapse:separate;border-spacing:0px 20px;" key="list">
                            <tr>
                                <td width=300px>邮箱</td>
                                <td width=120px>备注名称</td>
                                <td width=120px>职位</td>
                            </tr>
                            <tr>
                                <td width=420><Input v-model="newToDoItemValue" placeholder="请输入..." style="width: 400px"/></td>
                                <td width=140><Input v-model="newToDoItemValue" placeholder="请输入..." style="width: 120px"/></td>
                                <td width=140><Input v-model="newToDoItemValue" placeholder="请输入..." style="width: 120px"/></td>
                            </tr>
                            <tr v-for="item in memberinfolist" id="item.id">
                                <td width=420><Input v-model="item.account" placeholder="邮箱" style="width: 400px"/></td>
                                <td width=140><Input v-model="item.name" placeholder="备注名称" style="width: 120px"/></td>
                                <td width=140><Input v-model="item.profession" placeholder="职位" style="width: 120px"/></td>
                                <td TOP=50%><Button size="small" type="ghost" style="top:50%" @click="delInviteMember(item)">-</Button></td>
                            </tr>
                         </table>
                    </transition-group>
                    <Button size="small" type="ghost" align="right" @click="addInviteMember">+</Button>
                </TabPane>
                <TabPane label="添加非研发成员" name="name2">
                    <transition-group name="memberinfo">
                    <table border=0 style="table-layout:fixed;border-collapse:separate;border-spacing:0px 20px;" key="list">
                        <tr>
                            <td width=240px>账号名</td>
                            <td width=120px>密码</td>
                            <td width=120px>名称</td>
                            <td width=120px>职位</td>
                        </tr>
                        <tr type="flex" justify="left" cellspacing="10">
                            <td width=220><Input v-model="newToDoItemValue" placeholder="请输入..." style="width: 200px" /></td>
                            <td width=140><Input v-model="newToDoItemValue" placeholder="请输入..." style="width: 120px" /></td>
                            <td width=140><Input v-model="newToDoItemValue" placeholder="请输入..." style="width: 120px" /></td>
                            <td width=140><Input v-model="newToDoItemValue" placeholder="请输入..." style="width: 120px" /></td>
                        </tr>
                        <tr v-for="item in interiormemberinfolist" type="flex" justify="left" :key="item.name" cellspacing="10">
                            <td width=220><Input v-model="item.account" placeholder="账号名" style="width: 200px" /></td>
                            <td width=140><Input v-model="item.password" placeholder="密码" style="width: 120px" /></td>
                            <td width=140><Input v-model="item.name" placeholder="名称" style="width: 120px" /></td>
                            <td width=140><Input v-model="item.profession" placeholder="职位" style="width: 120px" /></td>
                            <td TOP=50%><Button size="small" type="ghost" >-</Button></td>
                        </tr>
                    </table>
                    </transition-group>
                    <Button size="small" type="ghost" align="right" @click="addInteriorMember">+</Button>
                </TabPane>
                </Tabs>
                    <div slot="footer">
                        <Button size="large" type="primary">邀请</Button>
                    </div>
                </Modal>
        </Layout>
    </Layout>      
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import memberlist from './mmConponents/memberList.vue';
import membertype from './mmConponents/memberType.vue';
import membercontroller from './mmConponents/memberController.vue';

export default {
    // data() {
    //     ownMemberTypes:[],
    //     //ownMemberList:[]
    // },
  components: {
    memberlist,
    membertype,
    membercontroller
  },
  data(){
      return{
        num:1,
        showAddNewTodo: false,
        newToDoItemValue: '',
        memberinfolist: [],
        interiormemberinfolist: [],
      };
  },
  props: {
    // menuList:{
    //     type: Array,
    //     required: true
    // },
    // beforePush: {
    //     type: Function
    // },
    // openNames: {
    //     type: Array
    // }
  },
  computed:{

  },
  methods:{
    updateDate(memberType)
    {
        this.$emit('init');
        console.log("updateDate");
    },
    /**
     * 切换成员类型数据页面消息
     */
    switchDataPage(memberType)
    {
        this.$refs.list.initData();
        console.log('switchDataPage');
    },
    /**
     * 暂时，会移动到用户控制组件中
     */
    click1()
    {
        console.log("click1");
        this.showAddNewTodo = true;
    },
    /**
     * 增加一行艺术家用户信息
     */
    addInviteMember()
    {
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
    addInteriorMember()
    {
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
    delInviteMember(info)
    {
        //需要移动到工具函数中
        Array.prototype.indexOf = function(val)
        {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) return i;
            }
            return -1;
        };
        //需要移动到工具函数中
        Array.prototype.removeOf = function(val)
        {
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
    delInteriorMember(info)
    {
        console.log(info);
    }
  }
}
</script>

<style>

</style>
