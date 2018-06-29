<template>
    <div class="projectManage">
        <!-- 项目管理头部 -->
        <div class="projectMenu">
            <dl>
                <dt>
                    <Button type="primary" @click="addProject"><Icon type="plus"></Icon> 新建项目</Button>
                </dt>
                <dd>
                    <span  v-for="(item,index) in sortList" :key="index">
                        <a @click="sortAction(index,item.action)" :class="{show:index==SLindex}">
                            <i :class="[
                                index==0?'descIcon':'remIcon',
                                item.Cindex==1?'remIconDown':'',
                                item.Cindex==2?'remIconUp':'',
                                ]"></i>
                            {{item.label}}
                        </a>                        
                    </span>
                    <span class="MLeft">状态：
                        <Select v-model="MSelect" style="width:80px">
                            <Option v-for="item in stateList" :value="item.value" :key="item.value" @click.native="DataFilte(item.value)">{{ item.label }}</Option>
                        </Select>
                    </span>
                    <span class="MLeft10">合同：
                        <Select v-model="PSelect" style="width:80px">
                            <Option v-for="item in pactList" :value="item.value" :key="item.value" @click.native="HDataFilte(item.value)">{{ item.label }}</Option>
                        </Select>
                    </span>
                    <span class="MLeft10">
                        <Input v-model="search" placeholder="项目名称/项目经理/公司" @on-enter="ProSearch">
                            <Button slot="append" icon="ios-search"  @click.native="ProSearch"></Button>
                        </Input>    
                    </span>
                </dd>
                <div class="clear"></div>
            </dl>
        </div>
        <!-- 新建项目 -->
        <Modal v-model="modal"  @on-ok="subOk" @on-cancel="cancel"  width="700">
               <Add-Probox></Add-Probox>
        </Modal>

        <!-- 删除项目 -->
        <Modal
            v-model="deleteProject"
            :title="deleteProValue"
            @on-ok="DeleteOk">
            <p style="font-size:14px;">你确定要删除 "<span style="margin:0px 5px;font-weight:bold;color:#ff8000;"> {{deleteProValue}} </span>"吗？,删除将无法撤销！</p>
        </Modal>
        <!-- 项目管理内容 -->
        <div class="projectManageContent">
            <GeminiScrollbar>
            <div class="ContentRow" v-for="(item,index) in MsgData" :key="index" >
                <!-- Header -->
                <div class="RowTitle">
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
        </div>
    </div>
