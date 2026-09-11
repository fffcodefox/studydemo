<!--
  示例 15：插槽 Slots（父组件向子组件传递「内容」）
  覆盖知识点：
    1. 默认插槽：<slot></slot>，父组件把内容写在组件标签中间
    2. 插槽后备内容（默认内容）：父组件没传时显示
    3. 具名插槽：<slot name="header"> + <template #header>（# 是 v-slot: 的简写）
    4. 作用域插槽：子组件把数据传给插槽，父组件用 v-slot="{ data }" 接收
    5. 动态插槽名：#[dynamicName]
    6. $slots：判断某个插槽是否被传入（用于条件渲染）
    7. 插槽内容的作用域：父模板里的内容只能访问父组件的数据
-->
<template>
  <div class="demo">
    <h4>1. 默认插槽</h4>
    <BaseCard>
      <p>这段内容会被插入到子组件的 <code>&lt;slot&gt;</code> 位置</p>
      <p>这里用的是「父组件」的数据：{{ parentMsg }}</p>
    </BaseCard>

    <h4>2. 插槽后备内容（父组件什么都不传）</h4>
    <BaseCard/>

    <h4>3. 具名插槽</h4>
    <BaseCard>
      <!-- #header 是 v-slot:header 的简写 -->
      <template #header>
        <b>我是标题（header 插槽）</b>
      </template>

      <!-- 没有包 template 的内容默认属于 default 插槽 -->
      <p>我是主体内容（default 插槽）</p>

      <template #footer>
        <small>我是底部（footer 插槽）</small>
      </template>
    </BaseCard>

    <h4>4. 作用域插槽（子组件 → 父组件传数据）</h4>
    <BaseCard>
      <!-- 子组件 :user="xxx" 暴露数据，父组件用 v-slot 接收 -->
      <template #default="{ user }">
        <p>从子组件拿到的数据：{{ user.name }} - {{ user.age }} 岁</p>
      </template>
    </BaseCard>

    <!-- 只有默认插槽时，可以简写为 v-slot="{ user }" 写在组件标签上 -->
    <BaseCard v-slot="{ user }">
      <p>简写形式：{{ user.name }}</p>
    </BaseCard>

    <h4>5. 作用域插槽 + 列表（最常见的用法：自定义每项的渲染）</h4>
    <TodoList :items="todos">
      <template #item="{ item, index }">
        <span :class="{ done: item.done }">
          {{ index + 1 }}. {{ item.text }}
        </span>
        <button @click="item.done = !item.done">切换完成</button>
      </template>
    </TodoList>

    <h4>6. 动态插槽名</h4>
    <button @click="slotName = slotName === 'header' ? 'footer' : 'header'">
      当前插槽名：{{ slotName }}
    </button>
    <BaseCard>
      <!-- 中括号里是变量，可以动态决定插到哪个插槽 -->
      <template #[slotName]>我插到了 {{ slotName }} 插槽</template>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import BaseCard from './parts/BaseCard.vue'
import TodoList from './parts/TodoList.vue'

const parentMsg = ref('来自父组件的数据')

const slotName = ref('header')

const todos = reactive([
  { text: '学习 Vue3 插槽', done: true },
  { text: '学习组合式 API', done: false },
  { text: '写一个项目练手', done: false },
])
</script>

<style scoped>
h4 {
  margin: 14px 0 6px;
  font-size: 14px;
  color: var(--brand);
}
.done {
  text-decoration: line-through;
  color: #8a9a97;
}
</style>
