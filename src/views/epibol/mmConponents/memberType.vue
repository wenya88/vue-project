<template>
    <Menu id='memberTypeMenu' width=240  mode = "vertical" @on-select="changeMenu">
            <!--<template slot="title">按角色分类</template>-->
             <MenuGroup title="按角色分类" width=240>
                    按角色分类
                    <MenuItem name="1-1">经理</MenuItem>
                    <MenuItem name="1-2">项目管理</MenuItem>
                    <MenuItem name="1-3">项目成员</MenuItem>
            </MenuGroup>
                <br>
            <MenuGroup title="按部门分类" >
                    按部门分类
                    <MenuItem name="2-1">小组A</MenuItem>
                    <MenuItem name="2-2">小组B</MenuItem>
                    <MenuItem name="2-3">小组C</MenuItem>
            </MenuGroup>
            <!--
            <template v-for="item in menuList">
                <MenuItem v-if="item.children.length<=1" :name="item.children[0].name" :key="'menuitem' + item.name">
                    <Icon :type="item.children[0].icon || item.icon" :size="iconSize" :key="'menuicon' + item.name"></Icon>
                    <span class="layout-text" :key="'title' + item.name">{{ itemTitle(item.children[0]) }}</span>
                </MenuItem>
                <Submenu v-if="item.children.length > 1" :name="item.name" :key="item.name">
                    <template slot="title">
                        <Icon :type="item.icon" :size="iconSize"></Icon>
                        <span class="layout-text">{{ itemTitle(item) }}</span>
                    </template>
                    <template v-for="child in item.children">
                        <MenuItem :name="child.name" :key="'menuitem' + child.name">
                            <Icon :type="child.icon" :size="iconSize" :key="'icon' + child.name"></Icon>
                            <span class="layout-text" :key="'title' + child.name">{{ itemTitle(child) }}</span>
                        </MenuItem>
                    </template>
                </Submenu>
            </template>
            -->
    </Menu>
</template>
<script>
    export default {
        name:'memberTypeMenu',
        props: {
            // menuList: Array,
            // iconSize: Number,
            // openNames: {
            //     type: Array
            // }
        },
        methods:{
            /**
             * 改变类型项
             */
            changeMenu (active) {
                this.$emit('on-change', active);
                console.log(active);
                
            },
            //名字多语言处理
            itemTitle (item) {
                if (typeof item.title === 'object') 
                {
                    return this.$t(item.title.i18n);
                } 
                else 
                {
                    return item.title;
                }
             }
        },
        computed:{
       
        }
    }
</script>
