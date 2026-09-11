<!--
  示例 18：内置组件 Teleport / Transition / TransitionGroup
  覆盖知识点：
    ● Teleport：把 DOM 渲染到指定位置（如 body），解决 z-index / overflow 裁剪问题
      - to：目标选择器；disabled：是否禁用传送
    ● Transition：给「单个元素/组件」的进入/离开加过渡动画
      - 6 个 class：v-enter-from / v-enter-active / v-enter-to / v-leave-from / v-leave-active / v-leave-to
      - name 属性决定 class 前缀（name="fade" → fade-enter-from）
      - appear：初次渲染也播放动画
    ● TransitionGroup：给「列表」的增删和移动加动画
      - 必须给子元素加 :key
      - .xxx-move 控制移动过渡
-->
<template>
  <div class="demo">
    <h4>1. Teleport（把内容传送到 body）</h4>
    <button @click="showModal = true">打开弹窗</button>
    <label class="switch">
      <input type="checkbox" v-model="teleportDisabled"/> 禁用传送（在原地渲染）
    </label>

    <!-- to="body"：DOM 结构会被移动到 body 下，但组件的逻辑父子关系不变 -->
    <Teleport to="body" :disabled="teleportDisabled">
      <div v-if="showModal" class="modal-mask" @click.self="showModal = false">
        <div class="modal">
          <p>我是一个弹窗（打开 F12 看我渲染在哪个位置）</p>
          <button @click="showModal = false">关闭</button>
        </div>
      </div>
    </Teleport>

    <h4>2. Transition（单元素过渡）</h4>
    <button @click="show = !show">{{ show ? '隐藏' : '显示' }}</button>
    <!-- name="fade"：对应的 class 是 .fade-enter-from 等 -->
    <Transition name="fade">
      <p v-if="show" class="box">淡入淡出的方块</p>
    </Transition>

    <!-- 滑入滑出 + 初次渲染动画（appear） -->
    <button @click="show2 = !show2">切换（slide + appear）</button>
    <Transition name="slide" appear>
      <p v-if="show2" class="box">滑动的方块</p>
    </Transition>

    <h4>3. 多个元素/组件过渡（mode 控制顺序）</h4>
    <button @click="mode = mode === 'out-in' ? 'in-out' : 'out-in'">
      当前 mode：{{ mode }}（out-in=先出后进，in-out=先进后出）
    </button>
    <!-- mode 决定两个元素切换的先后顺序，默认同时（会重叠） -->
    <Transition name="fade" :mode="mode">
      <p v-if="show3" key="a" class="box">内容 A</p>
      <p v-else key="b" class="box">内容 B</p>
    </Transition>
    <button @click="show3 = !show3">切换 A / B</button>

    <h4>4. TransitionGroup（列表过渡）</h4>
    <button @click="insert">随机插入</button>
    <button @click="remove">随机删除</button>
    <button @click="shuffle">打乱</button>
    <TransitionGroup name="list" tag="ul" class="list">
      <li v-for="item in items" :key="item" class="list-item">{{ item }}</li>
    </TransitionGroup>
    <p class="tip">
      tag="ul" 指定外层容器标签；.list-move 让元素位置变化时平滑移动
    </p>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

// Teleport
const showModal = ref(false)
const teleportDisabled = ref(false)

// Transition
const show = ref(true)
const show2 = ref(true)
const show3 = ref(true)
// mode 的类型要用字面量联合类型，才能正确传给 <Transition> 的 mode 属性
const mode = ref<'out-in' | 'in-out'>('out-in')

// TransitionGroup
const items = ref([1, 2, 3, 4, 5])
let seed = 6

const insert = () => {
  items.value.splice(Math.floor(Math.random() * items.value.length), 0, seed++)
}
const remove = () => {
  items.value.splice(Math.floor(Math.random() * items.value.length), 1)
}
const shuffle = () => {
  items.value = [...items.value].sort(() => Math.random() - 0.5)
}
</script>

<style scoped>
/* ===== Transition：fade ===== */
/* 进入前 / 离开后 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
/* 进入和离开的整个过程（定义过渡曲线和时长） */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}

/* ===== Transition：slide ===== */
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
}

/* ===== TransitionGroup：list ===== */
.list {
  list-style: none;
  padding: 0;
  margin: 8px 0;
}
.list-item {
  padding: 4px 8px;
  background: var(--brand-light);
  margin-bottom: 4px;
  border-radius: 4px;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
/* 位置变化时的过渡（必须加，否则打乱时是瞬间跳变） */
.list-move {
  transition: transform 0.4s ease;
}
/* 离开时脱离文档流，让其他元素能平滑移动 */
.list-leave-active {
  position: absolute;
}

/* ===== 弹窗样式（Teleport 到 body 后，scoped 样式依然生效） ===== */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  min-width: 240px;
  text-align: center;
}

.box {
  background: var(--brand-lighter);
  border: 1px solid var(--brand-border);
  padding: 8px;
  border-radius: 4px;
  margin: 6px 0;
}
.switch {
  margin-left: 12px;
  font-size: 13px;
}
.tip {
  font-size: 12px;
  color: var(--text-sub);
}
h4 {
  margin: 14px 0 6px;
  font-size: 14px;
  color: var(--brand);
}
</style>
