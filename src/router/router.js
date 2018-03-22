import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['@/views/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => { require(['@//views/error-page/403.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => { require(['@/views/error-page/500.vue'], resolve); }
};


// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    component: Main,
    redirect: '/epibol'
    // children: [
    //     { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: resolve => { require(['@/views/home/home.vue'], resolve); } }
    // ]
};
// 作为Main组件的子页面展示并且在右侧顶部菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/epibol',
        icon: 'ios-folder',
        name: 'epibol',
        title: '外包公司管理',
        component: Main,
        children: [
            {
                path: '/epibol/home',
                icon: 'ios-paper-outline',
                name: 'home',
                title: '概况页',
                component: resolve => { require(['@/views/epibol/home.vue'], resolve); }
            }, {
                path: '/epibol/bidManage',
                icon: 'ios-paper-outline',
                name: 'bidManage',
                title: '招投标管理',
                component: resolve => { require(['@/views/epibol/bidManage.vue'], resolve); }
            }, {
                path: '/epibol/contractManage',
                icon: 'ios-paper-outline',
                name: 'contractManage',
                title: '合同管理',
                component: resolve => { require(['@/views/epibol/contractManage.vue'], resolve); }
            }, {
                path: '/project',
                icon: 'ios-paper-outline',
                name: 'project',
                title: '项目管理',
                component: resolve => { require(['@/views/project/custom.vue'], resolve); },
                children: [
                    {
                        path: '/project/custom',
                        icon: 'ios-paper-outline',
                        name: 'custom',
                        title: '自定义工作台页',
                        component: resolve => { require(['@/views/project/custom.vue'], resolve); }
                    }, {
                        path: '/project/task',
                        icon: 'ios-paper-outline',
                        name: 'task',
                        title: '任务管理',
                        component: resolve => { require(['@/views/project/task.vue'], resolve); }
                    }, {
                        path: '/project/file',
                        icon: 'ios-paper-outline',
                        name: 'file',
                        title: '文件管理',
                        component: resolve => { require(['@/views/project/file.vue'], resolve); }
                    }, {
                        path: '/project/quality',
                        icon: 'ios-paper-outline',
                        name: 'quality',
                        title: '质量管理',
                        component: resolve => { require(['@/views/project/quality.vue'], resolve); }
                    }, {
                        path: '/project/schedule',
                        icon: 'ios-paper-outline',
                        name: 'schedule',
                        title: '进度管理',
                        component: resolve => { require(['@/views/project/schedule.vue'], resolve); }
                    }, {
                        path: '/project/statistics',
                        icon: 'ios-paper-outline',
                        name: 'statistics',
                        title: '项目统计',
                        component: resolve => { require(['@/views/project/statistics.vue'], resolve); }
                    }
                ]
            }, {
                path: '/epibol/setting',
                icon: 'ios-paper-outline',
                name: 'setting',
                title: '设置',
                component: resolve => { require(['@/views/epibol/setting.vue'], resolve); }
            }
        ]
    }, {
        path: '/customer',
        icon: 'ios-folder',
        name: 'cHome',
        title: '客户公司管理',
        component: Main,
        children: [
            {
                path: '/customer/home',
                icon: 'ios-paper-outline',
                name: 'home',
                title: '概况页',
                component: resolve => { require(['@/views/customer/home.vue'], resolve); }
            }, {
                path: '/customer/epibolCompany',
                icon: 'ios-paper-outline',
                name: 'epibolCompany',
                title: '外包公司库',
                component: resolve => { require(['@/views/customer/epibolCompany.vue'], resolve); }
            }, {
                path: '/customer/bidManage',
                icon: 'ios-paper-outline',
                name: 'cusBidManage',
                title: '招投标管理',
                component: resolve => { require(['@/views/customer/bidManage.vue'], resolve); }
            }, {
                path: '/project',
                icon: 'ios-paper-outline',
                name: 'project',
                title: '项目管理',
                component: resolve => { require(['@/views/project/custom.vue'], resolve); },
                children: [
                    {
                        path: '/project/custom',
                        icon: 'ios-paper-outline',
                        name: 'custom',
                        title: '自定义工作台页',
                        component: resolve => { require(['@/views/project/custom.vue'], resolve); }
                    }, {
                        path: '/project/task',
                        icon: 'ios-paper-outline',
                        name: 'task',
                        title: '任务管理',
                        component: resolve => { require(['@/views/project/task.vue'], resolve); }
                    }, {
                        path: '/project/file',
                        icon: 'ios-paper-outline',
                        name: 'file',
                        title: '文件管理',
                        component: resolve => { require(['@/views/project/file.vue'], resolve); }
                    }, {
                        path: '/project/quality',
                        icon: 'ios-paper-outline',
                        name: 'quality',
                        title: '质量管理',
                        component: resolve => { require(['@/views/project/quality.vue'], resolve); }
                    }, {
                        path: '/project/schedule',
                        icon: 'ios-paper-outline',
                        name: 'schedule',
                        title: '进度管理',
                        component: resolve => { require(['@/views/project/schedule.vue'], resolve); }
                    }, {
                        path: '/project/statistics',
                        icon: 'ios-paper-outline',
                        name: 'statistics',
                        title: '项目统计',
                        component: resolve => { require(['@/views/project/statistics.vue'], resolve); }
                    }
                ]
            }
        ]
    },  {
        path: '/group',
        icon: 'ios-folder',
        name: 'group',
        title: '分包项目管理',
        component: Main,
        // redirect: '/group/page2',
        children: [
            {
                path: '/group/task',
                icon: 'ios-paper-outline',
                name: 'task',
                title: '任务管理',
                component: resolve => { require(['@/views/group/task/task.vue'], resolve); }
            },
            {
                path: '/group/page2',
                icon: 'ios-list-outline',
                name: 'page2',
                title: '未使用标签',
                component: resolve => { require(['@/views/group/page2/page2.vue'], resolve); }
            },
            {
                path: '/group/page3',
                icon: 'ios-list-outline',
                name: 'page3',
                title: '任务管理',
                component: resolve => { require(['@/views/group/page1/taskManage.vue'], resolve); }
            },
            {
                path: '/group/page4',
                icon: 'ios-list-outline',
                name: 'page4',
                title: '日历管理',
                component: resolve => { require(['@/views/group/page1/calend.vue'], resolve); }
            },
            {
                path: '/group/page5',
                icon: 'ios-list-outline',
                name: 'page5',
                title: '进度统计',
                component: resolve => { require(['@/views/group/page1/echarts.vue'], resolve); }
            }
        ]
    },
    {
        path: '/page',
        icon: 'ios-paper',
        title: '项目管理',
        name: 'page',
        component: Main,
        children: [
            {
                path: '/page/taskClass',
                icon: 'ios-paper-outline',
                name: 'taskClass',
                title: '任务类别库',
                component: resolve => { require(['@/views/page/taskClass.vue'], resolve); }
            },
            {
                path: '/page/index',
                title: 'Page',
                name: 'page_index',
                component: resolve => { require(['@/views/page/page.vue'], resolve); }
            },
            {
                path: '/page/followUpQuality',
                icon: 'ios-paper-outline',
                title: '质量跟进',
                name: 'followUpQuality',
                component: resolve => { require(['@/views/page/followUpQuality.vue'], resolve); }
            }
        ]
    }
];
//根据左侧的菜单关联到顶部的菜单，且其子页面要在Main组件中展示的路由写在leftTopRouter中
export const leftTopRouter = [
    {
        path: '/epibol',
        icon: 'ios-folder',
        name: 'epibol',
        title: '外包公司管理',
        component: Main,
        children: [
            {
                path: 'home',
                icon: 'ios-paper-outline',
                name: 'home',
                title: '概况页',
                component: resolve => { require(['@/views/epibol/home.vue'], resolve); }
            }, {
                path: 'bidManage',
                icon: 'ios-paper-outline',
                name: 'bidManage',
                title: '招投标管理',
                component: resolve => { require(['@/views/epibol/bidManage.vue'], resolve); }
            }, {
                path: 'contractManage',
                icon: 'ios-paper-outline',
                name: 'contractManage',
                title: '合同管理',
                component: resolve => { require(['@/views/epibol/contractManage.vue'], resolve); }
            }, {
                path: 'projectManage',
                icon: 'ios-paper-outline',
                name: 'projectManage',
                title: '项目管理',
                component: resolve => { require(['@/views/epibol/projectManage.vue'], resolve); }
            }, {
                path: 'setting',
                icon: 'ios-paper-outline',
                name: 'setting',
                title: '设置',
                component: resolve => { require(['@/views/epibol/setting.vue'], resolve); }
            }
        ]
    }, {
        path: '/page/customer',
        icon: 'ios-folder',
        name: 'customer',
        title: '客户公司管理',
        component: Main,
        children: [
            {
                path: 'home',
                icon: 'ios-paper-outline',
                name: 'home',
                title: '概况页',
                component: resolve => { require(['@/views/epibol/home.vue'], resolve); }
            }
        ]
    }, {
        path: '/page/project',
        icon: 'ios-folder',
        name: 'project',
        title: '项目库',
        component: Main,
        children: [
            {
                path: 'home',
                icon: 'ios-paper-outline',
                name: 'home',
                title: '概况页',
                component: resolve => { require(['@/views/epibol/home.vue'], resolve); }
            }
        ]
    }, {
        path: '/page/outsourcer',
        icon: 'ios-folder',
        name: 'outsourcer',
        title: '外包商',
        component: Main,
        children: [
            {
                path: 'home',
                icon: 'ios-paper-outline',
                name: 'home',
                title: '概况页',
                component: resolve => { require(['@/views/epibol/home.vue'], resolve); }
            }
        ]
    }, {
        path: '/page/artist',
        icon: 'ios-folder',
        name: 'artist',
        title: '艺术家',
        component: Main,
        children: [
            {
                path: 'home',
                icon: 'ios-paper-outline',
                name: 'home',
                title: '概况页',
                component: resolve => { require(['@/views/epibol/home.vue'], resolve); }
            }
        ]
    }, {
        path: '/page/atrsquare',
        icon: 'ios-folder',
        name: 'atrsquare',
        title: '艺术广场',
        component: Main,
        children: [
            {
                path: 'home',
                icon: 'ios-paper-outline',
                name: 'home',
                title: '概况页',
                component: resolve => { require(['@/views/epibol/home.vue'], resolve); }
            }
        ]
    }, {
        path: '/page/wiki',
        icon: 'ios-folder',
        name: 'wiki',
        title: '艺术WIKI',
        component: Main,
        children: [
            {
                path: 'home',
                icon: 'ios-paper-outline',
                name: 'home',
                title: '概况页',
                component: resolve => { require(['@/views/epibol/home.vue'], resolve); }
            }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    ...appRouter,
    page500,
    page403,
    page404
];
