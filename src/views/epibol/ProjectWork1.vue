<template>
   <div class="page_group_all">
      <Row class="page_group_row">
        <Col span='16' class="group_left">
           <div class="group_header">
              <div class="group_head_left">
                 <p class="group_obj_num">{{groupNum}}</p>
                 <p class="group_obj_msg">我负责项目</p>
              </div>
              <div class="group_head_right">
                 <div class="group_rank">
                    <p class="group_rank_num">2</p>
                    <p class="group_rank_title">今天结束</p>
                 </div>
                  <div class="group_rank">
                    <p class="group_rank_num">2</p>
                    <p class="group_rank_title">已延期</p>
                 </div>
                  <div class="group_rank">
                    <p class="group_rank_num">8</p>
                    <p class="group_rank_title">关注任务</p>
                 </div>
                  <div class="group_rank">
                    <p class="group_rank_num">0</p>
                    <p class="group_rank_title">待审核</p>
                 </div>
                  <div class="group_rank">
                    <p class="group_rank_num">0</p>
                    <p class="group_rank_title">已反馈</p>
                 </div>
              </div>
           </div>
           <div class="group_left_main">
              <div class="group_main_msg">
                 <p class="group_head_title">奇迹MU</p>
                 <span :class="`open_botton iconfont ${icon}`" @click="getClose"></span>
                 <div class="close_box" v-if="!isOpen">
                   <div class="close_box_child">
                     <div class="close_box_left">
                       <Progress :percent="60" :stroke-width="7" hide-info status="success">
                       </Progress>
                     </div>
                     <div class="close_box_right">
                       <p class="close_popress_msg">进度</p>
                       <p class="close_popress_num"><span>16</span>/<span>20</span></p>
                     </div>
                   </div>
                   <div class="close_box_child">
                     <div class="close_box_left">
                       <Progress :percent="80" :stroke-width="10" hide-info status="success">
                       </Progress>
                     </div>
                     <div class="close_box_right">
                       <p class="close_popress_msg">时间</p>
                       <p class="close_popress_num">80%</p>
                     </div>
                   </div>
                 </div>
                 <!-- 展开box -->
                 <div class="open_box" v-if="isOpen">
                  <div class="group_progress">
                    <Tooltip max-width="200" content="123455" class="group_color_block">
                    </Tooltip>
                  </div>
                  <div class="project_all">
                    <Col class="project_name" span= '6'>
                      <p class="title_name">项目时间</p>
                      <p class="msg_name">30个工作日</p>
                      <p class="msg_name">2018/11/5~2018/12/6</p>
                    </Col>
                    <Col class="complany_name" span= '6'>
                      <p class="title_name">甲方公司</p>
                      <p class="msg_name">成都义美游有限公司</p>
                      <p class="cpy_person">李晓明</p>
                    </Col>
                    <Col class="tem_person" span= '12'>
                      <p class="title_name">参与成员</p>
                      <p class="msg_name"><span class="people_name">李晓明</span><span class="people_name" >王大锤</span></p>
                    </Col>
                  </div>
                  <div class="propress_box">
                    <P class="propress_surplus">剩余<span class="propress_surplus_time">5</span>个工作日</p>
                    <Progress :percent="25" hide-info :stroke-width="5" status="success"/>
                  </div>
               </div>
               <!-- 展开样式结束 -->
            </div>
           </div>
        </Col>
        <Col span='8' class="tables_all_father">
         <div class="tables_all">
            <Tabs value="name1">
              <TabPane :label="label" name="name1">
                <div class="task_msg_bx">
                  <p>你好</p>
                </div>
              </TabPane>
              <TabPane label="已延期" name="name2">已延期</TabPane>
              <TabPane label="关注" name="name3">关注</TabPane>
              <TabPane label="待审核" name="name4">待审核</TabPane>
              <TabPane label="已反馈" name="name5">已反馈</TabPane>
              <TabPane label="未分配" name="name6">未分配</TabPane>
            </Tabs>
         </div>
        </Col>
      </Row>
   </div>
</template>
<script>
var qs = require('querystring')
export default {
  data () {
    return {
      isOpen: false,
      groupList: [],
      groupNum: 0,
      icon: 'icon-fangxiangxia',
      label: (h) => {
        return h('div', [
          h('span', '标签一'),
          h('Badge', {
            props: {
              count: 3
            }
          })
        ])
      }
    }
  },
  mounted () {
    this.getGroup()
  },
  methods:{
    // 关闭按钮
    getClose () {
      const isOpen = !this.isOpen
      if (isOpen) {
        this.icon = 'icon-fangxiangshang'
      } else {
        this.icon = 'icon-fangxiangxia'
      }
      this.isOpen = isOpen
    },
    // 获取组长数据
    getGroup () {
      const url = this.GLOBAL.baseRouter+"/task/working-place/headman-wp"
      const items = {
      }
      this.$axios.post(url, qs.stringify(items)).then(data => {
        if (!data.data.err_code) {
          const list = data.data.data
          list.end_time.split(' ')[0]
          list.start_time.split(' ')[0]
          this.groupNum = list.length
          this.groupList = list
          // console.log('用户数据', data)
        } else {
          this.$Message.error('请求错误')
        }
      }, error => {
        console.log('错误', error)
      })
    }
  }
}
</script>
<style lang="less">
   @import './project.less';
</style>
