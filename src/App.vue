<!--
  应用外壳：全站导航 + 路由视图 + 页脚
  页面背景与纸张质感在 assets/main.css 里统一处理
-->
<template>
  <div class="shell">
    <SiteNav/>

    <main class="main">
      <!-- 路由切换时做一次淡入淡出，避免生硬跳转 -->
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component"/>
        </Transition>
      </RouterView>
    </main>

    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="logo">学</span>
          <p>
            学习练兵场 · Study Lab<br/>
            <small>一个会一直长大的练手项目：前端 / 后端 / 大数据 / 模型 / 复杂业务</small>
          </p>
        </div>
        <div class="footer-links">
          <div>
            <b>练习方向</b>
            <RouterLink
              v-for="t in tracks"
              :key="t.id"
              :to="t.to ?? `/category/${t.id}`"
            >
              {{ t.name }}
            </RouterLink>
          </div>
          <div>
            <b>开始</b>
            <RouterLink to="/study">基础 vue-study-demo</RouterLink>
            <RouterLink to="/backend-demo">接口示例</RouterLink>
          </div>
          <div>
            <b>技术栈</b>
            <span>Vue 3.5</span>
            <span>TypeScript</span>
            <span>Vite</span>
            <span>Spring Boot 2.7</span>
          </div>
        </div>
      </div>
      <p class="copyright">© 2026 Study Lab · 用 Vue 3 写的练手项目</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import SiteNav from './components/SiteNav.vue'
import { tracks } from './data/posts'
</script>

<style scoped>
.shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
  padding: 0 16px;
}

/* ================= 页脚 ================= */
.footer {
  margin-top: 40px;
  border-top: 1px solid var(--border);
  background: rgba(253, 251, 242, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.footer-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 34px 24px 20px;
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}
.footer-brand {
  display: flex;
  gap: 12px;
  max-width: 320px;
}
.footer-brand .logo {
  flex: none;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  font-family: var(--font-serif);
  font-size: 18px;
  color: #fff;
  background: linear-gradient(140deg, var(--accent-2), var(--brand));
  clip-path: polygon(0 0, 100% 0, 100% 100%, 62% 100%, 0 62%);
}
.footer-brand p {
  margin: 0;
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-sub);
}
.footer-brand small {
  color: var(--text-weak);
  font-size: 12px;
}

.footer-links {
  display: flex;
  gap: 56px;
  flex-wrap: wrap;
}
.footer-links div {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.footer-links b {
  font-family: var(--font-serif);
  font-size: 14px;
  color: #2f3a22;
  margin-bottom: 2px;
}
.footer-links a,
.footer-links span {
  font-size: 12px;
  color: var(--text-weak);
  text-decoration: none;
}
.footer-links a:hover {
  color: var(--brand);
}

.copyright {
  margin: 0;
  padding: 14px 0 20px;
  text-align: center;
  font-size: 12px;
  color: var(--text-weak);
  border-top: 1px dashed var(--border);
}
</style>
