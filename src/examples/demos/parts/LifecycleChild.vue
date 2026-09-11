<!--
  子组件：生命周期演示
  说明：父组件通过 prop 传入日志函数，子组件在自己的生命周期钩子里调用它
-->
<template>
  <div class="child">
    <p>我是子组件（挂载/卸载我，观察父组件日志区的变化）</p>
    <p>子组件内部状态 count = {{ count }}</p>
    <button @click="count++">内部 count++</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted } from 'vue'

// 接收父组件传来的日志函数（函数也可以作为 prop 传递）
const props = defineProps<{ logger?: (msg: string) => void }>()

const count = ref(0)

const log = (msg: string) => {
  props.logger?.(`　[子组件] ${msg}`)
}

onBeforeMount(() => log('onBeforeMount'))
onMounted(() => log('onMounted'))
onBeforeUpdate(() => log('onBeforeUpdate'))
onUpdated(() => log('onUpdated'))
onBeforeUnmount(() => log('onBeforeUnmount'))
onUnmounted(() => log('onUnmounted'))
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
