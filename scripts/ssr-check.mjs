/**
 * 自检脚本：用 SSR 方式把每个示例渲染一遍，提前发现渲染期错误
 * 运行：node scripts/ssr-check.mjs
 */
import { createServer } from 'vite'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

// SSR 环境没有 localStorage / window，这里做最小兜底
globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

const { demos, getDemoComponent } = await server.ssrLoadModule('/src/examples/registry.ts')

let failed = 0
for (const demo of demos) {
  try {
    const Comp = getDemoComponent(demo.id)
    if (!Comp) throw new Error('组件未找到')
    const app = createSSRApp(Comp)
    const warnings = []
    app.config.warnHandler = (msg) => warnings.push(msg)
    const html = await renderToString(app)
    console.log(`✅ ${demo.id} 渲染成功（${html.length} 字节）`)
    warnings.forEach((w) => console.log(`   ⚠️  ${w}`))
  } catch (err) {
    failed++
    console.error(`❌ ${demo.id} 渲染失败：`, err.message)
  }
}

await server.close()
console.log(failed ? `\n${failed} 个示例渲染失败` : '\n全部示例渲染通过')
process.exit(failed ? 1 : 0)
