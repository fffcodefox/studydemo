<!--
  子组件：演示 props 的 TS 泛型写法 + withDefaults + 单向数据流
-->
<template>
  <!-- 根元素：父组件传来的 class / data-* 会透传到这里（默认 inheritAttrs: true） -->
  <div class="user-card">
    <p><b>{{ name }}</b> <span v-if="isVip" class="vip">VIP</span></p>
    <p>年龄：{{ age }}</p>
    <p>爱好：{{ hobbies.length ? hobbies.join('、') : '无（用了默认值）' }}</p>

    <!-- 演示：props 是只读的，直接改会报警告 -->
    <button @click="tryModifyProp">❌ 尝试直接修改 props.age</button>
    <p class="warn" v-if="warnMsg">{{ warnMsg }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ✅ 推荐写法：TS 泛型声明 props，类型提示最完整
interface Props {
  name: string // 必填
  age?: number // 可选
  hobbies?: string[] // 可选，数组
  isVip?: boolean // 可选，布尔
}

// withDefaults 给可选属性设置默认值
// 注意：引用类型（数组/对象）的默认值必须用「工厂函数」返回，避免多个实例共享同一个引用
const props = withDefaults(defineProps<Props>(), {
  age: 18,
  hobbies: () => ['写代码'],
  isVip: false,
})

const warnMsg = ref('')

// 单向数据流：props 只读，不能直接改
const tryModifyProp = () => {
  // 下面这行在 TS 下会直接编译报错（props 是只读的），运行时也会警告
  // props.age = 100
  warnMsg.value = 'props 是只读的！要改请用 emit 通知父组件（见示例 14）'
}
</script>

<style scoped>
.user-card {
  border: 1px solid var(--border-strong);
  border-radius: 6px;
  padding: 8px 12px;
  margin: 6px 0;
  background: #fff;
}
.user-card p {
  margin: 2px 0;
}
.vip {
  background: #faad14;
  color: #fff;
  font-size: 11px;
  padding: 1px 5px;
  border-radius: 3px;
}
.warn {
  color: #d4380d;
  font-size: 12px;
}
</style>
