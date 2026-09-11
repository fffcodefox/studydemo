<!--
  子组件：演示 defineEmits 的「对象写法」（带参数校验）
  父组件用法：<RatingStars :value="score" @change="score = $event"/>
-->
<template>
  <div class="rating">
    <span
      v-for="n in 5"
      :key="n"
      class="star"
      :class="{ on: n <= value }"
      @click="select(n)"
    >
      ★
    </span>
  </div>
</template>

<script setup lang="ts">
// 对象写法：值可以是 null（不校验）或一个校验函数
// 校验函数返回 false 时会在控制台给出警告（不会阻断程序）
const emit = defineEmits({
  change: (value: number) => {
    if (typeof value !== 'number') {
      console.warn('change 事件的参数必须是数字')
      return false
    }
    if (value < 1 || value > 5) {
      console.warn('评分必须在 1~5 之间')
      return false
    }
    return true
  },
})

defineProps<{ value: number }>()

const select = (n: number) => {
  emit('change', n)
}
</script>

<style scoped>
.star {
  cursor: pointer;
  font-size: 22px;
  color: #d9d9d9;
}
.star.on {
  color: #faad14;
}
</style>
