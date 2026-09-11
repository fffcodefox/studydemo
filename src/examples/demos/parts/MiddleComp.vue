<!--
  中间层组件：它什么都不做，只是渲染子组件
  用来证明 provide/inject 可以「跨层」传递（不用一层层 props 透传）
-->
<template>
  <div class="middle">
    <p class="tip">中间层组件（没有接收任何 props）</p>
    <ThemeConsumer/>
  </div>
</template>

<script setup lang="ts">
import ThemeConsumer from './ThemeConsumer.vue'
</script>

<style scoped>
.middle {
  border: 1px dashed #cfe0dc;
  padding: 8px;
  border-radius: 6px;
}
.tip {
  font-size: 12px;
  color: #8a9a97;
  margin: 0 0 6px;
}
</style>
