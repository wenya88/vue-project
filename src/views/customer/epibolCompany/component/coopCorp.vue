<template>
    <div class="corpList">
        <div class="bidList">
            <dl>
                <dt>
                    <span>公司名称</span>
                    <span>合作次数</span>
                    <span>来源</span>
                    <span>联系人</span>
                    <span>联系电话</span>
                    <span>擅长领域</span>
                    <span>备注</span>
                    <span>操作</span>
                    <div class="clear"></div>
                </dt>
                <dd v-for="item in coopCorpData">
                    <span>{{item.company}}</span>
                    <span>{{item.cooperation_num}}</span>
                    <span>{{item.from}}</span>
                    <span>{{item.contact_people}}</span>
                    <span>{{item.tel}}</span>
                    <span v-if="item.tag">
                        <p>
                            <!--<em v-if="">{{item.tag}}</em>-->
                            <!--<em v-for="tag in JSON.parse(item.tag)">{{tag}}</em>-->
                        </p>
                    </span>
                    <span>{{item.description}}</span>
                    <span>
                        <i class="iconfont icon-bianji2" @click="editCoop(item.id,item.company,item.contact_people,item.tel,item.description,item.tag)"></i>
                        <i class="iconfont icon-shanchu" @click="deleteCoop(item.id)"></i>
                    </span>
                    <div class="clear"></div>
                </dd>
            </dl>
        </div>
        <!-- Modal组件 -->
        <Modal
            v-model="applModal"
            :title="Cooptitle"
            @on-ok="coopOk"
            @on-cancel="coopCancel"
            ok-text="确认添加"
            width="600px"
            >
            <add-coop ref="addCoop"></add-coop>
        </Modal>
    </div>
</template>
<script>
import addCoop from './addCoop';
var qs=require('querystring');
export default {
    data(){
        return{
            applModal:false,
            coopData:{},
            Cooptitle:''
        }
    },
    props:{
        coopCorpData:{
            type:Array
        }
    },
    components:{
        addCoop:addCoop
    },
    mounted(){
        this.$bus.on("emitCoopData",val=>{
            this.coopData=val
        })
    },
    methods:{
        //编辑
        editCoop(id,company,people,tel,explain,tag){
            this.applModal=true;
            let obj={
                Tid:id,
                company:company,
                contactPeople:people,
                tel:tel,
                explain:explain,
                tag:tag.length<1?[]:JSON.parse(tag)
            }
            this.$bus.emit('editCoopData',obj);
            this.Cooptitle='编辑服务商'
        },
        // 新增
        newAdd(){
           this.Cooptitle='增加服务商'
           this.applModal=true;
        },
        // 提交
        coopOk(){
            let url=this.GLOBAL.baseRouter+'task/company/add-cooperation';
            let EUrl=this.GLOBAL.baseRouter+'task/company/edit-cooperation';
            let params={
                id:this.coopData.Tid,
                company_id:this.coopData.Cid,
                contact_people:this.coopData.contactPeople,
                tel:this.coopData.tel,
                demand_id:1,
                description:this.coopData.explain,
                tag:JSON.stringify(this.coopData.tag)
            }
            if(params.id==null){
                // 新增
                this.$axios.post(url,qs.stringify(params)).then(msg=>{
                    if(msg.data.err_code==0){
                        this.$Message.success("添加成功!");
                        this.$bus.emit("succeedCommit");
                        this.$refs.addCoop.clearData();
                    }else{
                        this.$Message.error(msg.data.err_message)
                    }
                })
            }else{
                //  编辑
                this.$axios.post(EUrl,qs.stringify(params)).then(msg=>{
                    if(msg.data.err_code==0){
                        this.$Message.success("添加成功!");
                        this.$bus.emit("succeedCommit");
                        this.$refs.addCoop.clearData();
                    }else{
                        this.$Message.error(msg.data.err_message)
                    }
                })
            }
        },
        // 删除
        deleteCoop(id){
            if(window.confirm('你确定要删除吗？')){
                let url=this.GLOBAL.baseRouter+'task/company/delete-cooperation';
                this.$axios.post(url,qs.stringify({id:id})).then(msg=>{
                    this.$bus.emit("succeedCommit")
                    this.$Message.success("删除成功!");
                },()=>{
                    this.$Message.error("删除失败!")
                })
            }else{
                return
            }

        },
        // 取消
        coopCancel(){
            this.$refs.addCoop.clearData();
        }
    }
}
</script>
