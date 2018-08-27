<template>
    <div class="newContract">
        <main-native>
            <div class="main-header-style iconfont"><i></i>{{this.$route.meta.title}}</div>
        </main-native>
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
</template>
<script>
var qs=require('querystring');
import contractList from './contractManage/component/contractList';
import mainNative from '../main-components/mainNative.vue';
export default {
  data(){
        return{
            search:null,
            contData:[]
        }
  },
  components:{
      contractList:contractList,
      mainNative:mainNative
  },
  mounted(){
    this.contractData(this.search);
  },
  watch:{
    status(val){
      this.search=null;
      this.contractData(this.search);
    }
  },
  methods:{
    searchCommit(){
        this.contractData(this.search);
    },
    // 初始化列表数据
    contractData(search=this.search){
        let _this=this;
        let url=_this.GLOBAL.baseRouter+'task/demand-contract/contract-list';
        let params={
                search:search,
                page_size:50,
        };
        _this.$Loading.start();
        _this.$axios.post(url,qs.stringify(params)).then(msg=>{
            _this.$Loading.finish();
              if(msg.data.err_code==0){
                _this.contData=msg.data.data;
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

