<!--
  Vue3 基础语法示例集 —— 导航壳
  左侧：示例目录（支持搜索、按分组归类）
  右侧：示例说明 + 运行效果 + 源码（浅色高亮 + 行号，可一键复制）
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
              <span class="panel-title">源码：{{ current.id }}.vue（共 {{ lineCount }} 行）</span>
              <div>
                <button class="mini-btn" @click="copySource">
                  {{ copied ? '已复制 ✓' : '复制代码' }}
                </button>
                <button class="mini-btn primary" @click="showSource = !showSource">
                  {{ showSource ? '收起源码' : '查看源码' }}
                </button>
              </div>
            </div>
            <!-- 浅底 + 行号 + 语法高亮：接近编辑器的阅读体验，长时间看不累眼 -->
            <div v-if="showSource" class="code-block">
              <div v-for="(line, index) in highlighted" :key="index" class="code-line">
                <span class="ln">{{ index + 1 }}</span>
                <!-- 高亮函数内部已做 HTML 转义，这里 v-html 是安全的 -->
                <span class="lc" v-html="line"></span>
              </div>
            </div>
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
import { highlight } from './utils/highlight'

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
// 高亮后的每一行（返回 HTML 字符串，配合 v-html 渲染）
const highlighted = computed(() => highlight(source.value))
const lineCount = computed(() => highlighted.value.length)
// 当前示例在列表中的位置
const currentIndex = computed(() => demos.findIndex((d) => d.id === currentId.value))

// 按关键词过滤（标题 + 描述 + 知识点都参与匹配）
const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return demos
  return demos.filter((d) => [d.title, d.desc, ...d.points].join(' ').toLowerCase().includes(kw))
})

// 按 group 分组，保持原有顺序（Map 保证插入顺序）
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
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--brand-border);
  position: sticky;
  top: 0;
  z-index: 10;
}
.header h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #134e4a;
}
.subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: #5f7a76;
}
.badge {
  background: var(--brand-light);
  color: var(--brand);
  border: 1px solid var(--brand-border);
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
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--brand-border);
  border-radius: 10px;
  padding: 12px;
}
.search {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 10px;
  outline: none;
}
.search:focus {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.12);
}
.group {
  margin-bottom: 10px;
}
.group-title {
  margin: 8px 0 4px;
  font-size: 12px;
  color: #7c9691;
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
  border-radius: 6px;
  font-size: 13px;
  color: #3f5451;
  cursor: pointer;
  transition: background 0.15s;
}
.nav-item:hover {
  background: var(--brand-lighter);
}
.nav-item.active {
  background: var(--brand-light);
  color: #115e59;
  font-weight: 600;
}
.empty {
  font-size: 13px;
  color: #9aa8a5;
  text-align: center;
  padding: 12px 0;
}

/* ===== 内容区 ===== */
.content {
  flex: 1;
  min-width: 0;
}
.intro,
.panel {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--brand-border);
  border-radius: 10px;
}
.intro {
  padding: 16px 20px;
}
.intro h2 {
  margin: 0 0 6px;
  font-size: 18px;
  color: #134e4a;
}
.desc {
  margin: 0 0 10px;
  font-size: 13px;
  color: #5f7a76;
}
.points {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: #3f5451;
  line-height: 1.9;
}

.panel {
  margin-top: 14px;
  overflow: hidden;
}
.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  background: var(--brand-lighter);
  border-bottom: 1px solid var(--brand-border);
}
.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: #3f5451;
}
.stage {
  padding: 16px 20px;
}

.mini-btn {
  border: 1px solid var(--border);
  background: #fff;
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 12px;
  color: #3f5451;
  cursor: pointer;
  margin-left: 6px;
}
.mini-btn:hover {
  border-color: var(--brand);
  color: var(--brand);
}
.mini-btn.primary {
  background: var(--brand);
  border-color: var(--brand);
  color: #fff;
}
.mini-btn.primary:hover {
  background: var(--brand-hover);
  color: #fff;
}

/* ===== 代码块：浅色编辑器风格（护眼） ===== */
.code-block {
  margin: 0;
  padding: 12px 0;
  background: #f8fbfa;
  border-top: 1px solid #eaf1ef;
  overflow-x: auto;
  max-height: 620px;
  font-family: 'JetBrains Mono', Consolas, Monaco, 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.75;
  tab-size: 2;
}
.code-line {
  display: flex;
  align-items: baseline;
  min-height: 1.75em;
}
.code-line:hover {
  background: #eef7f5;
}
.ln {
  flex: none;
  width: 48px;
  padding-right: 16px;
  text-align: right;
  color: #b6c4c1;
  user-select: none;
  font-variant-numeric: tabular-nums;
}
.lc {
  white-space: pre;
  padding-right: 24px;
  color: #2f3d3a;
}

/* v-html 插入的内容不带 scoped 属性，需要用 :deep() 才能命中 */
.code-block :deep(.tk-comment) {
  color: #8a9694;
  font-style: italic;
}
.code-block :deep(.tk-string) {
  color: #0a6b52;
}
.code-block :deep(.tk-keyword) {
  color: #b4265a;
}
.code-block :deep(.tk-builtin) {
  color: #8250df;
}
.code-block :deep(.tk-number) {
  color: #a8580b;
}
.code-block :deep(.tk-tag) {
  color: #16705a;
}
.code-block :deep(.tk-attr) {
  color: #1c6bb5;
}
.code-block :deep(.tk-fn) {
  color: #6b3fa0;
}

.pager {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 13px;
}
.pager button {
  border: 1px solid var(--border);
  background: #fff;
  border-radius: 6px;
  padding: 6px 14px;
  cursor: pointer;
  color: #3f5451;
}
.pager button:hover:not(:disabled) {
  border-color: var(--brand);
  color: var(--brand);
}
.pager button:disabled {
  color: #b6c4c1;
  cursor: not-allowed;
}
.progress {
  color: #8a9694;
}
</style>
