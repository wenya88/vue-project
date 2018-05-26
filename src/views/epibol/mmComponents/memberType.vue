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
                    <li v-for="(item,index) in deptList" :key="index" :class="{'actived': FMenuIndex == index}" @click="openTable(index,item.company_id,item.id)">
                        {{item.name}}
                        <span class="numStyle">{{item.member_count}}</span>
                        <!-- <span class="more" @click.stop="editItem()">...</span> -->
                        <Poptip class="more" placement="bottom-end" v-if="index+1 < deptList.length">
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
            </TabPane>
            <TabPane label="职能">
                <ul class="fMenu">
                    <li v-for="(item,index) in dutyList" :key="index" :class="{'actived': SMenuIndex == index}" @click="open2Table(index,item.company_id,item.id)">
                        {{item.name}}
                        <span class="numStyle">{{item.member_count}}</span>
                        <!-- <span class="more" @click.stop="editItem()">...</span> -->
                        <Poptip class="more" placement="bottom-end">
                            <span>...</span>
                            <div class="api" slot="content">
                                <!-- <slot name="fmore"></slot> -->
                                <ul>
                                    <li @click="editDuty(item.id,item.name)">编辑</li>
                                    <li @click="delDuty(item.id)">删除</li>
                                </ul>
                            </div> 
                        </Poptip>
                    </li>
                </ul>
                <slot name="addDuty"></slot>
            </TabPane> 
        </Tabs>
    </div>
</template>
<script>
export default {
    name: 'memberTypeMenu',
    data() {
        return {
            FMenuIndex: null,
            SMenuIndex: null
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
        openTable(index,comId,deptId) {
            this.FMenuIndex = index
            this.$emit('openDept', index, comId, deptId);
        },
        editDept(id,name) {
            this.$emit('deptEdit', id, name)
        },
        delDept(id) {
            this.$emit('deptDel', id)
        },
        open2Table(index,comId,dutyId) {
            this.SMenuIndex = index
            this.$emit('openDuty', index, comId, dutyId);
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
}
.fMenu li{
    cursor: pointer;
    padding: 0 20px;
}
.fMenu li:hover{
    background: #f2f2f2;
    border-right: 3px solid #31bb9f;
    color: #31bb9f;
}
.fMenu li.actived{
    background: #f2f2f2;
    border-right: 3px solid #31bb9f;
    color: #31bb9f;
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
