<template>
    <div class="projectManage">
        <!-- 项目管理头部 -->
        <div class="projectMenu">
            <dl>
                <dt>
                    123
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
                    <Button type="primary" @click="addProject"><Icon type="plus"></Icon> 新建项目</Button>
                </dd>
                <div class="clear"></div>
            </dl>
        </div>
        <!-- 新建项目 -->
        <Modal v-model="modal"  @on-ok="subOk" @on-cancel="cancel"  width="700">
               <Add-Probox></Add-Probox>
        </Modal>
        <project-list :MsgData="MsgData"></project-list>
    </div>
</template>
<script>
import AddProbox from '../main-components/addProject.vue';
import projectList from './projectManage/projectList';
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
            {value: 0,label: '不限'},
            {value: 1,label: '进行中'},
            {value: 2,label: '暂停'},
            {value: 3,label: '已完成'}
        ],
        MSelect:0,
        pactList:[
            {value: 0,label: '不限'},
            {value: 1,label: '有'},
            {value: 2,label: '无'}
        ],
        PSelect:0,
        modelSelet:'',
        search:'',
        SLindex:0,
        modal:false,
        AddPorData:null,
        MsgData:[],
        Prostatus:'',
        remIconUp:true,
        remIconDown:false,
      }
  },
  computed:{
  
  },
 
  components:{
      AddProbox:AddProbox,
      projectList:projectList
  },
  mounted(){
      this.$bus.on("AddProInfo",(val)=>{
          this.AddPorData=val;
      });
      this.$bus.on("editProjectInfo",(val)=>{
          this.editPro(val);
      })
      this.getData();
  },
  methods:{
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
            EPleader:item.realname,
            EPcontract:item.contract,
            EPtag:item.tag,
            EPstartTime:item.start_date,
            EPendTime:item.end_date,
            EPstatus:item.status,
            EPpicture:item.picture,
            EpmanangeName:item.realname==null||item.realname==" "?{"name":"NotName"}:{"name":item.realname}
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
    getData(search=this.search){
        let _this=this;
        let url=this.GLOBAL.baseRouter+'task/project/page';
        let params={
            "order":"create_time",
            "order_by":"desc",
            "search":search,
            "page_size":50
        }
        _this.$axios.post(url,qs.stringify(params)).then(msg=>{
            let MsgData=msg.data;
            if(MsgData.err_code==0){
                _this.MsgData=MsgData.project;
            }
        },()=>{
            this.$Message.error('请求失败！')
        })
    },
    // 搜索
    ProSearch(){
        this.getData(this.search)
    },
    

  }
}
</script>
<style lang="less">
    @import '../../styles/home.less';
</style>

