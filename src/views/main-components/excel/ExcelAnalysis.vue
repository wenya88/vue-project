<template>
  <div>
    <Spin fix v-if="loadingStatus" style="top: 50%;">
      <Icon type="load-c" size=36 class="demo-spin-icon-load"></Icon>
      <div>解析中</div>
    </Spin>
    <!-- <div class="left">
          <ul>
            <li v-for="(item,index) in headList" :key="index">{{item}}</li>
          </ul>
        </div> -->
    <Row class="margin-top-10">
      <Col span="16">
      <Card>
        <p slot="title">
          <Icon type="navicon-round"></Icon>
          可滚动拖拽
        </p>
        <Row>
          <Col span="12" class="padding-left-10">
          <Card dis-hover>
            <div style="height: 360px;">
              <ul id="excelList" class="iview-admin-draggable-list">
                <li v-for="(item, index) in excelList" :key="index" class="notwrap todolist-item" :data-index="index">
                   {{ item.title }} : {{ item.label }} 
                  <!-- <div>{{ item.title }}</div><div>{{ item.label }}</div> -->
                </li>
              </ul>
            </div>
          </Card>
          </Col>
          <Col span="12">
          <Card dis-hover>
            <div style="height: 360px;">
              <ul id="affordList" class="iview-admin-draggable-list"></ul>
            </div>
          </Card>
          </Col>
        </Row>
      </Card>
      </Col>
      <Col span="8" class="padding-left-10">
      <Card>
        <p slot="title">
          <Icon type="android-funnel"></Icon>
          买得起的清单
        </p>
        <div style="height: 394px;">
          <ul class="iview-admin-draggable-list">
            <li v-for="(item, index) in affordList" :key="index" class="notwrap" :data-index="index">
              {{ item.label }}
            </li>
          </ul>
        </div>
      </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
var qs = require('querystring');
import Sortable from 'sortablejs';
export default {
  name: 'ExcelAnalysis',
  props: {
    // headList: {
    //   type: Array,
    //   default: []
    // }
    // excelData: {
    //   type: Object,
    //   default: {}
    // }
  },
  data() {
    return {
      headList: [],
      firstList: [],
      loadingStatus: true,
      excelList: [],
      affordList: []
    }
  },
  created() {
    if (sessionStorage.analysisFileId) {
      this.analysisExcel(sessionStorage.analysisFileId)
    }
  },
  mounted() {
    document.body.ondrop = function(event) {
      event.preventDefault();
      event.stopPropagation();
    };
    let vm = this;
    let excelList = document.getElementById('excelList');
    Sortable.create(excelList, {
      group: {
        name: 'list',
        pull: true
      },
      animation: 120,
      ghostClass: 'placeholder-style',
      fallbackClass: 'iview-admin-cloned-item',
      onRemove(event) {
        vm.affordList.splice(event.newIndex, 0, vm.excelList[event.item.getAttribute('data-index')]);
      }
    });
    let affordList = document.getElementById('affordList');
    Sortable.create(affordList, {
      group: {
        name: 'list',
        pull: true
      },
      sort: false,
      filter: '.iview-admin-draggable-delete',
      animation: 120,
      fallbackClass: 'iview-admin-cloned-item',
      onRemove(event) {
        vm.affordList.splice(event.oldIndex, 1);
      }
    });
  },
  methods: {
    fetchExcel() {

    },
    /**
     * 解析excel
     */
    analysisExcel(fileId) {
      let data = {
        fid: fileId
      }
      this.$axios.post(this.GLOBAL.baseRouter + 'task/task/resolve-excel', qs.stringify(data))
        .then(res => res.data)
        .then(res => {
          this.loadingStatus = true;
          let excelData = res;
          if (excelData) {
            this.loadingStatus = false;
          }
          
          // console.log(res,res.excel_data)
          let obj=[]
          res.excel_data.forEach((item,index) => {
             for(let i=0;i<res.excel_data[index].length;i++){
              let k=res.excel_data[0][i];
              let j=res.excel_data[1][i];
              // obj.push('{'+k+':'+j+'}')
              this.excelList.push({
                title: k,
                label: j
              })
             }
          });
          let arrLength = this.excelList.length/2;
          // console.log(arrLength,this.excelList.slice(0,arrLength))
          // let oobj=JSON.stringify(obj)
          // console.log(oobj.replace(/"/g,''))
        })
      // this.$emit('analysisNext')
    }
  }
}
</script>

<style scoped>
@import 'style/draggableList.less';
</style>
