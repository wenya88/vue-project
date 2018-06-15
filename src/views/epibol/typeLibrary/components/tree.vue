<template>
    <div><Tree :data="data5" :render="renderContent"></Tree></div>
</template>
<script>
var qs = require("querystring");
export default {
  data() {
    return {
      data5: [],
      test: [],
      buttonProps: {
        type: "ghost",
        size: "small"
      },
      calssType: []
    };
  },
  mounted() {
    this.taskTypeList();
  },
  methods: {
    // 获取列表
    taskTypeList() {
      let _this = this;
      this.$axios.get(this.GLOBAL.baseRouter + "task/task-type/cate-list&company_id=1").then(msg => {
        let MsgData = msg.data.data;
        let item = [];
        MsgData.forEach(req => {
          let obj = {
            expand: true,
            render: (h, { root, node, data }) => {
              return h(
                "span",
                {
                  style: {
                    display: "inline-block",
                    width: "90%",
                    cursor: "pointer",
                    background: data.actClass
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
                    "span",//增加删除
                    {
                      style: {
                        display: "inline-block",
                        float: "right"
                      }
                    },
                    [
                      h("Button", {//增加
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
                      h("Button", {//分类删除
                        props: Object.assign({}, this.buttonProps, {
                          icon: "ios-minus-empty"
                        }),
                        style: {
                          marginLeft: "10px"
                        },
                        on: {
                          click: $event => {
                            this.removeClass(data, $event);
                          }
                        }
                      })
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
          if(req.tasktype){
            //   req.tasktype.forEach( item => {
            //       obj.children = _this.eachLxinfo(item.id); 
            //   })
              obj.children = _this.eachLxinfo(req.tasktype);
          }
          item.push(obj);
        });
        _this.data5 = item;
      });
    },
    renderContent(h, { root, node, data }) {
      return h(
        "span",//二级列表
        {
          style: {
            display: "inline-block",
            width: "89%",
            cursor: "pointer",
          },
          on: {
            click: () => {
              this.targriClass(root, node, data);
            }
          }
        },
        [
          h("span", 
            
             {
                style: {
                  background: data.actClass
                },
             },
            [h("Icon", {
              props: {
                type: "ios-paper-outline"
              },
              style: {
                marginRight: "8px",
              }
            }),
            h("span", data.title)]
          ),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right",
                marginRight: "32px",
              }
            },
            [
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-minus-empty"
                }),
                on: {
                  click: $event => {
                    this.remove(this.test);
                  }
                }
              })
            ]
          )
        ]
      );
    },
    //渲染子数据
    eachLxinfo(data) {
        let _this = this
      let im = [];
      this.test = data
      if(this.test){
        this.test.forEach((req,index) => {
        // console.log(this.test[index].id)
                let obj = {};
                obj.title = req.tasktype_name;
                obj.id = req.id;
                obj.category_id = req.category_id;
                im.push(obj);
            });
      }
      return im;
    },
    // 增加父节点
    // appendClass(data) {
    //   let children = data.children || [];
    //   children.push({
    //     title: "父节点",
    //     expand: true
    //   });
    //   this.$set(data, "children", children);
    //   let Clsobj = {};
    //   Clsobj.name = "父节点";
    //   Clsobj.company_id = 1;
    //   this.$axios.post(this.GLOBAL.baseRouter + "task/task-type/cate-add",qs.stringify(Clsobj)).then(r => {
    //       console.log(r);
    //     });
    // },
    // 增加二级菜单
    addClassTask(root, node, data, $event) {
      $event.cancelBubble = true;
      console.log(data.title)
      // let children = data.children || [];
      let newType = {
        name: data.title,
        expand: true,
        selected: true,
        category_id: data.pId,
      };
      this.$axios.post(this.GLOBAL.baseRouter+"task/task-type/add&err_message=0",qs.stringify(newType)).then(r =>{
        // console.log(r)
        this.data5[data.nodeKey].children.push(newType);
      })
      
      
    },
    
    //向父组件传递数据
    targriClass(root, node, data) {
      
      let _this = this;
      let clicktype = {
          isInit: false,
          id: data.id,
          category_id: data.category_id,
          liName: data.title
        };
        _this.$emit('getListId', clicktype,);

    //点击左边列表增加标识
      root.forEach(r => { 
        this.$set(r.node, "actClass", "#fff");
      });
      this.$set(data, "actClass", "#d5e8fc");
    },
    // 分类删除
    removeClass(data, $event) {
      $event.cancelBubble = true;
      let cIs = this;
      let removeData = data.pId;
        cIs.$axios.get(this.GLOBAL.baseRouter + "task/task-type/cate-delete&id=removeData").then(msg => {
          cIs.taskTypeList();
          cIs.$Message.success("删除成功");
        })
    },
    //删除
    remove(data, $event) {
    //   $event.cancelBubble = true;
      let cIs = this;
      data.forEach( (item,index) => {
        // console.log(cIs)
        // console.log( item.id)
      })
        let removeCad = data.id;
      
      // cIs.$axios.get(this.GLOBAL.baseRouter + "task/task-type/delete&id=removeCad").then(msg => {
      //     cIs.taskTypeList();
      //     cIs.$Message.success("删除成功");
      //   });
    }
  }
};
</script>