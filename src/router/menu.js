export const menu = [
    {
        path: '/project',
        name: 'project',
        title: '项目管理',
        children: [
            {
                path: '/project/home',
                name: 'custom',
                title: '概况',
            }, {
                path: '/project/task',
                name: 'task',
                title: '任务管理',
            }, {
                path: '/project/schedule',
                name: 'schedule',
                title: '项目进度',
            },
            {
                path: '/project/quality',
                name: 'quality',
                title: '质量管理',
            }, {
                path: '/project/pigeonhole',
                name: 'pigeonhole',
                title: '归档文件',
            },
            {
                path: '/project/statistics',
                name: 'statistics',
                title: '项目统计',
            },
            {
                path: '/project/setting',
                name: 'file',
                title: '设置',
            }
        ]
    },
    {
        path: '/epibol',
        name: 'epibol',
        title: '外包公司管理',
        children: [
            {
                path: '/epibol/home',
                name: 'eHome',
                title: '概况页',
            },
            {
                path: '/epibol/bidManage',
                name: 'bidManage',
                title: '投标',
            }, {
                path: '/epibol/contractManage',
                name: 'contractManage',
                title: '合同',
            }, {
                path: '/epibol/projectManage',
                name: 'projectManage',
                title: '项目',
            },
            {
                path: '/epibol/memberManager',
                name: 'memberManager',
                title: '团队',
            },
            {
                path: '/project/statistics',
                name: 'statistics',
                title: '统计',
            }
        ]
    }, {
        path: '/customer',
        name: 'customer',
        title: '客户公司管理',
        children: [
            {
                path: '/customer/home',
                name: 'cHome',
                title: '概况页',
            }, {
                path: '/customer/epibolCompany',
                name: 'epibolCompany',
                title: '合作',
            }, {
                path: '/customer/contractManage',
                name: 'cContractManage',
                title: '合同',
            }, {
                path: '/customer/bidManage',
                name: 'cusBidManage',
                title: '招投标管理',
            },{
                path: '/epibol/projectManage',
                name: 'cProjectManage',
                title: '项目管理',
            }
            
        ]
    }, {
        path: '/depot',
        name: 'depot',
        title: '项目库',
        children: [
            {
                path: '/depot/project',
                name: 'dProject',
                title: '项目库',
            }
        ]
    }, {
        path: '/outsourced',
        name: 'outsourced',
        title: '外包商',
        children: [
            {
                path: '/outsourced/home',
                name: 'oHome',
                title: '公司网页',
            }
        ]
    }, {
        path: '/artist',
        name: 'artist',
        title: '艺术家',
        children: [
            {
                path: '/artist/opus',
                name: 'opus',
                title: '作品集',
                children:[
                    {
                        path:'/artist/opus/info',
                        title: '个人资料/基本管理',
                    } ,
                    {
                        path:'/artist/opus/management',
                        titie:'个人资料/个人主页',
                    }
                ]

            },{
                path:'/artist/projectMember',
                titie:'项目成员',
            }
        ]
    }, {
        path: '/artsquare',
        name: 'artsquare',
        title: '任务大厅',
        children: [
            {
                path: '/artsquare/home',
                name: 'aHome',
                title: '任务大厅',
            }
        ]
    }, {
        path: '/artwiki',
        name: 'artwiki',
        title: '艺术WIKI',
        children: [
            {
                path: '/artwiki/home',
                name: 'awkHome',
                title: '艺术WIKI',
            }
        ]
    }
];