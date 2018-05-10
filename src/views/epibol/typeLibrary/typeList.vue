<template>
  <div>

    <Tree :data="kNodes" :render="renderContent"></Tree>
    <!-- @on-select-change="onChange" -->
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
      //category_ids : [],
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
      let fiC = this;
      this.get(
        cateList,
        {
          company_id: 1
        },
        res => {
          let getData = res.data.data;
          let item = [];
          getData.forEach(req => {
            // req.tasktype.forEach(catgor => {
            //   console.log(catgor);
            // });
            let obj = {
              expand: true,
              render: (h, { root, node, data }) => {
                return h(
                  "span",
                  {
                    style: {
                      display: "inline-block",
                      width: "100%"
                    }
                  },
                  [
                    h("span", [
                      h("Icon", {
                        props: {
                          type: "ios-folder-outline"
                        },
                        style: {
                          marginRight: "8px"
                        }
                      }),
                      h("span", data.title)
                    ]),
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
                          on: {
                            click: () => {
                              this.addClassTask(data); //
                            }
                          }
                        }),
                        h("Button", {
                          props: Object.assign({}, this.buttonProps, {
                            icon: "trash-b"
                          }),
                          style: {
                            marginLeft: "10px"
                          },
                          on: {
                            click: () => {
                              this.removeClass(data);
                            }
                          }
                        })
                        // h("Button", {
                        //   props: Object.assign({}, this.buttonProps, {
                        //     icon: "trash-b"
                        //   }),
                        //   style: {
                        //     width: "40px"
                        //   },
                        //   on: {
                        //     click: () => {
                        //       this.addClassTask(data);
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
            //this.category_ids[obj.pId] = obj.pId;
            if (req.tasktype != undefined && req.tasktype.length > 0) {
              obj.id = req.id;
              obj.children = fiC.eachLxinfo(req.tasktype);
            }
            item.push(obj);
          });
          fiC.kNodes = item;
        }
      );
    },
    //点击树节点时触发
    onChange(data) {
      console.log(data);
      if (!data.id) {
        let clicktype = {
          isInit: true,
          id: data.id,
          category_id: data.category_id
        };
        this.$emit("getListId", clicktype);
      } else {
        let _this = this;
        // this.calssType.forEach(tre => {
        //   _this.treData = tre;
        // });
        let clicktype = {
          isInit: false,
          id: data.id,
          category_id: data.category_id,
          liName: data.title
        };
        //if ((id, liName)) {
        _this.$emit("getListId", clicktype);
        //}
      }
    },
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%"
          }
        },
        [
          h("span", [
            h("Icon", {
              props: {
                type: "ios-paper-outline"
              },
              style: {
                marginRight: "8px"
              }
            }),
            h("span", data.title),
            h("div", {
              style: {
                width: "200px",
                border: "1px solid #fff",
                display: "inline-block",
                position: "absolute",
                left: "0",
                height: "20px",
                cursor: "pointer"
              },
              on: {
                click: () => {
                  this.onChange(data);
                }
              }
            })
          ]),
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
                  click: () => {
                    this.remove(data);
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
        //console.log(obj.category_id);
        //this.category_id = req.category_id;
        im.push(obj);
      });
      return im;
    },
    //增加父节点
    appendClass(data) {
      const children = data.children || [];
      children.push({
        title: "父节点",
        expand: true
      });
      // let nodes = data.children;
      // console.log(nodes.length - 1);
      // if (nodes.length > 0) {
      //   $(this).css("color", "red");
      // }
      // return false;
      this.$set(data, "children", children);
      let Clsobj = {};
      Clsobj.name = "父节点";
      Clsobj.company_id = 1;
      this.$axios
        .post("/task/task-type/cate-add", qs.stringify(Clsobj))
        .then(r => {
          console.log(r);
        });
    },
    //增加子节点
    addClassTask(data) {
      console.log(data);
      const children = data.children || [];
      children.push({
        title: "子节点",
        expand: true,
        category_id: data.pId
      });
      this.$set(data, "children", children);
      // let Clsobj = {};
      // Clsobj.name = "子节点";
      // Clsobj.company_id = 1;
      // this.$axios
      //   .post("/task/task-type/add", qs.stringify(Clsobj))
      //   .then(r => {
      //     console.log(r);
      //   });
    },
    removeClass(data) {
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
    remove(data) {
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

          

 