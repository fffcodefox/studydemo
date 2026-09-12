<!--
  练习主页 · Practice Arena
  ==================================================================
  一张「护眼 + 二次元 + 装逼感」的落地页，专门给你练手的前端画布。
  关键看这几处 Vue 3 写法：
    · <script setup> 里用 ref / computed 管理状态
    · v-for 批量渲染樱花、星空、功能区卡片
    · @mousemove 做鼠标视差，@click 触发滚动
    · RouterLink / useRouter 做「返回首页」跳转
  返回键：左上角「← 返回首页」，优先 history.back()，无历史则跳到 /。
  ==================================================================
-->
<template>
  <div class="arena" @mousemove="onMove">
    <!-- ===== 背景层（纯装饰） ===== -->
    <div class="bg-orbs" aria-hidden="true">
      <span class="orb o1"></span>
      <span class="orb o2"></span>
      <span class="orb o3"></span>
    </div>

    <!-- 樱花飘落 -->
    <div class="sakura" aria-hidden="true">
      <span
        v-for="p in petals"
        :key="'p' + p.id"
        class="petal"
        :style="p.style"
      ></span>
    </div>

    <!-- 星空闪烁 -->
    <div class="stars" aria-hidden="true">
      <span
        v-for="s in stars"
        :key="'s' + s.id"
        class="star"
        :style="s.style"
      ></span>
    </div>

    <!-- ===== 顶部栏 + 返回键 ===== -->
    <header class="topbar">
      <button class="back-btn" type="button" @click="goBack">
        <span class="back-ico">‹</span>
        <span>返回首页</span>
      </button>
      <div class="topbar-title">练习主页 · Practice Arena</div>
    </header>

    <!-- ===== 主体 ===== -->
    <main class="hero" :style="parallaxStyle">
      <!-- 玻璃卡片 -->
      <section class="card">
        <!-- 手绘 chibi 吉祥物 + 等级徽章 -->
        <div class="mascot-wrap">
          <div class="mascot-glow"></div>
          <svg class="mascot" viewBox="0 0 200 210" aria-hidden="true">
            <!-- 猫耳 -->
            <path d="M58 60 L48 16 L88 48 Z" fill="#463c6e" />
            <path d="M142 60 L152 16 L112 48 Z" fill="#463c6e" />
            <path d="M61 55 L55 30 L82 49 Z" fill="#ff9ec4" />
            <path d="M139 55 L145 30 L118 49 Z" fill="#ff9ec4" />
            <!-- 呆毛 -->
            <path d="M100 14 q6 -14 14 -10 q-6 8 -6 16 z" fill="#7a68c0" />
            <!-- 头发底 -->
            <circle cx="100" cy="108" r="64" fill="#6c5ca8" />
            <!-- 脸 -->
            <circle cx="100" cy="112" r="50" fill="#ffe9dd" />
            <!-- 刘海 -->
            <path d="M48 104 Q100 58 152 104 Q132 78 100 76 Q68 78 48 104 Z" fill="#7a68c0" />
            <!-- 眼睛 -->
            <ellipse cx="80" cy="114" rx="9.5" ry="13.5" fill="#2e2a44" />
            <ellipse cx="120" cy="114" rx="9.5" ry="13.5" fill="#2e2a44" />
            <circle cx="83.5" cy="109" r="3.2" fill="#fff" />
            <circle cx="123.5" cy="109" r="3.2" fill="#fff" />
            <circle cx="77" cy="119" r="1.8" fill="#fff" opacity="0.8" />
            <circle cx="117" cy="119" r="1.8" fill="#fff" opacity="0.8" />
            <!-- 腮红 -->
            <circle cx="66" cy="128" r="7.5" fill="#ffb3c8" opacity="0.65" />
            <circle cx="134" cy="128" r="7.5" fill="#ffb3c8" opacity="0.65" />
            <!-- 嘴（猫咪 :3） -->
            <path d="M92 130 Q100 137 108 130" stroke="#d98aa0" stroke-width="2.6" fill="none" stroke-linecap="round" />
            <path d="M100 133 L100 137 M100 137 Q95 140 92 137 M100 137 Q105 140 108 137" stroke="#d98aa0" stroke-width="2" fill="none" stroke-linecap="round" />
            <!-- 闪星 -->
            <path d="M156 64 l3.5 9 9 3.5 -9 3.5 -3.5 9 -3.5 -9 -9 -3.5 9 -3.5 z" fill="#ffe66d" />
          </svg>
          <span class="level-badge">LV.1 练习生</span>
        </div>

        <p class="eyebrow">Vue 3 · 专属练习场</p>
        <h1 class="title">把代码<span class="grad">写进二次元</span></h1>
        <p class="type-line">{{ typed }}<span class="caret">▍</span></p>
        <p class="lead">
          这里是你自己的前端练习主页。从数据绑定、列表渲染、事件交互，<br />
          到打通 <code>studydemo-backend</code> 的真实接口，都可以从这页出发。
        </p>

        <div class="cta">
          <button class="cta-btn primary" type="button" @click="scrollToFeatures">
            开始练习 <span class="arr">→</span>
          </button>
          <RouterLink to="/backend-demo" class="cta-btn ghost">接口示例</RouterLink>
        </div>
      </section>

      <!-- 功能区卡片 -->
      <section ref="featuresEl" class="features">
        <article
          v-for="(f, i) in features"
          :key="i"
          class="feature"
          :style="{ '--i': i }"
        >
          <div class="f-glyph">{{ f.icon }}</div>
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </article>
      </section>
    </main>

    <!-- ===== 页脚 ===== -->
    <footer class="foot">
      <span>★ 护眼低亮 · 二次元练习场 · 从 /practice 出发 ★</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

