<template>
    <div class="contractBase">
        <!-- BaseInfo -->
        <div class="baseInfo">
            <div class="infoTitle">{{baseData.contract_name}}</div>
            <div class="cost"><span>￥</span>{{baseData.contract_price}}</div>
            <div class="list">
                <dl>
                    <dd>
                        <span>合同关联项目</span>
                        <p class="listP">{{baseData.project_name}}</p>
                    </dd>
                    <dd>
                        <span>项目时间</span>
                        <p class="listP">{{baseData.start_time}} - {{baseData.end_time}}</p>
                    </dd>
                    <dd>
                        <span>项目负责人</span>
                        <p class="listP">{{baseData.manager}}</p>
                    </dd>
                    <dd>
                        <!-- 甲方公司 -->
                        <div class="companyInfo">
                            <p>甲方</p>
                            <p><i class="iconfont icon-loudong"></i> {{baseData.customer_name}}</p>
                            <p><i class="iconfont icon-icon21"></i> 负责人：{{baseData.customer_people}}</p>
                            <p><i class="iconfont icon-lianxifangshi"></i> 联系电话： {{baseData.customer_phone}}</p>
                        </div>
                        <!-- 乙方公司 -->
                        <div class="companyInfo">
                            <p>乙方</p>
                            <p><i class="iconfont icon-loudong"></i> {{baseData.company_name}}</p>
                            <p><i class="iconfont icon-icon21"></i> 负责人：{{baseData.manager}}</p>
                            <p><i class="iconfont icon-lianxifangshi"></i> 联系电话： {{baseData.manage_phone==null?'---':baseData.manage_phone}}</p>
                        </div>
                    </dd>
                </dl>
            </div>
        </div>
        <!-- //BaseInfoEnd -->
        <!-- contractSchedle -->
        <div class="contractSchedle" v-show="contractStatus.length!=0">
            <div class="Flex">
                <div class="schedle">
                    <ul>
                        <li v-for="(item,index) in contractStatus" :key="index">
                            <p  class="Pline"></p>
                            <!-- 偶数 -->
                            <div v-if="index%2==0?true:false">
                                <span :class="[item.action_time==''?'notLine':'']"></span>
                                <em :class="[item.action_time==''?'Sline notSline':'Sline']"></em>
                                <em class="statusInfo">
                                    <em :class="[item.action_time==''?'text blueText':'text']">
                                      <i class="iconfont icon-home_normal"></i>  {{item.key}}
                                    </em>
                                    <p>{{item.action_time}}</p>
                                </em>
                                <div class="clear"></div>
                            </div>
                            <!-- 奇数 -->
                            <div v-if="index%2!=0?true:false" class="leftSatus">
                                <em class="statusInfo">
                                    <em :class="[item.action_time==''?'text blueText':'text']">
                                      <i class="iconfont icon-home_normal"></i>  {{item.key}}
                                    </em>
                                    <p>{{item.action_time}}</p>
                                </em>
                                <em :class="[item.action_time==''?'Sline notSline':'Sline']"></em>
                                <span :class="[item.action_time==''?'notLine':'']"></span>
                                <div class="clear"></div>
                            </div>
                        </li>
                        <p class="Pline"></p>
                    </ul>
                </div>
            </div>
        </div>
        <!-- //contractSchedleEnd -->
        <div class="clear"></div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            baseData:Array,
            contractStatus:Array,
            Iindex:null
        }
    },
    methods:{
        // 组件数据
        moduleData(data){
            this.baseData=data;
            this.contractStatus=data.status_list;          
            let Iindex=null
            for(let i=0;i<this.contractStatus.length;i++){
                if(this.contractStatus[i].status==1){
                    Iindex=i
                }
            }
            this.Iindex=Iindex;
        }
    }
}
</script>

