<!--
  示例 22：TypeScript 在 Vue3 中的常见用法
  覆盖知识点：
    1. ref / reactive 的类型标注（含复杂类型和联合类型）
    2. defineProps 的泛型写法 + withDefaults（最常用）
    3. defineEmits 的泛型写法（事件名: [参数类型元组]）
    4. 模板引用 ref 的类型：HTMLInputElement | null、InstanceType<typeof Xxx>
    5. 泛型组件：<script setup lang="ts" generic="T">
    6. 事件处理函数的类型：Event / MouseEvent / KeyboardEvent
    7. 类型导入要加 import type（避免运行时开销）
-->
<template>
  <div class="demo">
    <h4>1. 泛型组件：同一个组件，传入不同类型的数据都能有类型提示</h4>
    <!-- 传 string[] -->
    <TypeList :items="strList" :formatter="(s: string) => s.toUpperCase()"/>
    <!-- 传 number[]，formatter 的参数类型会自动推导成 number -->
    <TypeList :items="numList" :formatter="(n: number) => `￥${n}`"/>

    <h4>2. 事件处理函数的类型标注</h4>
    <input @input="onInput" @keydown.enter="onEnter" placeholder="输入并按回车"/>
    <div class="area" @click="onClick" @mousemove="onMove">在这个区域点击/移动鼠标</div>
    <p>最新事件信息：{{ lastEvent }}</p>

    <h4>3. 带类型的 props / emits（子组件见 parts/TypeList.vue）</h4>
    <p class="tip">打开 parts/TypeList.vue 可以看到 defineProps / defineEmits 的泛型写法</p>

    <h4>4. 常见类型标注一览</h4>
    <ul class="type-list">
      <li>count（自动推导 number）：{{ count }}</li>
      <li>status（字面量联合类型）：{{ status }}</li>
      <li>selected（string | null）：{{ selected ?? 'null' }}</li>
      <li>users（接口数组 User[]）：长度 {{ users.length }}</li>
    </ul>
    <button @click="count++; status = 'success'; selected = '张三'; users.push({ id: 1, name: '张三' })">
      填充一次数据
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TypeList from './parts/TypeList.vue'

// 1. ref 的类型标注
//    简单类型会自动推导：const n = ref(0) → Ref<number>
const count = ref(0)

// 需要显式标注的情况：联合类型 / 可能为 null / 复杂对象
const status = ref<'loading' | 'success' | 'error'>('loading')
const selected = ref<string | null>(null)

// 定义接口（interface）来描述对象结构
interface User {
  id: number
  name: string
  tags?: string[] // 可选属性
}
// ref 包对象数组
const users = ref<User[]>([])
// reactive 也可以用接口约束
// const state = reactive<{ list: User[] }>({ list: [] })

// 模板里用到的数据
const strList = ref(['vue', 'react', 'typescript'])
const numList = ref([19, 99, 299])

const lastEvent = ref('')

// 2. 事件处理函数的类型
//    输入框事件：Event，需要通过 as 断言成 HTMLInputElement 才能拿到 value
const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  lastEvent.value = `input：${target.value}`
}

// 键盘事件：KeyboardEvent
const onEnter = (e: KeyboardEvent) => {
  lastEvent.value = `keydown：${e.key}`
}

// 鼠标事件：MouseEvent
const onClick = (e: MouseEvent) => {
  lastEvent.value = `click：坐标 (${e.clientX}, ${e.clientY})`
}
const onMove = (e: MouseEvent) => {
  // 频繁触发时可以做节流，这里只是演示类型
  lastEvent.value = `mousemove：(${e.clientX}, ${e.clientY})`
}

// 补充：模板引用的类型写法（详见示例 12）
//   const inputEl = ref<HTMLInputElement | null>(null)          // 原生元素
//   const childRef = ref<InstanceType<typeof ChildComp> | null>(null) // 组件实例
</script>

<style scoped>
.area {
  border: 1px dashed #1677ff;
  border-radius: 4px;
  padding: 12px;
  margin: 6px 0;
  text-align: center;
  cursor: pointer;
}
.tip {
  font-size: 12px;
  color: #888;
}
h4 {
  margin: 14px 0 6px;
  font-size: 14px;
  color: #1677ff;
}
</style>
