<template>
    <div>
        <!-- @on-current-change="changeRow" -->
        <Table 
        highlight-row 
        :columns="membercolumns" 
        :data="memberdata" 
        @on-row-click="clickRow"
        :loading="loadingStatus"
        size="large"
        
        >
        </Table>
        <Page 
        ref="pages"
        :total="count"
        :page-size="pageSize"
        show-total
        class="paging"
        :current.sync="currentPage"
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
                    title:'备注名',
                    key:'remark_name',
                    align:'center',
                     className: 'demo-table-info-column'
                }, {
                    title:'昵称',
                    key:'nickname',
                    align:'center',
                    className: 'demo-table-info-column'

                }, {
                    title:'手机',
                    key:'phone',
                    align:'center',
                    className: 'demo-table-info-column'

                }, {
                    title:'邮箱',
                    key:'email',
                    align:'center',
                    className: 'demo-table-info-column'

                }, {
                    title:'部门',
                    key:'department_name',
                    align:'center',
                    className: 'demo-table-info-column'

                }, {
                    title:'职位',
                    key:'post_name',
                    align:'center',
                    className: 'demo-table-info-column'
                   
                },
            ],
            memberdata:[

            ],
            allData: [],
            count: 0,
            pageSize: 20,
            loadingStatus: false,
            // yema:department_id
            dept:'',
            currentPage:1
           
        }
    },
    mounted() {
        this.deptListData();
        // this.init()
        
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
                    // console.log(111,res)
                    this.pageSize = res.page.page_size;
                    this.allData = res.data
                    //  console.log( 2222,this.memberdata)

                    if(this.allData <= this.pageSize) {
                        this.memberdata = this.allData;
                        // console.log( 333,this.memberdata)

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
            this.currentPage = 1;
            this.$axios.post(this.GLOBAL.baseRouter+'task/company/member-page', qs.stringify(data))
            // this.$axios.get(this.GLOBAL.baseRouter+'task/company/member-page', qs.stringify(data))
            .then(res => res.data)
            .then(res => {
                if(res.err_code == 0) {
                    this.pageSize = res.page.page_size;
                    this.allData = res.data
                        // console.log(1,this.allData)
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
            // console.log(data)
            this.currentPage = 1;            
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
            let data = {
                company_id: this.deptLComId,
                department_id: this.deptLdeptId,
                page:index
            }
            this.$axios.post(this.GLOBAL.baseRouter+'task/company/member-page', qs.stringify(data))            
            .then(res => res.data).then(res=>{
                this.pageSize = res.page.page_size;
                this.allData = res.data
                var _start = ( index - 1 ) * this.pageSize;
                var _end = index * this.pageSize;
                // console.log(123,this.allData)
                this.memberdata = this.allData
            })
        },
            // this.dutyFData() 
        changeRow(currentRow) {
            this.$emit('choiseRow', currentRow)
            // console.log(currentRow)
        },
        clickRow(index) {
            this.$emit('choiseRow', index)
            // console.log(121, index)
        }
    }
}
</script>
<style scoped >
  .paging{
      float:right;
      margin-top:10px;
  }
  
</style>
<style>
    .ivu-table th.demo-table-info-column {
        color:#9D9E9E;
    }
    .ivu-table td.demo-table-info-column {
        color:#9F9F9F;
    }
</style>
