<template>
  <div class="sort">
    <ul>
      <li v-for="(item,index) in sortList" :key="index" :class="{'actived': sortIndex == index}" @click="choseSort(index)">
        <Icon :type='item.icon'></Icon>{{item.label}}</li>
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

<style>

</style>
