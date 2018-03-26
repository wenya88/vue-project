<style>
td.ivu-table-expanded-cell{
	padding: 0 !important;
}
.table_border .ivu-table-wrapper{
	border: 0;
}

</style>
<template>
	<div class="table_border">
		<Content :style="{background: '#fff'}">
			<Table :show-header="false"  :columns="columns8" :data="dataList" size="small" ref="table"></Table>
		</Content>
	</div>
</template>
<script>
	export default {
		data () {
			return {
                columns8: [
                    {
                        width: 50,
                    },
                    {
                        title: "任务名称",
                        key: "name",
                        align: 'center',
                        filters: [
                            {
                                label: '1',
                                value: 1,
                            },
                            {
                                label: '2',
                                value: 2
                            }
                        ],
                        filterMultiple: false,
                        filterMethod(value, row) {
                            if (value === 1) {
                                return row.show > 4000;
                            } else if (value === 2) {
                                return row.show < 4000;
                            }
                        }
                    },
                    {
                        title: "状态",
                        key: "status",
                        align: 'center',
                        width: 90,
                    },
                    {
                        title: "类型",
                        key: "type",
                        align: 'center',
                        filters: [
                            {
                                label: '1',
                                value: 1
                            },
                            {
                                label: '2',
                                value: 2
                            }
                        ],
                        filterMultiple: false,
                        filterMethod(value, row) {
                            if (value === 1) {
                                return row.show > 4000;
                            } else if (value === 2) {
                                return row.show < 4000;
                            }
                        },
                    },
                    {
                        title: "参与/负责人",
                        align: 'center',
                        render: function (h, params) {
                            console.log(params.row.name)
                            return h('div', [
                                h('Avatar', {
                                    props: {
                                        shape: 'circle',
                                        size: 'small',
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    attrs: {
                                        src: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
                                    },
                                }),
                                h('span', {}, params.row.head),
                            ])
                        },
                    },
                    {
                        title: "任务文件",
                        align: 'center',
                    },
                    {
                        title: "进度阶段",
                        sortable: true,
                        align: 'center',
                        width:'300px',
                        render: function (h) {
                            return h('Steps', [
                                h('Step', {
                                    props: {
                                        direction: 'vertical',
                                        size: 'small'
                                    },
                                }),
                                h('Step', {
                                    props: {
                                        size: 'small',
                                        direction: 'vertical',
                                    },
                                }),
                                h('Step', {
                                    props: {
                                        size: 'small',
                                        direction: 'vertical',
                                    },
                                }),
                                h('Step', {
                                    props: {
                                        size: 'small',
                                        direction: 'vertical',
                                    },
                                }),
                                h('Step', {
                                    props: {
                                        size: 'small',
                                        direction: 'vertical',
                                    },
                                })
                            ]);
                        }
                    },
                    {
                        title: "进度比例",
                        align: 'center',
                    },
                    {
                        title: "已进行",
                        align: 'center',
                    },
                    {
                        title: "最近更新",
                        sortable: true,
                        align: 'center',
                    },
                    {
                        title: "到期日",
                        key: "rest_time",
                        sortable: true,
                        align: 'center',
                        width:'100px'
                    },
                    {
                        title: "操作",
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            let cIs = this;
                                            cIs.handleRender = true;
                                            cIs.show(params.index)
                                        }
                                    }
                                }, '编辑'),
                            ]);
                        },
                    },
                ],
                dataList: [
				// {
				// 	state:"实施中",
				// 	name: "架构处理",
				// 	timeremaining: "19%",
				// 	principal: "大大",
				// 	type: "原画",
				// 	cellClassName:{
				// 		state: 'demo-table-info-cell-stateT'
				// 	},
				// },
				// {
				// 	state:"实施中",
				// 	name: "架构处理",
				// 	timeremaining: "19%",
				// 	principal: "大大",
				// 	type: "原画",
				// 	cellClassName:{
				// 		state: 'demo-table-info-cell-state',
				// 	}
				// },
				]
			}
		},
        mounted() {
            this.get();
        },
        methods: {
            /**
             * get请求
             */
            get: function () {
                /*发送请求*/
                var url = gettasklistData;
                var params = {
                    name: ""
                }
                let cIs = this;
                this.$http.get(url, params).then(function (res) {
                    cIs.dataList = res.data.params.list;
                    console.log(res.data);
                }, function (error) {
                });
            },
		},
	}
</script>
