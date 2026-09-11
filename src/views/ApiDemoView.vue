<!--
  接口示例页 —— 演示 Vue 前端怎么真的调到 Spring Boot 后端
  - 接口：GET /api/hello?name=xxx（来自 studydemo-backend 的 HelloController）
  - 请求怎么走：浏览器 → Vite 代理(/api) → localhost:8080 → MySQL + Redis
  - 页面同时展示「解包后的业务字段」和「后端原始 JSON」，方便对照后端返回结构
-->
<template>
  <div class="api-page">
    <!-- ===== 页头 ===== -->
    <header class="page-head">
      <p class="eyebrow">前后端分离 · 接口联调</p>
      <h1>接口示例</h1>
      <p class="lead">
        这个页面是 studydemo 前端第一次真的往后端发请求。接口来自隔壁
        <code>studydemo-backend</code> 项目的 <code>HelloController</code>，
        它会顺手读写一次 Redis 和 MySQL，所以返回里能直接看出后端的两个中间件是不是通的。
      </p>
      <p class="endpoint"><span>GET</span><code>{{ requestUrl }}</code></p>
    </header>

    <!-- ===== 一次请求的完整链路 ===== -->
    <section class="chain-wrap" aria-label="请求链路">
      <div class="chain">
        <div class="node">
          <b>浏览器</b>
          <span>localhost:5173</span>
          <i>页面调 api/hello.ts</i>
        </div>
        <span class="arrow">→</span>
        <div class="node">
          <b>Vite Dev Server</b>
          <span>localhost:5173</span>
          <i>命中 server.proxy 的 /api</i>
        </div>
        <span class="arrow">→</span>
        <div class="node">
          <b>Spring Boot</b>
          <span>localhost:8080</span>
          <i>HelloController 处理</i>
        </div>
        <span class="arrow">→</span>
        <div class="node">
          <b>MySQL + Redis</b>
          <span>120.48.43.201</span>
          <i>dbCount / visits</i>
        </div>
      </div>
      <p class="chain-note">
        走代理而不是直连 8080，浏览器眼里请求始终是同源，所以不会触发跨域，
        也不依赖后端 <code>CorsConfig</code> 里写死的那一个允许来源。
      </p>
    </section>

    <!-- ===== 调用区 ===== -->
    <section class="paper panel">
      <div class="panel-head">
        <h2>试一试</h2>
        <span class="panel-sub">多调几次，看 visits 和 dbCount 怎么涨</span>
      </div>

      <form class="form" @submit.prevent="call">
        <label class="field">
          <span class="field-label">name</span>
          <input
            v-model="name"
            :disabled="loading"
            placeholder="留空则后端兜底为 World"
          />
        </label>
        <div class="form-actions">
          <button class="btn-primary" type="submit" :disabled="loading">
            {{ loading ? '调用中…' : '调用接口' }}
          </button>
          <button type="button" :disabled="loading" @click="reset">清空</button>
        </div>
      </form>

      <!-- 状态提示 -->
      <p v-if="loading" class="status pending">等待后端响应…</p>
      <p v-else-if="error" class="status error">{{ error }}</p>
      <p v-else-if="!data" class="status idle">还没调用过，点「调用接口」试一下。</p>

      <!-- 成功结果 -->
      <div v-if="data && !loading" class="result">
        <p class="result-msg">{{ data.message }}</p>

        <div class="metrics">
          <div class="metric">
            <b>{{ data.visits }}</b>
            <span>visits</span>
            <i>Redis 累计访问次数</i>
          </div>
          <div class="metric">
            <b>{{ data.dbCount }}</b>
            <span>dbCount</span>
            <i>t_demo_message 行数</i>
          </div>
          <div class="metric">
            <b>{{ data.name }}</b>
            <span>name</span>
            <i>后端实际使用的称呼</i>
          </div>
        </div>

        <details class="raw" open>
          <summary>后端原始返回（未解包的 Result）</summary>
          <pre>{{ raw }}</pre>
        </details>
      </div>
    </section>

    <!-- ===== 代码怎么写的 ===== -->
    <section class="paper notes">
      <div class="panel-head">
        <h2>前端这侧写了什么</h2>
        <span class="panel-sub">三个小文件，零新增依赖</span>
      </div>
      <ul class="file-list">
        <li>
          <code>src/api/http.ts</code>
          <p>
            基于原生 fetch 的薄封装。统一拼 <code>API_BASE</code>、解包 <code>Result</code>、
            把网络层失败和业务层失败分开抛 <code>ApiError</code>。
          </p>
        </li>
        <li>
          <code>src/api/hello.ts</code>
          <p>
            一个 Controller 对应一个模块。<code>fetchHello(name)</code> 只干拼路径这一件事，
            类型由 <code>HelloVO</code> 约束。
          </p>
        </li>
        <li>
          <code>src/api/types.ts</code>
          <p>
            和后端 Java 类一一对应的类型声明：<code>ApiResult&lt;T&gt;</code>、<code>HelloVO</code>。
          </p>
        </li>
      </ul>
      <p class="tip">
        没有装 axios —— 只有一个 GET 接口时，原生 fetch 加十几行封装就够了。
        以后要加请求拦截、token 续期这类功能，再考虑换 axios 也不迟。
      </p>
      <p class="tip warn">
        后端没启动时，页面会提示「请求发不出去」。这是因为走的是 Vite 代理，
        代理连不上 8080 会直接返回 500，而不是浏览器的跨域报错 —— 看到这条提示就去把后端拉起来。
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { API_BASE, ApiError } from '../api/http'
import { fetchHelloRaw } from '../api/hello'
import type { HelloVO } from '../api/types'

