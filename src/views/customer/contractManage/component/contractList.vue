<template>
    <div>
        <div class="contractRow">
            <GeminiScrollbar>
                <dl>
                    <dd v-for="(item,index) in contData" :key="index">
                        <div class="title">
                            <Dropdown>
                                <a href="javascript:void(0)">
                                    <Icon type="ios-more" size="20"></Icon>
                                </a>
                                <DropdownMenu slot="list" v-if="item.status<='0'">
                                    <DropdownItem @click.native="editContract(item.id)">编辑</DropdownItem>
                                    <DropdownItem @click.native="deleteContract(item.id)">删除</DropdownItem>
                                </DropdownMenu>
                                <DropdownMenu slot="list" v-else>
                                    <DropdownItem @click.native="contDetails(item.id)">详情</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <div class="projectName">
                            {{item.contract_name}}
                        </div>
                        <div class="projectName">
                            ￥{{item.contract_price}}
                        </div>
                        <div class="projectStatus">
                            <span class="status">
                                {{item.status_text}}
                            </span>
                            <span class="line">&nbsp;</span>
                        </div>
                        <div class="projectInfo">
                            <span class="company">
                                <i class="iconfont icon-ren"></i> {{item.customer_name}}
                            </span>
                            <span class="date">
                                {{item.create_time}}
                            </span>
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
