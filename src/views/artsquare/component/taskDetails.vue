<template>
    <div class="taskDetails">
        <dl>
            <dt>基本信息</dt>
            <dd v-if="emitDetailsData.test_price"><span>测试费用</span><em> <i>￥</i>{{emitDetailsData.test_price}} <i>元</i> </em></dd>
            <dd v-else><span>测试费用</span><em> 服务商报价 </em></dd>
            <dd><span>项目总额</span><em><i>￥</i>{{emitDetailsData.project_max_price}} <i>元</i></em></dd>
            <dd><span>报名截止</span><em>{{emitDetailsData.bid_end_time}}</em></dd>
            <dd><span>交稿截止</span><em>{{emitDetailsData.end_time}}</em></dd>
            <dd><span>已报名公司</span><em><i style="color: #3bceb6;font-size: 14px">{{emitDetailsData.join_num}}</i> 家</em></dd>
            <dt>交稿要求</dt>
            <dd>
                <span v-if="emitDetailsData.file_require">{{emitDetailsData.file_require}}</span>
                <span v-else>暂无</span>
            </dd>
            <dt>参考附件</dt>
            <dd>
                <ol v-if="uploadFile.length>0">
                    <li v-for="item in uploadFile">
                        {{item.name}}
                        <a :href="JSON.parse(item.response).file_url" :download="item.name" target="_blank"><i class="icon iconfont icon-xiazai"></i></a>
                    </li>
                </ol>
                <span v-else>暂无</span>
            </dd>
            <dt>其它要求</dt>
            <dd>
                <span v-if="emitDetailsData.description">{{emitDetailsData.description}}</span>
                <span v-else>暂无</span>
            </dd>
        </dl>
    </div>
</template>
<script>
import '../style/font/iconfont.css'
export default {
    props:{
        emitDetailsData:{
            type:Object,
            default:{}
        }
    },
    computed:{
        uploadFile(){
            return this.emitDetailsData.file ? JSON.parse(this.emitDetailsData.file) : []
        }
    }
}
</script>
<style lang="less" scoped>
    .taskDetails{
        padding: 30px 0;
        dl{
            dt{
                font-size: 16px;
                margin: 10px 0 10px 0;
            }
            dd{
                padding: 8px 0;
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                span{
                    color: #9c9c9c;
                }
                em{
                    font-style: normal;
                    i{
                        font-style: normal;
                        font-size: 12px;
                        color: #b1b0b0;
                    }
                }
                ul{
                    list-style: inside;
                    list-style-type: decimal;
                    color: #9c9c9c;
                    li{
                        padding: 4px 0;
                    }
                }
                ol{
                    li{
                        color: #9c9c9c;
                        a{
                            color: #3bceb6;
                            margin-left: 100px;
                        }
                    }
                }
            }
        }
    }
</style>
