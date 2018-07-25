<template>
   <div class="page_week_all">
     <div class="clearfix myTaskAll">
        <div class="my_task_top">
           <p>我的任务</p>
        </div>
        <div class="my_strip"></div>
     </div>
     <!-- 显示未读任务 -->
      <div class="no_msg">
        <p class="no_msg_sj"></p>
        <p class="no_msg_title">5</p>
      </div>
     <!-- 未读任务end -->
     <div class="tiemSolt" :style="`height: ${boxHight}`" @mousedown="down">
      <div :style="`width: ${widthAll}`" class="clearfix timeSoltFather">
        <div class="task_ka" :style="`height:${boxHg}`">
         <div class="task_top_box" v-for="(elems, index) in tastList" :key="index" :style="`width:${elems.centWidth}; left:${elems.clienLeft}; top:${elems.top}`">
           <div class="task_describe">
             <div class="clearfix task_describe_title">
               <div class="task_icon">
                 <p v-show="elems.isDelay">延期</p>
                 <span class="iconfont icon-bofang" v-show="elems.status == 1"></span>
                 <span class="iconfont icon-shangchuandengdai" v-show="elems.status == 2"></span>
               </div>
               <div>
                 <p class="task_describe_msg">诛仙剑客模型</p>
                 <p class="task_describe_sub">诛仙</p>
               </div>
             </div>
             <p class="task_describe_time">
               <span>{{elems.workDay}}个工作日</span>
               <span>{{elems.startDay}}~{{elems.endDay}}</span>
             </p>
           </div>
           <div class="upload_preview_box" @click="getUpload">
             <p class="iconfont icon-jiahao"></p>
           </div>
         </div>
        </div>
        <div v-for="(item, index) in dateList" :key="index" :style="`width: ${widths}`" class="times_box">
          <span>{{item.dateStr}}</span>
          <span v-show='item.weeks'>{{item.weeks}}</span>
        </div>
        <!-- 审核任务box -->
     <div class="examine_task">
        <div class="examin_msg_task" v-for="(item, index) in examinList" :key="index" :style="`width:${item.centWidths};top:${item.top};left:${item.left}`">
           <p class="examin_sanjiao" :style="`margin-left:${item.chilrenLeft}`"></p>
           <div class="eaxmin_msg">
             <div class="eaxmin_title_all">
               <p>钢铁侠3D模型</p>
               <p>复仇者联盟</p>
             </div>
             <p class="msg_stauts">等待反馈中...</p>
           </div>
        </div>
     </div>
      </div>
     </div>
     <!-- 审核任务未读 -->
      <!-- 显示未读任务 -->
      <div class="no_left_msg">
        <p class="no_msg_left"></p>
        <p class="no_msg_title">5</p>
      </div>
     <!-- 审核任务 -->
     <div class="clearfix myTaskAll">
        <div class="my_task_bottom">
           <p>审核任务</p>
        </div>
        <div class="my_strips"></div>
     </div>
     <!-- 上传界面 -->
      <div class="upload_page" v-if="isclose">
        <p class="upload_page_close" @click="getclose">x</p>
        <div class="upload_page_header">
           <span class="upload_header_ce">测试</span>
           <span class="upload_header_title">变形金刚之大黄蜂</span>
        </div>
        <div class="upload_page_main">
           <p class="Choice_page_title">选者上传阶段</p>
           <ul class="choice_page_ul">
             <li>
               <p>框架</p>
                <span class="iconfont icon-tongyong-quan upload_gou"></span>
             </li>
             <li>
               <p>上色</p>
                <span class="iconfont icon-tongyong-quan upload_gou"></span>
             </li>
             <li>
               <p>贴图</p>
                <span class="iconfont icon-tongyong-quan upload_gou"></span>
             </li>
             <li>
               <p>精修</p>
                <span class="iconfont icon-tongyong-quan upload_gou"></span>
             </li>
             <li>
               <p>高修</p>
               <span class="iconfont icon-tongyong-quan upload_gou"></span>
               <span class="upload_jiao">交稿阶段</span>
             </li>
           </ul>
           <p class="Choice_page_title">文件交稿规范</p>
           <p class="clearfix choice_title_Stand">
             <span>命名要求</span>
             <span>空间命名以s_开头</span>
           </p>
           <p class="clearfix choice_title_Stand">
             <span>储存要求</span>
             <span>贴图文件存在IMG目录下</span>
           </p>
           <!-- 上传文件 -->
           <div class="upload_box">
               <upload-box>
                 <template slot='upload'>
                   <div id="browse" class="browse"></div>
                   <p class="title_all"><span class='iconfont icon-shangchuan3 font_class'></span><span class="prompt_title">拖入/点击上传任务文件</span></p>
                 </template>
               </upload-box>
           </div>
           <p class="sure_title">确认</p>
        </div>
      </div>
     <!-- 上传界面end -->
   </div>
