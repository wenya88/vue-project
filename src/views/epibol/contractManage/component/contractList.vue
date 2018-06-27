<template>
    <div>
        <dl class="contractRow">
            <dd class="title">
                <span>所属项目</span>
                <span>合同金额</span>
                <span>甲方信息</span>
                <span>商务人员</span>
                <span>项目负责人</span>
                <span>合同进度</span>
                <span>操作</span>
                <div class="clear"></div>
            </dd>
            <dd v-for="item in contData" :class="{ddBg:item.status==3||item.status==8}">
                <span>{{item.project_name}}</span>
                <span>￥{{item.contract_price}}</span>
                <span>{{item.customer_name}}<s>({{item.customer_people}}{{item.customer_phone}})</s></span>
                <span>{{item.business_people}}</span>
                <span>{{item.manager}}</span>
                <span>{{item.status_text}}</span>
                <span>
                    <em v-if="item.status=='0'||item.status=='13'">
                        <i @click="editContract(item)">编辑</i><i @click="deleteContract(item.id)">删除</i>
                    </em>
                    <em v-else>
                        <i v-show="item.status=='12'||item.status=='8'?true:false" class="btn">{{item.status=='3'?'申请结算首付款':'申请结算尾款'}}</i>
                        <i @click="contDetails(item.id)">详情</i>
                    </em>
                </span>
                <div class="clear"></div>
            </dd>
        </dl>
        <Modal
            v-model="addModal"
            :title="modalTitle"
            @on-ok="addOk"
            :closable="false"
            width='700'
            @on-cancel="addCancel">
            <contract-data ref="contractDataRef"></contract-data>
        </Modal>
    </div>
</template>
<script>
var qs=require('querystring');
import contractData from './contractData';
export default {
    data(){
        return{
             addModal:false,
             modalTitle:null,
             onContractData:Object
        }
    },
    components:{
        contractData:contractData
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
            $('.contractRow').height($(window).height()-210)
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
        // 取消
        addCancel(){
            this.$refs.contractDataRef.clearData();
        },
        // 编辑
        editContract(item){
            this.addModal=true;
            this.modalTitle='编辑合同';
            this.$refs.contractDataRef.editContractData(item)
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
            this.addModal=true;
            this.modalTitle='新增合同';
        },
        // 详情
        contDetails(id){
            this.$store.commit('changContractStatus',false);
            this.$router.push('/epibol/contractDetails/'+id);
        }
        
    }

}
</script>
