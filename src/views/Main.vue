        <template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <!-- <div class="backIcon" v-if="havaBack" @click="goBack()"><Icon type="chevron-left" size='20'></Icon></div> -->
        <div :style="{paddingLeft: shrink?'60px':'0'}" class="main-header-con">
            <Header>
                <!-- <Menu class="main-header-bar" mode="horizontal" theme="light" active-name="1"> -->
                    <!--<div class="layout-logo stem-logo" @click="collapsedSider()">-->
                    <div class="logo"></div>
                    <!--<img v-show="!shrink" src="../images/icon/menu.png" key="max-logo"/>-->
                    <!--</div>-->
                    <!-- <div class="layout-nav stem-l">
                       <Menu mode="horizontal" :active-name="activePath">
                            <Menu-item
                            :name="item.path"
                            v-for="item in subMenu"
                            :key="item.path"
                            :label="item.title">
                               <router-link :to="item.path">{{item.title}}</router-link>
                           </Menu-item>
                       </Menu>
                   </div>  -->
                   <div class="main-header-avator">
                        <div class="user-dropdown-menu-con" style="float: left;">
                            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                                <Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>
                                <span style="padding: 0 50px 0 10px;color: #2d2d2d;">{{ userName }}</span>
                            </Row>
                        </div>
                        <message-tip v-model="mesCount"></message-tip>
                        <div class="navicon-con" style="float: left; margin-left: 20px;">
                            <Dropdown trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)" style="padding-top: 8px;display: block;">
                                    <!-- 菜单(居中) -->
                                    <Icon type="navicon" color='#2d2d2d' size="32"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="ownSpace">个人中心</DropdownItem>
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                <!-- </Menu> -->

            </Header>
        </div>
        <mainNative></mainNative>
        <div class="main-content" style="display: flex" :style="`height:${centerHight}px`">
        <!--<div class="main-content" style="display: flex" :style="`height:${centerHight}px`">-->
            <!-- :style="`height:${centerHight}px`" -->
            <!-- <div ref="side1" class="sidebar-menu-con" :style="{width: shrink?'60px':'160px', overflow: shrink ? 'visible' : 'hidden'}" v-if="showMenu">
               <Menu>
                   <Submenu :name="item.name" v-for="item in menuList" :key="item.path">
                       <template slot="title">
                           <Icon :type="item.icon" size="16"></Icon>
                           <router-link :to="item.path" @click.native="collapsedSider()">{{item.title}}</router-link>
                       </template>
                   </Submenu>
               </Menu>
           </div>  -->
            <div class="menuBlock" v-if="!showMenu">
                <!--<ul>-->
                <!--<li v-for="(item,index) in menuList" :key="index">-->
                <!--<router-link :to="item.path" :class="[item.name]"-->
                <!--@click.native="collapsedSider()"></router-link>-->
                <!--<span class="name">{{item.title}}</span>-->
                <!--</li>-->
                <!--&lt;!&ndash; <li class="work" @click="linkTo('/epibol/ProjectWork')">-->
                <!--个人工作台-->
                <!--</li>-->
                <!--<li class="comp" @click="linkTo('/epibol')">-->
                <!--公司-->
                <!--</li>-->
                <!--<li class="project" @click="linkTo('/epibol')">-->
                <!--项目大厅-->
                <!--</li>-->
                <!--<li class="art" @click="linkTo('/epibol')">-->
                <!--艺术广场-->
                <!--</li>   &ndash;&gt;-->
                <!--</ul>-->
            </div>
            <!--<ul class="menu" v-if="!menuListShow">-->
            <!--<li v-for="(item,index) in subMenu" :key="index">-->
            <!--<router-link :to="item.path" :class="[item.name, item.name === activeMenu ? 'active' : '']" ></router-link>-->
            <!--<span class="name">{{item.title}}</span>-->
            <!--</li>-->
            <!--</ul>-->


            <Menu style="min-width: 180px;max-width: 180px;" class="leftMenuList" @on-select="openSelect"
                  @on-open-change="openChange" ref="menu" :open-names="openMenu.openName"
                  :active-name="openMenu.openSct" :accordion="true">
                <Submenu v-if="menuList" v-for="(item,index) in menuList" class="navList" :title="item.title||item.name"
                         :name="index" :key="index">
                    <template slot="title">

                        <i v-if="item.title === '公司'" class="iconfont icon-hezuobaoxiangongsi"
                           style="color:#5d646b;vertical-align: middle;font-size: 16px;"></i>

                        <i v-else-if="item.title === '我的工作台'" class="iconfont icon-xiangmuxiaoxi"
                           style="color:#5d646b;vertical-align: middle;font-size: 14px;"></i>
                        <span v-else> <Icon style="color:#5d646b;vertical-align: middle" type="ios-calendar-outline"/></span>
                        <span class="navText">{{item.title || item.name}}</span>
                    </template>
                    <template v-if="item.children">
                        <MenuItem v-for="(children,i) in item.children" :title="children.title" class="childrenList"
                                  @click.native="$router.push({path:children.path})" :name="index+'-'+i" :key="i">
                            &emsp;&nbsp;&nbsp;{{children.title}}
                            <!--<router-link style="width: 158px;height: 49px" :to="children.path">{{children.title}}</router-link>-->
                        </MenuItem>
                    </template>
                    <template v-else>
                        <MenuItem v-for="(children,i) in children" :title="children.title" v-if="children.companyType != companyType"
                                  @click.native="projectDetails(children,item.id)"
                                  :name="index+'-'+i" :key="i">
                            &emsp;&nbsp;&nbsp;{{children.title}}
                          
                            <!--<router-link style="width: 158px;height: 49px" :to="children.path">{{children.title}}</router-link>-->
                        </MenuItem>
                    </template>
                </Submenu>
            </Menu>

            <div class="single-page-con" :style="`width:${mainWidth}px;height: 100%;`">
                <div class="single-page">
                    <router-view v-if="$route.path.includes('/project')" :key="key" ></router-view>
                    <router-view v-else ></router-view>
                </div>
            </div>
        </div>
        <!-- 完善信息 -->
        <perfect v-if="isproject"></perfect>
    </div>
