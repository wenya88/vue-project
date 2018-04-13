<template>
    <!--<Row align="left" class="advanced-router" v-on:init="init">-->
        <!--<Table :columns="orderColumns" :data="memberdate" style="width: 100%;"></Table>-->
    <div>
        <Table :columns="orderColumns" :data="memberdate" @on-row-click="clickItem" ></Table>
    </div>
    <!--</Row>-->
</template>
<script>
    export default {
        props:{
            pageType:0,//列表筛选类型
        },
        data() {
            return {
                orderColumns: [
                    {
                        title: '姓名',
                        key: 'name'
                    },
                    {
                        title: '账号',
                        key: 'account'
                    },
                    {
                        title: '手机',
                        key: 'phone'
                    },
                    {
                        title: '类型',
                        key: 'worktype'
                    }
                ],
                data1: [
                    {
                        name: 'John Brown',
                        account: 18,
                        phone: 'New York No. 1 Lake Park',
                        worktype: '2016-10-03'
                    },
                ],
                memberdate:[]
            }
        },
        computed:{
            updateDatePage(memberType)
            {

            },
            /**
             * 初始化数据
             */
            initData()
            {
                let order = {
                name: "ztq",
                account: "buyer",
                phone: "13912345678",
                worktype: "model",
                };
                this.memberdate = [order];
                console.log("ddddd");
            }
        },
        methods:{
            init()
            {
                let order = {
                name: "ztq",
                account: "buyer",
                phone: "13912345678",
                worktype: "model",
                };
                this.memberdate = [order];
                console.log("bbbbb");
            },
            /**
             * 点击列表项
             */
            clickItem(itemName)
            {
                console.log(itemName);
            }
        }
    }
</script>
