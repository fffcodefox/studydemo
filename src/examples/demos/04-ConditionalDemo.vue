<!--
  示例 04：条件渲染 v-if / v-show
  覆盖知识点：
    1. v-if / v-else-if / v-else 必须紧挨着写，中间不能插入其他元素
    2. 在 <template> 上使用 v-if 控制「一组元素」
    3. v-show 只是切换 display:none，元素始终存在于 DOM
    4. v-if vs v-show 的选择依据（真实销毁 vs 频繁切换）
    5. v-if 是「真正」的条件渲染：切换时子组件会销毁/重建，会触发生命周期
    6. Vue 3 中 v-if 的优先级高于 v-for（不要在同一元素上同时用，见示例 05）
-->
<template>
  <div class="demo">
    <!-- 1. 单分支 -->
    <p v-if="isLogin">欢迎回来，{{ username }}！</p>

    <!-- 2. 多分支：v-else / v-else-if 必须紧跟在 v-if 元素之后 -->
    <p v-if="score >= 90">优秀（{{ score }} 分）</p>
    <p v-else-if="score >= 60">及格（{{ score }} 分）</p>
    <p v-else>不及格（{{ score }} 分）</p>

    <!-- 3. 用 <template> 包裹一组元素统一控制，template 本身不会渲染成真实 DOM -->
    <template v-if="isLogin">
      <p>这一行和下一行是一组，会同时显示/隐藏</p>
      <p>template 标签不会出现在最终的 DOM 里</p>
    </template>

    <!-- 4. v-show：元素始终在 DOM 中，只是加了 style="display: none" -->
    <p v-show="isLogin">v-show 控制的段落（打开控制台可以看到它一直存在）</p>

    <!-- 5. 对比演示：v-if 会销毁重建（子组件状态丢失），v-show 会保留 -->
    <div class="box">
      <StatefulChild v-if="showIf" key-name="v-if"/>
      <p v-else class="tip">v-if 为 false：子组件被销毁，内部计数归零</p>
    </div>
    <div class="box">
      <StatefulChild v-show="showShow" key-name="v-show"/>
    </div>

    <div class="ops">
      <button @click="isLogin = !isLogin">切换登录状态</button>
      <button @click="score = (score + 25) % 130">随机改分数</button>
      <button @click="showIf = !showIf">切换 v-if（再切回来观察计数）</button>
      <button @click="showShow = !showShow">切换 v-show（计数会保留）</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import StatefulChild from './parts/StatefulChild.vue'

const isLogin = ref(false)
const username = ref('张三')
const score = ref(3)

// 用于对比 v-if 销毁重建 与 v-show 保留状态
const showIf = ref(true)
const showShow = ref(true)
</script>

<style scoped>
.box {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  padding: 8px;
  margin: 8px 0;
  min-height: 48px;
}
.tip {
  color: #999;
}
.ops {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
