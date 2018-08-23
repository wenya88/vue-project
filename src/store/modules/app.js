import {otherRouter, appRouter} from '@/router/router';
import {menu} from '@/router/menu'
import Util from '@/libs/util';
import Cookies from 'js-cookie';
import {cidrSubnet} from 'ip';
import api from 'api'

const app = {
    state: {
        menuList: [],
        projectMenuList: [],
        children: [
            {
                path: '/project/home',
                name: 'custom',
                level: '1-1',
                title: '概况',
            }, {
                path: '/project/task',
                name: 'task',
                level: '1-2',
                title: '任务管理',
            }, {
                path: '/project/quality',
                name: 'quality',
                level: '1-3',
                title: '资源管理',
            }, {
                path: '/project/projectMember',
                name: 'eMember',
                level: '1-4',
                title: '团队',
            }, {
                path: '/project/statistics',
                name: 'statistics',
                level: '1-5',
                title: '统计',
            }
        ],
        routers: [
            otherRouter,
            ...appRouter
        ],
        menuTheme: 'dark', // 主题
        themeColor: '',
        messageCount: 0,
        uploadFile: [],  // 上传文件路径
        filenum:null, // 上传文件数量
        /* 以下 8月9日 权限 */
        role: null,              // 权限
        standardLibrary: true, // 公司级规范库
        memberMgt: true, // 成员管理
        roleMgt: true, // 权限管理
        projectSet: {
            self: true,             // 设置按钮
            projectNorm: true,       // 规范设置
            projectTitle: true,      // 时间设置
            projectsetMember: true,     // 成员设置

            projectStatistics: true,   //统计
            projectMember: true,     //  成员
            projectTask: true,       // 任务列表
            projectCustom: true,     //概况

            projectQuality: true,    // 资源
            qualityFrist: true,      //资源管理归档
            qualitySecond: true,      //资源管理归档
            qualityThird: true,      //资源管理归档
            qualityFourth: true,      //资源管理归档
            qualityFifth: true,      //资源管理归档
        },
        epibol: {
            memberManager: true,         // 团队,
            contract: true,              // 合同,
            callForBids: true,           // 招标,
            eHome: true,                 // 概况,
            projectHome:true,
        },
        callForBidsdts: {
            HaveTender: true,             // 已报名招标
            invitation: true              // 外包邀请
        },
        manager:{
            manager_page_header:true,       // 经营
            mangaer_main_bid:true,       // 投标
            mangaer_main_Sign:true,       // 合同
            mangaer_main_project:true,       // 项目
            mangaer_main_quality:true,       // 质量
            mangaer_main_team:true,       // 团队

        }
    },
    mutations: {

        changeMenuTheme(state, theme) {
            state.menuTheme = theme;
        },
        changeMainTheme(state, mainTheme) {
            state.themeColor = mainTheme;
        },
        setMessageCount(state, count) {
            state.messageCount = count;
        },
        /*上传*/
        setfileUrl(state, data) {
            data.data.name = data.files.name
            state.uploadFile.push(data.data);
        },
        clearfileUrl(state) {
            state.uploadFile = [];
        },
        setFilenum(state,data) {
            state.filenum = data;
        },
        /*
            epibol级权限
        */
        epibolMenuList(state, {menuList, item}) {
            const array = item.children.map((child, idx) => {
                if (!state.epibol.callForBids && child.name === 'bidManage') {
                    return ''
                } else if (!state.epibol.contract && child.name === 'contractManage') {
                    return ''
                } else if (!state.epibol.eHome && child.name === 'eHome') {
                    return ''
                } else if (!state.epibol.memberManager && child.name === 'memberManager') {
                    return ''
                } else if (!state.epibol.projectHome && child.name === 'projectManage') {
                    return ''
                }
                return child
                /*if(child.auth) {
                    if(userType == 1) {
                        if(child.auth == 1){
                            // 甲方
                            menuList[1].children.splice(1,1)
                        }
                    } else if(userType != 1 && item.auth != 1) {
                        // 乙方
                        menuList[1].children.splice(2,1)
                    }
                }*/
            });

            menuList[1].children = array.filter((child) => {
                return child !== ''
            });
            // state.menuList = menuList.concat(state.projectMenuList);


        },
        /*
            project级权限
        */
        projectMenuList(state) {
            const array = state.children.map((child, idx) => {
                if (!state.projectSet.projectStatistics && child.name === 'statistics') {
                    return ''
                }
                else if (!state.projectSet.projectMember && child.name === 'eMember') {
                    return ''
                }
                else if (!state.projectSet.projectQuality && child.name === 'quality') {
                    return ''
                }
                else if (!state.projectSet.projectTask && child.name === 'task') {
                    return ''
                }
                else if (!state.projectSet.projectCustom && child.name === 'custom') {
                    return ''
                }
                return child
            });

            state.children = array.filter((child) => {return child !== ''})


        },
        /*合并项目二级菜单*/
        concatProject(state, {menuList, item}){
            state.menuList = menuList.concat(state.projectMenuList);
        },
        /*权限显隐控制*/
        setRole(state, data) {
            state.role = data.id;
            state.projectMenuList = data.project;

            data = data.id.split(',');
            sessionStorage.setItem('userrole',JSON.stringify(data));

            if (data.indexOf('w4') !== -1) {
                state.manager.manager_page_header = false
            }
            if (data.indexOf('w5') !== -1) {
                state.manager.mangaer_main_bid = false
            }
            if (data.indexOf('w8') !== -1) {
                state.manager.mangaer_main_Sign = false
            }
            if (data.indexOf('w9') !== -1) {
                state.manager.mangaer_main_project = false
            }
            if (data.indexOf('w10') !== -1) {
                state.manager.mangaer_main_quality = false
            }
            if (data.indexOf('w11') !== -1) {
                state.manager.mangaer_main_team = false
            }

            if (data.indexOf('c1_1')!==-1) {
                // 公司概况
                state.epibol.eHome = false

            }
            if (data.indexOf('c2')!==-1) {

                // c2 公司投标
                // state.epibol.callForBids = false
            }
            if (data.indexOf('c2_1')!==-1) {
                // c2 已报名投标
                state.callForBidsdts.HaveTender = false

            }
            if (data.indexOf('c2_2')!==-1) {
                // c2 外包邀请
                state.callForBidsdts.invitation = false

            }
            if (data.indexOf('c2_3')!==-1) {
                // c2 历史记录

            }
            if (data.indexOf('c4')!==-1) {
                // c2 合同
                // state.epibol.contract = false
            }
            if (data.indexOf('c5')!==-1) {
                // c2 项目
                state.epibol.projectHome = false
            }

            if (data.indexOf('c5_1')!==-1) {
                // c2 项目管理
            }
            if (data.indexOf('c5_2')!==-1) {
                // c2 项目概况
                state.projectSet.projectCustom = false
            }
            if (data.indexOf('c5_3')!==-1) {
                // c2 任务管理（子项目
                state.projectSet.projectTask = false
            }
            if (data.indexOf('c5_4')!==-1) {
                // c2 资源管理
                state.projectSet.projectQuality = false
            }
            if (data.indexOf('c5_4.1')!==-1) {
                // c2 已归档
                state.projectSet.qualityFrist = false
            }
            if (data.indexOf('c5_4.2')!==-1) {
                // c2 内部待审
                state.projectSet.qualitySecond = false
            }
            if (data.indexOf('c5_4.3')!==-1) {
                // c2 内部反馈
                state.projectSet.qualityThird = false
            }
            if (data.indexOf('c5_4.4')!==-1) {
                // c2 客户待审
                state.projectSet.qualityFourth = false
            }
            if (data.indexOf('c5_4.5')!==-1) {
                // c2 客户反馈
                state.projectSet.qualityFifth = false
            }
            if (data.indexOf('c5_5')!==-1) {
                // c2 项目成员管理
                state.projectSet.projectMember = false
            }
            if (data.indexOf('c5_6')!==-1) {
                // c2 项目统计
                state.projectSet.projectStatistics = false
            }
            if (data.indexOf('c5_7')!==-1) {
                // c2 设置
                state.projectSet.self = false
            }
            if (data.indexOf('c5_7.1')!==-1) {
                // c2 项目规范设置
                state.projectSet.projectNorm = false
            }
            if (data.indexOf('c5_7.2')!==-1) {
                // c2 项目工作时间设置
                state.projectSet.projectTitle = false
            }

            if (data.indexOf('c6')!==-1) {
                // c2 团队
                state.epibol.memberManager = false
            }
            if (data.indexOf('c6_1')!==-1) {
                // c2 成员管理
                state.memberMgt = false
            }
            if (data.indexOf('c6_2')!==-1) {
                // c2 授权管理
                state.roleMgt = false
            }
            if (data.indexOf('c7')!==-1) {
                // c2 设置
                state.standardLibrary = false
            }

            this.dispatch('updateMenulistRole')
        },

    },
    actions: {
        /*
            菜单权限管理
        */
            async getMenulistRole({commit, dispatch}) {
            const {data} = await api.getInfoRole();
            const project = await api.taskProjectPage();

            commit('setRole', {id:data.limit.auth_id,project:project.data.project});
        },
        updateMenulistRole({commit}) {
            let accessCode = parseInt(Cookies.get('post_id'));
            accessCode = 1;
            // accessCode = 1;
            // let userType = Cookies.get('user_type')
            // let userType = sessionStorage.user_type;
            let menuList = [], childrenList = [];

            menu.forEach((item, index) => {
                if (item.access) {
                    // 工作台
                    if(item.access === accessCode) {
                            menuList.push(item);
                    }
                } else {
                    menuList.push(item);
                }
                commit('projectMenuList')
                if(index === menu.length-1) {
                    commit('concatProject', {menuList: menuList, item: item})
                }else  if (item.name === "epibol") {
                    commit('epibolMenuList', {menuList: menuList, item: item})
                }


            });
        }
    }

};
export default app;
