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
    <!-- <Row class="margin-top-10">
      <Col span="16"> -->
      <Card>
        <Row>
          <Col span="12" class="padding-left-10">
          <Card dis-hover>
            <p slot="title">
              <Icon type="navicon-round"></Icon>
              左侧为已识别的表格字段和数据，可拖动至右侧
            </p>
            <div style="height: 530px;">
              <ul id="excelList" class="iview-admin-draggable-list">
                <li v-for="(item, index) in excelList" :key="index" class="notwrap todolist-item" :data-index="index">
                  {{ item.title }}:{{ item.label }}
                  <!-- <div>{{ item.title }}</div><div>{{ item.label }}</div> -->
                </li>
              </ul>
            </div>
          </Card>
          </Col>
          <Col span="12">
          <Card dis-hover>
            <p slot="title">
              <Icon type="android-funnel"></Icon>
              匹配数据
            </p>
            <Row>
              <Col span="4">
                <ul>
                  <li v-for="(item,index) in titleList" :key="index" style="padding: 12px 0; text-align: center;">{{item.name}}</li>
                </ul>
              </Col>
              <Col span="20">
                <div style="height: 44px;">
                  <ul id="taskName" class="iview-admin-draggable-list hideList"></ul>
                </div>
                <div style="height: 44px;">
                  <ul id="startTime" class="iview-admin-draggable-list hideList"></ul>
                </div>
                <div style="height: 44px;">
                  <ul id="endTime" class="iview-admin-draggable-list hideList"></ul>
                </div>
                <div style="height: 44px;">
                  <ul id="subproject" class="iview-admin-draggable-list hideList"></ul>
                </div>
                <div style="height: 44px;">
                  <ul id="participants" class="iview-admin-draggable-list hideList"></ul>
                </div>
                <div style="height: 44px;">
                  <ul id="taskStyle" class="iview-admin-draggable-list hideList"></ul>
                </div>
                <!-- <div style="height: 44px;">
                  <ul id="demand" class="iview-admin-draggable-list hideList"></ul>
                </div> -->
                <div style="height: 44px;">
                  <ul id="images" class="iview-admin-draggable-list hideList"></ul>
                </div>
                <!-- <div style="height: 44px;">
                  <ul id="enclosure" class="iview-admin-draggable-list hideList"></ul>
                </div> -->
                <div style="height: 44px;">
                  <ul id="remarks" class="iview-admin-draggable-list hideList"></ul>
                </div>
              </Col>
            </Row>
          </Card>
          </Col>
        </Row>
      </Card>
      <!-- </Col> -->
      <!-- <Col span="8" class="padding-left-10">
      <Card>
        <p slot="title">
          <Icon type="android-funnel"></Icon>
          匹配数据
        </p>
        <div style="height: 530px;">
          <Table border :columns="columns" :data="titleList" width=100 style="float: left;"></Table>
          <DragableTable v-model="tableData" :columns-list="columnsList" style="width: 245px;float: left;"></DragableTable> -->
          <!-- <ul class="iview-admin-draggable-list">
                <li v-for="(item, index) in affordList" :key="index" class="notwrap" :data-index="index">
                  {{ item.label }}
                </li>
              </ul>  -->
        <!-- </div>
      </Card>
      </Col> -->
    <!-- </Row> -->
    <Button class="toTable" type="primary" @click="toTable()" v-if="second">下一步</Button>  
  </div>
</template>

