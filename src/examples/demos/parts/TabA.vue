<!--
  Tab A：用于动态组件演示
  注意：onActivated / onDeactivated 只在被 <KeepAlive> 包裹时才会触发
-->
<template>
  <div>
    <p>Tab A 内部计数：{{ count }}</p>
    <input v-model="text" placeholder="输入点内容，切换 Tab 看是否保留"/>
    <p>输入内容：{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'

const count = ref(0)
const text = ref('')

onMounted(() => console.log('TabA onMounted（首次挂载）'))
onUnmounted(() => console.log('TabA onUnmounted（被销毁）'))
// 被 KeepAlive 缓存时，切换走触发 deactivated，切回来触发 activated（不会触发 mounted/unmounted）
onActivated(() => console.log('TabA onActivated（从缓存中恢复）'))
onDeactivated(() => console.log('TabA onDeactivated（被缓存起来）'))
</script>