const name = ref('Vue')
const loading = ref(false)
/** 错误文案，空串表示没出错 */
const error = ref('')
const data = ref<HelloVO | null>(null)
/** 后端原始返回，原样打给用户看 */
const raw = ref('')

let controller: AbortController | null = null
/** 请求序号：防止「点了两次，先发的后回来」把结果覆盖成旧的 */
let seq = 0

/** 页头上那个地址，随输入实时变化，方便对照实际请求 */
const requestUrl = computed(() => {
  const trimmed = name.value.trim()
  const query = trimmed ? `?name=${encodeURIComponent(trimmed)}` : ''
  return `${API_BASE}/hello${query}`
})

async function call() {
  const current = ++seq
  controller?.abort()
  controller = new AbortController()

  loading.value = true
  error.value = ''

  try {
    const result = await fetchHelloRaw(name.value.trim(), controller.signal)
    if (current !== seq) return
    data.value = result.data
    raw.value = JSON.stringify(result, null, 2)
  } catch (err) {
    // 被新请求中断的旧请求直接忽略，不弹提示
    if (current !== seq) return
    if (err instanceof DOMException && err.name === 'AbortError') return
    data.value = null
    raw.value = ''
    error.value = err instanceof ApiError ? err.message : `意料之外的错误：${String(err)}`
  } finally {
    if (current === seq) loading.value = false
  }
}

function reset() {
  controller?.abort()
  seq++
  name.value = ''
  data.value = null
  error.value = ''
  raw.value = ''
  loading.value = false
}

// 页面切走时把还在飞的请求断掉
onBeforeUnmount(() => controller?.abort())
</script>

<style scoped>
.api-page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 24px 60px;
}

/* ================= 页头 ================= */
.page-head {
  padding-bottom: 8px;
}
.eyebrow {
  margin: 0 0 10px;
  font-size: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--brand);
}
.page-head h1 {
  margin: 0 0 14px;
  font-family: var(--font-serif);
  font-size: 38px;
  letter-spacing: 1px;
  color: #2c3719;
}
.lead {
  margin: 0 0 18px;
  max-width: 720px;
  font-size: 14px;
  line-height: 1.95;
  color: var(--text-sub);
}
.endpoint {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  padding: 7px 14px 7px 8px;
  border: 1px solid var(--brand-border);
  border-radius: 999px;
  background: var(--brand-lighter);
  font-size: 13px;
}
.endpoint span {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #fff;
  background: var(--brand);
  border-radius: 999px;
  padding: 2px 9px;
}
.endpoint code {
  background: none;
  padding: 0;
  color: #4f6b17;
}

