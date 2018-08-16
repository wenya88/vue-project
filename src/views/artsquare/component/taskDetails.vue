<template>
    <div class="taskDetails">
        <div class="taskImg">
            <img :src="emitDetailsData.picture">
        </div>
        <div class="taskinfo">
            <span>
                测试费用<br/>
                <b>￥{{emitDetailsData.test_price}}</b>
            </span>
            <span>
                项目预计费用<br/>
                ￥{{emitDetailsData.project_min_price}}~￥{{emitDetailsData.project_max_price}}
            </span>
            <span>
                交稿截止<br/>
                {{emitDetailsData.end_time}}
            </span>
            <span>
                已报名公司<br/>
                <b>{{emitDetailsData.join_num}}</b> 家
            </span>
            <div class="clear"></div>
        </div>
        <div class="fileask">
            <p>
                <b>文件要求</b><br/>
                {{emitDetailsData.file_require}}
            </p>
            <p>
                <b>附件</b><br/>
                <em v-for="item in emitDetailsData.file==null?'':JSON.parse(emitDetailsData.file)">
                    {{item.name}}<a :href="item.url" :download="item.name">下载</a>
                </em>
            </p>
            <p>
                 <b>其他说明</b><br/>
                {{emitDetailsData.description}}
            </p>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        emitDetailsData:{
            type:Object
        }
    }
}
</script>
