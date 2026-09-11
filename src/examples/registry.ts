/**
 * 示例注册表
 *
 * 作用：把 demo 组件 + 源码 + 说明文字集中管理，App.vue 只负责渲染。
 * 新增示例的步骤：
 *   1. 在 ./demos/ 下新建 xxx.vue（文件名去掉 .vue 就是下面的 id）
 *   2. 在下面的 demos 数组里加一条配置
 * 组件和源码通过 Vite 的 import.meta.glob 自动收集，不用手动 import
 */
import type { Component } from 'vue'

export interface DemoItem {
  /** 对应 ./demos/ 下的文件名（不含扩展名） */
  id: string
  /** 侧边栏显示的标题 */
  title: string
  /** 分组名（侧边栏按分组归类） */
  group: string
  /** 一句话说明这个示例讲什么 */
  desc: string
  /** 知识点清单，展示在示例上方 */
  points: string[]
}

// 收集所有 demo 组件（eager: true 表示同步加载）
const modules = import.meta.glob<Component>('./demos/*.vue', {
  eager: true,
  import: 'default',
})

// 收集所有 demo 的源码文本（query: '?raw' 让 Vite 把文件当字符串返回）
const sources = import.meta.glob<string>('./demos/*.vue', {
  eager: true,
  query: '?raw',
  import: 'default',
})

