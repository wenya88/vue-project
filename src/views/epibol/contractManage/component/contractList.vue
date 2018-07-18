<template>
    <div>
        <div class="contractRow">
            <GeminiScrollbar>
                <dl>
                    <dd v-for="item in contData">
                        <div class="title">
                            <Dropdown>
                                <a href="javascript:void(0)">
                                    <Icon type="ios-more" size="20"></Icon>
                                </a>
                                <DropdownMenu slot="list" v-if="item.status=='0'||item.status=='13'">
                                    <DropdownItem @click.native="editContract(item)">编辑</DropdownItem>
                                    <DropdownItem @click.native="editContract(item.id)">删除</DropdownItem>
                                </DropdownMenu>
                                <DropdownMenu slot="list" v-else>
                                    <DropdownItem v-show="item.status=='12'||item.status=='8'?true:false">{{item.status=='3'?'申请结算首付款':'申请结算尾款'}}</DropdownItem>
                                    <DropdownItem @click.native="contDetails(item.id)">详情</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <div class="projectName">
                            {{item.project_name!=null?item.project_name:'--'}}
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
    mounted(){
        this.autoH();
        this.$bus.on('addContractData',(val)=>{
            this.onContractData=val;
        })
    },
    methods:{
        // 初始化高
        autoH(){
            $('.contractRow').height($(window).height()-170)
        },
        // 提交
        addOk(){
            let _this=this;
            let url=_this.GLOBAL.baseRouter+'task/company/add-contract';
            let editUrl=_this.GLOBAL.baseRouter+'task/company/edit-contract';
            _this.$Loading.start();
            if(_this.onContractData.id==null){
                delete _this.onContractData.id;
                _this.$axios.post(url,qs.stringify(_this.onContractData)).then(msg=>{
                    _this.$Loading.finish();
                    if(msg.data.err_code==0){
                        _this.$Message.success(msg.data.err_message);
                        _this.$bus.emit('addSuccess');
                        _this.addCancel();
                    }else if(msg.data.err_code>0){
                        _this.$Message.error(msg.data.err_message)
                    }
                })
            }else{
                _this.$axios.post(editUrl,qs.stringify(_this.onContractData)).then(msg=>{
                    _this.$Loading.finish();
                    if(msg.data.err_code==0){
                        _this.$Message.success('修改成功！');
                        _this.$bus.emit('addSuccess');
                        _this.addCancel();
                    }else{
                        _this.$Message.warning(msg.data.err_message)
                    }
                })
            }
        },
        //删除
        deleteContract(id){
            if(window.confirm('是否确认删除?')){
                let url=this.GLOBAL.baseRouter+'task/company/delete-contract';
                let params={
                    id:id
                }
                this.$axios.post(url,qs.stringify(params)).then(msg=>{
                    this.$Message.success('删除成功！');
                    this.$bus.emit('addSuccess');
                })
            }else{
                return
            }
        },
        // 新增合同
        newAddData(){
            this.$router.push('/epibol/contractData');
        },
        // 详情
        contDetails(id){
            this.$store.commit('changContractStatus',false);
            this.$router.push('/epibol/contractDetails/'+id);
        }
        
    }

}
</script>
