<!--
  示例 16：依赖注入 provide / inject
  解决「深层组件传参」问题：不用一层层 props 往下传，爷爷可以直接给孙子
  覆盖知识点：
    1. provide 提供数据，inject 注入使用（可以跨任意层级）
    2. provide 响应式数据（传 ref / reactive 对象，保持响应式）
    3. 用 readonly 包裹，防止后代组件乱改（推荐在后代里提供修改函数）
    4. inject 的默认值
    5. 使用 Symbol 作为 key，避免命名冲突（大型项目推荐）
  注意：provide/inject 会让组件耦合度变高，中大型项目优先考虑 Pinia 状态管理
-->
<template>
  <div class="demo">
    <h4>祖先组件（provide 提供方）</h4>
    <p>主题色：<input type="color" v-model="theme.color"/></p>
    <p>站点名称：<input v-model="theme.title"/></p>

    <!-- 中间层组件不接收任何 props，孙子组件依然能拿到数据 -->
    <MiddleComp/>
  </div>
</template>

<script setup lang="ts">
import { provide, reactive, readonly, ref } from 'vue'
import MiddleComp from './parts/MiddleComp.vue'
import { ThemeKey, UpdateThemeKey, CurrentUserKey, type Theme, type CurrentUser } from './parts/injection-keys'

// 1. 提供响应式数据：把整个 reactive 对象传下去，后代改了这里也会同步
const theme = reactive<Theme>({
  color: 'var(--brand)',
  title: 'Vue3 学习站',
})

// 2. 提供「只读」版本：后代只能读不能改（硬改会在控制台告警）
//    readonly 只作用于最外层包装，深层属性同样只读
provide(ThemeKey, readonly(theme))

// 3. 推荐做法：由祖先提供修改函数，修改逻辑集中在祖先，便于维护
const updateColor = (color: string) => {
  theme.color = color
}
provide(UpdateThemeKey, updateColor)

// 4. 也可以直接 provide 一个 ref（保持响应式）
const user = ref<CurrentUser>({ name: '张三', role: 'admin' })
provide(CurrentUserKey, user)

// 5. 提供普通值（非响应式，后代拿到后不会随这里变化）
provide<string>('appVersion', '1.0.0')

// 💡 提示：中大型项目里跨组件共享状态，优先考虑 Pinia，而不是到处 provide/inject
</script>

<style scoped>
h4 {
  margin: 14px 0 6px;
  font-size: 14px;
  color: var(--brand);
}
</style>
