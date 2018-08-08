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
                    <p class="group_rank_num">{{taskAllwangs.endNow.length}}</p>
                    <p class="group_rank_title">今天结束</p>
                 </div>
                  <div class="group_rank">
                    <p class="group_rank_num">{{taskAllwangs.delay.length}}</p>
                    <p class="group_rank_title">已延期</p>
                 </div>
                  <div class="group_rank">
                    <p class="group_rank_num">8</p>
                    <p class="group_rank_title">关注任务</p>
                 </div>
                  <div class="group_rank">
                    <p class="group_rank_num">{{taskAllwangs.examine.length}}</p>
                    <p class="group_rank_title">待审核</p>
                 </div>
                  <div class="group_rank">
                    <p class="group_rank_num">{{taskAllwangs.backList.length}}</p>
                    <p class="group_rank_title">已反馈</p>
                 </div>
              </div>
           </div>
           <div class="group_left_main">
              <div v-for='(item, index) in groupList' :class="`group_main_msg ${item.backGoup}`" :key='index' @click="getTask(index)">
                 <span class="group_head_title" @click="goHome(item.project_id)">{{item.project_name}}</span>
                 <span :class="`open_botton iconfont ${item.icon}`" @click="getClose(index)"></span>
                 <div class="close_box" v-if="!item.isOpen">
                   <div class="close_box_child">
                     <div class="close_box_left">
                       <Progress :percent="item.speed" :stroke-width="7" hide-info status="success">
                       </Progress>
                     </div>
                     <div class="close_box_right">
                       <p class="close_popress_msg">进度</p>
                       <p class="close_popress_num"><span>{{item.upload_file}}</span>/<span>{{item.peroject_file}}</span></p>
                     </div>
                   </div>
                   <div class="close_box_child">
                     <div class="close_box_left">
                       <Progress :percent="item.work_now" :stroke-width="10" hide-info status="success">
                       </Progress>
                     </div>
                     <div class="close_box_right">
                       <p class="close_popress_msg">时间</p>
                       <p class="close_popress_num">{{item.work_now}}%</p>
                     </div>
                   </div>
                 </div>
                 <!-- 展开box -->
                 <div class="open_box" v-if="item.isOpen">
                  <div class="group_progress">
                    <Tooltip  content="内部待审" class="group_color_block" :style="`width:${item.trialNum};background: rgb(0,204,0);`" v-if="item.tria">
                    </Tooltip>
                     <Tooltip content="内部已反馈" class="group_color_block" :style="`width:${item.fbackNum};background: rgb(255,153,0);`" v-if="item.fback">
                    </Tooltip>
                     <Tooltip content="客户等待" class="group_color_block" :style="`width:${item.cwaitNum};background: rgb(174,174,174);`" v-if="item.cwait">
                    </Tooltip>
                     <Tooltip content="客户已反馈" class="group_color_block" :style="`width:${item.cbackNum};background: rgb(255,0,0);`" v-if="item.cback">
                    </Tooltip>
                  </div>
                  <div class="project_all">
                    <Col class="project_name" span= '6'>
                      <p class="title_name">项目时间</p>
                      <p class="msg_name">{{item.workDay}}个工作日</p>
                      <p class="msg_name">{{item.start_time}}~{{item.end_time}}</p>
                    </Col>
                    <Col class="complany_name" span= '6'>
                      <p class="title_name">甲方公司</p>
                      <p class="msg_name">{{item.company.name}}</p>
                      <p class="cpy_person">{{item.company.legal}}</p>
                    </Col>
                    <Col class="tem_person" span= '12'>
                      <p class="title_name">参与成员</p>
                      <p class="msg_name"><span class="people_name" v-for='(items, idx) in item.person' :key='idx'>{{items}}</span></p>
                    </Col>
                  </div>
                  <div class="propress_box">
                    <P class="propress_surplus" v-if="item.Surplus > 0">剩余<span class="propress_surplus_time">{{item.Surplus}}</span>个工作日</p>
                    <p class="propress_surplus" v-if="item.Surplus < 0">延期</p>
                    <Progress :percent="item.work_now" hide-info :stroke-width="5" status="success"/>
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
               <project-task :list="taskChild.endNow"></project-task>
              </TabPane>
              <TabPane :label="delayLabel" name="name2">
                 <project-task :list="taskChild.delay"></project-task>
              </TabPane>
              <TabPane label="关注" name="name3">关注</TabPane>
              <TabPane :label="examineLabel" name="name4">
                 <project-task :list="taskChild.examine"></project-task>
              </TabPane>
              <TabPane :label="backLabel" name="name5">
                 <project-task :list="taskChild.backList"></project-task>
              </TabPane>
              <TabPane :label="distLabel" name="name6">
                 <project-task :list="taskChild.distList"></project-task>
              </TabPane>
            </Tabs>
         </div>
        </Col>
      </Row>
   </div>
