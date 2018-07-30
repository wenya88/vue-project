<template>
  <div>
    <!-- <Tree :data="data" show-checkbox ref="tree" empty-text></Tree> -->
    <!-- <ul>
      <li>
        <Checkbox v-model="single">全部项目</Checkbox>
      </li>
      <li>
        <Checkbox v-model="single">负责的项目</Checkbox>
      </li>
      <li>
        <Checkbox v-model="single">负责的子项目</Checkbox>
      </li>
      <li>
        <Checkbox v-model="single">负责的任务</Checkbox>
      </li>
      <li>
        <Checkbox v-model="single">关联的任务</Checkbox>
      </li>
    </ul>
    <ul>
      <li>
        <Checkbox v-model="single">全部投标</Checkbox>
      </li>
      <li>
        <Checkbox v-model="single">负责的投标</Checkbox>
      </li>
    </ul>
    <ul>
      <li>
        <Checkbox v-model="single">全部合同</Checkbox>
      </li>
      <li>
        <Checkbox v-model="single">负责的合同</Checkbox>
      </li>
    </ul> -->
    <ul>
      <CheckboxGroup v-model="project">
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
      single: false,
      project: [],
      bid: [],
      contract: []
      // data: [{
      //   title: '全部项目',
      //   expand: true,
      //   children: [{
      //     title: '负责的项目',
      //     expand: true,
      //     children: [{
      //       title: '负责的子项目',
      //       expand: true,
      //       children: [{
      //         title: '负责的任务'
      //       }, {
      //         title: '关联的任务'
      //       }, {
      //         title: '',
      //         checked: true
      //       }]
      //     }, {
      //     title: '',
      //     checked: true
      //   }]
      //   }, {
      //     title: '',
      //     checked: true
      //   }]
      // }, {
      //   title: '全部投标',
      //   expand: true,
      //   children: [{
      //     title: '负责的投标',
      //   }, {
      //     title: '',
      //     checked: true
      //   }]
      // }, {
      //   title: '全部合同',
      //   expand: true,
      //   children: [{
      //     title: '负责的合同',
      //   }, {
      //     title: '',
      //     checked: true
      //   }]
      // }]
    }
  },
  mounted () {
    // console.log(this.$refs.tree.getCheckedNodes())
  },
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
