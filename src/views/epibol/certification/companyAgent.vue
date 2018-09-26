<template>
    <div style="height: 100%">
        <div class="certificationSealerContainer" v-if="isAttestation">
            <p class="titlePrompt"><i class="icon">!</i>请设定电子合同签章人，电子合同需签章人完成合同最后盖章！</p>
            <div class="formList">
                <div class="title">签章人信息</div>
                <div class="selectBox">

                    <Input @click.native.stop="selectShow = true" v-model="value" style="width: 300px;">
                    <img slot="prepend" v-if="headimage" class="inputHeadImage" :src="headimage"></img>
                    <img slot="prepend" v-else class="inputHeadImage" src="../../../images/leader.png"></img>
                    </Input>
                    <ul class="select" v-show="selectShow">
                        <li v-for="(item,index) in sealerNameList" @click="changeSealer(item)" :key="index">
                            <img v-if="item.headimage" class="headImage" :src="item.headimage"></img>
                            <img v-else class="headImage" src="../../../images/leader.png"></img>
                            <span>&emsp;{{ item.remark_name }}&emsp;({{item.phone || '暂未绑定手机号'}})</span>
                        </li>
                    </ul>

                    <Button class="subButton" type="primary" @click="submit()">保存</Button>

                </div>
            </div>

        </div>
        <h3 v-else style="margin-top: 300px;height: 100%;text-align: center;">请先完成企业认证</h3>
    </div>
</template>

<script>
    import api from 'api'

    export default {
        created() {
        },
        mounted() {

            this.initsealer()
            this.getOperatorList()
            this.$bus.on('attestation', () => {
                this.attestation()
            })


        },

        data() {
            return {
                value: '',
                selectShow: false,
                signer_name: '',
                signer_phone: '',
                headimage: '',
                sealerNameList: [],
                isAttestation: true,
                user_id: null,
            }
        },
        methods: {
            //点击隐藏



            // 经办人列表
            async initsealer() {
                let {data} = await api.getSignerList()
                if(data.err_code === 0&&data.data){
                    this.sealerNameList = data.data
                }

            },
            // 已选择经办人列表
            async getOperatorList(){
                let {data} = await api.getOperatorList()
                if(data.err_code === 0){

                }
            },
            //选择
            changeSealer(item) {
                this.selectShow = false
                this.signer_name = item.remark_name
                this.signer_phone = item.phone
                this.headimage = item.headimage
                this.value = item.phone ? `${item.remark_name}(${item.phone})` : item.remark_name
                this.user_id = item.user_id
            },
            // 保存
            async submit() {
                let {data} = await api.setOperator({
                    operator :this.user_id,
                })
                if (data.err_code === 0) {
                    this.$Message.success(data.err_message);
                    this.getOperatorList()
                } else {
                    this.$Message.error(data.err_message);
                }

            },
            //删除经办人
            async delOperator(){
                let data = await api.delOperator()
                if(data.err_code === 0){
                    this.getOperatorList()
                }
            },
            // 是否认证
            attestation() {
                this.isAttestation = true
            }
        },
        computed: {},
        components: {}
    }
</script>

<style lang="less" scoped>
    .certificationSealerContainer {
        .titlePrompt {
            height: 40px;
            padding-left: 12px;
            line-height: 40px;
            color: #fcc44a;
            background: #fff8eb;
            border-radius: 4px;
            .icon {
                display: inline-block;
                width: 13px;
                height: 13px;
                margin-right: 5px;
                color: #fcc44a;
                border: 1px solid #fcc44a;
                border-radius: 50%;
                text-align: center;
                line-height: 13px;
            }
        }
        .formList {
            display: flex;
            padding: 40px 110px;
            color: #777777;
            .selectBox {
                position: relative;
                max-width: 300px;
                .select {
                    position: absolute;
                    top: 35px;
                    width: 100%;
                    max-height: 400px;
                    overflow-y: auto;
                    border: 1px solid #bdbdbd;
                    border-radius: 3px;
                    background: #fff;
                    z-index: 2;
                    li {
                        &:hover {
                            background: #ccf2ec;
                        }
                    }

                }
            }

            .inputHeadImage {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                vertical-align: middle;
            }
            .headImage {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                vertical-align: middle;
            }
            .title {
                width: 140px;
                height: 32px;
                text-align: center;
                line-height: 32px;
                margin-right: 18px;
                font-size: 14px;
            }

        }
        .subButton {
            margin-top: 30px;
        }
    }

</style>



