<!--
  全站顶部导航
  - 左侧：站点标识（书页感的方块 logo + 衬线标题）
  - 中间：分类导航（对应 data/posts.ts 里的 categories）
  - 右侧：搜索框 + 「开始学习」直达示例集
-->
<template>
  <header class="nav">
    <div class="nav-inner">
      <RouterLink to="/" class="brand">
        <span class="logo">学</span>
        <span class="brand-text">
          <b>学习笔记</b>
          <i>Study Notes</i>
        </span>
      </RouterLink>

      <nav class="links">
        <RouterLink to="/" class="link" :class="{ on: isHome }">首页</RouterLink>
        <RouterLink
          v-for="c in categories"
          :key="c.id"
          :to="`/category/${c.id}`"
          class="link"
          :class="{ on: current === c.id }"
        >
          {{ c.name }}
        </RouterLink>
      </nav>

      <div class="tools">
        <input v-model="keyword" class="search" placeholder="搜索文章 / 示例…" @keyup.enter="doSearch"/>
        <RouterLink to="/study" class="cta">开始学习 →</RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { categories } from '../data/posts'

const route = useRoute()
const router = useRouter()
const keyword = ref('')

// 当前所在的分类（/category/:id），用于高亮
const current = computed(() => String(route.params.id ?? ''))
const isHome = computed(() => route.path === '/')

const doSearch = () => {
  const kw = keyword.value.trim()
  // 简单实现：有关键词就跳到示例集；后续可以接真正的全文搜索
  if (kw) router.push({ path: '/study', query: { q: kw } })
}
</script>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(253, 251, 242, 0.82);
  backdrop-filter: blur(12px) saturate(1.1);
  -webkit-backdrop-filter: blur(12px) saturate(1.1);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.6) inset;
}

.nav-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 10px 24px;
  display: flex;
  align-items: center;
  gap: 22px;
}

/* ---------- 品牌标识 ---------- */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
  flex: none;
}
.logo {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  font-family: var(--font-serif);
  font-size: 18px;
  color: #fff;
  background: linear-gradient(140deg, var(--accent-2), var(--brand));
  box-shadow: 0 3px 10px rgba(109, 143, 31, 0.28);
  /* 右下角折角，像书签 */
  clip-path: polygon(0 0, 100% 0, 100% 100%, 62% 100%, 0 62%);
}
.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.brand-text b {
  font-family: var(--font-serif);
  font-size: 16px;
  letter-spacing: 1px;
  color: #2f3a22;
}
.brand-text i {
  font-style: normal;
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--text-weak);
  text-transform: uppercase;
}

/* ---------- 导航链接 ---------- */
.links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.links::-webkit-scrollbar {
  display: none;
}
.link {
  position: relative;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  color: var(--text-sub);
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s;
}
.link:hover {
  color: var(--brand);
  background: var(--brand-lighter);
}
.link.on {
  color: #3f5c0d;
  background: var(--brand-light);
  font-weight: 600;
}
/* 激活项下方的小圆点 */
.link.on::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 1px;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--brand);
}

/* ---------- 右侧工具 ---------- */
.tools {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
}
.search {
  width: 170px;
  border-radius: 999px;
  padding-left: 12px;
  background: #fffdf6;
}
.cta {
  text-decoration: none;
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 999px;
  color: #fff;
  background: linear-gradient(135deg, var(--accent-2), var(--brand));
  box-shadow: 0 4px 12px rgba(109, 143, 31, 0.24);
  transition: all 0.2s;
  white-space: nowrap;
}
.cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(109, 143, 31, 0.32);
  color: #fff;
}

@media (max-width: 900px) {
  .search {
    display: none;
  }
  .brand-text {
    display: none;
  }
}
</style>
