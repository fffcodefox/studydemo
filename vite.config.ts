import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// 后端（studydemo-backend）默认跑在 8080，这里把 /api 前缀的请求代理过去。
// 走代理的好处：浏览器眼里请求的还是 5173 同源，不触发跨域，
// 也就不依赖后端 CorsConfig 放行的那一个 localhost:5173。
// 生产环境用 Nginx 把同样的 /api 转发到后端，前端代码不用改。
const BACKEND_ORIGIN = 'http://localhost:8080'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: BACKEND_ORIGIN,
        changeOrigin: true,
        // 注意：后端接口本身就带 /api 前缀（HelloController 是 @RequestMapping("/api")），
        // 所以这里不做 rewrite，原样转发 /api/hello -> http://localhost:8080/api/hello
      },
    },
  },
})
