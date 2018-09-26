<template>
    <div class="perfect-formation-father">
        <div class="perfect-formation">
            <div class="perfect-formation-head">
                <p class='perfect-formation-title'>完善资料</P>
            </div>
            <div class='perfect-formation-main'>
                <Tabs value="name1" @on-click="getTabs">
                    <TabPane :label="labels" name="name1">
                        <div class='clearfix user-msg-input'>
                            <p class='iconfont icon-loudong'></p>
                            <Input placeholder="您的公司名称" v-model="submitForm.company_name">
                            </Input>
                        </div>
                        <div class='clearfix user-msg-input'>
                            <p class='iconfont icon-ren'></p>
                            <Input placeholder="联系人" v-model="submitForm.name">
                            </Input>
                        </div>
                        <div class='clearfix user-msg-input'>
                            <p class='iconfont icon-lianxifangshi'></p>
                            <Input placeholder="联系电话" v-model="submitForm.tel">
                            </Input>
                        </div>
                        <p class="error-msg" v-if="isError"><span class="iconfont icon-cuowu1"></span>{{errorData}}</p>
                    </TabPane>
                    <TabPane :label="complay" name="name2">
                        <div class='clearfix user-msg-input'>
                            <p class='iconfont icon-loudong'></p>
                            <Input placeholder="您的公司名称" v-model="submitForm.company_name">
                            </Input>
                        </div>
                        <div class='clearfix user-msg-input'>
                            <p class='iconfont icon-ren'></p>
                            <Input placeholder="联系人" v-model="submitForm.name">
                            </Input>
                        </div>
                        <div class='clearfix user-msg-input'>
                            <p class='iconfont icon-lianxifangshi'></p>
                            <Input placeholder="联系电话" v-model="submitForm.tel">
                            </Input>
                        </div>
                        <p class="error-msg" v-if="isError"><span class="iconfont icon-cuowu1"></span>{{errorData}}</p>
                    </TabPane>
                    <TabPane :label="plepeo" name="name3">
                        <!-- <div class='clearfix user-msg-input'>
                           <p class='iconfont icon-loudong'></p>
                          <Input placeholder="输入加入团队公司名称(可选)" v-model="submitForm.company_name">
                          </Input>
                        </div> -->
                        <div class='clearfix user-msg-input'>
                            <p class='iconfont icon-ymy-chang-ren-copy'></p>
                            <Input placeholder="输入姓名" v-model="submitForm.name">
                            </Input>
                        </div>
                        <div class='clearfix user-msg-input'>
                            <p class='iconfont icon-tongji'></p>
                            <Input placeholder="输入您擅长的领域如原画、动作、次时代等" v-model="submitForm.field">
                            </Input>
                        </div>
                        <p class="error-msg" v-if="isError"><span class="iconfont icon-cuowu1"></span>{{errorData}}</p>
                    </TabPane>
                </Tabs>
            </div>
            <div class='perfect-formation-footer' @click="submit">
                <p>保存</p>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapMutations} from 'vuex'
    var qs = require('querystring')
    export default {
        data () {
            return {
                submitForm: {
                    id: null,
                    type: null,
                    company_type: null,
                    company_name: '',
                    name: '',
                    tel: null,
                    field: null,
                },
                tabs: '',
                isError:false,
                errorData : '',
                labels: (h) => {
                    // const that = this
                    return h('div', [
                        h('span', '游戏研发公司'),
                    ])
                },
                complay: (h) => {
                    return h('div', [
                        h('span', '美术外包公司'),
                    ])
                },
                plepeo: (h) => {
                    return h('div', [
                        h('span', '个人艺术家'),
                    ])
                }
            }
        },
        mounted() {
            // this.getUserMsg()
            this.getTabs('name1')
        },
        methods: {
            ...mapMutations(['setIsproject']),
            // 获取点击选项
            getTabs (tabs) {
                // console.log('数据选项', tabs)
                this.getNewList()
                if (tabs == 'name1' || tabs == 'name2') {
                    this.submitForm.type = 'company'
                    if (tabs == 'name1') {
                        this.submitForm.company_type = 1
                    } else {
                        this.submitForm.company_type = 0
                    }
                } else {
                    this.submitForm.type = 'personal'
                }
                this.tabs = tabs
            },
            // 清除数据
            getNewList () {
                this.submitForm = {
                    id: null,
                    type: null,
                    company_type: null,
                    company_name: '',
                    name: '',
                    tel: '',
                    field: null,
                }
                this.isError = false
                this.errorData = ''
            },
            // 完善信息
            submit () {
                const tabs = this.tabs
                const company = this.submitForm.company_name.replace(/\s+/g,"")
                const name = this.submitForm.name.replace(/\s+/g,"")
                const sMobile = this.submitForm.tel.replace(/\s+/g,"")
                if (tabs == 'name1' || tabs == 'name2') {
                    if (!company) {
                        this.isError = true
                        this.errorData = '请输入公司名称'
                        return
                    } else if (!name) {
                        this.isError = true
                        this.errorData = '请输入姓名'
                        return
                    } else if (!sMobile) {
                        this.isError = true
                        this.errorData = '手机号不能为空'
                        return
                    } else if (sMobile) {
                        if (!( /^(1[38][0-9]{9})|(15[89][0-9]{8})$/.test(sMobile))) {
                            this.isError = true
                            this.errorData = '请输入正确的手机号码'
                            return
                        } else {
                            this.isError = false
                            this.errorData = ''
                        }
                    } else {
                        this.isError = false
                        this.errorData = ''
                    }
                } else {
                    if (!name) {
                        this.isError = true
                        this.errorData = '请输入姓名'
                        return
                    } else {
                        this.isError = false
                        this.errorData = ''
                    }
                }
                let url = this.GLOBAL.baseRouter+"system/login/complete-info"
                const userMsgList = JSON.parse(localStorage.userMsg)
                this.submitForm.id = userMsgList.id
                const items = this.submitForm
                this.$axios.post(url, qs.stringify(items)).then(data => {
                    if (!data.data.err_code) {
                        this.$Message.success(data.data.err_message);
                        localStorage.isproject = `false`
                        this.setIsproject()
                        this.getNewList()
                    } else {
                        this.$Message.error(data.data.err_message);
                    }
                    // console.log('提交数据', data.data.err_code)
                }, error =>{
                    this.$Message.success.errorInfo(error);
                })
            }
        }
    }
