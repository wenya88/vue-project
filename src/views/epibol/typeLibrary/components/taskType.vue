<template>
  <Layout class="Award">
    <Sider hide-trigger class="list">
      <tree class="tree" ref="child" @getListId="getListId"></tree>
    </Sider>
    <Content style="margin-left:100px">
      <h3 class="h3">基本信息</h3>
      <h4 class="h4">类型名称</h4>
      <Form>
        <Input type="text" v-model="typeName" :autofocus="true" placeholder="请输入类型名称" style="width: 50%"></Input>
        <h4 class="h4 marTop10">实施阶段</h4>
        <Steps :current="3" class="steps">
          <Step v-for="item in arr" :title=item.stage_name></Step>
        </Steps>
        <CheckboxGroup class="checkbox">
          <Checkbox type="checkbox"  v-for="item in internalAudit" label="内审"></Checkbox>
        </CheckboxGroup>
        <div class="increase" @click="addStageInput">
          <Icon type="ios-plus-outline" class="increaseIcon"></Icon>
          <p>增加阶段</p>
        </div>

        <h3 class="h3 marTop10 marTop40">主文件</h3>
        <h4 class="h4">文件格式</h4>
        <AutoComplete v-model="fileFormat" :data="data3" :filter-method="filterMethod" placeholder="选择主文件格式，可直接输入如jpg" style="width:50%">
        </AutoComplete>
        <h4 class="h4">文件属性要求</h4>
        <div class="onefailPro" id="addPropertyInput">
          <AutoComplete v-model="fileSize" :data="data4" :filter-method="filterMethod" placeholder="尺寸" style="width:20%">
          </AutoComplete>
          <AutoComplete v-model="fileValue" :data="data5" :filter-method="filterMethod" placeholder="8000*8000" style="width:30%">
          </AutoComplete>
          <div @click="delpro1">
                <Icon type="trash-a" class="icon"></Icon>
          </div>
        </div>
        <div class="onefailPro" id="addPropertyInput2" style="display:none;margin-top:5px">
          <AutoComplete v-model="fileSize" :data="data4" :filter-method="filterMethod" placeholder="尺寸" style="width:20%">
          </AutoComplete>
          <AutoComplete v-model="fileValue" :data="data5" :filter-method="filterMethod" placeholder="8000*8000" style="width:30%">
          </AutoComplete>
          <div @click="delpro2">
                <Icon type="trash-a" class="icon"></Icon>
          </div>
        </div>
        <div id="addProperty" class="marTop10 width12" @click="addProperty"><Icon type="plus-round"></Icon>&nbsp;增加</div>
        <h3 class="h3 marTop10 marTop40">附加文件</h3>
        <h4 class="h4">
          <span>文件格式</span><span>描述</span>
        </h4>
        <div class="border" v-for="item in appendFileFormat">
          <div>
            <span>{{item.taskType}}</span><span>{{item.value}}</span>
          </div>
          <div @click="delFormat">
              <Icon type="trash-a" class="icon"></Icon>
          </div>
        </div>

        <div class="marTop10 width12"  @click="modal1 = true" ><Icon type="plus-round"></Icon>&nbsp;增加附加文件</div >
        <Modal v-model="modal1" title="增加附加文件" @on-ok="ok" @on-cancel="cancel">
          <Input type="text" v-model="aFileFormat "  :autofocus="true" placeholder="请输入文件格式" style="width: 48%;margin-right:2% "></Input
          ><Input type="text" v-model="describe " placeholder="请输入描述内容" style="width: 48%"></Input>
        </Modal>
        <Button type="primary" class="btn" @click="conserve">保存</Button>
      </Form>
    </Content>
  </Layout>
</template>

