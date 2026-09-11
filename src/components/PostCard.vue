<!--
  文章 / 示例卡片（博客列表的基本单元）
  两种形态：
    - featured：头条大卡（左封面 + 右文字）
    - 默认：纵向小卡
  点击整卡跳转：demo 类进示例集，article 类目前是占位（后续可扩展文章页）
-->
<template>
  <article class="card" :class="{ featured, locked: post.kind !== 'demo' }" @click="open">
    <!-- 封面：渐变块 + 大字，模拟书封 -->
    <div class="cover" :style="coverStyle">
      <span class="glyph">{{ post.glyph }}</span>
      <span v-if="post.kind === 'demo'" class="ribbon">可交互</span>
    </div>

    <div class="main">
      <div class="tags">
        <span v-for="t in post.tags" :key="t" class="tag">{{ t }}</span>
      </div>

      <h3 class="title">{{ post.title }}</h3>
      <p class="summary">{{ post.summary }}</p>

      <div class="meta">
        <span>{{ post.date }}</span>
        <span class="dot">·</span>
        <span>约 {{ post.minutes }} 分钟</span>
        <span class="more">
          {{ post.kind === 'demo' ? '打开示例 →' : '敬请期待' }}
        </span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Post } from '../data/posts'

const props = defineProps<{ post: Post; featured?: boolean }>()
const router = useRouter()

// 封面渐变：由数据里的两个色值拼出来
const coverStyle = computed(() => ({
  background: `linear-gradient(135deg, ${props.post.cover[0]} 0%, ${props.post.cover[1]} 100%)`,
}))

const open = () => {
  // 目前只有 demo 类型有落地页，article 先留在列表里当目录
  if (props.post.kind === 'demo' && props.post.to) {
    router.push(props.post.to)
  }
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  /* 底部压一条深色边，像纸的厚度 */
  border-bottom: 2px solid #f0ecd9;
}
.card:hover {
  transform: translateY(-3px);
  border-color: var(--brand-border);
  box-shadow: var(--shadow-lg);
}
.card.locked {
  cursor: default;
}
.card.locked:hover {
  transform: translateY(-2px);
}

/* ---------- 封面 ---------- */
.cover {
  position: relative;
  height: 116px;
  display: grid;
  place-items: center;
  /* 封面也加一点纸纹，跟整体统一 */
  background-blend-mode: multiply;
}
.cover::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.22;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23p)' opacity='0.5'/%3E%3C/svg%3E");
}
.glyph {
  position: relative;
  font-family: var(--font-serif);
  font-size: 42px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 2px 8px rgba(60, 74, 20, 0.25);
  letter-spacing: 2px;
}
.ribbon {
  position: absolute;
  top: 10px;
  right: -30px;
  transform: rotate(38deg);
  width: 118px;
  text-align: center;
  font-size: 11px;
  padding: 2px 0;
  color: #33410d;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

/* ---------- 正文 ---------- */
.main {
  padding: 14px 16px 12px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}
.tag {
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 999px;
  color: var(--brand);
  background: var(--brand-lighter);
  border: 1px solid var(--brand-border);
}
.title {
  margin: 0 0 6px;
  font-family: var(--font-serif);
  font-size: 17px;
  font-weight: 700;
  color: #2f3a22;
  letter-spacing: 0.5px;
}
.summary {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--text-sub);
  line-height: 1.75;
  /* 摘要最多三行，保持卡片高度一致 */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.meta {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-weak);
}
.dot {
  opacity: 0.6;
}
.more {
  margin-left: auto;
  color: var(--brand);
  font-weight: 600;
}
.card.locked .more {
  color: var(--text-weak);
  font-weight: 400;
}

/* ---------- 头条大卡：左右布局 ---------- */
.featured {
  flex-direction: row;
}
.featured .cover {
  width: 300px;
  height: auto;
  min-height: 200px;
  flex: none;
}
.featured .glyph {
  font-size: 64px;
}
.featured .main {
  padding: 22px 26px;
}
.featured .title {
  font-size: 24px;
  margin-bottom: 10px;
}
.featured .summary {
  font-size: 14px;
  -webkit-line-clamp: 4;
  line-clamp: 4;
}

@media (max-width: 780px) {
  .featured {
    flex-direction: column;
  }
  .featured .cover {
    width: 100%;
    height: 140px;
    min-height: 140px;
  }
}
</style>
