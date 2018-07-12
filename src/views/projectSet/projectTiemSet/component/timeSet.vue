<template>
    <div class="projectTimeSet">
        <dl>
            <dt><Icon type="android-menu"></Icon> 项目工作时间</dt>
            <dd>
                <div class="setTime">
                    <dl>
                        <dd class="title">
                            <span>周天数</span>
                            <span>上班时间</span>
                            <span>午休时间</span>
                        </dd>
                        <dd v-for="(item,index) in workTimeData" :key="index">
                            <span>
                                {{item.week}}
                                <em class="restIcon" v-show="item.status==0">休</em>
                            </span>
                            <span>
                                <em v-if="item.status==1" class="timeRow">
                                    <TimePicker type="time" :value="item.start_time" style="width:70px" placeholder="上班时间" 
                                    @on-change="startTime" 
                                    @click.native="timeIndex(index,'start_time')"
                                    ></TimePicker>
                                    ~
                                    <TimePicker type="time" :value="item.end_time" style="width:70px" placeholder="下班时间"
                                    @on-change="startTime" 
                                    @click.native="timeIndex(index,'end_time')"
                                    ></TimePicker> 
                                </em>
                                <em v-else class="timeRow">/</em>
                                <em :class="[item.status==1?'work':'rest']" @click="setStatus(item.status,index)">
                                    {{item.status==1?'设为放假':'设为上班'}}
                                </em>
                             </span>
                            <span>
                                <em v-if="item.status==1" class="timeRow">
                                    <TimePicker type="time" :value="item.rest_start_time" style="width:70px" placeholder="午休时间"
                                    @on-change="startTime" 
                                    @click.native="timeIndex(index,'rest_start_time')"
                                    ></TimePicker>
                                    ~ 
                                    <TimePicker type="time" :value="item.rest_end_time" style="width:70px" placeholder="结束时间"
                                    @on-change="startTime" 
                                    @click.native="timeIndex(index,'rest_end_time')"
                                    ></TimePicker>
                                </em>
                                <em v-else class="timeRow">/</em>
                            </span>
                        </dd>
                    </dl>
                </div>
            </dd>
        </dl>
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
            sTimekey:null
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
