<!--
  子组件：演示各种插槽
  插槽 = 子组件留一个「占位符」，由父组件决定这里显示什么
-->
<template>
  <div class="card">
    <!-- 具名插槽 header：$slots.header 判断是否传入，没传就不渲染这一块 -->
    <div v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </div>

    <!-- 默认插槽（名字是 default）：
         ① 中间的内容是「后备内容」，父组件没传时显示
         ② :user="user" 是插槽 prop，父组件可以通过作用域插槽拿到 -->
    <div class="card-body">
      <slot :user="user">
        <p class="placeholder">（这是子组件的后备内容：父组件没传任何内容时显示）</p>
      </slot>
    </div>

    <!-- 具名插槽 footer -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 子组件的数据，通过插槽 prop 暴露给父组件（作用域插槽）
const user = ref({ name: '张三（来自子组件）', age: 20 })
</script>

<style scoped>
.card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin: 8px 0;
  overflow: hidden;
}
.card-header {
  background: #f0f7ff;
  padding: 8px 12px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
}
.card-body {
  padding: 12px;
}
.card-footer {
  background: #fafafa;
  padding: 6px 12px;
  border-top: 1px solid #e5e7eb;
  font-size: 12px;
  color: #888;
}
.placeholder {
  color: #bbb;
  font-size: 12px;
  margin: 0;
}
</style>
