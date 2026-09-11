<!--
  示例 19：组合式函数（Composable）
  覆盖知识点：
    1. 什么是组合式函数：用组合式 API 封装「有状态逻辑」的函数
    2. 命名约定：useXxx，返回一个包含 ref 和方法的对象
    3. 在组件里解构使用，多个组件调用互不干扰（状态独立）
    4. 生命周期和事件监听的清理（onUnmounted）
    5. 参数支持普通值 / ref / getter（toValue）
    6. 对比 mixin：组合式函数没有命名冲突，来源清晰，类型友好
  提示：实际开发可以直接用社区库 VueUse（useMouse、useStorage 等上百个现成函数）
-->
<template>
  <div class="demo">
    <h4>1. useCounter —— 同一个函数，调用两次状态互相独立</h4>
    <p>计数器 A：{{ countA }}（双倍：{{ doubleA }}）</p>
    <button @click="addA">+1</button>
    <button @click="reduceA">-1</button>
    <button @click="resetA">重置</button>

    <p>计数器 B（步长 5，范围 0~20）：{{ countB }}</p>
    <button @click="addB">+5</button>
    <button @click="reduceB">-5</button>
    <span v-if="isMaxB" class="warn">已到最大值</span>

    <h4>2. useMouse —— 带副作用清理的组合式函数</h4>
    <p>鼠标位置：x={{ x }}，y={{ y }}</p>
    <button @click="enabled ? stop() : start()">
      {{ enabled ? '停止监听' : '开始监听' }}
    </button>
    <p class="tip">组件被销毁时，内部监听会自动移除（onUnmounted）</p>

    <h4>3. useLocalStorage —— 响应式数据与本地存储同步</h4>
    <input v-model="savedText" placeholder="输入内容，会自动存到 localStorage"/>
    <p>已保存：{{ savedText }}</p>
    <button @click="clearSaved">清除本地存储</button>
    <p class="tip">刷新页面后输入框内容还在（试试看）</p>

    <h4>4. toValue：参数支持 值 / ref / getter</h4>
    <p>动态步长的计数：{{ dynCount }}</p>
    <button @click="dynAdd(stepRef)">按 stepRef({{ stepRef }}) 增加</button>
    <button @click="dynAdd(10)">按固定值 10 增加</button>
    <button @click="stepRef++">stepRef +1</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// 从组合式函数文件里按需引入（真实项目中一般放在 src/composables/ 或 src/hooks/）
import { useCounter, useDynamicCounter } from '../composables/useCounter'
import { useMouse } from '../composables/useMouse'
import { useLocalStorage } from '../composables/useLocalStorage'

// 1. 计数器 A：默认配置
const { count: countA, double: doubleA, add: addA, reduce: reduceA, reset: resetA } =
  useCounter({ initial: 0, step: 1 })

// 计数器 B：步长 5，限制 0~20
const { count: countB, add: addB, reduce: reduceB, isMax: isMaxB } = useCounter({
  initial: 10,
  step: 5,
  min: 0,
  max: 20,
})

// 2. 鼠标位置：内部自己注册了事件监听，并在卸载时清理
const { x, y, enabled, start, stop } = useMouse()

// 3. 本地存储：第二个参数是默认值
const { data: savedText, clear: clearSaved } = useLocalStorage('demo-text', '')

// 4. 动态步长
const stepRef = ref(2)
const { count: dynCount, add: dynAdd } = useDynamicCounter(0)
</script>

<style scoped>
button {
  margin: 2px 6px 2px 0;
}
.warn {
  color: #d4380d;
  font-size: 12px;
  margin-left: 6px;
}
.tip {
  font-size: 12px;
  color: #7c9691;
}
h4 {
  margin: 14px 0 6px;
  font-size: 14px;
  color: var(--brand);
}
</style>
