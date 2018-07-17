<template>
    <div>
        <Tree class="treeMapContainer" :data="treeMap" :load-data="loadData" :render="renderContent"></Tree>
        <Modal
                v-model="modal1"
                title="选择复制目录"
                @on-ok="copy"
                @on-cancel="modal1 = false">
            <Select v-model="newCopyId" style="width:200px">
                <Option v-for="item in folder" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
        </Modal>
        <Modal
                v-model="modal2"
                @on-ok="remove"
                @on-cancel="modal2 = false">
            请确认删除!
        </Modal>
        <Modal
                v-model="modal3"
                @on-ok="remove"
                @on-cancel="modal3 = false">
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
                modal1: false,
                modal2: false,
                modal3: false,
                newCopyId: '',
                copyId: '',
                delId: '',
                folder: [],
                newTreeTitle:'',
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
                        data.data[1].children[1].children.push({id: 7, name: '撒的'})
                        if (data.err_code === 0) {
                            let rank = 1, arrData = (data, rank, status) => {
                                data.map((item) => {

                                    item.status = status;
                                    item.rank = rank;
                                    item.btnShow = false;
                                    item.editText = false;
                                    if (item.status !== 0 && item.rank === 1) {
                                        this.folder.push(JSON.parse(JSON.stringify(item)))
                                        console.log(1, this.folder)
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
                                    top:'0px',
                                    right: '0px',
                                    display: 'inline-block',
                                    marginRight: '32px',
                                    zIndex:'3'
                                }
                            },
                            data.btnShow ? [folderButton, button, copyButton, delButton] : ''
                        )
                    ])
                ]);
            },
            /* 添加 */
            append(data, type) {
                const children = data.children || [];
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
                this.$set(data, 'children', children);
            },
            delButton(root, node, data) {
                this.modal2 = true;
                this.delId = data.id
            },
            /*删除*/
            remove() {
                this.$axios.post(this.GLOBAL.baseRouter + 'newtask/new-task-type/del', qs.stringify({tid: this.delId}))
                    .then((data) => {

                    });
//                this.init();
                this.modal2 = false;
                this.modal3 = false;
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
            /*更改名字*/
            changeName(data) {
                this.modal3 = !this.modal3
//                this.$set(data, 'editText', !data.editText);
            },
            selecText(data) {
                this.$set(data, 'editText', !data.editText);
            },
            copyButton(data) {
                this.modal1 = !this.modal1;
                this.copyId = data.id;

            },
            copy() {
                this.$axios.post(this.GLOBAL.baseRouter + 'newtask/new-task-type/copy-type', qs.stringify({
                    tid: this.copyid,
                    togid: this.newCopyId
                }))
                    .then((data) => {
                    })
                this.modal1 =false
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
                section{
                    h1{
                        div:nth-of-type(1){
                            padding-top: 5px;
                        }
                        div:nth-last-of-type(1){
                            padding-bottom: 5px;
                        }
                    }
                }
            }
        }
    }
</style>