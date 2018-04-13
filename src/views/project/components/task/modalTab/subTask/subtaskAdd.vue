<template>
    <div class="subtaskArea">
        <Progress :percent="45" status="active" style="margin-bottom: 30px"></Progress>
        <Button type="primary" size="small" style="margin-bottom: 10px">增加子任务</Button>
        <Table border :columns="columnsTask" :data="dataList"></Table>
    </div>
</template>

<script>
    export default {
        props:['datl'],
        components: {},
        data() {
            return {
                columnsTask: [
                    {
                        title: '子任务名称',
                        key: 'name',
                        align: 'center',
                    },
                    {
                        title: '进度',
                        key: 'schedule',
                        align: 'center',
                    },
                    {
                        title: '操作',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            // this.remove(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                subtaskData: [
                    {
                        subtaskName: '暂无名称',
                        schedule: '暂无进度',
                    },
                ],
                dataList: []
            }
        },
        methods: {},
        mounted() {

        },
    }
</script>

<style>

</style>