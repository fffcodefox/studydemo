/**
 * 路由表
 *   /                     门户首页（分类入口 + 文章列表）
 *   /category/:id         分类页
 *   /study/:id?           示例集学习页（:id 可选，用于直达某个示例）
 *   /api-demo             接口示例页（调 studydemo-backend 的 /api/hello）
 */
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: '学习笔记' },
  },
  {
    path: '/category/:id',
    name: 'category',
    component: () => import('../views/CategoryView.vue'),
  },
  {
    path: '/study/:id?',
    name: 'study',
    component: () => import('../views/StudyView.vue'),
    meta: { title: '基础 vue-study-demo' },
  },
  {
    path: '/api-demo',
    name: 'api-demo',
    component: () => import('../views/ApiDemoView.vue'),
    meta: { title: '接口示例' },
  },
  // 兜底：未知地址回首页
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 切页面回到顶部（有 hash 时交给浏览器锚点逻辑）
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

// 简单改一下标签页标题
router.afterEach((to) => {
  const title = (to.meta.title as string | undefined) ?? '学习笔记'
  document.title = to.name === 'home' ? '学习笔记 · 把学到的东西写成能跑起来的例子' : `${title} · 学习笔记`
})

export default router
