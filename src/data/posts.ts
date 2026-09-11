/**
 * 站点内容数据
 *
 * 两份数据，职责不同：
 *   tracks —— 练习方向（前端 / 后端 / 大数据 / AI 模型 / 复杂业务）
 *             首页的「练习方向」卡片、顶部导航、页脚都用它
 *   posts  —— 练习记录（每个方向下真正写过的东西）
 *             首页「最近记录」和分类页用它
 *
 * 怎么加内容：
 *   新开一个方向 → tracks 里加一条（导航、首页、页脚会自动带上）
 *   新增一条记录 → posts 里加一条，track 填方向 id
 * 两个数组都是「顺序即展示顺序」，没有其它魔法。
 */

/** 方向的推进状态：进行中 / 正在搭 / 待点亮 */
export type TrackStatus = 'active' | 'wip' | 'planned'

/** 记录类型：可跳转的可交互示例 / 只有目录的占位文章 */
export type PostKind = 'demo' | 'article'

export interface Track {
  /** 唯一 id，同时是路由 /category/:id 的参数 */
  id: string
  /** 中文名（导航、卡片标题都用它，尽量两三个字） */
  name: string
  /** 英文名，卡片上做小字点缀 */
  en: string
  /** 一句话说明这个方向练什么 */
  desc: string
  /** 卡片上的图标 */
  glyph: string
  /** 推进状态 */
  status: TrackStatus
  /** 已完成条目数 */
  done: number
  /** 规划条目总数（会随内容增长而调整） */
  total: number
  /** 关键词，卡片底部展示 */
  tags: string[]
  /** 有独立落地页时填这里；不填则落到分类页 */
  to?: string
}

export interface Post {
  /** 唯一 id，用于 :key */
  id: string
  /** 标题 */
  title: string
  /** 摘要 */
  summary: string
  /** 所属方向 id，对应下面的 tracks */
  track: string
  /** 标签 */
  tags: string[]
  /** 日期，展示用 */
  date: string
  /** 阅读时长，展示用 */
  minutes: number
  /** demo：有可跑的页面；article：目前只有目录 */
  kind: PostKind
  /** kind = 'demo' 时的跳转路由 */
  to?: string
  /** 是否作为首页头条大卡 */
  featured?: boolean
  /** 封面渐变色（两个色值，都在黄绿family里） */
  cover: [string, string]
  /** 封面上的大字 */
  glyph: string
}

/** 状态对应的展示文案 */
export const trackStatusText: Record<TrackStatus, string> = {
  active: '进行中',
  wip: '正在搭',
  planned: '待点亮',
}

/**
 * 练习方向
 * 这个项目会一直往里加东西，所以 planned 的方向也先列出来 —— 看得见才有动力。
 */
export const tracks: Track[] = [
  {
    id: 'frontend',
    name: '前端',
    en: 'Frontend',
    desc: 'Vue 3 与 TypeScript 的地基。从插值、指令一路拆到响应式原理与工程化，每个知识点都是能点开跑的示例。',
    glyph: '🌿',
    status: 'active',
    done: 22,
    total: 22,
    tags: ['Vue 3', 'TypeScript', 'Vite'],
    to: '/study',
  },
  {
    id: 'backend',
    name: '后端',
    en: 'Backend',
    desc: 'Spring Boot 分层与接口约定：统一返回体、参数校验、Redis 计数、MySQL 落库，先把一条链路跑通，再往上加。',
    glyph: '⚙️',
    status: 'active',
    done: 4,
    total: 10,
    tags: ['Spring Boot', 'MyBatis-Plus', 'Redis'],
    to: '/backend-demo',
  },
  {
    id: 'bigdata',
    name: '大数据',
    en: 'Big Data',
    desc: '数据从哪来、怎么存、怎么算。采集 → 数仓分层 → 离线与实时计算，按能跑通的最小闭环一点点往上搭。',
    glyph: '📊',
    status: 'planned',
    done: 0,
    total: 8,
    tags: ['数据采集', '数仓', '计算引擎'],
  },
  {
    id: 'model',
    name: 'AI 模型',
    en: 'Model',
    desc: '大模型接入与工程化：提示词、流式输出、向量检索、RAG 召回，把模型当成一个普通依赖来用，而不是玄学。',
    glyph: '🧠',
    status: 'planned',
    done: 0,
    total: 6,
    tags: ['LLM', 'RAG', '向量检索'],
  },
  {
    id: 'business',
    name: '复杂业务',
    en: 'Business',
    desc: '把零散接口拼成真正的系统：多级审批、状态机、工作流、幂等与补偿，练的是建模能力而不是语法。',
    glyph: '🧩',
    status: 'wip',
    done: 1,
    total: 8,
    tags: ['工作流', '状态机', '事务'],
  },
]

