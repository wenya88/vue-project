<template>
    <!-- 项目管理内容 -->
        <div class="projectManageContent">
            <GeminiScrollbar>
            <div class="ContentRow" v-for="(item,index) in MsgData" :key="index" >
                <!-- Header -->
                <div class="RowTitle">
                    <span class="edit">
                        <Dropdown>
                            <a href="javascript:void(0)">
                                <Icon type="ios-more">操作</Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem @click.native.stop="editPro(item)">编辑</DropdownItem>
                                <DropdownItem @click.native.stop="deletePro(item.id,index,item.name)">删除</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </span>
                    <span>
                        <img :src="item.picture"  @click="homePage(item.id)"/>
                        <tt class="tips" v-show="Number(item.status)==1?false:true"><Icon type="ios-pause" size="20" color="#42b983">暂停</Icon></tt>
                    </span>
                    <span class="MLeft20">
                        <p><b class="font16" @click="homePage(item.id)">{{item.name}}</b></p>
                        <p><i v-for="tage in item.tag">{{tage}}</i></p>
                    </span>
                    <span class="MLeft20">
                        <p>{{item.start_date}} 至 {{item.end_date}}</p>
                        <p><i v-if="item.company!=null?true:false">{{item.company}}</i></p>
                    </span>
                    <span class="MLeft20">
                        <p>负责人：{{item.realname}}</p>
                    </span>

                    <div class="clear"></div>
                </div>
                <!-- Content -->
                <div class="content">
                    <Row>
                    <Col span="6" class="listTitle">
                      <i-circle :percent="Number(item.rate_task)" :trail-width="16" :stroke-width="15" stroke-color="#44aa00" @click.native="homePage(item.id)">
                          <span class="demo-Circle-inner" style="font-size:22px;color:#00b200;margin-bottom:5px;font-weight:blod;">{{item.rate_task}}%</span><br/>进度
                      </i-circle><br/>
                      <span>{{item.last_day}}</span>
                    </Col>
                    <Col span="18" class="listLine">
                        <div class="line">
                            <div class="title">时间：</div>
                            <div class="lineRow"><Progress :percent="Number(item.time_progress)|ProgessDay" :stroke-width="16"><span>{{item.time_progress>101?item.last_day:(Math.round(item.time_progress))|lastDay}}</span></Progress></div>
                            <div class="clear"></div>
                        </div>
                        <div class="line">
                            <div class="title">延期：</div>
                            <div class="lineRow"><Progress :percent="Number(item.out_time_rate)" :stroke-width="16"></Progress></div>
                            <div class="clear"></div>
                        </div>
                        <div class="line">
                            <div class="title">文件：</div>
                            <div class="lineRow"><Progress :percent="Number(item.rate_task)" :stroke-width="16"><span>{{item.end_task}}/{{item.all_task}}</span></Progress></div>
                            <div class="clear"></div>
                        </div>
                    </Col>
                  </Row>
                </div>
            </div>
            <div class="clear"></div>
            </GeminiScrollbar>
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
            $(".projectManageContent").height($(window).height()-140)
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
