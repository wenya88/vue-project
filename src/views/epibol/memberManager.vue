<template>
  <div id="membermanager">
    <Button class="addBtn" type="primary" size="large" icon="plus-round" @click="clickInviteMember">添加成员</Button>
    <Tabs size="small">
        <TabPane label="成员管理">
            <Layout>
                <Sider>
                    <membertype
                    @on-change="switchDataPage"
                    title="成都义美游艺术有限公司"
                    number="41" 
                    :deptList='deptList'
                    :dutyList='dutyList'>
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
  </div>
</template>

<script>
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
        deptList: [
            {
                name: '网页游戏部',
                number: 3
            }, {
                name: '手机游戏部',
                number: 3
            }, {
                name: '市场推广',
                number: 3
            }, {
                name: '商务合作',
                number: 3
            }, {
                name: '财务部',
                number: 3
            }, {
                name: '未分配部门',
                number: 3
            }
        ],
        dutyList: [
            {
                name: '经理',
                number: 3
            }, {
                name: '项目管理人',
                number: 3
            }, {
                name: '项目实施人员',
                number: 3
            }, {
                name: '商务',
                number: 3
            }, {
                name: '财务',
                number: 3
            }, {
                name: '市场',
                number: 3
            }, {
                name: '自定义角色',
                number: 3
            }
        ]
      };
  },
  props: {
    //  menuList:{
    //      type: Array,
    //      required: true
    //  },
    //  memberList:{
    //      type: Array,
    //      required: true
    //  },
    //  beforePush: {
    //      type: Function
    //  },
    //  openNames: {
    //      type: Array
    //  }
  },
  computed:{

  },
  methods:{
    updateDate(memberType)
    {
        this.$emit('init');
        // console.log("updateDate");
    },
    /**
     * 切换成员类型数据页面消息
     */
    switchDataPage(memberType)
    {
        this.$refs.list.initData();
        // console.log('switchDataPage');
    },
    /**
     * 暂时，会移动到用户控制组件中
     */
    clickInviteMember()
    {
        console.log("clickInviteMember");
        //this.showAddNewTodo = true;
        this.$refs.invite.isShowPage(true);
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

<style scoped>
.ivu-layout-sider, .ivu-layout-header{
    background: #fff;
}
.addBtn{
    position: absolute;
    right: 10px;
}
</style>
