<template>
    <Tree class="treeMapContainer" :data="treeMap" :load-data="loadData" :render="renderContent"></Tree>
</template>
<script>
    import qs from 'querystring'

    export default {
        mounted() {
            this.$nextTick(() => {
                this.init();
            })
            document.body.onclick=(e) => {
                e.stopPropagation();
                this.$nextTick(() => {
                    let arrData = (data) => {
                        data.map((item) => {
                                item.btnShow = false;
                            if (item.children) {
                                arrData(item.children)
                            }
                        })
                    };
                    arrData(this.treeMap[0].children);
                })

            }
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
                this.$axios.post(this.GLOBAL.baseRouter + 'newtask/new-task-type/get-types', qs.stringify())
                    .then(({data}) => {
                        if (data.err_code === 0) {
                            let rank = 1, arrData = (data, rank,status) => {
                                data.map((item) => {
                                    item.status = status;
                                    item.rank = rank;
                                    item.btnShow = false;
                                    if (item.children) {
                                        arrData(item.children, rank + 1,item.status)
                                    }
                                })
                            };
                            if (data && Array.isArray(data.data)) {
                                data.data.map((item) => {
                                    if (item.children) {
                                        arrData(item.children, rank,item.status)
                                    }
                                });
                            }
                            this.treeMap[0].children = data.data;
                        }
                    })

            },
            renderContent(h, {root, node, data}) {
                let folderButton = '';
                let iconFile = false;
                let button =  h('div', {
                    style: {fontSize: '12px',
                        padding:'2px 25px',
                        background:'#e4e4e4'},
                    on: {
                        click: () => {
                            this.changeName(data)
                        }
                    }
                }, [
                    h('div', '修改'),
                ]);
                let delButton =  h('div', {
                    style: {fontSize: '12px',
//
                        padding:'2px 25px',
                    background:'#e4e4e4'
                    },
                    on: {
                        click: () => {
                            this.remove(data)
                        }
                    }
                }, [
                    h('div', '删除'),
                ])
                let textTitle = h('span', data.name ? data.name : data.tasktype_name)

                // 名称可以编辑的
                if (data.status !== 0) {
                    textTitle = h('Input',
                        {
                            props: {
                                value: data.name ? data.name : data.tasktype_name
                            },
                            style: {
                                width: '120px'
                            }
                        })
                }

                // 需要文件夹按钮的
                if (data.status === 1 && data.rank !== 2) {
                    folderButton = h('div', {
                        style: {fontSize: '12px',
                            padding:'2px 25px',
                            background:'#e4e4e4'},
                        on: {
                            click: () => {
                                this.append(data)
                            }
                        }
                    }, [
                        h('div', '新增'),
                    ])
                }
                // 图标为文件夹的
                if (data.rank !== 2) {
                    iconFile = true
                }
                // 不需要文件按钮的
                if (true) {
                    button = ''
                }
                // 不需要删除按钮
                if(data.status === 0){
                    delButton = '';
                }

                return h('p', {
                    style: {
                        display: 'inline-block',
                        width: '100%',
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
                            style: {
                                width: '100px',
                                fontSize:'14px',
                                cursor:'pointer'
                            },
                            on: {
                                click: () => {
                                    this.goTaskList(data)
                                }
                            }

                        }, [
                            textTitle
                        ])
                    ]),
//                    h('h1', {
//                        style: {
//                            display: 'inline-block',
//                            float: 'right',
//                            marginRight: '32px',
//                            opacity:'0',
//                        }
//                    }, [
//                        folderButton,
//                        button,
//                        delButton
//
//                    ])
                    h('span',{
                        props:{
                            type:'ios-more'
                        },
                        style:{
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px',
                            marginTop: '6px',
                            fontSize:'20px',
                            cursor: 'pointer'
                        },
                        on: {
                            click: (e) => {
                                this.showSetting(data,e)
                            }
                        }

                    },[
                        h('icon', {
                                props: {
                                    type: 'ios-more'
                                },
                                style: {
                                    display: 'inline-block',
                                    float: 'right',
                                    marginRight: '32px',
                                    marginTop: '6px',
                                    fontSize: '20px',
                                    cursor: 'pointer'
                                },
                            }
                        ),
                        h('h1', {
                            style: {
                                display: 'inline-block',
                                float: 'right',
                                marginRight: '32px',
                                position:'absolute',
                                top:'0px',
                                right:'0px'
//                                opacity: '0',
                            }
                        },
                            data.btnShow?  [folderButton, button, delButton]:''
                           )
                    ])
                ]);
            },
            append(data, type) {
                const children = data.children || [];
                let obj = {
                    name: '新建文件夹'
                };

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
            goTaskList(data) {
                this.$bus.emit('typesDetail',data);
//                if (data.rank === 2) {
//                    this.$axios.post(`${this.GLOBAL.baseRouter}newtask/new-task-type/get-types-detail`, qs.stringify({tid: data.id}))
//                        .then((data) => {
//                            console.log(2, data)
//                        })
//                }
            },
            showSetting(data,e){
                e.stopPropagation();
                this.$set(data,'btnShow',!data.btnShow)

                console.log(12,this.treeMap[0].children)
            },
            closeSetting(e){
                console.log(13,this.treeMap[0].children)
//                e.stopPropagation();
//                let arrData = (data) => {
//                    data.map((item) => {
//                        item.btnShow = false;
//                        if (item.children) {
//                            arrData(item.children)
//                        }
//                    })
//                };
//                arrData(this.treeMap[0].children)

            }

        },

    }
</script>
<style lang="less">
    .treeMapContainer {
        .ivu-tree-children {
            p {
                position: relative;
                &:hover {
                    h1 {
                        opacity: 1 !important;
                        transition: all .3s;
                    }
                }
            }
        }
    }
</style>