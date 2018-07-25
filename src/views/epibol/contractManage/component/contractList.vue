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
                                <DropdownMenu slot="list" v-if="item.status<'1'">
                                    <DropdownItem @click.native="editContract(item.id)">编辑</DropdownItem>
                                    <DropdownItem @click.native="deleteContract(item.id)">删除</DropdownItem>
                                </DropdownMenu>
                                <DropdownMenu slot="list">
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
    mounted(){
        this.autoH();
        this.$bus.on('addContractData',(val)=>{
            this.onContractData=val;
        })
    },
    methods:{
        // 初始化高
        autoH(){
            $('.contractRow').height($(window).height()-170);
            this.$store.commit('changContractStatus',false);
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
        //编辑
        editContract(item){
            this.$store.commit('getContractIDCommit',item);
            this.newAddData();
        },
        // 新增合同
        newAddData(){
            this.$router.push('/epibol/contractData');
        },
        // 详情
        contDetails(item){
            this.$store.commit('changContractStatus',true);
            this.$store.commit('getContractIDCommit',item);
            this.newAddData();
        }
        
    }

}
</script>
