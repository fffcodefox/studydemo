<!--
  方向（分类）页：/category/:id
  ------------------------------------------------------------------
  顶部把这个方向的信息摊开：图标、名称、说明、关键词、推进进度；
  下面用同一套卡片组件列出该方向下已经写过的记录。
  还没点亮的方向（planned）点进来会看到一句「还在排队」，而不是空白页。
  ------------------------------------------------------------------
-->
<template>
  <div class="page" v-if="track">
    <!-- 面包屑 -->
    <nav class="crumb">
      <RouterLink to="/">首页</RouterLink>
      <span>/</span>
      <b>{{ track.name }}</b>
    </nav>

    <!-- 方向头部 -->
    <header class="cat-head paper">
      <span class="glyph">{{ track.glyph }}</span>
      <div class="cat-info">
        <p class="cat-en">{{ track.en }}</p>
        <h1>
          {{ track.name }}
          <span class="state" :class="track.status">{{ trackStatusText[track.status] }}</span>
        </h1>
        <p class="cat-desc">{{ track.desc }}</p>

        <ul class="cat-tags">
          <li v-for="tag in track.tags" :key="tag">{{ tag }}</li>
        </ul>

        <div class="cat-meta">
          <div class="bar"><i :style="{ width: trackPercent(track) + '%' }"></i></div>
          <span class="num">{{ track.done }} / {{ track.total }} 项</span>
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

    <!-- 空状态：还没开始的方向 / 真的没有内容的分类 -->
    <div v-if="!list.length" class="empty paper">
      <h2>{{ track.status === 'planned' ? '这个方向还在排队' : '这个方向还没有内容' }}</h2>
      <p v-if="track.status === 'planned'">
        先把已经点亮的几个方向吃掉，这块很快就轮到它 —— 主页上能看到每个方向的进度。
      </p>
      <p v-else>目前只留了目录，内容还在写。</p>
      <div class="empty-actions">
        <RouterLink to="/" class="back">回首页看方向 →</RouterLink>
        <RouterLink to="/study" class="back ghost">先去练前端</RouterLink>
      </div>
    </div>
  </div>

  <!-- 方向 id 不存在时的兜底 -->
  <div class="page" v-else>
    <div class="empty-box paper">
      <h2>没有找到这个方向</h2>
      <p>可能是地址拼错了，或者这个方向已经改名。</p>
      <RouterLink to="/" class="back">返回首页</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PostCard from '../components/PostCard.vue'
import { getTrack, postsOf, trackPercent, trackStatusText } from '../data/posts'

const route = useRoute()
const id = computed(() => String(route.params.id ?? ''))
const track = computed(() => getTrack(id.value))

// 按日期倒序，保证「最近更新」和列表顺序都是对的（posts 数组本身是人工排序的）
const list = computed(() =>
  [...postsOf(id.value)].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
)
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

/* ---------- 方向头部 ---------- */
.cat-head {
  display: flex;
  align-items: flex-start;
  gap: 20px;
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
.cat-info {
  flex: 1;
  min-width: 0;
}
.cat-en {
  margin: 0 0 4px;
  font-size: 10px;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--text-weak);
}
.cat-info h1 {
  margin: 0 0 8px;
  font-family: var(--font-serif);
  font-size: 26px;
  letter-spacing: 1px;
  color: #2f3a22;
  display: flex;
  align-items: center;
  gap: 10px;
}
.state {
  font-size: 10.5px;
  font-weight: 400;
  letter-spacing: 0.5px;
  padding: 2px 9px;
  border-radius: 999px;
  border: 1px solid var(--border-strong);
  color: var(--text-sub);
  background: var(--bg-soft);
}
.state.active {
  color: #fff;
  border-color: transparent;
  background: linear-gradient(135deg, var(--accent-2), var(--brand));
}
.state.wip {
  color: #4f6b17;
  background: var(--brand-lighter);
  border-color: var(--brand-border);
}
.cat-desc {
  margin: 0 0 12px;
  max-width: 720px;
  font-size: 13px;
  line-height: 1.85;
  color: var(--text-sub);
}

.cat-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 0 0 14px;
  padding: 0;
  list-style: none;
}
.cat-tags li {
  font-size: 10.5px;
  padding: 1px 8px;
  border-radius: 999px;
  color: var(--brand);
  background: var(--brand-lighter);
  border: 1px solid var(--brand-border);
}

.cat-meta {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12px;
  color: var(--text-weak);
  max-width: 420px;
}
.bar {
  flex: 1;
  min-width: 90px;
  height: 4px;
  border-radius: 999px;
  background: #eceadb;
  overflow: hidden;
}
.bar i {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent-2), var(--brand));
}
.cat-meta .num {
  font-family: var(--font-mono);
  white-space: nowrap;
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

/* ---------- 空状态 ---------- */
.empty {
  padding: 44px 40px;
  text-align: center;
}
.empty h2 {
  margin: 0 0 10px;
  font-family: var(--font-serif);
  font-size: 20px;
  letter-spacing: 1px;
  color: #2f3a22;
}
.empty p {
  margin: 0 0 20px;
  font-size: 13px;
  line-height: 1.9;
  color: var(--text-sub);
}
.empty-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}
.empty-box {
  padding: 60px;
  text-align: center;
}
.empty-box h2 {
  font-family: var(--font-serif);
  margin: 0 0 10px;
  color: #2f3a22;
}
.empty-box p {
  color: var(--text-sub);
  font-size: 13px;
  margin: 0 0 18px;
}

.back {
  display: inline-block;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 13px;
  text-decoration: none;
  color: #fff;
  background: linear-gradient(135deg, var(--accent-2), var(--brand));
  box-shadow: 0 4px 12px rgba(109, 143, 31, 0.22);
  transition: all 0.2s;
}
.back:hover {
  transform: translateY(-1px);
  color: #fff;
  box-shadow: 0 7px 18px rgba(109, 143, 31, 0.3);
}
.back.ghost {
  color: var(--brand);
  background: var(--brand-lighter);
  border: 1px solid var(--brand-border);
  box-shadow: none;
}
.back.ghost:hover {
  color: var(--brand-hover);
  background: var(--brand-light);
}

@media (max-width: 760px) {
  .cat-head {
    flex-direction: column;
  }
}
</style>
