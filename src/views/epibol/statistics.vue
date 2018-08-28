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
    }
}
</script>
<style lang="less">
    @import './statistics/style/statistics.less';
</style>


