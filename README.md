# studydemo —— 学习笔记站（门户 + Vue 3 基础语法示例集 + 后端联调）

用 Vite + Vue 3.5 + TypeScript 搭建的学习项目，包含三部分：

1. **门户首页**：黄绿配色 + 书页质感的导航站，按分类浏览「文章」
2. **示例集**：把 Vue 3 基础语法拆成 **22 个可运行的示例**，每个示例都是独立的 `.vue` 文件，带详细中文注释，可直接看运行效果并一键查看源码
3. **接口示例页**：真的往 `studydemo-backend` 发请求，演示前后端分离下怎么调接口

## 快速开始

```sh
npm install
npm run dev        # 启动开发服务器，浏览器打开 http://localhost:5173
npm run build      # 类型检查 + 生产构建
node scripts/ssr-check.mjs   # 自检：把所有示例渲染一遍，验证无报错
```

> 只看 22 个示例不需要后端。要看**接口示例页**，得先把 `studydemo-backend` 跑起来（默认 8080），
> 否则页面会提示「请求发不出去」。后端地址在 `.env.development` 的 `DEV_PROXY_TARGET` 里改。

## 页面与路由

| 路由 | 页面 | 说明 |
| --- | --- | --- |
| `/` | `HomeView` | 门户首页：Hero、分类导航、头条示例、最新文章 |
| `/category/:id` | `CategoryView` | 分类页，列出该分类下的内容（如 `/category/frontend`） |
| `/study/:id?` | `StudyView` | 示例集学习页，`:id` 可选，可直达并分享某个示例 |
| `/backend-demo` | `ApiDemoView` | 接口示例页，调用后端 `GET /api/hello`，展示 Redis 计数与 MySQL 行数 |

> 接口示例页刻意不叫 `/api-demo`：`/api` 是代理给后端的路径前缀，前端路由用同一前缀会在开发代理和 Nginx 转发时被误伤。

顶部导航的分类来自 `src/data/posts.ts` 的 `categories`；首页头条「基础 vue-study-demo」点击后跳到 `/study`。

## 与后端联调（前后端分离）

前端不直连后端，而是请求同源的 `/api/xxx`，由中间层转发：

```
浏览器 (5173)  →  /api/hello  →  Vite Dev Server  →  127.0.0.1:8080 (Spring Boot)  →  MySQL + Redis
                                  ↑ server.proxy                    ↑ 生产环境换成 Nginx
```

这样浏览器眼里始终是同源请求，**不会触发跨域**，也不用管后端的 CORS 白名单。

### 环境配置

| 文件 | 作用 |
| --- | --- |
| `.env.development` | 开发环境：`DEV_SERVER_PORT` 前端端口、`DEV_PROXY_TARGET` 后端地址、`VITE_API_BASE` 接口前缀 |
| `.env.production` | 生产环境：接口前缀。默认 `/api`，交给 Nginx 反向代理 |

变量命名约定：`VITE_` 开头的会被注入前端代码，`DEV_` 开头的只给 `vite.config.ts` 用，不进产物。
个人本地覆盖写 `.env.local`（已被 `.gitignore` 忽略，不会提交）。

**改后端端口只需要动 `.env.development` 的 `DEV_PROXY_TARGET` 一行**，其它文件都不用碰。

### 请求封装

`src/api/` 三个文件，零新增依赖（用原生 fetch，没装 axios）：

- `http.ts` —— 拼 `VITE_API_BASE`、解包后端的 `Result<T>`、把网络层失败和业务层失败分开抛 `ApiError`
- `hello.ts` —— 一个 Controller 对应一个模块，`fetchHello(name)` 只负责拼路径
- `types.ts` —— 与后端 Java 类一一对应的类型声明（`ApiResult<T>` / `HelloVO`）

### 两个容易踩的坑

1. **代理规则别写成 `/api`，要写 `^/api/`。** 前者是前缀匹配，会把 `/api-xxx` 这类前端路由一起转发给后端。
   Nginx 的 `location /api` 有同样的毛病，要写 `location /api/`。
2. **代理目标别写 `localhost`，写 `127.0.0.1`。** Node 解析 `localhost` 会优先拿到 IPv6 的 `::1`，
   而 Spring Boot 默认只监听 IPv4，结果就是后端明明在跑，代理却报 `502 ECONNREFUSED`。

## 示例集怎么用

- **左侧目录**：按分组列出全部示例，支持关键词搜索
- **中间**：当前示例的知识点清单 + 运行效果（可以直接点、输入、交互）
- **源码区**：点「查看源码」展开当前示例的完整代码，浅底 + 行号 + 语法高亮，可一键复制
- 想重新观察生命周期、初始化状态，点「重新挂载该示例」

## 目录结构

