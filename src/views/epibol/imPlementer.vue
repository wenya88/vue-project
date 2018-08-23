<template>
   <div class="page_week_all">
     <!-- 左侧 -->
     <div class="left_tips">
        <img class='left_img_first' src='../../images/right.png'/>
        <img class='left_img_last' src='../../images/right.png'/>
     </div>
     <!-- 右侧 -->
     <div class="right_tips">
        <img class='right_img_first' src='../../images/left.png'/>
        <img class='right_img_last' src='../../images/left.png'/>
     </div>
    <p class="myTaskAll"><span class="iconfont icon-ymy-ren-copy"></span>我的任务</p>
     <!-- 未读任务end -->
     <div class="tiemSolt" :style="`height: ${boxHight}`" @mousedown="down">
      <div :style="`width: ${widthAll}`" class="clearfix timeSoltFather">
         <!-- 时间 -->
         <div v-for="(item, indexed) in dateList"  :style="`width: ${widths}`" class="times_box" :key="indexed">
          <span v-show='item.weeks'>{{item.weeks}}</span>
          <span>{{item.dateStr}}</span>
        </div>
         <!-- 时间结束 -->
        <div class="task_ka" :style="`height:${boxHg}`">
         <div class="task_top_box" v-for="(elems, indexed) in tastList" :key="indexed" :style="`width:${elems.centWidth}; left:${elems.clienLeft}; top:${elems.top}`">
           <div class="task_describe">
             <div class="clearfix task_describe_title">
               <p class="state-introd">{{elems.isComplete}}</p>
               <div class="task_describe_father">
                 <p class="task_describe_msg" @click="goTask(elems.id)">{{elems.name}}</p>
               </div>
             </div>
           </div>
           <div class="upload_preview_box"  v-show="elems.status !== '1'"  @click="getUpload(elems)">
             <p class="iconfont icon-ymy-upload-copy"></p>
           </div>
         </div>
        </div>
        <!-- 审核任务box -->
      </div>
     </div>
     <!-- 审核任务未读 -->
     <!-- 审核任务 -->
        <p class="myTaskAll"><span class="iconfont icon-ymy-wenjian-copy"></span>任务反馈</p>
        <div class="task_feedback" @mousedown="getdown">
           <div class="task_feedback_box" :style="`width:${allListWidth}`">
              <div class="clearfix task_feedback_msg" v-for="(item, index) in examinList" :key="index">
                <div class="feedback_iamge_father">
                 <img :src="item.image" class="task_feedback_image"/>
                </div>
                 <div class="task_feedback_details">
                    <div class="clearfix feedback_words_box">
                      <div class="feedback_words">
                        <p class="feedback_words_task">{{item.name}}</p>
                        <p class="feedback_words_project">{{item.project_name}}</p>
                      </div>
                       <p class="feedback_explain">内部评审3天</p>
                    </div>
                    <!-- 进度条 -->
                    <div class="feedback_task_progress">
                      <div class="progress_feedback_style isStage"></div>
                      <div class="progress_feedback_style"></div>
                      <div class="progress_feedback_style"></div>
                    </div>
                    <div class="feedback_stage">
                       <p>上传文件</p>
                       <p>内部审核</p>
                       <p>客户审核</p>
                    </div>
                    <div class="feedback_stage_state">
                      <p v-if="item.create_time">{{item.create_time_title}}</p>
                      <p v-if="item.inside_audit_time">{{item.inside_audit_title}}</p>
                      <p v-if="item.client_audit_time">{{item.client_audit_title}}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
     <!-- 上传界面 -->
     <div class="upload_outer" v-if="isclose">
      <div class="upload_page">
        <p class="upload_page_close" @click="getclose">x</p>
        <div class="upload_page_header">
           <!-- <span class="upload_header_ce">测试</span> -->
           <span class="upload_header_title">{{task_name}}</span>
           <span class="upload_header_ce">测试</span>
        </div>
        <div class="upload_page_main">
           <p class="Choice_page_title">选者上传阶段</p>
           <ul class="choice_page_ul">
              <li  v-for="(items,indexs) in stageList" @click="getClick(indexs)" :key="indexs">
                <span :class="`iconfont icon-ymy-right-copy ${items.Instructions}`" v-if="indexs"></span>
                <div :class="items.elementClass">
                  <p>{{items.stage_name}}</p>
                  <span class="iconfont icon-ymy-xuanzhong-copy upload_gou" v-if="items.iconShow"></span>
                  <span class="upload_jiao" v-if="indexs == stageList.length-1">交稿阶段</span>
                </div>
             </li>
           </ul>
           <p class="Choice_page_title">文件交稿规范</p>
           <div class="Choice_page_box">
             <!-- <GeminiScrollbar class="crollbar"> -->
              <p class="clearfix choice_title_Stand" v-for="(itd, indexs) in standardList" :key="indexs">
                <span>{{itd.name}}</span>
                <span>{{itd.values}}</span>
              </p>
             <!-- </GeminiScrollbar> -->
           </div>
           <!-- 上传文件 -->
           <div class="upload_box">
               <upload-box v-if="!nameLists.length">
                 <template slot='upload'>
                   <div id="browse" class="browse"></div>
                   <div class="title_all">
                     <p class='iconfont icon-ymy-upload-copy font_class'></p>
                     <p class="prompt_title">拖入/点击上传任务文件</p>
                     <p class="prompt_title_last">支持jpg、gf、png</p>
                     </div>
                 </template>
               </upload-box>
               <div class='all_upload_page' v-else>
                <GeminiScrollbar class="crollbar">
                 <div class="again_upload_father">
                   <p class="again_upload_title">上传文件</p>
                   <p class="again_upload" @click="againFun">重新上传</p>
                 </div>
                 <div class="yu_lan">
                   <img :src="feilsUrl" v-show="filesStatus==1" @load='gets'/>
                     <Row v-if="ispin">
                      <Col class="demo-spin-col" span="24">
                        <Spin size="large"></Spin>
                      </Col>
                     </Row>
                   <video :src="feilsUrl" width="100%" height="300px;" controls="controls" v-show="filesStatus==2">
                        your browser does not support the video tag
                    </video>
                    <three-module v-show="filesStatus==3">
                    </three-module>
                 </div>
                  <div class="yulan_span">
                    <div :class="`yulanBacks ${element.backClass}`" v-for="(element, indexs) in nameList" :key="indexs">
                       <div class="yulan_bx" @click="getYus(indexs)">
                          <p class="yulan_sanjiao"></p>
                          <p class="yulan_zhujian">设为主文件</p>
                       </div>
                       <p class="xe_title" @click="getYu(indexs)"><span class="precond" v-show="element.is_precond">预</span><span>{{element.name}}</span></p>
                    </div>
                 </div>
                 </GeminiScrollbar>
               </div>
           </div>
           <p class="sure_title" @click="uploadImg">完成上传</p>
        </div>
      </div>
      <div class="is_angin" v-if="isAngin">
        <p>是否开始任务</p>
        <div class="is_angin_box">
          <p @click="sureAngin">是</p>
          <p @click="noAngin">否</p>
        </div>
      </div>
      </div>
     <!-- 上传界面end -->
   </div>