</template>
<script>
    // import menu from '@/router/menu'
    import Cookies from 'js-cookie';
    import messageTip from './main-components/message-tip.vue';
    import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
    import themeSwitch from './main-components/theme-switch/theme-switch.vue';
    import mainNative from './main-components/mainNative.vue';
    import perfect from './main-components/perfect.vue'
    import {mapState, mapMutations} from 'vuex'

    export default {
        components: {
            shrinkableMenu,
            themeSwitch,
            messageTip,
            mainNative,
            perfect
        },
        data() {
            return {
                openMenu: {
                    openName: [0], // 展开项
                    openSct: '0-0',
                },
                shrink: false,
                showMenu: false,
                userName: '',
                subMenu: [],
                activePath: '',
                centerHight: 0,
                mainWidth: 0,
                havaBack: false,
                avatorPath: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg',
                companyType:JSON.parse(Cookies.get('company')).type
            };
        },

        created() {
            if (sessionStorage.getItem('openMenu')) {
                this.openMenu = JSON.parse(sessionStorage.getItem('openMenu'))
            }
            let bodyHight = document.documentElement.clientHeight;   //浏览器body的高度
            let bodyWidth = document.documentElement.clientWidth;   //浏览器body的宽度
            // if(bodyWidth <= 1366) {
            //     this.centerHight = bodyHight - 90
            // } else {
            this.centerHight = bodyHight - 52;
            // }
            this.mainWidth = bodyWidth - 121;
        },
        mounted() {
            this.bodySize();
            this.init();
            this.updateMenu();
            /**
             * 刷新当前页面路由设置
             */
            this.refresh();
            this.setIsproject();
            this.$bus.on('changeMenuList', (id) => {
                this.changeMenuList(id)
            })
        },
        computed: {
            ...mapState({
                menuListShow(value) {
                    return value.project.detail.setDetailAll
                },
                children(value) {
                    return value.app.children
                },
                menuList(value) {
                    return value.app.menuList;
                },
                key() {
                    return this.$route.name !== undefined ? this.$route.name + new Date()+Math.random() : this.$route + new Date()+Math.random()
                },
                isproject(value) {
                    return value.app.issproject
                }
            }),
            mesCount() {
                return this.$store.state.app.messageCount;
            },
            activeMenu() {
                return this.$route.name
            }
        },
        methods: {
            ...mapMutations(['setIsproject']),
            projectDetails(children, id) {
                if (id) {
                    sessionStorage.projectID = id;
                }
                this.$router.push({path: children.path, query: {sign: this.key}})
            },
            bodySize() {
                let body = document.body;
                body.onresize = () => {
                    let bodyWidth = document.documentElement.clientWidth;   //浏览器body的宽度
                    this.mainWidth = bodyWidth - 121
                }
            },
            /**
             * 刷新当前页面
             */
            refresh() {
                if (location.href.match(/\/#\/(.*?)\//) != null) {
                    let routeName = location.href.match(/\/#\/(.*?)\//)[1]
                    this.menuList.forEach((item) => {
                        if (routeName === item.name) {
                            this.subMenu = item.children
                            let menuArr = item.children
                            this.$router.push('/' + location.hash.match(/\#\/(.*)/)[1])
                            if (routeName == 'project') {
                                this.havaBack = true
                            } else {
                                this.havaBack = false
                            }
                        }
                    })
                }
                this.activePath = this.$route.path
            },
            linkTo(url, params) {
                if (params) {
                    this.$router.push({path: url, query: params});
                }
                else {
                    this.$router.push(url);
                }
            },
            goBack() {
                this.$router.push('/epibol/projectManage');
            },
            init() {
                this.userName = Cookies.get('user');
                this.fetchUserMesg();
            },
            linkTo(url, params) {
                if (params) {
                    this.$router.push({path: url, query: params});
                }
                else {
                    this.$router.push(url)
                }
            },
            toggleClick() {
                this.shrink = !this.shrink;
            },
            fetchUserMesg() {
                this.$axios.get(this.GLOBAL.baseRouter + '/system/login/info')
                    .then(res => res.data)
                    .then(res => {
                        if (res.err_code == 0) {
                            if (!res.limit.complete_show) {
                                localStorage.isproject = `false`
                            } else {
                                localStorage.isproject = `true`
                            }
                            this.setIsproject()
                            sessionStorage.userId = res.user.id
                            sessionStorage.user_type = res.user.user_type
                            Cookies.set('post_id', res.company.post_id)
                            // Cookies.set('user_type', res.user.user_type)
                            Cookies.set('company', res.company)
                            this.avatorPath = res.user.headimage
                        }
                    })
            },
            // 退出和登录
            handleClickUserDropdown(name) {
                if (name == 'loginout') {
                    this.$axios.get(this.GLOBAL.baseRouter + '/system/login/logout')
                        .then(res => res.data)
                        .then(res => {
                            if (res.err_code == 0) {
                                Cookies.remove('user');
                                sessionStorage.removeItem('openMenu');
                                localStorage.removeItem('token');
                                this.$router.push('/login');
                                this.$store.state.msgShow = false;
                                this.$store.state.useList = []
                                localStorage.removeItem('msgShow');
                                localStorage.removeItem('useList');
                                localStorage.removeItem('numList');
                                localStorage.removeItem('nums');
                                webSocket.close();
//                                window.location.reload();
                            }
                        })
                } else if (name === 'ownSpace') {
                    this.$router.push({path: '/home/personalCenter'})
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
                if (this.menuList) {
                    this.menuList.forEach((item) => {
                        // let routeName = this.$route.name
                        // console.log(item.name)
                        // if(this.$route.name === item.name) {
                        //     this.subMenu = item.children
                        //     let menuArr = item.children
                        //     console.log(this.$route.name,this.subMenu)
                        //     this.$router.push(menuArr[0].path)
                        // } else {
                        this.refresh();
                        // }
                    });
                    this.activePath = this.$route.path
                }
            },
            changeMenuList(id) {
                this.menuList.map((item, index) => {
                    if (item.id === id) {
                        this.openSelect(index, 0);
                    }
                })
            },
            // 选中内容
            openSelect(name, type) {
                if (type === 0) {
                    this.openMenu.openName = [name];
                    this.openMenu.openSct = `${name}-${type}`;
                    this.$nextTick(() => {
                        this.$refs.menu.updateOpened();
                        this.$refs.menu.updateActiveName()
                    });
                    sessionStorage.setItem('openMenu', JSON.stringify({
                        openSct: this.openMenu.openSct,
                        openName: this.openMenu.openName
                    }));

                    return false
                }
                sessionStorage.setItem('openMenu', JSON.stringify({openSct: name, openName: this.openMenu.openName}))
            },
            // 选中栏
            openChange(name) {
                this.openMenu.openName = name;
            },
        },
        watch: {
            menuList(data) {
                if (data.length > 0) {
                    this.updateMenu();
                    this.$nextTick(() => {
                        this.$refs.menu.updateOpened()
                        this.$refs.menu.updateActiveName()
                    })
                }
            },
            // '$route': {
            //     handler(newVal) {
            //         console.log(newVal.name)
            //     }
            // }
            '$route': 'updateMenu',
            mainWidth() {
                let bodyWidth = document.documentElement.clientWidth;   //浏览器body的宽度
                this.mainWidth = bodyWidth - 121
            },
        },

    }
</script>
<style lang="less">
    @import "./main.less";

    .main {
        .main-header-con, .ivu-layout-header, .ivu-menu-horizontal {
            height: 52px;
            line-height: 52px;
            background: transparent !important;
            border-bottom: 1px solid #e2e2e2;
        }
        /*.main-header-bar {*/
            /*background: transparent !important;*/
            /*border-bottom: 1px solid #e2e2e2;*/
        /*}*/
    }

    // .single-page-con{
    //   .single-page{
    //    position: relative;
    //  }
    // }
    .main-header-con {
        box-shadow: none !important;

    }

    .main-header-avator {
        float : right;
        z-index: 999 !important;
        padding :0px 20px 0px 0px;
    }

    .main-content {
        ::-webkit-scrollbar { /*滚动条整体样式*/
            width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 4px;
        }
        ::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
            border-radius: 5px;
            -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            background: rgba(0, 0, 0, 0.2);
        }
        ::-webkit-scrollbar-track { /*滚动条里面轨道*/
            -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            border-radius: 0;
            background: rgba(0, 0, 0, 0.1);
        }
        .ivu-menu {
            overflow-y: auto !important;
        }

    }

    .leftMenuList {
        background: #2c353e !important;
        /*background: #2c353e !important;*/
        .navList {
            .ivu-menu-submenu-title {
                padding: 11px 30px 11px 30px !important;
                border-top: 1px solid #424a52;
            }
        }
        .childrenList {
            /*height: 38px;*/
            padding: 8px 30px 8px 44px !important;
            color: #bebfc1;
            /*line-height: 38px;*/
        }
        .navText {
            display: inline-block;
            max-width: 70px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: middle;
            color: #71757a;
        }
        img {
            background: #fff;
        }
        .ivu-menu-submenu-title-icon {
            color: #8e9194;
        }
        .active1 {
            width: 50px;
            height: 50px;
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAUpklEQ…ACPSaAAHo8+ew6BBAAOQCBHhNAAD2efHYdAgiAHIBAjwn8DzH4MQCeA8k3AAAAAElFTkSuQmCC) no-repeat 50%/37px 34px;
            background-size: 50px 50px;

        }
        .ivu-menu, .ivu-menu-submenu-title {
            color: #bebfc1;
            /*border-bottom: 1px solid #424a52;*/

        }
        .ivu-menu-submenu {
            background: #2c353e !important

            /*background: linear-gradient('left',#24655b, #1d433d) !important;*/
        }
        .ivu-menu-vertical, .ivu-menu-submenu-title:hover {
            background: -webkit-linear-gradient(left, #24655b, #1d433d) !important;

        }
        .ivu-menu-vertical, .ivu-menu-item:hover {
            background: -webkit-linear-gradient(left, #24655b, #1d433d) !important;
        }
        .ivu-menu-item-active:not(.ivu-menu-submenu) {
            color: #fff !important;
            border-left: 2px solid #3bceb6 !important;
            border-right: 1px solid transparent !important;
            background: -webkit-linear-gradient(left, #24655b, #1d433d) !important;
        }
    }



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

    .logo {
        width: 180px;
        height: 52px;
        float: left;
        background: #2c353e url("../images/navLogo.png") no-repeat 67px 9px;
        background-size: 39px;
        border-bottom: 1px solid #424a52;
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

    .ivu-menu-item-group-title {
        display: none;
    }

    .sidebar-menu-con ul li:first-child {
        display: none;
    }

    .menu {
        width: 121px;
        padding: 0 18px;
        padding-top: 119px;
        float: left;
        background: #f5f7f6;
        height: 100%;
    }

    .menu li a {
        display: block;
        width: 85px;
        height: 60px;
    }

    .menu li {
        position: relative;
        margin-bottom: 40px;
    }

    .menu li a + .name {
        position: absolute;
        transition: all .5s ease;
        opacity: 0;
        left: 40px;
        top: 40px;
        width: 75px;
        height: 28px;
        font-size: 12px;
        text-align: center;
        line-height: 28px;
        background: #FFFBDE;
        border: 1px solid #CCCAB9;
        box-shadow: 0 12px 18px 0 rgba(0, 0, 0, 0.06);
        border-radius: 4px;
    }

    .menu li a:hover + .name {
        opacity: 1;
        left: 46px;
        top: 30px;
    }

    .menu li a.eHome, .menu li a.cHome {
        background: url(../images/icon/company.png) no-repeat center center / 37px 34px;
    }

    .menu li a.bidManage, .menu li a.cusBidManage {
        background: url(../images/icon/bidManage.png) no-repeat center center / 37px 34px;
    }

    .menu li a.contractManage, .menu li a.cContractManage {
        background: url(../images/icon/contractManage.png) no-repeat center center / 37px 34px;
    }

    .menu li a.projectManage, .menu li a.cProjectManage {
        background: url(../images/icon/project.png) no-repeat center center / 37px 34px;
    }

    .menu li a.memberManager {
        background: url(../images/icon/memberManager.png) no-repeat center center / 37px 34px;
    }

    .menu li a.eStatistics {
        background: url(../images/icon/statistics.png) no-repeat center center / 37px 34px;
    }

    .menu li a.custom {
        background: url(../images/icon/survey.png) no-repeat center center / 37px 34px;
    }

    .menu li a.task {
        background: url(../images/icon/task.png) no-repeat center center / 37px 34px;
    }

    .menu li a.quality {
        background: url(../images/icon/resources.png) no-repeat center center / 37px 34px;
    }

    .menu li a.eMember {
        background: url(../images/icon/member.png) no-repeat center center / 37px 34px;
    }

    .menu li a.statistics {
        background: url(../images/icon/pstatistics.png) no-repeat center center / 37px 34px;
    }

    //   .menu li a.yuntu {
    //     background: url(./assets/images/icon/icon-yuntu.svg) no-repeat center center;
    //   }
    //   .menu li a.finance {
    //     background: url(./assets/images/icon/icon-finance.svg) no-repeat center center;
    //   }
    .menu li a:hover {
        // background-color: #F1F7F9;
        border-right: 6px solid #48c5b5;
    }

    .menu li a.active {
        // background-color: #F3F3F3;
        border-right: 6px solid #48c5b5;
    }
</style>
