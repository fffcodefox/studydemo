<!--
  示例 08：响应式基础 ref / reactive
  覆盖知识点：
    1. ref：任意类型，脚本里用 .value 访问，模板里自动解包（不用写 .value）
    2. reactive：只接受对象类型（对象/数组/Map/Set），直接访问属性
    3. 为什么需要响应式：普通 let 变量改变不会触发视图更新
    4. reactive 解构会丢失响应式 → 用 toRefs / toRef 解决
    5. ref 传对象时内部会自动转为 reactive（.value 拿到的是代理对象）
    6. 辅助 API：isRef / unref / toValue
    7. 使用建议：基础类型用 ref，一组相关字段用 reactive（或统一用 ref 也行）
-->
<template>
  <div class="demo">
    <!-- ref 在模板中自动解包，直接写变量名即可 -->
    <p>ref count = {{ count }}</p>
    <p>reactive state.count = {{ state.count }}</p>
    <p>reactive 对象属性：{{ state.user.name }} / {{ state.user.age }}</p>

    <!-- 对比：普通变量 -->
    <p>普通变量 normalCount = {{ normalCount }}（点下面的按钮，数字不会变）</p>

    <button @click="count++">ref count++</button>
    <button @click="state.count++">reactive count++</button>
    <button @click="normalCount++">普通变量 ++（视图不更新）</button>
    <button @click="forceRender">强制重新渲染</button>
    <span class="tip">已渲染次数：{{ tick }}</span>

    <h4>解构丢失响应式的问题</h4>
    <!-- ❌ 直接解构 reactive：得到的是「当前值的快照」，之后原对象变化，这里不会变 -->
    <p>直接解构：{{ wrongCount }}（点上面的 reactive count++ 看它不动）</p>
    <!-- ✅ toRefs 解构：每个属性变成 ref，保持响应式连接 -->
    <p>toRefs 解构：{{ rightCount }}（会同步变化）</p>

    <h4>辅助 API</h4>
    <p>isRef(count) = {{ isRef(count) }}</p>
    <p>isRef(state) = {{ isRef(state) }}</p>
    <p>unref(count)（等价于 isRef ? .value : 本身）= {{ unref(count) }}</p>
    <p>ref 包对象时，.value 拿到的是 Proxy 代理：{{ isProxy(objRef) }}（看，Ref 本身不是代理）</p>
    <p>objRef.value 才是代理对象：{{ isProxy(objRefValue) }}</p>
    <p>toRef 取单个属性保持响应式：{{ onlyName }}</p>

    <h4>替换整个 reactive 对象（注意：不能直接赋值，会丢失响应式）</h4>
    <p>{{ state2.info }}</p>
    <button @click="replaceWrong">❌ 整体替换（视图不更新）</button>
    <button @click="replaceRight">✅ 用 Object.assign 修改属性（视图更新）</button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, toRef, isRef, unref, isProxy } from 'vue'

// 1. ref：基础类型首选，脚本里用 .value
const count = ref(0)

// 2. reactive：对象类型，直接访问属性（不需要 .value）
const state = reactive({
  count: 0,
  user: { name: '张三', age: 18 },
})

// 3. 普通变量：不是响应式的，改了视图不会更新
let normalCount = 0

// 强制刷新：用一个 ref 触发重新渲染
const tick = ref(0)
const forceRender = () => {
  tick.value++
  // 借助 tick 变化触发重新渲染，此时 normalCount 的新值会被读出来
  console.log('normalCount 的真实值是', normalCount, '但模板里的 {{ normalCount }} 只在重新渲染时才更新')
}

// 4. 解构对比
// ❌ 错误：解构出来的是普通值，失去响应式连接
const { count: wrongCount } = state
// ✅ 正确：toRefs 把每个属性转成 ref，保持响应式
const { count: rightCount } = toRefs(state)
// 只想解构单个属性时可以用 toRef
const onlyName = toRef(state.user, 'name')

// 5. ref 包对象：内部自动调用 reactive，.value 是代理对象
const objRef = ref({ a: 1 })
// 取出 .value 用于 isProxy 判断（仅演示用，这个变量本身不是响应式的）
const objRefValue = objRef.value

// 6. reactive 不能整体替换（会断开代理），要改属性或用 Object.assign
//    这里用 let 声明，方便演示「整体赋值」这种错误写法
let state2 = reactive({ info: '初始值' })
const replaceWrong = () => {
  // ❌ 错误写法：把新对象赋给变量，模板引用的还是旧的代理对象，视图不会更新
  state2 = reactive({ info: '替换失败' })
  console.log('state2 变量指向了新对象，但模板绑定的是旧代理，视图不变')
}
const replaceRight = () => {
  Object.assign(state2, { info: '替换成功 ' + new Date().toLocaleTimeString() })
}
</script>

<style scoped>
button {
  margin: 4px 6px 4px 0;
}
h4 {
  margin: 14px 0 6px;
  font-size: 14px;
  color: #1677ff;
}
</style>
