<template>
  <div>
    <Table :ref="refs" :columns="columnsList" :data="thisTableData" border disabled-hover></Table>
  </div>
</template>

<script>
var qs = require('querystring');
import { mapGetters } from 'vuex'
const editButton = (vm, h, currentRow, index) => {
  return h('Button', {
    props: {
      type: currentRow.editting ? 'success' : 'primary',
      loading: currentRow.saving
    },
    style: {
      margin: '0 5px'
    },
    on: {
      'click': () => {
        if (!currentRow.editting) {
          if (currentRow.edittingCell) {
            for (let name in currentRow.edittingCell) {
              currentRow.edittingCell[name] = false;
              vm.edittingStore[index].edittingCell[name] = false;
            }
          }
          vm.edittingStore[index].editting = true;
          vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
        } else {
          vm.edittingStore[index].saving = true;
          vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
          let edittingRow = vm.edittingStore[index];
          edittingRow.editting = false;
          edittingRow.saving = false;
          vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
          vm.$emit('input', vm.handleBackdata(vm.thisTableData));
          vm.$emit('on-change', vm.handleBackdata(vm.thisTableData), index);
        }
      }
    }
  }, currentRow.editting ? '保存' : '编辑');
};
const deleteButton = (vm, h, currentRow, index) => {
  return h('Poptip', {
    props: {
      confirm: true,
      title: '您确定要删除这条数据吗?',
      transfer: true
    },
    on: {
      'on-ok': () => {
        vm.thisTableData.splice(index, 1);
        vm.$emit('input', vm.handleBackdata(vm.thisTableData));
        vm.$emit('on-delete', vm.handleBackdata(vm.thisTableData), index);
      }
    }
  }, [
      h('Button', {
        style: {
          margin: '0 5px'
        },
        props: {
          type: 'error',
          placement: 'top'
        }
      }, '删除')
    ]);
};
const incellEditBtn = (vm, h, param) => {
  if (vm.hoverShow) {
    return h('div', {
      'class': {
        'show-edit-btn': vm.hoverShow
      }
    }, [
        h('Button', {
          props: {
            type: 'text',
            icon: 'edit'
          },
          on: {
            click: (event) => {
              vm.edittingStore[param.index].edittingCell[param.column.key] = true;
              vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
            }
          }
        })
      ]);
  } else {
    return h('Button', {
      props: {
        type: 'text',
        icon: 'edit'
      },
      on: {
        click: (event) => {
          vm.edittingStore[param.index].edittingCell[param.column.key] = true;
          vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
        }
      }
    });
  }
};
const saveIncellEditBtn = (vm, h, param) => {
  return h('Button', {
    props: {
      type: 'text',
      icon: 'checkmark'
    },
    on: {
      click: (event) => {
        vm.edittingStore[param.index].edittingCell[param.column.key] = false;
        vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
        vm.$emit('input', vm.handleBackdata(vm.thisTableData));
        vm.$emit('on-cell-change', vm.handleBackdata(vm.thisTableData), param.index, param.column.key);
      }
    }
  });
};
const cellInput = (vm, h, param, item) => {
  return h('Input', {
    props: {
      type: 'text',
      value: vm.edittingStore[param.index][item.key]
    },
    on: {
      'on-change'(event) {
        let key = item.key;
        vm.edittingStore[param.index][key] = event.target.value;
      }
    }
  });
};
const cellSelect = (vm, h, param, item) => {
  let cellKey = item.key;
  switch (cellKey) {
    case 'tasktype_id':
      return h('Select', {
        props: {
          filterable: true,
          value: vm.edittingStore[param.index][item.key]
        },
        on: {
          'on-change'(event) {
            // console.log(event)
            let key = item.key;
            vm.edittingStore[param.index][key] = event;
          }
        }
      },
        vm.taskType.map((item) => {
          return h('OptionGroup', {
            props: {
              label: item.name
            }
          },
          !item.tasktype? '' : item.tasktype.map((label) => {
            return h('Option', {
              props: {
                value: label.tasktype_name,
                label: label.tasktype_name
              }
            })
          }))
        })
      );
      break;
    case 'project_child': 
      return h('Select', {
        props: {
          filterable: true,
          value: vm.edittingStore[param.index][item.key].project_child_name
        },
        on: {
          'on-change'(event) {
            console.log(event)
            let key = item.key;
            vm.edittingStore[param.index][key].project_child_name = event;
          }
        }
      },
        vm.subProjectList.map((item) => {
          return h('Option', {
            props: {
              value: item.name,
              label: item.name
            }
          })
        })
      );
      break;
    case 'remark_name': 
      return h('Select', {
        props: {
          filterable: true,
          value: vm.edittingStore[param.index][item.key]
        },
        on: {
          'on-change'(event) {
            // console.log(event)
            let key = item.key;
            vm.edittingStore[param.index][key] = event;
          }
        }
      },
        vm.memberdata.map((item) => {
          return h('Option', {
            props: {
              value: item.remark_name,
              label: item.remark_name
            }
          })
        })
      );
      break;
  }
};
const cellDatePicker = (vm, h, param, item) => {
  　return h('div', [
    　　h('DatePicker', {
      　　　props: {
        　　　　type: 'daterange',
        　　　　format: 'yyyy-MM-dd',
        　　　　placeholder: '选择日期范围',
        　　　　value: param.row.pubdate
      　　　},
      　　　style: {
        　　　　marginRight: '5px'
      　　　},
      　　　on: {
        　　　　'on-change': (val) => {
                  // console.log('发布时间1')
                  vm.edittingStore[param.index].expect_start_time = val[0]
                  vm.edittingStore[param.index].expect_end_time = val[1]
        　　　　}
      　　　}
    　　})
  　])
};
export default {
  name: 'canEditTable',
  props: {
    refs: String,
    columnsList: Array,
    value: Array,
    url: String,
    editIncell: {
      type: Boolean,
      default: false
    },
    hoverShow: {
      type: Boolean,
      default: false
    },
    cellType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      columns: [],
      thisTableData: [],
      edittingStore: [],
      options: [
        {
          value: 0,
          label: 'option1'
        }, {
          value: 1,
          label: 'option2'
        }, {
          value: 2,
          label: 'option3'
        }
      ],
      memberdata: []
    };
  },
  created() {
    this.getTaskList();
    if(sessionStorage.projectID) {
      this.getSubProject(sessionStorage.projectID)
    }
    this.deptFData();
    this.init();
  },
  computed: {
    ...mapGetters({
      taskType: 'getTaskType',
      subProjectList: 'getSubProjectList',
      deptLComId: 'getDeptLFComId',
      deptLdeptId: 'getDeptLFdeptId',
    })
  },
  methods: {
    /**
     * 从store中把任务类型获取出来
     */
    getTaskList() {
      let data = {
        company_id: 1
      }
      this.$store.dispatch('fetchTaskList', qs.stringify(data));
    },
    getSubProject(pId) {
      let data = {
        id: pId
      }
      this.$store.dispatch('fetchSubProject', qs.stringify(data));
    },
    deptFData() {
      let data = {
        company_id: this.deptLComId
      }
      this.$axios.post(this.GLOBAL.baseRouter+'task/company/member-page', qs.stringify(data))
      .then(res => res.data)
      .then(res => {
          // console.log(res)
        if(res.err_code == 0) {
          this.pageSize = res.page.page_size;
          this.allData = res.data
          if(this.allData <= this.pageSize) {
            this.memberdata = this.allData;
          } else {
            this.memberdata = this.allData.slice(0,this.pageSize);
          }
          this.count = parseInt(res.page.count);
        } else {
          this.$Message.error('数据请求发生错误！');
        }
      })
    },
    init() {
      let vm = this;
      let editableCell = this.columnsList.filter(item => {
        if (item.editable) {
          if (item.editable === true) {
            return item;
          }
        }
      });
      let cloneData = JSON.parse(JSON.stringify(this.value));
      sessionStorage.excelJson = JSON.stringify(this.value);   // 批量上传所需要的表格中的JSON格式的数据
      let res = [];
      res = cloneData.map((item, index) => {
        let isEditting = false;
        if (this.thisTableData[index]) {
          if (this.thisTableData[index].editting) {
            isEditting = true;
          } else {
            for (const cell in this.thisTableData[index].edittingCell) {
              if (this.thisTableData[index].edittingCell[cell] === true) {
                isEditting = true;
              }
            }
          }
        }
        if (isEditting) {
          return this.thisTableData[index];
        } else {
          this.$set(item, 'editting', false);
          let edittingCell = {};
          editableCell.forEach(item => {
            edittingCell[item.key] = false;
          });
          this.$set(item, 'edittingCell', edittingCell);
          return item;
        }
      });
      this.thisTableData = res;
      this.edittingStore = JSON.parse(JSON.stringify(this.thisTableData));
      this.columnsList.forEach(item => {
        if (item.editable) {
          let cellType = item.cellType;
          switch (cellType) {
            case "input":
              item.render = (h, param) => {
                let currentRow = this.thisTableData[param.index];
                if (!currentRow.editting) {
                  let cellValue = currentRow[item.key]
                  if (cellValue == "") {
                    cellValue = "暂无数据"
                  }
                  if (this.editIncell) {
                    return h('Row', {
                      props: {
                        type: 'flex',
                        align: 'middle',
                        justify: 'center'
                      }
                    }, [
                        h('Col', {
                          props: {
                            span: '22'
                          }
                        }, [
                            !currentRow.edittingCell[param.column.key] ? h('span', cellValue) : cellInput(this, h, param, item)
                          ]),
                        h('Col', {
                          props: {
                            span: '2'
                          }
                        }, [
                            currentRow.edittingCell[param.column.key] ? saveIncellEditBtn(this, h, param) : incellEditBtn(this, h, param)
                          ])
                      ]);
                  } else {
                    return h('span', currentRow[item.key]);
                  }
                } else {
                  return h('Input', {
                    props: {
                      type: 'text',
                      value: currentRow[item.key]
                    },
                    on: {
                      'on-change'(event) {
                        let key = param.column.key;
                        vm.edittingStore[param.index][key] = event.target.value;
                      }
                    }
                  });
                }
              };
              break;
            case "select":
              item.render = (h, param) => {
                let currentRow = this.thisTableData[param.index];
                if (!currentRow.editting) {
                  let cellValue = currentRow[item.key]
                  let cellKey = item.key;
                  switch (cellKey) {
                    case 'project_child':
                      cellValue = currentRow.project_child.project_child_name;
                      break;
                    case 'tasktype_id': 
                      cellValue = currentRow.tasktype_id.tasktype_name;
                      break;
                    case 'run_member_id':
                      cellValue = currentRow.run_member_id.remark_name;
                      break;
                    default:
                      cellValue = "暂无数据";
                      break;
                  }
                  // if (cellValue == "" || cellValue == null) {
                  //   cellValue = "暂无数据"
                  // }
                  if (this.editIncell) {
                    return h('Row', {
                      props: {
                        type: 'flex',
                        align: 'middle',
                        justify: 'center'
                      }
                    }, [
                        h('Col', {
                          props: {
                            span: '22'
                          }
                        }, [
                            !currentRow.edittingCell[param.column.key] ? h('span', cellValue) : cellSelect(this, h, param, item)
                          ]),
                        h('Col', {
                          props: {
                            span: '2'
                          }
                        }, [
                            currentRow.edittingCell[param.column.key] ? saveIncellEditBtn(this, h, param) : incellEditBtn(this, h, param)
                          ])
                      ]);
                  } else {
                    return h('span', currentRow[item.key]);
                  }
                } else {
                  return h('Input', {
                    props: {
                      type: 'text',
                      value: currentRow[item.key]
                    },
                    on: {
                      'on-change'(event) {
                        let key = param.column.key;
                        vm.edittingStore[param.index][key] = event.target.value;
                      }
                    }
                  });
                }
              };
              break;
            case 'datePicker':
              item.render = (h, param) => {
                let currentRow = this.thisTableData[param.index];
                if (!currentRow.editting) {
                  let cellValue = currentRow[item.key]
                  if (cellValue == "" || cellValue == null) {
                    cellValue = "暂无数据"
                  }
                  if (this.editIncell) {
                    return h('Row', {
                      props: {
                        type: 'flex',
                        align: 'middle',
                        justify: 'center'
                      }
                    }, [
                        h('Col', {
                          props: {
                            span: '22'
                          }
                        }, [
                            !currentRow.edittingCell[param.column.key] ? h('span', cellValue) : cellDatePicker(this, h, param, item)
                          ]),
                        h('Col', {
                          props: {
                            span: '2'
                          }
                        }, [
                            currentRow.edittingCell[param.column.key] ? saveIncellEditBtn(this, h, param) : incellEditBtn(this, h, param)
                          ])
                      ]);
                  } else {
                    return h('span', currentRow[item.key]);
                  }
                } else {
                  return h('Input', {
                    props: {
                      type: 'text',
                      value: currentRow[item.key]
                    },
                    on: {
                      'on-change'(event) {
                        let key = param.column.key;
                        vm.edittingStore[param.index][key] = event.target.value;
                      }
                    }
                  });
                }
              };
              break;
          };
        }
        if (item.handle) {
          item.render = (h, param) => {
            let currentRowData = this.thisTableData[param.index];
            let children = [];
            item.handle.forEach(item => {
              if (item === 'edit') {
                children.push(editButton(this, h, currentRowData, param.index));
              }
              //  else if (item === 'delete') {
              //     children.push(deleteButton(this, h, currentRowData, param.index));
              // }
            });
            return h('div', children);
          };
        }
      });
    },
    handleBackdata(data) {
      let clonedData = JSON.parse(JSON.stringify(data));
      clonedData.forEach(item => {
        delete item.editting;
        delete item.edittingCell;
        delete item.saving;
      });
      return clonedData;
    }
  },
  watch: {
    value(data) {
      this.init();
    }
  }
};
</script>
<style lang="less">
@import 'style/editable-table.less';
// .edittable-table-height-con {
//   height: 320px !important;
// }
.ivu-table-cell {
  overflow: inherit !important;
}
.ivu-select-dropdown{
  text-align: left !important;
}
</style>