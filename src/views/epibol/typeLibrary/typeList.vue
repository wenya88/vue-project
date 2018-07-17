<template>
    <div>
        <Tree class="treeMapContainer" :data="treeMap" :load-data="loadData" :render="renderContent"></Tree>
        <!--复制-->
        <Modal
                v-model="copy.show"
                title="选择复制目录"
                @on-ok="copyNode"
                @on-cancel="copy.show = false">
            <Select v-model="copy.newId" style="width:200px">
                <Option v-for="item in folder" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
        </Modal>
        <!--删除-->
        <Modal
                v-model="del.show"
                @on-ok="remove"
                @on-cancel="del.show = false">
            请确认删除!
        </Modal>
        <!--修改名称-->
        <Modal
                v-model="changName.show"
                @on-ok="selecText"
                @on-cancel="changName.show = false">
            <Input v-model="newTreeTitle" style="width: 90%" placeholder="请输入新的名称"></Input>
        </Modal>
    </div>
</template>
<script>
    import qs from 'querystring'

    export default {
        mounted() {
            this.$nextTick(() => {
                this.init();
            });
            document.body.onclick = (e) => {
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
                });
            }
        },
        data() {
            return {
                company_id: sessionStorage.getItem('userId'),
                copy: {
                    show: false,
                    id: '',
                    newId: '',
                },
                del: {
                    show: false,
                    id: '',
                },
                changName: {
                    show: false,
                    id: '',
                    newId: '',
                },
                folder: [],
                newTreeTitle: '',
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
                        data.data[1].children[1].children.push({id: 7, name: '撒的'});
                        if (data.err_code === 0) {
                            let rank = 1, arrData = (data, rank, status) => {
                                data.map((item) => {
                                    item.status = status;
                                    item.rank = rank;
                                    item.btnShow = false;
                                    item.editText = false;
                                    if (item.status !== 0 && item.rank === 1) {
                                        this.folder.push(JSON.parse(JSON.stringify(item)))
                                    }
                                    if (item.children) {
                                        arrData(item.children, rank + 1, item.status)
                                    }
                                })
                            };
                            if (data && Array.isArray(data.data)) {
                                data.data.map((item) => {
                                    item.btnShow = false;
                                    if (item.children) {
                                        arrData(item.children, rank, item.status)
                                    }
                                });
                            }
                            this.treeMap[0].children = data.data;
                            console.log(1,this.treeMap[0].children)
                        }
                    })

            },
            renderContent(h, {root, node, data}) {
                let folderButton = '';
                let iconFile = false;
                let button = h('div', {
                    style: {
                        fontSize: '12px',
                        padding: '2px 25px',
                        background: '#e4e4e4'
                    },
                    on: {
                        click: () => {
                            this.changeName(data)
                        }
                    }
                }, [
                    h('div', '修改'),
                ]);
                let copyButton = h('div', {
                    style: {
                        fontSize: '12px',
                        padding: '2px 25px',
                        background: '#e4e4e4'
                    },
                    on: {
                        click: () => {
                            this.copyButton(root, node, data)
                        }
                    }
                }, [
                    h('div', '复制'),
                ]);
                let delButton = h('div', {
                    style: {
                        fontSize: '12px',
                        padding: '2px 25px',
                        background: '#e4e4e4'
                    },
                    on: {
                        click: () => {
                            this.delButton(root, node, data)
                        }
                    }
                }, [
                    h('div', '删除'),
                ]);
                let textTitle = h('span', data.name ? data.name : data.tasktype_name);

                // 名称可以编辑的
                if (data.editText === true) {
                    textTitle = h('Input',
                        {
                            props: {
                                value: data.name ? data.name : data.tasktype_name
                            },
                            style: {
                                width: '120px',
                                fontSize: '12px'
                            },
                            on: {}
                        }
                    )
                }

                // 需要文件夹按钮的
                if (data.status === 1 && data.rank !== 2) {
                    folderButton = h('div', {
                        style: {
                            fontSize: '12px',
                            padding: '2px 25px',
                            background: '#e4e4e4'
                        },
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
                if (data.status === 0) {
                    button = ''
                }
                // 不需要删除按钮
                if (data.status === 0) {
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
                                fontSize: '20px'
                            }
                        }),
                        h('span', {
                            style: {
                                width: '100px',
                                fontSize: '14px',
                                cursor: 'pointer'
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
                    h('section', {
                        props: {
                            type: 'ios-more'
                        },
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px',
                            marginTop: '6px',
                            fontSize: '20px',
                            cursor: 'pointer',
                            opacity: 0
                        },
                        on: {
                            click: (e) => {
                                this.showSetting(data, e)
                            }
                        }

                    }, [
                        h('icon', {
                                props: {
                                    type: 'ios-more'
                                },
                                style: {
                                    display: 'inline-block',
                                    float: 'right',
                                    marginRight: '32px',
                                    fontSize: '20px',
                                    cursor: 'pointer'
                                },
                            }
                        ),
                        h('h1', {
                                style: {
                                    position: 'absolute',
                                    top: '0px',
                                    right: '0px',
                                    display: 'inline-block',
                                    marginRight: '32px',
                                    zIndex: '3'
                                }
                            },
                            data.btnShow ? [folderButton, button, copyButton, delButton] : ''
                        )
                    ])
                ]);
            },
            /* 添加 */
            append(data, type) {
                /*const children = data.children || [];
                let name = data.rank === 1 ? '新建文件' : '新建文件夹';
                let rank = null;
                if (!type) {
                    rank = data.rank + 1
                }
                let obj = {
                    name: name,
                    btnShow: false,
                    status: type ? 1 : data.status,
                    rank: rank
                };
                children.push(obj);
                this.$set(data, 'children', children);*/

                /* 新增 */
                this.$axios.post(this.GLOBAL.baseRouter + 'task/task-type/cate-add', qs.stringify({
                    name: data.name,
                    company_id: this.company_id
                }))
                    .then(() => {
                    })
            },

            /*异步*/
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
            /*点击进入详情*/
            goTaskList(data) {

                this.$bus.emit('typesDetail', data);
            },
            /*打开右边菜单*/
            showSetting(data, e) {
                e.stopPropagation();
                let arrData = (data) => {
                    data.map((item) => {
                        item.btnShow = false;
                        if (item.children) {
                            arrData(item.children)
                        }
                    })
                };
                arrData(this.treeMap[0].children);

                this.$set(data, 'btnShow', !data.btnShow)

            },
            /*删除弹窗*/
            delButton(root, node, data) {
                this.del.show = true;
                this.del.id = data.id
            },
            /*删除*/
            remove() {
                this.$axios.post(this.GLOBAL.baseRouter + 'newtask/new-task-type/del', qs.stringify({tid: this.del.id}))
                    .then((data) => {
                    });
                this.init();
                this.del.show = false;
            },
            /*更改名弹窗*/
            changeName(data) {
                this.changName.show = true;
                console.log(this.newTreeTitle)
            },
            /*更改名字*/
            selecText(data) {
                this.$set(data, 'name', this.name);
            },
            /*复制弹窗*/
            copyButton(data) {
                this.copy.show = !this.copy.show;
                this.copy.id = data.id;

            },
            /*复制*/
            copyNode() {
                this.$axios.post(this.GLOBAL.baseRouter + 'newtask/new-task-type/copy-type', qs.stringify({
                    tid: this.copy.id,
                    togid: this.copy.newId
                }))
                    .then((data) => {
                    });
                this.copy.show = false;
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
                    section {
                        opacity: 1 !important;
                        transition: all .3s;
                    }
                }
                section {
                    h1 {
                        div:nth-of-type(1) {
                            padding-top: 5px;
                        }
                        div:nth-last-of-type(1) {
                            padding-bottom: 5px;
                        }
                    }
                }
            }
        }
    }
</style>