<!--
  示例 05：列表渲染 v-for
  覆盖知识点：
    1. 遍历数组：v-for="(item, index) in list"
    2. 遍历对象：v-for="(value, key, index) in obj"（顺序为 值、键、索引）
    3. 遍历数字：v-for="n in 10"（从 1 开始）
    4. 在 <template> 上用 v-for 渲染多个元素
    5. :key 的作用与正确用法（不要用 index 当 key，除非列表纯展示且不变动）
    6. 不要在「同一个元素」上同时写 v-for 和 v-if（Vue 3 中 v-if 优先级更高，会先判断再循环，拿不到 item）
       → 正确做法：用 <template v-for> 把 v-if 放到内层，或先用 computed 过滤数据
    7. 数组变更方法（push/pop/splice/sort/reverse）能触发更新；直接改索引/长度要用新数组或 splice
-->
<template>
  <div class="demo">
    <!-- 1. 遍历数组，index 可选 -->
    <h4>1. 遍历数组</h4>
    <ul>
      <li v-for="(user, index) in users" :key="user.id">
        {{ index + 1 }}. {{ user.name }} - {{ user.age }} 岁
        <button @click="removeUser(index)">删除</button>
      </li>
    </ul>

    <!-- 2. 遍历对象：注意顺序是 (值, 键, 索引) -->
    <h4>2. 遍历对象 (value, key, index)</h4>
    <ul>
      <li v-for="(value, key, index) in profile" :key="key">
        {{ index }} - {{ key }}: {{ value }}
      </li>
    </ul>

    <!-- 3. 遍历数字：n 从 1 开始，到 5 结束 -->
    <h4>3. 遍历数字</h4>
    <span v-for="n in 5" :key="n" class="tag">{{ n }}</span>

    <!-- 4. 在 template 上循环，一次渲染多个元素 -->
    <h4>4. template 上循环</h4>
    <template v-for="user in users" :key="user.id">
      <div class="row">{{ user.name }}</div>
      <hr class="mini-hr"/>
    </template>

    <!-- 5. key 的重要性：勾选后打乱顺序，观察用 index 当 key 时勾选状态会错位 -->
    <h4>5. key 用 index 会出 bug（勾选几项后点“打乱顺序”）</h4>
    <div class="cols">
      <div>
        <p class="sub">✅ 正确：:key="item.id"</p>
        <div v-for="item in items" :key="item.id">
          <input type="checkbox"/> {{ item.name }}
        </div>
      </div>
      <div>
        <p class="sub">❌ 错误：:key="index"</p>
        <div v-for="(item, index) in items" :key="index">
          <input type="checkbox"/> {{ item.name }}
        </div>
      </div>
    </div>
    <button @click="shuffle">打乱顺序</button>

    <!-- 6. 先过滤再循环（用 computed，性能更好） -->
    <h4>6. 用 computed 过滤后再 v-for（推荐）</h4>
    <ul>
      <li v-for="u in adultUsers" :key="u.id">{{ u.name }}（{{ u.age }}）</li>
    </ul>
    <p class="sub">
      反面教材：<code>&lt;li v-for="u in users" v-if="u.age &gt;= 18"&gt;</code>
      在 Vue 3 中 v-if 先执行，访问不到 u，会直接报错
    </p>

    <!-- 7. 正确写法演示：用 template 包一层，v-if 放内层 -->
    <h4>7. template v-for + 内层 v-if（正确写法）</h4>
    <ul>
      <template v-for="u in users" :key="u.id">
        <li v-if="u.age >= 18">{{ u.name }}（成年）</li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 定义列表中对象item的类型（TS 项目中推荐声明，能获得类型提示）
interface User {
  id: number
  name: string
  age: number
}

interface Item {
  id: number
  name: string
}

const users = ref<User[]>([
  { id: 1, name: '张三', age: 20 },
  { id: 2, name: '李四', age: 16 },
  { id: 3, name: '王五', age: 25 },
])

const items = ref<Item[]>([
  { id: 1, name: '苹果' },
  { id: 2, name: '香蕉' },
  { id: 3, name: '橙子' },
])

// 遍历对象：key 是 string，value 类型不一致时用 unknown 或联合类型
const profile = ref<Record<string, string | number>>({
  name: '张三',
  age: 20,
  city: '北京',
})

// 删除：splice 是「变更方法」，能触发视图更新
const removeUser = (index: number) => {
  users.value.splice(index, 1)
}

// 打乱顺序：直接赋新数组也能触发更新（Vue 3 的 ref 会代理整体替换）
const shuffle = () => {
  items.value = [...items.value].sort(() => Math.random() - 0.5)
}

// 计算属性过滤：只在依赖变化时重新计算，比在模板里过滤更高效
const adultUsers = computed(() => users.value.filter((u) => u.age >= 18))
</script>

<style scoped>
h4 {
  margin: 14px 0 6px;
  font-size: 14px;
  color: var(--brand);
}
.tag {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  margin-right: 6px;
  background: var(--brand-light);
  border-radius: 4px;
}
.mini-hr {
  border: none;
  border-top: 1px dashed #e6efec;
  margin: 2px 0;
}
.row {
  padding: 2px 0;
}
.cols {
  display: flex;
  gap: 32px;
}
.sub {
  font-size: 12px;
  color: #7c9691;
  margin: 4px 0;
}
</style>
