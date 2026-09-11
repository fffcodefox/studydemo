<!--
  示例 20：进阶响应式 API
  覆盖知识点：
    1. shallowRef：只有 .value 整体替换才触发更新（大对象、第三方库实例用）
    2. triggerRef：手动强制触发 shallowRef 的更新
    3. shallowReactive：只有顶层属性是响应式的
    4. readonly：只读代理（常配合 provide 使用）
    5. toRaw：拿到代理背后的原始对象（用于绕过代理、传给第三方库）
    6. markRaw：标记对象「永远不要被代理」
    7. customRef：自定义 ref 的依赖收集与更新时机（经典案例：防抖输入框）
    8. effectScope：统一管理一组副作用，一键停止
    9. CSS v-bind：在 style 里直接使用 JS 变量（Vue 3 单文件特性）
-->
<template>
  <div class="demo">
    <h4>1. shallowRef（浅层 ref）</h4>
    <p>shallowObj：{{ shallowObj.name }} / {{ shallowObj.nested.count }}</p>
    <button @click="shallowObj.name = '改了名字（不触发视图更新）'">改顶层属性</button>
    <button @click="shallowObj.nested.count++">改嵌套属性（不更新）</button>
    <button @click="replaceShallow">整体替换 .value（✅ 会更新）</button>
    <button @click="forceTrigger">triggerRef 强制刷新（✅ 会更新）</button>

    <h4>2. shallowReactive（浅层 reactive）</h4>
    <p>top={{ shallowState.top }}，nested.deep={{ shallowState.nested.deep }}</p>
    <button @click="shallowState.top++">改顶层（✅ 更新）</button>
    <button @click="shallowState.nested.deep++">改嵌套（❌ 不更新，直到下次渲染）</button>

    <h4>3. readonly（只读代理）</h4>
    <p>只读对象：{{ readOnlyUser.name }}</p>
    <button @click="tryModifyReadonly">尝试修改（控制台告警）</button>

    <h4>4. toRaw / markRaw</h4>
    <p>原始对象 === 代理对象？{{ raw === reactiveUser }}</p>
    <button @click="compareRaw">点我看控制台输出</button>

    <h4>5. customRef 实现防抖输入框</h4>
    <input v-model="debouncedText" placeholder="输入后停顿 500ms 才更新"/>
    <p>防抖后的值：{{ debouncedText }}</p>
    <p class="tip">输入时不会立刻更新，停止输入 500ms 后才同步（常用于搜索联想）</p>

    <h4>6. effectScope（统一停止一组副作用）</h4>
    <p>scope 内的计数：{{ scopeCount }}</p>
    <button @click="scopeRunning = !scopeRunning">
      {{ scopeRunning ? '停止' : '启动' }} effectScope
    </button>
    <p class="tip">停止后，scope 里注册的所有 watch / computed 都会失效</p>

    <h4>7. CSS v-bind（把 JS 变量用到样式里）</h4>
    <p class="css-bind">我的颜色由 JS 变量控制</p>
    <input type="color" v-model="themeColor"/>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  shallowRef,
  shallowReactive,
  triggerRef,
  readonly,
  toRaw,
  markRaw,
  customRef,
  effectScope,
  watch,
  watchEffect,
  isReactive,
} from 'vue'

// 1. shallowRef：只追踪 .value 的替换，不深入对象内部
const shallowObj = shallowRef({ name: '初始值', nested: { count: 0 } })
const replaceShallow = () => {
  shallowObj.value = { name: '整体替换 ' + Date.now(), nested: { count: 100 } }
}
const forceTrigger = () => {
  shallowObj.value.nested.count++
  triggerRef(shallowObj) // 手动通知更新
}

// 2. shallowReactive：只有第一层属性是响应式的
const shallowState = shallowReactive({ top: 0, nested: { deep: 0 } })

// 3. readonly
const user = reactive({ name: '张三', age: 18 })
const readOnlyUser = readonly(user)
const tryModifyReadonly = () => {
  // @ts-expect-error 演示：readonly 对象不允许修改
  readOnlyUser.name = '李四'
  console.log('修改无效：', readOnlyUser.name)
}

// 4. toRaw / markRaw
const reactiveUser = reactive({ name: '王五' })
const raw = toRaw(reactiveUser)
// markRaw：标记为「永不代理」，之后再放进 reactive 也不会被转换
const neverProxy = markRaw({ tag: '第三方库实例（例如 chart 实例、DOM 节点）' })
const compareRaw = () => {
  console.log('toRaw 拿到原始对象：', raw, 'raw === proxy ?', raw === reactiveUser)
  console.log('isReactive(reactiveUser) =', isReactive(reactiveUser))
  console.log('被 markRaw 的对象放进 reactive 后依然不被代理：', neverProxy)
}

// 5. customRef：自定义 ref 的实现
function useDebouncedRef<T>(value: T, delay = 500) {
  let timer: ReturnType<typeof setTimeout> | undefined
  return customRef<T>((track, trigger) => ({
    // get 时调用 track() 收集依赖
    get() {
      track()
      return value
    },
    // set 时先防抖，延迟后再 trigger() 触发更新
    set(newValue) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        value = newValue
        trigger() // 通知依赖更新
      }, delay)
    },
  }))
}
const debouncedText = useDebouncedRef('')

// 6. effectScope：批量管理副作用
const scopeRunning = ref(true)
const scopeCount = ref(0)
const scope = effectScope()
scope.run(() => {
  // 这里面的 watch / computed / watchEffect 都会被 scope 统一管理
  watch(scopeCount, (v) => console.log('[scope 内] count 变化：', v))
  watchEffect(() => console.log('[scope 内] watchEffect：', scopeCount.value))
})
// 监听开关：停止 / 重启 scope
watch(scopeRunning, (running) => {
  if (!running) {
    scope.stop() // 一次性停止 scope 内的所有副作用
    console.log('effectScope 已停止，内部的 watch 不再生效')
  }
})
// 让计数自己涨，方便观察
setInterval(() => {
  scopeCount.value++
}, 3000)

// 7. CSS v-bind：把 JS 变量绑定到 CSS 上
const themeColor = ref('#1677ff')
</script>

<style scoped>
/* CSS v-bind：底层会编译成 CSS 自定义变量，运行时随 JS 变量变化 */
.css-bind {
  color: v-bind(themeColor);
  font-weight: 600;
  border-left: 4px solid v-bind(themeColor);
  padding-left: 8px;
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