</script>
<style lang="less">
    .perfect-formation-father{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0,0,0,.3);
        z-index: 9999;
        .perfect-formation{
            position: absolute;
            width: 480px;
            height: 460px;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            background: #fdfdfd;
            z-index: 999;
            border-radius: 10px;
            &-head{
                width: 100%;
                height: 70px;
                background: url('../../images/project.png') no-repeat;
                background-size: 100% 100%;
            }
            &-title{
                width: 100%;
                height: 100%;
                text-align: center;
                line-height: 70px;
                font-size: 18px;
                color: #ffffff;
            }
            &-main{
                width: 100%;
                height: 300px;
                padding: 0 30px;
                background:#fdfdfd;
                .error-msg{
                    color: red;
                    font-size: 16px;
                    height: 35px;
                    line-height: 35px;
                    & span{
                        margin-right: 10px;
                    }
                }
                .user-msg-input{
                    margin-bottom: 20px;
                    &:nth-child(3){
                        margin-bottom: 0;
                    }
                    & p{
                        float:left;
                        width: 45px;
                        height: 45px;
                        border-top-left-radius:4px;
                        border-bottom-left-radius:4px;
                        background: #eef1f2;
                        font-size: 22px;
                        line-height: 45px;
                        text-align:center;
                    }
                    & .ivu-input-type{
                        @msgP: 45px;
                        width:calc(~"100% - @{msgP}");
                        height: 45px;
                        float:left;
                        & .ivu-input{
                            border: 1px solid #eef1f2;
                            color: #bdbdbd;
                            font-size: 14px;
                            text-indent: 1em;
                            box-shadow: none;
                            &::-webkit-input-placeholder {
                                /* WebKit browsers */
                                color: #bdbdbd;
                            }
                            &:-moz-placeholder {
                                /* Mozilla Firefox 4 to 18 */
                                color: #bdbdbd;
                            }
                            &::-moz-placeholder {
                                /* Mozilla Firefox 19+ */
                                color: #bdbdbd;
                            }
                            &:-ms-input-placeholder {
                                /* Internet Explorer 10+ */
                                color: #bdbdbd;
                            }
                            &:focus{
                                border: 1px solid #eef1f2;
                            }
                        }
                        & input{
                            height: 100%;
                            border-top-left-radius: 0;
                            border-bottom-left-radius: 0;
                        }
                    }
                }
                .ivu-tabs-bar{
                    border-bottom: none;
                }
                .ivu-tabs-nav-container{
                    &:focus{
                        .ivu-tabs-tab-focused{
                            border-color: #3bceb6!important;
                        }
                    }
                }
                .ivu-tabs-nav-wrap .ivu-tabs-nav .ivu-tabs-tab-active{
                    color: #3bceb6;
                    border-bottom: none;
                }
                .ivu-tabs-nav{
                    width: 100%;
                    display: flex;
                    border-bottom: none;
                    justify-content: center;
                    align-items: center;
                    .ivu-tabs-tab{
                        padding: 0;
                        height: 60px;
                        // width: 33.333%;
                        // text-align: center;
                        margin-right: 0px;
                        &:nth-child(3) {
                            margin: 0 73px;
                        }
                    }
                    .ivu-tabs-tab-active{
                        & div{
                            height: 50px;
                            border-bottom: 2px solid #3bceb6;
                        }
                        &:before{
                            display:block;
                            content:'';
                            width: 0;
                            height: 0;
                            border-left: 5px solid transparent;
                            border-right: 5px solid transparent;
                            border-top: 5px solid #3bceb6;
                            position: absolute;
                            top: 50px;
                            left: 50%;
                            margin-left: -5px;
                        }
                    }
                    .ivu-tabs-tab:hover {
                        color: #3bceb6;
                    }
                }
            }
            &-footer{
                // width: 100%;
                height: 45px;
                margin:0 20px;
                background: #3bceb6;
                color: #ffffff;
                border-radius: 10px;
                font-size:18px;
                text-align:center;
                line-height: 45px;
                cursor: pointer;
                &:hover{
                    background: rgba(59,206,182, .8);
                }
                & P{
                    width: 100%;
                    height: 100%
                }
            }
        }
    }
</style>

