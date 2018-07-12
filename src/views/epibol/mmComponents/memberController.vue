<template>
    <Button type="primary" icon="plus-round" @click="clickButton">添加成员</Button>
</template>

<script>
    export default {
    name:'membercontroller',
    data(){
        return {
        }
    },
    methods:{
        /**
         * 点击按钮
         */
        clickButton(info)
        {
            console.log(info);
        },
    }
}
</script>