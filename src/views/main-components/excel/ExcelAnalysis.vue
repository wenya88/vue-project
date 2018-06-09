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
                  {{ item.title }} : {{ item.label }}
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
                <div style="height: 44px;">
                  <ul id="demand" class="iview-admin-draggable-list hideList"></ul>
                </div>
                <div style="height: 44px;">
                  <ul id="images" class="iview-admin-draggable-list hideList"></ul>
                </div>
                <div style="height: 44px;">
                  <ul id="enclosure" class="iview-admin-draggable-list hideList"></ul>
                </div>
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
  </div>
</template>

<script>
var qs = require('querystring');
import Sortable from 'sortablejs';
import DragableTable from '../dragableTable.vue'
export default {
  name: 'ExcelAnalysis',
  components: {
    DragableTable
  },
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
          name: '文件要求'
        }, {
          name: '参考图片'
        }, {
          name: '参考附件'
        }, {
          name: '要求说明'
        }
      ]
    }
  },
  created() {
    if (sessionStorage.analysisFileId) {
      this.analysisExcel(sessionStorage.analysisFileId)
    }
    // 可在此从服务端获取表格数据
    this.getData();
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
    this.dragableAssembly("demand");
    this.dragableAssembly("images");
    this.dragableAssembly("enclosure");
    this.dragableAssembly("remarks");
    // let vm = this;
    // let excelList = document.getElementById('excelList');
    // Sortable.create(excelList, {
    //   group: {
    //     name: 'list',
    //     pull: true
    //   },
    //   animation: 120,
    //   ghostClass: 'placeholder-style',
    //   fallbackClass: 'iview-admin-cloned-item',
    //   onRemove(event) {
    //     // vm.affordList.splice(event.newIndex, 0, vm.excelList[event.item.getAttribute('data-index')]);
    //     console.log(event);
    //   }
    // });
    // let taskName = document.getElementById('taskName');
    // Sortable.create(taskName, {
    //   group: {
    //     name: 'list',
    //     pull: true
    //   },
    //   // sort: false,
    //   filter: '.iview-admin-draggable-delete',
    //   animation: 120,
    //   fallbackClass: 'iview-admin-cloned-item',
    //   onRemove(event) {
    //     // vm.taskName.splice(event.oldIndex, 1);
    //   }
    // });
    // let startTime = document.getElementById('startTime');
    // Sortable.create(startTime, {
    //   group: {
    //     name: 'list',
    //     pull: true
    //   },
    //   // sort: false,
    //   filter: '.iview-admin-draggable-delete',
    //   animation: 120,
    //   fallbackClass: 'iview-admin-cloned-item',
    //   onRemove(event) {
    //     // vm.startTime.splice(event.oldIndex, 1);
    //   }
    // });
    // let endTime = document.getElementById('endTime');
    // Sortable.create(endTime, {
    //   group: {
    //     name: 'list',
    //     pull: true
    //   },
    //   // sort: false,
    //   filter: '.iview-admin-draggable-delete',
    //   animation: 120,
    //   fallbackClass: 'iview-admin-cloned-item',
    //   onRemove(event) {
    //     // vm.endTime.splice(event.oldIndex, 1);
    //   }
    // });
  },
  methods: {
    /**
     * 配置sortable
     */
    dragableAssembly(idDom) {
      let idDom2 = document.getElementById(idDom);
      console.log(idDom, idDom2);
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
          console.log(event);
        }
      });
    },
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
            }
          });
          let arrLength = this.excelList.length / 2;
          // console.log(arrLength,this.excelList.slice(0,arrLength))
          // let oobj=JSON.stringify(obj)
          // console.log(oobj.replace(/"/g,''))
        })
      // this.$emit('analysisNext')
    },
    getData() {
      this.columnsList = [
        {
          title: '演示数据',
          key: 'label'
        },{
          title: '拖拽',
          key: 'drag',
          width: 90,
          align: 'center',
          render: (h) => {
            return h(
              'Icon',
              {
                props: {
                  type: 'arrow-move',
                  size: 24
                }
              }
            );
          }
        }
      ];
      this.tableData = this.affordList;
    }
  }
}
</script>

<style scoped>
@import 'style/draggableList.less';
</style>
