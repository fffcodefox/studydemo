<!--
  示例 03：class 与 style 绑定
  覆盖知识点：
    1. class 对象语法：{ 类名: 布尔值 }
    2. class 数组语法：[a, b] 以及数组里嵌对象 [a, { b: cond }]
    3. 静态 class 与动态 :class 可以共存（Vue 会自动合并）
    4. style 对象语法（推荐）：属性名用驼峰 camelCase 或短横线 'font-size'
    5. style 数组语法：多个样式对象合并
    6. 自动添加浏览器前缀（Vue 会为需要前缀的 CSS 属性自动处理）
    7. v-bind:style 与 CSS-in-JS 变量（CSS v-bind 见示例 20）
-->
<template>
  <div class="demo">
    <!-- 1. class 对象语法：key 是类名，value 为真时该类生效 -->
    <p :class="{ active: isActive, 'text-danger': hasError }">
      对象语法：active={{ isActive }}，text-danger={{ hasError }}
    </p>

    <!-- 2. class 数组语法：直接列出要应用的类名（通常配合 ref 动态切换） -->
    <p :class="[baseClass, isActive ? 'active' : '']">数组语法（含三元）</p>

    <!-- 3. 数组 + 对象混合：最常见的写法 -->
    <p :class="[baseClass, { active: isActive }]">数组里嵌对象</p>

    <!-- 4. 静态 class 与动态 class 共存：最终 class="demo-text active" -->
    <p class="demo-text" :class="{ active: isActive }">静态 + 动态 class 会合并</p>

    <!-- 5. style 对象语法：推荐写法，属性名用驼峰 -->
    <p :style="{ color: textColor, fontSize: fontSize + 'px', fontWeight: 700 }">
      style 对象语法
    </p>

    <!-- 6. style 数组语法：多个样式对象按顺序合并，后面的覆盖前面的 -->
    <p :style="[baseStyle, overrideStyle]">style 数组语法（后覆盖前）</p>

    <!-- 7. 组件上的 class 会自动透传到子组件的根元素（单根组件），见示例 13 -->

    <div class="ops">
      <button @click="isActive = !isActive">切换 active</button>
      <button @click="hasError = !hasError">切换 error</button>
      <button @click="fontSize += 2">字号 +2</button>
      <button @click="textColor = textColor === '#d4380d' ? '#389e0d' : '#d4380d'">
        切换颜色
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 控制 class 的开关
const isActive = ref(true)
const hasError = ref(false)

// 数组语法里用到的基础类名
const baseClass = ref('demo-text')

// 控制 style
const textColor = ref('#389e0d')
const fontSize = ref(16)

// style 对象也可以整体定义（reactive 便于后续整体替换）
const baseStyle = reactive({ color: 'var(--brand)', padding: '4px 8px' })
const overrideStyle = reactive({ color: '#722ed1', backgroundColor: '#f9f0ff' })
</script>

<style scoped>
/* 这些类在 <style scoped> 中定义，同样可以被 :class 动态绑定 */
.active {
  background: var(--brand-light);
  border-left: 4px solid var(--brand);
}
.text-danger {
  color: #d4380d;
}
.demo-text {
  margin: 6px 0;
  padding: 4px 8px;
}
.ops {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
