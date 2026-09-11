<!--
  示例 11：生命周期钩子
  覆盖知识点（组合式 API 的钩子就是普通函数，按需引入，可多次调用）：
    onBeforeMount  → 组件挂载到 DOM 之前（此时还拿不到 DOM）
    onMounted      → 挂载完成（最常用的：发请求、操作 DOM、注册监听）
    onBeforeUpdate → 数据变化，DOM 更新之前
    onUpdated      → DOM 更新之后
    onBeforeUnmount→ 组件卸载之前（做清理工作）
    onUnmounted    → 卸载完成
    onActivated / onDeactivated → 配合 <KeepAlive> 使用（见示例 17）
    onErrorCaptured→ 捕获后代组件的错误
  注意：
    - 组合式 API 没有 onCreated / beforeCreate，因为 <script setup> 里的代码本身就相当于 created
    - 钩子必须「同步」注册，不能放在 setTimeout / 异步回调里
-->
<template>
  <div class="demo">
    <p>count = {{ count }}</p>
    <button @click="count++">count++（触发更新钩子）</button>
    <button @click="showChild = !showChild">
      {{ showChild ? '卸载' : '挂载' }}子组件
    </button>

    <!-- 子组件的挂载/卸载会打印自己的生命周期日志（通过 prop 把日志函数传进去） -->
    <LifecycleChild v-if="showChild" :logger="addLog"/>

    <h4>生命周期日志（按时间倒序）</h4>
    <div class="log-box">
      <p v-for="(l, i) in logs" :key="i" :class="l.includes('onMounted') ? 'green' : ''">{{ l }}</p>
      <p v-if="!logs.length" class="tip">暂无日志</p>
    </div>
    <button @click="logs = []">清空</button>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured,
} from 'vue'
import LifecycleChild from './parts/LifecycleChild.vue'

const count = ref(0)
const showChild = ref(true)
const logs = ref<string[]>([])

// 父组件把日志收集函数传给子组件，方便统一展示
const addLog = (msg: string) => {
  logs.value.unshift(msg)
  if (logs.value.length > 12) logs.value.pop()
}

// ⚠️ <script setup> 顶层代码本身就相当于 created / setup，最早执行
console.log('① <script setup> 顶层代码执行（相当于 created）')
addLog('① setup 阶段（最早，此时还没有 DOM）')

onBeforeMount(() => {
  addLog('② onBeforeMount：模板已编译，还没挂载到页面')
})

onMounted(() => {
  // 最常用的钩子：可以拿到 DOM，适合发请求、注册事件监听、初始化第三方库
  addLog('③ onMounted：组件已挂载，可以操作 DOM 了')
})

onBeforeUpdate(() => {
  addLog('④ onBeforeUpdate：数据变了，DOM 即将更新')
})

onUpdated(() => {
  // 注意：这里改响应式数据容易死循环，一般只用来读取更新后的 DOM
  addLog('⑤ onUpdated：DOM 已更新完成')
})

// 组件卸载时，用 onBeforeUnmount / onUnmounted 做清理工作（定时器、事件监听、订阅等）
// 模拟一个需要在卸载时清理的定时器（setInterval / addEventListener 等都要在这里清理）
const timer = setInterval(() => console.log('定时器在跑（卸载组件后会被清理）'), 5000)
onBeforeUnmount(() => {
  clearInterval(timer)
  addLog('⑥ onBeforeUnmount：清理定时器等资源')
})

onUnmounted(() => {
  addLog('⑦ onUnmounted：组件已卸载')
})

// 捕获后代组件抛出的错误，返回 false 可阻止继续向上传播
onErrorCaptured((err) => {
  addLog('❌ onErrorCaptured 捕获到错误：' + String(err))
  return false
})

// 提示：本组件没有需要暴露给父组件的内容，defineExpose 的用法见示例 12
</script>

<script lang="ts">
// 这里仅为说明：普通 <script> 可以和 <script setup> 共存，
// 用于声明选项式配置（name、inheritAttrs 等），平时很少用到
export default {
  name: 'LifecycleDemo',
}
</script>

<style scoped>
.log-box {
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 8px;
  min-height: 100px;
  font-size: 12px;
}
.log-box p {
  margin: 2px 0;
}
.green {
  color: #52c41a;
}
.tip {
  color: var(--text-weak);
}
h4 {
  margin: 14px 0 6px;
  font-size: 14px;
  color: var(--brand);
}
</style>
