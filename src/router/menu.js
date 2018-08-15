export const menu = [
    {
        path: '/epibol/imPlementer',
        name: 'imPlementer',
        level:'1',
        title: '实施人员',
        access: 3,
        children: [
                {
                    path: '/epibol/imPlementer',
                    name: 'eHome',
                    level:'1-1',
                    title: '我的任务',
                },
        ]


    },
    {
        path: '/epibol/ProjectWorks',
        name: 'workbench',
        level:'1',
        title: '工作台',
        access: 2,
        children: [
        {
            path: '/epibol/ProjectWorks',
            name: 'eHome',
            level:'1-1',
            title: '我的任务',
        },
    ]

    },
    {
        path: '/manager/manager',
        name: 'manager',
        title: '经理工作台',
        level:'1',
        access: 1,
        children: [
            {
                path: '/manager/manager',
                name: 'eHome',
                level:'1-1',
                title: '概况页',
            }
        ]
    },
    {
        path: '/epibol',
        name: 'epibol',
        level:'2',
        title: '公司',
        children: [
            {
                path: '/epibol/home',
                name: 'eHome',
                level:'2-1',
                title: '概况页',
            },
            {
                path: '/epibol/bidManage',
                name: 'bidManage',
                level:'2-2',
                title: '投标',
                auth: 0,
            }, {
                path: '/epibol/contractManage',
                name: 'contractManage',
                level:'2-3',
                title: '合同',
                auth: 1,
            }, {
                path: '/epibol/projectManage',
                name: 'projectManage',
                level:'2-4',
                title: '项目',
            },
            {
                path: '/epibol/memberManager',
                name: 'memberManager',
                level:'2-5',
                title: '团队',

            },
            {
                path: '/epibol/statistics',
                name: 'eStatistics',
                level:'2-6',
                title: '统计',
            }
        ]
    },


];

// export const menu = [
//     {
//         path: '/project',
//         name: 'project',
//         title: '项目管理',
//         children: [
//             {
//                 path: '/project/home',
//                 name: 'custom',
//                 title: '概况',
//             }, {
//                 path: '/project/task',
//                 name: 'task',
//                 title: '任务管理',
//             }, {
//                 path: '/project/quality',
//                 name: 'quality',
//                 title: '资源管理',
//             }, {
//                 path: '/project/projectMember',
//                 name: 'eMember',
//                 title: '团队',
//             }, {
//                 path: '/project/statistics',
//                 name: 'statistics',
//                 title: '统计',
//             }
//         ]
//     },
//     {
//         path: '/epibol',
//         name: 'epibol',
//         title: '公司',
//         children: [
//             {
//                 path: '/epibol/home',
//                 name: 'eHome',
//                 title: '概况页',
//             }, {
//                 path: '/epibol/bidManage',
//                 name: 'bidManage',
//                 title: '投标',
//                 auth: 0,
//             }, {
//                 path: '/epibol/contractManage',
//                 name: 'contractManage',
//                 title: '合同',
//                 auth: 1,
//             }, {
//                 path: '/epibol/projectManage',
//                 name: 'projectManage',
//                 title: '项目',
//             },
//             {
//                 path: '/epibol/memberManager',
//                 name: 'memberManager',
//                 title: '团队',
//
//             },
//             {
//                 path: '/epibol/statistics',
//                 name: 'eStatistics',
//                 title: '统计',
//             }
//         ]
//     }, {
//         //     path: '/customer',
//         //     name: 'customer',
//         //     title: '客户公司管理',
//         //     children: [
//         //         {
//         //             path: '/customer/home',
//         //             name: 'cHome',
//         //             title: '概况页',
//         //         }, {
//         //             path: '/customer/epibolCompany',
//         //             name: 'epibolCompany',
//         //             title: '合作',
//         //         }, {
//         //             path: '/customer/contractManage',
//         //             name: 'cContractManage',
//         //             title: '合同',
//         //         }, {
//         //             path: '/customer/bidManage',
//         //             name: 'cusBidManage',
//         //             title: '招投标管理',
//         //         },{
//         //             path: '/epibol/projectManage',
//         //             name: 'cProjectManage',
//         //             title: '项目管理',
//         //         }
//
//         //     ]
//         // }, {
//         //     path: '/depot',
//         //     name: 'depot',
//         //     title: '项目库',
//         //     children: [
//         //         {
//         //             path: '/depot/project',
//         //             name: 'dProject',
//         //             title: '项目库',
//         //         }
//         //     ]
//         // }, {
//         //     path: '/outsourced',
//         //     name: 'outsourced',
//         //     title: '外包商',
//         //     children: [
//         //         {
//         //             path: '/outsourced/home',
//         //             name: 'oHome',
//         //             title: '公司网页',
//         //         }
//         //     ]
//         // }, {
//         //     path: '/artist',
//         //     name: 'artist',
//         //     title: '艺术家',
//         //     children: [
//         //         {
//         //             path: '/artist/opus',
//         //             name: 'opus',
//         //             title: '作品集',
//
//         //         },{
//         //             path:'/artist/projectMember',
//         //             titie:'项目成员',
//         //         }
//         //     ]
//         // }, {
//         path: '/artsquare',
//         name: 'artsquare',
//         title: '项目大厅',
//         children: [
//             {
//                 path: '/artsquare/home',
//                 name: 'aHome',
//                 title: '任务大厅',
//             }, {
//                 path: '/artsquare/project',
//                 name: 'dProject',
//                 title: '项目库',
//             }
//         ]
//     }, {
//         path: '/artwiki',
//         name: 'artwiki',
//         title: '艺术大厅',
//         children: [
//             {
//                 path: '/artwiki/home',
//                 name: 'awkHome',
//                 title: '艺术大厅',
//             }
//         ]
//     }, {
//         path: '/epibol/imPlementer',
//         name: 'imPlementer',
//         title: '实施人员',
//         access: 3,
//         // component: resolve => { require(['@/views/epibol/imPlementer.vue'], resolve); }
//     }, {
//         path: '/epibol/ProjectWorks',
//         name: 'workbench',
//         title: '工作台',
//         access: 2,
//         // component: resolve => { require(['@/views/epibol/ProjectWork.vue'], resolve); }
//         // }, {
//         //     path: '/epibol/taskClass',
//         //     name: 'setting',
//         //     title: '设置',
//     },
//     {
//         path: '/manager/manager',
//         name: 'manager',
//         title: '经理工作台',
//         access: 1,
//         children: [
//             {
//                 path: '/epibol/home',
//                 name: 'eHome',
//                 title: '概况页',
//             }, {
//                 path: '/epibol/bidManage',
//                 name: 'bidManage',
//                 title: '投标',
//                 auth: 0,
//             }, {
//                 path: '/epibol/contractManage',
//                 name: 'contractManage',
//                 title: '合同',
//                 auth: 1,
//             }, {
//                 path: '/epibol/projectManage',
//                 name: 'projectManage',
//                 title: '项目',
//             }, {
//                 path: '/epibol/memberManager',
//                 name: 'memberManager',
//                 title: '团队',
//             }, {
//                 path: '/epibol/statistics',
//                 name: 'eStatistics',
//                 title: '统计',
//             }
//         ]
//     }
// ];