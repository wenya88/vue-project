<template>
    <div class="projectTimeSet">
        <Table :columns="columns1" :data="workTimeData"></Table>
        <Button type="success" @click="setTimeSuccess">保存</Button>
    </div>
</template>
<script>
var qs=require('querystring')
export default {
    data(){
        return{
            workTimeData:[],
            tIndex:null,
            sTimekey:null,
            columns1:[
                {
                    title:'周天数',
                    key:'week'
                },
                {
                    title:'上班时间',
                    key:'start_time~end_time'
                },
                {
                    title:'午休时间',
                    key:''
                },
                {
                    title:'操作',
                    key:'status'
                }
            ]
        }
    },
    mounted(){
        this.getWorkTime();
    },
    methods:{
        // 设置时间
        timeIndex(index,tKey){
           this.sTimekey=tKey
           this.tIndex=index;
        },
        startTime(time){
            if(this.sTimekey=='start_time'){
                this.workTimeData[this.tIndex].start_time=time
            }else if(this.sTimekey=='end_time'){
                this.workTimeData[this.tIndex].end_time=time
            }else if(this.sTimekey=='rest_start_time'){
                this.workTimeData[this.tIndex].rest_start_time=time
            }else if(this.sTimekey=='rest_end_time'){
                this.workTimeData[this.tIndex].rest_end_time=time
            }
        },
        // 设置状态
        setStatus(status,index){
           if(status==1){
               this.workTimeData[index].status=0;
           }else{
               this.workTimeData[index].status=1;
           }
        },
        setTimeSuccess(){
            let _this=this;
            let url=_this.GLOBAL.baseRouter+'task/project/set-work-time';
            let params={
                project_id:sessionStorage.projectID,
                worktime:JSON.stringify(_this.workTimeData)
            }
            _this.$Loading.start();
            _this.$axios.post(url,qs.stringify(params)).then(msg=>{
                _this.$Loading.finish();
                console.log(msg)
                if(msg.data.err_code==0){
                    _this.$Message.success(msg.data.err_message)
                }else{
                    _this.$Message.error(msg.data.err_message)
                }
            },()=>{
                _this.$Loading.error();
            })
        },
        getWorkTime(){
          let _this=this;
          let url=_this.GLOBAL.baseRouter+'task/project/get-work-time-by-project'; 
          let params={
              project_id:sessionStorage.projectID
          }
          _this.$Loading.start();
          _this.$axios.post(url,qs.stringify(params)).then(msg=>{
                _this.$Loading.finish();
              if(msg.data.err_code==0){
                _this.workTimeData=msg.data.data
              }else{
                _this.$Message.error(msg.data.err_message)  
              }
          },()=>{
                _this.$Loading.error();
          })
       }
    }
}
</script>
