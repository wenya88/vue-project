<template>
  <div>
      <div class="taskMenu">
            <span  v-for="(item,index) in sortList" :key="index">
                <a @click="sortAction(index,item.action)" :class="{show:index==SLindex}">
                  <i :class="[
                      item.Cindex==0?'remIcon':'',
                      item.Cindex==1?'remIconDown':'',
                      item.Cindex==2?'remIconUp':'',
                      ]"></i>
                      {{item.label}}
                </a>                        
            </span>
            <span class="MLeft10">
                <Input v-model="search" placeholder="项目名称" @on-enter="ProSearch">
                    <Button slot="append" icon="ios-search"  @click.native="ProSearch"></Button>
                </Input>    
            </span>
      </div>
      <task-list :taskData="taskData"></task-list>
  </div>
</template>
<script>
var qs=require('querystring');
import taskList from './component/taskList';
export default {
  data(){
    return{
      sortList:[
            {"label":"交稿剩余","action":"setUp","Cindex":0},
            {"label":"测试金额","action":"remDay","Cindex":0},
            {"label":"项目预计","action":"proSch","Cindex":0}
      ],
      SLindex:null,
      orderby:null,
      search:null,
      setUp:0,
      remDay:0,
      proSch:0,
      taskData:[],
      order:null
    }
  },
  components:{
    taskList:taskList
  },
  mounted(){
    this.taskListData();
    this.$bus.on('joinSuccess',()=>{
       this.taskListData();
    })
  },
  methods:{
    // 筛选选择
    sortAction(index,action){
        this.SLindex=index;
        if(action=="setUp"){
            this.sortList[1].Cindex=0;
            this.sortList[2].Cindex=0;
            this.orderby='asc'
            this.order='end_time'
            if(this.setUp==0){
              this.sortList[0].Cindex=1;
              this.setUp=1;
              this.orderby='desc'
            }else{
              this.sortList[0].Cindex=2;
              this.setUp=0;
              this.orderby='asc'
            }
        }else if(action=="proSch"){
                this.sortList[0].Cindex=0;
                this.sortList[1].Cindex=0;
                this.remDay=0;
                this.orderby='asc'
                this.order='project_price'
            if(this.proSch==0){
                this.sortList[2].Cindex=1;
                this.proSch=1;
                this.orderby='desc'
            }else{
                this.sortList[2].Cindex=2;
                this.proSch=0;
                this.orderby='asc'
            }
        }else if(action=="remDay"){
                this.proSch=0;
                this.sortList[0].Cindex=0
                this.sortList[2].Cindex=0;
                this.orderby='asc'
                this.order='test_price'
            if(this.remDay==0){
                this.sortList[1].Cindex=1;
                this.remDay=1;
                this.orderby='desc'
            }else{
                this.sortList[1].Cindex=2;
                this.remDay=0;
                this.orderby='asc'
            }
        }
       this.taskListData(this.search,this.orderby,this.order);
    },
    // 搜索
    ProSearch(){
      this.taskListData(this.search)
    },
    //列表数据
    taskListData(search=this.search,orderby=this.orderby,order=this.order){
       let _this=this;
       let url=this.GLOBAL.baseRouter+'task/company/test-list';
       let params={
         search:search,
         orderby:orderby,
         order:order
       }
       _this.$Loading.start();
       _this.$axios.post(url,qs.stringify(params)).then(msg=>{
         if(msg.data.err_code==0){
            _this.$Loading.finish();
            _this.taskData=msg.data.data;
         }
       },()=>{
         _this.$Loading.error();
         _this.$Message.error('请求失败!')
       })
    }
  }
}
</script>
<style lang="less">
@import './style/taskHome.less';
</style>
