/**
 * 站点内容数据（博客式文章清单）
 *
 * 说明：这里只是「首页 / 分类页」要展示的目录数据，真正的可交互示例在
 * src/examples/ 下。kind = 'demo' 的文章会跳转到 /study 示例集，
 * kind = 'article' 的目前只展示目录卡片（后续可以扩展成真正的文章页）。
 */
export type PostKind = 'demo' | 'article'

export interface Post {
  /** 唯一 id，用于 :key 和跳转 */
  id: string
  /** 标题 */
  title: string
  /** 摘要 */
  summary: string
  /** 所属分类 id，对应下面的 categories */
  category: string
  /** 标签 */
  tags: string[]
  /** 日期，展示用 */
  date: string
  /** 阅读时长，展示用 */
  minutes: number
  /** demo：跳到示例集；article：占位文章 */
  kind: PostKind
  /** kind = 'demo' 时的跳转路由 */
  to?: string
  /** 是否首页头条（大卡片） */
  featured?: boolean
  /** 封面用到的渐变色（两个色值） */
  cover: [string, string]
  /** 封面上的大字 / 图标 */
  glyph: string
}

export interface Category {
  id: string
  name: string
  desc: string
  glyph: string
}

/** 导航栏 + 首页分类使用的分类表 */
export const categories: Category[] = [
  {
    id: 'frontend',
    name: '前端学习',
    desc: 'Vue 3 / TypeScript / 工程化，从能跑起来的小例子开始，逐步拆开看原理。',
    glyph: '🌿',
  },
  {
    id: 'backend',
    name: '后端笔记',
    desc: 'Spring Boot、MyBatis-Plus、数据库设计与接口约定，记录踩过的坑。',
    glyph: '⚙️',
  },
  {
    id: 'devops',
    name: '工程化',
    desc: '构建、部署、CI、环境配置，让项目跑得又快又稳的那些事。',
    glyph: '🧰',
  },
  {
    id: 'reading',
    name: '读书笔记',
    desc: '读过的书、看过的文档，留下值得反复翻的几页。',
    glyph: '📖',
  },
]

/** 文章 / 示例清单（顺序即首页的展示顺序） */
export const posts: Post[] = [
  {
    id: 'vue-study-demo',
    title: '基础 vue-study-demo',
    summary:
      '22 个可交互的 Vue 3 基础语法示例：插值、指令、响应式、生命周期、组件通信、插槽、Teleport……每个示例都能在页面上直接运行，并附带逐行中文注释的完整源码。',
    category: 'frontend',
    tags: ['Vue 3', 'TypeScript', '组合式 API', '入门'],
    date: '2026-09-12',
    minutes: 120,
    kind: 'demo',
    to: '/study',
    featured: true,
    cover: ['#cfe89a', '#8fb52c'],
    glyph: 'V',
  },
  {
    id: 'vue-reactivity',
    title: 'Vue 3 响应式原理：从 ref 到 effect',
    summary:
      '为什么解构 reactive 会丢响应式？ref 的 .value 到底做了什么？顺着依赖收集这条线，把 Proxy、effect、调度器串起来看一遍。',
    category: 'frontend',
    tags: ['响应式', 'Proxy', '原理'],
    date: '2026-09-08',
    minutes: 25,
    kind: 'article',
    cover: ['#e3eda8', '#a9c94a'],
    glyph: 'R',
  },
  {
    id: 'ts-generic',
    title: 'TypeScript 泛型在组件里的几种写法',
    summary:
      'defineProps 泛型、泛型组件 <script setup generic="T">、事件类型标注，写完再也不用 any。',
    category: 'frontend',
    tags: ['TypeScript', '泛型'],
    date: '2026-09-02',
    minutes: 18,
    kind: 'article',
    cover: ['#dcefb0', '#7fa62a'],
    glyph: 'T',
  },
  {
    id: 'vite-optimize',
    title: 'Vite 项目体积与构建速度的几个抓手',
    summary: '按需加载、手动分包、依赖预构建，以及一份可复用的 vue-tsc 检查配置。',
    category: 'devops',
    tags: ['Vite', '构建'],
    date: '2026-08-27',
    minutes: 15,
    kind: 'article',
    cover: ['#e7efc2', '#9ab84a'],
    glyph: 'V',
  },
  {
    id: 'mybatis-plus',
    title: 'MyBatis-Plus 父子表 CRUD 的通用写法',
    summary: '主子表一起保存、级联删除、事务边界怎么划，结合若依分层整理一套模板。',
    category: 'backend',
    tags: ['MyBatis-Plus', 'Spring Boot'],
    date: '2026-08-20',
    minutes: 22,
    kind: 'article',
    cover: ['#e9eecb', '#8aa63c'],
    glyph: 'M',
  },
  {
    id: 'clean-code',
    title: '《代码整洁之道》读书笔记',
    summary: '命名、函数、注释三条线，摘出可以直接用在下个 PR 里的那部分。',
    category: 'reading',
    tags: ['读书', '代码质量'],
    date: '2026-08-11',
    minutes: 30,
    kind: 'article',
    cover: ['#eff2cf', '#7d9a33'],
    glyph: 'C',
  },
]

/** 按 id 取分类 */
export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}

/** 取某个分类下的文章 */
export function postsOf(categoryId: string): Post[] {
  return posts.filter((p) => p.category === categoryId)
}
