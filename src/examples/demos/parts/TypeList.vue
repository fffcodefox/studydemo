<!--
  泛型组件示例（Vue 3.3+）
  关键点：<script setup lang="ts" generic="T">
  这样组件内部的 T 会由父组件传入的数据自动推导，
  父组件写 :items="number[]" 时，formatter 的参数就是 number，类型提示完全正确
-->
<template>
  <ul class="type-list-comp">
    <li v-for="(item, index) in items" :key="index" @click="emit('select', item)">
      <!-- 有 formatter 就用它格式化，否则直接转字符串 -->
      {{ formatter ? formatter(item) : String(item) }}
    </li>
  </ul>
</template>

<script setup lang="ts" generic="T">
// defineProps 的泛型写法：直接用 TS 类型声明，最简洁
// 不需要在脚本里使用 props 时，可以不接收返回值
defineProps<{
  items: T[] // 数组元素类型由外部决定
  formatter?: (item: T) => string // 可选：自定义每一项的显示文本
}>()

// defineEmits 的泛型写法：事件名: [参数类型...]
// 这里的 item 类型同样是 T
const emit = defineEmits<{
  select: [item: T]
}>()
</script>

<style scoped>
.type-list-comp {
  list-style: none;
  padding: 0;
  margin: 4px 0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.type-list-comp li {
  background: var(--brand-lighter);
  border: 1px solid var(--brand-border);
  border-radius: 4px;
  padding: 2px 8px;
  cursor: pointer;
  font-size: 13px;
}
</style>
