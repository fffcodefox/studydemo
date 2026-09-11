<!--
  门户首页
  结构：Hero（标题 + 装饰书页 + 数据）→ 分类导航 → 头条示例 → 最新文章
  配色沿用全局的黄绿 + 书页质感，标题用衬线字体强化阅读感
-->
<template>
  <div class="home">
    <!-- ===== Hero ===== -->
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Vue 3 · TypeScript · 边写边学</p>
        <h1>把学到的东西<br/>写成能跑起来的例子</h1>
        <p class="lead">
          这里不是文档翻译，而是一个个可以点开、可以改、可以对照源码的小例子。
          从 <code>&#123;&#123; &#125;&#125;</code> 插值一路写到组合式函数，每段代码都带中文注释。
        </p>

        <div class="hero-actions">
          <RouterLink to="/study" class="btn primary">开始学习 →</RouterLink>
          <a class="btn ghost" @click.prevent="scrollToList">浏览目录 ↓</a>
        </div>

        <div class="stats">
          <div v-for="s in stats" :key="s.label" class="stat">
            <b>{{ s.value }}</b>
            <span>{{ s.label }}</span>
          </div>
        </div>
      </div>

      <!-- 装饰：一叠展开的纸，纸上是「代码」 -->
      <div class="hero-art" aria-hidden="true">
        <div class="paper-sheet back"></div>
        <div class="paper-sheet mid"></div>
        <div class="paper-sheet front">
          <div class="sheet-head">
            <i></i><i></i><i></i>
          </div>
          <div class="code-lines">
            <p v-for="(l, i) in fakeCode" :key="i" :style="{ width: l.w + '%' }">
              <span :class="l.c"></span>
            </p>
          </div>
          <div class="sheet-badge">22 / 22</div>
        </div>
      </div>
    </section>

    <!-- ===== 分类导航 ===== -->
    <section class="section">
      <div class="section-head">
        <h2>按分类浏览</h2>
        <span class="section-sub">共 {{ categories.length }} 个分类</span>
      </div>
      <div class="cat-grid">
        <RouterLink
          v-for="c in categories"
          :key="c.id"
          :to="`/category/${c.id}`"
          class="cat-card"
        >
          <span class="cat-glyph">{{ c.glyph }}</span>
          <div>
            <b>{{ c.name }}</b>
            <p>{{ c.desc }}</p>
          </div>
          <span class="cat-count">{{ postsOf(c.id).length }} 篇</span>
        </RouterLink>
      </div>
    </section>

    <!-- ===== 头条：可交互示例 ===== -->
    <section class="section" id="list">
      <div class="section-head">
        <h2>头条 · 可交互示例</h2>
        <span class="section-sub">点开就能在页面上直接运行</span>
      </div>
      <PostCard v-if="featured" :post="featured" featured/>
    </section>

    <!-- ===== 最新文章 ===== -->
    <section class="section">
      <div class="section-head">
        <h2>最新文章</h2>
        <span class="section-sub">共 {{ posts.length }} 篇</span>
      </div>
      <div class="post-grid">
        <PostCard v-for="p in restPosts" :key="p.id" :post="p"/>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import PostCard from '../components/PostCard.vue'
import { categories, posts, postsOf } from '../data/posts'

// 头条：data 里标记了 featured 的那篇
const featured = computed(() => posts.find((p) => p.featured))
// 其余文章
const restPosts = computed(() => posts.filter((p) => !p.featured))

const stats = computed(() => [
  { value: 22, label: '可交互示例' },
  { value: 6, label: '知识分组' },
  { value: categories.length, label: '内容分类' },
  { value: '0', label: '额外依赖' },
])

// 装饰用的假代码条：c 决定颜色深浅，w 决定长度
const fakeCode = [
  { c: 'k', w: 62 },
  { c: 'g', w: 88 },
  { c: 'n', w: 45 },
  { c: 'k', w: 74 },
  { c: 'c', w: 56 },
  { c: 'g', w: 92 },
  { c: 'n', w: 38 },
  { c: 'k', w: 68 },
  { c: 'c', w: 80 },
]