/* ---------- 返回键：优先回上一页，无历史则回首页 ---------- */
const goBack = () => {
  if (window.history.length > 1) router.back()
  else router.push('/')
}

/* ---------- 樱花：随机生成飘落参数 ---------- */
const petals = ref(
  Array.from({ length: 20 }, (_, id) => {
    const left = Math.random() * 100
    const size = 8 + Math.random() * 10
    const duration = 7 + Math.random() * 8
    const delay = Math.random() * 10
    const drift = (Math.random() * 80 - 40).toFixed(0)
    const hue = Math.random() > 0.5 ? '#ffc9de' : '#ff9ec4'
    return {
      id,
      style: {
        left: left + '%',
        width: size + 'px',
        height: size + 'px',
        background: `linear-gradient(135deg, #fff 0%, ${hue} 100%)`,
        animationDuration: duration + 's',
        animationDelay: '-' + delay + 's',
        '--drift': drift + 'px',
      } as Record<string, string>,
    }
  }),
)

/* ---------- 星空：随机闪烁 ---------- */
const stars = ref(
  Array.from({ length: 46 }, (_, id) => {
    const top = Math.random() * 100
    const left = Math.random() * 100
    const size = 1 + Math.random() * 2.4
    const duration = 2 + Math.random() * 4
    const delay = Math.random() * 5
    return {
      id,
      style: {
        top: top + '%',
        left: left + '%',
        width: size + 'px',
        height: size + 'px',
        animationDuration: duration + 's',
        animationDelay: '-' + delay + 's',
      } as Record<string, string>,
    }
  }),
)

/* ---------- 打字机标语 ---------- */
const fullText = '欢迎来到你的专属练习主页 (｡•̀ᴗ-)✧'
const typed = ref('')
let typer: number | undefined
const startType = () => {
  let i = 0
  typer = window.setInterval(() => {
    typed.value = fullText.slice(0, i)
    i++
    if (i > fullText.length && typer) window.clearInterval(typer)
  }, 90)
}

/* ---------- 鼠标视差 ---------- */
const mx = ref(0)
const my = ref(0)
const onMove = (e: MouseEvent) => {
  mx.value = e.clientX / window.innerWidth - 0.5
  my.value = e.clientY / window.innerHeight - 0.5
}
const parallaxStyle = computed(() => ({
  transform: `translate3d(${mx.value * 14}px, ${my.value * 10}px, 0)`,
}))