<script>
var qs = require("querystring");
import tree from "./tree.vue";
export default {
  name: "tasktype",
  components: {
    tree
  },
  data() {
    return {
      typeName: "",
      fileFormat: "",
      fileSize: "",
      fileValue: "",
      current: 0,
      arr: [],
      internalAudit: [],
      data3: ["jpg", "png", "fbx", "avi", "unity"],
      data4: ["尺寸", "贴面数", "帧率"],
      data5: ["8000*8000", ">2000", ">24"],
      appendFileFormat: [],
      modal1: false,
      modal2: false,
      aFileFormat:"",
      describe:"",
      arrStageName:[]
    };
  },
  mounted() {
    if(sessionStorage.oneid) {
        this.Lxinfo(sessionStorage.oneid)
    }
    
  },

  methods: {
    Lxinfo(oneid){
      let data = {
        id: oneid
      };
      
      this.$axios.post(this.GLOBAL.baseRouter + "task/task-type/info",qs.stringify(data)).then(msg => {
        this.typeName = msg.data.tasktype_name
             msg.data.stage.forEach(req => {
              this.arr.push({
                stage_name:req.stage_name
              });
            if(req.is_inside_audit == 1){
              req.is_inside_audit = true
              this.internalAudit.push(req.is_inside_audit)
            }              
          });
          msg.data.file.forEach(r => {
            r.require.forEach(item => {
            let value = item.value;
            let taskType = r.file_format;
              if(r.is_main == 1){
                this.fileFormat = r.file_format
                this.fileSize = item.config_name
                this.fileValue = item.value
              }else{
                this.appendFileFormat.push({
                  taskType: taskType,
                  value: value
                });
              }
            });
          })
          
      })
    },
    // 增加阶段
    addStageInput(req) {
      this.$Modal.confirm({
        title: "增加阶段",
        render: h => {
          return h("Input", {
            props: {
              value: this.value,
              autofocus: true,
              placeholder: "请输入阶段名称"
            },
            on: {
              input: val => {
                this.value = val;
              }
            }
          });
        },
        onOk: () => {
          // 增加阶段
          if (this.value == null) {
            alert("请输入阶段名称");
            this.$Message.error("增加失败");
          } else {
            this.arr.push({
              stage_name: this.value
            });
            this.internalAudit.push(0)

            this.$Message.success("增加成功");
          }
        }
      });
    },

    addProperty () {
      $("#addPropertyInput").show();
      // $("#addProperty").hide()
    },
        delpro1(){
      $("#addPropertyInput").empty()
    },
    delpro2(){
      $("#addPropertyInput2").empty()
    },
  // 添加附加文件
   ok () {
      this.$Message.info('添加完成');
      this.appendFileFormat.push({
             taskType: this.aFileFormat,
              value: this.describe
            });
      // console.log(,)
    },
  cancel () {
  },
  delFormat(){
    this.appendFileFormat.splice(0)
    this.$Message.info('已删除');
  },
  
    //修改
    conserve() {
      let typeId = JSON.parse(sessionStorage.getItem("clickId"));
      let data2 = {
        id: typeId,
        category_id: 22,
        name: this.typeName,
        stage: JSON.stringify([
          {
            stage_name: '',
            is_inside_audit: 1
          }
        ]),
        file: JSON.stringify([
          {
            file_name: "1",
            file_format: this.fileFormat,
            is_main: 1,
            require: [
              {
                config_id: 1,
                config_name: this.fileSize,
                value: this.fileValue
              }
            ]
          }
        ])
      };

          // if(sessionStorage.tasktypeName.indexOf(this.typeName)){
            if (this.typeName) {
              this.$axios.post(this.GLOBAL.baseRouter + "task/task-type/update",qs.stringify(data2)).then(res => {             
                this.$refs.child.taskTypeList()
                this.$Message.success("成功保存");
              });
            } else {
              alert("请输入类型名称");
            }            
          // }else{
          //  this.$Message.error("增加失败请重新修改");
          // }

          
          
        

    },  
      // 获取信息
    getListId(clicktype) {
      this.arr = [];
      this.appendFileFormat = [];
      this.internalAudit = []
      this.id = clicktype.id;
      let _this = this;
      let data = {
        id: clicktype.id
      };
      this.$axios.post(this.GLOBAL.baseRouter + "task/task-type/info",qs.stringify(data)).then(msg => {
        this.typeName = msg.data.tasktype_name
          msg.data.stage.forEach(req => {
            // console.log(req)
            this.arr.push(req);
            if(req.is_inside_audit == 1){
              req.is_inside_audit = true
              this.internalAudit.push(req.is_inside_audit)
            }
          });
          msg.data.file.forEach(r => {
            let taskType = r.file_format;
            let value;
            r.require.forEach(item => {
              if(r.is_main == 1){
                this.fileFormat = r.file_format
                this.fileSize = item.config_name
                this.fileValue = item.value
              }else{
                _this.appendFileFormat.push({
                  taskType: taskType,
                  value: value
                });
              }
              
            });
            
          });
        }),
        sessionStorage.setItem("clickId", clicktype.id);
    },
// return  getListId,
    filterMethod(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },

  }
};
</script>

<style scoped>
.ivu-layout-sider {
  background: 0;
}
.icon {
  font-size: 20px;
  vertical-align: middle;
}
.checkbox {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18px, 1fr));
}
.increase {
  position: fixed;
  top: 120px;
  right: 10%;
}
.increaseIcon {
  width: 100%;
  font-size: 28px;
  color: #3bc3ad;
  text-align: center;
}
.tree {
  width: 251px;
  display: inline-block;
  box-sizing: border-box;
  border: 1px solid #e6e6e6;
  border-top: none;
  border-radius: 5px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
}

h3 {
  color: #18bfa4;
}
.h4 {
  margin: 5px 0;
}
.h3 {
  margin: 10px 0;
}
.onefailPro>div{
  display: inline-block
}
.border {
  width: auto;
  height: 30px;
  line-height: 30px;
}
.border > div {
  display: inline-block;
}
.border > div:nth-child(1) {
  border-bottom: 1px solid #dedede;
  width: 50%;
}
.border > div:nth-child(2) {
  width: 3%;
  text-align: center;
}
.border > div > span {
  display: inline-block;
  width: 50%;
}
.border > div > span:last-child {
  text-align: right;
}
h4 {
  width: 50%;
}
h4 > span {
  display: inline-block;
  width: 50%;
}
h4 > span:last-child {
  text-align: right;
}
.btn {
  width: 133px;
  height: 31px;
  margin-top: 31px;
}
.marTop10 {
  margin-top: 20px;
}
.marTop40 {
  margin-top: 40px;
}
.width12 {
  width: 12%
}
</style>