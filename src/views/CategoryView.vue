<!--
  分类页：/category/:id
  顶部是分类信息（图标 + 名称 + 描述），下面用同一套卡片组件列出该分类下的内容
-->
<template>
  <div class="page" v-if="category">
    <!-- 面包屑 -->
    <nav class="crumb">
      <RouterLink to="/">首页</RouterLink>
      <span>/</span>
      <b>{{ category.name }}</b>
    </nav>

    <!-- 分类头部 -->
    <header class="cat-head paper">
      <span class="glyph">{{ category.glyph }}</span>
      <div class="cat-info">
        <h1>{{ category.name }}</h1>
        <p>{{ category.desc }}</p>
        <div class="cat-meta">
          <span>共 {{ list.length }} 篇</span>
          <span class="dot">·</span>
          <span>最近更新 {{ latestDate }}</span>
        </div>
      </div>
    </header>

    <!-- 头条（整行大卡） -->
    <PostCard v-for="p in featuredList" :key="p.id" :post="p" featured class="full"/>

    <!-- 普通列表 -->
    <div class="post-grid">
      <PostCard v-for="p in restList" :key="p.id" :post="p"/>
    </div>

    <p v-if="!list.length" class="empty">这个分类还没有内容，先去看看别的 →</p>
  </div>

  <!-- 分类不存在时的兜底 -->
  <div class="page" v-else>
    <div class="empty-box paper">
      <h2>没有找到这个分类</h2>
      <RouterLink to="/" class="back">返回首页</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PostCard from '../components/PostCard.vue'
import { getCategory, postsOf } from '../data/posts'

const route = useRoute()
const id = computed(() => String(route.params.id ?? ''))
const category = computed(() => getCategory(id.value))
const list = computed(() => postsOf(id.value))
const featuredList = computed(() => list.value.filter((p) => p.featured))
const restList = computed(() => list.value.filter((p) => !p.featured))
const latestDate = computed(() => list.value[0]?.date ?? '—')
</script>

<style scoped>
.page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 28px 24px 60px;
}

.crumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-weak);
  margin-bottom: 16px;
}
.crumb a {
  color: var(--text-sub);
  text-decoration: none;
}
.crumb a:hover {
  color: var(--brand);
}
.crumb b {
  color: var(--text);
  font-weight: 600;
}

.cat-head {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 24px 26px;
  margin-bottom: 28px;
  background:
    radial-gradient(120% 160% at 0% 0%, var(--brand-lighter) 0%, transparent 55%),
    var(--bg-card);
}
.glyph {
  flex: none;
  width: 62px;
  height: 62px;
  display: grid;
  place-items: center;
  font-size: 28px;
  border-radius: 14px;
  background: linear-gradient(140deg, var(--accent-3), var(--accent-1));
  border: 1px solid var(--brand-border);
  box-shadow: var(--shadow-sm);
}
.cat-info h1 {
  margin: 0 0 6px;
  font-family: var(--font-serif);
  font-size: 26px;
  color: #2f3a22;
  letter-spacing: 1px;
}
.cat-info p {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--text-sub);
  line-height: 1.8;
}
.cat-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: var(--text-weak);
}
.dot {
  opacity: 0.6;
}

/* 头条卡独占一行，普通卡走网格 */
.full {
  display: block;
  margin-bottom: 18px;
}
.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
  align-items: start;
}

.empty {
  text-align: center;
  color: var(--text-weak);
  padding: 60px 0;
}
.empty-box {
  padding: 60px;
  text-align: center;
}
.empty-box h2 {
  font-family: var(--font-serif);
  margin: 0 0 14px;
}
.back {
  color: var(--brand);
  text-decoration: none;
}
</style>
