<template>
    <div class="personalAuthenticationContainer">
        <p>签署电子合同需要您完成身份验证，才能生成有法律效应电子合同</p>
        <section>
            <p>实名认证</p>
            <Form :model="formLeft" label-position="left" :label-width="100">
                <FormItem label="Title">
                    <Input v-model="formLeft.input1"></Input>
                </FormItem>
                <FormItem label="Title name">
                    <Input v-model="formLeft.input2"></Input>
                </FormItem>
                <FormItem label="Aligned title">
                    <Input v-model="formLeft.input3"></Input>
                </FormItem>
                <FormItem label="Aligned title">
                    <Input v-model="formLeft.input3"></Input>
                </FormItem>
                <FormItem label="Aligned title">
                    <Input v-model="formLeft.input3">
                    <span @click="getCode" slot="append">{{codeName}}</span>
                    </Input>
                </FormItem>
            </Form>
        </section>
        <Button @click="submit">完成身份验证</Button>
    </div>
</template>

<script>
    import api from 'api'
    export default {
        created() {
        },
        mounted() {
        },
        data() {
            return {
                formLeft: {
                },
                codeName:'获取验证码',
            }
        },
        methods: {
            getCode(){
                if (this.codeName === '获取验证码') {
                    this.codeName = 200;
                    const timeId = setInterval(() => {
                        this.codeName--
                        if (this.codeName <= 0) {
                            clearInterval(timeId)
                            this.codeName = '获取验证码'
                        }
                    }, 1000)

                }
            },
            submit(){

            }
        },
        computed: {},
        components: {}
    }
</script>

<style scoped>

</style>
