<!--
  示例 17：动态组件 / KeepAlive / 异步组件 / Suspense
  覆盖知识点：
    1. 动态组件：<component :is="组件变量">，is 可以是组件对象或组件名字符串
    2. KeepAlive：缓存被切换掉的组件，保留状态（不会销毁重建）
       - include / exclude：按组件 name 匹配（组件必须有 name）
       - max：最多缓存多少个
    3. onActivated / onDeactivated：被 KeepAlive 缓存组件的专属钩子
    4. defineAsyncComponent：按需异步加载组件（配合打包工具实现代码分割）
    5. Suspense：等待异步组件/带顶层 await 的组件加载完成，期间显示 fallback
-->
<template>
  <div class="demo">
    <h4>1. 动态组件 &lt;component :is&gt;</h4>
    <button
      v-for="tab in tabs"
      :key="tab.name"
      :class="{ active: currentTab === tab.comp }"
      @click="currentTab = tab.comp"
    >
      {{ tab.name }}
    </button>

    <!-- 是否被 KeepAlive 包裹，决定了切换后组件状态是否保留 -->
    <label class="switch">
      <input type="checkbox" v-model="useKeepAlive"/> 使用 KeepAlive 包裹
    </label>

    <div class="panel">
      <KeepAlive v-if="useKeepAlive" :max="2">
        <component :is="currentTab"/>
      </KeepAlive>
      <component :is="currentTab" v-else/>
    </div>
    <p class="tip">
      在每个 Tab 里输入点内容或点计数，再切换 Tab：
      加了 KeepAlive 后状态会保留，不加则会被销毁重建（状态归零）
    </p>

    <h4>2. 异步组件 defineAsyncComponent</h4>
    <button @click="showAsync = !showAsync">
      {{ showAsync ? '隐藏' : '加载' }}异步组件
    </button>
    <div v-if="showAsync" class="panel">
      <!-- 异步组件：首次渲染时才去加载对应的 chunk，可配置 loading / error / 超时 -->
      <Suspense>
        <AsyncHello/>
        <!-- 加载完成前显示这个 -->
        <template #fallback>
          <p class="tip">加载中...（Suspense 的 fallback）</p>
        </template>
      </Suspense>
    </div>
    <p class="tip">
      AsyncHello.vue 里有「顶层 await」模拟请求，Suspense 会等它完成后再显示，
      期间展示 #fallback 的内容
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, defineAsyncComponent } from 'vue'
import TabA from './parts/TabA.vue'
import TabB from './parts/TabB.vue'
import TabC from './parts/TabC.vue'

const tabs = [
  { name: 'Tab A', comp: TabA },
  { name: 'Tab B', comp: TabB },
  { name: 'Tab C', comp: TabC },
]

// ⚠️ 用 shallowRef 保存组件：组件对象不需要深层响应式，用 ref 会有性能损耗和警告
const currentTab = shallowRef(TabA)

const useKeepAlive = ref(true)

// 3. 异步组件：() => import('./xxx.vue') 会被打包成独立文件，按需加载
const AsyncHello = defineAsyncComponent(() => import('./parts/AsyncHello.vue'))

const showAsync = ref(false)
</script>

<style scoped>
button {
  margin-right: 6px;
}
button.active {
  background: var(--brand);
  color: #fff;
}
.switch {
  margin-left: 12px;
  font-size: 13px;
}
.panel {
  border: 1px dashed var(--border-strong);
  border-radius: 6px;
  padding: 10px;
  margin: 8px 0;
  min-height: 80px;
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
