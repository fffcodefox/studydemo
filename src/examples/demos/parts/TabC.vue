<!-- Tab C：用于动态组件演示 -->
<template>
  <div>
    <p>Tab C：我是一个简单的静态内容面板</p>
    <p>当前时间：{{ now }}</p>
    <button @click="now = new Date().toLocaleTimeString()">刷新时间</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const now = ref(new Date().toLocaleTimeString())
</script>