/* ================= 链路 ================= */
.chain-wrap {
  margin: 30px 0 34px;
}
.chain {
  display: flex;
  align-items: stretch;
  gap: 10px;
  flex-wrap: wrap;
}
.node {
  flex: 1 1 170px;
  min-width: 158px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  box-shadow: var(--shadow-sm);
}
.node b {
  font-family: var(--font-serif);
  font-size: 15px;
  color: #2f3a22;
}
.node span {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--brand);
}
.node i {
  font-style: normal;
  font-size: 11px;
  color: var(--text-weak);
  line-height: 1.6;
}
.arrow {
  align-self: center;
  color: var(--brand-border);
  font-size: 18px;
}
.chain-note {
  margin: 14px 0 0;
  font-size: 12px;
  line-height: 1.85;
  color: var(--text-weak);
}

/* ================= 面板 ================= */
.panel,
.notes {
  padding: 22px 24px 24px;
  margin-bottom: 26px;
}
.panel-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}
.panel-head h2 {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 20px;
  color: #2f3a22;
  letter-spacing: 1px;
}
.panel-sub {
  font-size: 12px;
  color: var(--text-weak);
}

/* ---------- 表单 ---------- */
.form {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1 1 260px;
  max-width: 360px;
}
.field-label {
  font-size: 12px;
  color: var(--text-sub);
  font-family: var(--font-mono);
}
.form-actions {
  display: flex;
  gap: 8px;
}
.btn-primary {
  color: #fff;
  border-color: transparent;
  background: linear-gradient(135deg, var(--accent-2), var(--brand));
  box-shadow: 0 4px 12px rgba(109, 143, 31, 0.24);
}
.btn-primary:hover:not(:disabled) {
  color: #fff;
  border-color: transparent;
  transform: translateY(-1px);
  box-shadow: 0 7px 18px rgba(109, 143, 31, 0.3);
}
.btn-primary:disabled {
  color: rgba(255, 255, 255, 0.75);
  background: var(--brand-border);
  box-shadow: none;
}

/* ---------- 状态 ---------- */
.status {
  margin: 16px 0 0;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.8;
  white-space: pre-line;
}
.status.idle {
  color: var(--text-weak);
  background: var(--bg-soft);
  border: 1px dashed var(--border-strong);
}
.status.pending {
  color: #55701a;
  background: var(--brand-lighter);
  border: 1px solid var(--brand-border);
}
.status.error {
  color: #8d3a1d;
  background: #fbeee7;
  border: 1px solid #e8c4b3;
}

/* ---------- 结果 ---------- */
.result {
  margin-top: 18px;
}
.result-msg {
  margin: 0 0 16px;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid var(--brand-border);
  background: linear-gradient(135deg, var(--brand-lighter), var(--bg-card));
  font-family: var(--font-serif);
  font-size: 17px;
  color: #3f5c0d;
}
.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}
.metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  box-shadow: var(--shadow-sm);
}
.metric b {
  font-family: var(--font-serif);
  font-size: 26px;
  line-height: 1.2;
  color: var(--brand);
}
.metric span {
  font-family: var(--font-mono);
  font-size: 12px;
  color: #2f3a22;
}
.metric i {
  font-style: normal;
  font-size: 11px;
  color: var(--text-weak);
}

/* ---------- 原始 JSON ---------- */
.raw {
  margin-top: 16px;
}
.raw summary {
  cursor: pointer;
  font-size: 13px;
  color: var(--brand);
  padding: 4px 0;
}
.raw pre {
  margin: 10px 0 0;
  padding: 14px;
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-code);
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.7;
  color: #3e4629;
}

/* ================= 说明 ================= */
.file-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}
.file-list li {
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-soft);
}
.file-list li p {
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 1.8;
  color: var(--text-sub);
}
.tip {
  margin: 16px 0 0;
  font-size: 12px;
  line-height: 1.85;
  color: var(--text-sub);
}
.tip.warn {
  padding: 10px 14px;
  border-radius: 8px;
  border-left: 3px solid var(--brand);
  background: var(--brand-lighter);
  color: #55701a;
}

@media (max-width: 900px) {
  .page-head h1 {
    font-size: 30px;
  }
  .arrow {
    display: none;
  }
}
</style>
