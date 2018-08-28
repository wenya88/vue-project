<template>
    <div class="statisics">
        <!-- Menu -->
        <div class="statisics-menu">
            <div class="ivu-div">
                <Menu :open-names="[1]" width="auto" @on-select="selectMenu" active-name="1-0">
                    <Submenu :name="(index+1)" v-for="(item,index) in menuData" :key="index">
                        <template slot="title">
                            <i :class="`iconfont ${item.icon}`"></i>
                            {{item.title}}
                        </template>
                        <MenuGroup>
                            <MenuItem :name="(index+1)+'-'+Kindex" v-for="(kitem,Kindex) in item.Titem" :key="Kindex" style="padding-left:70px">{{kitem.title}}</MenuItem>
                        </MenuGroup>
                    </Submenu>
                </Menu>
            </div>
        </div>
        <!-- //MenuEnd -->
        <!-- statisicsContent -->
        <div class="statisics-content">
            <!-- statisInfo -->
            <div class="statisInfo">
                <!-- inCome -->
                <div class="sIncome">
                    <div class="title">收入</div>
                    <div>
                        <div class="infoMent sPayMent">
                            <i class="iconfont icon-qianbao"></i> 已收款
                            <p>￥83500.00</p>
                        </div>
                        <div class="infoMent sPayAble">
                            <i class="iconfont icon-shoukuan"></i> 待收款
                            <p>￥83500.00</p>
                        </div>
                        <div class="clear"></div>
                    </div>
                </div>
                <div class="sIncome sDisbu">
                    <div class="title">支出</div>
                    <div>
                        <div class="infoMent outPaid">
                            <i class="iconfont icon-qiandai"></i> 已支出
                            <p>￥83500.00</p>
                        </div>
                        <div class="infoMent forPaid">
                            <i class="iconfont icon-zidingyibiaodan-caiwulei_zhichu"></i> 待支出
                            <p>￥83500.00</p>
                        </div>
                        <div class="clear"></div>
                    </div>
                </div>
                <div class="clear"></div>
            </div>
        </div>
        <!-- //statisicsContentEnd -->
        <div class="clear"></div>
    </div>
</template>
<script>
<<<<<<< HEAD
import statisMenu from './statistics/component/statisMenu';
import statisHome from './statistics/component/statisHome';
export default {
    data(){
        return{
           contneComponent:statisHome
        }
    },
    components:{
        statisMenu:statisMenu
=======
    import mainNative from '../main-components/mainNative.vue';
    export default {
        data(){
            return{
                menuData:[
                    {
                        icon:'icon-zhexiantu',
                        title:'统计概况',
                        Titem:[
                            {title:'概况'}
                        ]
                    },
                    {
                        icon:'icon-zhaobiao',
                        title:'投标',
                        Titem:[
                            {title:'中标率'},
                            {title:'落标原因统计'}
                        ]
                    },
                    {
                        icon:'icon-jiaoyi',
                        title:'交易',
                        Titem:[
                            {title:'成交项目'},
                            {title:'交易财务'}
                        ]
                    },
                    {
                        icon:'icon-icon-project',
                        title:'项目',
                        Titem:[
                            {title:'任务资源'},
                            {title:'通过率'}
                        ]
                    },
                    {
                        icon:'icon-tuandui1',
                        title:'团队',
                        Titem:[
                            {title:'团队能力'},
                            {title:'个人能力'},
                            {title:'工时统计'},
                            {title:'任务平均用时'},
                            {title:'类型平均延误用时'},
                            {title:'稿件通过率'}
                        ]
                    }

                ]
            }
        },
        methods:{
            selectMenu(name){
                console.log(name)
            }
        },
        components:{
            mainNative
        }
>>>>>>> 99e33a5c27de4582e665ebacbe23f30a34b69e32
    }
}
</script>
<style lang="less">
    @import './statistics/style/statistics.less';
</style>


