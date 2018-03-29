<template>
  <div class="pigeonhole">
    <Row type="flex" justify="start" class="code-row-bg">
      <Col span="8" v-for="(item,index) in fileData" :key="index">
      <div class="card" @click="handleRender = true">
        <div class="card-box">
          <!-- <Icon type="heart" color="red" v-if=""></Icon>
          <Icon type="pause" v-else-if=""></Icon> -->
          <img class="card-box-pic" :src="item.thumb"/>
        </div>
        <div class="tips">
          <span class="tag">{{item.tasktype_name}}</span>{{item.task_name}}
          <span class="date">上传：{{item.create_date}}</span>
        </div>
      </div>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: (Date.parse(new Date()))/1000,
      searchInput: '',
      fileData: []
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      let _this = this;
      _this.$axios.get('/task/stage-page'+'&status=1&search='+_this.searchInput)
      .then(res => res.data)
      .then(res => {
        if(res.err_code == 0) {
          _this.fileData = res.data
          console.log(_this.fileData)
        }
      })
    }
  }
}
</script>

<style lang='less'>
@import "./style/project.less";
</style>
