<style>
    .SuvCont .headerTitle{border-bottom:1px solid #d7dde4;padding-bottom:5px;}
    .SuvCont .headerTitle h2,h5{line-height:26px;}
    .SuvCont .headerTitle h2 span{margin-left:20px;font-size:14px;font-weight:normal;}
    .SuvCont .headerTitle h5{margin-top:5px;font-weight:normal;}
    .SuvCont .more{text-align:right;padding-right:5px;}
    .SuvCont .SuvCont{padding-top:10px;}
    .SuvCont a{font-size:12px;}
    .SuvCont .rowColumn{margin:20px 0px;}
    .SuvCont .rowColumn>.column dt span{margin-left:5px;}
    .SuvCont .rowColumn>.column{width:49%;float:left;}
    .SuvCont .rowColumn>.column:nth-of-type(2){width:49%;float:right;}
    .SuvCont .rowColumn>.column dt{font-size:130%;}
    .SuvCont .rowColumn>.column dt>.more{font-style:normal;float:right;}
    .SuvCont .rowColumn>.column dd{margin-top:15px;width:100%;}
    .SuvCont .rowColumn>.column dd>.div{float:left;width:40%;}
    .SuvCont .rowColumn>.column dd>.div:nth-of-type(2){width:60%;}
    .SuvCont .rowColumn>.column .border{border:1px solid #d7dde4;}
    .SuvCont .rowColumn>.column .padding{padding:20px;}
    .SuvCont .rowColumn>.column .padding span{width:15%;text-align:left;display:inline-block;}
    .SuvCont .rowColumn>.column .padding span:nth-of-type(2){width:45%;}
    .SuvCont .rowColumn>.column .padding span:nth-of-type(3){width:20%;}
    .SuvCont .rowColumn>.column .padding span:nth-of-type(4){width:15%;text-align:left;padding-left:10px;}
    .SuvCont .rowColumn>.column .padding span img{width:20px;height:20px;border-radius:100%;float:left;margin-right:6px;margin-top:-3px;}
    .SuvCont .rowColumn>.column .padding span i{font-style:normal;width: 70%;text-align:center;background:#ededed;display:inline-block;border-radius:6px;padding:0px;}
    .SuvCont .rowColumn>.column .padding .time{color:darkorange;}
    .SuvCont .rowColumn>.column .inside span em{font-style:normal;color:#888;margin-left:10px;}
    .SuvCont .rowColumn>.column .inside span{width:20%;}
    .SuvCont .rowColumn>.column .inside span:nth-of-type(2){width:65%;}
    .SuvCont .rowColumn>.column .inside span:nth-of-type(3){width:10%;padding-left:10px;}
    .clear{clear:both;}
</style>
<template>
    <div class="SuvCont">
        <Row class="headerTitle">
            <i-col span="22">
                    <h2>新双无战意外包项目 <span>负责人：李哥</span></h2>
                    <h5>2018-3-24  至  2018-4-25</h5>
            </i-col>
            <i-col span="2" class="more"><a href="#"><Icon type="android-more-vertical" size="30"></Icon></a></i-col>
        </Row>
        <div class="rowColumn">
            <div class="column">
                <dl>
                    <dt><Icon type="podium"></Icon><span>项目进度</span></dt>
                    <dd class="border">
                        <div class="div"><Eann></Eann></div>
                        <div class="div"><Epie></Epie></div>
                        <div class="clear"></div>
                    </dd>
                </dl>
            </div>
            <div class="column">
                <Calend></Calend>
            </div>
            <div class="clear"></div>
        </div>
        <div class="rowColumn">
            <div class="column">
                <dl>
                    <dt><Icon type="compose"></Icon><span>客户已反馈</span><em class="more"><a href="#">查看全部</a></em></dt>
                    <dd class="border padding">
                        <Timeline>
                            <Timeline-item color="darkorange">
                                <Icon type="record" slot="dot"></Icon>
                                <span class="time">3小时前</span>
                                <span>美国队长模型</span>
                                <span><i>15处修改</i></span>
                                <span><img src="https://i.loli.net/2017/08/21/599a521472424.jpg">罗一一</span>
                            </Timeline-item>
                            <Timeline-item color="gainsboro">
                                <Icon type="record" slot="dot"></Icon>
                                <span class="time">1天前</span>
                                <span>美国队长模型</span>
                                <span><i>7处修改</i></span>
                                <span><img src="https://i.loli.net/2017/08/21/599a521472424.jpg">罗一一</span>
                            </Timeline-item>
                            <Timeline-item color="gainsboro">
                                <Icon type="record" slot="dot"></Icon>
                                <span class="time">3天前</span>
                                <span>美国队长模型</span>
                                <span><i>5处修改</i></span>
                                <span><img src="https://i.loli.net/2017/08/21/599a521472424.jpg">罗一一</span>
                            </Timeline-item>
                            <Timeline-item color="gainsboro">
                                <Icon type="record" slot="dot"></Icon>
                                <span class="time">5天前</span>
                                <span>美国队长模型</span>
                                <span><i>11处修改</i></span>
                                <span><img src="https://i.loli.net/2017/08/21/599a521472424.jpg">罗一一</span>
                            </Timeline-item>
                            <Timeline-item color="gainsboro">
                                <Icon type="record" slot="dot"></Icon>
                                <span class="time">7天前</span>
                                <span>美国队长模型</span>
                                <span><i>1处修改</i></span>
                                <span><img src="https://i.loli.net/2017/08/21/599a521472424.jpg">罗一一</span>
                            </Timeline-item>
                        </Timeline>
                    </dd>
                </dl>
            </div>
            <div class="column">
                <dl>
                    <dt><Icon type="android-clipboard"></Icon><span>内部待审</span><em class="more"><a href="#">查看全部</a></em></dt>
                    <dd class="border padding inside">
                        <Timeline>
                            <Timeline-item color="darkorange">
                                <Icon type="record" slot="dot"></Icon>
                                <span class="time">3小时前 <em>上传</em></span>
                                <span>美国队长模型</span>
                                <span><img src="https://i.loli.net/2017/08/21/599a521472424.jpg">罗一一</span>
                            </Timeline-item>
                            <Timeline-item color="gainsboro">
                                <Icon type="record" slot="dot"></Icon>
                                <span class="time">1天前 <em>上传</em></span>
                                <span>美国队长模型</span>
                                <span><img src="https://i.loli.net/2017/08/21/599a521472424.jpg">罗一一</span>
                            </Timeline-item>
                            <Timeline-item color="gainsboro">
                                <Icon type="record" slot="dot"></Icon>
                                <span class="time">3天前 <em>上传</em></span>
                                <span>美国队长模型</span>
                                <span><img src="https://i.loli.net/2017/08/21/599a521472424.jpg">罗一一</span>
                            </Timeline-item>
                            <Timeline-item color="gainsboro">
                                <Icon type="record" slot="dot"></Icon>
                                <span class="time">5天前 <em>上传</em></span>
                                <span>美国队长模型</span>
                                <span><img src="https://i.loli.net/2017/08/21/599a521472424.jpg">罗一一</span>
                            </Timeline-item>
                            <Timeline-item color="gainsboro">
                                <Icon type="record" slot="dot"></Icon>
                                <span class="time">7天前 <em>上传</em></span>
                                <span>美国队长模型</span>
                                <span><img src="https://i.loli.net/2017/08/21/599a521472424.jpg">罗一一</span>
                            </Timeline-item>
                        </Timeline>
                    </dd>
                </dl>
            </div>
            <div class="clear"></div>
        </div>
    </div>
</template>

<script>
  import Row from '../../../../node_modules/iview/src/components/grid/row'
  import ICol from '../../../../node_modules/iview/src/components/grid/col'
  import Epie from './surveyCom/echartPie.vue'
  import Eann from './surveyCom/echartAnn.vue'
  import Calend from '../page1/calend.vue'
  export default {
    components: {ICol, Row,Epie,Eann,Calend},


  };
</script>