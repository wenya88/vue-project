'use strict'

import Vue from 'vue'
import Axios from '../request'
import global from '../../components/Global'

const state = {
  ndsSortList: [
    {
      label: '最新上传',
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
    //   label: '反馈时间',
    //   icon: 'ios-arrow-thin-down'
    // }, {
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
  taskType: [],
  subProjectList: [],
    detail:{},
}

const getters = {
  getNdsSortList: state => state.ndsSortList,
  getNsfkSortList: state => state.nsfkSortList,
  getKhdsSortList: state => state.khdsSortList,
  getKhfkSortList: state => state.khfkSortList,
  getStatusList: state => state.statusList,
  getTaskType: state => state.taskType,
  getSubProjectList:  state => state.subProjectList
}

const actions = {
  fetchTaskList({commit, state}, data) {
    Axios.post(global.baseRouter+'task/task-type/cate-list', data)
      .then(response => response.data)
      .then(response => response.data)
      .then(response => {
        commit('updateTaskList', response)
      })
  },
  fetchSubProject({commit, state}, data) {
    Axios.post(global.baseRouter+'task/project/child-list', data)
    .then(res => res.data)
    .then(res => res.data)
    .then(res => {
      commit('updateSubProjectList', res)
    })
  }
}

const mutations = {
  updateTaskList(state, data){
    state.taskType = data;
  },
  updateSubProjectList(state, data) {
    state.subProjectList = data
  },
    setProjectInfoDetails(state, data) {
        Vue.set(state.detail, 'projectInfo', data)

  },
  setDetailAll(state, data) {
      Vue.set(state.detail, 'setDetailAll', data)
  }

};

export default {
  state,
  getters,
  actions,
  mutations
}