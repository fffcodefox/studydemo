<!-- Tab B：用于动态组件演示 -->
<template>
  <div>
    <p>Tab B 内部计数：{{ count }}</p>
    <button @click="count++">+1</button>
    <p class="tip">切换到别的 Tab 再切回来，观察计数是否保留</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<style scoped>
.tip {
  font-size: 12px;
  color: var(--text-sub);
}
</style>
