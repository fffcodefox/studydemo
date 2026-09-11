<!--
  示例 13：组件 Props（父 → 子）
  覆盖知识点：
    1. defineProps 的三种写法：数组、对象（带类型和默认值）、TS 泛型（推荐）
    2. withDefaults：给 TS 泛型写法的 props 设置默认值
    3. props 是只读的（单向数据流），不要在子组件里直接改
    4. 类型校验：String / Number / Boolean / Array / Object / Date / Function / Symbol，以及自定义校验 validator
    5. required: true 必填校验
    6. 传属性时的注意点：用短横线命名（user-name），Boolean 属性简写
    7. 透传属性 attrs：未在 props 中声明的属性会落到根元素上（可用 inheritAttrs: false 关闭）
-->
<template>
  <div class="demo">
    <h4>1. 基础传值</h4>
    <!-- 静态传字符串 -->
    <UserCard name="张三" :age="20"/>
    <!-- 动态绑定（:age 传的是数字 20，不加冒号传的是字符串 "20"） -->
    <UserCard :name="fatherName" :age="45"/>

    <h4>2. 传对象 / 数组 / 布尔 / 默认值</h4>
    <UserCard
      :name="userInfo.name"
      :age="userInfo.age"
      :hobbies="userInfo.hobbies"
      :is-vip="userInfo.isVip"
    />
    <!-- 下面这个不传 age 和 hobbies，会使用子组件里的默认值 -->
    <UserCard name="只传了名字"/>

    <h4>3. 一次性传多个属性：v-bind="对象"</h4>
    <!-- 等价于 :name="userInfo.name" :age="userInfo.age" ... -->
    <UserCard v-bind="userInfo"/>

    <h4>4. 单向数据流</h4>
    <p class="tip">
      子组件内部不能直接修改 props（会报警告）。要修改应该：
      ① 用 computed 派生；② 把 props 转成本地 ref；③ 通过 emit 通知父组件改（见示例 14）
    </p>
    <button @click="userInfo.age++">在父组件改 age（✅ 正确做法）</button>

    <h4>5. 属性透传 attrs</h4>
    <!-- class 和 data-* 没有在 props 里声明，会自动加到子组件根元素上 -->
    <UserCard name="带 class 的卡片" class="my-card" data-test="abc"/>
    <p class="tip">打开控制台检查元素，可以看到 class="user-card my-card" 合并在根元素上</p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import UserCard from './parts/UserCard.vue'

const fatherName = ref('张爸爸')

// 父组件的数据：传给子组件
const userInfo = reactive({
  name: '李四',
  age: 28,
  hobbies: ['篮球', '音乐'],
  isVip: true,
})
</script>

<style scoped>
h4 {
  margin: 14px 0 6px;
  font-size: 14px;
  color: var(--brand);
}
.tip {
  font-size: 12px;
  color: var(--text-sub);
}
/* 这里的 .my-card 是父组件的 scoped 样式，透传到子组件根元素后依然生效 */
.my-card {
  border-left: 4px solid #722ed1;
}
</style>