/** 练习记录（顺序即首页展示顺序） */
export const posts: Post[] = [
  {
    id: 'vue-study-demo',
    title: '基础 vue-study-demo',
    summary:
      '22 个可交互的 Vue 3 基础语法示例：插值、指令、响应式、生命周期、组件通信、插槽、Teleport……每个示例都能在页面上直接跑，并附带逐行中文注释的完整源码。',
    track: 'frontend',
    tags: ['Vue 3', '入门', '可交互'],
    date: '2026-09-12',
    minutes: 120,
    kind: 'demo',
    to: '/study',
    featured: true,
    cover: ['#cfe89a', '#8fb52c'],
    glyph: 'V',
  },
  {
    id: 'hello-api',
    title: '第一个前后端接口：GET /api/hello',
    summary:
      '前端只写一个 fetch 薄封装，后端只提供一个 HelloController，但这条链路上有代理、跨域、统一返回体、Redis 计数和 MySQL 落库 —— 先把最小闭环跑通，后面才敢往上加。',
    track: 'backend',
    tags: ['前后端分离', '接口联调', 'Vite 代理'],
    date: '2026-09-12',
    minutes: 20,
    kind: 'demo',
    to: '/backend-demo',
    cover: ['#c6dda0', '#7d9a33'],
    glyph: 'A',
  },
  {
    id: 'vue-reactivity',
    title: 'Vue 3 响应式原理：从 ref 到 effect',
    summary:
      '为什么解构 reactive 会丢响应式？ref 的 .value 到底做了什么？顺着依赖收集这条线，把 Proxy、effect、调度器串起来看一遍。',
    track: 'frontend',
    tags: ['响应式', 'Proxy', '原理'],
    date: '2026-09-08',
    minutes: 25,
    kind: 'article',
    cover: ['#d8e6b4', '#93ad4a'],
    glyph: 'R',
  },
  {
    id: 'ts-generic',
    title: 'TypeScript 泛型在组件里的几种写法',
    summary:
      'defineProps 泛型、泛型组件 <script setup generic="T">、事件类型标注，写完这一段基本可以告别 any。',
    track: 'frontend',
    tags: ['TypeScript', '泛型'],
    date: '2026-09-02',
    minutes: 18,
    kind: 'article',
    cover: ['#e3edc0', '#9ab84a'],
    glyph: 'T',
  },
  {
    id: 'vite-optimize',
    title: 'Vite 项目体积与构建速度的几个抓手',
    summary: '按需加载、手动分包、依赖预构建，以及一份可复用的 vue-tsc 检查配置。',
    track: 'frontend',
    tags: ['Vite', '构建'],
    date: '2026-08-27',
    minutes: 15,
    kind: 'article',
    cover: ['#dce9b0', '#86a23e'],
    glyph: 'B',
  },
  {
    id: 'mybatis-plus',
    title: 'MyBatis-Plus 父子表 CRUD 的通用写法',
    summary: '主子表一起保存、级联删除、事务边界怎么划，结合若依的分层风格整理一套可以直接抄的模板。',
    track: 'backend',
    tags: ['MyBatis-Plus', '分层', '事务'],
    date: '2026-08-20',
    minutes: 22,
    kind: 'article',
    cover: ['#cfe0a6', '#6f8f2a'],
    glyph: 'M',
  },
]

/** 按 id 取方向 */
export function getTrack(id: string): Track | undefined {
  return tracks.find((t) => t.id === id)
}

/** 取某个方向下的所有记录 */
export function postsOf(trackId: string): Post[] {
  return posts.filter((p) => p.track === trackId)
}

/** 已完成比例（0~100），用于卡片上的进度条 */
export function trackPercent(track: Track): number {
  if (track.total <= 0) return 0
  return Math.min(100, Math.round((track.done / track.total) * 100))
}
