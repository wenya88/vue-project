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
.sidebar-menu-con ul li:first-child{
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
                        </Menu>
                    </div>
                </Menu>
            </Header>
        </div>
        <div class="main-content">
            <div ref="side1" class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}" v-if="showMenu">
                <Menu>
                    <Submenu :name="item.name" v-for="item in menuList" :key="item.path">
                        <template slot="title">
                            <Icon :type="item.icon"></Icon>
                            <router-link :to="item.path">{{item.title}}</router-link>
                        </template>
                    </Submenu>
                </Menu>
            </div>
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

export default {
    components: {
        shrinkableMenu,
        themeSwitch
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
        let currentRoute = location.hash
        let routeName = (location.hash).match(/\#\/(.*)(?=\/)/)[1]
        this.menuList.forEach((item) => {
            if(routeName === item.name) {
                this.subMenu = item.children
                let menuArr = item.children
                console.log(routeName,this.subMenu)
                this.$router.push('/'+location.hash.match(/\#\/(.*)/)[1])
            }
        })
        this.activePath = this.$route.path
        console.log(this.activePath)
    },
    computed: {
        menuList() {
            return this.$store.state.app.menuList;
        }
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
            this.menuList.forEach((item) => {
                // let routeName = this.$route.name
                // console.log(routeName)
                if (this.$route.name === item.name) {
                    this.subMenu = item.children
                    let menuArr = item.children
                    console.log(this.$route.name,this.subMenu)
                    this.$router.push(menuArr[0].path)
                }
            })
            this.activePath = this.$route.path
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
