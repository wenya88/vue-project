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
export const otherRouter = 
    {
    path: '/',
    name: 'otherRouter',
    component: Main,
    redirect: '/home/home',
    children: [
        { path: '/home/home', title: {i18n: 'home'}, name: 'home_index', component: resolve => { require(['@/views/home/home.vue'], resolve); } }
        // { path: '/home/login', title: {i18n: 'login'}, name: 'login', component: resolve => { require(['@/views/home/login.vue'], resolve); } }
    ]
    // }, {
    //     path: '/home/login',
    //     name: 'login',
    //     component: resolve => { require(['@/views/home/login.vue'], resolve); }
    }
;
// 作为Main组件的子页面展示并且在右侧顶部菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/project',
        icon: 'ios-folder',
        name: 'project',
        title: '项目管理',
        component: Main,
        children: [
            {
                path: '/project/home.vue',
                icon: 'ios-paper-outline',
                name: 'custom',
                title: '概况',
                component: resolve => { require(['@/views/project/home.vue'], resolve); }
            }, {
                path: '/project/task',
                icon: 'ios-paper-outline',
                name: 'task',
                title: '任务管理',
                component: resolve => { require(['@/views/project/task.vue'], resolve); }
            },{
                path: '/project/schedule',
                icon: 'ios-paper-outline',
                name: 'schedule',
                title: '项目进度',
                component: resolve => { require(['@/views/project/schedule.vue'], resolve); }
            },
              {
                path: '/project/quality',
                icon: 'ios-paper-outline',
                name: 'quality',
                title: '质量管理',
                component: resolve => { require(['@/views/project/quality.vue'], resolve); }
              },{
                path: '/project/pigeonhole',
                icon: 'ios-paper-outline',
                name: 'pigeonhole',
                title: '归档文件',
                component: resolve => { require(['@/views/project/pigeonhole.vue'], resolve); }
            },
            {
                path: '/project/statistics',
                icon: 'ios-paper-outline',
                name: 'statistics',
                title: '项目统计',
                component: resolve => { require(['@/views/project/statistics.vue'], resolve); }
            },
            {
                path: '/project/setting',
                icon: 'ios-paper-outline',
                name: 'file',
                title: '设置',
                component: resolve => { require(['@/views/project/setting.vue'], resolve); }
            },
            {
              path: '/project/ImgRoll',
              icon: 'ios-paper-outline',
              name: 'statistics',
              title: '文件标注',
              component: resolve => { require(['@/views/project/components/ImgRoll.vue'], resolve); }
            }
            // {
            // {
            //   path: '/project/vedioEditor',
            //   icon: 'ios-paper-outline',
            //   name: 'statistics',
            //   title: '视频标注组件',
            //   component: resolve => { require(['@/views/project/components/vedioEditor.vue'], resolve); }
            // }
        ]
    },
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
            },
            {
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
                path: '/epibol/projectManage',
                icon: 'ios-paper-outline',
                name: 'projectManage',
                title: '项目管理',
                component: resolve => { require(['@/views/epibol/projectManage.vue'], resolve); }
            },
            {
                path: '/epibol/memberManager',
                icon: 'ios-paper-outline',
                name: 'memberManager',
                title: '成员管理',
                component: resolve => { require(['@/views/epibol/memberManager.vue'], resolve); }
            },
            {
                path: '/epibol/taskClass',                icon: 'ios-paper-outline',
                name: 'setting',
                title: '设置',
                component: resolve => { require(['@/views/epibol/typeLibrary/taskClass.vue'], resolve); }            },
            {
            path: '/epibol/imPlementer',
            icon: 'ios-paper-outline',
            name: 'setting',
            title: '实施人员',
            component: resolve => { require(['@/views/epibol/imPlementer.vue'], resolve); }
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
                path: '/epibol/contractManage',
                icon: 'ios-paper-outline',
                name: 'contractManage',
                title: '合同管理',
                component: resolve => { require(['@/views/epibol/contractManage.vue'], resolve); }
            }, {
                path: '/customer/bidManage',
                icon: 'ios-paper-outline',
                name: 'cusBidManage',
                title: '招投标管理',
                component: resolve => { require(['@/views/customer/bidManage.vue'], resolve); }
            }, {
                path: '/epibol/projectManage',
                icon: 'ios-paper-outline',
                name: 'projectManage',
                title: '项目管理',
                component: resolve => { require(['@/views/epibol/projectManage.vue'], resolve); }
            }
        ]
    }, {
        path: '/depot',
        icon: 'ios-folder',
        name: 'depot',
        title: '项目库',
        component: Main,
        // redirect: '/depot/project',
        children: [
            {
                path: '/depot/project',
                icon: 'ios-paper-outline',
                name: 'dProject',
                title: '项目库',
                component: resolve => { require(['@/views/depot/project.vue'], resolve); }
            }
        ]
    }, {
        path: '/outsourced',
        icon: 'ios-folder',
        name: 'outsourced',
        title: '外包商',
        component: Main,
        // redirect: '/depot/project',
        children: [
            {
                path: '/outsourced/home',
                icon: 'ios-paper-outline',
                name: 'oHome',
                title: '公司网页',
                component: resolve => { require(['@/views/outsourced/home.vue'], resolve); }
            }
        ]
    }, {
        path: '/artist',
        icon: 'ios-folder',
        name: 'artist',
        title: '艺术家',
        component: Main,
        // redirect: '/depot/project',
        children: [
            {
                path: '/artist/opus',
                icon: 'ios-paper-outline',
                name: 'opus',
                title: '作品集',
                component: resolve => { require(['@/views/artist/opus.vue'], resolve); }
            }
        ]
    }, {
        path: '/artsquare',
        icon: 'ios-folder',
        name: 'artsquare',
        title: '艺术广场',
        component: Main,
        // redirect: '/depot/project',
        children: [
            {
                path: '/artsquare/home',
                icon: 'ios-paper-outline',
                name: 'aHome',
                title: '艺术广场',
                component: resolve => { require(['@/views/artsquare/home.vue'], resolve); }
            }
        ]
    }, {
        path: '/artwiki',
        icon: 'ios-folder',
        name: 'artwiki',
        title: '艺术WIKI',
        component: Main,
        // redirect: '/depot/project',
        children: [
            {
                path: '/artwiki/home',
                icon: 'ios-paper-outline',
                name: 'awkHome',
                title: '艺术WIKI',
                component: resolve => { require(['@/views/artwiki/home.vue'], resolve); }
            },
            {
                path: '/artwiki/excel',
                icon: 'ios-paper-outline',
                name: 'awkExcek',
                title: 'excel解析',
                component: resolve => { require(['@/views/artwiki/excel.vue'], resolve); }
            }
        ]
     },
    {
        path: '/typeLibrary',
        icon: 'ios-paper',
        title: '项目管理',
        name: 'typeLibrary',
        component: Main,
        children: [
            // {
            //     path: '/page/taskClass',
            //     icon: 'ios-paper-outline',
            //     name: 'taskClass',
            //     title: '任务类别库',
            //     component: resolve => { require(['@/views/page/taskClass.vue'], resolve); }
            // },
            // {
            //     path: '/page/index',
            //     title: 'Page',
            //     name: 'page_index',
            //     component: resolve => { require(['@/views/page/page.vue'], resolve); }
            // },
            // {
            //     path: '/page/grid',
            //     title: '拖拽功能',
            //     name: 'grid',
            //     component: resolve => { require(['@/views/page/grid/grid.vue'], resolve); }
            // },
            // {
            //     path: '/page/layout',
            //     title: '拖拽布局',
            //     name: 'layout',
            //     component: resolve => { require(['@/views/page/layout/grid.vue'], resolve); }
            // }
        ]    }
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
