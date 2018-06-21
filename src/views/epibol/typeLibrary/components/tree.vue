<template>
  <div>
    <div class="failHeader"  @click="modal2 = true">
      <Icon type="android-add" class="icon"></Icon>
      <span>新建</span>
      <!-- <icon type="search" class="icon search"></icon>  -->
    </div>
    <Tree :data="data5"  :render="renderContent"></Tree>
    <Modal
        v-model="modal2"
        title="新建类型"
        @on-ok="ok2"
        @on-cancel="cancel2">
        <span class="h4">类型名称</span>
        <Input type="text" v-model="addTypeName"  :autofocus="true" style="width: 25%"></Input>
        <span class="h4">阶段名称</span>
        <Input type="text" v-model="stageName"  :autofocus="true" style="width: 25%"></Input>
        
        <span class="h4">文件格式</span>
        <Input type="text" v-model="fileFormat"  :autofocus="true" style="width: 10%"></Input>
        </br>
        <span class="h4">文件配置项名称</span>
        <Input type="text" v-model="fileOptionsName"  :autofocus="true" style="width: 25%"></Input>
        <span class="h4">值</span>
        <Input type="text" v-model="describe"  :autofocus="true" style="width: 25%"></Input>
    </Modal>
  </div>
</template>
<script>
var qs = require("querystring");
export default {
  data() {
    return {
      data5: [],
      test: [],//二级列表
      buttonProps: {
        type: "ghost",
        size: "small"
      },
      calssType: [],
      tasktypeName:[],
      modal2: false,
      addTypeName:"",
      stageName:"",
      fileFormat:"",
      fileOptionsName:"",
      describe:""
    };
  },
  mounted() {
    this.taskTypeList();
  },
  methods: {
    // 获取列表
    taskTypeList() {
      let _this = this;
      this.$axios
        .get(this.GLOBAL.baseRouter + "task/task-type/cate-list&company_id=1")
        .then(msg => {
          let MsgData = msg.data.data;
          let item = [];
          MsgData.forEach(req => {
            let obj = {
              expand: true,
              selected: true,
              render: (h, { root, node, data }) => {
                return h(
                  "span",
                  {
                    style: {
                      display: "inline-block",
                      width: "90%",
                      cursor: "pointer",
                      background: data.actClass
                    }
                  },
                  [
                    h(
                      "span",
                      {
                        style: {},
                        on: {
                          click: () => {
                            this.targriClass(root, node, data);
                          }
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
                      "span", //增加删除
                      {
                        style: {
                          display: "inline-block",
                          float: "right"
                        }
                      },
                      [
                        // h("Button", {
                        //   //增加
                        //   props: Object.assign({}, this.buttonProps, {
                        //     icon: "ios-plus-empty"
                        //   }),
                        //   id: "addbtn",
                        //   on: {
                        //     click: () => {
                        //       // this.addClassTask(root, node, data);
                        //       // this.append(root, node, data);
                        //     }
                        //   }
                        // }),
                        h("Button", {
                          //分类删除
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
            if (req.tasktype) {
              obj.children = _this.eachLxinfo(req.tasktype);
            }
            item.push(obj);
          });
          _this.data5 = item;
        });

    },
    renderContent(h, { root, node, data }) {
      return h(
        "span", //二级列表
        {
          style: {
            display: "inline-block",
            width: "89%",
            cursor: "pointer"
          }
        },
        [
          h(
            "span",
            {
              style: {
                background: data.actClass,
                
                display: "inline-block",
                width: "120px",
              },

              on: {
                click: () => {
                  this.targriClass(root, node, data);
                }
              }
            },

            [
              h("Icon", {
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
                // marginRight: "32px"
              }
            },
            [
              
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-minus-empty"
                }),
                on: {
                  click: $event => {
                    this.remove(root, node, data);
                  }
                }
              })
            ]
          )
        ]
      );
    },
    //渲染二级数据
    eachLxinfo(submenu) {
      let im = [];
      this.test = submenu;
      // this.submenu = submenu
      
      submenu.forEach(req => {
        this.tasktypeName.push(req.tasktype_name)
        sessionStorage.tasktypeName = this.tasktypeName
      })
      sessionStorage.oneid = submenu[0].id
      if (this.test) {
        this.test.forEach((req, index) => {
          let obj = {};
          obj.title = req.tasktype_name;
          obj.id = req.id;
          obj.category_id = req.category_id;
          im.push(obj);
        });
      }
      return im;
      
    },

    // 增加二级菜单
    addClassTask(root, node, data) {
      let _this = this;
      data.children.forEach(r => {
        let clickDel = {
          category_id: r.category_id
        };
      });
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
      _this.$emit("getListId", clicktype)

      

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
        });
    },
    //删除
    remove(root, node, data) {
            let cIs = this;
      let removeData = {id: data.id};
      let removeCad = data.id;
      cIs.$axios.post(this.GLOBAL.baseRouter + "task/task-type/delete&id=removeCad",qs.stringify(removeData)).then(msg => {
        cIs.taskTypeList();
        cIs.$Message.success("删除成功");
      })
    },
// 新增分类
  ok2(){
    // this.$Message.info('Clicked ok');
          let addType = {
        category_id: 22,
        name: this.addTypeName,
        expand: true,
        stage: JSON.stringify([
          {
            stage_name:this.stageName,
            is_inside_audit: 1
          }
        ]),
        file: JSON.stringify([
          {
            file_name: "",
            file_format: this.fileFormat,
            is_main: 1,
            require: [
              {
                config_id: "",
                config_name: this.fileOptionsName,
                value: this.describe
              }
            ]
          }
        ])
      };
      if(sessionStorage.tasktypeName.indexOf(this.addTypeName)){
      this.$axios.post(this.GLOBAL.baseRouter + "task/task-type/add",qs.stringify(addType)).then(r => {
          // const children = data.children || [];
          if (r.data.err_code!== 0) {
            this.$Message.error("增加失败");
          } else {
            this.test.push({
              title: "新建任务类型",
              expand: true
            });
            this.taskTypeList()
          }
        });
      }else{
        this.$Message.error("已有任务类型名称");
      }

  },
  cancel2(){
   this.$Message.info('Clicked cancel');
  },
   
  }
};
</script>
<style scoped>
  .failHeader {
    position: relative;
    width: 251px;
    height: 43px;
    line-height: 33px;
    padding: 8px;
    background-color: #e6e6e6;
    border-radius: 5px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
  .icon {
    font-size: 20px;
    vertical-align: middle;
  }

  .search {
    position: absolute;
    right: 10px;
    top: 15px;
  }
</style>

