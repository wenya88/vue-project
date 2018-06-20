<template>
  <div>
    <Spin fix v-if="loadingStatus" style="top: 50%;">
      <Icon type="load-c" size=36 class="demo-spin-icon-load"></Icon>
      <div>{{text}}</div>
    </Spin> 
    <div style="color: red;">带*号的字段为必填项，不能为空</div>
    <!-- <Table border :columns="editIncellColumns" :data="editIncellData"></Table> -->
     <div class="edittable-table-height-con" style="height: 660px;overflow: auto;">
      <can-edit-table refs="table3" v-model="editIncellData" :hover-show="true" :edit-incell="true" :columns-list="editIncellColumns"></can-edit-table>
    </div> 
    <Button class="toTable" type="primary" @click="uploadExcel()" v-if="third">下一步</Button>
  </div>
</template>

<script>
var qs = require('querystring');
import canEditTable from './ExcelTableEdit.vue';
export default {
  name: 'ExcelTable',
  components: {
    canEditTable
  },
  props: {
    third:{
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loadingStatus: false,
      editIncellData: [],
      editIncellColumns: [
        {
          title: '* 任务名称',
          align: 'center',
          key: 'name',
          width: 120,
          editable: true,
          required: true,
          cellType: 'input'
        }, {
          title: '* 任务开始',
          align: 'center',
          width: 160,
          key: 'expect_start_time'
        }, {
          title: '* 任务结束',
          align: 'center',
          width: 160,
          key: 'expect_end_time',
          editable: true,
          cellType: 'datePicker'
        }, {
          title: '子项目',
          align: 'center',
          width: 120,
          key: 'project_child',
          editable: true,
          cellType: 'select'
          // render: (h,param) => {
          //   let texts = ''
          //   console.log(param.row.project_child_name)
          //   // console.log(this.editIncellData[param.index].project_child.project_child_name)
          //   // texts = this.editIncellData[param.index].project_child.project_child_name
          //   return h('div', {}
          //   ,texts)
          // }
        }, {
          title: '参与人',
          align: 'center',
          width: 120,
          key: 'run_member_id',
          editable: true,
          cellType: 'select'
        }, {
          title: '* 任务类型',
          align: 'center',
          width: 160,
          key: 'tasktype_id',
          editable: true,
          cellType: 'select'
        }, {
          title: '参考图片',
          align: 'center',
          width: 160,
          key: 'image',
          // editable: true,
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.image, style: 'width: 40px;height: 40px;border-radius: 2px;'
              }
            })
          }
        }, {
          title: '要求说明',
          align: 'center',
          width: 166,
          key: 'description',
          editable: true,
          cellType: 'input'
        }
      ],
      text: '正在匹配数据'
    }
  },
  created() {
    let mate = JSON.parse(sessionStorage.matchData)
    if(mate) {
      this.matchData(mate);
    }
  },
  methods: {
    matchData(val) {
      // console.log(val)
      this.loadingStatus = true;
      this.$axios.post(this.GLOBAL.baseRouter+'task/task/mate-excel', qs.stringify(val))
      .then(res => res.data)
      .then(res => {
        if(res.err_code == 0) {
          this.loadingStatus = false;
          this.editIncellData = res.data;
          // console.log(this.editIncellData)
        } else {
          this.loadingStatus = false;
          this.$Modal.error({
            title: '遇到错误',
            content: `<p>${res.err_message}</p><p>请返回上一步重新解析</p>`
          });
        }
      })
    },
    uploadExcel() {
      this.text = '正在批量上传'
      this.loadingStatus = true;
      let param = {
        data: sessionStorage.excelJson,
        project_id: sessionStorage.projectID
      }
      this.$axios.post(this.GLOBAL.baseRouter+'task/task/batch-add', qs.stringify(param))
      .then(res => res.data)
      .then(res => {
        // console.log(res.err_code)
        if(res.err_code == 0) {
          this.loadingStatus = false
          this.$emit('upload')
        }
      })
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
  /* background: red; */
}
</style>
