<template>
    <Layout class="Award">
        <Sider  hide-trigger class="list">
            <div class="failHeader">
                <!-- <icon type="folder" class="icon"></icon>
                <icon type="filing" class="icon"></icon>
                <icon type="search" class="icon search"></icon> -->
            </div>
            <tree class="tree" @getListId = "getListId"></tree>
        </Sider>
        <Content style="margin-left:100px" >
            <h3 class="h3">基本信息</h3>
            <h4 class="h4">类型名称</h4>
            <Input v-model="typeName" :autofocus="true" placeholder="请输入类型名称"  style="width: 50%"></Input>
            <h4 class="h4 marTop10">实施阶段</h4>
            <Steps :current="3" class="steps">
                <Step v-for="item in arr"  :title=item.stage_name content=""></Step>
                 
            </Steps>
            <CheckboxGroup class="checkbox">
               <Checkbox v-for="item in arr" label="内审" ></Checkbox>
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
            <AutoComplete v-model="fileSize" :data="data4" :filter-method="filterMethod" placeholder="尺寸" style="width:20%">
            </AutoComplete>
            <AutoComplete v-model="fileValue" :data="data5" :filter-method="filterMethod" placeholder="8000*8000" style="width:30%">
            </AutoComplete>
            <h3 class="h3 marTop10 marTop40">附加文件</h3>
            <h4 class="h4">
                <span>文件格式</span><span>描述</span>
            </h4>
            <div class="border"  v-for="item in appendFileFormat">
                <div>
                    <span>{{item.taskType}}</span><span>{{item.value}}</span>
                </div>
                <!-- <div @click="delFormat">
                    <Icon type="trash-a" class="icon"></Icon>
                </div> -->
            </div>
            
            <!-- <div class="marTop10"  @click="addfail">+增加附加文件</div> -->
            <Button type="success" class="btn" @click="conserve">保存</Button>
        </Content>
    </Layout>
</template>

<script>
var qs=require('querystring');
import tree from './tree.vue';
export default {
  name: "tasktype",
  components:{
      tree
      },
  data() {
    return {
      typeName:'',
      fileFormat:'',
      fileSize:'',
      fileValue:'',
      // sessMsgData:[],
      current: 0,
      arr: [],
      data3: ["jpg", "png", "fbx", "avi", "unity"],
      data4: ["尺寸", "面数", "比较单位"],
      data5: ["8000*8000", "属性A", "属性B"],
      appendFileFormat:[],
      aff:{}
    };
  },
  mounted() {
  },
  methods: {
    addStageInput() {
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
                    input: (val) => {
                        this.value = val;
                    }
                }
          });
        },
        onOk: () => {
                  console.log(this.value)
                  this.$Message.success("增加成功");
              }
      });
    },
    // 获取信息
    getListId(clicktype){
      let _this =this
      let data = {
        id: clicktype.id
      }
      this.$axios.post(this.GLOBAL.baseRouter + "task/task-type/info",qs.stringify(data)).then(msg => {
          msg.data.stage.forEach(req => {
                  this.arr.push(req); //属性
                  // this.arr.empty()
          })
          msg.data.file.forEach(r => {
            _this.aff.fileFormat = r.file_format
            let taskType = r.file_format
            let value;
            r.require.forEach( item => {
              value = item.value
            })
            _this.appendFileFormat.push({
              taskType: taskType,
              value: value
            })
            console.log(taskType,value,_this.appendFileFormat)
            
            

            // console.log(r.require)
            // r.require.forEach(req => {
            // _this.aff.value = req.value
            // _this.appendFileFormat.push(_this.aff)
            // // console.log(_this.aff)
            // console.log("12122",_this.appendFileFormat)
            // })
          })
          // console.log(msg)
      })
    },
    addStage(data, $event){
      console.log(data)
    },
    attachedFiles(){

    },
    addfail(){
        

    },
    delFormat() {
    },
    filterMethod(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    //保存
    conserve() {
      let data = {
        id:65,
        name: this.typeName,
        file_format: this.fileFormat,
        config_name: this.fileSize,
        value: this.fileValue,
      };
      this.$axios.post(this.GLOBAL.baseRouter + "task/task-type/cate-update", qs.stringify(data))
        .then(res => res.data)
        .then(res => {
          if (res.err_code == 0) {
            console.log(this.typeName)
            if(this.typeName){
                this.$Message.success("成功保存");
            }else{
              alert("请输入类型名称")
            }
            
          }
        });
    },

  }
};
</script>

<style scoped>

.ivu-layout-sider{
  background: 0
}
.failHeader {
  position: relative;
  width: 251px;
  height: 43px;
  line-height: 33px;
  padding: 8px;
  background-color: #e6e6e6;
  border-radius: 5px;
  border-bottom-right-radius:0; 
  border-bottom-left-radius:0; 
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
  border-top:none;
  border-radius: 5px;
  border-top-right-radius:0; 
  border-top-left-radius:0; 
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
  width: 47%;
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
  width: 45%;
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
</style>