</template>
<script>
import AddProbox from '../main-components/addProject.vue';
var qs=require('querystring');
export default {
  data(){
      return{
        sortList:[
            {"label":"创建时间","action":"setUp","Cindex":0},
            {"label":"剩余天数","action":"remDay","Cindex":0},
            {"label":"项目进度","action":"proSch","Cindex":0}
        ],
        remDay:0,
        proSch:0,
        stateList: [
            {
                value: 0,
                label: '不限'
            },
            {
                value: 1,
                label: '进行中'
            },
            {
                value: 2,
                label: '暂停'
            },
            {
                value: 3,
                label: '已完成'
            }
        ],
        MSelect:0,
        pactList:[
            {
                value: 0,
                label: '不限'
            },
            {
                value: 1,
                label: '有'
            },
            {
                value: 2,
                label: '无'
            }
        ],
        PSelect:0,
        modelSelet:'',
        search:'',
        SLindex:0,
        modal:false,
        AddPorData:null,
        pageIndex:1,
        MsgData:[],
        sessMsgData:[],
        Prostatus:'',
        remIconUp:true,
        remIconDown:false,
        deleteProject:false,
        deleteProValue:'',
        DPid:0,
        DIndex:0
      }
  },
  computed:{
  
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
  components:{
      AddProbox:AddProbox
  },
  mounted(){
      this.$bus.on("AddProInfo",(val)=>{
          this.AddPorData=val;
      });
      this.getData();
      this.AutoH();
  },
  update(){
      this.statFilte(this.MSelect);
  },
  methods:{
    // 初始化高度
    AutoH(){
        $(".projectManageContent").height($(window).height()-136)
    },
    //   筛选选择
    sortAction(index,action){
        this.SLindex=index;
        if(action=="setUp"){
            this.remDay=0;
            this.proSch=0;
            this.sortList[1].Cindex=0;
            this.sortList[2].Cindex=0;
            this.MsgData.sort((a,b)=>Date.parse(b.start_date)-Date.parse(a.start_date))
        }else if(action=="proSch"){
                this.sortList[1].Cindex=0;
                this.remDay=0;
            if(this.proSch==0){
                this.sortList[2].Cindex=1;
                this.MsgData.sort((a,b)=>a.rate_task>b.rate_task);
                this.proSch=1;
            }else{
                this.sortList[2].Cindex=2;
                this.MsgData.sort((a,b)=>a.rate_task<b.rate_task);
                this.proSch=0;
            }
        }else if(action=="remDay"){
                this.proSch=0;
                this.sortList[2].Cindex=0;
            if(this.remDay==0){
                this.sortList[1].Cindex=1;
                this.MsgData.sort((a,b)=>Date.parse(b.end_date)-Date.parse(a.end_date));
                this.remDay=1;

            }else{
                this.sortList[1].Cindex=2;
                this.MsgData.sort((a,b)=>Date.parse(a.end_date)-Date.parse(b.end_date));
                this.remDay=0;
            }
        }
    },
    //   新建项目
    addProject(){
        this.modal=true;
        this.Prostatus="NewAdd"
    },
    // 编辑项目
    editPro(item){
        this.modal=true;
        this.Prostatus="editPro";
        let EditProObj={
            EPid:item.id,
            EPname:item.name,
            EPleader:item.leader,
            EPcontract:item.contract,
            EPtag:item.tag,
            EPstartTime:item.startTime,
            EPendTime:item.endTime,
            EPstatus:item.status,
            EPpicture:item.picture,
            EpmanangeName:item.Mname==null||item.Mname==" "?{"name":"NotName"}:{"name":item.Mname}
        };
        this.$bus.emit("EditProData",EditProObj);
    },
    // 联动查询
    DataFilte(val){
        let _this=this;
        this.MSelect=val;
        let url=_this.GLOBAL.baseRouter+'task/project/page&is_contract='+this.PSelect+"&status="+this.MSelect;
        _this.$axios.get(url).then(msg=>{
            _this.MsgData=msg.data.project;
        })
    }, 
    HDataFilte(val){
        let _this=this;
        this.PSelect=val;
        let url=_this.GLOBAL.baseRouter+'task/project/page&is_contract='+this.PSelect+"&status="+this.MSelect;
        _this.$axios.get(url).then(msg=>{
            _this.MsgData=msg.data.project;
        })
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
    // 新建或编辑项目
    subOk(){
        let _this=this;
        let url=_this.GLOBAL.baseRouter+'task/project/add';
        let editUrl=_this.GLOBAL.baseRouter+'task/project/update';
        let obj={
            id:_this.AddPorData.Pid,//项目id
            name:_this.AddPorData.proName, //项目名称
            contract:_this.AddPorData.proCont, //合同号或者ID
            start_time:_this.AddPorData.startDate, //开始时间
            end_time:_this.AddPorData.endDate, //结束时间
            tag:_this.AddPorData.count.toString(),//标签
            leader:_this.AddPorData.manageCount,//负责人ID
            picture:_this.AddPorData.uploadurl, //图片地址
            status:_this.AddPorData.state //状态 1正常,2暂停
        }
        if(this.Prostatus=="NewAdd"){
            delete obj.id;
            _this.$axios.post(url,qs.stringify(obj)).then(()=>{
                _this.$Message.info('提交成功');
                _this.getData();
                _this.$bus.emit("submitOk")
            },()=>{
                _this.$Message.error('提交失败！')
            })
        }else if(this.Prostatus=="editPro"){
            _this.$axios.post(editUrl,qs.stringify(obj)).then(()=>{
                _this.$Message.info('提交成功');
                _this.getData();
                _this.$bus.emit("submitOk");
            },()=>{
                _this.$Message.error('提交失败！')
            })
        }
    },
    // 取消Model
    cancel(){
        if(this.Prostatus=="editPro"){
            this.$bus.emit("submitOk")
        }
    },
    // 获取列表数据
    getData(){
        let _this=this;
        let url=this.GLOBAL.baseRouter+'task/project/page&order=create_time&order_by=desc&page='+_this.pageIndex;//
        _this.$axios.get(url).then(msg=>{
            let MsgData=msg.data;
            if(MsgData.err_code==0){
            _this.MsgData=MsgData.project;
            //    缓存数据
               _this.sessMsgData=MsgData.project;
            }
            
        },()=>{
            this.$Message.error('请求失败！')
        })
    },
    // 搜索
    ProSearch(){
        let _this=this;
        _this.MSelect='0';
        _this.PSelect='0';
        let url=this.GLOBAL.baseRouter+'task/project/page&search='+_this.search;
        _this.$axios.get(url).then(msg=>{
            let MsgData=msg.data;
            if(MsgData.err_code==0){
               _this.MsgData=MsgData.project;
               _this.sessMsgData=MsgData.project;
              _this.MsgData.sort((a,b)=>Date.parse(a.start_date)-Date.parse(b.start_date))
            }   
        },()=>{
            this.$Message.error('请求失败！')
        })
    },
    // 跳转到Home页
    homePage(id){
        sessionStorage.projectID=id;
        this.$router.push('/project/home')
    }

  }
}
</script>
<style lang="less">
    @import '../../styles/home.less';
</style>

