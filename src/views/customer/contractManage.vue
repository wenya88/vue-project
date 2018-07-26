<template>
  <div>
    <div class="newContract">
        <dl>
            <dt>
                <span class="span">
                    <Input v-model="search" placeholder="合同/项目名称" style="width: 300px" icon="ios-search" @on-click="searchCommit" @on-enter="searchCommit"></Input>
                </span>
                <div class="clear"></div>
            </dt>
            <contract-list :contData="contData" ref="contractRef"></contract-list>
        </dl>
    </div>
  </div>
</template>
<script>
var qs=require('querystring');
import contractList from './contractManage/component/contractList';
export default {
  data(){
        return{
            search:null,
            contData:[],
            status:"20",
            filterSataus:[
              { "status": "20", "statusText": "全部" }
            ],
            loadNum:0
        }
  },
  components:{
    contractList:contractList
  },
  mounted(){
    this.contractData(this.search,this.status);
  },
  watch:{
    status(val){
      this.search=null;
      this.contractData(this.search,val);
    }
  },
  methods:{
    searchCommit(){
        this.contractData(this.search);
    },
    // 初始化列表数据
    contractData(search=this.search,status=this.status){
        let _this=this;
        let url=_this.GLOBAL.baseRouter+'task/company/contract-list';
        let params={
                search:search,
                status:status,
                demand_id:2
        };
        _this.$Loading.start();
        _this.$axios.post(url,qs.stringify(params)).then(msg=>{
            _this.$Loading.finish();
              if(msg.data.err_code==0){
                _this.contData=msg.data.data;
                if(_this.loadNum==0){
                    _this.contData.forEach(val=>{
                        let obj={
                          status:val.status,
                          statusText:val.status_text
                        }
                        _this.filterSataus.push(obj) 
                    })
                    // 去重
                    for(let i = 0; i < _this.filterSataus.length - 1; i++){
                        for(let j = 1; j < _this.filterSataus.length; j++){
                            if (i != j) {
                                if (_this.filterSataus[i].status == _this.filterSataus[j].status) {
                                    _this.filterSataus.splice(j, 1)
                                }
                            }
                        }
                    }
                  _this.loadNum=1;
                }
            }
        },()=>{
                _this.$Loading.error();
        })
    },
  }
}
</script>
<style lang="less">
@import '../epibol/contractManage/style/contractManage.less';
</style>

