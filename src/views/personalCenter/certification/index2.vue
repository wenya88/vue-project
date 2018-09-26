<template>
    <div class="personalAuthenticationContainer">
        <p>请认真完善电子合同签名资料，才能生成有法律效应电子合同</p>
        <section>
            <p>电子签名资料</p>
            <Form :model="formLeft" label-position="left" :label-width="100">
                <FormItem label="Title">
                    <Select v-model="model1" style="width:200px">
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
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
                    <Input v-model="formLeft.input3"></Input>
                </FormItem>
            </Form>
        </section>
        <Button @click="submit">保存</Button>
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
                cityList: [
                    {
                        value: 'New York',
                        label: 'New York'
                    }
                ],
                model1:'',
                formLeft: {},
                codeName: '获取验证码',
            }
        },
        methods: {

            submit() {

            }
        },
        computed: {},
        components: {}
    }
</script>

<style scoped>

</style>
