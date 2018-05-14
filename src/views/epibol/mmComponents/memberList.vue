<template>
    <Table :columns="membercolumns" :data="memberdata"></Table>
</template>
<script>
    export default {
    name:'memberlist',
    data(){
        return {
            membercolumns:[
                {
                    title:'名称',
                    key:'name'
                },
                {
                    title:'用户名',
                    key:'username'
                },
                {
                    title:'手机',
                    key:'phone'
                },
                {
                    title:'邮箱',
                    key:'emai'
                },
                {
                    title:'部门',
                    key:'department'
                },
                {
                    title:'职位',
                    key:'position'
                },
                {
                    title:'操作',
                    key:'operation'
                },
            ],
            memberdata:[
   
            ]
        }
    },
    methods:{
        /**
         * 初始化数据
         */
        initData()
        {
            this.memberdata = [this.initAMemberData(null)];
        },
        initAMemberData(data)
        {
            return {
                name:"李强",
                username:"小强",
                phone:"13912345678",
                emai:"xiaoqiang@qq.com",
                department:"美术一部",
                position:"动作",
            }
        }
    }
}
</script>