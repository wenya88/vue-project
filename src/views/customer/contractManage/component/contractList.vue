<template>
    <div>
        <div class="contractRow">
            <GeminiScrollbar>
                <dl>
                    <dd v-for="(item,index) in contData" :key="index">
                        <div class="statusRow">
                            <div :class="[item.status!=0?'status':'status yellow']">
                                {{item.status_text}}
                            </div>
                            <div class="title">
                                <Dropdown trigger="click" placement="bottom-end">
                                    <a href="javascript:void(0)">
                                    <Icon type="ios-more" size="38"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem @click.native="contDetails(item.id)">详情</DropdownItem>
                                </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>
                        <div class="projectName">
                             {{item.contract_name}}
                        </div>
                        <div class="projectMoney">
                            ￥<span>{{item.contract_price}}</span>
                        </div>
                        <div class="projectInfo">
                            <p class="company">
                                <i class="iconfont icon-loudong"></i> {{item.company}}
                            </p>
                            <p class="company">
                                {{item.start_time}} ~ {{item.end_time}}
                            </p>
                        </div>
                    </dd>
                </dl>
            </GeminiScrollbar>
        </div>
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
        // 初始化高
        autoH(){
            $('.contractRow').height($(window).height()-210);
        },         
        // 详情
        contDetails(id){
           this.$router.push('/customer/contractData');
           this.$store.commit('getContractIDCommit',id);
        }
        
    }

}
</script>
