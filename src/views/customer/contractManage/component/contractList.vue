<template>
    <div>
        <dl class="contractRow">
            <dd class="title">
                <span>所属项目</span>
                <span>合同金额</span>
                <span>乙方信息</span>
                <span>对接人</span>
                <span>联系电话</span>
                <span>合同进度</span>
                <span>操作</span>
                <div class="clear"></div>
            </dd>
            <dd v-for="item in contData">
                <span>{{item.project_name}}</span>
                <span>￥{{item.contract_price}}</span>
                <span>{{item.company}}</span>
                <span>{{item.customer_people}}</span>
                <span>{{item.customer_phone}}</span>
                <span>{{item.status_text}}</span>
                <span>
                    <em>
                        <i @click="contDetails(item.id)" v-show="item.status=='0'?false:true">详情</i>
                        <i v-show="item.status=='0'" class="btn" @click="enterContract(item.id)">确认合同</i>
                        <i v-show="item.status=='1'||item.status=='4'||item.status=='6'||item.status=='9'?true:false" class="btn">{{item.status|filterStat}}</i>
                    </em>
                </span>
                <div class="clear"></div>
            </dd>
        </dl>
    </div>
</template>
<script>
var qs=require('querystring');
export default {
    data(){
        return{
             addModal:false,
             modalTitle:null,
             onContractData:Object
        }
    },
    props:{
        contData:{
            type:Array
        }
    },
    filters:{
        filterStat(val){
            switch(val){
                case '1':
                case '6':
                    return '立即支付'
                    break;
                case '4':
                case '9':
                    return '同意结算'
                    break;
            }
        }
    },
    mounted(){
        this.autoH();
    },
    methods:{
        enterContract(id){
            this.$store.commit('changContractStatus',true);
            this.$router.push('/epibol/contractDetails/'+id);
        },
        // 初始化高
        autoH(){
            $('.contractRow').height($(window).height()-210);
        },         
        // 详情
        contDetails(id){
            this.$store.commit('changContractStatus',false);
            this.$router.push('/epibol/contractDetails/'+id);
        }
        
    }

}
</script>
