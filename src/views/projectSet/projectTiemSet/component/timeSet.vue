<template>
    <div class="projectTimeSet">
        <dl>
            
            <dd>
                <div class="setTime">
                    <dl>
                        <dd class="title">
                            <span>周天数</span>
                            <span>上班时间</span>
                            <span>午休时间</span>
                            <span>操作</span>
                        </dd>
                        <dd v-for="(item,index) in workTimeData" :key="index">
                            <span>
                                {{item.week}}
                                <!-- <em class="restIcon" v-show="item.status==0">休</em> -->
                            </span>
                            <span>
                                <em v-if="item.status==1" class="timeRow">
                                    <TimePicker type="time" format="HH:mm" :value="item.start_time" style="width:45px" placeholder="请选择"
                                    @on-change="startTime" 
                                    @click.native="timeIndex(index,'start_time')"
                                    ></TimePicker>
                                    至
                                    <TimePicker type="time" format="HH:mm" :value="item.end_time" style="width:45px;" placeholder="请选择"
                                    @on-change="startTime" 
                                    @click.native="timeIndex(index,'end_time')"
                                    ></TimePicker><i class="icon iconfont icon-icon2"></i> 
                                </em>
                                <em v-else class="timeRow">——</em>
                                <!-- <em :class="[item.status==1?'work':'rest']" @click="setStatus(item.status,index)">
                                     {{item.status==1?'设为放假':'设为上班'}} -->
                                <!-- </em> --> 
                             </span>
                            <span>
                                <em v-if="item.status==1" class="timeRow">
                                    <TimePicker type="time" format="HH:mm" :value="item.rest_start_time" style="width:45px" placeholder="请选择"
                                    @on-change="startTime" 
                                    @click.native="timeIndex(index,'rest_start_time')"
                                    ></TimePicker>
                                    ~
                                    <TimePicker type="time" format="HH:mm" :value="item.rest_end_time" style="width:45px" placeholder="请选择"
                                    @on-change="startTime" 
                                    @click.native="timeIndex(index,'rest_end_time')"
                                    ></TimePicker>
                                </em>
                                <em v-else class="timeRow">——</em>
                            </span>
                            <span><em :class="[item.status==1?'work':'rest']" @click="setStatus(item.status,index)">
                                    {{item.status==1?'设为放假':'设为上班'}}
                                </em></span>
                        </dd>
                    </dl>
                </div>
            </dd>
        </dl>
        <div class="overtime">
            <h3>加班记录<Button class="overtimeAdd" @click="addTime" type="ghost"><Icon type="ios-plus-outline"></Icon>新增加班</Button></h3>
            <ul class="overtimeList">
                <li>
                    <div class="overtimeList-left">
                        <p>加班时长</p>
                        <p class="duration">2</p>
                        <p>小时</p>
                    </div>
                    <div class="overtimeList-right">
                        <p>加班日期：</p>
                        <p>加班时段：</p>
                        <p>加班人数：</p>
                    </div>
                    <Icon class="overtimeDel" type="ios-trash-outline"></Icon>
                </li>
                <li>
                    <div class="overtimeList-left">
                        <p>加班时长</p>
                        <p class="duration">2</p>
                        <p>小时</p>
                    </div>
                    <div class="overtimeList-right">
                        <p>加班日期：</p>
                        <p>加班时段：</p>
                        <p>加班人数：</p>
                    </div>
                    <Icon class="overtimeDel" type="ios-trash-outline"></Icon>
                </li>
                <li>
                    <div class="overtimeList-left">
                        <p>加班时长</p>
                        <p class="duration">2</p>
                        <p>小时</p>
                    </div>
                    <div class="overtimeList-right">
                        <p>加班日期：</p>
                        <p>加班时段：</p>
                        <p>加班人数：</p>
                    </div>
                    <Icon class="overtimeDel" type="ios-trash-outline"></Icon>
                </li>
                <li>
                    <div class="overtimeList-left">
                        <p>加班时长</p>
                        <p class="duration">2</p>
                        <p>小时</p>
                    </div>
                    <div class="overtimeList-right">
                        <p>加班日期：</p>
                        <p>加班时段：</p>
                        <p>加班人数：</p>
                    </div>
                    <Icon class="overtimeDel" @click="overtimeDel" type="ios-trash-outline"></Icon>
                </li>
            </ul>
            <!-- <overtime-add ref="overtimeAdd"></overtime-add>    -->
        </div>
        <Button type="success" class="save" @click="setTimeSuccess">保存</Button>
        
            <overtime-add ref="overtiemAdd"></overtime-add>
        
    </div>
</template>
<script>
var qs=require('querystring')
import '../style/font/iconfont.css'
import overtimeAdd from './overtimeAdd.vue'
export default {
    data(){
        return{
            workTimeData:[],
            tIndex:null,
            sTimekey:null,
            showTimeAdd:false
        }
    },
    mounted(){
        this.getWorkTime();
    },
    components:{
        overtimeAdd
    },
    methods:{
        // 设置时间
        timeIndex(index,tKey){
           this.sTimekey=tKey
           this.tIndex=index;
        },
        //新增加班时间
        addTime(){
            this.$refs.overtiemAdd.showTimeAdd=true
        },
        //删除加班记录
        overtimeDel(){
            alert(111)
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

<style lang="less">
    

</style>
