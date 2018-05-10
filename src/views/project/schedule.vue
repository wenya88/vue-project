<template>
  <div>
      <!-- 项目进度右侧 -->
      <div class="projectPlanRight">
          <div class="rightTitle">
            <Icon type="android-apps" size="20"></Icon> 子项目进度
          </div>
          <div class="rightRow">
              <div class="line">
                  <div class="title">原画</div>
                  <div class="lineRow"><Progress :percent="25"><span>15/20</span></Progress></div>
                  <div class="clear"></div>
              </div>
          </div>
          <div class="rightTitle" style="border-top:0px;margin-top:15px;">
            <Icon type="android-apps" size="20"></Icon> 成员进度
          </div>
          <div class="rightRow">
                <div class="line">
                  <div class="title">
                    <div class="demo-avatar">
                        <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" size="small"/> 张一山
                    </div>
                   </div>
                  <div class="lineRow"><Progress :percent="25"><span>15/20</span></Progress></div>
                  <div class="clear"></div>
                </div>
          </div>
      </div>
      <!-- 项目进度左侧 -->
      <div class="projectPlanLeft">
        <div class="projectPlanList">
            <Row>
                <Col span="16">
                  <Row>
                    <Col span="6" class="listTitle">
                      <i-circle :percent="80" :trail-width="12" :stroke-width="11" stroke-color="#44aa00">
                          <span class="demo-Circle-inner" style="font-size:24px">80%</span>
                           
                      </i-circle><br/>
                      <span>项目进度</span>
                    </Col>
                    <Col span="18" class="listLine">
                        <div class="line">
                            <div class="title">时间进度</div>
                            <div class="lineRow"><Progress :percent="25" :stroke-width="16"></Progress></div>
                            <div class="clear"></div>
                        </div>
                        <div class="line">
                            <div class="title">即将完成</div>
                            <div class="lineRow"><Progress :percent="35" :stroke-width="16"></Progress></div>
                            <div class="clear"></div>
                        </div>
                        <div class="line">
                            <div class="title">剩余时间</div>
                            <div class="lineRow"><Progress :percent="55" :stroke-width="16"><span>24天</span></Progress></div>
                            <div class="clear"></div>
                        </div>
                    </Col>
                  </Row>
                    
                </Col>
                <Col span="8">
                      <Row>
                          <Col span="12" class="statis">
                                <div class="statisTip">
                                     <span>70%</span><br/>
                                     <em>140/200</em>
                                </div>
                                <div class="statisTitle">
                                  文件进度
                                </div>
                          </Col>
                          <Col span="12" class="statis">
                                <div class="statisTip statisTip2">
                                     <span>3</span><em>个</em>
                                </div>
                                <div class="statisTitle">
                                  实施中任务
                                </div>
                          </Col>
                      </Row>
                </Col>
            </Row>
        </div>
        
        <!-- Echart -->
        <div class="projectEchart">
            Echart 表
        </div>

      </div>
  </div>
</template>
<script>
export default {

}
</script>

<style lang="less">
@import '../../styles/schedule.less';
</style>
