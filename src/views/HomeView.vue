<!--
  门户首页
  ------------------------------------------------------------------
  定位：一个会一直长大的「技术练兵场」。
  所以首页不放「文章列表」当主角，而是先摆出方向和进度，
  再往下才是具体写过的东西，最后才是通往示例集的那个入口。

  结构：
    Hero       —— 一句话说清这是什么 + 「开始学习」主入口 + 数据
    练习方向   —— 五个方向卡片（前端 / 后端 / 大数据 / AI 模型 / 复杂业务）
    最近记录   —— 真写过的条目，头条那张是大卡
  ------------------------------------------------------------------
-->
<template>
  <div class="home">
    <!-- ==================== Hero ==================== -->
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Study Lab · 个人技术练兵场</p>
        <h1>把想学的，<br/>都塞进同一个项目</h1>
        <p class="lead">
          前端、后端、大数据、AI 模型、复杂业务流程 —— 想到什么就往里加一块。
          每加一块都留下<strong>能跑起来的例子</strong>和踩过的坑，让它慢慢长成自己的练兵场，
          而不是一堆看完就忘的笔记。
        </p>

        <div class="hero-actions">
          <RouterLink to="/study" class="btn primary">
            <span>开始学习</span>
            <i class="arrow">→</i>
          </RouterLink>
          <RouterLink to="/backend-demo" class="btn ghost">看看接口示例</RouterLink>
          <!-- 留给你自己练手的空白页入口 -->
          <RouterLink to="/practice" class="btn ghost">我的练习页</RouterLink>
        </div>

        <ul class="stats">
          <li v-for="s in stats" :key="s.label">
            <b>{{ s.value }}</b>
            <span>{{ s.label }}</span>
          </li>
        </ul>
      </div>

      <!-- 右侧装饰：一叠摊开的纸，纸上写着「代码」，四周飘着方向标签 -->
      <div class="hero-art" aria-hidden="true">
        <div class="sheet back"></div>
        <div class="sheet mid"></div>
        <div class="sheet front">
          <div class="sheet-head">
            <i></i><i></i><i></i>
            <em>study-lab.md</em>
          </div>
          <ul class="lines">
            <li v-for="(l, i) in fakeCode" :key="i" :class="l.c" :style="{ width: l.w + '%' }"></li>
          </ul>
          <div class="sheet-foot">
            <span class="badge">22 / 22 示例</span>
            <span class="badge ghost">{{ tracks.length }} 个方向</span>
          </div>
        </div>

        <span
          v-for="c in floatChips"
          :key="c.text"
          class="chip"
          :style="{ top: c.top, left: c.left, animationDelay: c.delay }"
        >{{ c.text }}</span>
      </div>
    </section>

    <!-- ==================== 练习方向 ==================== -->
    <section class="section">
      <header class="section-head">
        <h2>练习方向</h2>
        <span class="section-sub">已点亮 {{ activeCount }} / {{ tracks.length }} 个 · 会一直加下去</span>
      </header>

      <div class="track-grid">
        <RouterLink
          v-for="t in tracks"
          :key="t.id"
          :to="t.to ?? `/category/${t.id}`"
          class="track"
          :class="t.status"
        >
          <div class="track-top">
            <span class="track-glyph">{{ t.glyph }}</span>
            <span class="state" :class="t.status">{{ trackStatusText[t.status] }}</span>
          </div>

          <h3>{{ t.name }}<i>{{ t.en }}</i></h3>
          <p class="track-desc">{{ t.desc }}</p>

          <ul class="track-tags">
            <li v-for="tag in t.tags" :key="tag">{{ tag }}</li>
          </ul>

          <div class="track-progress">
            <div class="bar"><i :style="{ width: trackPercent(t) + '%' }"></i></div>
            <span class="num">{{ t.done }} / {{ t.total }}</span>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- ==================== 最近记录 ==================== -->
    <section class="section">
      <header class="section-head">
        <h2>最近记录</h2>
        <span class="section-sub">共 {{ posts.length }} 条 · 每条都尽量留一个能跑的例子</span>
      </header>

      <PostCard v-if="featured" :post="featured" featured class="full"/>
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
import { posts, trackPercent, trackStatusText, tracks } from '../data/posts'

// 头条（大卡）与其余记录分开渲染
const featured = computed(() => posts.find((p) => p.featured))
const restPosts = computed(() => posts.filter((p) => !p.featured))

// 已点亮的方向数（active + wip 都算在推进中）
const activeCount = computed(() => tracks.filter((t) => t.status !== 'planned').length)

const stats = computed(() => [
  { value: String(posts.length), label: '练习记录' },
  { value: String(tracks.length), label: '练习方向' },
  { value: '1', label: '可跑接口' },
  { value: '0', label: '额外依赖' },
])

