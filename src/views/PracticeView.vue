<!--
  练习页 —— 你的空白画布
  ==================================================================
  这个页面专门留给你照着「需求任务」自己写代码，熟悉 Vue 3 开发，并打通前后端交互。
  现在里面几乎是空的，后续所有的练习（数据绑定、列表渲染、事件、调后端接口）都写在这里。

  入口都给你标好了，照着写就行：
    · <template>  —— 写页面结构（标签、指令 v-if / v-for、事件 @click…）
    · <script setup lang="ts"> —— 写逻辑（ref / reactive / 调 fetchHello）
    · 要调后端，取消最下面那行 import 的注释即可（对应 GET /api/hello）

  调后端的前提：先把 studydemo-backend 跑起来（默认 8080 端口），
  前端通过 Vite 代理把 /api 转过去，所以浏览器眼里是同源，不用管跨域。
-->
<template>
  <div class="practice">
    <header class="page-head">
      <p class="eyebrow">Vue 3 练习 · 你的画布</p>
      <h1>我的练习页</h1>
      <p class="lead">
        这个页面现在是空的，专门留给你照着「需求任务」往上写代码。
        从数据绑定、列表渲染，一直到调通 <code>studydemo-backend</code> 的接口，都在这个文件里完成。
      </p>
    </header>

    <!-- ↓↓↓ 你的练习代码写在这里 ↓↓↓ -->
  </div>
</template>

<script setup lang="ts">
// 后面要调后端时取消下面这行注释（GET /api/hello）
// import { fetchHello } from '@/api/hello'
</script>

<style scoped>
.practice {
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 24px 60px;
}

.page-head {
  padding-bottom: 8px;
}
.eyebrow {
  margin: 0 0 10px;
  font-size: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--brand);
}
.page-head h1 {
  margin: 0 0 14px;
  font-family: var(--font-serif);
  font-size: 38px;
  letter-spacing: 1px;
  color: #2c3719;
}
.lead {
  margin: 0;
  max-width: 720px;
  font-size: 14px;
  line-height: 1.95;
  color: var(--text-sub);
}
.lead code {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--brand);
  background: var(--brand-lighter);
  border: 1px solid var(--brand-border);
  border-radius: 4px;
  padding: 1px 6px;
}
</style>
