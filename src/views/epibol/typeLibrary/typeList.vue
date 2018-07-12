<template>
<<<<<<< HEAD
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
=======
  <div>
    <Tree :data="kNodes" :render="renderContent"></Tree>
  </div>
</template>
<script>
var qs = require("querystring");
import {
  cateList,
  delClass,
  delClassTask,
  addClassTask
} from "../../../config/env.js";
export default {
  data() {
    return {
      kNodes: [],
      buttonProps: {
        type: "ghost",
        size: "small"
      },
      calssType: []
    };
  },
  mounted() {
    this.ListEach();
  },
  methods: {
    get(url, params, call) {
      this.$http.get(url, { params: params }).then(
        function(res) {
          call(res);
        },
        function(error) {
          this.$Message.error("数据加载出错了！请刷新浏览器");
        }
      );
    },

    //遍历列表分类数据
    ListEach() {
      this.get(cateList, { company_id: 1 }, res => {
        let getData = res.data.data;
        let item = [];
        getData.forEach(req => {
          let obj = {
            expand: true,
            render: (h, { root, node, data }) => {
              return h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "100%",
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      this.targriClass(root, node, data);
                    }
                  }
                },
                [
                  h(
                    "span",
                    {
                      style: {
                        background: data.actClass
                      }
                    },
                    [
                      h("Icon", {
                        props: {
                          type: "ios-folder-outline"
                        },
                        style: {
                          marginRight: "8px"
                        }
                      }),
                      h("span", data.title)
                    ]
                  ),
                  h(
                    "span",
                    {
                      style: {
                        display: "inline-block",
                        float: "right",
                        marginRight: "32px"
                      }
                    },
                    [
                      h("Button", {
                        props: Object.assign({}, this.buttonProps, {
                          icon: "ios-plus-empty"
                        }),
                        id: "addbtn",
                        on: {
                          click: $event => {
                            this.addClassTask(root, node, data, $event); //
                          }
                        }
                      }),
                      // h("Button", {
                      //   props: Object.assign({}, this.buttonProps, {
                      //     icon: "trash-b"
                      //   }),
                      //   style: {
                      //     marginLeft: "10px"
                      //   },
                      //   on: {
                      //     click: $event => {
                      //       this.removeClass(data, $event);
                      //     }
                      //   }
                      // })
                    ]
                  )
                ]
              );
            },
            children: []
          };
          obj.title = req.name;
          obj.pId = req.cate_id;
          obj.id = req.id;
          if (req.tasktype != undefined && req.tasktype.length > 0) {
            obj.id = req.id;
            obj.children = this.eachLxinfo(req.tasktype);
          }
          item.push(obj);
        });
        this.kNodes = item;
      });
    },
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%",
            cursor: "pointer"
          },
          on: {
            click: () => {
              this.targriClass(root, node, data);
            }
          }
        },
        [
          h(
            "span",
            {
              style: {
                background: data.actClass
              }
            },
            [
              h("Icon", {
                props: {
                  type: "ios-paper-outline"
                },
                style: {
                  marginRight: "8px"
                }
              }),
              h("span", data.title)
            ]
          ),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right",
                marginRight: "32px"
              }
            },
            [
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "trash-b"
                }),
                on: {
                  click: $event => {
                    this.remove(data, $event);
                  }
                }
              })
            ]
          )
        ]
      );
    },
    //循环子数据
    eachLxinfo(data) {
      let im = [];
      this.calssType = data;
      data.forEach(req => {
        let obj = {};
        obj.title = req.tasktype_name;
        obj.id = req.id;
        obj.category_id = req.category_id;
        im.push(obj);
      });
      return im;
    },
    //增加父节点
    appendClass(data) {
      let children = data.children || [];
      children.push({
        title: "父节点",
        expand: true
      });
      this.$set(data, "children", children);
      let Clsobj = {};
      Clsobj.name = "父节点";
      Clsobj.company_id = 1;
      this.$axios
        .post(
          this.GLOBAL.baseRouter + "task/task-type/cate-add",
          qs.stringify(Clsobj)
        )
        .then(r => {
          console.log(r);
        });
    },
    //增加子节点
    addClassTask(root, node, data, $event) {
      $event.cancelBubble = true;
       let children = data.children || [];
      let newType = {
        title: "新建任务类型",
        expand: true,
        selected: true,
        category_id: data.pId,//大类ID
        id:data.id//小ID
      };
        children.push(newType)
      console.log(data);

//      this.kNodes[data.nodeKey].children.push(newType);

      // document.getElementById("addClassTaskBtn").click();
      // this.$set(data, "children", children);
      this.targriClass(children, node, newType);
    },
    //点击左边列表增加标识
    targriClass(root, node, data) {
      // console.log(root, node, data);
      // root.forEach(r => {
      //   this.$set(r.node, "actClass", "#fff");
      // });
      // this.$set(data, "actClass", "#d5e8fc");
      //向父组件传递数据
      if (!data.id) {
        let clicktype = {
          isInit: true,
          id: data.id,
          category_id: data.category_id//大类ID
        };
        this.$emit("getListId", clicktype);
      } else {
        // this.calssType.forEach(tre => {
        //   _this.treData = tre;
        // });
        let clicktype = {
          isInit: false,
          id: data.id,
          category_id: data.category_id,//大类ID
          liName: data.title
        };
        this.$emit("getListId", clicktype);
      }
    },

    // onChange(data) {},
    removeClass(data, $event) {
      $event.cancelBubble = true;
      let cIs = this;
      let removeData = data.pId;
      cIs.get(
        delClass,
        {
          id: removeData
        },
        () => {
          cIs.ListEach();
          cIs.$Message.success("删除成功");
        }
      );
    },
    remove(data, $event) {
      $event.cancelBubble = true;
      let cIs = this;
      let removeCad = data.id;
      this.get(
        delClassTask,
        {
          id: removeCad
        },
        () => {
          cIs.ListEach();
          cIs.$Message.success("删除成功");
        }
      );
    }
  }
};
</script>


          

 
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
