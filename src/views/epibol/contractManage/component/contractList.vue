<template>
        <div class="contractRow">
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
                                    <DropdownMenu slot="list" v-if="item.status<='0'">
                                        <DropdownItem @click.native="editContract(item.id)">编辑</DropdownItem>
                                        <DropdownItem @click.native="deleteContract(item.id)">删除</DropdownItem>
                                    </DropdownMenu>
                                    <DropdownMenu slot="list" v-else>
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
                                <i class="iconfont icon-loudong"></i> {{item.customer_name}}
                            </p>
                            <p class="company">
                                {{item.start_time}} ~ {{item.end_time}}
                            </p>
                        </div>
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
    mounted(){
        this.autoH();
        this.$bus.on('addContractData',(val)=>{
            this.onContractData=val;
        })
    },
    methods:{
        // 初始化高
        autoH(){
            $('.contractRow').height($(window).height()-160);
            this.$store.commit('changContractStatus',false);
        },
        //删除
        deleteContract(id){
            if(window.confirm('是否确认删除?')){
                let url=this.GLOBAL.baseRouter+'task/contract/delete-contract';
                let params={
                    "contract_id":id
                }
                this.$axios.post(url,qs.stringify(params)).then(msg=>{
                    this.$Message.success('删除成功！');
                    this.$bus.emit('addSuccess');
                })
            }else{
                return
            }
        },
        //编辑
        editContract(item){
            this.$store.commit('getContractIDCommit',item);//传contrac_ID
            this.$store.commit('getContractServerButton',true);//保存按钮
            this.newAddData();
        },
        // 新增合同
        newAddData(){
            this.$router.push('/epibol/contractData');//路由切换
        },
        // 详情
        contDetails(item){
            this.$store.commit('changContractStatus',true);//显示列表还是输入框
            this.$store.commit('getContractIDCommit',item);
            this.newAddData();
        }
        
    },
    destroyed(){
        this.$store.commit('getContrateCommit',false);//销毁组件
    }

}
</script>
