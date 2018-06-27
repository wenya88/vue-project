<template>
  <div>
    <div class="failHeader cursor">
      <span  @click="typeModal = true">
        <Icon type="android-add" class="icon"></Icon>
        <span>增加类型</span>
      </span>
      <span  @click="classModal = true">
        <Icon type="android-add" class="icon"></Icon>
        <span>增加分类</span>        
      </span>
    </div>
    <Tree :data="tree"  :render="renderContent"></Tree>
    <modal v-model="classModal" title="新建分类" @on-ok="newClassify">
          <Input type="text" v-model="classify"  :autofocus="true" style="width: 50%"></Input>
    </modal>
    <Modal v-model="typeModal" title="新建类型" @on-ok="newType">
        <div class="h4">选择属于分类</div>
        <Select v-model="selClass" style="width:50%">
            <Option v-for="item in tree" :value="item.pId"  :key="item.pId">{{ item.title }}</Option>
        </Select>
        <div class="h4">类型名称</div>
        <Input type="text" v-model="addTypeName" :autofocus="true" style="width: 50%"></Input>
        <div class="h4">阶段名称</div>
        <Input type="text" v-model="stageName" :autofocus="true" style="width: 50%"></Input>
        <div class="h4">主文件格式</div>
        <AutoComplete type="text" v-model="fileFormat" :data="fileFormatArr"  :autofocus="true" style="width: 20%"></AutoComplete>
        </br>
        <div class="h4">主文件属性要求</div>
        <AutoComplete type="text" v-model="fileOptionsName"  :data="ProReqArr"  :autofocus="true" placeholder="尺寸" style="width: 50%"></AutoComplete>
        <div class="h4">数值</div>
        <AutoComplete type="text" v-model="describe" :data="valueArr"  :autofocus="true" style="width: 50%"></AutoComplete>
        <div class="h4">附加文件格式</div>
        <Input type="text" v-model="appendFileFormat "  :autofocus="true" style="width: 20%"></Input>
        <div class="h4">附加文件描述</div>
        <Input type="text" v-model="appendFileDes"  :autofocus="true" style="width: 50%"></Input>
    </Modal>
  </div>
</template>
<script>
var qs = require("querystring");
export default {
  data() {
    return {
      tree: [],
      oneMenu: [],
      calssType: [],
      tasktypeName:[],
      fileFormatArr: ["jpg", "png", "fbx", "avi", "unity"],
      ProReqArr: ["尺寸", "贴面数", "帧率"],
      valueArr: ["8000*8000", ">2000", ">24"],
      selClass:"", 
      addTypeName:"",
      stageName:"",
      fileFormat:"",
      fileOptionsName:"",
      describe:"",
      appendFileFormat:"",
      appendFileDes:"",
      classify:"",
      typeModal: false,
      classModal: false, 
      buttonProps: {
        type: "ghost",
        size: "small"
      },
    };
  },
  mounted() {
    this.taskTypeList();
  },
  methods: {
    // getTree
    taskTypeList() {
      let _this = this;
      this.$axios.get(this.GLOBAL.baseRouter + "task/task-type/cate-list&company_id=1").then(msg => {
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
                      background: "#e6e6e6",
                      padding: "2px 10px"
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
                            marginRight: "8px",
                            lineHeight:"24px"
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
                          float: "right"
                        }
                      },
                      [
                        h("Button", {
                          props: Object.assign({}, this.buttonProps, {
                            icon: "ios-minus-empty"
                          }),
                          style: {
                            marginLeft: "10px",
                            color:"#333",
                          },
                          on: {
                            click: $event => {
                              this.classDel(root, node, data);
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
          _this.tree = item;
        });

    },
    renderContent(h, { root, node, data }) {
      return h(
        "span", 
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
                marginRight: "10px"
              }
            },
            [
              
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-minus-empty"
                }),
                on: {
                  click: $event => {
                    this.typeDel(root, node, data);
                  }
                }
              })
            ]
          )
        ]
      );
    },
  newClassify(){
    let classify ={
      name:this.classify,
      company_id:1
      }
    this.$axios.post(this.GLOBAL.baseRouter + "task/task-type/cate-add",qs.stringify(classify)).then(msg => {
      this.taskTypeList()
      this.$Message.success("增加成功");
    })
  },
  newType(){
      let addType = {
        category_id: this.selClass,
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
      if(this.tasktypeName.indexOf(this.addTypeName) > -1){
        this.$Message.error("类型名称不能相同");
      }else{
       this.$axios.post(this.GLOBAL.baseRouter + "task/task-type/add",qs.stringify(addType)).then(r => {
          if (r.data.err_code == 0) {
            this.taskTypeList()
            this.addTypeName = ""
            this.stageName =""
            this.fileFormat ="" 
            this.fileOptionsName ="" 
            this.describe =""
            this.appendFileFormat =""
            this.appendFileDes =""
          } else {
            this.$Message.error("增加失败");
          }
      });
      }
  },
    classDel(root, node, data) {
      let _this = this;
      let removeData = {id : data.pId};
          if(data.pId == 0) {
            _this.$Message.error("默认不能删除");
          }else{
            _this.$axios.post(this.GLOBAL.baseRouter + "task/task-type/cate-delete",qs.stringify(removeData)).then(msg => {
              _this.taskTypeList();
              _this.$Message.success("删除成功");
            });
          }
         
        
    },
    typeDel(root, node, data) {
      let _this = this;
      let removeData = {id: data.id};
      _this.$axios.post(this.GLOBAL.baseRouter + "task/task-type/delete",qs.stringify(removeData)).then(msg => {
        _this.taskTypeList();
        _this.$Message.success("删除成功");
      })
    },
    //子列表
    eachLxinfo(submenu) {
      let im = [];
      this.oneMenu = submenu;
      submenu.forEach(req => {
        this.tasktypeName.push(req.tasktype_name)
      })
      sessionStorage.oneid = submenu[0].id
      if (this.oneMenu) {
        this.oneMenu.forEach((req, index) => {
          let obj = {};
          obj.title = req.tasktype_name;
          obj.id = req.id;
          obj.category_id = req.category_id;
          im.push(obj);
        });
      }
      return im;
    },
    //子传父
    targriClass(root, node, data) {
      let _this = this;
      let clicktype = {
        isInit: false,
        id: data.id,
        category_id: data.category_id,
        liName: data.title
      };
      _this.$emit("getListId", clicktype)
      root.forEach(r => {
        this.$set(r.node, "actClass", "#fff");
      });
      this.$set(data, "actClass", "#d5e8fc");
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
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    border-bottom-right-radius: 0; 
    border-bottom-left-radius: 0; 
  }
  .failHeader>span{
    margin-right: 10px
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
  .cursor {
    cursor: pointer;
   
  }
</style>

