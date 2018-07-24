import Vue from 'vue'
import qs from 'querystring'

const url = 'index.php?r=';

export default {
    /*公司类型库*/
    taskCateList:(data)=>{
       return Vue.$axios.post(url+'task/task-type/cate-list', qs.stringify(data)) // 树状图list
    },
    taskCateAdd:(data)=>{
       return Vue.$axios.post(url+'task/task-type/cate-add', qs.stringify(data)) // 分类增加
    }
}