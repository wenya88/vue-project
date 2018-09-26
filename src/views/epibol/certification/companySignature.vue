<template>
    <div style="height: 100%">
        <div class="electronicSignatureContainer" v-if="isAttestation">
            <p class="titlePrompt"><i class="icon">!</i>请真实准确完善电子签名资料，才能电子合同中生成有法律效应地电子签名！</p>

            <Form class="formList" ref="formData" :model="formLeft" :rules="ruleValidate" label-position="right"
                  :label-width="120">
                <p class="title">企业电子签名资料</p>

                <FormItem label="所在地区" prop="legalArea">
                    <Select v-model="formLeft.legalArea" style="width: 300px">
                        <Option v-for="(item,index) in regionList" :key="index" :value="item.value">{{item.label}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="机构类型" prop="organType">
                    <Select v-model="formLeft.organType" style="width: 300px">
                        <Option v-for="(item,index) in companyTypeList" :key="index" :value="item.value">{{item.label}}
                        </Option>
                    </Select>
                </FormItem>

                <FormItem label="企业名称">
                    <Input v-model="formLeft.name" placeholder="请选择" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="企业注册方式">
                    <Input v-model="formLeft.code" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="注册类型">
                    <RadioGroup v-model="formLeft.radio">
                        <Radio label="male">法人注册</Radio>
                        <Radio label="female">代理人注册</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem>
                    <Input v-model="formLeft.legalName" placeholder="法人姓名/代理人姓名" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="">
                    <Input v-model="formLeft.legalIdno" placeholder="代理人身份证/法人身份证" style="width: 300px"></Input>
                </FormItem>
                <FormItem>
                    <Button @click="submit('formData')" type="primary">保存</Button>
                </FormItem>
            </Form>

        </div>
        <h3 v-else style="margin-top: 300px;height: 100%;text-align: center;">请先完成企业认证</h3>
    </div>
</template>

<script>

    const regionList = [
        {value: 0, label: '大陆'},
        {value: 1, label: '香港'},
        {value: 2, label: '澳门'},
        {value: 3, label: '太晚'},
        {value: 4, label: '外籍'}]

    const companyTypeList = [
        {value: 0, label: '普通企业'},
        {value: 1, label: '社会团体'},
        {value: 2, label: '事业单位'},
        {value: 3, label: '民办非企业单位'},
        {value: 4, label: '党政及国家机构'}]

    import api from 'api'

    export default {
        created() {
            this.initInfo()

        },
        mounted() {
            this.$bus.on('attestation', () => {
                this.attestation()
            })
        },
        data() {
            return {
                regionList: regionList,
                companyTypeList: companyTypeList,
                formLeft: {
                    radio: 'male',
                    name: '',
                    code: '',
                    legalName: '',
                    legalIdno: '',
                    legalArea: 0,
                    organType: 0,
                },
                ruleValidate: {},
                isAttestation: false,
            }
        },
        methods: {
            // 获取信息
            async initInfo() {
                let {data} = await api.getconfirmInfo()
                /*已认证*/
                if (data.err_code === 0 && data.data) {
                    this.attestation()
                    this.isAttestation = true
                    let formData = data.data
                    this.formLeft.name = formData.name
                    this.formLeft.code = formData.code
                    this.formLeft.legalName = formData.legalName
                    this.formLeft.legalIdno = formData.legalIdno
                } else if (data.err_code === 40012) {

                }

            },
            // 提交表单
            submit(name) {
                this.$refs[name].validate(async (valid) => {
                    if (valid) {
                        let {data} = await api.getCompanyAccount({
                            organType: this.formLeft.organType,
                            legalArea: this.formLeft.legalArea
                        })
                    } else {
                        this.$Message.error('请填写正确的信息!');
                    }
                })
            },
            attestation() {
                this.isAttestation = true
            }
        },
        computed: {},
        components: {}
    }
</script>

<style lang="less" scoped>
    .electronicSignatureContainer {
        height: 100%;
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
            padding: 40px 110px;
            color: #777777;
            .title {
                margin-bottom: 35px;
                font-size: 16px;

            }

        }

    }
</style>
<style lang="less">
    .electronicSignatureContainer {
        .formList {
            .ivu-form-item-label {
                color: #bdbdbd;
            }

            .ivu-radio-inner:after {
                background: #3bceb6;
            }
        }

    }
</style>
