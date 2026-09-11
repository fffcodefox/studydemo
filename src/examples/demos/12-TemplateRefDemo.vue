<!--
  示例 12：模板引用 ref（获取 DOM / 组件实例）
  覆盖知识点：
    1. 用 ref(null) + 模板上 ref="xxx" 获取原生 DOM 元素
    2. 获取组件实例：配合子组件 defineExpose 暴露方法/属性
    3. v-for 中的 ref：得到的是元素数组（Vue 3.5+ 也可以绑定函数）
    4. 函数 ref：:ref="(el) => {...}"，更灵活
    5. nextTick：等 DOM 更新完成后再操作
    6. 注意：必须在 onMounted 之后才能拿到 DOM（setup 阶段 DOM 还不存在）
-->
<template>
  <div class="demo">
    <!-- 1. 获取原生 DOM -->
    <input ref="inputEl" v-model="text" placeholder="我是一个 input"/>
    <button @click="focusInput">聚焦输入框（通过 DOM ref）</button>
    <button @click="changeColor">改输入框背景色</button>

    <!-- Vue 3.5+ 新增的 useTemplateRef：语义更清晰，不用先声明 ref(null) -->
    <p>
      <input ref="inputEl3" placeholder="useTemplateRef 绑定的 input"/>
      <button @click="focusByTemplateRef">聚焦它</button>
    </p>

    <!-- 2. 获取组件实例，调用子组件暴露的方法 -->
    <ChildCounter ref="childRef"/>
    <button @click="childRef?.reset()">调用子组件的 reset()</button>
    <button @click="childRef?.add(5)">调用子组件的 add(5)</button>
    <p class="tip">子组件内部的值父组件默认是看不到的，需要子组件用 defineExpose 主动暴露</p>

    <!-- 3. v-for 中的 ref：得到一个数组 -->
    <h4>v-for 中的模板引用</h4>
    <ul>
      <li v-for="item in list" :key="item" ref="itemRefs">{{ item }}</li>
    </ul>
    <button @click="highlightItems">高亮所有 li（拿到的是数组）</button>

    <!-- 4. 函数 ref：每次更新都会调用，el 是元素本身（卸载时为 null） -->
    <h4>函数 ref</h4>
    <div :ref="setBoxEl" class="fn-box">我是函数 ref 绑定的 div</div>
    <button @click="changeBox">改我的文字</button>

    <!-- 5. nextTick：数据变了但 DOM 还没更新时用 -->
    <h4>nextTick</h4>
    <button @click="addAndRead">先加列表项，再读取最新的 DOM 高度</button>
    <p class="tip">打开控制台看输出：不包 nextTick 时读到的是旧的 DOM 状态</p>

    <h4>列表（nextTick 演示）</h4>
    <ul ref="listEl">
      <li v-for="n in nums" :key="n">第 {{ n }} 项</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, useTemplateRef } from 'vue'
import ChildCounter from './parts/ChildCounter.vue'

const text = ref('')

// 1. DOM 引用：变量名必须和模板里的 ref="xxx" 一致
//    类型要写成 HTMLInputElement | null
const inputEl = ref<HTMLInputElement | null>(null)

const focusInput = () => {
  inputEl.value?.focus() // 可选链，避免 null
}
const changeColor = () => {
  if (inputEl.value) inputEl.value.style.background = '#fff7e6'
}

// 2. 组件引用：类型是子组件实例类型
//    写法一：const childRef = ref<InstanceType<typeof ChildCounter> | null>(null)
const childRef = ref<InstanceType<typeof ChildCounter> | null>(null)

// 3. v-for 的 ref 数组（Vue 3.5 以前会自动填充数组）
const list = ref(['苹果', '香蕉', '橙子'])
const itemRefs = ref<HTMLLIElement[]>([])
const highlightItems = () => {
  itemRefs.value.forEach((el) => {
    el.style.background = 'var(--brand-light)'
  })
}

// 4. 函数 ref：参数 el 是元素或组件实例，卸载时为 null
let boxEl: HTMLDivElement | null = null
const setBoxEl = (el: unknown) => {
  boxEl = el as HTMLDivElement | null
  console.log('函数 ref 被调用，el =', el)
}
const changeBox = () => {
  if (boxEl) boxEl.textContent = '文字被父组件改了 ' + Date.now()
}

// 5. nextTick
const nums = ref([1, 2, 3])
const listEl = ref<HTMLUListElement | null>(null)
const addAndRead = async () => {
  nums.value.push(nums.value.length + 1)
  // 此时 DOM 还没更新
  console.log('更新前 li 数量：', listEl.value?.children.length) // 旧值
  // 等 DOM 更新完成
  await nextTick()
  console.log('nextTick 后 li 数量：', listEl.value?.children.length) // 新值
}

// 补充：Vue 3.5+ 新增 useTemplateRef，语义更清晰（下面演示等价写法）
// 参数是模板上的 ref 名字，返回值为 null 直到组件挂载
const inputEl3 = useTemplateRef<HTMLInputElement>('inputEl3')
const focusByTemplateRef = () => {
  inputEl3.value?.focus()
}

onMounted(() => {
  console.log('onMounted：此时才拿到 DOM', inputEl.value)
  console.log('useTemplateRef 拿到的元素：', inputEl3.value)
  // ❌ 如果在 onMounted 之前访问 inputEl.value，会是 null
})
</script>

<style scoped>
.fn-box {
  border: 1px solid var(--border-strong);
  padding: 8px;
  border-radius: 4px;
  margin: 4px 0;
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
