<template>
  <div class="clearfix real_time_room">
    <div class="header_realTime_room">
       <ul class="header_navigation">
         <li v-for='(item, index) in headerList' :key="index" @click="getOpen(item)" :class="item.itemStyle">
           <span class="object_name">{{item.name}}</span>
           <span v-show="nums[`project_${item.id}`]" class="message_style">{{nums[`project_${item.id}`]}}</span>
           </li>
       </ul>
    </div>
    <div class="body_realTime_room">
       <real-ymy :data='list'></real-ymy>
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
  },
  computed : {
    getList () {
      var obj = this.$store.state.useList
      this.submitMsg(obj)
    }
  },
  watch: {
    getList(e) {
      console.log('数据', e)
    },
  },
  methods: {
    // 界面初始话
    filterObj () {
      const obj = this.headerList[0]
      // console.log('数据', obj)
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
         console.log('左边数据', list)
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
    getOpen (item) {
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
        id: `project_${item.id}`
      }
      if (localStorage.nums) {
        const nums = JSON.parse(localStorage.nums)
        const numList = JSON.parse(localStorage.numList)
        nums[`project_${item.id}`] = numList[`project_${item.id}`]
        localStorage.nums = nums
      }
    },
    // 显示还有多少未读
    submitMsg(obj) {
      const list = Array.from(obj)
      const headerList = this.headerList
      var numList = {}
      var index = 0
      if (!localStorage.numList) {
        if (headerList.length !== 0) {
          headerList.forEach(item => {
            const projectName =  `project_${item.id}`
            list.forEach(elements => {
            if (projectName === elements.group_id) {
              index++
              numList[projectName] = index
            }
            })
          })
          localStorage.numList = JSON.stringify(numList)
          this.nums = numList
          localStorage.nums = JSON.stringify(numList)
        }
      } else {
        const numberList = JSON.parse(localStorage.numList)
        headerList.forEach(item => {
          const projectName =  `project_${item.id}`
          list.forEach(elements => {
          if (projectName === elements.group_id) {
            index++
            numList[projectName] = index
           }
          })
        })
        for (let i in numList) {
          for (let k in numberList) {
            if (i === k) {
              this.nums[k] = numList[i] - numberList[k]
            }
          }
        }
        this.$nextTick(() => {
          localStorage.nums = JSON.stringify(this.nums)
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
