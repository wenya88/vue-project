<template>
    <Modal v-model="showAddNew" width=720>
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
                                <td width=420><Input v-model="initmemberinfo.account" placeholder="邮箱" style="width: 400px"/></td>
                                <td width=140><Input v-model="initmemberinfo.name" placeholder="备注名称" style="width: 120px"/></td>
                                <td width=140><Input v-model="initmemberinfo.profession" placeholder="职位" style="width: 120px"/></td>
                            </tr>
                            <tr v-for="item in memberinfolist" :key="item.id">
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
                            <td width=220><Input v-model="initinteriormemberinfo.account" placeholder="账号名" style="width: 200px" /></td>
                            <td width=140><Input v-model="initinteriormemberinfo.password" placeholder="密码" style="width: 120px" /></td>
                            <td width=140><Input v-model="initinteriormemberinfo.name" placeholder="名称" style="width: 120px" /></td>
                            <td width=140><Input v-model="initinteriormemberinfo.profession" placeholder="职位" style="width: 120px" /></td>
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
</template>

<script>
    export default {
    name:'memberinvite',
    data(){
        return {
            num:0,
            showAddNew: false,
            newToDoItemValue:"",
            initmemberinfo:{
                num:0,
                account : "",
                name : "",
                profession : "",
            },
            memberinfolist: [],
            initinteriormemberinfo:{
                num:0,
                account : "",
                password: "",
                name : "",
                profession : "",
            },
            interiormemberinfolist: [],
        }
    },
    methods:{
        /**
         * 增加一行艺术家用户信息
         */
        addInviteMember()
        {
            this.num++;
            var info = {
                id: this.num,
                account : "",
                name : "",
                profession : "",
                };
            this.memberinfolist.push(info);
            console.log(info);
        },
        /**
         * 增加一行内部用户信息
         */
        addInteriorMember()
        {
            this.num++;
            var info = {
                id: this.num,
                account : "",
                name : "",
                password:"",
                profession : "",
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
            this.interiormemberinfolist.removeOf(info);
            console.log(info);
        },
        /**
         * 外部显示弹窗接口
         */
        isShowPage(isShow)
        {
            if(isShow.constructor==Boolean)
            {
                console.log(isShow);
                this.showAddNew = isShow;
            }
            else
            {
                console.log(false);
                this.showAddNew = false;
            }     
        },
        /**
         * 向服务器发送艺术家申请列表
         */
        sendMemberinfoList()
        {
            if(this.memberinfolist.length < 0)
            {
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
            else
            {
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
        sendInteriorMemberinfoList()
        {

        },
    }
}
</script>