</template>
<script>
var qs = require('querystring')
import uploadBox from '../../components/upload.vue'
// import {mapState} from 'vuex'
export default {
  data () {
    return {
      dateList: [],
      partObj: {},
      widths: '',
      widthAll: '',
      left: 0,
      isclose: true,
      tastList: [],
      examinList: [],
      solt: {},
      index: 0,
      boxHg: '',
      isToday: true,
      boxHgs: '',
      boxHight: '',
      beforeData: {},
      afterData: {},
      listAll: {},
      startTime: '2018-6-20',
      endTime: '2018-8-10'
    }
  },
  components: {
    uploadBox
  },
  mounted () {
    // this.getShowTime()
    this.getScreenWidth()
    this.getMsgList()
  },
  computed: {
    // ...mapState({
    //   uploadList(data){
    //     return data.app.uploadFile
    //   }
    // }),
    uploadList () {
      return this.$store.state.app.uploadFile
    }
  },
  watch: {
    uploadList(data) {
      console.log('上传变化', data)
      this.getList(data)
    }
  },
  methods: {
    // 获取队列
    getList (list) {
      list.forEach(item => {
        console.log('地址', item)
      })
    },
    // 上传
    getUpload () {
      this.isclose = true
      this.$nextTick(() => {
        this.getClick()
      })
    },
    // 点击关闭
    getclose () {
      this.isclose = false
    },
    // 点击事件
    getClick () {
      $('.choice_page_ul>li').click(function() {
        $('.choice_page_ul>li').each(function() {
          $(this).removeClass("choice_page_active")
          $(this).find('.upload_gou').attr('style', 'display: none;')
        })
        $(this).addClass("choice_page_active");
        $(this).find('.upload_gou').attr('style', 'display: block;')
      })
    },
    // 获取数据
    getMsgList () {
      for (let i = 1; i < 8; i++) {
        const indexs = i * 8
        this.getBefore(indexs)
        this.getAfter(indexs)
      }
      const that = this
      var times = setTimeout(function () {
        that.getAll()
        clearTimeout(times)
      }, 1000)
    },
    // 获取前面的数据
    getBefore (number) {
       const url = this.GLOBAL.baseRouter+"/task/task/shaft"
       const items = {
         xdays: number
       }
       this.$axios.post(url, qs.stringify(items)).then(data => {
         const list = data.data.data
         const beforeData = this.beforeData
         let lists = Object.assign(beforeData, list);
         this.beforeData = lists
       })
    },
    // 添加数据到前面
    getBefores (number) {
       const url = this.GLOBAL.baseRouter+"/task/task/shaft"
       const items = {
         xdays: number
       }
       this.$axios.post(url, qs.stringify(items)).then(data => {
         const beforeData = data.data.data
         const lists = this.listAll
         let list = Object.assign(lists, beforeData);
         this.getView(list)
       })
    },
    // 获取后面的数据
    getAfter (number) {
       const url = this.GLOBAL.baseRouter+"/task/task/shaft"
       const items = {
         xdays: -number
       }
       this.$axios.post(url, qs.stringify(items)).then(data => {
         const list = data.data.data
         const afterData = this.afterData
         let lists = Object.assign(list, afterData);
         this.afterData = lists
        //  const lists = this.listAll
        //  let list = Object.assign(afterData, lists);
       })
    },
      // 插入到后面的数据
    getAfters (number) {
       const url = this.GLOBAL.baseRouter+"/task/task/shaft"
       const items = {
         xdays: number
       }
       this.$axios.post(url, qs.stringify(items)).then(data => {
         const afterData = data.data.data
         const lists = this.listAll
         let list = Object.assign(afterData, lists);
         this.getView(list)
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
         const nowList = data.data.data
         let list = Object.assign(afterLists, nowList, beforeLists);
        //  this.listAll = list
         this.getView(list)
       }, error => {
         console.log('错误', error)
       })
    },
    // 获取视图
    getView (list) {
      // console.log('获取view', list)
      let lists = []
      let tastList = []
      for (let i in list) {
        // console.log('时间列表1', i)
        lists.push(i)
        // console.log('时间列表1', i, lists)
        tastList = tastList.concat(list[i])
      }
      const index = lists.length - 1
      this.startTime = lists[0]
      this.endTime = lists[index]
      this.tastList = tastList
      this.getTimeSlot()
      this.getTast()
      this.getFeedback(list)
    },
    // 获取任务
    getTast () {
      const list = this.tastList
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
         const centWidth = clentWidth*diffDaye + (diffDaye - 1)*10
         const clienLeft = index*clentWidth + index*10
         items.centWidth = centWidth + 'px'
         items.clienLeft = clienLeft + 'px'
         items.workDay = diffDayes
         items.ends = diffEnd
         items.starts = diffStart
      })
      this.getTop()
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
          const lefts = -((index - 1) * width + (index - 1) * 10)
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
        // console.log('数据', index, items)
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
              items.top = element * 110 + 'px'
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
          items.top = num* 110 + 'px'
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
    getHieght() {
      const list = this.solt
      let ObjList = []
      for (let i in list) {
        ObjList.push(i)
      }
      const length = ObjList.length
      this.boxHg = length * 110 + 'px'
      this.boxHgs = length* 110 + 100 + 'px'
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
       this.widthAll = width *(timeNum + 1) + 10*(timeNum + 1)+ 'px'
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
      let width = Number(this.widths.split('px')[0]) + 10
      const element = document.getElementsByClassName('timeSoltFather')[0]
      const widthAll = this.widthAll
      const lefts = this.left
      var endDisX = 0
      var that = this
      const fun = function (e) {
         isClick = true
         endDisX = e.clientX - startDisX + lefts
        //  const widths = width * 8 + 70
        //  const endDisXAbs = Math.abs(endDisX)
         that.left = endDisX
         const movePx = endDisX + 'px'
        //  if (endDisX < 0) {
           element.setAttribute('style', `width: ${widthAll}; left: ${movePx}`)
        //  } else {
        //    element.setAttribute('style', `width: ${widthAll}; left: ${movePx}`)
        //  }
      }
      let unFun = function (e) {
        document.removeEventListener('mousemove', fun, false)
        document.removeEventListener('mouseup', unFun, false)
        if (!isClick) {
          return
        }
        // const widths = width + 10
        // const objectNum = Math.round(endDisX / widths)
        // const movePxs = objectNum * widths
        // console.log('数数数', objectNum,endDisX / widths, endDisX, movePxs)
        // that.left = movePxs
        // let moves = movePxs + 'px'
        // element.setAttribute('style', `width: ${widthAll}; left: ${moves}`)
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
      var weekString = ''
      if (week === 0 || week === 6) {
        weekString = weekday[week]
      }
      date = date < 10 ? ('0' + date) : date
      const tims = {
        dateStr: month + '-' + date,
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
      const width =  $('.tiemSolt').width() - 17
      this.widths = Math.floor((width - 80) / 8 * 100) / 100 + 'px'
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
            ones[i].push(item.stage)
          }
        })
      }
      for (let k in ones) {
        const list = ones[k]
        list.forEach((items, index) => {
          items.centWidths = clentWidth + 'px'
          items.chilrenLeft = clentWidth / 2 + 'px'
          items.top = index * 210 + 'px'
          heightList.push(index * 210)
          allList.push(items)
        })
      }
      heightList.sort()
      const height_min =  $(window).height() - 310 // 300是除去他元素的总高度
      // console.log('窗口大小', heightsss)
      const length = heightList.length - 1
      const boxHgs = Number(this.boxHgs.split('px')[0])
      if (length >= 0) {
        const lengths = boxHgs + heightList[length] + 150
        if (lengths > height_min) {
           this.boxHight = boxHgs + heightList[length] + 150 + 'px'
        } else {
          this.boxHight = height_min + 'px'
        }
        // console.log('下方数据', boxHgs, heightList[length])
      } else {
        if (boxHgs > height_min) {
           this.boxHight = boxHgs + 'px'
        } else {
           this.boxHight = height_min + 'px'
        }
      }
      this.examinList = allList
    }
  }
}
</script>
<style scoped>
.my_task_top,
.my_task_bottom{
  width: 200px;
  height: 60px;
  color: #ffffff;
  line-height: 60px;
  text-align: center;
  font-size: 18px;
}
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
  padding: 10px 50px;
}
.times_box{
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 16px;
  border: 1px solid rgb(72,197,183);
  margin: 10px 10px 0px 0px;
  float: left;
}
.tiemSolt{
 width: 100%;
 /* min-height: 643px; */
 margin: 50px 0px;
 overflow: hidden;
 position: relative;
}
.times_box>span:nth-child(2) {
  margin-right: 10px;
}
.task_top_box{
  position: absolute;
  height: 100px;
  padding: 10px;
  overflow: hidden;
  background: rgb(72,197,183);
}
.timeSoltFather{
  position: absolute;
  top: 0;
}
.task_ka{
 width: 100%;
 /* height: 50px; */
 position: relative;
}
.my_strip{
 width: calc(100% - 200px);
 height: 10px;
 background: rgb(72,197,183);
}
.my_strips{
  width: calc(100% - 200px);
  height: 60px;
  border-bottom: 10px solid  rgb(26,153,170);
}
.myTaskAll>div{
  float: left;
}
.upload_preview_box{
  width: 80px;
  height: 80px;
  position: absolute;
  top: 10px;
  right: 20px;
  cursor: pointer;
  text-align: center;
  line-height: 80px;
  color: #ffffff;
  border: 1px dashed #ffffff;
}
.task_describe{
  width: calc(100% - 100px);
  height: 100%;
}
.task_describe_title{
  width: 100%;
  height: 60px;
}
.task_describe_title>div{
  float: left;
}
.task_describe_msg{
  font-size: 20px;
  color: #ffffff;
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
.task_icon>P{
 width: 50px;
 height: 30px;
 float: left;
 margin-right: 10px;
 text-align: center;
 line-height: 30px;
 font-size: 18px;
 color: #ffffff;
 background: rgb(255,92,51);
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
 height: 150px;
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
.no_msg{
  position: absolute;
  width: 50px;
  height: 50px;
  right: 10px;
  top: 80px;
  cursor: pointer;
}
.no_left_msg{
  position: absolute;
  width: 50px;
  height: 50px;
  left: 10px;
  bottom: 80px;
  cursor: pointer;
}
.no_left_msg>p:nth-child(2){
  margin-left: 10px;
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
.upload_page{
  width: 556px;
  height: 800px;
  position: fixed;
  top: 70px;
  left: 50%;
  margin-left: -250px;
  background: #ffffff;
  border: 1px solid rgb(25,250,40);
}
.upload_page_header {
  width: 100%;
  height: 60px;
  /* line-height: 60px; */
  border-bottom: 1px solid rgb(228,228,228);
}
.upload_header_ce{
  display: block;
  float: left;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin: 15px 0px 0px 10px;
  background: rgb(250,51,0);
  color: #ffffff;
}
.upload_header_title{
  display: block;
  float: left;
  font-size: 18px;
  font-weight: bold;
  color: rgb(24,191,164);
  margin: 20px 0px 0px 10px;
}
.upload_page_close{
  position: absolute;
  right: 10px;
  top: 20px;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  cursor: pointer;
  background: rgb(250,51,0);
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
.choice_page_ul {
  width: 100%;
  height: 40px;
  margin: 20px 0px;
}
.choice_page_ul li{
  position: relative;
  width: 100px;
  height: 100%;
  float: left;
  cursor: pointer;
  border: 1px solid rgb(215,215,215);
}
.choice_page_ul li>p{
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 40px;
}
.choice_page_active{
  border: 1px solid rgb(250,51,0)!important;
  color: rgb(250,51,0);
}
.upload_gou{
  display: none;
 font-size: 15px;
 position: absolute;
 right: 5px;
 top: 0;
 color: rgb(24,191,164);
}
.upload_jiao{
  position: absolute;
  right: 10px;
  top: -15px;
  width: 70px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  border-radius: 10px;
  background: rgb(0,204,0);
  color: #ffffff;
  transform: rotate(10deg);
}
.choice_title_Stand{
  margin-top: 10px;
}
.choice_title_Stand>span:first-child{
  float: left;
  font-size: 16px;
  color: rgb(24,191,164);
}
.choice_title_Stand>span:last-child{
  float: right;
  font-size: 14px;
  color: rgb(215,215,215);
}
.upload_box{
  width: 100%;
  height: 400px;
  margin-top: 50px;
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
.prompt_title{
  font-size: 18px;
  color: rgb(215,215,215);
  margin-left: 10px;
  cursor: pointer;
}
.font_class{
 font-size: 30px;
 cursor: pointer;
 color: rgb(215,215,215);
}
.uploadContainer{
  top: 50%;
  text-align: center;
}
.title_all{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 45px;
}
.browse{
 width: 100%;
 height: 45px;
 opacity: 0;
}
</style>
