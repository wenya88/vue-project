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
          <Step v-for="(item,index) in arr" :key="index"  :title=item.stage_name >
            <div @click="delStage" class="cursor delStage">
              <Icon type="ios-close-outline" class="iconSmall"></Icon>
            </div>            
          </Step>
          <Step title="成品确认"></Step>
        </Steps>
        <CheckboxGroup class="checkbox">
          <Checkbox type="checkbox"  v-for="(item,index) in internalAudit"  :key="index" label="内审"></Checkbox>
          <Checkbox type="checkbox"  label="内审"></Checkbox>
        </CheckboxGroup>
        <div class="increase cursor" @click="addStageInput">
          <Icon type="ios-plus-outline" class="increaseIcon"></Icon>
          <p>增加阶段</p>
        </div>

        <h3 class="h3 marTop10 marTop40">主文件</h3>
        <h4 class="h4">文件格式</h4>
        <AutoComplete v-model="fileFormat" :data="fileFormatArr" :filter-method="filterMethod" placeholder="选择主文件格式，可直接输入如jpg" style="width:50%">
        </AutoComplete>
        <h4 class="h4">文件属性要求</h4>
        <div class="onefailPro" v-for="item in fileProDemand">
          <AutoComplete v-model="item.fileSize" :data="ProReqArr" :filter-method="filterMethod" style="width:20%">
          </AutoComplete>
          <AutoComplete v-model="item.fileValue" :data="valueArr" :filter-method="filterMethod" style="width:30%">
          </AutoComplete>
          <div @click="delpro" class="cursor">
            <Icon type="trash-a" class="icon"></Icon>
          </div>
        </div>
        <div class=" width12 cursor" @click="addProperty"><Icon type="plus-round"></Icon>&nbsp;增加</div>
        <h3 class="h3 marTop10 marTop40">附加文件</h3>
        <h4 class="h4">
          <span>文件格式</span><span>描述</span>
        </h4>
        <div class="border" v-for="item in appendFileFormat">
          <div>
            <span>{{item.taskType}}</span><span>{{item.value}}</span>
          </div>
          <div @click="Closelabel">
              <Icon type="trash-a" class="icon"></Icon>
          </div>
        </div>
        <div><Button icon="ios-plus-empty" type="text" size="small" @click.stop="Addlabel">
          增加附加文件
            <div class="addLabel" v-show="addLabDIV">
              <Input v-model="aFileFormat" placeholder="文件格式" style="width: 100px;"></Input>
              <Input v-model="describe" placeholder="描述" style="width: 200px;"  @keyup.13.native="submitLabel($event)"></Input>
              <Button type="primary" size="small" @click.native.stop="submitLabel">添加</Button>&nbsp;
              <Button size="small" @click.stop="closeAddDIV">取消</Button>
            </div>          
          </Button>
        </div>
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
      arr: [],
      internalAudit: [],
      appendFileFormat: [],
      arrStageName:[],
      fileProDemand:[],
      fileFormatArr: ["jpg", "png", "fbx", "avi", "unity"],
      ProReqArr: ["尺寸", "贴面数", "帧率"],
      valueArr: ["8000*8000", ">2000", ">24"],
      typeName: "",
      fileFormat: "",
      fileSize: "",
      fileValue: "",
      aFileFormat:'',
      describe:'',
      categoryId:'',
      modal1: false,
      modal2: false,
      addLabDIV:false,
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
    // newStage
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
          if (this.value == null) {
            alert("请输入阶段名称");
            this.$Message.error("增加失败");
          } else {
            this.arr.push({
              stage_name: this.value
            });
            this.internalAudit.push(0)
            this.value = ""
            this.$Message.success("增加成功");
          }
        }
      });
    },
    delStage(){
      const index = this.arr.indexOf(name);
      this.arr.splice(index, 1);
      const index2 = this.internalAudit.indexOf(name);
      this.internalAudit.splice(index2, 1);      
    },    
    overShow(){
      console.log("111")
    },
    outHide(){
      console.log("222")
    },
    // 增加文件属性
    addProperty () {
      let fileSize
        this.fileProDemand.push({
          fileSize :this.fileSize,
          fileValue :this.fileValue
        })
    },
    // 附加文件
    Addlabel () {
        this.addLabDIV=true;
    },    
    submitLabel(){
        this.appendFileFormat.push({
            taskType : this.aFileFormat,
            value : this.describe
        });
        this.addLabDIV=false;
        this.aFileFormat='';
        this.describe=''
    }, 
    closeAddDIV(){
        this.addLabDIV=false;
        this.aFileFormat='';
        this.describe=''
    },  
    
    Closelabel (event, name) {
      const index = this.appendFileFormat.indexOf(name);
      this.appendFileFormat.splice(index, 1);
    }, 
        
    delpro(){
      const index = this.fileProDemand.indexOf(name);
      this.fileProDemand.splice(index, 1);
    },
    //修改、提交
    conserve() {
      let typeId = JSON.parse(sessionStorage.getItem("clickId"));
      this.arr.forEach(r => {
        console.log(r.stage_name)
      })
      let data2 = {
        id: typeId,
        category_id: this.categoryId,
        name: this.typeName,
        stage: JSON.stringify([
          {

            stage_name: "",
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
                value: this.fileValue,
              }
            ]
          }
        ])
      };
      if (this.typeName) {
        this.$axios.post(this.GLOBAL.baseRouter + "task/task-type/update",qs.stringify(data2)).then(res => {             
          this.$refs.child.taskTypeList()
          this.$Message.success("成功保存");
        });
      } else {
        alert("请输入类型名称");
      }       
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
        this.categoryId = msg.data.category_id
        this.typeName = msg.data.tasktype_name
          msg.data.stage.forEach(req => {
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
                this.fileFormat = r.file_format//格式
                this.fileSize = item.config_name//配置项
                this.fileValue = item.value//尺寸
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
    filterMethod(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },

  }
};
</script>
<style scoped>
.steps{
 line-height: 20px
}
.ivu-layout-sider {
  background: 0;
}
.icon {
  font-size: 20px;
  vertical-align: middle;
}
.iconSmall{
  font-size: 14px;
  color: #999;
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
  display: inline-block;
  margin-bottom: 10px;
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
.cursor {
  cursor: pointer;
}
.addLabel{
  position:absolute;
  border-radius:4px;
  padding:5px;
  background:#fff;
  width:200px;
  margin-top:-28px;
  margin-left:-10px;
  text-align:left;
            
}
.delStage{
  position: absolute;
  top: -5px;
  right:-5px;
}
</style>
