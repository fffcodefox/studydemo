/**
 * 路由表
 *   /                     门户首页（练习方向 + 最近记录）
 *   /category/:id         方向页
 *   /study/:id?           示例集学习页（:id 可选，用于直达某个示例）
 *   /backend-demo         接口示例页（调 studydemo-backend 的 /api/hello）
 *   /api-demo             ← 旧地址，保留跳转以免旧链接失效
 *
 * 接口示例页刻意不叫 /api-demo：/api 是代理给后端的路径前缀，
 * 前端路由用同一个前缀，HMR 直连和 Nginx 转发都会被误伤。
 */
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const SITE_NAME = '学习练兵场'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: SITE_NAME },
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
    path: '/backend-demo',
    name: 'backend-demo',
    component: () => import('../views/ApiDemoView.vue'),
    meta: { title: '接口示例' },
  },
  // 旧地址兜底，避免收藏/外链失效
  { path: '/api-demo', redirect: '/backend-demo' },
  // 未知地址回首页
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
  const title = (to.meta.title as string | undefined) ?? SITE_NAME
  document.title = to.name === 'home' ? `${SITE_NAME} · 把想学的都塞进同一个项目` : `${title} · ${SITE_NAME}`
})

export default router
