<template>
    <div class="typelibLeftContainer">
        <div class="addTypelibHeader">
            <span>类型库</span>
            <a @click="append(null, 'all')">+ 新增文件夹</a>
        </div>

        <div class="typeTree" style="width: 95%;height: 90%;overflow: auto;position: absolute">
            <Tree class="treeMapContainer" @on-select-change="alert(1)" @on-toggle-expand="showTree" :data="treeMap" :render="renderContent"></Tree>
        </div>
        <!--<p class="shade"></p>-->
        <!--复制-->
        <Modal
                class="treeMapWindow"
                v-model="copy.show"
                title="选择复制目录"
                @on-ok="copyNode"
                @on-cancel="copy.show = false">
            <Select v-model="copy.newId" style="width:200px">
                <Option v-for="(item,index) in folder" :value="item.cate_id" :key="index">{{ item.name }}</Option>
            </Select>
        </Modal>
        <!--删除-->
        <Modal
                class="treeMapWindow"
                title="删除"
                v-model="del.show"
                @on-ok="remove"
                @on-cancel="del.show = false">
            请确认删除!
        </Modal>
        <!--修改名称-->
        <Modal
                class="treeMapWindow"
                title="修改"
                v-model="changName.show"
                @on-ok="selecText"
                @on-cancel="changName.show = false">
            <Input v-model="changName.value" style="width: 90%" placeholder="请输入新的名称"></Input>
        </Modal>

        <!--上传组件测试-->
        <!--<v-upload></v-upload>-->
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex'
    import qs from 'querystring'
    import vUpload from '@/components/upload.vue'
    import api from 'api'

    export default {
        mounted() {
            /*树状图初始化*/
            this.init();
            /*事件监听取消...菜单*/
//            document.body.onclick = (e) => {
//                e.stopPropagation();
//                let arrData = (data) => {
//                    data.map((item) => {
//                        item.btnShow = false;
//                        if (item.children) {
//                            arrData(item.children)
//                        }
//                    })
//                };
//                arrData(this.treeMap[0].children);
//            };
            /*info触发树状图更新*/
            this.$bus.on('treeUpdate', (data) => {
                this.init();
            });
        },
        data() {
            return {

                expandArray: JSON.parse(sessionStorage.getItem('expand')) || [],
                expandDetails: JSON.parse(sessionStorage.getItem('expandDetails')) || [],
                company_id: sessionStorage.getItem('userId'),
                copy: {
                    show: false,
                    id: '',
                    newId: '',
                },
                del: {
                    show: false,
                    id: '',
                    data: '',
                },
                changName: {
                    show: false,
                    id: '',
                    value: '',
                },
                folder: [],
                newTreeTitle: '',
                treeMap: [
                    {
                        name: '全部',
                        rank: 0,
                        expand: true,
                        render: (h, {root, node, data}) => {
                            // return h('span', {
                            //     style: {
                            //         display: 'inline-block',
                            //         width: '100%'
                            //     }
                            // })
                                // [
                                // h('span',),
                                // h('span', {
                                //     style: {
                                //         display: 'inline-block',
                                //         float: 'right',
                                //         marginRight: '32px'
                                //     }
                                // },
                                    // [
                                    // h('Button', {
                                    //     props: Object.assign({}, this.buttonProps, {
                                    //         icon: 'ios-plus-empty',
                                    //         type: 'primary'
                                    //     }),
                                    //     style: {
                                    //         width: '52px'
                                    //     },
                                    //     on: {
                                    //         click: () => {
                                    //             alert(111)
                                    //             console.log(data);
                                    //             // this.append(data, 'all')
                                    //         }
                                    //     }
                                    // })
                                // ]
                                // )
                            // ]);
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
            ...mapActions(['setDefIdAction']),
            async init() {
                let {data} = await api.taskCateList()
                if (data.err_code === 0 || type) {
                    /*一级处理*/
                    let rank = 0;
                    if (data && Array.isArray(data.data)) {
                        data.data.map((item, index) => {
                            let expand = '';
                            item.btnShow = false;    // 右侧菜单
                            item.rank = rank;

                            /*给系统默认添加标识*/
                            if (item.cate_id === '1') {
                                item.status = 0      // 系统默认
                            }
                            /*展开之前选中的分类*/
                            this.showExpand(item);
                            /*展开点击了详情的分类  默认展示系统默认*/
                            if (this.expandDetails[0] && item.cate_id === this.expandDetails[0].id) {
                                item.expand = true;
                            } else if (index === 0 && !this.expandDetails[0]) {
                                item.expand = true;
                                expand = 'expand'
                            }
                            /*二级遍历处理*/
                            if (item.children) {
                                this.arrData(item.children, rank + 1, item.status, expand)
                            }
                        });
                    }
                    this.treeMap[0].children = data.data;

                } else {
                    this.$Message.error(data.err_message)
                }
            },
            /*递归遍历*/
            arrData(data, rank, status, expand) {
                data.map((item, index) => {
                    item.status = status;
                    item.rank = rank;
                    item.btnShow = false;
                    item.editText = false;
                    /*展开之前选中的分类*/
                    this.showExpand(item);

                    /*存在类别*/
                    if (item.tasktype) {
                        item.children = item.tasktype;
                        item.isTasktype = true

                        /*展开点击了详情的分类  默认展示并获得id*/
                        if (item.cate_id === this.expandDetails[1]) {
                            item.expand = true;
                        }
                        else
                            if (index === 0 && expand === 'expand' && !this.expandDetails[1]) {
                            item.expand = true;
                        }

                        /*获取类别id 默认加载的类别id*/
                        if (this.expandDetails[2]) {
                            this.setDefIdAction(this.expandDetails[2]);

                            item.children.map((children) => {
                                if (children.id === this.expandDetails[2]) {

                                    this.$set(children, 'background', true)
                                }
                            })
                        }
                        else
                            if (item.children) {

                            item.children.map((children) => {
                                if (this.defId === null) {
                                    this.$set(children, 'background', true)
                                    this.setDefIdAction(children.id);
                                }
                            })
                        }
                    }

                    /*有分类*/
                    if (item.children) {
                        this.arrData(item.children, rank + 1, item.status)
                    }
                })
            },
            renderContent(h, {root, node, data}) {
                let iconFile = false;
                let menu = '';
                let buttonArr = this.buttonInit(h, root, node, data)

                let folderButton = buttonArr[0];
                let button = buttonArr[1];
                let copyButton = buttonArr[2];
                let delButton = buttonArr[3];

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
                //不需要修改按钮的
                if (data.rank === 2) {
                    button = ''
                }
                // 需要文件夹按钮的
                if (data.rank !== 0 && data.rank !== 1) {
                    folderButton = '';
                }
                // 图标为文件夹的
                if (data.rank !== 2) {
                    iconFile = true
                }
                // 右侧菜单
                if (data.status !== 0) {
                    menu = this.setmenu(h, data, folderButton, button, copyButton, delButton)
                }

                return this.renderingTree(h, root, node, data, iconFile, textTitle, menu)
            },
            /*按钮初始化*/
            buttonInit(h, root, node, data) {
                let buttonArr = [];
                buttonArr[0] = h('div', {
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
                ]);
                buttonArr[1] = h('div', {
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
                buttonArr[2] = h('div', {
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
                buttonArr[3] = h('div', {
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
                return buttonArr
            },

            /*...菜单*/
            setmenu(h, data, folderButton, button, copyButton, delButton) {
                return (h('section', {
                    props: {
                        type: 'ios-more'
                    },
                    style: {
                        display: 'inline-block',
                        float: 'right',
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
                                marginRight: '20px',
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
                                marginRight: '12px',
                                zIndex: '13'
                            }
                        },
                        data.btnShow ? [folderButton, button, copyButton, delButton] : ''
                    )
                ]))
            },
            /*渲染所有*/
            renderingTree(h, root, node, data, iconFile, textTitle, menu) {

                let className = '';
                if (data.rank === 0) {
                    className = 'node0'
                } else if (data.rank === 1) {
                    className = 'node1'
                } else {
                    className = 'node2'
                }
                return (
                    h('p', {

                        style: {
                            display: 'inline-block',
                            width: '100%',
                            height: '35px',
                            lineHeight: '35px',
                            paddingLeft: '35px',
                            background: data.rank === 0 ? '#eef1f2' : data.background ? '#3bceb6' : '',
//                            background: '#3bceb6',
                            color: data.rank === 0 || data.rank === 1 ? '#777' : data.background ? '#fff' : '#bdbdbd',
                            borderRadius: '6px 6px 0 0',
//                            border : data.rank === 0?'1px solid red':'',
                        }
                    }, [
                        h('span', [
//                            h('Icon', {
//                                props: {
//                                    type: iconFile ? 'ios-folder-outline' : 'ios-paper-outline'
//                                },
//                                style: {
//                                    marginRight: '8px',
//                                    fontSize: '20px'
//                                }
//                            }),
                            h('span', {
                                style: {
                                    width: '100px',
                                    fontSize: '14px',
                                    cursor: 'pointer'
                                },
                                on: {
                                    click: () => {
                                        this.goTaskList(data, root, node)
                                    }
                                }

                            }, [
                                textTitle
                            ])
                        ]),
//                        menu

                        data.status !== 0 ? h('span',
                            {
                                class: 'buttonList'
                            },
                            [
                                data.rank === 2 ? '' : h('Icon', {
                                    props: {
                                        type: 'ios-plus-outline'
                                    },
                                    style: {
                                        marginRight: '8px',
                                        fontSize: '20px'
                                    },

                                    on: {
                                        click: () => {
                                            this.append(data)
                                        }
                                    }
                                }),
                                data.rank === 2 ? '' : h('Icon', {
                                    props: {
                                        type: 'edit'
                                    },
                                    style: {
                                        marginRight: '8px',
                                        fontSize: '20px'
                                    },

                                    on: {
                                        click: () => {
                                            this.changeName(data)
                                        }
                                    }
                                }),
                                h('Icon', {
                                    props: {
                                        type: 'ios-trash-outline'
                                    },
                                    style: {
                                        marginRight: '8px',
                                        fontSize: '20px'
                                    },

                                    on: {
                                        click: () => {
                                            this.delButton(root, node, data)
                                        }
                                    }
                                })
                            ]) : ''
                    ])
                )
            },
            /* 添加 */
            async append(treeData, type) {
                let obj = null;
                /*添加分类*/
                if (type === 'all') {
                    obj = {
                        name: '新建规范分类',
                        company_id: this.company_id
                    }
                } else if (treeData.rank === 0) {
                    /*添加类型*/
                    obj = {
                        name: '新建制作规范',
                        parent_id: treeData.cate_id
                    }
                } else {
                    treeData.children.push({
                        name: '新建规范',
                        parent_id: treeData.cate_id,
                        rank: 2,
                        temporary: true,
                        btnShow: false
                    });
                    this.$bus.emit('addType', treeData);
                    return false
                }

                let {data} = await api.taskCateAdd(obj);
                if (data.err_code === 0) {
                    this.init();
                    this.$Message.success(data.err_message);
                } else {
                    this.$Message.error(data.err_message);
                }

            },

            /*点击进入详情*/
            goTaskList(data, root, node) {

                /*详情展开*/
                if (data.rank === 2) {
                    if (data.temporary) {
                        // 新建时没保存 但是用户点击了其他详情，又点击回来
                        this.$bus.emit('addType', data);
                    } else {
                        this.$bus.emit('typesDetail', data);
                    }

                    this.detailsExpand(data, root, node)
                    // 增加选中背景色
                    this.treeMap[0].children.map((item) => {
                        if (item.children) {
                            item.children.map((typeList) => {
                                typeList.children.map((data) => {
                                    if (data.id === this.expandDetails[2]) {
                                        this.$set(data, 'background', true)
                                    } else if (data.background) {
                                        data.background = false
                                    }
                                })
                            })
                        }
                    })


                }
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
                this.del.id = data.cate_id;
                this.del.data = data
            },
            /*删除*/
            remove() {
                let url = 'task/task-type/cate-delete';
                let obj = {id: this.del.id};
                //类型删除
                if (this.del.data.rank === 2) {
                    url = 'task/task-type/delete';
                    obj = {id: this.del.data.id}
                }
                /*分类 删除*/
                this.$axios.post(this.GLOBAL.baseRouter + url, qs.stringify(obj))
                    .then(({data}) => {
                        if (data.err_code === 0) {
                            this.init();
                        } else {
                            this.$Message.error(data.err_message);
                        }
                    });
                this.del.show = false;
            },
            /*更改名弹窗*/
            changeName(data) {
                this.changName.show = true;
                this.changName.value = data.name;
                this.changName.id = data.cate_id;
            },
            /*更改名字*/
            async selecText() {
                let {data} = await api.taskCateUpdate({id: this.changName.id, name: this.changName.value})

                if (data.err_code === 0) {
                    this.init();
                } else {
                    this.$Message.error(data.err_message);
                }
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
            },
            /*展开*/
            showTree(data) {
                /*分类展开*/
                this.classifyExpand(data);

            },
            /*分类展开*/
            classifyExpand(data) {

                if (data.cate_id) {
                    if (this.expandArray.length > 0) {
                        let showExpand = true;
                        this.expandArray.map((item, index, arr) => {
                            if (data.cate_id === item.cate_id) {
                                showExpand = false;
                                item.expand = data.expand
                            }
                        });
                        if (showExpand) {
                            this.expandArray.push({cate_id: data.cate_id, expand: data.expand})
                        }
                    } else {
                        this.expandArray.push({cate_id: data.cate_id, expand: data.expand})
                    }
                    sessionStorage.setItem('expand', JSON.stringify(this.expandArray));
                }
            },
            /*详情展开*/
            detailsExpand(data, root, node) {
                let nodeSecond = null, nodeStair = null;
                nodeSecond = node.parent;
                this.expandDetails[2] = data.id;
                root.map((roots) => {
                    if (roots.nodeKey === nodeSecond) {
                        this.expandDetails[1] = roots.node.cate_id;
                        nodeStair = roots.parent
                    }
                });
                if (nodeStair !== null) {
                    root.map((roots) => {
                        if (roots.nodeKey === nodeStair) {

                            this.expandDetails[0] = {id: roots.node.cate_id, status: roots.node.status};
                        }
                    })
                }
                sessionStorage.setItem('expandDetails', JSON.stringify(this.expandDetails));
            },
            /*展开文件夹具体实现*/
            showExpand(item) {
                this.expandArray.map((expandObj, i) => {
                    if (item.cate_id === expandObj.cate_id) {
                        item.expand = expandObj.expand
                    }
                });
            },
        },
        computed: {
            ...mapState({
                defId(data) {
                    return data.typelib.defId
                }
            })
        },
        components: {
            vUpload
        }

    }
</script>
<style lang="less">

    .treeMapWindow {
        .ivu-modal-header {
            border: 1px solid transparent !important;
        }

        .ivu-modal-footer {
            border-top: 1px solid transparent !important;
        }

    }

    .typelibLeftContainer {
        position: relative;
        height: 100%;
        padding: 7px;
        margin-right: 30px;
        background: #fff;
        overflow-y: hidden;
        .ivu-tree li ul {
            padding: 0 0 0 6px !important;

        }
        .ivu-tree-arrow {
            position: relative;
            top: 0;
            left: 33px;
            z-index: 10;
        }
        .addTypelibHeader{
            font-size: 16px;
            display: flex;
            justify-content: space-between;
            height: 50px;
            line-height: 50px;
            border-bottom: 1px solid #f2f2f2;
            color:  rgb(119, 119, 119);
            padding: 0 10px;
            a{font-size: 12px;color:  rgb(119, 119, 119)}
        }
        .treeMapContainer {
            position: absolute;
            width: 96%;
            ul:nth-child(1)>li:nth-child(1)>span:nth-child(1){
                display: none !important;
            }
            .buttonList {
                position: absolute;
                right: 0;
                i {
                    color: #3bceb6;
                    vertical-align: middle;
                }
            }
        }

    }
</style>
