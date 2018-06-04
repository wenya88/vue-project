<style lang="less">
@import "./main.less";


/*    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }*/

// .ivu-layout-header {
//     background: #fff !important;
// }

.layout-logo {
    width: 100px;
    height: 30px;
    // background: #fff !important;
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
        <div class="backIcon" v-if="havaBack" @click="goBack()"><Icon type="chevron-left" size='20'></Icon></div>
        <div :style="{paddingLeft: shrink?'60px':'0'}" class="main-header-con">
            <Header>
                <Menu mode="horizontal" theme="light" active-name="1">
                    <div class="layout-logo stem-logo" @click="collapsedSider()">
                        <img v-show="!shrink" src="../images/logo.png" key="max-logo" />
                    </div>
                    <div class="layout-nav stem-l">
                        <Menu mode="horizontal" :active-name="activePath">
                             <MenuItem 
                             :name="item.path" 
                             v-for="item in subMenu" 
                             :key="item.path" 
                             :label="item.title">
                                <!-- <Icon :type="item.icon"></Icon> -->
                                <!-- {{item.title}}   -->
                                <router-link :to="item.path">{{item.title}}</router-link>   
                            </MenuItem>  
                        </Menu>
                    </div>
                </Menu>
            </Header>
        </div>
        <div class="main-header-avator">
             <div class="user-dropdown-menu-con" style="float: left;">
                <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                    <Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>
                    <span style="padding: 0 50px 0 10px;color: #fff;">{{ userName }}</span>
                    <!-- <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                        <a href="javascript:void(0)">
                            <span class="main-user-name">{{ userName }}</span>
                            <Icon type="arrow-down-b"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="ownSpace">个人中心</DropdownItem>
                            <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                        </DropdownMenu>
                    </Dropdown> -->
                </Row>
            </div>
            <message-tip v-model="mesCount"></message-tip>
            <div class="navicon-con">
                <Dropdown style="margin-left: 20px" trigger="click" @on-click="handleClickUserDropdown">
                    <a href="javascript:void(0)" style="padding-top: 8px;display: block;">
                        <!-- 菜单(居中) -->
                        <Icon type="navicon" size="32"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="ownSpace">个人中心</DropdownItem>
                        <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
        <div class="main-content" :style="`height:${centerHight}px`">
            <div ref="side1" class="sidebar-menu-con" :style="{width: shrink?'60px':'160px', overflow: shrink ? 'visible' : 'auto'}" v-if="showMenu">
                <Menu>
                    <Submenu :name="item.name" v-for="item in menuList" :key="item.path">
                        <template slot="title">
                            <Icon :type="item.icon" size="16"></Icon>
                            <router-link :to="item.path" @click.native="collapsedSider()">{{item.title}}</router-link>
                        </template>
                    </Submenu>
                </Menu>
            </div>
             <div class="single-page-con">
                <div class="single-page">
                    <router-view></router-view>
                </div>
            </div> 
        </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie';
import messageTip from './main-components/message-tip.vue';
import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
import themeSwitch from './main-components/theme-switch/theme-switch.vue';
export default {
    components: {
        shrinkableMenu,
        themeSwitch,
        messageTip
    },
    data() {
        return {
            shrink: false,
            showMenu: false,
            userName: '',
            subMenu: [],
            activePath: '',
            centerHight: 0,
            havaBack: false,
            avatorPath: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg'
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
    created() {
        let bodyHight = document.documentElement.clientHeight;   //浏览器body的高度
        let bodyWidth = document.documentElement.clientWidth;   //浏览器body的宽度
        if(bodyWidth <= 1366) {
            this.centerHight = bodyHight - 90
        } else {
            this.centerHight = bodyHight - 120
            // console.log(this.centerHight)
        }
        // console.log(document.documentElement.clientWidth)
    },
    mounted() {
        this.init();
        this.updateMenu();
        /**
         * 刷新当前页面路由设置
         */
        this.refresh();
        // let currentRoute = location.hash
        // let routeName = (location.hash).match(/\#\/(.*)(?=\/)/)[1]
        // this.menuList.forEach((item) => {
        //     if(routeName === item.name) {
        //         this.subMenu = item.children
        //         let menuArr = item.children
        //         // console.log(routeName,this.subMenu)
        //         this.$router.push('/'+location.hash.match(/\#\/(.*)/)[1])
        //     }
        // })
        // this.activePath = this.$route.path
        // console.log(this.activePath)
    },
    computed: {
        menuList() {
            return this.$store.state.app.menuList;
        },
        mesCount () {
            return this.$store.state.app.messageCount;
        },
        // avatorPath () {
        //     return localStorage.avatorImgPath;
        // }
    },
    methods: {
        /**
         * 刷新当前页面
         */
        refresh() {
            let currentRoute = location.hash
            let routeName = (location.href).match(/\/#\/(.*?)\//)[1]
            this.menuList.forEach((item) => {
                if(routeName === item.name) {
                    this.subMenu = item.children
                    let menuArr = item.children
                    // console.log(routeName,this.subMenu)
                    this.$router.push('/'+location.hash.match(/\#\/(.*)/)[1])
                    if(routeName == 'project') {
                        this.havaBack = true
                    } else {
                        this.havaBack = false
                    }
                }
            })
            this.activePath = this.$route.path
        },
        goBack() {
            this.$router.push('/epibol/projectManage');
        },
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
            if(name == 'loginout') {
                this.$axios.get(this.GLOBAL.baseRouter+'/system/login/info')
                .then( res => res.data)
                .then( res => {
                    if(res.err_code == 0){
                        Cookies.remove('user');
                        localStorage.removeItem('token');
                        this.$router.push('/login');
                    }
                })
            }
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
                let routeName = this.$route.name
                // console.log(this.$route.name, typeof this.$route.name)
                if(this.$route.name === item.name) {
                    this.subMenu = item.children
                    let menuArr = item.children
                    console.log(this.$route.name,this.subMenu)
                    this.$router.push(menuArr[0].path)
                } else {
                     this.refresh();
                }
            })
            this.activePath = this.$route.path
            // console.log(this.activePath)
        },
        handleChange(name) {
            console.log(name)
            // let willpush = true;
            // if (this.beforePush !== undefined) {
            //     if (!this.beforePush(name)) {
            //         willpush = false;
            //     }
            // }
            // if (willpush) {
                this.$router.push({
                    name: name
                });
            // }
            // this.$emit('on-change', name);
        }
    }
}
</script>
