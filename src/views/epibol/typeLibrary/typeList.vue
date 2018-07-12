<template>
    <Tree :data="treeMap" :load-data="loadData" :render="renderContent"></Tree>
</template>
<script>
    import qs from 'querystring'

    export default {
        created() {
            this.init();
        },
        data() {
            return {
                treeMap: [
                    {
                        name: '全部',
                        rank: 0,
                        expand: true,
                        render: (h, {root, node, data}) => {
                            return h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%'
                                }
                            }, [
                                h('span', [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-folder-outline'
                                        },
                                        style: {
                                            marginRight: '8px'
                                        }
                                    }),
                                    h('span', data.name)
                                ]),
                                h('span', {
                                    style: {
                                        display: 'inline-block',
                                        float: 'right',
                                        marginRight: '32px'
                                    }
                                }, [
                                    h('Button', {
                                        props: Object.assign({}, this.buttonProps, {
                                            icon: 'ios-plus-empty',
                                            type: 'primary'
                                        }),
                                        style: {
                                            width: '52px'
                                        },
                                        on: {
                                            click: () => {
                                                this.append(data, 'all')
                                            }
                                        }
                                    })
                                ])
                            ]);
                        },
                        children: []
                    }
                ],
                buttonProps: {
                    type: 'ghost',
                    size: 'small',
                }
            }
        },
        methods: {
            init() {
                this.treeMap[0].children = [
                    {
                        name: '一级',
                        expand: true,
                        rank: 1,
                        children: [
                            {
                                name: '2级',
                                expand: true,
                                rank: 2,
                                children: [
                                    {
                                        name: '3级',
                                        expand: true,
                                        rank: 3,
                                    }
                                ]
                            },
                            {
                                name: '2级',
                                expand: true,
                                rank: 2
                            }
                        ]
                    },
                    {
                        name: '我也是一级',
                        expand: true,
                        rank: 1
                    },
                ];
//

//                this._ajax('task/task-type/cate-list', {company_id: 1})
//                    .then(({data}) => {
//                        console.log(12, data.data)
//                        data.data.map((item, index, arr) => {
//                            arr[index].children = item.tasktype
//                        });
//                        this.$set(this.treeMap[0], 'children', data.data);
//                    });
            },
            renderContent(h, {root, node, data}) {
                let folderButton = '';
                let iconFile = false;
                let button = h('Button', {
                    props: Object.assign({}, this.buttonProps, {
                        icon: 'ios-plus-empty'
                    }),
                    style: {
                        marginRight: '8px'
                    },
                    on: {
                        click: () => {
                            this.append(data, data.rank, 'file')
                        }
                    }
                });
                // 需要文件夹按钮的
                if (data.rank === 1) {
                    folderButton = h('Button', {
                        props: Object.assign({}, this.buttonProps, {
                            icon: 'ios-folder-outline'
                        }),
                        style: {
                            marginRight: '8px'
                        },
                        on: {
                            click: () => {
                                this.append(data, data.rank, 'folder')
                            }
                        }
                    })
                }
                // 图标为文件夹的
                if (data.rank === 1 || data.type === 'folder') {
                    iconFile = true
                }
                // 不需要文件按钮的
                if ((data.rank === 2 && data.type === 'file') || data.rank === 3) {
                    button = ''
                }
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: iconFile ? 'ios-folder-outline' : 'ios-paper-outline'
                            },
                            style: {
                                marginRight: '8px',
                                fontSize:'20px'
                            }
                        }),
                        h('span', {
//                            props: Object.assign({}, {
//                                type:'text',
//                                    value: data.name?data.name:data.tasktype_name,
//                                }
//                            ),
                            style: {
                                width: '100px',
                                fontSize:'14px'
                            },
                            on: {
                                click: () => {
                                    this.goTaskList()
                                }
                            }

                        }, [
                            h('Input', {
                                props:{
                                    value: data.name ? data.name : data.tasktype_name
                                },
                                style:{
                                    width:'120px'
                                }
                            })
//                            h('Input', data.name ? data.name : data.tasktype_name)
                        ])
                    ]),
                    h('h1', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
                        }
                    }, [
                        folderButton,
                        button,
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-minus-empty'
                            }),
                            on: {
                                click: () => {
                                    this.remove(root, node, data)
                                }
                            }
                        })
                    ])
                ]);
            },
            append(data, type, fileType) {
                const children = data.children || [];
                let obj = null;
                let title = fileType === 'file' ? '新建文件' : '新建文件夹';
                if (type === 'all') {
                    obj = {
                        name: title,
                        expand: true,
                        rank: 1
                    }
                } else {
                    obj = {
                        name: title,
                        expand: true,
                        rank: type + 1,
                        type: fileType
                    }
                }
                children.push(obj);
                this.$set(data, 'children', children);
            },
            remove(root, node, data) {
                const parentKey = root.find(el => el === node).parent;
                const parent = root.find(el => el.nodeKey === parentKey).node;
                const index = parent.children.indexOf(data);
                parent.children.splice(index, 1);
            },
            loadData(item, callback) {
                setTimeout(() => {
                    const data = [
                        {
                            title: 'children',
                            loading: false,
                            children: []
                        },
                        {
                            title: 'children',
                            loading: false,
                            children: []
                        }
                    ];
                    callback(data);
                }, 1000);
            },
            goTaskList() {
                let count = 0;
                count++;
                setTimeout( ()=> {
                    if (count === 2) {
                    console.log('双击')
                    }
                    count = 0
                }, 300)
//                console.log(12)
            },
            _ajax(url, data) {
                return this.$axios.post(this.GLOBAL.baseRouter + url, qs.stringify(data))
            }
        },

    }
</script>
