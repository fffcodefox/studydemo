<!--
  子组件：演示 defineEmits 的 TS 泛型写法（推荐）
  父组件用法：<SearchBox @search="onSearch" @reset="onReset"/>
-->
<template>
  <div class="search">
    <input v-model="text" placeholder="输入后点搜索" @keyup.enter="doSearch"/>
    <button @click="doSearch">搜索</button>
    <button @click="doReset">重置</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ✅ 推荐写法：TS 泛型声明事件
// 写法：事件名: [参数1类型, 参数2类型...]
//      没有参数就写空数组 []
const emit = defineEmits<{
  search: [keyword: string] // 带一个 string 参数
  reset: [] // 不带参数
  // 也支持这种写法：'update:modelValue': [value: string]
}>()

const text = ref('')

const doSearch = () => {
  // 触发事件，把数据传给父组件
  emit('search', text.value)
}

const doReset = () => {
  text.value = ''
  emit('reset') // 无参事件
}
</script>

<style scoped>
.search {
  display: flex;
  gap: 6px;
  margin: 6px 0;
}
</style>
