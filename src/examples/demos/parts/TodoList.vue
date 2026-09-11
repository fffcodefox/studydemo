<!--
  子组件：演示作用域插槽（子组件负责数据，父组件负责渲染样式）
-->
<template>
  <ul class="todo-list">
    <li v-for="(item, index) in items" :key="index">
      <!--
        作用域插槽：把 item 和 index 传给父组件
        父组件用 <template #item="{ item, index }"> 接收
      -->
      <slot name="item" :item="item" :index="index">
        <!-- 后备内容：父组件没自定义时使用 -->
        {{ item.text }}
      </slot>
    </li>
  </ul>
</template>

<script setup lang="ts">
interface TodoItem {
  text: string
  done: boolean
}

defineProps<{ items: TodoItem[] }>()
</script>

<style scoped>
.todo-list {
  list-style: none;
  padding: 0;
  margin: 8px 0;
}
.todo-list li {
  padding: 4px 0;
  border-bottom: 1px dashed #e6efec;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
