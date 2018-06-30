<template>
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
      // let children = data.children || [];
      let newType = {
        title: "新建任务类型",
        expand: true,
        selected: true,
        category_id: data.pId,//大类ID
        id:data.id//小ID
      };
      console.log(data);
      
      this.kNodes[data.nodeKey].children.push(newType);

      // document.getElementById("addClassTaskBtn").click();
      // this.$set(data, "children", children);
      this.targriClass(this.kNodes[data.nodeKey].children, node, newType);
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


          

 