/** 示例清单（顺序即侧边栏顺序） */
export const demos: DemoItem[] = [
  {
    id: '01-InterpolationDemo',
    title: '1. 模板插值 {{ }}',
    group: '一、模板与指令',
    desc: '文本插值、JS 表达式、v-text / v-html / v-once / v-pre',
    points: [
      '{{ }} 双大括号把数据渲染成文本',
      '插值里只能写「单个表达式」，不能写语句',
      'v-html 会解析 HTML，有 XSS 风险',
      'v-once 只渲染一次，v-pre 跳过编译',
    ],
  },
  {
    id: '02-BindDemo',
    title: '2. v-bind 属性绑定',
    group: '一、模板与指令',
    desc: '属性绑定、布尔属性、动态属性名、批量绑定',
    points: [
      'v-bind 简写为 :',
      '布尔属性为假时会被移除',
      'v-bind:[key] 动态属性名',
      'v-bind="对象" 一次绑定多个属性',
    ],
  },
  {
    id: '03-ClassStyleDemo',
    title: '3. class / style 绑定',
    group: '一、模板与指令',
    desc: '对象和数组语法，静态与动态 class 共存',
    points: [
      ':class="{ active: isActive }" 对象语法',
      ':class="[a, b]" 数组语法，两者可混用',
      ':style 推荐用对象，属性名驼峰',
      '静态 class 与动态 :class 会自动合并',
    ],
  },
  {
    id: '04-ConditionalDemo',
    title: '4. v-if / v-show',
    group: '一、模板与指令',
    desc: '条件渲染与两种方式的本质区别',
    points: [
      'v-if / v-else-if / v-else 必须相邻',
      'v-show 只切换 display，元素始终存在',
      'v-if 会销毁重建，v-show 保留状态',
      '频繁切换用 v-show，条件少变用 v-if',
    ],
  },
  {
    id: '05-ListRenderDemo',
    title: '5. v-for 列表渲染',
    group: '一、模板与指令',
    desc: '遍历数组/对象/数字，key 的重要性',
    points: [
      '(item, index) in list，遍历对象时是 (值, 键, 索引)',
      ':key 必须用稳定唯一值，别用 index',
      '不要在同一元素上同时写 v-for 和 v-if',
      '过滤数据优先用 computed',
    ],
  },
  {
    id: '06-EventDemo',
    title: '6. 事件处理与修饰符',
    group: '一、模板与指令',
    desc: '@click、$event、事件/按键/系统修饰符',
    points: [
      'v-on 简写为 @，内联语句或方法处理器',
      '.stop .prevent .once .self .capture .passive',
      '.enter .esc 等按键修饰符，.ctrl .exact 系统键',
      '修饰符可以串联：@click.stop.prevent',
    ],
  },
  {
    id: '07-FormModelDemo',
    title: '7. 表单 v-model',
    group: '一、模板与指令',
    desc: 'input/textarea/checkbox/radio/select 与三个修饰符',
    points: [
      'v-model 是 :value + @input 的语法糖',
      '多选绑定到数组，单选绑定到值',
      '.lazy 失焦同步 / .number 转数字 / .trim 去空格',
      '表单字段建议收拢成一个 reactive 对象',
    ],
  },
  {
    id: '08-ReactivityDemo',
    title: '8. ref 与 reactive',
    group: '二、响应式核心',
    desc: '响应式数据的两种声明方式与常见坑',
    points: [
      'ref 任意类型，脚本里要 .value，模板自动解包',
      'reactive 只接受对象，直接访问属性',
      '解构 reactive 会丢失响应式 → toRefs / toRef',
      'reactive 不能整体替换，要改属性或用 Object.assign',
    ],
  },
  {
    id: '09-ComputedDemo',
    title: '9. computed 计算属性',
    group: '二、响应式核心',
    desc: '缓存特性、可写计算属性、与 methods 的区别',
    points: [
      'computed 有缓存，依赖不变不重新计算',
      'computed 里不要写副作用（请求、改状态）',
      '可写 computed：传 { get, set }',
      '计算属性可以依赖其他计算属性',
    ],
  },
  {
    id: '10-WatchDemo',
    title: '10. watch 与 watchEffect',
    group: '二、响应式核心',
    desc: '侦听器的各种写法、选项、停止与清理',
    points: [
      'watch 监听 ref / getter / reactive / 多源数组',
      'deep、immediate、once、flush 选项',
      'watchEffect 自动收集依赖并立即执行一次',
      '调用 watch 返回的函数即可停止侦听',
    ],
  },
  {
    id: '20-AdvancedReactiveDemo',
    title: '11. 进阶响应式 API',
    group: '二、响应式核心',
    desc: 'shallowRef、readonly、customRef、effectScope 等',
    points: [
      'shallowRef / shallowReactive：只追踪浅层，性能更好',
      'readonly 只读代理，常配合 provide 使用',
      'customRef 自定义依赖收集（经典案例：防抖）',
      'effectScope 统一管理一组副作用',
    ],
  },
  {
    id: '11-LifecycleDemo',
    title: '12. 生命周期钩子',
    group: '三、生命周期与引用',
    desc: '从 setup 到卸载的完整流程，附带真实日志',
    points: [
      '<script setup> 顶层代码相当于 created',
      'onMounted 最常用：发请求、操作 DOM',
      '更新钩子：onBeforeUpdate / onUpdated',
      '卸载前清理定时器、事件监听',
    ],
  },
  {
    id: '12-TemplateRefDemo',
    title: '13. 模板引用与 nextTick',
    group: '三、生命周期与引用',
    desc: '获取 DOM、组件实例、defineExpose、nextTick',
    points: [
      'ref(null) + 模板 ref="xxx" 获取 DOM',
      '子组件用 defineExpose 暴露方法',
      'v-for 上的 ref 得到数组',
      'nextTick 等 DOM 更新后再操作',
    ],
  },
  {
    id: '13-PropsDemo',
    title: '14. Props 父传子',
    group: '四、组件通信',
    desc: '声明、默认值、校验、单向数据流',
    points: [
      'defineProps 三种写法，推荐 TS 泛型',
      'withDefaults 设置默认值（对象用工厂函数）',
      'props 只读，不要在子组件里改',
      '未声明的属性会透传到根元素',
    ],
  },
  {
    id: '14-EmitsDemo',
    title: '15. Emits 与组件 v-model',
    group: '四、组件通信',
    desc: '子传父、defineModel、多个 v-model 与修饰符',
    points: [
      'defineEmits 声明事件，emit 触发',
      'defineModel 一行实现组件 v-model（3.4+）',
      '多个 v-model：v-model:title',
      '自定义 v-model 修饰符',
    ],
  },
  {
    id: '15-SlotsDemo',
    title: '16. 插槽 Slots',
    group: '四、组件通信',
    desc: '默认/具名/作用域插槽与动态插槽名',
    points: [
      '<slot> 占位，父组件决定内容',
      '#header 是 v-slot:header 的简写',
      '作用域插槽：子组件把数据传给插槽',
      '$slots 判断插槽是否传入',
    ],
  },
  {
    id: '16-ProvideInjectDemo',
    title: '17. provide / inject',
    group: '四、组件通信',
    desc: '跨层级传值，避免 props 一层层透传',
    points: [
      'provide 提供，inject 注入，可跨任意层级',
      '提供 ref/reactive 保持响应式',
      '用 readonly + 修改函数保护数据',
      'key 用 Symbol 且必须共享同一个引用',
    ],
  },
  {
    id: '17-DynamicComponentDemo',
    title: '18. 动态组件与异步组件',
    group: '五、高级特性',
    desc: '<component :is>、KeepAlive、异步加载、Suspense',
    points: [
      '<component :is="comp"> 动态切换组件',
      'KeepAlive 缓存组件状态，onActivated/onDeactivated',
      'defineAsyncComponent 按需加载',
      'Suspense 处理顶层 await 的加载态',
    ],
  },
  {
    id: '18-BuiltInDemo',
    title: '19. 内置组件',
    group: '五、高级特性',
    desc: 'Teleport 传送、Transition / TransitionGroup 动画',
    points: [
      'Teleport 把 DOM 渲染到 body（弹窗常用）',
      'Transition 的 6 个 class 与 name、mode',
      'TransitionGroup 列表增删与移动动画',
      '.xxx-move 让元素位置变化平滑过渡',
    ],
  },
  {
    id: '19-ComposableDemo',
    title: '20. 组合式函数',
    group: '五、高级特性',
    desc: '把有状态逻辑抽成 useXxx 函数复用',
    points: [
      '约定：use 开头，返回 ref + 方法',
      '每次调用状态独立，不共享',
      '副作用要在 onUnmounted 里清理',
      '参数用 toValue 支持 值/ref/getter',
    ],
  },
  {
    id: '22-TypeScriptDemo',
    title: '21. TypeScript 用法',
    group: '五、高级特性',
    desc: '类型标注、泛型组件、事件类型',
    points: [
      'ref<T> / reactive<接口> 显式标注类型',
      'defineProps / defineEmits 泛型写法',
      '<script setup generic="T"> 泛型组件',
      '事件对象类型：Event / MouseEvent / KeyboardEvent',
    ],
  },
  {
    id: '21-OptionsApiDemo',
    title: '22. 选项式 API 对照',
    group: '六、写法对照',
    desc: '原项目里的写法：data / methods / computed / watch',
    points: [
      'data 返回响应式数据，methods 定义方法',
      'computed / watch 写成对象选项',
      '生命周期改为 created / mounted 等选项',
      'this 指向组件实例，不要用箭头函数写 methods',
    ],
  },
]

/** 根据 id 拿到 demo 组件 */
export function getDemoComponent(id: string): Component | undefined {
  return modules[`./demos/${id}.vue`]
}

/** 根据 id 拿到 demo 源码文本 */
export function getDemoSource(id: string): string {
  return sources[`./demos/${id}.vue`] ?? ''
}
