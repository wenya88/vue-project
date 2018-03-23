<style lang="less">
@import "./main.less";


/*    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }*/

.ivu-layout-header {
    background: #fff !important;
}

.layout-logo {
    width: 100px;
    height: 30px;
    background: #fff !important;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}

.layout-nav {
    /*width: 500px;*/
    margin: 0 auto;
    margin-right: 20px;
}

.stem-logo img {
    max-width: 8rem;
}

.stem-l {
    margin-left: 10rem;
}
.ivu-menu-item-group-title{
    display: none;
}
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div :style="{background: '#fff',paddingLeft: shrink?'60px':'0'}" class="main-header-con">
            <Header>
                <Menu mode="horizontal" theme="light" active-name="1">
                    <div class="layout-logo stem-logo" @click="collapsedSider()">
                        <img v-show="!shrink" src="../images/logo.png" key="max-logo" />
                    </div>
                    <div class="layout-nav stem-l">
                        <Menu mode="horizontal" :active-name="activePath">
                             <MenuItem :name="item.path" v-for="item in subMenu" :key="item.path" :label="item.title">
                                <Icon :type="item.icon"></Icon>
                                <router-link :to="item.path">{{item.title}}</router-link>
                            </MenuItem>  
                            <!-- <Submenu :name="item.path" v-for="item in subMenu" :key="item.path" :label="item.title" v-if="item.children">
                                <template slot="title">
                                    <Icon type="stats-bars"></Icon>
                                    {{item.title}}
                                </template>
                                <MenuGroup>
                                    <MenuItem :name="third.path" v-for="third in item.children" :key="third.path">
                                        <router-link :to="third.path">{{third.title}}</router-link>
                                    </MenuItem>
                                </MenuGroup>
                            </Submenu>   -->
                        </Menu>
                    </div>
                </Menu>
            </Header>
        </div>
        <div class="main-content">
            <div ref="side1" class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}" v-if="showMenu">
                <!-- <shrinkable-menu
                        :shrink="shrink"
                        :menu-list="menuList"
                        theme="light"> 
                    </shrinkable-menu>    -->
                <!-- <ul>
                    <li v-for="item in menuList" :key="item.path">
                        <router-link :to="item.path"><span class="name">{{item.title}}</span></router-link>
                    </li>
                </ul> -->
                <Menu>
                    <Submenu :name="item.name" v-for="item in menuList" :key="item.path">
                        <template slot="title">
                            <Icon :type="item.icon"></Icon>
                            <router-link :to="item.path">{{item.title}}</router-link>
                        </template>
                    </Submenu>
                </Menu>
            </div>
            <!-- <content></content> -->
             <div class="single-page-con" :style="{left: showMenu?'200px':'0'}">
                <div class="single-page">
                    <router-view></router-view>
                </div>
            </div> 
        </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie';
import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
import themeSwitch from './main-components/theme-switch/theme-switch.vue';
// import content from './main-components/common/content.vue';

export default {
    components: {
        shrinkableMenu,
        themeSwitch,
        // content
        // topbarMenu
    },
    data() {
        return {
            shrink: false,
            showMenu: false,
            userName: '',
            subMenu: [],
            activePath: ''
        };
    },
    watch: {
        // '$route': {
        //     handler(newVal) {
        //         console.log(newVal.name)
        //     }
        // }
        '$route': 'updateMenu'
    },
    mounted() {
        this.init();
        this.updateMenu();
    },
    computed: {
        menuList() {
            return this.$store.state.app.menuList;
        }, 
        // thirdList() {
        //     return this.$store.state.app.thirdList;
        // }
    },
    methods: {
        init() {
            this.userName = Cookies.get('user');
        },
        linkTo(url, params) {
            if (params) {
                this.$router.push({ path: url, query: params });
            }
            else {
                this.$router.push(url)
            }
        },
        toggleClick() {
            this.shrink = !this.shrink;
        },
        handleClickUserDropdown(name) {
            this.$router.push({
                name: 'login'
            });
        },
        collapsedSider() {
            if (this.showMenu == false) {
                this.showMenu = true
            } else {
                this.showMenu = false
            }
        },
        updateMenu() {
            console.log(this.$route.name, this.menuList)
            this.menuList.forEach((item) => {
                if (this.$route.name === item.name) {
                    this.subMenu = item.children
                    console.log(this.subMenu)
                }
            })
            this.activePath = this.$route.path
        },
        handleClick(tab) {
            this.$router.push(tab.name)
        },
        handleChange(name) {
            let willpush = true;
            if (this.beforePush !== undefined) {
                if (!this.beforePush(name)) {
                    willpush = false;
                }
            }
            if (willpush) {
                this.$router.push({
                    name: name
                });
            }
            this.$emit('on-change', name);
        }
    }
}
</script>
