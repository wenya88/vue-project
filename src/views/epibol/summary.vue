<template>
    <div>
        <!-- 项目管理头部 -->
        <div class="projectMenu">
            <dl>
                <dt>
                    <Button type="primary" @click="addProject"><Icon type="plus"></Icon> 新建项目</Button>
                </dt>
                <dd>
                    <span  v-for="(item,index) in sortList" :key="index">
                        <i class="descIcon"></i>
                        <a @click="sortAction(index,item.action)" :class="{show:index==SLindex}">{{item.label}}</a>
                    </span>
                    <span class="MLeft">状态：
                        <Select v-model="MSelect" style="width:80px">
                            <Option v-for="item in stateList" :value="item.value" :key="item.value" @click.native="statFilte(item.value)">{{ item.label }}</Option>
                        </Select>
                    </span>
                    <span class="MLeft10">合同：
                        <Select v-model="PSelect" style="width:80px">
                            <Option v-for="item in pactList" :value="item.value" :key="item.value" @click.native="contFilte(item.value)">{{ item.label }}</Option>
                        </Select>
                    </span>
                    <span class="MLeft10">
                        <Input v-model="search" placeholder="项目名称/项目经理/公司">
                            <Button slot="append" icon="ios-search"  @click.native="ProSearch"></Button>
                        </Input>    
                    </span>
                </dd>
                <div class="clear"></div>
            </dl>
        </div>
        <!-- 新建项目 -->
        <Modal v-model="modal"  @on-ok="subOk" @on-cancel="cancel"  width="700">
            <AddProbox></AddProbox>
        </Modal>
        <!-- 项目管理内容 -->
        <div class="projectManageContent">
            <div class="ContentRow" v-for="(item,index) in MsgData" :key="index"  @click.stop="homePage">
                <!-- Header -->
                <div class="RowTitle">
                    <span>
                        <tt class="tips" v-show="Number(item.status)==1?false:true"><Icon type="ios-pause" size="20" color="#42b983">暂停</Icon></tt>
                        <img :src="item.picture" />
                    </span>
                    <span class="MLeft20">
                        <p><b class="font16">{{item.name}}</b></p>
                        <p><i v-for="tage in item.tag">{{tage}}</i></p>
                    </span>
                    <span class="MLeft20">
                        <p>{{item.start_date}} 至 {{item.end_date}}</p>
                        <p><i>成都义美游艺术有限公司</i></p>
                    </span>
                    <span class="MLeft20">
                        <p>负责人：李帅虎</p>
                    </span>
                    <span class="edit">
                        <Dropdown>
                            <a href="javascript:void(0)">
                                <Icon type="ios-more">操作</Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem @click.native.stop="editPro(item.id,item.name,item.leader,item.contract,item.tag,item.start_date,item.end_date,item.status,item.picture)">编辑</DropdownItem>
                                <DropdownItem @click.native.stop="deletePro(item.id,index)">删除</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </span>
                    <div class="clear"></div>
                </div>
                <!-- Content -->
            
                <div class="content">
                    <Row>
                    <Col span="6" class="listTitle">
                      <i-circle :percent="Number(item.rate_task)" :trail-width="16" :stroke-width="15" stroke-color="#44aa00">
                          <span class="demo-Circle-inner" style="font-size:22px;color:#00b200;margin-bottom:5px;font-weight:blod;">{{item.rate_task}}%</span><br/>进度
                      </i-circle><br/>
                      <span>{{item.last_day}}</span>
                    </Col>
                    <Col span="18" class="listLine">
                        <div class="line">
                            <div class="title">时间：</div>
                            <div class="lineRow"><Progress :percent="Number(item.time_progress>101?101:item.time_progress)" :stroke-width="16"><span>{{item.time_progress>101?item.last_day:Math.round(item.time_progress)+"%"}}</span></Progress></div>
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
            {"label":"创建时间","action":"setUp"},
            {"label":"结束时间","action":"remDay"},
            {"label":"项目进度","action":"proSch"}
        ],
        stateList: [
            {
                value: '0',
                label: '不限'
            },
            {
                value: '1',
                label: '进行中'
            },
            {
                value: '2',
                label: '暂停'
            },
            {
                value: '3',
                label: '已完成'
            }
        ],
        MSelect:'0',
        pactList:[
            {
                value: '0',
                label: '不限'
            },
            {
                value: '1',
                label: '有'
            },
            {
                value: '2',
                label: '无'
            }
        ],
        PSelect:'0',
        modelSelet:'',
        search:'',
        SLindex:Number,
        modal:false,
        AddPorData:null,
        pageIndex:1,
        MsgData:[],
        sessMsgData:[],
        Prostatus:'',
      }
  },
  computed:{
  
  },
  components:{AddProbox},
  mounted(){
      this.$bus.on("AddProInfo",(val)=>{
          this.AddPorData=val;
      });
      this.getData();
  },
  update(){
      this.statFilte(this.MSelect);
  },
  methods:{
    //   筛选选择
    sortAction(index,action){
        this.SLindex=index;
        if(action=="setUp"){
            this.MsgData.sort((a,b)=>Date.parse(a.start_date)-Date.parse(b.start_date))
        }else if(action=="proSch"){
            this.MsgData.sort((a,b)=>a.rate_task>b.rate_task)
        }else if(action=="remDay"){
            this.MsgData.sort((a,b)=>Date.parse(a.end_date)-Date.parse(b.end_date))
        }
    },
    // 状态筛选
    filteMsgData(value){
          this.PSelect='0'
          this.MsgData=this.sessMsgData;
          if(value>0){
            return this.MsgData.filter(item=>{
              return item.status==value;
            })
          }else if(value==0){
              return this.MsgData=this.sessMsgData;
          }
    },
    statFilte(value){
        if(value==1){
            this.MsgData=this.filteMsgData(value);
        }else if(value==2){
            this.MsgData=this.filteMsgData(value);
        }else if(value==3){
             this.MsgData=this.filteMsgData(value);
        }else if(value==0){
            this.MsgData=this.filteMsgData(value);
        }
    },
    // 合同筛选
    filteCont(value){
        this.MSelect='0'
        this.MsgData=this.sessMsgData;
        if(value==1){
            return this.MsgData.filter(item=>{
                return item.contract!=null;
            })
        }else if(value==2){
            return this.MsgData.filter(item=>{
                return item.contract==null;
            })
        }else if(value==0){
            return this.MsgData=this.sessMsgData;
        }
        
    },
    contFilte(value){
        if(value==1){
           this.MsgData=this.filteCont(value);
        }else if(value==2){
           this.MsgData=this.filteCont(value);
        }else if(value==0){
           this.MsgData=this.filteCont(value);
        }
    },
    //   新建项目
    addProject(){
        this.modal=true;
        this.Prostatus="NewAdd"
    },
    // 编辑项目
    editPro(id,name,leader,contract,tag,startTime,endTime,status,picture){
        this.modal=true;
        this.Prostatus="editPro";
        let EditProObj={
            EPid:id,
            EPname:name,
            EPleader:leader,
            EPcontract:contract,
            EPtag:tag,
            EPstartTime:startTime,
            EPendTime:endTime,
            EPstatus:status,
            EPpicture:picture
        };
        this.$bus.emit("EditProData",EditProObj);
        
    },
    // 删除项目
    deletePro(Pid,index){
        if(confirm("你确定删除吗？")){
            
            let _this=this;
            let url=_this.GLOBAL.baseRouter+'task/project/delete';
            let params={
                id:Pid
            }
            _this.$axios.post(url,qs.stringify(params)).then((msg)=>{
                _this.MsgData.splice(index,1);
                _this.$Message.info('成功删除');
            },()=>{
                _this.$Message.error('删除失败')
            })

        }else{
            return
        }
        
        
        
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
            tag:_this.AddPorData.count,//标签
            leader:_this.AddPorData.manageCount,//负责人ID
            picture:_this.AddPorData.uploadurl, //图片地址
            status:_this.AddPorData.state //状态 1正常,暂停
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
        this.$Message.info('取消');
        if(this.Prostatus=="editPro"){
            this.$bus.emit("submitOk")
        }
    },
    // 获取列表数据
    getData(){
        let _this=this;
        let url=this.GLOBAL.baseRouter+'task/project/page&page='+_this.pageIndex;
        _this.$axios.get(url).then(msg=>{
            let MsgData=msg.data;
            if(MsgData.err_code==0){
               _this.MsgData=MsgData.project;
               _this.sessMsgData=MsgData.project;
            }
            
        },()=>{
            this.$Message.error('请求失败！')
        })
    },
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
            }   
        },()=>{
            this.$Message.error('请求失败！')
        })
    },
    // 跳转到Home页
    homePage(){
        this.$router.push('/project/home.vue')
    }

  }
}
</script>
<style lang="less">
    @import '../../styles/home.less';
</style>

