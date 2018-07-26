<template>
    <div>
        <!-- @on-current-change="changeRow" -->
        <Table 
        highlight-row 
        :columns="membercolumns" 
        :data="memberdata" 
        @on-row-click="clickRow"
        :loading="loadingStatus">
        </Table>
        <Page 
        :total="count"
        :page-size="pageSize"
        show-total
        class="paging"
        @on-change="changepage"></Page> 
    </div>
</template>
<script>
var qs = require('querystring');
import { mapGetters } from 'vuex'
    export default {
    name:'memberlist',
    data(){
        return {
            membercolumns:[
                {
                    title:'备注名/用户名',
                    key:'remark_name'
                }, {
                    title:'昵称',
                    key:'nickname'
                }, {
                    title:'手机',
                    key:'phone'
                }, {
                    title:'邮箱',
                    key:'email'
                }, {
                    title:'部门',
                    key:'department_name'
                }, {
                    title:'职位',
                    key:'post_name'
                },
            ],
            memberdata:[],
            allData: [],
            count: 0,
            pageSize: 20,
            loadingStatus: false
        }
    },
    mounted() {
        this.deptListData();
        // this.dutyListData();
    },
    computed: {
        ...mapGetters({
            deptList: 'getDeptList',
            deptLComId: 'getDeptLFComId',
            deptLdeptId: 'getDeptLFdeptId',
            dutyList: 'getDutyList',
            dutyLComId: 'getDutyLFComId',
            dutyLpostId: 'getDutyLFpostId'
        })
    },
    methods:{
        deptListData() {
            let data = {
                company_id: 1
            }
            this.$store.dispatch('fetchDeptList', qs.stringify(data));
            this.deptFData();
            // console.log(this.deptLComId,this.deptLdeptId)
        },
        deptFData() {
            let data = {
                company_id: this.deptLComId,
                department_id: this.deptLdeptId
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
        dutyListData() {
            let data = {
                company_id: 1
            }
            this.$store.dispatch('fetchDutyList', qs.stringify(data));
            this.dutyFData();
            // console.log(this.dutyLComId,this.dutyLpostId)
        },
        dutyFData() {
            let data = {
                company_id: this.dutyLComId,
                post_id: this.dutyLpostId
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
        /**
         * 切换数据
         */
        deptData(comId,deptId){
            // this.$Loading.start();
            this.loadingStatus = true;
            let data = {
                company_id: comId,
                department_id: deptId
            }
            this.$axios.post(this.GLOBAL.baseRouter+'task/company/member-page', qs.stringify(data))
            .then(res => res.data)
            .then(res => {
                if(res.err_code == 0) {
                    this.pageSize = res.page.page_size;
                    this.allData = res.data
                    if(this.allData <= this.pageSize) {
                        this.memberdata = this.allData;
                    } else {
                        this.memberdata = this.allData.slice(0,this.pageSize);
                    }
                    this.count = parseInt(res.page.count);
                    // this.$Loading.finish();
                    this.loadingStatus = false;
                } else {
                    this.$Message.error('数据请求发生错误！');
                }
                // console.log(res)
            })
            // this.memberdata = [this.initAMemberData(comId,deptId)];
        },
        dutyData(comId,dutyId){
            this.loadingStatus = true;
            let data = {
                company_id: comId,
                post_id: dutyId
            }
            this.$axios.post(this.GLOBAL.baseRouter+'task/company/member-page', qs.stringify(data))
            .then(res => res.data)
            .then(res => {
                if(res.err_code == 0) {
                    this.pageSize = res.page.page_size;
                    this.allData = res.data
                    if(this.allData <= this.pageSize) {
                        this.memberdata = this.allData;
                    } else {
                        this.memberdata = this.allData.slice(0,this.pageSize);
                    }
                    this.count = parseInt(res.page.count);
                    this.loadingStatus = false;
                } else {
                    this.$Message.error('数据请求发生错误！');
                }
                // console.log(res)
            })
        },
        changepage(index) {
            var _start = ( index - 1 ) * this.pageSize;
            var _end = index * this.pageSize;
            this.memberdata = this.allData.slice(_start,_end);
        },
        changeRow(currentRow) {
            this.$emit('choiseRow', currentRow)
            // console.log(currentRow)
        },
        clickRow(index) {
            this.$emit('choiseRow', index)
            // console.log(index)
        }
    }
}
</script>
<style scoped>
  .paging{
      float:right;
      margin-top:10px;
  }
</style>