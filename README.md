# studydemo —— Vue 3 基础语法示例集

用 Vite + Vue 3.5 + TypeScript 搭建的学习项目，把 Vue 3 的基础语法拆成 **22 个可运行的示例**，每个示例都是独立的 `.vue` 文件，带详细中文注释，页面里可以直接看运行效果并一键查看源码。

## 快速开始

```sh
npm install
npm run dev        # 启动开发服务器，浏览器打开 http://localhost:5173
npm run build      # 类型检查 + 生产构建
node scripts/ssr-check.mjs   # 自检：把所有示例渲染一遍，验证无报错
```

## 页面怎么用

- **左侧目录**：按分组列出全部示例，支持关键词搜索
- **中间**：当前示例的知识点清单 + 运行效果（可以直接点、输入、交互）
- **源码区**：点「查看源码」展开当前示例的完整代码，可一键复制
- 想重新观察生命周期、初始化状态，点「重新挂载该示例」

## 目录结构

```
src/
├─ App.vue                    # 导航壳（目录 + 运行区 + 源码区）
├─ assets/main.css            # 全局基础样式（浅色主题）
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

> 每个示例都建议按这个流程看：先看「知识点清单」→ 点一点运行效果 → 点「查看源码」对照着读注释 → 自己改一改代码看变化。

## 新增一个示例

1. 在 `src/examples/demos/` 下新建 `.vue`（需要子组件就放 `parts/`）
2. 在 `src/examples/registry.ts` 的 `demos` 数组里加一条：id（文件名）、标题、分组、描述、知识点数组

组件和源码会被 `import.meta.glob` 自动收集，不需要手动 import。
