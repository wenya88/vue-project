<template>
    <div class="contractCost">
        <div class="costTitle">价格清单</div>
        <div class="costContent">
             <Table :columns="costHeader" :data="costData"></Table>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            baseData:Array,
            costHeader:[
                {title:'文件类型',key:'fileStyle'},
                {title:'完成时间',key:'time'},
                {title:'单价(个)',key:'cost'},
                {title:'数量',key:'number'},
                {title:'小计',key:'sub'}
            ],
            costData:[]
        }
    },
    methods:{
        // 组件数据
        moduleData(data){
            this.baseData=data;
            
        }
    }
}
</script>

