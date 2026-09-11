<!--
  Vue3 基础语法示例集 —— 学习页（/study/:id?）
  左侧：示例目录（支持搜索、按分组归类）
  右侧：示例说明 + 运行效果 + 源码（浅色高亮 + 行号，可一键复制）
  URL 上的 :id 与当前选中的示例同步，方便直接把某个示例分享给别人
-->
<template>
  <div class="app">
    <!-- ===== 顶部标题栏 ===== -->
    <header class="header">
      <div class="header-left">
        <nav class="crumb">
          <RouterLink to="/">首页</RouterLink>
          <span>/</span>
          <RouterLink to="/category/frontend">前端学习</RouterLink>
          <span>/</span>
          <b>基础 vue-study-demo</b>
        </nav>
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
          <section class="intro paper paper-ruled">
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
            <div class="stage paper-ruled">
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
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { demos, getDemoComponent, getDemoSource } from '../examples/registry'
import { highlight } from '../utils/highlight'

const route = useRoute()
const router = useRouter()

// 当前选中的示例 id：优先取 URL 上的，没有就用第一个
const currentId = ref<string>(String(route.params.id || demos[0]?.id || ''))
// 搜索框：首页导航搜索时会带上 ?q=xxx
const keyword = ref(String(route.query.q ?? ''))
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
  // 同步到地址栏，方便复制链接直达某个示例
  router.replace({ name: 'study', params: { id } })
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

// 支持从外部（首页搜索、分享链接）改 URL 时同步选中项
watch(
  () => route.params.id,
  (id) => {
    const next = String(id || demos[0]?.id || '')
    if (next && next !== currentId.value && demos.some((d) => d.id === next)) {
      currentId.value = next
    }
  },
)
</script>

<style scoped>
/* ===== 整体布局 ===== */
.app {
  max-width: 1240px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0 16px;
}
.header h1 {
  margin: 2px 0 0;
  font-size: 22px;
  font-weight: 700;
  font-family: var(--font-serif);
  letter-spacing: 1px;
  color: #2f3a22;
}
.subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--text-sub);
}

/* 面包屑：和首页导航呼应 */
.crumb {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: var(--text-weak);
}
.crumb a {
  color: var(--text-sub);
  text-decoration: none;
}
.crumb a:hover {
  color: var(--brand);
}
.crumb b {
  color: var(--brand);
  font-weight: 600;
}

.badge {
  background: var(--brand-light);
  color: var(--brand);
  border: 1px solid var(--brand-border);
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 12px;
  white-space: nowrap;
  flex: none;
}

.body {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 40px;
}

/* ===== 侧边栏 ===== */
.sidebar {
  width: 236px;
  flex-shrink: 0;
  position: sticky;
  top: 76px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
  box-shadow: var(--shadow-sm);
}
.search {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 10px;
  border: 1px solid var(--border-strong);
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 10px;
  outline: none;
}
.search:focus {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(109, 143, 31, 0.13);
}
.group {
  margin-bottom: 10px;
}
.group-title {
  margin: 8px 0 4px;
  font-size: 12px;
  color: var(--text-weak);
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
  color: var(--text);
  cursor: pointer;
  transition: background 0.15s;
}
.nav-item:hover {
  background: var(--brand-lighter);
}
.nav-item.active {
  background: var(--brand-light);
  color: #40560d;
  font-weight: 600;
}
.empty {
  font-size: 13px;
  color: var(--text-weak);
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
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
}
.intro {
  padding: 16px 20px;
}
.intro h2 {
  margin: 0 0 6px;
  font-size: 19px;
  font-family: var(--font-serif);
  letter-spacing: 0.5px;
  color: #2f3a22;
}
.desc {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--text-sub);
}
.points {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: var(--text);
  line-height: 1.95;
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
  color: var(--text);
}
.stage {
  padding: 16px 20px;
  background-color: #fffdf5;
}

.mini-btn {
  border: 1px solid var(--border-strong);
  background: #fffdf6;
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 12px;
  color: var(--text);
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

/* ===== 代码块：纸感浅色（护眼） ===== */
.code-block {
  margin: 0;
  padding: 12px 0;
  background: var(--bg-code);
  border-top: 1px solid var(--border);
  overflow-x: auto;
  max-height: 620px;
  font-family: var(--font-mono);
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
  background: var(--bg-code-hover);
}
.ln {
  flex: none;
  width: 48px;
  padding-right: 16px;
  text-align: right;
  color: #b9bd9c;
  user-select: none;
  font-variant-numeric: tabular-nums;
}
.lc {
  white-space: pre;
  padding-right: 24px;
  color: #3a4126;
}

/* v-html 插入的内容不带 scoped 属性，需要用 :deep() 才能命中 */
.code-block :deep(.tk-comment) {
  color: #9a9c7e;
  font-style: italic;
}
.code-block :deep(.tk-string) {
  color: #4a7a16;
}
.code-block :deep(.tk-keyword) {
  color: #a8443f;
}
.code-block :deep(.tk-builtin) {
  color: #6f5aa8;
}
.code-block :deep(.tk-number) {
  color: #96660d;
}
.code-block :deep(.tk-tag) {
  color: #4d7a1e;
}
.code-block :deep(.tk-attr) {
  color: #2f6d86;
}
.code-block :deep(.tk-fn) {
  color: #6b4a9c;
}

.pager {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 13px;
}
.pager button {
  border: 1px solid var(--border-strong);
  background: var(--bg-card);
  border-radius: 8px;
  padding: 6px 14px;
  cursor: pointer;
  color: var(--text);
}
.pager button:hover:not(:disabled) {
  border-color: var(--brand);
  color: var(--brand);
}
.pager button:disabled {
  color: #b8bda6;
  cursor: not-allowed;
}
.progress {
  color: var(--text-weak);
}

@media (max-width: 860px) {
  .body {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    position: static;
    max-height: none;
  }
}
</style>
