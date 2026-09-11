<!--
  子组件：演示「多个 v-model」
  父组件用法：<ArticleEditor v-model:title="t" v-model:content="c"/>
  原理：v-model:title 等价于 :title + @update:title
-->
<template>
  <div class="editor">
    <p><input v-model="title" placeholder="标题"/></p>
    <p><textarea v-model="content" rows="3" placeholder="正文"></textarea></p>
  </div>
</template>

<script setup lang="ts">
// 不传名字 = modelValue；传名字 = 对应的具名 v-model
// 每个 defineModel 都会生成对应的 prop 和 update 事件
const title = defineModel<string>('title', { required: true })
const content = defineModel<string>('content', { default: '' })
</script>

<style scoped>
.editor {
  border: 1px solid #dbe8e5;
  border-radius: 6px;
  padding: 8px;
  margin: 6px 0;
}
.editor input,
.editor textarea {
  width: 100%;
  box-sizing: border-box;
}
</style>