```
.env.development              # 开发环境配置（端口 / 后端地址 / 接口前缀）
.env.production               # 生产环境配置
vite.config.ts                # 通过 loadEnv 读取上面的配置，配置 /api 代理
src/
├─ App.vue                    # 应用外壳（导航 + 路由视图 + 页脚）
├─ main.ts                    # 入口，挂载 router
├─ router/index.ts            # 路由表
├─ api/                       # 后端接口层
│  ├─ http.ts                 # fetch 封装：解包 Result、统一异常
│  ├─ hello.ts                # HelloController 对应的接口
│  └─ types.ts                # ApiResult / HelloVO 类型
├─ assets/main.css            # 全局样式：黄绿主题 + 书页质感 + 主题变量
├─ components/
│  ├─ SiteNav.vue             # 全站顶部导航（分类 + 搜索 + 开始学习）
│  └─ PostCard.vue            # 文章 / 示例卡片（普通卡 + 头条大卡）
├─ data/posts.ts              # 站点内容数据：分类表 + 文章清单
├─ views/
│  ├─ HomeView.vue            # 门户首页
│  ├─ CategoryView.vue        # 分类页
│  ├─ StudyView.vue           # 示例集学习页
│  └─ ApiDemoView.vue         # 接口示例页
├─ utils/highlight.ts         # 轻量语法高亮（无第三方依赖）
└─ examples/
   ├─ registry.ts             # 示例清单（标题/分组/知识点），新增示例在这里登记
   ├─ composables/            # 示例 19 用的组合式函数
   │  ├─ useCounter.ts
   │  ├─ useMouse.ts
   │  └─ useLocalStorage.ts
   └─ demos/                  # 22 个示例组件（一个文件一个知识点）
      ├─ 01-InterpolationDemo.vue      模板插值 {{ }}
      ├─ 02-BindDemo.vue               v-bind 属性绑定
      ├─ 03-ClassStyleDemo.vue         class / style 绑定
      ├─ 04-ConditionalDemo.vue        v-if / v-show
      ├─ 05-ListRenderDemo.vue         v-for 列表渲染
      ├─ 06-EventDemo.vue              事件处理与修饰符
      ├─ 07-FormModelDemo.vue          表单 v-model
      ├─ 08-ReactivityDemo.vue         ref / reactive
      ├─ 09-ComputedDemo.vue           computed 计算属性
      ├─ 10-WatchDemo.vue              watch / watchEffect
      ├─ 11-LifecycleDemo.vue          生命周期钩子
      ├─ 12-TemplateRefDemo.vue        模板引用 / nextTick
      ├─ 13-PropsDemo.vue              Props 父传子
      ├─ 14-EmitsDemo.vue              Emits 与组件 v-model
      ├─ 15-SlotsDemo.vue              插槽 Slots
      ├─ 16-ProvideInjectDemo.vue      provide / inject
      ├─ 17-DynamicComponentDemo.vue   动态组件 / KeepAlive / 异步组件
      ├─ 18-BuiltInDemo.vue            Teleport / Transition / TransitionGroup
      ├─ 19-ComposableDemo.vue         组合式函数
      ├─ 20-AdvancedReactiveDemo.vue   进阶响应式 API
      ├─ 21-OptionsApiDemo.vue         选项式 API 对照（原 App.vue 代码）
      ├─ 22-TypeScriptDemo.vue         TypeScript 用法
      └─ parts/                        各示例用到的子组件
```

## 建议的学习顺序

1. **先跑通渲染**：01 → 05（插值、绑定、条件、列表）
2. **再学交互**：06 → 07（事件、表单）
3. **理解响应式**：08 → 10（ref/reactive、computed、watch）
4. **组件化**：13 → 16（props、emits、插槽、provide/inject）
5. **进阶**：17 → 20（动态组件、内置组件、组合式函数、高级响应式 API）
6. **接后端**：看 `/backend-demo` 页面 + `src/api/` 三个文件

> 每个示例都建议按这个流程看：先看「知识点清单」→ 点一点运行效果 → 点「查看源码」对照着读注释 → 自己改一改代码看变化。

## 新增一个示例

1. 在 `src/examples/demos/` 下新建 `.vue`（需要子组件就放 `parts/`）
2. 在 `src/examples/registry.ts` 的 `demos` 数组里加一条：id（文件名）、标题、分组、描述、知识点数组

组件和源码会被 `import.meta.glob` 自动收集，不需要手动 import。

## 新增一个后端接口

1. 在 `src/api/types.ts` 加对应的返回类型（照抄后端 VO 的字段）
2. 在 `src/api/` 下按模块加函数，直接 `request<返回类型>('/xxx')`
3. 页面里 `import` 调用即可，不用再管 baseURL 和错误结构
