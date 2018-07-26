'use strict'

import Vue from 'vue'
import Axios from '../request'
import global from '../../components/Global'

const state = {
  deptList: [],
  dutyList: [],
  postList: [],
  authList: [],
  deptLFComId: 0,
  deptLFdeptId: 0,
  dutyLFComId: 0,
  dutyLFpostId: 0
}

const getters = {
  getDeptList: state => state.deptList,
  getDutyList: state => state.dutyList,
  getPostList: state => state.postList,
  getAuthList: state => state.authList,
  getDeptLFComId: state => state.deptLFComId,
  getDeptLFdeptId: state => state.deptLFdeptId,
  getDutyLFComId: state => state.dutyLFComId,
  getDutyLFpostId: state => state.dutyLFpostId,
}

const actions = {
  fetchDeptList({commit, state}, data) {
    Axios.post(global.baseRouter+'task/department/list', data)
      .then(res => res.data)
      // .then(res => res.data)
      .then(res => {
        // console.log('进入store',res,res[0].company_id)
        let fetchList = res.data;
        fetchList.push({
          company_id: res.data[0].company_id,
          id: 0,
          member_count: res.free_member,
          name: '未分配部门'
        })
        // console.log('获取部门列表',fetchList,res.free_member)
        commit('updateDeptList', fetchList);
        commit('updateDeptLFComId', res.data[0].company_id);
        commit('updateDeptLFdeptId', res.data[0].id);
      })
  },
  fetchDutyList({commit, state}, data) {
    Axios.post(global.baseRouter+'task/post/list', data)
      .then(res => res.data)
      // .then(res => res.data)
      .then(res => {
        let fetchList = res.data;
        fetchList.push({
          company_id: res.data[0].company_id,
          id: 0,
          member_count: res.free_member,
          name: '未分配角色'
        })
        commit('updateDutyList', fetchList);
        commit('updateDutyLFComId', res.data[0].company_id);
        commit('updateDutyLFpostId', res.data[0].id);
      })
  },
  fetchAuthList({commit, state}, data) {
    Axios.post(global.baseRouter+'system/auth/auth-list', data)
    .then(res => res.data)
    .then(res => {
      // console.log(res)
      let fetchList = res.data
      let postNamaList = [];
      let authList = [];
      fetchList.forEach((item) => {
        postNamaList.push(item)
      });
      postNamaList.forEach((item,index) => {
        authList.push(item.all_auth.auth)
      })
      commit('updatePostList', postNamaList);
      commit('updatAuthList', authList);
    })
  }
}

const mutations = {
  updateDeptList(state, data){
    state.deptList = data;
  },
  updateDeptLFComId(state, data) {
    state.deptLFComId = data;
  },
  updateDeptLFdeptId(state, data) {
    state.deptLFdeptId = data;
  },
  updateDutyList(state, data){
    state.dutyList = data;
  },
  updateDutyLFComId(state, data) {
    state.dutyLComId = data;
  },
  updateDutyLFpostId(state, data) {
    state.dutyLFpostId = data;
  },
  updatePostList(state, data){
    state.postList = data;
  },
  updatAuthList(state, data){
    state.authList = data;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}