<!--
  子组件：演示 defineModel（Vue 3.4+）—— 组件 v-model 的最佳写法
  父组件用法：<MyInput v-model="msg"/> 或 <MyInput v-model.upper="msg"/>
  原理：defineModel 等价于
    props: { modelValue: ... } + emits: ['update:modelValue']
    并自动把输入框的值同步回父组件
-->
<template>
  <div class="my-input">
    <!--
      这里不用 v-model，而是 :value + @input，
      这样输入的值会先经过 defineModel 的 set 处理（比如转大写）再写回父组件
    -->
    <input :value="model" @input="onInput" placeholder="输入内容"/>
    <span class="tip">当前修饰符：{{ modifiers.upper ? '.upper（自动转大写）' : '无' }}</span>
  </div>
</template>

<script setup lang="ts">
// 第一个泛型：值的类型；第二个泛型：支持的修饰符名
// 解构得到 [绑定值, 修饰符对象]
const [model, modifiers] = defineModel<string, 'upper'>({
  // set：父组件的 v-model 值被写入前会经过这里
  set(value) {
    // 如果父组件写了 v-model.upper，就把值转成大写
    if (modifiers.upper) return String(value).toUpperCase()
    return value
  },
})

const onInput = (e: Event) => {
  // 把输入值赋给 model，会自动 emit('update:modelValue', 值)
  model.value = (e.target as HTMLInputElement).value
}
</script>

<style scoped>
.my-input {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0;
}
.tip {
  font-size: 12px;
  color: var(--text-sub);
}
</style>
