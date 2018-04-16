'use strict'

import Vue from 'vue'
import Axios from '../request'

const state = {
  ndsSortList: [
    {
      label: '上传时间',
      icon: 'ios-arrow-thin-down',
      value: 0
    }, {
      label: '待审天数',
      icon: 'ios-arrow-thin-down',
      value: 1
    }, {
      label: '剩余时间',
      icon: 'ios-arrow-thin-up',
      value: 2
    }
  ],
  nsfkSortList: [
    {
      label: '等待修改',
      icon: 'ios-arrow-thin-down'
    }, {
      label: '反馈时间',
      icon: 'ios-arrow-thin-down'
    }, {
      label: '剩余时间',
      icon: 'ios-arrow-thin-up'
    }
  ],
  khdsSortList: [
    {
      label: '送审时间',
      icon: 'ios-arrow-thin-down'
    }, {
      label: '待审天数',
      icon: 'ios-arrow-thin-down'
    }, {
      label: '剩余时间',
      icon: 'ios-arrow-thin-up'
    }
  ],
  khfkSortList: [
    {
      label: '反馈时间',
      icon: 'ios-arrow-thin-down'
    }, {
      label: '等待修改',
      icon: 'ios-arrow-thin-down'
    }, {
      label: '剩余时间',
      icon: 'ios-arrow-thin-up'
    }
  ],
  statusList: [
    {
      label: '待开始',
      value: 1
    }, {
      label: '执行中',
      value: 2
    }, {
      label: '暂停',
      value: 3
    }, {
      label: '完成',
      value: 4
    }
  ],
  taskType: []
}

const getters = {
  getNdsSortList: state => state.ndsSortList,
  getNsfkSortList: state => state.nsfkSortList,
  getKhdsSortList: state => state.khdsSortList,
  getKhfkSortList: state => state.khfkSortList,
  getStatusList: state => state.statusList,
  getTaskType: state => state.taskType
}

const actions = {
  fetchTaskList({commit, state}, data) {
    Axios.post('/task-type/cate-list', data)
      .then(response => response.data)
      .then(response => response.data)
      .then(response => {
        // response.forEach((item) => {
        //   console.log("item",item.tasktype)
        //   let tasktype = [];
        //   tasktype.push(item.tasktype)
        //   console.log("tasktype",tasktype)
        // })
        commit('updateTaskList', response)
      })
  }
}

const mutations = {
  updateTaskList(state, data){
    state.taskType = data;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}