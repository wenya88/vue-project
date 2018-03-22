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
			<Table :show-header="false"  :columns="columns8" :data="data7" size="small" ref="table"></Table>
		</Content>
	</div>
</template>
<script>
	export default {
		data () {
			return {
				columns8: [
				{
					title: "",
					width: 49,
				},
				{
					title: "任务名称",
					key: "name",
					align: 'center',
				},
				{
					title: "状态",
					key: "state",
					width: 80,
					align: 'center',

				},
				{
					title: "类型",
					key: "type",
					align: 'center',
				},
				{
					title: "进度",
					align: 'center',
					render: (h) =>{
						return h('Steps',[
							h('Step', {
								props: {
									size:"small",
									direction:'vertical',
								},
							}),
							h('Step', {
								props: {
									size: 'small',
									direction:'vertical',
								},
							}),
							h('Step', {
								props: {
									size: 'small',
									direction:'vertical',
								},
							}),h('Step', {
								props: {
									size: 'small',
									direction:'vertical',
								},
							}),
							h('Step', {
								props: {
									size: 'small',
									direction:'vertical',
								},
							})
							]);
					}
				},
				{
					title: "剩余时间",
					key: "timeremaining",
					align: 'center',
				},
				{
					title: "参与/负责人",
					key: "principal",
					align: 'center',
					render: function (h) {
						return h('div', [
							h('Avatar', {
								props: {
									shape:'circle',
									size:'small',
								},
								style: {
									marginRight: '5px'
								},
								attrs: {
									src:'https://i.loli.net/2017/08/21/599a521472424.jpg',
								},
							}),
							h('span', {
								style: {
									marginRight: '15px'
								},
							},'大大'),   
							h('Avatar', {
								props: {
									shape:'circle',
									size:'small',
								},
								style: {
									marginRight: '5px'
								},
								attrs: {
									src:'https://i.loli.net/2017/08/21/599a521472424.jpg',
								},
							}),
							h('span', {
							},'小小'),


							])

					},
				}
				],
				data7: [
				{
					state:"实施中",
					name: "架构处理",
					timeremaining: "19%",
					principal: "大大",
					type: "原画",
					cellClassName:{
						state: 'demo-table-info-cell-stateT'
					},
				},  
				{
					state:"实施中",
					name: "架构处理",
					timeremaining: "19%",
					principal: "大大",
					type: "原画",
					cellClassName:{
						state: 'demo-table-info-cell-state',
					}
				},  		
				]
			}
		},
	}
</script>
