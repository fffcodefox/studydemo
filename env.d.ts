/// <reference types="vite/client" />

/**
 * 自定义环境变量类型声明，配合 .env.development / .env.production 使用。
 * 不写这里的变量名也能跑（vite/client 带了索引签名），但写了才有提示和拼写检查。
 */
interface ImportMetaEnv {
  /**
   * 接口前缀，见 .env.development / .env.production。
   * dev 与 prod 默认都是 /api，区别只在由谁转发（开发是 Vite 代理，生产是 Nginx）。
   * 缺省时 src/api/http.ts 会回落到 /api。
   */
  readonly VITE_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
