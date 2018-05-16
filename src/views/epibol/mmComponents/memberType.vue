<template>
    <div class="classify">
        <div class="title">{{title}}
            <slot name="title"></slot>
            ({{number}})
            <slot name="number"></slot>
        </div>
        <Tabs type="card">
            <TabPane label="部门">
                <ul class="fMenu">
                    <li v-for="(item,index) in deptList" :key="index" @click="openTable(index)">
                        {{item.name}}
                        <span class="numStyle">{{item.number}}</span>
                        <!-- <span class="more" @click.stop="editItem()">...</span> -->
                        <Poptip class="more" placement="bottom-end">
                            <span>...</span>
                            <div class="api" slot="content">
                                <!-- <slot name="fmore"></slot> -->
                                <ul class="editItem">
                                    <li @click="editDept(item.id,item.name)">编辑</li>
                                    <li @click="delDept(item.id)">删除</li>
                                </ul>
                            </div> 
                        </Poptip>
                    </li>
                </ul>
                <slot name="addDept"></slot>
                <!-- <Menu width=240 mode="vertical" @on-select="changeFMenu" active-name="1-1">
                    <MenuItem v-for="(item,index) in deptList" :key="index" :name="item.name">{{item.name}}
                        <span class="numStyle">{{item.number}}</span>
                    </MenuItem>
                </Menu> -->
            </TabPane>
            <TabPane label="职能">
                <ul class="fMenu">
                    <li v-for="(item,index) in dutyList" :key="index" @click="open2Table(index)">
                        {{item.name}}
                        <span class="numStyle">{{item.number}}</span>
                        <!-- <span class="more" @click.stop="editItem()">...</span> -->
                        <Poptip class="more" placement="bottom-end">
                            <span>...</span>
                            <div class="api" slot="content">
                                <!-- <slot name="fmore"></slot> -->
                                <ul>
                                    <li @click="editDuty(item.id,item.name)">编辑</li>
                                </ul>
                            </div> 
                        </Poptip>
                    </li>
                </ul>
                <slot name="addDuty"></slot>
                <!-- <Menu width=240 mode="vertical" @on-select="changeSMenu" active-name="2-1">
                    <MenuItem v-for="(item,index) in dutyList" :key="index" :name="item.name">{{item.name}}
                        <span class="numStyle">{{item.number}}</span>
                    </MenuItem>
                </Menu> -->
            </TabPane> 
        </Tabs>
        <!-- <Menu id='memberTypeMenu' width=240 mode="vertical" @on-select="changeMenu">
            <MenuGroup title="按角色分类" width=240>
                按角色分类
                <MenuItem name="1-1">经理</MenuItem>
                <MenuItem name="1-2">项目管理</MenuItem>
                <MenuItem name="1-3">项目成员</MenuItem>
            </MenuGroup>
            <br>
            <MenuGroup title="按部门分类">
                按部门分类
                <MenuItem name="2-1">小组A</MenuItem>
                <MenuItem name="2-2">小组B</MenuItem>
                <MenuItem name="2-3">小组C</MenuItem>
            </MenuGroup>
        </Menu> -->
    </div>
</template>
<script>
export default {
    name: 'memberTypeMenu',
    data() {
        return {
            FMenuIndex: 0,
            SMenuIndex: 0
        }
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        number: {
            type: String,
            default: ''
        },
        deptList: {
            type: Array,
            default: []
        },
        dutyList: {
            type: Array,
            default: []
        }
        // menuList: Array,
        // iconSize: Number,
        // openNames: {
        //     type: Array
        // }
    },
    methods: {
        /**
         * 初始化数据
         */
        initData() {
            /*
            axios.get('/user', {
                params: {
                ID: 12345
                }
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
            */
        },
        /**
         * 改变类型项
         */
        changeFMenu(active) {
            this.$emit('on-change', active);
            console.log(active);
        },
        changeSMenu(active) {
            this.$emit('on-change', active);
            console.log(active);
        },
        openTable(index) {
            this.FMenuIndex = index
            this.$emit('click', index);
        },
        editDept(id,name) {
            this.$emit('deptEdit', id, name)
        },
        delDept(id) {
            this.$emit('deptDel', id)
        },
        open2Table(index) {
            this.SMenuIndex = index
            this.$emit('click', index);
        },
        editDuty(id,name) {
            this.$emit('dutyEdit', id, name)
        },
        //名字多语言处理
        itemTitle(item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n);
            }
            else {
                return item.title;
            }
        }
    },
    computed: {

    }
}
</script>
<style scoped>
.title{
    height: 36px;
    line-height: 36px;
    text-align: center;
    background: rgba(34, 215, 187, 0.176470588235294);
}
.fMenu{
    height: auto;
    line-height: 50px;
    padding: 0 20px;
}
.fMenu li{
    cursor: pointer;
}
.fMenu li:hover .more{
    display: block;
}
.editItem{
    text-align: center;
    line-height: 30px;
}
.numStyle, .more{
    float: right;
}
.more, .fMenu li:hover .numStyle{
    display: none;
}
.ivu-menu-light{
    background: #fff !important;
}
.ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-vertical .ivu-menu-submenu-title:hover{
    background: #f3f3f3 !important;
}
.ivu-tabs-bar{
    margin-bottom: 0 !important;
}
.ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab, .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab{
    width: 100px !important;
    text-align: center !important;
}
</style>
