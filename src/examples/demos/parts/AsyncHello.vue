<!--
  异步组件：演示「顶层 await」+ Suspense
  <script setup> 里可以直接 await，组件会变成异步组件，
  必须配合父组件的 <Suspense> 使用（否则会警告）
-->
<template>
  <div class="async">
    <p>✅ 异步数据加载完成：{{ data }}</p>
    <p class="tip">这个组件在 setup 阶段 sleep 了 1.5 秒才渲染出来</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 模拟接口请求
const fetchData = () =>
  new Promise<string>((resolve) => {
    setTimeout(() => resolve('来自「服务端」的数据 ' + new Date().toLocaleTimeString()), 1500)
  })

const data = ref('')

// 顶层 await：会阻塞组件渲染，直到 Promise resolve
data.value = await fetchData()
</script>

<style scoped>
.async {
  color: #52c41a;
}
.tip {
  font-size: 12px;
  color: #888;
}
</style>
