<!--
  孙组件：inject 消费方
  它和 provide 的组件之间隔了一层，但依然能直接拿到数据
-->
<template>
  <div class="consumer" :style="{ borderColor: theme?.color }">
    <p :style="{ color: theme?.color }">站点名称：{{ theme?.title }}</p>
    <p>当前用户（ref 注入）：{{ user?.name }} / {{ user?.role }}</p>
    <p>版本号（普通值注入）：{{ version }}</p>

    <!-- 通过祖先提供的修改函数来改数据（✅ 推荐） -->
    <button @click="updateColor?.('#52c41a')">改成绿色</button>
    <button @click="updateColor?.('#f5222d')">改成红色</button>

    <!-- ❌ 错误演示：theme 是 readonly 的，直接改会告警 -->
    <button @click="tryModifyDirectly">❌ 直接改注入的 theme</button>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
// 引用和祖先「同一个」key（这里从共享文件导入，保证是同一个 Symbol 引用）
import { ThemeKey, UpdateThemeKey, CurrentUserKey } from './injection-keys'

// inject( key, 默认值 )：祖先没提供时使用默认值
const theme = inject(ThemeKey, { color: '#999', title: '默认标题' })
const updateColor = inject(UpdateThemeKey, () => {
  console.warn('祖先没有提供 updateTheme')
})

// 注入 ref：拿到的是 ref 本身，模板里会自动解包
const user = inject(CurrentUserKey)

// 注入普通值：没有默认值时类型是 T | undefined，用 ?? 兜底
const version = inject<string>('appVersion') ?? '未知版本'

const tryModifyDirectly = () => {
  // theme 被 readonly 包裹了，这行会 TS 报错 + 控制台告警，且不会生效
  // @ts-expect-error 演示用：readonly 对象不允许直接修改
  theme.color = '#000'
  console.log('theme.color 实际值：', theme.color, '（没有被改掉）')
}
</script>

<style scoped>
.consumer {
  border: 2px solid #1677ff;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13px;
}
.consumer p {
  margin: 4px 0;
}
</style>
