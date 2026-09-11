<!--
  Vue3 基础语法示例集 —— 导航壳
  左侧：示例目录（支持搜索、按分组归类）
  右侧：示例说明 + 运行效果 + 源码（可一键复制）
-->
<template>
  <div class="app">
    <!-- ===== 顶部标题栏 ===== -->
    <header class="header">
      <div>
        <h1>Vue 3 基础语法示例集</h1>
        <p class="subtitle">
          共 {{ demos.length }} 个示例 · 每个示例都带详细中文注释 · 点开「查看源码」对照学习
        </p>
      </div>
      <span class="badge">Vue 3.5 + Vite + TypeScript</span>
    </header>

    <div class="body">
      <!-- ===== 左侧目录 ===== -->
      <aside class="sidebar">
        <input v-model="keyword" class="search" placeholder="搜索示例，如 v-model"/>

        <div v-for="(items, groupName) in groupedDemos" :key="groupName" class="group">
          <p class="group-title">{{ groupName }}</p>
          <button
            v-for="item in items"
            :key="item.id"
            class="nav-item"
            :class="{ active: item.id === currentId }"
            @click="select(item.id)"
          >
            {{ item.title }}
          </button>
        </div>

        <p v-if="!Object.keys(groupedDemos).length" class="empty">没有匹配的示例</p>
      </aside>

      <!-- ===== 右侧内容区 ===== -->
      <main class="content">
        <template v-if="current">
          <!-- 示例标题与知识点 -->
          <section class="intro">
            <h2>{{ current.title }}</h2>
            <p class="desc">{{ current.desc }}</p>
            <ul class="points">
              <li v-for="p in current.points" :key="p">{{ p }}</li>
            </ul>
          </section>

          <!-- 运行效果 -->
          <section class="panel">
            <div class="panel-head">
              <span class="panel-title">运行效果</span>
              <button class="mini-btn" @click="reload">重新挂载该示例</button>
            </div>
            <!-- :key 变化会强制销毁重建组件，方便重新观察生命周期等效果 -->
            <div class="stage">
              <component :is="currentComp" v-if="currentComp" :key="renderKey"/>
            </div>
          </section>

          <!-- 源码 -->
          <section class="panel">
            <div class="panel-head">
              <span class="panel-title">源码：{{ current.id }}.vue</span>
              <div>
                <button class="mini-btn" @click="copySource">{{ copied ? '已复制 ✓' : '复制代码' }}</button>
                <button class="mini-btn primary" @click="showSource = !showSource">
                  {{ showSource ? '收起源码' : '查看源码' }}
                </button>
              </div>
            </div>
            <pre v-if="showSource" class="code"><code>{{ source }}</code></pre>
          </section>

          <!-- 上/下翻页 -->
          <div class="pager">
            <button :disabled="currentIndex <= 0" @click="go(currentIndex - 1)">← 上一个</button>
            <span class="progress">{{ currentIndex + 1 }} / {{ demos.length }}</span>
            <button :disabled="currentIndex >= demos.length - 1" @click="go(currentIndex + 1)">
              下一个 →
            </button>
          </div>
        </template>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { demos, getDemoComponent, getDemoSource } from './examples/registry'

// 当前选中的示例 id（默认第一个）
const currentId = ref(demos[0]?.id ?? '')
const keyword = ref('')
const showSource = ref(false)
const copied = ref(false)
// 用于强制重建当前示例组件
const renderKey = ref(0)

// 当前示例的元信息
const current = computed(() => demos.find((d) => d.id === currentId.value))
// 当前示例的组件（import.meta.glob 收集而来）
const currentComp = computed(() => getDemoComponent(currentId.value))
// 当前示例的源码文本
const source = computed(() => getDemoSource(currentId.value))
// 当前示例在列表中的位置
const currentIndex = computed(() => demos.findIndex((d) => d.id === currentId.value))

