<template>
  <div class="sort">
    <ul>
      <li v-for="(item,index) in sortList" :key="index" :class="{'actived': sortIndex == index}" @click="choseSort(index)">
        <i class="descIcon"></i>
        <!-- <Icon :type='item.icon'></Icon> -->
        {{item.label}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'sort',
  data() {
    return {
      sortIndex: 0
    }
  },
  props: {
    num: {
      type: Number,
      default: 0
    },
    sortList: {
      type: Array,
      default: []
    }
  },
  methods: {
    choseSort(index) {
      this.sortIndex = index
      this.$emit('choiced',index)
    }
  }
}
</script>

<style scoped>
  /* .sort li:before{
   content:url(/src/images/desc.png); 
  width: 14px;
  height: 14px;
  background: url(/src/images/desc.png) no-repeat;
}   */
.descIcon{
  width: 14px;
  height: 14px;
  background: url(/src/images/desc.png) no-repeat center center / 100% 100%;
  display: block;
  position: relative;
  top: 12px;
}
</style>