// 装饰用的假代码条：c 决定颜色，w 决定长度
const fakeCode = [
  { c: 'k', w: 62 },
  { c: 'g', w: 88 },
  { c: 'n', w: 45 },
  { c: 'k', w: 74 },
  { c: 'c', w: 56 },
  { c: 'g', w: 92 },
  { c: 'n', w: 38 },
  { c: 'k', w: 68 },
]

// 飘在纸周围的方向标签，delay 错开让它们不同步
const floatChips = [
  { text: '前端', top: '2%', left: '-7%', delay: '0s' },
  { text: '后端', top: '30%', left: '84%', delay: '0.7s' },
  { text: '大数据', top: '64%', left: '-9%', delay: '1.4s' },
  { text: 'AI 模型', top: '84%', left: '76%', delay: '2.1s' },
  { text: '复杂业务', top: '-5%', left: '58%', delay: '2.8s' },
]
</script>

<style scoped>
.home {
  max-width: 1180px;
  margin: 0 auto;
  padding: 44px 24px 64px;
}

/* ==================== Hero ==================== */
.hero {
  display: grid;
  grid-template-columns: 1.12fr 0.88fr;
  gap: 48px;
  align-items: center;
  padding: 8px 0 56px;
}

.eyebrow {
  margin: 0 0 12px;
  font-size: 11px;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  color: var(--brand);
  /* 前面一小段短线，比纯文字更稳 */
  display: flex;
  align-items: center;
  gap: 10px;
}
.eyebrow::before {
  content: '';
  width: 26px;
  height: 1px;
  background: var(--brand-border);
}

.hero h1 {
  margin: 0 0 18px;
  font-family: var(--font-serif);
  font-size: 47px;
  line-height: 1.3;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #2b3618;
}

.lead {
  margin: 0 0 26px;
  max-width: 520px;
  font-size: 14.5px;
  line-height: 2;
  color: var(--text-sub);
}
/* lead 里的 **强调** 用 <strong> 的替代：这里没写 markdown，保持纯文本说明 */
.lead :deep(strong) {
  color: var(--brand);
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 34px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 24px;
  border-radius: 999px;
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.22s, box-shadow 0.22s, background 0.22s;
}
.btn.primary {
  color: #fff;
  background: linear-gradient(135deg, var(--accent-2), var(--brand));
  box-shadow: 0 8px 22px rgba(109, 143, 31, 0.3);
  letter-spacing: 1px;
}
.btn.primary .arrow {
  font-style: normal;
  transition: transform 0.22s;
}
.btn.primary:hover {
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(109, 143, 31, 0.36);
}
.btn.primary:hover .arrow {
  transform: translateX(4px);
}
.btn.ghost {
  color: var(--brand);
  background: var(--brand-lighter);
  border: 1px solid var(--brand-border);
}
.btn.ghost:hover {
  color: var(--brand-hover);
  background: var(--brand-light);
  transform: translateY(-2px);
}

/* ---------- 数据条 ---------- */
.stats {
  display: flex;
  gap: 0;
  margin: 0;
  padding: 20px 0 0;
  list-style: none;
  border-top: 1px dashed var(--border-strong);
}
.stats li {
  flex: 1;
  padding-left: 18px;
  border-left: 1px solid var(--border);
}
.stats li:first-child {
  padding-left: 0;
  border-left: none;
}
.stats b {
  display: block;
  font-family: var(--font-serif);
  font-size: 25px;
  line-height: 1.2;
  color: var(--brand);
}
.stats span {
  font-size: 11.5px;
  color: var(--text-weak);
}

/* ---------- 右侧：实验台 ---------- */
.hero-art {
  position: relative;
  height: 340px;
}
.sheet {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  box-shadow: var(--shadow-md);
}
.sheet.back {
  transform: rotate(-5deg) translateY(12px);
  background: #f2eeda;
}
.sheet.mid {
  transform: rotate(3.2deg) translateY(5px);
  background: #f8f5e4;
}
.sheet.front {
  transform: rotate(-1.2deg);
  padding: 18px 20px;
  overflow: hidden;
  /* 横格纸：细横线间距和下面假代码条的行高对齐 */
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 31px,
    rgba(109, 143, 31, 0.09) 31px,
    rgba(109, 143, 31, 0.09) 32px
  );
  background-position: 0 44px;
}
.sheet-head {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 18px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
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
.sheet-head em {
  margin-left: 6px;
  font-style: normal;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-weak);
}

.lines {
  margin: 0;
  padding: 0;
  list-style: none;
}
/* 每条假代码就是一个色块，宽度由模版里的 :style 控制 */
.lines li {
  height: 8px;
  margin-bottom: 13px;
  border-radius: 4px;
}
.lines .k {
  background: #c8dc86;
}
.lines .g {
  background: #dfe4c0;
}
.lines .n {
  background: #cdd9a4;
}
.lines .c {
  background: #e3e6cd;
}

