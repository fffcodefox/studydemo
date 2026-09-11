<!--
  示例 09：计算属性 computed
  覆盖知识点：
    1. computed 基本用法：根据依赖自动计算，带缓存
    2. computed vs methods：computed 有缓存，依赖不变时不会重复执行
    3. 可写 computed：传 get / set（用于组件 v-model、表单联动等场景）
    4. computed 里不要做副作用（不要发请求、不要改其他状态），副作用请用 watch
    5. computed 返回的是 ref，脚本里要 .value
-->
<template>
  <div class="demo">
    <p>姓：<input v-model="firstName"/></p>
    <p>名：<input v-model="lastName"/></p>

    <!-- 1. 只读计算属性：模板里直接用，不需要 .value -->
    <p>全名（computed）：{{ fullName }}</p>
    <p>全名（methods）：{{ getFullName() }}</p>
    <p>全名长度：{{ fullNameLength }}</p>

    <h4>computed 有缓存，methods 没有</h4>
    <p>computed 被计算了 {{ computedTimes }} 次</p>
    <p>methods 被计算了 {{ methodTimes }} 次</p>
    <p>其他无关状态 count = {{ count }}</p>
    <button @click="count++">修改 count（无关状态）</button>
    <p class="tip">
      点上面按钮：count 变化会让组件重新渲染 → methods 每次都会重新执行，
      而 computed 的依赖（firstName/lastName）没变，直接返回缓存值，不重新计算
    </p>

    <h4>可写 computed（get / set）</h4>
    <p>全名：<input v-model="writableFullName"/></p>
    <p>拆分结果 → 姓：{{ firstName }} | 名：{{ lastName }}</p>
    <p class="tip">在输入框里输入「张 三」这样用空格分隔的名字，观察上面姓/名被反向拆分</p>

    <h4>基于列表的计算属性</h4>
    <ul>
      <li v-for="b in expensiveBooks" :key="b.name">{{ b.name }} - ¥{{ b.price }}</li>
    </ul>
    <p>总价：¥{{ totalPrice }} | 平均价：¥{{ avgPrice }}</p>
    <button @click="books.push({ name: '新书' + books.length, price: 50 })">加一本书</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const firstName = ref('张')
const lastName = ref('三')
const count = ref(0)

// 用于观察 computed 与 methods 的执行次数
const computedTimes = ref(0)
const methodTimes = ref(0)

// 1. 只读 computed：推荐用箭头函数形式
const fullName = computed(() => {
  computedTimes.value++ // 仅用于演示执行次数（真实业务中不要在 computed 里改状态）
  return firstName.value + lastName.value
})

// 2. 方法：每次渲染都会执行
const getFullName = () => {
  methodTimes.value++
  return firstName.value + lastName.value
}

// 3. 计算属性可以依赖其他计算属性
const fullNameLength = computed(() => fullName.value.length)

// 4. 可写 computed：传一个对象，包含 get 和 set
const writableFullName = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (val: string) => {
    // 当给 writableFullName.value 赋值时（v-model 输入）会走这里
    const parts = val.split(' ')
    firstName.value = parts[0] ?? ''
    lastName.value = parts[1] ?? ''
  },
})

// 5. 基于列表的复杂计算
interface Book {
  name: string
  price: number
}
const books = ref<Book[]>([
  { name: 'Vue 入门', price: 59 },
  { name: 'TS 进阶', price: 89 },
  { name: 'Vite 实战', price: 45 },
])

const expensiveBooks = computed(() => books.value.filter((b) => b.price >= 50))
const totalPrice = computed(() => books.value.reduce((sum, b) => sum + b.price, 0))
// 注意：computed 里不要写异步请求 / 修改 DOM 之类的副作用
const avgPrice = computed(() =>
  books.value.length ? Math.round(totalPrice.value / books.value.length) : 0,
)
</script>

<style scoped>
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