</template>
<script>
var qs = require('querystring')
import projectTask from './ProjectChild.vue'
export default {
  data () {
    return {
      groupList: [],
      groupNum: 0,
      taskAllwangs: {
        endNow: [],
        delay: [],
        examine: [],
        backList: []
      },
      taskChild: {
        endNow: [],
        delay: [],
        examine: [],
        backList: [],
        distList: []
      },
      label: (h) => {
        // const that = this
        return h('div', [
          h('span', '今天结束'),
          h('Badge', {
            props: {
              count: this.taskChild.endNow.length
            }
          })
        ])
      },
      delayLabel: (h) => {
        return h('div', [
          h('span', '已延迟'),
          h('Badge', {
            props: {
              count: this.taskChild.delay.length
            }
          })
        ])
      },
      examineLabel: (h) => {
        return h('div', [
          h('span', '待审核'),
          h('Badge', {
            props: {
              count: this.taskChild.examine.length
            }
          })
        ])
      },
      backLabel: (h) => {
        return h('div', [
          h('span', '已反馈'),
          h('Badge', {
            props: {
              count: this.taskChild.backList.length
            }
          })
        ])
      },
      distLabel: (h) => {
        
        return h('div', [
          h('span', '未分配'),
          h('Badge', {
            props: {
              count: this.taskChild.distList.length
            }
          })
        ])
      }
    }
  },
  components: {
    projectTask
  },
  created () {
    this.getGroup()
  },
  mounted () {
  //  this.getTask(0)
  },
  methods:{
    // 关闭按钮
    getClose (index) {
      const list = this.groupList
      const isOpen = !list[index].isOpen
      if (isOpen) {
        list[index].icon = 'icon-fangxiangshang'
      } else {
        list[index].icon = 'icon-fangxiangxia'
      }
        list[index].isOpen = isOpen
    },
    // 获取组长数据
    getGroup () {
      const url = this.GLOBAL.baseRouter+"/task/working-place/headman-wp"
      const items = {
      }
      this.$axios.post(url, qs.stringify(items)).then(data => {
        console.log('数据', data.data.data)
        if (!data.data.err_code) {
          const list = data.data.data
          list.forEach(element => {
            const taskList = element.task_list
            const taskSun = [] // 已完成的任务
            element.isOpen = false
            element.backGoup = ''
            element.icon = 'icon-fangxiangxia'
            const startWork = this.getTimes(element.start_time)
            const endWork = this.getTimes(element.end_time)
            const now_time = this.getTimes(element.time)
            const Surplus = (endWork.times - now_time.times) / (24 * 60 * 60 * 1000) + 1
            const workDay = (endWork.times - startWork.times) / (24 * 60 * 60 * 1000) + 1
            let work_now = 0
            if (Surplus > 0) {
              work_now = Math.floor((workDay - Surplus) / workDay * 100)
            } else {
              work_now = 100
            }
            const status = element.status
            if (status !== '3') {
              if (Surplus > 0) {
               element.Surplus = Surplus  
              } else {
                element.Surplus = Surplus
              }
            } else {
              if (Surplus > 0) {
               element.Surplus = Surplus  
              } else {
                element.Surplus = 0
              }
            }
            taskList.forEach((items, idx) => {
              if (items.status == '5') {
                taskSun.push(items)
              }
            })
            element.allFile = element.trial + element.fback + element.cwait + element.cback
            element.trialNum =  Math.floor(element.trial / element.allFile * 100) + '%'
            element.fbackNum =  Math.floor(element.fback / element.allFile * 100) + '%'
            element.cwaitNum =  Math.floor(element.cwait / element.allFile * 100) + '%'
            element.cbackNum =  Math.floor(element.cback / element.allFile * 100) + '%'
            element.work_now = work_now
            element.workDay = workDay
            element.end_time = endWork.days
            element.peroject_file = taskList.length
            element.upload_file = taskSun.length
            element.speed =  Math.floor(taskSun.length / taskList.length * 100)
            element.start_time = startWork.days
          });
          this.groupNum = list.length
          this.groupList = list
          this.taskAllwangs = this.getAllTask(list)
          this.getTask(0)
        } else {
          this.$Message.error('请求错误')
        }
      }, error => {
        console.log('错误', error)
      })
    },
    getTimes (day) {
      const days = day.split(' ')[0].replace(/-/g, '/')
      const dayList = {
        times: new Date(days).getTime(),
        days: days
      }
      return dayList
    },
    // 获取任务
    getTask (index) {
      const list = this.groupList
      list.forEach((item, idx) => {
        if (index === idx) {
          item.backGoup = 'backGoup'
        } else {
          item.backGoup = ''
        }
      })
      // this.groupList = list
      const taskList = list[index].task_list
      this.taskChild = this.getTaskList(taskList)
      console.log('项目', this.taskChild)
    },
    // 获取任务
    getTaskList (lists) {
      const list = this.groupList
      const nowTime = this.getTimes(list[0].time).times // 获取今天的日期
      const endNow = [] // 今天结束
      const delay = [] // 延期
      const examine = [] // 待审核
      const backList = [] // 反馈
      const distList = [] // 未分配
      lists.forEach((element, index) => {
        const expect_end = this.getTimes(element.expect_end_time)
        const expect_start = this.getTimes(element.expect_start_time)
        element.expect_end_time = expect_end.days
        element.expect_start_time = expect_start.days
        element.workDay = (expect_end.times - expect_start.times) / (24 * 60 * 60 * 1000) + 1
        let endTime = 0
        if (element.end_time == '') {
          endTime = this.getTimes(element.end_time).times
        } else {
          endTime = 0
        }
        if (expect_end.times === nowTime) {
          endNow.push(element)
        }
        if (!endTime && nowTime > expect_end.times) {
          delay.push(element)
        }
        if (element.status == '1' || element.status == '2') {
          examine.push(element)
        } else if (element.status == '3' || element.status == '4') {
          backList.push(element)
        } else {
          distList.push(element)
        }
      })
      return {
        endNow: endNow,
        delay: delay,
        examine: examine,
        backList: backList,
        distList: distList
      }
    },
    // 获取任务
    getAllTask (list) {
      // const list = this.groupList
      const nowTime = this.getTimes(list[0].time).times // 获取今天的日期
      const endNow = [] // 今天结束
      const delay = [] // 延期
      const examine = [] // 待审核
      const backList = [] // 反馈
      const distList = [] // 未分配
      list.forEach((item, index) => {
        const taskList = item.task_list
        taskList.forEach((element, index) => {
          const expect_end = this.getTimes(element.expect_end_time).times
          let endTime = 0
          if (element.end_time == '') {
            endTime = this.getTimes(element.end_time).times
          } else {
            endTime = 0
          }
          if (expect_end === nowTime) {
            endNow.push(element)
          }
          if (!endTime && nowTime > expect_end) {
            delay.push(element)
          }
          if (element.status == '1' || element.status == '2') {
            examine.push(element)
          } else if (element.status == '3' || element.status == '4') {
            backList.push(element)
          } else {
            distList.push(element)
          }
        })
      })
      return {
        endNow: endNow,
        delay: delay,
        examine: examine,
        backList: backList,
        distList: distList
      }
    },
    goHome (id) {
      sessionStorage.projectID=id;
      this.$router.push('/project/home')
    }
  }
}
</script>
<style lang="less">
   @import './project.less';
</style>