/* ---------- 滚动到功能区 ---------- */
const featuresEl = ref<HTMLElement | null>(null)
const scrollToFeatures = () => {
  featuresEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* ---------- 功能区数据 ---------- */
const features = [
  { icon: '📘', title: '数据绑定', desc: 'ref / reactive / v-model 玩转表单与状态' },
  { icon: '🔁', title: '列表渲染', desc: 'v-for 把数组数据铺成真实界面' },
  { icon: '⚡', title: '事件交互', desc: '@click 让按钮和列表活起来' },
  { icon: '🌐', title: '前后端打通', desc: 'fetch 调 /api 拿 studydemo-backend 真数据' },
  { icon: '🧩', title: '组件化', desc: '拆出可复用、可维护的小组件' },
  { icon: '🛡️', title: '工程规范', desc: '顺手练 P3C 与 TypeScript 类型安全' },
]

onMounted(() => startType())
onBeforeUnmount(() => {
  if (typer) window.clearInterval(typer)
})
</script>

<style scoped>
/* ===== 调色：低亮护眼深色底 + 柔和粉/薰衣草/薄荷光 ===== */
.arena {
  --ink: #ece9f5;
  --ink-soft: #b3aec9;
  --pink: #ff8fb8;
  --lav: #b89bff;
  --mint: #7fe9c9;
  --glass: rgba(255, 255, 255, 0.06);
  --glass-bd: rgba(255, 255, 255, 0.14);

  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  color: var(--ink);
  font-family: 'PingFang SC', 'Microsoft YaHei', system-ui, -apple-system, sans-serif;
  background:
    radial-gradient(1100px 620px at 18% 8%, rgba(184, 155, 255, 0.14), transparent 60%),
    radial-gradient(900px 520px at 86% 26%, rgba(255, 143, 184, 0.12), transparent 60%),
    radial-gradient(820px 600px at 50% 108%, rgba(127, 233, 201, 0.10), transparent 60%),
    linear-gradient(160deg, #1a1830 0%, #201a33 46%, #18202f 100%);
}

/* ===== 背景光球 ===== */
.bg-orbs {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.5;
  animation: drift 18s ease-in-out infinite;
}
.o1 {
  width: 360px; height: 360px;
  top: -80px; left: -60px;
  background: radial-gradient(circle, rgba(184, 155, 255, 0.5), transparent 70%);
}
.o2 {
  width: 300px; height: 300px;
  bottom: -60px; right: -40px;
  background: radial-gradient(circle, rgba(255, 143, 184, 0.45), transparent 70%);
  animation-delay: -6s;
}
.o3 {
  width: 260px; height: 260px;
  top: 40%; left: 60%;
  background: radial-gradient(circle, rgba(127, 233, 201, 0.4), transparent 70%);
  animation-delay: -11s;
}
@keyframes drift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -24px) scale(1.08); }
}

