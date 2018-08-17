<template>
    <div class="contDetails">
        <Breadcrumb>
            <BreadcrumbItem @click.native="goBack">合同管理</BreadcrumbItem>
            <BreadcrumbItem>{{contraData.project_name}}</BreadcrumbItem>
        </Breadcrumb>
        <div v-show="enterContract" class="changeRow">
            <Button type="error" @click.native="modification" :disabled="disflag">还需修改</Button>
            <Button type="success" @click.native="confirm" :disabled="disflag">确认无误</Button>
        </div>
        <div class="detailsRow">
            <div class="contractInfo">
                <dl>
                    <dt>合同信息</dt>
                    <dd>
                        <Alert type="warning" show-icon v-show="contraData.status==13">
                            修改说明:
                            <template slot="desc">
                                {{contraData.description}}&nbsp;
                            </template>
                        </Alert>
                        <p>
                            <span>合同名称</span>
                            <em>{{contraData.project_name}}&nbsp;</em>
                        </p>
                        <p>
                            <span>项目总额</span>
                            <em class="price">
                                ￥{{contraData.contract_price}}&nbsp;
                                <i>(首付款支付{{contraData.first_payment}}元,尾款支付{{contraData.last_payment}}元)</i>
                            </em>
                        </p>
                        <p>
                            <span>合同时间</span>
                            <em>{{contraData.start_time}}&nbsp;至&nbsp;{{contraData.end_time}}</em>
                        </p>
                        <p>
                            <span>合同</span>
                            <em v-if='contraData.files!="[]"'>已上传 <s @click="lookContract">{{flag==true?'查看':'隐藏'}}</s></em>
                            <em v-else>未上传</em>
                        </p>
                    </dd>
                    <dt>乙方信息</dt>
                    <dd>
                        <p>
                            <span>公司</span>
                            <em>{{contraData.customer_name}}&nbsp;</em>
                        </p>
                        <p>
                            <span>对接人</span>
                            <em>{{contraData.customer_people}}&nbsp;</em>
                        </p>
                        <p>
                            <span>联系电话</span>
                            <em>{{contraData.customer_phone}}&nbsp;</em>
                        </p>
                    </dd>
                </dl>
            </div>
            <div class="contractSched" >
                <dl>
                    <dt>{{flag==true?'合同进度':'合同详情'}}</dt>
                    <dd>
                        <div v-if="flag">
                            <Timeline>
                                <TimelineItem v-for="(item,index) in contraData.action_record" :key="index">
                                    <span slot="dot" class="ContractIndex">{{index+1}}</span>
                                    <p class="ContractTime">
                                        {{item.status_text}}
                                        <s v-show="item.status==3">({{contraData.first_payment}}元)</s>
                                        <s v-show="item.status==8">({{contraData.last_payment}}元)</s>
                                    </p>
                                    <p class="ContractContent">{{item.action_time}}</p>
                                    <p class="ContractCommit" v-show="index+1==Clength && item.status==3">申请结算首付款</p>
                                    <p class="ContractCommit" v-show="index+1==Clength && item.status==8">申请结算尾款</p>
                                    <div class="clear"></div>
                                </TimelineItem>
                            </Timeline>
                        </div>
                        <div v-else class="lookContract">
                            <div class="contractIndex">
                                <span v-for="(item,index) in filesList" :key="item.name" :class="{selet:index==Cindex}" @click="contractImg(index,item.url)">
                                    <img :src="item.url" :alt="item.name">
                                    第{{index+1}}页
                                </span>
                            </div>
                            <div class="contract">
                                <img :src="imgUrl">
                            </div>
                            <div class="clear"></div>
                        </div>
                    </dd>
                </dl>
            </div>
            <div class="clear"></div>
        </div>
    </div>
