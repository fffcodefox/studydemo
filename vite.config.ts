import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv, type ProxyOptions } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// 后端地址、接口前缀、dev server 端口全部放在 .env.development / .env.production 里，
// 这个文件只负责读出来用 —— 换端口、换环境都不用改这里的代码。
export default defineConfig(({ mode }) => {
  // 第三个参数传 '' 表示连不带 VITE_ 前缀的变量也读进来（DEV_PROXY_TARGET 这类只给配置文件用）
  const env = loadEnv(mode, process.cwd(), '')

  // 后端服务地址，要和 studydemo-backend 的 server.port 一致。
  // 默认值故意写 127.0.0.1 而不是 localhost：Node 解析 localhost 会优先拿到 IPv6 的 ::1，
  // 而 Spring Boot 默认只监听 IPv4，结果代理报 502 ECONNREFUSED —— 后端在跑却连不上。
  const proxyTarget = env.DEV_PROXY_TARGET || 'http://127.0.0.1:8080'
  const devPort = Number(env.DEV_SERVER_PORT) || 5173

  // 用 ^/api/ 而不是 /api：后者是前缀匹配，会把前端自己的路由（比如 /api-xxx）也一起转发给后端。
  // 生产环境的 Nginx 写 location /api 有同样的坑，记得写成 location /api/。
  const apiProxy: Record<string, ProxyOptions> = {
    '^/api/': {
      target: proxyTarget,
      changeOrigin: true,
      // 后端接口自带 /api 前缀（HelloController 是 @RequestMapping("/api")），
      // 所以这里不做 rewrite，原样转发 /api/hello -> http://127.0.0.1:8080/api/hello
    },
  }

  return {
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
      // 端口被占用时 Vite 默认会自动 +1，调试时容易看错地址；
      // 需要「端口被占就直接报错」的话，把下面这行注释打开。
      // strictPort: true,
      port: devPort,
      proxy: apiProxy,
    },
    // vite preview 是拿生产产物起本地静态服务。也把 /api 代理出去，
    // 这样能在本地验证「构建后的代码」能不能连上后端。
    preview: {
      port: devPort,
      proxy: apiProxy,
    },
  }
})
