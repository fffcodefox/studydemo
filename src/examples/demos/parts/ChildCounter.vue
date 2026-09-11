<!--
  子组件：演示 defineExpose
  说明：<script setup> 的组件默认是「封闭」的，父组件拿不到内部的 ref/方法。
        必须显式用 defineExpose 暴露，父组件才能通过模板 ref 访问。
-->
<template>
  <div class="child">
    <p>子组件内部 count = {{ count }}</p>
    <button @click="count++">内部 +1</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const secret = ref('这个不暴露，父组件访问不到')

// 主动暴露给父组件的成员（父组件通过 ref 调用）
const add = (n: number) => {
  count.value += n
}
const reset = () => {
  count.value = 0
}

// defineExpose 要在顶层调用
defineExpose({
  count, // 也可以暴露 ref，父组件访问时要用 .value
  add,
  reset,
  // secret 没有暴露，父组件访问 childRef.secret 会是 undefined
})
</script>

<style scoped>
.child {
  border: 1px dashed #91caff;
  background: #f0f7ff;
  border-radius: 6px;
  padding: 8px;
  margin: 8px 0;
  font-size: 13px;
}
.child p {
  margin: 4px 0;
}
</style>
