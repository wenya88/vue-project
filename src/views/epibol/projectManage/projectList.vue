<template>
    <!-- 项目管理内容 -->
        <div class="projectManageContent">
            <div class="ContentRow" v-for="(item,index) in MsgData" :key="index" >
                <!-- Header -->
                <div class="RowTitle">
                    <div class="title">
                        <span>
                            <img :src="item.picture"  @click="homePage(item.id)"/>
                            <tt class="tips" v-show="Number(item.status)==1?false:true"><Icon type="ios-pause" size="20" color="#42b983">暂停</Icon></tt>
                        </span>
                        <span class="MLeft20">
                            <b class="font16" @click="homePage(item.id)">{{item.name}}</b>
                            <i v-for="tage in item.tag" class="i">{{tage}}</i>
                        </span>
                        <span class="edit">
                            <em class="iconfont icon-bianji2" @click="editPro(item)"></em>
                            <em class="iconfont icon-shanchu" @click="deletePro(item.id,index,item.name)"></em>
                        </span>
                    </div>
                    <div>
                        <span class="MLeft20">
                            <p v-if="item.company!=null?true:false"><i class="iconfont icon-loudong"></i> {{item.company}}</p>
                            <p><i class="iconfont icon-SVG-"></i> {{item.start_date}} 至 {{item.end_date}}</p>
                        </span>
                        <span class="realname">
                            <p>{{item.realname}}</p>
                        </span>
                        <div class="clear"></div>
                    </div>
                </div>
                <!-- Content -->
                <div class="content">
                    <Row>
                    <Col span="6" class="listTitle">
                      <i-circle :percent="Number(item.rate_task)" :trail-width="9" :stroke-width="9" stroke-color="#3bceb6" trail-color="#d0f3ee" @click.native="homePage(item.id)">
                          <span class="demo-Circle-inner" style="font-size:22px;color:#3bceb6;margin-bottom:5px;font-weight:blod;">{{item.rate_task}}%</span><br/>进度
                      </i-circle><br/>
                      <span>{{item.last_day}}</span>
                    </Col>
                    <Col span="18" class="listLine">
                        <div class="line">
                            <div class="title">时间：</div>
                            <div class="lineRow lineTime">
                                <Progress :percent="Number(item.time_progress)|ProgessDay" :stroke-width="7" status="active">
                                    <span><i style="color:#3bceb6">{{item.time_progress>101?item.last_day:(Math.round(item.time_progress))|lastDay}}</i></span>
                                </Progress>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <div class="line">
                            <div class="title">延期：</div>
                            <div class="lineRow linePost">
                                <Progress :percent="Number(item.out_time_rate)" :stroke-width="7" status="active">
                                     <span><i style="color:#7cbefc">{{Math.round(Number(item.out_time_rate))}}%</i></span>
                                </Progress>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <div class="line">
                            <div class="title">文件：</div>
                            <div class="lineRow lineFile"><Progress :percent="Number(item.rate_task)" :stroke-width="7" status="active"><span><i style="color:#fcc44a">{{item.end_task}}</i> / {{item.all_task}}</span></Progress></div>
                            <div class="clear"></div>
                        </div>
                    </Col>
                  </Row>
                </div>
            </div>
            <div class="clear"></div>
            <!-- 删除项目 -->
            <Modal
                v-model="deleteProject"
                :title="deleteProValue"
                @on-ok="DeleteOk">
                <p style="font-size:14px;">你确定要删除 "<span style="margin:0px 5px;font-weight:bold;color:#ff8000;"> {{deleteProValue}} </span>"吗？,删除将无法撤销！</p>
            </Modal>
        </div>
</template>
<script>
var qs=require('querystring');
export default {
    data(){
        return{
            deleteProject:false,
            deleteProValue:'',
            DPid:0,
            DIndex:0
        }
    },
    props:{
            MsgData:{
            type:Array
        }
    },
    filters:{
      ProgessDay(val){
          if(val>100){
              return 101
          }else if(val<0){
              return 0
          }else{
              return val
          }
      },
      lastDay(val){
          if(val>0){
              return val+"%"
          }else if(val<0){
              return "0%"
          }else{
              return val
          }
      }
    },
    mounted(){
      this.AutoH();
    },
    methods:{
         // 初始化高度
        AutoH(){
            $(".projectManageContent").height($(window).height()-160)
        },
        // 删除项目
        deletePro(Pid,index,name){
            this.deleteProject=true;
            this.DPid=Pid;
            this.DIndex=index;
            this.deleteProValue=name;      
        },
        DeleteOk(){
                let _this=this;
                let url=_this.GLOBAL.baseRouter+'task/project/delete';
                let params={
                    id:this.DPid
                }
                _this.$axios.post(url,qs.stringify(params)).then((msg)=>{
                    _this.MsgData.splice(this.DIndex,1);
                    _this.$Message.info('成功删除');
                },()=>{
                    _this.$Message.error('删除失败')
                })
        },
        // 跳转到Home页
        homePage(id){
            sessionStorage.projectID=id;

            this.$router.push('/project')
        },
        //编辑项目
        editPro(item){
            this.$bus.emit("editProjectInfo",item)
        }
    }
}
</script>