</template>
<script>
import {mapMutations} from 'vuex'
var qs = require('querystring')
import uploadBox from '../../components/upload.vue'
import threeModule from '../project/components/threeModule.vue'
// import {mapState} from 'vuex'
export default {
  data () {
    return {
      dateList: [],
      partObj: {},
      widths: '',
      widthAll: '',
      left: 0,
      taskleft: 0,
      momentTime: 0,
      isclose: false,
      isAngin: false,
      tastList: [],
      examinList: [],
      solt: {},
      nameList: [],
      index: 0,
      boxHg: '',
      allListWidth: '',
      task_name: '',
      isToday: true,
      boxHgs: '',
      boxHight: '',
      beforeData: {},
      afterData: {},
      listAll: {},
      nameLists: [],
      feilsList: [],
      standardList: [],
      filesStatus: 0,
      feilsUrl: '',
      task_id: '',
      stageList: [],
      ispin: false,
      startTime: '2018-6-20',
      endTime: '2018-8-10'
    }
  },
  components: {
    uploadBox,
    threeModule
  },
  mounted () {
    // this.getShowTime()
    this.getScreenWidth()
    // this.getMsgList()
    this.getMsgLists()
  },
  computed: {
    uploadList () {
      return this.$store.state.app.uploadFile
    }
  },
  watch: {
    uploadList(data) {
      this.getList(data)
    }
  },
  methods: {
    ...mapMutations(['setDetailAll']),
    //跳转业务详情
    goTask(id) {
      const item = {
        id: id
      }
      this.setDetailAll(item)
      this.$router.push('/project/details')
    },
    // 确定开始
    sureAngin () {
      const url = this.GLOBAL.baseRouter+"/task/task/start"
      const items = {
         id: this.task_id
       }
       this.$axios.post(url, qs.stringify(items)).then(data => {
         if (data.data.err_code == 0) {
           this.isAngin = false
           this.getOriginal()
           this.getMsgLists()
           this.$Message.success(data.data.err_message)
         } else {
           this.$Message.error(data.data.err_message)
         }
       })
    },
    // 取消开始
    noAngin () {
      this.isAngin = false
    },
    // 是否开始
    getAgin (data) {
      this.task_id = data.id
      this.isAngin = true
    },
    // 重新上传
    againFun () {
      this.nameLists = []
      this.feilsUrl = ''
      this.filesStatus = 0
      this.feilsList = []
    },
    // 预览
    getYus (index) {
      const list = this.feilsList
      const nameListed = this.nameLists
      list.forEach((items, idx) => {
        if (index === idx) {
          items.is_main = 1
        } else {
          items.is_main = 0
        }
      })
      const newList = nameListed.map((items, idx) => {
        if (idx == index) {
          items.is_precond = true
        } else {
          items.is_precond = false
        }
        return items
      })
      // this.feilsList = list
      // this.nameLists = nameLists
      this.nameList = newList
      this.$set(this, 'nameLists', nameListed)
    },
    // 预览
    getYu (index) {
      const list = this.feilsList
      const nameLists = this.nameLists
      if (nameLists.length) {
        const name = nameLists[index].name
        const newList = nameLists.map((items, idx) => {
          if (idx == index) {
            items.backClass = 'yulanBack'
          } else {
            items.backClass = ''
          }
          return items
        })
        const names = name.split('.')[1]
        let filesStatus = 0
        if (names == 'jpg' || names == 'png') {
          filesStatus = 1
        } else if (names == 'mp4' || names == 'avi' || names == 'mpg' || names == 'rmvb') {
          filesStatus = 2
        } else if (names == 'fbx') {
          filesStatus = 3
          this.$store.state.ImgVedioStatus.FileURl =  JSON.parse(list[index].response).file_url
        }
        this.filesStatus = filesStatus
        this.$set(this, 'nameLists', nameLists)
        this.nameList = newList
        this.feilsUrl = JSON.parse(list[index].response).file_url
      }
    },
    // 获取队列
    getList (list) {
      const nameLists = []
      list.forEach(item => {
        const nameObj = {
          name: item.name
        }
        nameLists.push(nameObj)
      })
      this.nameLists = nameLists
      this.feilsList = list
      this.getYu(0)
      this.getYus(0)
    },
    // 上传
    getUpload (data) {
      this.task_id = data.id
      this.task_name = data.name
      this.isclose = true
      this.getStageList()
    },
    // 点击关闭
    getclose () {
      this.isclose = false
    },
    // 点击事件
    getClick (index) {
      let that = this
      this.stage = index + 1
      const list = this.stageList
      const obj = list.map((item, idx) => {
        if (index == idx) {
          item.elementClass = 'choice_page_active'
          item.iconShow = true
          item.Instructions = 'Instruc'
        } else {
          item.elementClass = ''
          item.iconShow = false
          item.Instructions = ''
        }
        return item
      })
      // this.$set(this, 'stageList', list)
      this.stageList = obj
    },
    // 获取数据
    getMsgList () {
      return new Promise((resove, reject) => {
         for (let i = 1; i < 8; i++) {
            const indexs = i * 8
            this.getBefore(indexs).then(msg => {
              this.getAfter(indexs).then(msage => {
                if (msage == 7) {
                  resove()
                }
              })
            })
         }
      })
    },
    getMsgLists () {
      this.getMsgList().then(() => {
         this.getAll()
      })
    },
    // 获取前面的数据
    getBefore (number) {
       return new Promise((resove, reject) => {
        const url = this.GLOBAL.baseRouter+"/task/task/shaft"
        const items = {
         xdays: number
        }
        this.$axios.post(url, qs.stringify(items)).then(data => {
         const list = data.data.data.dates
         const beforeData = this.beforeData
         let lists = Object.assign(beforeData, list);
         this.beforeData = lists
          resove(number/8)
         })
       })
    },
    // 获取后面的数据
    getAfter (number) {
      return new Promise((resove,reject) => {
        const url = this.GLOBAL.baseRouter+"/task/task/shaft"
        const items = {
         xdays: -number
        }
        this.$axios.post(url, qs.stringify(items)).then(data => {
         const list = data.data.data.dates
         const afterData = this.afterData
         let lists = Object.assign(list, afterData);
         this.afterData = lists
         resove(number/8)
        })
      })
    },
    // 获取任务时间数据
    getAll () {
       const url = this.GLOBAL.baseRouter+"/task/task/shaft"
       const beforeLists = this.beforeData
       const afterLists = this.afterData
       const items = {
       }
       this.$axios.post(url, qs.stringify(items)).then(data => {
         const nowList = data.data.data.dates
         this.momentTime = data.data.current_time
        //  console.log('获取时间', data.data.current_time)
         let list = Object.assign(afterLists, nowList, beforeLists);
         this.getView(list)
       }, error => {
         console.log('错误', error)
       })
    },
    // 获取视图
    getView (list) {
      let lists = []
      let tastList = []
      for (let i in list) {
        lists.push(i)
        tastList = tastList.concat(list[i])
      }
      let objList = []
      tastList.forEach((items, i) => {
        let flag = true
        objList.forEach((elems, j) => {
          if (items.id == elems.id) {
            flag = false
          }
        })
        if (flag) {
          if (items.status != 4) {
            items.isComplete = '未完成'
          } else {
            items.isComplete = '已完成'
          }
          objList.push(items);
        }
      })
      const index = lists.length - 1
      this.startTime = lists[0]
      this.endTime = lists[index]
      this.tastList = objList
      this.getTimeSlot()
      this.getTast()
      this.getFeedback(list)
    },
    // 获取任务
    getTast () {
      let list = this.tastList
      // console.log('数据', list)
      let startTimes = this.startTime
      let endTimes = this.endTime
      const todays = this.getTimes(Date.now()).times
      const clentWidth = Number(this.widths.split('px')[0])
      const startCode = new Date(startTimes.replace(/-/g,'/')).getTime()
      const endCode = new Date(endTimes.replace(/-/g,'/')).getTime()
      const dateList = this.dateList
      let startTime = ''
      let endTime = ''
      let starts = ''
      let diffDaye = 0
      let index = 0
      list.forEach((items, itInd) => {
        if (items.end_time != 0) {
           endTime = items.end_time
        } else {
           endTime = items.expect_end_time
        }
        if (items.start_time != 0) {
          startTime = items.start_time
        } else {
          startTime = items.expect_start_time
        }
        const expectEnd = Number(items.expect_end_time) * 1000
        const expectStart = Number(items.expect_start_time) * 1000
        items.startDay = this.getTimes(expectStart).title
        items.endDay = this.getTimes(expectEnd).title
        if (Number(items.end_time) - Number(items.expect_end_time) < 0) {
          const delay = todays - expectEnd
          if (delay > 0 && !Number(items.end_time)) {
            items.isDelay = true
          } else {
            items.isDelay = false
          }
        } else {
          items.isDelay = true
        }
         const startNow = this.getTimes(Number(startTime) * 1000).times // 后台获取的时间戳是10位，
         const endNow = this.getTimes(Number(endTime) * 1000).times
         const diffenc = startCode - startNow
         const diffencEnd = endCode - endNow
         let diffStart = 0
         let diffEnd = 0
         if (diffenc > 0) {
           diffStart = startCode
         } else {
           diffStart = startNow
         }
         if (diffencEnd > 0) {
           diffEnd = endNow
         } else {
           diffEnd = endCode
         }
        diffDaye = (diffEnd - diffStart) / (24*60*60*1000) + 1
        const diffDayes = (this.getTimes(expectEnd).times - this.getTimes(expectStart).times) / (24*60*60*1000) + 1
        starts = this.getTime(diffStart, 0).dateStr
        if (diffDaye <= 0) { // 不在时间线内的删除
          list.splice(itInd, 1)
        }
         dateList.forEach((elems, inds) => {
           if (elems.dateStr == starts) {
             index = inds
           }
         })
         const centWidth = clentWidth*diffDaye - 20
         const clienLeft = index*clentWidth + 10
         const startIndex = index
         items.startIndex = startIndex // 任务开始的数据
         items.endIndex = startIndex+diffDaye - 1 // 最后结束位置
         items.centWidth = centWidth + 'px'
         items.clienLeft = clienLeft + 'px'
         items.workDay = diffDayes
         items.ends = diffEnd
         items.starts = diffStart
      })
      this.getTop()
      this.getBackground()
    },
    // 获取今天的日期
    getToDay () {
      const dateList = this.dateList
      const width = this.widths.split('px')[0]
      const todays = Date.now()
      const element = document.getElementsByClassName('timeSoltFather')[0]
      const todayStr = this.getTime(todays, 0).dateStr
      const widthAll = this.widthAll
      dateList.forEach((items, index) => {
        if (todayStr == items.dateStr) {
          items.weeks = '今天'
          const lefts = -((index - 1) * width - 1)
          const moves = lefts + 'px'
          this.left = lefts
          element.setAttribute('style', `width: ${widthAll}; left: ${moves}`)
        }
      })
    },
    // 获取task排序位子
    getTop () {
      const list = this.tastList
      const listLt = list.length
      let solt = this.solt
      let index = this.index
      if (Object.keys(solt).length==0) {
        solt[index] = []
        solt[index].push(list[0])
        // list[0].top = 0 + 'px'
        this.solt = solt
      } else {
        index ++
        let items = list[index]
        let ends = items.ends
        let starts = items.starts
        let object = [] // 计算层级
        let isPing = false // 是否匹配
        let isPush = false // 循环层级
        let isXun = false // 是否循环
        for (let i in solt) {
          object.push(i)
        }
        object.forEach(element => { // 循环层级
          const ok = solt[element]
          if (!isXun) {
            ok.forEach(elems => {
              const soltEnds = Number(elems.ends)
              const soltStarts = Number(elems.starts)
              const endsCode = ends - soltStarts
              const startsCode = soltEnds - starts
              if (endsCode >= 0 && startsCode >= 0) {
                isPush = true
              }
            })
            if (!isPush) {
              solt[element].push(items)
              items.top = element * 80 + 'px'
              isPing = true
              isPush = true
              isXun = true
              this.solt = solt
            } else {
              isPush = false
              // isPing = false
            }
          }
        })
        if (!isPing) {
          const objLt = object.length - 1
          const num = Number(object[objLt]) + 1
          solt[num] = []
          solt[num].push(items)
          items.top = num* 80 + 'px'
          this.solt = solt
         }
         this.index = index
      }
       if (index < listLt - 1) { // 执行次数，因为本身执行一次，所以减一
          this.getTop()
        }
       if (index == listLt - 2) {
          this.tastList = list
          this.getHieght()
       }
    },
    // 获取背景
    getBackground () {
       const list = this.solt
       const object = []
       for(let i in list) {
         object.push(i)
       }
       const num = object.length
       const numbers = this.dateList.length
       const widths = this.widths
       let element = document.getElementsByClassName('timeSoltFather')[0]
       let div = document.createElement('div')
       div.setAttribute('id', 'lattice')
       let htmlDate = ''
         for (let i = 0; i< num; i++){
            let HierList = list[i]
             let childrenString = '' // 多少子元素
             for (let k = 0; k < numbers; k++) {
              let index = 0
              let isremove = false
              for (let y = 0; y < HierList.length; y++) {
                 index++
                 const hierLength = HierList.length
                 const start = HierList[y].startIndex
                 const end = HierList[y].endIndex
                 let appendStr = ''
                 if (k >= start && k < end) {
                   isremove = true
                 }
                 if (index == hierLength) {
                   if (isremove) {
                     appendStr = `<div class='latt-child latt-border' style='width: ${widths};'></div>`
                   } else {
                     appendStr = `<div class='latt-child' style='width: ${widths}'></div>`
                   }
                  childrenString+=appendStr
                 }
               }
             }
              // console.log('i', i)
              htmlDate+= `<div class='latt-father'>${childrenString}</div>`
         }
       div.innerHTML= htmlDate
       element.appendChild(div)
    },
    getHieght() {
      const list = this.solt
      let ObjList = []
      for (let i in list) {
        ObjList.push(i)
      }
      const length = ObjList.length
      this.boxHg = length * 80 + 'px'
      this.boxHgs = length* 80 + 50 + 'px'
    },
    // 转换时间
    getTimes (str) {
      const now = new Date(str);
      var year = now.getFullYear()
      var month = now.getMonth() + 1
      month = month < 10 ? ('0' + month) : month
      var date = now.getDate()
      date = date < 10 ? ('0' + date) : date
      const timesTile = year + '-' + month + '-' + date
      const dateTime = year + '/' + month + '/' + date
      const itms = {
        times: new Date(dateTime).getTime(),
        title: timesTile
      }
      return itms
      
    },
    // 获取时间任务时间段
    getTimeSlot () {
       const startTime = this.startTime
       const endTime = this.endTime
       const isToday = this.isToday // 只允许第一次加载定位今天
       const startStr = new Date(startTime.replace(/-/g,'/')).getTime()
       const endStr = new Date(endTime.replace(/-/g,'/')).getTime()
       const timeNum = (endStr - startStr) / (24*60*60*1000)
       var list = []
       for(let i = 0; i < timeNum + 1; i++) {
         let dateList = this.getTime(startStr, i)
         list.push(dateList)
       }
       const width = this.widths.split('px')[0]
       this.widthAll = width *(timeNum + 1) + 'px'
       this.dateList = list
       if (isToday) {
        this.getToDay()
        this.isToday = false
       }
    },
    // mousedown
    down (e) {
      const ownDiv = e.target // 获取元素
      const isSx = false // 是否刷新
      const ownWidth = ownDiv.clientWidth // 获取元素宽度
      const startDisX = e.clientX// 获取鼠标开始位置
      let isClick = false
      // let width = Number(this.widths.split('px')[0]) + 10
      const element = document.getElementsByClassName('timeSoltFather')[0]
      const widthAll = this.widthAll
      const lefts = this.left
      var endDisX = 0
      var that = this
      const fun = function (e) {
         isClick = true
         endDisX = e.clientX - startDisX + lefts
         that.left = endDisX
         const movePx = endDisX + 'px'
         element.setAttribute('style', `width: ${widthAll}; left: ${movePx}`)
      }
      let unFun = function (e) {
        document.removeEventListener('mousemove', fun, false)
        document.removeEventListener('mouseup', unFun, false)
        if (!isClick) {
          return
        }
      }
      document.addEventListener('mousemove', fun, false)
      document.addEventListener('mouseup', unFun, false)
    },
    getdown (e) {
      const ownDiv = e.target // 获取元素
      const isSx = false // 是否刷新
      const ownWidth = ownDiv.clientWidth // 获取元素宽度
      const startDisX = e.clientX// 获取鼠标开始位置
      let isClick = false
      // let width = Number(this.widths.split('px')[0]) + 10
      const element = document.getElementsByClassName('task_feedback_box')[0]
      const widthAll = this.allListWidth
      const lefts = this.taskleft
      var endDisX = 0
      var that = this
      const fun = function (e) {
         isClick = true
         endDisX = e.clientX - startDisX + lefts
         that.taskleft = endDisX
         const movePx = endDisX + 'px'
         element.setAttribute('style', `width: ${widthAll}; left: ${movePx}`)
      }
      let unFun = function (e) {
        document.removeEventListener('mousemove', fun, false)
        document.removeEventListener('mouseup', unFun, false)
        if (!isClick) {
          return
        }
      }
      document.addEventListener('mousemove', fun, false)
      document.addEventListener('mouseup', unFun, false)
    },
    // 获取时间
    getTime (str, Num) {
      const now = new Date(str + Num*24*60*60*1000)
      var month = now.getMonth() + 1
      var date = now.getDate()
      const week = now.getDay()
      var weekday=["周日","星期一","星期二","星期三","星期四","星期五","周六"]
      var weekString = weekday[week]
      date = date < 10 ? ('0' + date) : date
      const tims = {
        dateStr: month + '/' + date,
        weeks: weekString
      }
      return tims
    },
    // 获取开始和后面的时间
    getShowTime () {
      var list = []
      for (let i = -1; i < 7; i++) {
        const dateObj = this.getTime(i)
        list.push(dateObj)
      }
      this.dateList = list
    },
    // 获取屏幕宽度
    getScreenWidth () {
      const width =  $('.tiemSolt').width()
      this.widths = Math.floor((width - 1) / 8 * 100) / 100 + 'px'
    },
    // 获取反馈信息
    getFeedback (obj) {
      let ones = {}
      let index = 0
      let allList = []
      let heightList = []
      const clentWidth = Number(this.widths.split('px')[0])
      for (let i in obj) {
        index++
        ones[i] = []
        const left = clentWidth*(index - 1) + 10 * (index - 1) + 'px'
        const list = obj[i]
        list.forEach(item => {
          if (Object.keys(item.stage).length != 0) {
            item.stage.left = left
            item.stage.name = item.name
            item.stage.project_name = item.project_name
            ones[i].push(item.stage)
          }
        })
      }
      for (let k in ones) {
        const list = ones[k]
        let topNum = 0
        list.forEach((items, index) => {
          items.centWidths = clentWidth + 'px'
          items.chilrenLeft = clentWidth / 2 + 'px'
          items.top = index * 210 + 'px'
          if (index > 0) {
            const status = list[index - 1].status
            if (status !== '1') {
              topNum+= 360
            } else {
              topNum+=210
            }
          } else {
             topNum = 0
          }
          items.top = topNum + 'px'
          heightList.push(index * 210)
          if (items.create_time) {
             items.create_time_title = !items.create_time ? null : this.getTimeTitle(items.create_time)
             items.client_audit_title = !items.client_audit_time ? null : this.getTimeTitle(items.create_time)
             items.inside_audit_title = !items.inside_audit_time ? null : this.getTimeTitle(items.create_time)
             allList.push(items)
          }
        })
      }
      heightList.sort()
      const height_min =  $(window).height() - 390 // 300是除去他元素的总高度
      const length = heightList.length - 1
      const boxHgs = Number(this.boxHgs.split('px')[0])
      if (length >= 0) {
        const lengths = boxHgs
        if (lengths > height_min) {
           this.boxHight = boxHgs+ 'px'
        } else {
          this.boxHight = height_min + 'px'
        }
      } else {
        if (boxHgs > height_min) {
           this.boxHight = boxHgs + 'px'
        } else {
           this.boxHight = height_min + 'px'
        }
      }
      const listLt = allList.length;
      this.allListWidth = listLt * 520 - 20 + 'px'
      this.examinList = allList
    },
    // 查找阶段
    getStageList () {
      const url = this.GLOBAL.baseRouter+"/task/task/info"
      const items = {
        id: this.task_id
      }
      this.$axios.post(url, qs.stringify(items)).then(data => {
         this.stageList = data.data.stage
         this.standardList = data.data.standard
       })
    },
    // 获取时间字段
    getTimeTitle (time) {
      const timeNum = time*1000
      const momentTime = this.momentTime*1000
      let tageTitle = ''
      const times = momentTime - timeNum
      const remainder = Math.floor(times / (24*60*60*1000)) // 下舍入判断上传多少天
      if (!remainder) {
         const remainders = Math.floor(times / (60*60*1000))
         if (!remainders) {
           tageTitle = '刚刚'
         } else {
           tageTitle = remainder + '小时前'
         }
      } else {
        tageTitle = remainder + '天前'
      }
      return tageTitle
    },
    // 上传
    uploadImg () {
      //  return
       const url = this.GLOBAL.baseRouter+"/task/task/stage-upload"
       const list = this.feilsList
       const objList = []
      //  console.log('上传', list)
       list.forEach(items => {
         const obj = JSON.parse(items.response)
         objList.push({
           fid: obj.fid,
           file: obj.file_url,
           is_main: items.is_main,
           thumb: obj.file_url + '?x-oss-process=image/resize,l_50',
           type: obj.fileType
         })
       })
       const items = {
         task_id: this.task_id, // 任务id
         stage: this.stage, //上传阶段
         file: JSON.stringify(objList) // json字符串
       }
       this.$axios.post(url, qs.stringify(items)).then(data => {
        if (data.data.err_code === 0) {
         this.isclose = false
         this.getOriginal()
         this.getMsgLists()
         this.$Message.success(data.data.err_message)
        } else {
          this.$Message.error(data.data.err_message)
        }
        this.againFun()
       })
    },
    // 是否加载完成
    gets () {
      this.ispin = false
    },
    // 回到初始状态
    getOriginal () {
      this.index = 0
      this.boxHgs = ''
      this.boxHight = ''
      this.tastList = []
      this.examinList = []
      this.solt = {}
      this.nameList = []
      this.task_name = ''
      this.isToday = true
      this.beforeData = {}
      this.afterData = {}
      this.listAll = {}
    }
  }
}
</script>
 <style lang="less">