</template>
<script>
var qs=require('querystring')
export default {
    data(){
        return{
          contraData:[],
          Clength:null,
          flag:true,
          Cindex:0,
          imgUrl:'',
          filesList:[],
          modifValue:'',
          setStatus:1,
          disflag:false
        }
    },
    computed:{
        contractID(){
            return this.$route.params.id
        },
        enterContract(){
            return this.$store.state.paySkip.enterContractFlag
        }
    },
    mounted(){
        this.detailsData();
        this.autoH();
    },
    methods:{
        autoH(){
            $('.detailsRow>.contractInfo').height($(window).height()-195);
            $('.detailsRow>.contractSched dd').height($(window).height()-267);
            if(this.enterContract){
                $('.changeRow').width($('.single-page-con').width()-20)
            }
        },
        lookContract(){
          this.flag=!this.flag;
        },
        // 更换图片
        contractImg(index,url){
            this.Cindex=index;
            this.imgUrl=url;
        },
        // 修改
        modification(){
            this.disflag=true;
            this.$Modal.confirm({
                title:'修改意见',
                render: (h) => {
                        return h('Input', {
                        props: {
                            value: this.modifValue,
                            autofocus: true,
                            placeholder: '输入需修改详情...',
                        },
                        on: {
                            input: (val) => {
                                this.modifValue = val;
                            }
                        }
                    })
                },
                onOk:()=>{
                    this.setContractStatus()
                },
                onCancel:()=>{
                    this.disflag=false
                }
            })
        },
        // 确认
        confirm(){
            this.disflag=true;
            this.$Modal.confirm({
                    title: '确认合同',
                    content: '<p>确认合同无误?</p>',
                    onCancel:()=>{
                        this.disflag=false;
                    },
                    onOk: () => {
                       let _this=this;
                       let url=_this.GLOBAL.baseRouter+'task/contract/contract-status';
                       let params={
                           contract_id:_this.contractID,
                           action_user:sessionStorage.userId
                       }
                       _this.$Loading.start();
                       _this.$axios.post(url,qs.stringify(params)).then(msg=>{
                           _this.$Loading.finish();
                           _this.$Message.success(msg.data.err_message);
                           if(msg.data.err_code==0){
                               _this.$store.commit('changContractStatus',false);
                           }
                       },()=>{
                           _this.disflag=false;
                           _this.$Loading.error();
                       })
                    }
                });
        },
        // 修改
        setContractStatus(){
            let _this=this;
            _this.$Loading.start();
            let url=_this.GLOBAL.baseRouter+'task/contract/set-contract-status';
            let params={
                contract_id:_this.contractID,
                status:_this.setStatus,
                description:_this.modifValue
            }
            _this.$axios.post(url,qs.stringify(params)).then(msg=>{
                _this.$Loading.finish();
                _this.$Message.success(msg.data.msg);
                if(msg.data.err_code==0){
                    _this.modifValue='';
                    _this.$store.commit('changContractStatus',false);
                    _this.detailsData();
                    }
                },()=>{
                    _this.disflag=false;
                    _this.$Loading.error();
                    _this.$Message.error(msg.data.msg)
                })
        },
        // 回退
        goBack(){
            this.$router.go(-1);
        },
        //获取数据
        detailsData(){
            let _this=this;
            let url=_this.GLOBAL.baseRouter+'task/company/contract-info';
            let params={
                contract_id:_this.contractID
            }
            _this.$Loading.start();
            _this.$axios.post(url,qs.stringify(params)).then(msg=>{
                _this.$Loading.finish();
                if(msg.data.err_code==0){
                    _this.contraData=msg.data;
                    _this.Clength=_this.contraData.action_record.length;
                    if(_this.contraData.files!="[]"){
                        _this.filesList=JSON.parse(_this.contraData.files);
                        _this.imgUrl=_this.filesList[0].url
                    }
                }else{
                   _this.$Message.error(msg.data.err_message) 
                }
            },()=>{
                   _this.$Message.error('请求失败!')
                   _this.$Loading.error();
            })
        }
    }
}
</script>
<style lang="less">
@import '../style/contractDetails.less';
</style>
