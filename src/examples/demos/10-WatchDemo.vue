<!--
  示例 10：侦听器 watch / watchEffect
  覆盖知识点：
    1. watch 监听 ref、getter 函数、reactive 对象、多个源（数组）
    2. 选项：deep（深度监听）、immediate（立即执行）、once（3.4+ 只触发一次）、flush（触发时机）
    3. watchEffect：自动收集依赖，不用指定监听源，立即执行一次
    4. 停止侦听器：调用 watch 返回的函数（组件卸载时会自动停止）
    5. 新旧值注意：监听 reactive 对象时，newValue 和 oldValue 是同一个对象
    6. 清理副作用：onCleanup（第三个参数）或 3.5+ 的 onWatcherCleanup
-->
<template>
  <div class="demo">
    <p>
      <input v-model="keyword" placeholder="输入内容，看侦听日志"/>
      <span class="tip">watch(ref) 已触发 {{ watchTimes }} 次</span>
    </p>

    <p>
      <button @click="user.age++">user.age + 1（{{ user.age }}）</button>
      <button @click="user.profile.city = '上海'">改深层属性 city</button>
      <span class="tip">watch(reactive, deep) 触发 {{ deepTimes }} 次</span>
    </p>

    <p>
      <button @click="a++">a++（{{ a }}）</button>
      <button @click="b++">b++（{{ b }}）</button>
      <span class="tip">多源侦听触发 {{ multiTimes }} 次</span>
    </p>

    <p>
      <button @click="stopAll = !stopAll">
        {{ stopAll ? '已停止侦听 keyword' : '正在侦听 keyword' }}
      </button>
      <span class="tip">切换后再输入，上面的 watchTimes 不再变化</span>
    </p>

    <p class="tip">
      watchEffect 会自动追踪回调里用到的响应式数据（这里依赖 keyword 和 a），
      并且创建时会立即执行一次
    </p>

    <div class="log-box">
      <p v-for="(l, i) in logs" :key="i">{{ l }}</p>
      <p v-if="!logs.length" class="tip">日志输出区</p>
    </div>
    <button @click="logs = []">清空日志</button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, watchEffect, onWatcherCleanup } from 'vue'

const keyword = ref('')
const a = ref(0)
const b = ref(0)
const user = reactive({ name: '张三', age: 18, profile: { city: '北京' } })

const watchTimes = ref(0)
const deepTimes = ref(0)
const multiTimes = ref(0)
const logs = ref<string[]>([])

const addLog = (msg: string) => {
  logs.value.unshift(`${new Date().toLocaleTimeString()} ${msg}`)
  if (logs.value.length > 8) logs.value.pop()
}

// 1. 监听一个 ref：最常见
watch(keyword, (newVal, oldVal) => {
  watchTimes.value++
  addLog(`watch ref：keyword 从 "${oldVal}" 变成 "${newVal}"`)

  // 6. 清理上一次的副作用：下一次触发或侦听器停止前会执行
  onWatcherCleanup(() => {
    console.log('清理上一次的副作用（例如取消未完成的请求）')
  })
})

// 2. 监听 getter 函数：只监听某个具体属性，性能更好
watch(
  () => user.age,
  (newVal, oldVal) => addLog(`watch getter：age ${oldVal} → ${newVal}`),
  { immediate: true }, // immediate：创建时立即执行一次（oldVal 为 undefined）
)

// 3. 监听 reactive 对象：默认是深度监听（deep 自动开启）
//    注意：此时 newVal 和 oldVal 指向同一个对象，打印出来是一样的
watch(
  user,
  (newVal, oldVal) => {
    deepTimes.value++
    addLog(`watch reactive（自动深度）：city=${newVal.profile.city}, age=${newVal.age}`)
    console.log('newVal === oldVal ?', newVal === oldVal) // true
  },
  { deep: true },
)

// 4. 监听多个源：用数组，回调参数也是数组
watch([a, b], ([newA, newB], [oldA, oldB]) => {
  multiTimes.value++
  addLog(`watch 多源：a ${oldA}→${newA}, b ${oldB}→${newB}`)
})

// 5. 手动停止侦听：watch 返回一个停止函数
const stopAll = ref(false)
const stopKeywordWatch = watch(keyword, (newVal) => {
  if (stopAll.value) return
  addLog(`可被停止的侦听器：${newVal}`)
})
watch(stopAll, (stopped) => {
  if (stopped) {
    stopKeywordWatch() // 调用返回的函数即可停止
    addLog('已手动停止 keyword 的第二个侦听器')
  } else {
    addLog('提示：停止后无法恢复，刷新示例可重置')
  }
})

// 7. watchEffect：不用指定监听源，回调里用到了谁就自动追踪谁
watchEffect((onCleanup) => {
  // 这里用到了 keyword 和 a，所以这两个变化时会重新执行
  console.log(`[watchEffect] keyword=${keyword.value}, a=${a.value}`)
  onCleanup(() => {
    // 旧版的清理方式（第三个参数回调），与 onWatcherCleanup 等价
    console.log('[watchEffect] 清理')
  })
})

// 补充：flush 选项
//   'pre'（默认）：组件更新前执行
//   'post'：组件更新后执行，适合需要读取更新后 DOM 的场景
//   'sync'：同步执行，谨慎使用（性能差、易出 bug）
watch(
  () => a.value,
  () => console.log('flush: post，DOM 已更新'),
  { flush: 'post' },
)
</script>

<style scoped>
.tip {
  font-size: 12px;
  color: var(--text-sub);
  margin-left: 8px;
}
.log-box {
  margin-top: 10px;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 8px;
  min-height: 80px;
  font-size: 12px;
}
.log-box p {
  margin: 2px 0;
}
</style>