.sheet-foot {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 16px;
  display: flex;
  gap: 8px;
}
.badge {
  font-size: 11px;
  font-weight: 700;
  color: var(--brand);
  background: var(--brand-light);
  border: 1px solid var(--brand-border);
  border-radius: 999px;
  padding: 3px 12px;
}
.badge.ghost {
  color: var(--text-sub);
  background: transparent;
  border-color: var(--border-strong);
}

/* ---------- 漂浮的方向标签 ---------- */
.chip {
  position: absolute;
  font-size: 11.5px;
  color: #4f6b17;
  background: rgba(253, 251, 242, 0.94);
  border: 1px solid var(--brand-border);
  border-radius: 999px;
  padding: 4px 13px;
  box-shadow: var(--shadow-sm);
  white-space: nowrap;
  animation: float 6s ease-in-out infinite;
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-9px);
  }
}

/* ==================== 区块通用 ==================== */
.section {
  margin-top: 58px;
}
.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 11px;
  border-bottom: 1px solid var(--border);
}
.section-head h2 {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 22px;
  letter-spacing: 1.5px;
  color: #2f3a22;
  display: flex;
  align-items: center;
  gap: 10px;
}
/* 标题前的小方块，作为每个区块的“锚点” */
.section-head h2::before {
  content: '';
  width: 5px;
  height: 17px;
  border-radius: 2px;
  background: linear-gradient(180deg, var(--accent-2), var(--brand));
}
.section-sub {
  font-size: 12px;
  color: var(--text-weak);
}

/* ==================== 方向卡片 ==================== */
.track-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(202px, 1fr));
  gap: 14px;
}

.track {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 18px 17px 16px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  box-shadow: var(--shadow-sm);
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition: transform 0.24s, box-shadow 0.24s, border-color 0.24s;
}
/* 顶部一条细渐变，hover 时才亮起来 */
.track::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-2), var(--accent-1));
  opacity: 0;
  transition: opacity 0.24s;
}
.track:hover {
  transform: translateY(-4px);
  border-color: var(--brand-border);
  box-shadow: var(--shadow-lg);
}
.track:hover::before {
  opacity: 1;
}
/* 还没开始的方向：虚线边框 + 压一点亮度，一眼能区分 */
.track.planned {
  border-style: dashed;
  background: linear-gradient(180deg, var(--bg-soft), var(--bg-card));
}
.track.planned .track-glyph {
  filter: saturate(0.35);
  opacity: 0.8;
}
.track.planned h3,
.track.planned .track-desc {
  opacity: 0.78;
}

.track-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.track-glyph {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  font-size: 18px;
  border-radius: 11px;
  background: linear-gradient(140deg, var(--accent-3), var(--accent-1));
  border: 1px solid var(--brand-border);
}

.state {
  font-size: 10.5px;
  letter-spacing: 0.5px;
  padding: 2px 9px;
  border-radius: 999px;
  border: 1px solid var(--border-strong);
  color: var(--text-sub);
  background: var(--bg-soft);
  white-space: nowrap;
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

.track h3 {
  margin: 0 0 8px;
  font-family: var(--font-serif);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #2f3a22;
  display: flex;
  align-items: baseline;
  gap: 7px;
}
.track h3 i {
  font-style: normal;
  font-size: 10px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--text-weak);
  font-weight: 400;
}

.track-desc {
  margin: 0 0 14px;
  font-size: 12.5px;
  line-height: 1.85;
  color: var(--text-sub);
  flex: 1;
}

.track-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 0 0 14px;
  padding: 0;
  list-style: none;
}
.track-tags li {
  font-size: 10.5px;
  padding: 1px 8px;
  border-radius: 999px;
  color: var(--brand);
  background: var(--brand-lighter);
  border: 1px solid var(--brand-border);
}

.track-progress {
  display: flex;
  align-items: center;
  gap: 9px;
}
.bar {
  flex: 1;
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
  transition: width 0.5s ease;
}
.track.planned .bar i {
  background: var(--border-strong);
}
.track-progress .num {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-weak);
  white-space: nowrap;
}

/* ==================== 文章网格 ==================== */
.full {
  display: block;
  margin-bottom: 18px;
}
.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
  align-items: start;
}

/* ==================== 响应式 ==================== */
@media (max-width: 960px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .hero h1 {
    font-size: 36px;
  }
  .hero-art {
    height: 260px;
  }
  /* 小屏把漂浮标签收掉，否则容易压到正文 */
  .chip {
    display: none;
  }
  .stats {
    flex-wrap: wrap;
    gap: 16px 0;
  }
  .stats li {
    flex: 1 1 40%;
  }
}
</style>
