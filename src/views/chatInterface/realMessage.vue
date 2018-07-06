<template>
  <div class="clearfix real_time_room">
    <div class="header_realTime_room">
       <ul class="header_navigation">
         <li v-for='(item, index) in headerList' :key="index" @click="getOpen(item, index)" :class="item.itemStyle">
           <span class="object_name">{{item.name}}</span>
           <span class="message_style" v-if="nums[`project_${item.id}`]">{{nums[`project_${item.id}`]}}</span>
           </li>
       </ul>
    </div>
    <div class="body_realTime_room">
       <real-ymy :data='list' v-for="(item, idx) in headerList" :key="idx" v-if="index === idx"></real-ymy>
    </div>
  </div>
</template>
<script>
var qs = require('querystring')
import realYmy from './realTime.vue'
export default {
  data () {
    return {
      headerList: [],
      index: 0,
      list: {
        id: '',
        absold: false
      },
      nums: {}
    }
  },
  components: {
    realYmy
  },
  created () {
    this.getObject()
    // console.log('刷新', JSON.stringify(localStorage.nums))
    if (localStorage.nums) {
      const nums =  JSON.parse(localStorage.nums)
    }
  },
  computed : {
    getList () {
      return this.$store.state.useList
    }
  },
  watch: {
    getList(e) {
      this.submitMsg(e)
    },
  },
  methods: {
    // 界面初始话
    filterObj () {
      const obj = this.headerList[0]
      this.list.id = `project_${obj.id}`
      
    },
    // 判断项目地址
    getObject () {
      let url = this.GLOBAL.baseRouter+"/task/project/get-list-by-member"
      const items = {
        id: 1
      }
      let that = this
      this.$axios.get(url, qs.stringify(items)).then(data => {
        // console.log('返回数据', data.data.project)
        const list = data.data.project
        if (list.length !== 0) {
          list.forEach((elemens, index) => {
            elemens.itemStyle = 'clearfix'
            elemens.num = 0
            if (index === 0) {
             elemens.itemStyle =  'clearfix ymy_is_active'
          }
         })
         that.headerList = list
        //  console.log('左边数据', list)
         this.filterObj()
          this.list.absold = true
        } else {
          this.list.absold = false
        }
      }, error => {
        console.log('返回报错', error)
      })
    },
    // websoket
    // threadPoxis () {
    //   const msgDatas = JSON.stringify({
    //     action:'group-chat',
    //     group_id:'project_1',
    //     msg:'你好呀'
    //   })
    //   this.threadPoxi(msgDatas)
    // },
    getOpen (item, index) {
      this.index = index
      const list = this.headerList
      list.forEach(elements => {
        elements.itemStyle = ''
        if (elements.name === item.name) {
          elements.itemStyle = 'ymy_is_active'
        } else {
          elements.itemStyle = ''
        }
      })
      this.list = {
        id: `project_${item.id}`,
        absold: true
      }
      if (localStorage.nums) {
        const nums = JSON.parse(localStorage.nums)
        const numList = JSON.parse(localStorage.numList)
        nums[`project_${item.id}`] = 0
        this.nums[`project_${item.id}`] = 0
        localStorage.nums = JSON.stringify(nums)
        this.$store.state.nums = nums
      }
    },
    // 显示还有多少未读
    submitMsg(obj) {
      const list = Array.from(obj)  // 获取总的消息
      const headerList = this.headerList // 获取项目消息
      var numList = {} // 定义一个对象
      var nums = {} // 定义一个对象储存
      const currentPoject = this.list.id // 获取当前显示的项目
      if (!localStorage.numList) { // 初始化,没有消息时
        const numForm = {}
        if (headerList.length !== 0) { // 项目不为空，才有意义
          headerList.forEach(item => {
            const projectName =  `project_${item.id}` // 获取项目id
            list.forEach(elements => {
              numForm[projectName] = []
              if (elements.group_id === projectName) { // 不在当前显示的，开始计数
                const lists = numForm[projectName].push(elements)
                // console.log('出书化', lists)
                numList[projectName] = lists // 获取当前每个项目消息总数
                if (currentPoject !== elements.group_id) { // 如果不是当前显示的项目
                  nums[projectName] = lists
                } else {
                  nums[projectName] = 0 // 当前显示项目为
                }
              }
            })
          })
          localStorage.numList = JSON.stringify(numList) // 储每个项目消息总数
          this.nums = nums
          localStorage.nums = JSON.stringify(nums) // 储存未显示消息
          this.$store.state.nums = nums
        }
      } else {
        const numForm = {}
        const numberList = JSON.parse(localStorage.numList) // 获取上次储存的每个项目消息
        const numed = JSON.parse(localStorage.nums) // 获取未读消息
        headerList.forEach(item => {  // 项目数
          const projectName =  `project_${item.id}`
          numForm[projectName] = []
          list.forEach(elements => {
            if (projectName === elements.group_id) {
               const lists = numForm[projectName].push(elements)
              //  console.log('长度', lists)
               numList[projectName] = lists // 获取现在每个消息的总数
            }
          })
        })
        // console.log('项目0', numList)
        for (let i in numList) { // 循环现在消息总数
          for (let k in numberList) { // 获取上一个消息总数
            if (i === k) {
              if (currentPoject === i) {
                numed[i] = 0
                // console.log(222222, i)
              } else {
                //  console.log(222, i, numList[i], k, numberList[k], numbers)
                 const numbers = Number(numList[i]) - Number(numberList[k])
                 if (numbers!==0) {
                   numed[i]+=numbers
                 }
              }
            }
          }
        }
        this.$nextTick(() => {
          // console.log('项目', numed)
          this.nums = numed
          localStorage.nums = JSON.stringify(numed)
          this.$store.state.nums = numed
        })
        localStorage.numList = JSON.stringify(numList)
      }
    }
  }
}
</script>
<style scoped>
.real_time_room{
 width: 100%;
 height: calc(100% - 54px);
}
.header_realTime_room{
 width: 120px;
 height: 100%;
 /* background: rgba(215,247,239,1); */
 float: left;
}
.header_navigation{
 box-sizing:border-box;
 width: 100%;
 height: 100%;
 /* padding-left: 20px; */
}
.body_realTime_room{
  box-sizing: border-box;
  width:calc(100% - 120px);
  height:100%;
  background: #ffffff;
  border-left: 1px solid rgb(228,228,228);
  float: left;
}
.header_navigation>li{
  list-style: none;
  width: 100%;
  height: 30px;
  line-height: 30px;
  color: rgba(201,201,201,1);
  /* margin-left: 40px; */
  font-size: 14px;
  text-align: center;
  position: relative;
  cursor: pointer;
}
.header_navigation>li>span{
 float: left;
 margin-left: 5px;
}
.header_navigation>li:first-child{
  margin-left: 0px;
}
.message_style {
  padding: 0 5px;
  height: 20px;
  line-height: 20px;
  margin-top: 5px;
  background: rgba(255,153,0,1);
  border-radius: 10px;
  color: #ffffff;
}
.ymy_is_active{
  color: #000000!important;
  font-weight: bolder;
}
.clearfix:after{
  content:"";
  height:0;
  line-height:0;
  display:block;
  visibility:hidden;
  clear:both;
}
.clearfix{
  zoom:1;
}
.object_name{
  display: inline-block;
  width: calc(100% - 50px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