.my_task_top{
 background: rgb(72,197,183);
}
.my_task_bottom{
 background: rgb(26,153,170);
}
.page_week_all{
  width: 100%;
  min-height: 100%;
  position: relative;
  padding: 10px;
  .left_tips,.right_tips{
   position: absolute;
   width: 80px;
   height: 100%;
   top: 0;
   z-index: 99;
  }
  .left_tips{
   left: -40px;
   background: -webkit-linear-gradient(left, #eef1f2, rgba(298,241,242,.4));
   background: -o-linear-gradient(right, #eef1f2, rgba(298,241,242,.4));
   background: -moz-linear-gradient(right, #eef1f2, rgba(298,241,242,.4));
   background: linear-gradient(to right, #eef1f2, rgba(298,241,242,.4));
   .left_img_first{
     position: absolute;
     top: 200px;
     left: 20px;
   }
   .left_img_last{
     position: absolute;
     bottom: 80px;
     left: 20px;
   }
  }
  .right_tips{
   right: -40px;
   background: -webkit-linear-gradient(left,rgba(298,241,242,.4), #eef1f2);
   background: -o-linear-gradient(right, rgba(298,241,242,.4), #eef1f2);
   background: -moz-linear-gradient(right, rgba(298,241,242,.4), #eef1f2);
   background: linear-gradient(to right, rgba(298,241,242,.4), #eef1f2);
   .right_img_first{
     position: absolute;
     top: 200px;
     right: 20px;
   }
   .right_img_last{
     position: absolute;
     bottom: 80px;
     right: 20px;
   }
  }
}
.times_box{
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 16px;
  border: 1px solid #eef1f2;
  border-left: none;
  margin-top: -1px;
  float: left;
}
.times_box:first-child{
  border-left: 1px solid #eef1f2;
}
.tiemSolt{
 width: 100%;
 /* min-height: 643px; */
 /* margin: 50px 0px; */
 overflow: hidden;
 position: relative;
}
.times_box>span:nth-child(2) {
  margin-right: 10px;
}
.task_top_box{
  position: absolute;
  height: 60px;
  /* padding: 10px; */
  border-radius: 4px;
  overflow: hidden;
  z-index: 1;
  background: rgb(72,197,183);
}
.timeSoltFather{
  background: #fdfdfd;
  position: absolute;
  top: 0;
}
.task_ka{
 width: 100%;
 /* height: 50px; */
 margin-top: 60px;
 position: relative;
}
.my_strips{
  width: calc(100% - 200px);
  height: 60px;
  border-bottom: 10px solid  rgb(26,153,170);
}
.myTaskAll{
  width: 100%;
  height: 80px;
  line-height: 80px;
  font-size: 20px;
  padding-left: 30px;
  color: #777777;
}
.myTaskAll>span{
  color: #3bceb6;
  font-size: 20px;
  margin-right: 5px;
}
.upload_preview_box{
  width: 40px;
  height: 40px;
  position: absolute;
  top: 10px;
  right: 20px;
  cursor: pointer;
  text-align: center;
  line-height: 40px;
  color: #ffffff;
  & p{
   font-size: 40px;
  }
}
.task_describe{
  width: calc(100% - 100px);
  height: 100%;
}
.task_describe_title{
  width: 100%;
  height: 100%;
  padding-right: 50px;
  position: relative;
}
/* .task_describe_title>div{
  float: left;
} */
.state-introd{
 width: 100px;
 height: 30px;
 line-height: 30px;
 color: #ffffff;
 background: #fcc44a;
 text-align: center;
 position: absolute;
 top: 3px;
 left: -33px;
 transform: rotate(-45deg);
}
.task_describe_father{
  /* padding-right: 60px; */
  margin-left: 50px;
  height: 100%;
  line-height: 60px;
}
.task_describe_msg{
  font-size: 20px;
  color: #ffffff;
  cursor: pointer;
}
.task_describe_sub{
  font-size: 16px;
  color: #ffffff;
}
.task_describe_time{
  color: #ffffff;
  font-size: 14px;
}
.task_describe_time>span:last-child{
  margin-left: 20px;
}
.task_icon{
  margin-right: 10px;
}
.task_icon>span{
  font-size: 30px;
  display: block;
  line-height: 1;
  float: left;
  color: rgb(25,250,40);
}
.examine_task{
 width: 100%;
 margin-top: 80px;
 height: 400px;
 position: relative;
}
.examin_msg_task{
  position: absolute;
  /* width: 200px; */
  height: 200px;
}
.examin_sanjiao{
  height: 0px;
  width: 0px;
  /* margin-left: 84px; */
  border-right: 15px solid transparent;
  border-bottom: 30px solid rgb(26,153,170);
  border-left: 15px solid transparent;
}
.eaxmin_msg{
 width: 100%;
 /* height: 150px; */
 padding: 10px;
 background: rgb(26,153,170);
}
.eaxmin_title_all{
  width: 100%;
  height: 100px;
}
.eaxmin_title_all>p:first-child{
  font-size: 20px;
  color: #ffffff;
}
.eaxmin_title_all>p:last-child{
  font-size: 14px;
  color: #ffffff;
}
.msg_stauts{
 width: 100%;
 height: 30px;
 line-height: 30px;
 font-size: 20px;
 color: rgb(72,197,183);
}
.no_msgs{
  position: absolute;
  width: 50px;
  height: 50px;
  left: 10px;
  top: 80px;
  cursor: pointer;
}
.no_msg_left{
  position: absolute;
  left: 0;
  top: 10px;
  height: 0px;
  width: 0px;
  /* margin-left: 84px; */
  border-top: 10px solid transparent;
  border-right: 20px solid rgb(72,197,183);
  border-bottom: 10px solid transparent;
}
.no_msg_lefts{
  position: absolute;
  left: 0;
  top: 10px;
  height: 0px;
  width: 0px;
  /* margin-left: 84px; */
  border-top: 10px solid transparent;
  border-right: 20px solid rgb(255,92,50);
  border-bottom: 10px solid transparent;
}
.no_msg_sj {
  position: absolute;
  right: 0;
  top: 10px;
  height: 0px;
  width: 0px;
  /* margin-left: 84px; */
  border-top: 10px solid transparent;
  border-left: 20px solid rgb(72,197,183);
  border-bottom: 10px solid transparent;
}
.no_msg_title{
  width: 40px;
  height: 40px;
  border-radius: 50%;
  text-align: center;
  line-height: 40px;
  background: rgb(72,197,183);
  font-size: 16px;
  color: #ffffff;
}
.no_msg_titles{
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-left: 10px;
  text-align: center;
  line-height: 40px;
  background: rgb(255,92,50);
  font-size: 16px;
  color: #ffffff;
}
.msg_couple{
  width: 100%;
}
.msg_couple>span:nth-child(1){
  float: left;
  display: block;
  width: 30px;
  height: 30px;
  background: #ffffff;
  border-radius: 50%;
}
.msg_couple>span:nth-child(2){
  float: left;
  color: #ffffff;
  margin-top: 10px;
  font-size: 14px;
}
.msg_couple>span:nth-child(3){
  float: right;
  font-size: 20px;
  color: rgb(72,197,183);
}
.msg_couple_p{
 width: 100%;
 height: 150px;
 border: 2px solid #ffffff;
 border-radius: 4px;
}
.upload_outer{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0,0,0,.3);
  z-index: 9999;
}
.upload_page{
  width: 556px;
  height: 770px;
  position: absolute;
  top: 70px;
  left: 50%;
  margin-left: -250px;
  background: #ffffff;
  z-index: 99999;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.upload_page_header {
  width: 100%;
  height: 60px;
  /* line-height: 60px; */
  background: url('../../images/upload.png');
  background-size: 100% 100%;
  border-bottom: 1px solid rgb(228,228,228);
}
.upload_header_ce{
  display: block;
  float: left;
  text-align: center;
  padding: 2px 5px;
  margin: 22px 0px 0px 10px;
  background: #fcc44a;
  border-radius: 4px;
  color: #ffffff;
}
.upload_header_title{
  display: block;
  float: left;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  margin: 20px 10px 0 20px;
}
.upload_page_close{
  position: absolute;
  right: 0;
  top: 0;
  width: 20px;
  height: 20px;
  border-top-right-radius: 4px;
  text-align: center;
  line-height: 20px;
  cursor: pointer;
  background: rgb(102,215,201);
  color: #ffffff;
}
.upload_page_main{
  width: 100%;
  height: 540px;
  padding: 20px;
}
.Choice_page_title{
  font-size: 14px;
  color: rgb(218,218,218);
}
.Choice_page_box{
 width: 100%;
 height: 70px;
 overflow-y: auto;
}
.choice_page_ul {
  width: 100%;
  height: 35px;
  margin: 20px 0px;
}
.choice_page_ul li{
  height: 100%;
  float: left;
}
.choice_page_ul li>span{
  float: left;
  font-size: 18px;
  margin-top: 4px;
}
.choice_page_ul li>div{
  position: relative;
  width: 80px;
  height: 100%;
  float: left;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid rgb(215,215,215);
}
.choice_page_ul li>div>p{
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 35px;
}
.choice_page_active{
  border: 1px solid #3bceb6!important;
  background: #66d7c9;
}
.Instruc{
  color: #3bceb6;
}
.upload_gou{
 font-size: 15px;
 position: absolute;
 right: 5px;
 top: 5px;
 color: rgb(24,191,164);
}
.upload_jiao{
  position: absolute;
  right: 10px;
  top: -37px;
  width: 70px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  border-radius: 4px;
  background: #3bceb6;
  color: #ffffff;
}
.upload_jiao:before{
  width: 0;
  height: 0;
  content:'';
  display: block;
  position: absolute;
  top: 25px;
  left: 50%;
  margin-left: -5px;
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
  border-top: 5px solid #3bceb6;
}
.choice_title_Stand{
  margin-top: 10px;
  margin-top: 10px;
  width: 100%;
  background: #eef1f2;
  border-radius: 4px;
  padding: 0 10px;
}
.choice_title_Stand>span:first-child{
  float: left;
  font-size: 16px;
  color: #777777;
}
.choice_title_Stand>span:last-child{
  float: right;
  font-size: 16px;
  color: #777777;
}
.upload_box{
  width: 100%;
  height: 400px;
  margin-top: 20px;
  border: 1px dashed black;
}
.sure_title{
  width: 100px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  margin-top: 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  float: right;
  background: rgba(24,191,164, 1);
  color: #ffffff;
}
.sure_title:hover{
   background: rgba(24,191,164, .8);
}
.yulanBack {
  border: 1px solid rgb(24,191,164)!important;
  color: rgb(24,191,164);
}
.prompt_title{
  font-size: 18px;
  // color: rgb(215,215,215);
  cursor: pointer;
}
.prompt_title_last{
  font-size: 16px;
  color: rgb(215,215,215);
}
.font_class{
 font-size: 40px!important;
 cursor: pointer;
 color: #3bceb6;
}
.uploadContainer{
  top: 50%;
  height: 120px;
  margin-top: -60px;
  text-align: center;
}
.title_all{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120px;
}
.browse{
 width: 100%!important;
 height: 100%!important;
 opacity: 0;
}
.yu_lan{
 width: 100%;
 height: 300px;
 /* margin-top: 50px; */
}
.yulan_span{
 width: 100%;
 margin-top: 10px;
 /* overflow-y: scroll; */
}
.yulan_span>div{
  display: inline-block;
  background: rgb(210,210,210);
  margin-left: 10px;
  /* float: left; */
  border:1px solid #ffffff;
  margin-top: 10px;
  position: relative;
  cursor: pointer;
  border-radius: 4px;
}
.yu_lan>img{
  width: 100%;
  height: 100%;
}
.again_upload{
 padding: 3px 10px;
 text-align: center;
 line-height: 20px;
 margin-top: 5px;
 font-size: 16px;
 cursor: pointer;
 border-radius: 4px;
 float: right;
 color: #3bceb6;
 border: 1px solid #3bceb6;
}
.again_upload_title{
  float: left;
  margin: 5px 0 0 10px;
  line-height: 20px;
  font-size: 16px;
  color: #3bceb6;
}
.all_upload_page{
 width: 100%;
 height: 100%;
}
.again_upload_father{
 width: 100%;
 height: 30px;
 padding-right: 20px;
}
.is_angin{
 width: 200px;
 height: 160px;
 position: fixed;
 top: 50%;
 left: 50%;
 margin-top: -100px;
 margin-left: -100px;
 background: rgb(240,240,240);
 border-radius: 4px;
}
.is_angin>p{
  width: 100%;
  height: 120px;
  text-align: center;
  line-height: 160px;
}
.is_angin_box{
  width: 100%;
  height: 40px;
}
.is_angin_box>p{
  width: 60px;
  height: 30px;
  float: left;
  border-radius: 4px;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
  color: #ffffff;
  margin-top: 5px;
}
.is_angin_box>p:first-child{
 background: rgb(24,191,164);
 margin-left: 30px;
}
.is_angin_box>p:last-child{
 background: rgb(215,215,215);
 margin-left: 20px;
}
.xe_title{
 width: 100%;
 height: 100%;
 padding: 5px 10px;
}
.precond{
  background: rgb(255,153,0);;
  color: #ffffff;
  padding: 3px;
  margin-right: 3px;
}
.yulanBacks:hover .yulan_bx{
  display: block;
}
.yulan_bx{
  width: 100px;
  height: 40px;
  z-index: 9999;
  position: absolute;
  left: 0;
  top: 30px;
  display: none;
}
.yulan_sanjiao{
  height: 0px;
  width: 0px;
  margin-left: 20px;
  border-right: 5px solid transparent;
  border-bottom: 10px solid rgb(255,153,0);
  border-left: 5px solid transparent;
}
.yulan_zhujian{
 width: 100%;
 height: 30px;
 border-radius: 4px;
 background: rgb(255,153,0);
 text-align: center;
 line-height: 30px;
 cursor: pointer;
 color: #ffffff;
}
.demo-spin-container{
  width: 100%;
  height: 100%;
}
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
/* @keyframes ani-demo-spin {
  from { transform: rotate(0deg)}
  50%  { transform: rotate(180deg)}
  to   { transform: rotate(360deg)}
} */
.demo-spin-col{
  height: 100%;
  position: relative;
}
.demo-spin-col>div{
  width: 50px;
  margin: 100px auto 0;
}
 #lattice{
  width: 100%;
  position: absolute;
  top: 50px;
  left: 0;
}
.latt-father{
  width: 100%;
  height: 80px;
  border-bottom: 1px solid #eef1f2;
}
.latt-child{
  float: left;
  height: 100%;
  border-right: 1px solid #eef1f2;
}
.latt-child:first-child{
  border-left: 1px solid #eef1f2;
}
.latt-border{
  border-right: 1px solid rgba(255,255,255,0);
}
.task_feedback{
  width: 100%;
  height: 140px;
  overflow: hidden;
  position: relative;
  .task_feedback_box{
    // width: 100%;
    position: absolute;
    top: 0;
    height: 100%;
    .task_feedback_msg{
      width: 500px;
      height: 140px;
      padding: 20px;
      border-radius: 4px;
      background: #fdfdfd;
      margin-right: 20px;
      float: left;
      .feedback_iamge_father{
        width: 100px;
        height: 100px;
        border-radius: 4px;
        float: left;
       .task_feedback_image{
        width: 100%;
        height: 100%;
       }
      }
      .task_feedback_details{
        width: 350px;
        height: 100px;
        margin-left: 10px;
        float: left;
        .feedback_words_box{
          width: 100%;
          height: 45px;
          .feedback_words{
           width: 240px;
           height: 45px;
           float: left;
           .feedback_words_task{
             font-size: 16px;
             font-weight: bold;
           }
           .feedback_words_project{
             font-size: 14px;
             color: #bdbdbd;
           }
          }
          .feedback_explain{
            padding: 5px 10px;
            margin-left: 10px;
            border: 1px solid #eef1f2;
            color: #3bceb6;
            float: left;
          }
        }
        .feedback_task_progress{
          width: 100%;
          height: 5px;
          border-radius: 4px;
          background: #bdbdbd;
          .progress_feedback_style{
            width: 33.3333%;
            height: 100%;
            float: left;
            border-radius: 4px;
            background: #bababa;
            &:before{
              display:block;
              content:'';
              width: 0;
              height: 0;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 5px solid #bababa;
              // position: absolute;
              // top: 40px;
              // left: 50%;
              margin:5px 0 0 55px;
            }
          }
          .isStage{
            background: #3bceb6;
            &::before{
              border-top: 5px solid #3bceb6;
            }
          }
        }
        .feedback_stage{
          width: 100%;
          height: 20px;
          margin-top: 5px;
          & p{
           width: 33.333%;
           height: 100%;
           text-align: center;
           font-size: 14px;
           color: #bdbdbd;
           float: left;
          }
        }
        .feedback_stage_state{
          width: 100%;
          height: 20px;
          & p{
           width: 33.333%;
           height: 100%;
           text-align: center;
           font-size: 14px;
           color: #bdbdbd;
           float: left;
          }
        }
      }
    }
  }
}
</style>