<script>
var qs = require('querystring');
var mate = {
  name: '',
  expect_start_time: '',
  expect_end_time: '',
  project_child: '',
  run_member_id: '',
  tasktype_id: '',
  image: '',
  description: ''
}
import Sortable from 'sortablejs';
import DragableTable from '../dragableTable.vue'
export default {
  name: 'ExcelAnalysis',
  components: {
    DragableTable
  },
  props: {
    second:{
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      headList: [],
      firstList: [],
      loadingStatus: true,
      excelList: [],
      affordList: [],
      columnsList: [],
      tableData: [],
      columns: [
        {
          title: '字段',
          key: 'name'
        }
      ],
      titleList: [
        {
          name: '任务名称'
        }, {
          name: '预计开始'
        }, {
          name: '预计结束'
        }, {
          name: '子项目'
        }, {
          name: '参与人'
        }, {
          name: '任务类型'
        }, {
          name: '参考图片'
        }, {
          name: '要求说明'
        }
      ],
      mate: {},
      excel_key: ''
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
    this.dragableAssembly("excelList");
    this.dragableAssembly("taskName");
    this.dragableAssembly("startTime");
    this.dragableAssembly("endTime");
    this.dragableAssembly("subproject");
    this.dragableAssembly("participants");
    this.dragableAssembly("taskStyle");
    // this.dragableAssembly("demand");
    this.dragableAssembly("images");
    // this.dragableAssembly("enclosure");
    this.dragableAssembly("remarks");
  },
  methods: {
    /**
     * 配置sortable
     */
    dragableAssembly(idDom) {
      let idDom2 = document.getElementById(idDom);
      // console.log(idDom,typeof idDom);
      Sortable.create(idDom2, {
        group: {
          name: 'list',
          pull: true
        },
        animation: 120,
        ghostClass: 'placeholder-style',
        fallbackClass: 'iview-admin-cloned-item',
        onRemove(event) {
          // vm.affordList.splice(event.newIndex, 0, vm.excelList[event.item.getAttribute('data-index')]);
          // console.log(idDom,event,event.item.innerText.split(':')[0]);
          let toIdDom = event.to.id
          // let mate = {}
          switch (toIdDom)
          {
          case "taskName":
          // console.log(idDom)
            mate.name = event.item.innerText.split(':')[0];
            break;
          case "startTime":
            mate.expect_start_time = event.item.innerText.split(':')[0];
            break;
          case "endTime":
            mate.expect_end_time = event.item.innerText.split(':')[0];
            break;
          case "subproject":
            mate.project_child = event.item.innerText.split(':')[0];
            break;
          case "participants":
            mate.run_member_id = event.item.innerText.split(':')[0];
            break;
          case "taskStyle":
            mate.tasktype_id = event.item.innerText.split(':')[0];
            break;
          case "images":
            mate.image = event.item.innerText.split(':')[0];
            break;
          case "remarks":
            mate.description = event.item.innerText.split(':')[0];
            break;
          }
        }
      });
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
          this.excel_key = res.excel_key
          // console.log(res,res.excel_data)
          // let obj=[]
          res.excel_data.forEach((item, index) => {
            for (let i = 0; i < res.excel_data[index].length; i++) {
              let k = res.excel_data[0][i];
              let j = res.excel_data[1][i];
              // obj.push('{'+k+':'+j+'}')
              this.excelList.push({
                title: k,
                label: j
              })
              // console.log(k.length,k)
              // console.log(j.length,j)
            }
          });
          let arrLength = this.excelList.length / 2;
          // console.log(arrLength,this.excelList.slice(0,arrLength));
          this.excelList = this.excelList.slice(0,arrLength);
          // let oobj=JSON.stringify(obj)
          // console.log(oobj.replace(/"/g,''))
        })
      // this.$emit('analysisNext')
    },
    toTable() {
      this.mate = JSON.stringify(mate);
      // console.log('下一步',this.mate)
      let data = {
        mate: this.mate,
        excel_key: this.excel_key,
        project_id: sessionStorage.projectID
      }
      // console.log(data)
      sessionStorage.matchData = JSON.stringify(data)
      // this.$axios.post(this.GLOBAL.baseRouter+'task/task/mate-excel', qs.stringify(data))
      // .then(res => res.data)
      // .then(res => {
      //   console.log(res)
      // })
      this.$emit('next',data)
    }
  }
}
</script>

<style scoped>
.toTable{
  position: absolute;
  bottom: 5px;
  z-index: 10;
  left: 87px;
}
@import 'style/draggableList.less';
</style>
