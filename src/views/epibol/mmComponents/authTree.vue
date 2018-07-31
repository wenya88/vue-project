<template>
  <div>
    <ul>
      <CheckboxGroup v-model="project" @on-change="changeProjectBox">
        <li><Checkbox label="1">全部项目</Checkbox></li>
        <li><Checkbox label="2">负责的项目</Checkbox></li>
        <li><Checkbox label="3">负责的子项目</Checkbox></li>
        <li><Checkbox label="4">负责的任务</Checkbox></li>
        <li><Checkbox label="5">关联的任务</Checkbox></li>
      </CheckboxGroup>
    </ul>
    <ul>
      <CheckboxGroup v-model="bid" @on-change="changeBidBox">
        <li><Checkbox label="1">全部投标</Checkbox></li>
        <li><Checkbox label="2">负责的投标</Checkbox></li>
      </CheckboxGroup>
    </ul>
    <ul>
      <CheckboxGroup v-model="contract" @on-change="changeContractBox">
        <li><Checkbox label="1">全部合同</Checkbox></li>
        <li><Checkbox label="2">负责的合同</Checkbox></li>
      </CheckboxGroup>
    </ul>
  </div>
</template>

<script>
var qs = require('querystring');
export default {
  data() {
    return {
      project: [],
      bid: [],
      contract: []
    }
  },
  mounted () {
    this.changeType();
  },
  methods: {
    changeType() {
      let project = [],bid = [],contract = []
      this.$bus.on("changeAuth", (val,list) => {
        for(let i=0;i<list.length;i++){
          if(list[i].id==val){
            // project.push(list[i].project_auth.type);
            // bid.push(list[i].bid_auth.type);
            // contract.push(list[i].contract_auth.type);
            if(list[i].project_auth.type == "1") {
              project = ["1","2","3","4","5"]
            } else if(list[i].project_auth.type == "2") {
              project = ["2","3","4","5"]
            } else if(list[i].project_auth.type == "3") {
              project = ["3","4","5"]
            } else if(list[i].project_auth.type == "4") {
              project = ["4"]
            } else if(list[i].project_auth.type == "5") {
              project = ["5"]
            } else if(list[i].project_auth.type == "4,5" || list[i].project_auth.type == "5,4") {
              project = ["4","5"]
            } else {
              project.push(list[i].project_auth.type);
            }
            if(list[i].bid_auth.type == "1") {
              bid = ["1","2"]
            } else {
              bid.push(list[i].bid_auth.type);
            }
            if(list[i].contract_auth.type == "1") {
              contract = ["1","2"]
            } else {
              contract.push(list[i].contract_auth.type);
            }
            this.project = [...new Set(project)];
            this.bid = [...new Set(bid)];
            this.contract = [...new Set(contract)];
          }
        }
      })
    },
    changeProjectBox(res) {
      // let list = res.join(",")
      let Num=[]
      for(let i=0;i<res.length;i++){
        if("1"==res[i]&&"2"!=res[i]&&"3"!=res[i]){
          Num=[]
          Num.push("1")
        }else if("2"==res[i]&&"1"!=res[i]&&"3"!=res[i]){
          Num=[]
          Num.push("2")
        }else if("3"==res[i]&&"2"!=res[i]&&"1"!=res[i]){
          Num=[]
          Num.push("3")
        }else if("4"==res[i] || "5"==res[i]){
          // Num=[]
          Num.push(res[i])
        }
      }
      this.updateType("project_auth",Num)
    },
    changeBidBox(res) {
      this.updateType("bid_auth",res)
    },
    changeContractBox(res) {
      this.updateType("contract_auth",res)
    },
    updateType(auth,type) {
      let data = {
        id: sessionStorage.postId,
        auth: auth,
        name: '',
        type: JSON.stringify(type)
      }
      this.$axios.post(this.GLOBAL.baseRouter+'system/auth/auth-update', qs.stringify(data))
      .then(res => res.data)
      .then(res => {
        if(res.err_code == 0) {
          // 修改成功
        }
      })
    }
  },
  updated() {
    this.changeType();
  }
}
</script>

<style scoped lang="less">
.ivu-tree-children{
  border-bottom: 1px solid;
}
ul{
  padding: 20px;
  padding-bottom: 0;
  li{
    line-height: 30px;
    &:nth-child(2){
      margin-left: 20px;
    }
    &:nth-child(3){
      margin-left: 40px;
    }
    &:nth-child(4),&:nth-child(5){
      margin-left: 60px;
    }
  }
}
</style>