// 按关键词过滤（标题 + 描述 + 知识点都参与匹配）
const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return demos
  return demos.filter((d) =>
    [d.title, d.desc, ...d.points].join(' ').toLowerCase().includes(kw),
  )
})

// 按 group 分组，保持原有顺序（用 Map 保证插入顺序）
const groupedDemos = computed(() => {
  const map = new Map<string, typeof demos>()
  for (const d of filtered.value) {
    const list = map.get(d.group) ?? []
    list.push(d)
    map.set(d.group, list)
  }
  return Object.fromEntries(map)
})

const select = (id: string) => {
  currentId.value = id
  showSource.value = false
  copied.value = false
  // 切换示例时回到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const go = (index: number) => {
  const target = demos[index]
  if (target) select(target.id)
}

// 重新挂载：改变 key 会销毁并重建组件
const reload = () => {
  renderKey.value++
}

const copySource = async () => {
  try {
    await navigator.clipboard.writeText(source.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    console.warn('当前浏览器不支持自动复制，请手动选中复制')
  }
}
</script>

<style scoped>
/* ===== 整体布局 ===== */
.app {
  min-height: 100vh;
  background: #f5f7fa;
  color: #1f2937;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
}
.header h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}
.subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: #6b7280;
}
.badge {
  background: #e6f4ff;
  color: #1677ff;
  border: 1px solid #91caff;
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 12px;
  white-space: nowrap;
}

.body {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 24px 40px;
  max-width: 1400px;
  margin: 0 auto;
}

/* ===== 侧边栏 ===== */
.sidebar {
  width: 240px;
  flex-shrink: 0;
  position: sticky;
  top: 88px;
  max-height: calc(100vh - 110px);
  overflow-y: auto;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
}
.search {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 10px;
  outline: none;
}
.search:focus {
  border-color: #1677ff;
}
.group {
  margin-bottom: 10px;
}
.group-title {
  margin: 8px 0 4px;
  font-size: 12px;
  color: #9ca3af;
  font-weight: 600;
}
.nav-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 6px 8px;
  margin-bottom: 2px;
  border: none;
  background: transparent;
  border-radius: 5px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
}
.nav-item:hover {
  background: #f3f4f6;
}
.nav-item.active {
  background: #e6f4ff;
  color: #1677ff;
  font-weight: 600;
}
.empty {
  font-size: 13px;
  color: #9ca3af;
  text-align: center;
  padding: 12px 0;
}

/* ===== 内容区 ===== */
.content {
  flex: 1;
  min-width: 0;
}
.intro {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px 20px;
}
.intro h2 {
  margin: 0 0 6px;
  font-size: 18px;
}
.desc {
  margin: 0 0 10px;
  font-size: 13px;
  color: #6b7280;
}
.points {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: #374151;
  line-height: 1.9;
}

.panel {
  margin-top: 14px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  background: #fafafa;
  border-bottom: 1px solid #e5e7eb;
}
.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}
.stage {
  padding: 16px 20px;
}

.mini-btn {
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 5px;
  padding: 3px 10px;
  font-size: 12px;
  color: #374151;
  cursor: pointer;
  margin-left: 6px;
}
.mini-btn:hover {
  border-color: #1677ff;
  color: #1677ff;
}
.mini-btn.primary {
  background: #1677ff;
  border-color: #1677ff;
  color: #fff;
}
.mini-btn.primary:hover {
  opacity: 0.85;
  color: #fff;
}

.code {
  margin: 0;
  padding: 14px 16px;
  background: #1f2937;
  color: #e5e7eb;
  font-size: 12px;
  line-height: 1.7;
  overflow-x: auto;
  max-height: 600px;
  font-family: Consolas, Monaco, 'Courier New', monospace;
}

.pager {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 13px;
}
.pager button {
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 6px;
  padding: 6px 14px;
  cursor: pointer;
  color: #374151;
}
.pager button:disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}
.progress {
  color: #9ca3af;
}
</style>
