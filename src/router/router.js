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
            { path: '/home/home', title: { i18n: 'home' }, name: 'home_index', component: resolve => { require(['@/views/home/home.vue'], resolve); } },
            {
                path: '/home/personalCenter',
                icon: 'ios-folder',
                name: '/home/personalCenter',
                title: '个人中心',
                component: resolve => { require(['@/views/personalCenter/index.vue'], resolve); },
                children:[
                    {
                        path: '/',
                        icon: 'ios-paper-outline',
                        name: 'personalCenter',
                        title: '艺术WIKI',
                        meta:{title:'个人设置'},
                        component: resolve => { require(['@/views/personalCenter/info.vue'], resolve); },
                    },
                    {
                        path: 'b',
                        icon: 'ios-paper-outline',
                        name: 'personalCenter',
                        title: '艺术WIKI',
                        meta:{title:'个人设置'},
                        component: resolve => { require(['@/views/personalCenter/certification/index1.vue'], resolve); }
                    },
                    {
                        path: 'c',
                        icon: 'ios-paper-outline',
                        name: 'personalCenter',
                        title: '艺术WIKI',
                        meta:{title:'个人设置'},
                        component: resolve => { require(['@/views/personalCenter/certification/index2.vue'], resolve); }
                    }
                ]
            }
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
                path: '/project/home',
                icon: 'ios-paper-outline',
                name: 'custom',
                title: '概况',
                meta:{role:'c5_2',title:'概况'},
                component: resolve => { require(['@/views/project/home.vue'], resolve); }
            },
            {
                path: '/project/task',
                icon: 'ios-paper-outline',
                name: 'task',
                title: '任务管理',
                meta:{role:'c5_3',title:'任务管理'},
                component: resolve => { require(['@/views/project/task.vue'], resolve); },
                children:[{
                    path: '/project/kanban',
                    component: resolve => { require(['@/views/project/task/tasklist.vue'], resolve); },
                },{
                    path: '/project/jinduguanli',
                    component: resolve => { require(['@/views/project/schedule.vue'], resolve); },
                }]
            },
            {
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
                meta:{role:'c5_4',title:'资源管理'},
                component: resolve => { require(['@/views/project/quality.vue'], resolve); }
            }, {
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
                meta:{role:'c5_6',title:'统计'},
                component: resolve => { require(['@/views/project/statistics.vue'], resolve); }
            },
            {
                path: '/project/statisticsDetails/:style',
                icon: 'ios-paper-outline',
                name: 'statisticsDetails',
                title: '统计详情',
                component: resolve => { require(['@/views/project/proStat/statisticsDetails.vue'], resolve); }
            },
            {
                path: '/project/setting',
                icon: 'ios-paper-outline',
                name: 'Psetting',
                title: '设置',
                meta:{role:'c5_7'},
                component:resolve=>{ require (['@/views/projectSet/projectTiemSet.vue'],resolve)}
            },
            {
                path: '/project/details',
                icon: 'ios-paper-outline',
                name: 'file',
                title: '任务管理详情',
                meta:{title:'任务管理详情'},
                component:resolve=>{ require (['@/views/project/task/taskInfoPop/taskInfoPop.vue'],resolve)}
            },
            {
                path:'/project/projectMember',
                titie:'项目成员',
                meta:{role:'c5_5',title:'团队'},
                component: resolve => { require(['@/views/projectSet/projectTiemSet/component/peopleSet.vue'], resolve);},
            },
            {
                path:'/project/imgEditorTwo',
                name:'imgEditorTwo',
                title:'2D显示标注2.0',
                component:resolve =>{require(['@/views/project/components/imgEditorTwo.vue'],resolve);}
            }
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
                name: 'eHome',
                title: '概况页',
                meta: {role: 'c1_1',title:'概况'},
                component: resolve => { require(['@/views/epibol/home.vue'], resolve); }
            },
            {
                path: '/epibol/bidManage',
                icon: 'ios-paper-outline',
                name: 'bidManage',
                title: '投标',
                meta: {role: 'c2'},
                component: resolve => { require(['@/views/epibol/bidManage.vue'], resolve); }
            },
            {
                path:'/epibol/ManageDetails/:id/:type',
                icon: 'ios-paper-outline',
                name: 'ManageDetails',
                title: '投标详情',
                meta: {title:'任务详情'},
                component: resolve => { require(['@/views/epibol/bidManage/component/bidDetails.vue'], resolve); }
            },
            {
                path: '/epibol/contractManage',
                icon: 'ios-paper-outline',
                name: 'contractManage',
                title: '合同',
                meta: {role: 'c4',title:'合同'},
                component: resolve => { require(['@/views/epibol/contractManage.vue'], resolve); }
            },
            {
                path: '/epibol/contractData',
                icon: 'ios-paper-outline',
                name: 'contractData',
                title: '新增合同',
                meta:{title:'合同'},
                component: resolve => { require(['@/views/epibol/contractManage/component/contractData.vue'], resolve); }
            },
            {
                path: '/epibol/projectManage',
                icon: 'ios-paper-outline',
                name: 'projectManage',
                title: '项目',
                meta:{title:'项目'},
                component: resolve => { require(['@/views/epibol/projectManage.vue'], resolve); }
            },
            {
                path: '/manager/manager',
                icon: 'ios-paper-outline',
                name: 'manager',
                title: '经理工作台',
                meta:{role:1,title:'我的工作'},
                component: resolve => { require(['@/views/manager/manager.vue'], resolve); }
            },
            {
                path: '/manager/setSchedule',
                icon: 'ios-paper-outline',
                name: 'setSchedule',
                title: '日程安排',
                meta:{title:'日程安排'},
                component: resolve => { require(['@/views/manager/setSchedule.vue'], resolve); }
            },

            {
                path: '/epibol/memberManager',
                icon: 'ios-paper-outline',
                name: 'memberManager',
                title: '团队',
                meta:{role:'c6',title:'团队'},
                component: resolve => { require(['@/views/epibol/memberManager.vue'], resolve); }
            },
            {
                path: '/epibol/statistics',
                icon: 'ios-paper-outline',
                name: 'eStatistics',
                title: '统计',
                meta:{title:'统计'},
                component: resolve => { require(['@/views/epibol/statistics.vue'], resolve); }
            },
            {
                path: '/epibol/taskClass',
                icon: 'ios-paper-outline',
                name: '设置',
                title: '设置',
                mate:{role:'c7',title:'设置'},
                // component: resolve => { require(['@/views/epibol/typeLibrary/taskClass.vue'], resolve); }
                component: resolve => { require(['@/views/epibol/companySet.vue'], resolve); },
                children:[
                    {
                        path:'/',
                        name: 'taskClass',
                        component: resolve => { require(['@/views/epibol/typeLibrary/taskClass.vue'], resolve); }
                    },
                    {
                        path:'companyInformation',
                        name: 'companyInformation',
                        title:'企业资料',
                        component: resolve => { require(['@/views/epibol/certification/index.vue'], resolve); }
                    },
                    // {
                    //     path:'companyCertification',
                    //     name: 'companyCertification',
                    //     component: resolve => { require(['@/views/epibol/certification/companyCertification.vue'], resolve); }
                    // },
                    // {
                    //     path:'companySignature',
                    //     name: 'companySignature',
                    //     component: resolve => { require(['@/views/epibol/certification/companySignature.vue'], resolve); }
                    // },
                    // {
                    //     path:'companyContract',
                    //     name: 'companyContract',
                    //     component: resolve => { require(['@/views/epibol/certification/companyContract.vue'], resolve); }
                    // },
                ]
            },
            {
                path: '/epibol/imPlementer',
                icon: 'ios-paper-outline',
                name: 'imPlementer',
                title: '实施人员',
                meta:{role:3,title:'我的工作'},
                component: resolve => { require(['@/views/epibol/imPlementer.vue'], resolve); }
            }, {
                path: '/epibol/ProjectWorks',
                icon: 'ios-paper-outline',
                name: 'workbench',
                title: '工作台',
                meta:{role:2},
                component: resolve => { require(['@/views/epibol/ProjectWorks.vue'], resolve); }
            }, {
                path: '/epibol/3D',
                icon: 'ios-paper-outline',
                name: '3D',
                title: '3D',
                component: resolve => { require(['@/views/project/components/threeModule.vue'], resolve); }
            },
            {
                path: '/epibol/contractDetails',
                icon: 'ios-paper-outline',
                name: 'contractDetails',
                title: '合同详情',
                component: resolve => { require(['@/views/epibol/contractManage/component/contractDetails.vue'], resolve); }
            },
               {
                path: '/epibol/addElectronicContract',
                icon: 'ios-paper-outline',
                name: 'addElectronicContract',
                title: '电子合同',
                   meta:{title:'合同'},
                component: resolve => { require(['@/views/epibol/contractManage/component/electronicContract'], resolve); }
            },

        ]
    }, {
        path: '/customer',
        icon: 'ios-folder',
        name: 'customer',
        title: '客户公司管理',
        component: Main,
        children: [
            {
                path: '/customer/home',
                icon: 'ios-paper-outline',
                name: 'cHome',
                title: '概况页',
                component: resolve => { require(['@/views/customer/home.vue'], resolve); }
            }, {
                path: '/customer/epibolCompany',
                icon: 'ios-paper-outline',
                name: 'epibolCompany',
                title: '合作',
                meta:{role:'c3',title:'合作'},
                component: resolve => { require(['@/views/customer/epibolCompany.vue'], resolve); },

            }, {
                path: '/customer/contractManage',
                icon: 'ios-paper-outline',
                name: 'cContractManage',
                title: '合同',
                meta:{title:'合同'},
                component: resolve => { require(['@/views/customer/contractManage.vue'], resolve); }
            },{
                path:'/customer/contractData',
                title:'合同详情',
                component: resolve => { require(['../views/customer/contractManage/component/contractData.vue'], resolve); }
            },
            {
                path: '/customer/bidManage',
                icon: 'ios-paper-outline',
                name: 'cusBidManage',
                title: '招投标管理',
                component: resolve => { require(['@/views/customer/bidManage.vue'], resolve); }
            },{
                path: '/epibol/projectManage',
                icon: 'ios-paper-outline',
                name: 'cProjectManage',
                title: '项目管理',
                component: resolve => { require(['@/views/epibol/projectManage.vue'], resolve); }
            }
            ,{
                path: '/customer/payManage/:id',
                icon: 'ios-paper-outline',
                name: 'cpayManage',
                title: '支付',
                component: resolve => { require(['@/views/customer/payManage.vue'], resolve); }
            }
            ,{
                path: '/customer/paySkip',
                icon: 'ios-paper-outline',
                name: 'paySkip',
                title: '支付跳转',
                component: resolve => { require(['@/views/customer/paySkip.vue'], resolve); }
            }

        ]
    }, {
        //     path: '/depot',
        //     icon: 'ios-folder',
        //     name: 'depot',
        //     title: '项目库',
        //     component: Main,
        //     // redirect: '/depot/project',
        //     children: [
        //         {
        //             path: '/depot/project',
        //             icon: 'ios-paper-outline',
        //             name: 'dProject',
        //             title: '项目库',
        //             component: resolve => { require(['@/views/depot/project.vue'], resolve); }
        //         }
        //     ]
        // }, {
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
        title: '任务大厅',
        component: Main,
        // redirect: '/depot/project',
        children: [
            {
                path: '/artsquare/home',
                icon: 'ios-paper-outline',
                name: 'aHome',
                title: '任务大厅',
                meta:{title:'任务大厅'},
                component: resolve => { require(['@/views/artsquare/home.vue'], resolve); }
            }, {
                path: '/artsquare/project',
                icon: 'ios-paper-outline',
                name: 'dProject',
                title: '项目库',
                meta:{title:'项目库'},
                component: resolve => { require(['@/views/artsquare/project.vue'], resolve); }
            }
        ]
    }, {
        path: '/artwiki',
        icon: 'ios-folder',
        name: 'artwiki',
        title: '艺术大厅',
        component: Main,
        // redirect: '/depot/project',
        children: [
            {
                path: '/artwiki/home',
                icon: 'ios-paper-outline',
                name: 'awkHome',
                title: '艺术大厅',
                component: resolve => { require(['@/views/artwiki/home.vue'], resolve); }
            }
            // {
            //     path: '/artwiki/excel',
            //     icon: 'ios-paper-outline',
            //     name: 'awkExcek',
            //     title: 'excel解析',
            //     component: resolve => { require(['@/views/artwiki/excel.vue'], resolve); }
            // }
        ]
    },
    {
        path: '/typeLibrary',
        icon: 'ios-paper',
        title: '项目管理',
        name: 'typeLibrary',
        component: Main,
        children: [
            {
                path: '/page/taskClass',
                icon: 'ios-paper-outline',
                name: 'taskClass',
                title: '任务类别库',
                component: resolve => { require(['@/views/page/taskClass.vue'], resolve); }
            },
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