/* ===== 樱花 ===== */
.sakura {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
.petal {
  position: absolute;
  top: -8%;
  border-radius: 0 100% 0 100% / 0 100% 0 100%;
  opacity: 0;
  box-shadow: 0 0 6px rgba(255, 158, 196, 0.5);
  animation-name: fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@keyframes fall {
  0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
  8% { opacity: 0.85; }
  92% { opacity: 0.85; }
  100% { transform: translateY(112vh) translateX(var(--drift)) rotate(420deg); opacity: 0; }
}

/* ===== 星空 ===== */
.stars {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
.star {
  position: absolute;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
  animation-name: twinkle;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
@keyframes twinkle {
  0%, 100% { opacity: 0.15; transform: scale(0.6); }
  50% { opacity: 0.95; transform: scale(1.25); }
}

/* ===== 顶部栏 + 返回键 ===== */
.topbar {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 28px;
  max-width: 1180px;
  margin: 0 auto;
}
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px 9px 14px;
  border-radius: 999px;
  border: 1px solid var(--glass-bd);
  background: var(--glass);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--ink);
  font-size: 14px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: transform 0.22s, box-shadow 0.22s, background 0.22s;
}
.back-btn:hover {
  transform: translateX(-3px);
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 22px rgba(184, 155, 255, 0.28);
}
.back-ico {
  font-size: 20px;
  line-height: 1;
  color: var(--lav);
}
.topbar-title {
  font-size: 13px;
  letter-spacing: 2px;
  color: var(--ink-soft);
}

/* ===== 主体 ===== */
.hero {
  position: relative;
  z-index: 3;
  max-width: 1180px;
  margin: 0 auto;
  padding: 18px 24px 40px;
  transition: transform 0.18s ease-out;
}

/* ===== 玻璃卡 ===== */
.card {
  position: relative;
  margin: 14px auto 0;
  max-width: 760px;
  padding: 40px 40px 38px;
  border-radius: 26px;
  border: 1px solid var(--glass-bd);
  background: var(--glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 24px 60px rgba(10, 8, 24, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  text-align: center;
  animation: rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes rise {
  from { opacity: 0; transform: translateY(26px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 吉祥物 */
.mascot-wrap {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 6px;
}
.mascot-glow {
  position: absolute;
  top: 6px;
  width: 168px;
  height: 168px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(184, 155, 255, 0.45), transparent 68%);
  filter: blur(8px);
  animation: pulse 3.6s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.12); opacity: 1; }
}
.mascot {
  position: relative;
  width: 150px;
  height: 158px;
  animation: bob 3.4s ease-in-out infinite;
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.35));
}
@keyframes bob {
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50% { transform: translateY(-10px) rotate(1deg); }
}
.level-badge {
  margin-top: 6px;
  font-size: 11px;
  letter-spacing: 1px;
  color: #1a1830;
  background: linear-gradient(120deg, var(--mint), var(--lav));
  padding: 3px 12px;
  border-radius: 999px;
  font-weight: 700;
  box-shadow: 0 6px 16px rgba(127, 233, 201, 0.35);
}

.eyebrow {
  margin: 14px 0 8px;
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--lav);
}
.title {
  margin: 0 0 14px;
  font-size: 42px;
  line-height: 1.25;
  font-weight: 800;
  letter-spacing: 1px;
}
.title .grad {
  background: linear-gradient(120deg, var(--pink), var(--lav) 50%, var(--mint));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.type-line {
  min-height: 22px;
  margin: 0 0 16px;
  font-size: 15px;
  letter-spacing: 1px;
  color: var(--ink-soft);
  font-family: 'Cascadia Code', 'JetBrains Mono', ui-monospace, monospace;
}
.caret {
  color: var(--mint);
  animation: blink 1s step-end infinite;
}
@keyframes blink {
  50% { opacity: 0; }
}
.lead {
  margin: 0 auto 26px;
  max-width: 560px;
  font-size: 14px;
  line-height: 2;
  color: var(--ink-soft);
}
.lead code {
  font-family: ui-monospace, monospace;
  font-size: 12.5px;
  color: var(--mint);
  background: rgba(127, 233, 201, 0.1);
  border: 1px solid rgba(127, 233, 201, 0.25);
  border-radius: 5px;
  padding: 1px 6px;
}

/* CTA */
.cta {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}
.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 26px;
  border-radius: 999px;
  font-size: 14px;
  letter-spacing: 1px;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  transition: transform 0.22s, box-shadow 0.22s, background 0.22s;
}
.cta-btn.primary {
  color: #1a1830;
  font-weight: 700;
  background: linear-gradient(120deg, var(--pink), var(--lav));
  box-shadow: 0 10px 26px rgba(184, 155, 255, 0.4);
}
.cta-btn.primary .arr {
  transition: transform 0.22s;
}
.cta-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 32px rgba(255, 143, 184, 0.45);
}
.cta-btn.primary:hover .arr {
  transform: translateX(5px);
}
.cta-btn.ghost {
  color: var(--ink);
  background: var(--glass);
  border-color: var(--glass-bd);
}
.cta-btn.ghost:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.12);
}

/* ===== 功能区 ===== */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 34px;
}
.feature {
  padding: 22px 20px;
  border-radius: 18px;
  border: 1px solid var(--glass-bd);
  background: var(--glass);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition: transform 0.26s, box-shadow 0.26s, border-color 0.26s;
  animation: rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--i) * 0.08s + 0.3s);
}
.feature:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 143, 184, 0.5);
  box-shadow: 0 18px 40px rgba(255, 143, 184, 0.22);
}
.f-glyph {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  font-size: 24px;
  border-radius: 14px;
  margin-bottom: 14px;
  background: linear-gradient(140deg, rgba(184, 155, 255, 0.25), rgba(127, 233, 201, 0.2));
  border: 1px solid var(--glass-bd);
}
.feature h3 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--ink);
}
.feature p {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.85;
  color: var(--ink-soft);
}

/* ===== 页脚 ===== */
.foot {
  position: relative;
  z-index: 3;
  text-align: center;
  padding: 28px 0 36px;
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--ink-soft);
}

/* ===== 响应式 ===== */
@media (max-width: 640px) {
  .title { font-size: 32px; }
  .card { padding: 30px 22px 30px; }
  .topbar-title { display: none; }
}
</style>
