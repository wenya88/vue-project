<template>
  <div class="classify">
    <div class="title"><i class="icon iconfont icon-company" ></i>{{title}}
      <slot name="title"></slot>
      ({{number}})
      <slot name="number"></slot>
    </div>
    <div class="auth">
      <ul class="fMenu">
        <li v-for="(item,index) in postList" :key="index" :class="{'actived': FMenuIndex == index}" @click="openTable(index,item.id,postList)">
          {{item.name}}(<span class="fMwnu-deful">默认</span> )
          <span class="numStyle">{{item.member_count}}</span>
        </li>
      </ul> 
      <!-- <i class="icon iconfont icon-jia" ></i> -->
    </div>
  </div>
</template>
<script>
export default {
  name: 'authTypeMenu',
  data() {
    return {
      FMenuIndex: null,
      SMenuIndex: null
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    number: {
      type: String,
      default: ''
    },
    postList: {
        type: Array,
        default: []
    }
  },
  methods: {
    /**
     * 改变类型项
     */
    changeFMenu(active) {
      this.$emit('on-change', active);
      // console.log(active);
    },
    changeSMenu(active) {
      this.$emit('on-change', active);
      // console.log(active);
    },
    openTable(index, postId, postList) {
      this.FMenuIndex = index
      this.$emit('openAuth', index, postId, postList);
    },
  },
  computed: {

  }
}
</script>
<style scoped lang="less">
.title{
    height: 48px;
    line-height: 48px;
    text-align: center;
    background: rgba(34, 215, 187, 0.176470588235294);
    padding: 0 40px;
    width: 362px;
    font-size: 16px;
    
}
.icon-company{
    font-size: 22px;
    padding-right: 12px;
    font-weight: bold;
}
.icon-jia{
    color: #FCC44A;
    font-size: 24px;
    padding-left: 42px;
}
.fMenu {
  height: auto;
  line-height: 50px;
}
.fMwnu-deful{
  color:  #657180;
}

.fMenu li {
  cursor: pointer;
  padding: 0 20px;
  padding-left: 72px;
  font-size: 14px;
}

.fMenu li:hover {
  background: #f2f2f2;
  /* border-right: 3px solid #31bb9f; */
  color: #31bb9f;
}

.fMenu li.actived {
    background: linear-gradient(to right,#78DDCD,#E2F8F4)!important;
    /* border:0!important; */
    border-left: 3px solid #31bb9f!important;
    color: #fff!important;
    .fMwnu-deful{
      color: #fff;
    }
}

.fMenu li:hover .more {
  display: block;
}

.editItem {
  text-align: center;
  line-height: 30px;
}

.numStyle,
.more {
  float: right;
}

.more,
.fMenu li:hover .numStyle {
  display: none;
}

.ivu-menu-light {
  background: #fff !important;
}

.ivu-menu-vertical .ivu-menu-item:hover,
.ivu-menu-vertical .ivu-menu-submenu-title:hover {
  background: #f3f3f3 !important;
}

.ivu-tabs-bar {
  margin-bottom: 0 !important;
}

.ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab,
.ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab {
  width: 100px !important;
  text-align: center !important;
}
</style>
