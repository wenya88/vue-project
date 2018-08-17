import Vue from 'vue'
import qs from 'querystring'

const url = 'index.php?r=';

export default {

    /*公司类型库*/

    taskCateList: (data) => {
        return Vue.$axios.post(url + 'task/task-type/cate-list', qs.stringify(data))           // 树状图list
    },
    taskCateAdd: (data) => {
        return Vue.$axios.post(url + 'task/task-type/cate-add', qs.stringify(data))            // 分类增加
    },
    taskCateinfo: (data) => {
        return Vue.$axios.post(url + 'task/task-type/info', qs.stringify(data))                // 类型详情
    },
    taskprojectCateUpdate: (data) => {
        return Vue.$axios.post(url + 'task/project-tasktype/update', qs.stringify(data))       // 项目更新
    },
    taskCateUpdate: (data) => {
        return Vue.$axios.post(url + 'task/task-type/cate-update', qs.stringify(data))         // 分类更新
    },
    getNorms: (data) => {
        return Vue.$axios.post(url + 'task/task-type/norms', qs.stringify(data))               // 获取规范
    },
    addNorm: (data) => {
        return Vue.$axios.post(url + 'task/task-type/add-norm', qs.stringify(data))            // 添加规范
    },
    deleteNorm: (data) => {
        return Vue.$axios.post(url + 'task/task-type/delete-norm', qs.stringify(data))         // 删除规范
    },
    getIconList: (data) => {
        return Vue.$axios.post(url + 'task/task-type/icon-list', qs.stringify(data))           // 获取图标库
    },
    taskTypeAdd: (data, changeUrl) => {
        return Vue.$axios.post(url + changeUrl, qs.stringify(data))                            // 新增类型
    },
    insideAudit: (data) => {
        return Vue.$axios.post(url + 'task/task/inside-audit', qs.stringify(data))   // 内部审核                          // 任务详情里面的阶段详情
    },

    /*项目级类型库*/
    projectTaskList: (data) => {
        return Vue.$axios.post(url + 'task/project-tasktype/list', qs.stringify(data))                            // 新增类型
    },
    projectTaskInfo: (data) => {
        return Vue.$axios.post(url + 'task/project-tasktype/info', qs.stringify(data))                            // 新增类型
    },
    taskStageInfo: (data) => {
        return Vue.$axios.post(url + 'task/task/stage-info', qs.stringify(data))                            // 任务详情里面的阶段详情
    },


    // 之前的上传
    imageUpload: (data) => {
        return Vue.$axios.post(url + 'file/file/file-upload', qs.stringify(data))                             // 任务详情里面的阶段详情
    },


    // 权限
    getInfoRole: (data) => {
        return Vue.$axios.post(url + 'system/login/info', qs.stringify(data))                             // 权限
    },
    // 项目列表
    taskProjectPage: (data) => {
        return Vue.$axios.post(url + 'task/project/page', qs.stringify(data))                             // 权限
    },


}