<!--
  示例：有内部状态的子组件
  用途：在示例 04（v-if vs v-show）中演示「v-if 会销毁重建，v-show 只是隐藏」
  —— 组件内部有自己的计数状态，被销毁后重建，计数会归零
-->
<template>
  <div class="child">
    <span class="tag">{{ keyName }}</span>
    <span>内部计数：{{ innerCount }}</span>
    <button @click="innerCount++">内部 +1</button>
    <span class="mounted">{{ mountedText }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// defineProps：接收父组件传入的属性（TS 写法，见示例 13）
const props = defineProps<{ keyName: string }>()

const innerCount = ref(0)
const mountedText = ref('')

// 每次挂载都会执行；被 v-if 销毁再重建时会再次打印
onMounted(() => {
  mountedText.value = '已挂载'
  console.log(`[${props.keyName}] 子组件 onMounted`)
})

onUnmounted(() => {
  console.log(`[${props.keyName}] 子组件 onUnmounted（说明被真正销毁了）`)
})
</script>

<style scoped>
.child {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.tag {
  background: var(--brand);
  color: #fff;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 11px;
}
.mounted {
  color: #52c41a;
}
</style>