const scrollToList = () => {
  document.getElementById('list')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.home {
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 24px 60px;
}

/* ================= Hero ================= */
.hero {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 40px;
  align-items: center;
  padding: 12px 0 48px;
}
.eyebrow {
  margin: 0 0 10px;
  font-size: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--brand);
}
.hero h1 {
  margin: 0 0 16px;
  font-family: var(--font-serif);
  font-size: 46px;
  line-height: 1.28;
  font-weight: 700;
  color: #2c3719;
  letter-spacing: 1px;
}
.lead {
  margin: 0 0 24px;
  font-size: 15px;
  line-height: 1.9;
  color: var(--text-sub);
  max-width: 520px;
}
.hero-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
}
.btn {
  display: inline-block;
  padding: 10px 22px;
  border-radius: 999px;
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}
.btn.primary {
  color: #fff;
  background: linear-gradient(135deg, var(--accent-2), var(--brand));
  box-shadow: 0 6px 18px rgba(109, 143, 31, 0.28);
}
.btn.primary:hover {
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(109, 143, 31, 0.34);
}
.btn.ghost {
  color: var(--brand);
  background: var(--brand-lighter);
  border: 1px solid var(--brand-border);
}
.btn.ghost:hover {
  background: var(--brand-light);
}

.stats {
  display: flex;
  gap: 34px;
  padding-top: 22px;
  border-top: 1px dashed var(--border-strong);
}
.stat b {
  display: block;
  font-family: var(--font-serif);
  font-size: 26px;
  color: var(--brand);
  line-height: 1.2;
}
.stat span {
  font-size: 12px;
  color: var(--text-weak);
}

/* ---------- 装饰：叠起来的纸 ---------- */
.hero-art {
  position: relative;
  height: 320px;
}
.paper-sheet {
  position: absolute;
  inset: 0;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  box-shadow: var(--shadow-md);
}
.paper-sheet.back {
  transform: rotate(-5deg) translateY(10px);
  background: #f3efdd;
}
.paper-sheet.mid {
  transform: rotate(3deg) translateY(4px);
  background: #f8f5e6;
}
.paper-sheet.front {
  transform: rotate(-1deg);
  padding: 18px;
  overflow: hidden;
  /* 横格纸 */
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 31px,
    rgba(109, 143, 31, 0.08) 31px,
    rgba(109, 143, 31, 0.08) 32px
  );
  background-position: 0 46px;
}
.sheet-head {
  display: flex;
  gap: 5px;
  margin-bottom: 14px;
}
.sheet-head i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand-border);
}
.sheet-head i:first-child {
  background: var(--accent-2);
}
.code-lines {
  margin-top: 6px;
}
.code-lines p {
  margin: 0 0 13px;
  height: 8px;
  border-radius: 4px;
  background: #eceadb;
}
.code-lines span {
  display: block;
  height: 100%;
  border-radius: 4px;
}
.code-lines .k {
  width: 46%;
  background: #c8dc86;
}
.code-lines .g {
  width: 72%;
  background: #dfe4c0;
}
.code-lines .n {
  width: 34%;
  background: #cdd9a4;
}
.code-lines .c {
  width: 58%;
  background: #e3e6cd;
}
.sheet-badge {
  position: absolute;
  right: 16px;
  bottom: 14px;
  font-size: 12px;
  font-weight: 700;
  color: var(--brand);
  background: var(--brand-light);
  border: 1px solid var(--brand-border);
  border-radius: 999px;
  padding: 3px 12px;
}

/* ================= 区块通用 ================= */
.section {
  margin-top: 54px;
}
.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}
.section-head h2 {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 22px;
  color: #2f3a22;
  letter-spacing: 1px;
}
.section-sub {
  font-size: 12px;
  color: var(--text-weak);
}

/* ================= 分类卡片 ================= */
.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
}
.cat-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  box-shadow: var(--shadow-sm);
  text-decoration: none;
  color: inherit;
  transition: all 0.22s;
}
.cat-card:hover {
  transform: translateY(-3px);
  border-color: var(--brand-border);
  box-shadow: var(--shadow-md);
}
.cat-glyph {
  flex: none;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  font-size: 18px;
  border-radius: 10px;
  background: linear-gradient(140deg, var(--accent-3), var(--brand-light));
  border: 1px solid var(--brand-border);
}
.cat-card b {
  display: block;
  font-family: var(--font-serif);
  font-size: 16px;
  color: #2f3a22;
  margin-bottom: 4px;
}
.cat-card p {
  margin: 0;
  font-size: 12px;
  line-height: 1.7;
  color: var(--text-weak);
}
.cat-count {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 11px;
  color: var(--brand);
  background: var(--brand-lighter);
  border: 1px solid var(--brand-border);
  border-radius: 999px;
  padding: 1px 8px;
}

/* ================= 文章网格 ================= */
.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
  }
  .hero h1 {
    font-size: 34px;
  }
  .hero-art {
    height: 240px;
  }
  .stats {
    gap: 22px;
  }
}
</style>
