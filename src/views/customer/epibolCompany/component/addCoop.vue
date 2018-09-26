<template>
    <div class="addCoop">
        <dl>
            <dt>公司名称</dt>
            <dd>
                <Input v-model="company" placeholder="输入公司名称" style="width:98%" @keyup.13.native="searchCompany($event)" @on-blur="searchCompany">
                    <Button slot="append" icon="ios-search" @click.native="searchCompany"></Button>
                </Input>
                <div class="demo-spin-col" v-if="upload">
                    <Spin fix>加载中...</Spin>
                </div>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>联系人</dt>
            <dd>
                <Input v-model="contactPeople" style="width: 98%"></Input>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>联系电话</dt>
            <dd>
                <Input v-model="tel" style="width: 98%"></Input>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>擅长领域</dt>
            <dd>
                <Tag v-for="item in count" :key="item" :name="item" closable @on-close="Closelabel">{{ item }}</Tag>
                    <Button icon="ios-plus-empty" type="dashed" size="small" @click.stop="Addlabel">
                        增加
                        <div class="addLabel" v-show="addLabDIV">
                            <Input v-model="LabelVal" placeholder="请输入标签" style="width: 100px;" @keyup.13.native="submitLabel($event)" :autofocus="labelFocus"></Input>
                            <Button type="primary" size="small" @click.native.stop="submitLabel">添加</Button>&nbsp;
                            <Button size="small" @click.stop="closeAddDIV">取消</Button>
                        </div>
                    </Button>
            </dd>
            <div class="clear"></div>
        </dl>
        <dl>
            <dt>备注说明</dt>
            <dd>
                <Input v-model="explain" type="textarea" placeholder="备注说明.." style="width:98%"></Input>
            </dd>
            <div class="clear"></div>
        </dl>
    </div>
</template>
<script>
var qs=require('querystring');
export default {
    data(){
        return{
            Cid:null,
            company:null,
            contactPeople:'',
            tel:'',
            explain:'',
            spinShow:true,
            upload:false,
            addLabDIV:false,
            LabelVal:'',
            count:[],
            Tid:null,
            labelFocus:false
        }
    },
    mounted(){
        this.$bus.on('editCoopData',(val)=>{
            this.Tid=val.Tid;
            this.company=val.company;
            this.contactPeople=val.contactPeople;
            this.tel=val.tel;
            this.explain=val.explain;
            this.count=val.tag;
        })
    },
    methods:{
        // 添加标签
        Addlabel () {
            this.addLabDIV=true;
            this.LabelVal=''
            this.labelFocus=true;
        },
        submitLabel(e){
            if(this.LabelVal==''){
                this.$Message.warning('不能为空')
                return
            }
            this.count.push(this.LabelVal);
            this.addLabDIV=false;
        },
        closeAddDIV(){
            this.addLabDIV=false;
        },
        // 删除标签
        Closelabel (event, name) {
                const index = this.count.indexOf(name);
                this.count.splice(index, 1);
        },
        // 清空数据
        clearData(){
            this.Cid=null;
            this.company=null;
            this.contactPeople='';
            this.tel='';
            this.count=[];
            this.explain='';
        },
        editCoop(){
            let obj={
                Tid:this.Tid,
                Cid:this.Cid,
                company:this.company,
                contactPeople:this.contactPeople,
                tel:this.tel,
                explain:this.explain,
                tag:this.count
            }
            this.$bus.emit('emitCoopData',obj)
        },
        // 搜索公司
        searchCompany(e){
            let url=this.GLOBAL.baseRouter+'task/company/search-company';
            let params={
                company_name:this.company
            }
            if(this.company==null||this.company==""){
                return
            }
            this.upload=!this.upload;
            this.$axios.post(url,qs.stringify(params)).then(msg=>{
                this.upload=!this.upload;
                let msgData=msg.data;
                if(msgData.company==undefined){
                    this.$Message.error('公司名称不正确!')
                }else{
                    this.Cid=msgData.id;
                    this.company=msgData.company;
                    this.contactPeople=msgData.contact_people;
                    this.tel=msgData.tel;
                }
            })
        }
    },
    updated(){
        this.editCoop()
    }
}
</script>
