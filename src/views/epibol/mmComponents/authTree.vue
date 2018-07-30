<template>
  <div>
    <ul>
      <CheckboxGroup v-model="project" >
        <li><Checkbox label="全部项目"></Checkbox></li>
        <li><Checkbox label="负责的项目"></Checkbox></li>
        <li><Checkbox label="负责的子项目"></Checkbox></li>
        <li><Checkbox label="负责的任务"></Checkbox></li>
        <li><Checkbox label="关联的任务"></Checkbox></li>
      </CheckboxGroup>
    </ul>
    <ul>
      <CheckboxGroup v-model="bid">
        <li><Checkbox label="全部投标"></Checkbox></li>
        <li><Checkbox label="负责的投标"></Checkbox></li>
      </CheckboxGroup>
    </ul>
    <ul>
      <CheckboxGroup v-model="contract">
        <li><Checkbox label="全部合同"></Checkbox></li>
        <li><Checkbox label="负责的合同"></Checkbox></li>
      </CheckboxGroup>
    </ul>
  </div>
</template>

<script>
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
            project.push(list[i].project_auth.name);
            bid.push(list[i].bid_auth.name);
            contract.push(list[i].contract_auth.name);
            this.project = [...new Set(project)];
            this.bid = [...new Set(bid)];
            this.contract = [...new Set(contract)];
          }
        }
      })
    },
    updateType() {}
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
