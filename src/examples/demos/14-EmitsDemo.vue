<!--
  示例 14：组件事件 Emits（子 → 父）与组件 v-model
  覆盖知识点：
    1. defineEmits 声明事件，用 emit('事件名', 参数) 触发
    2. 父组件用 @事件名 监听（这里用短横线 @update-name 更规范）
    3. 三种声明方式：数组、对象（带校验）、TS 泛型（推荐）
    4. 组件 v-model 原理：:modelValue + @update:modelValue
    5. Vue 3.4+ 的 defineModel：一行搞定组件 v-model
    6. 多个 v-model：v-model:title、v-model:content
    7. 自定义 v-model 修饰符（defineModel 的 get/set）
-->
<template>
  <div class="demo">
    <h4>1. 基础 emit：子 → 父</h4>
    <!-- 父组件监听子组件抛出的事件 -->
    <SearchBox @search="onSearch" @reset="onReset"/>
    <p>父组件收到的搜索关键词：<b>{{ keyword }}</b></p>

    <h4>2. 组件 v-model（Vue 3.4+ 推荐写法 defineModel）</h4>
    <!-- 双向绑定：父组件的值和子组件的输入完全同步 -->
    <MyInput v-model="message"/>
    <p>父组件的 message：{{ message }}</p>

    <h4>3. 多个 v-model</h4>
    <ArticleEditor v-model:title="article.title" v-model:content="article.content"/>
    <p>父组件 article：{{ article.title }} / {{ article.content }}</p>

    <h4>4. v-model 自定义修饰符</h4>
    <!-- .upper 是自定义的：输入时自动转大写（在子组件里通过 modifers 判断） -->
    <MyInput v-model.upper="upperText"/>
    <p>自动转大写：{{ upperText }}</p>

    <h4>5. 带参数校验的 emit</h4>
    <RatingStars :value="score" @change="(v: number) => (score = v)"/>
    <p>当前评分：{{ score }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import SearchBox from './parts/SearchBox.vue'
import MyInput from './parts/MyInput.vue'
import ArticleEditor from './parts/ArticleEditor.vue'
import RatingStars from './parts/RatingStars.vue'

const keyword = ref('')
const onSearch = (val: string) => {
  keyword.value = val
  console.log('父组件收到 search 事件，参数：', val)
}
const onReset = () => {
  keyword.value = ''
}

// 组件 v-model 绑定的值
const message = ref('Hello Vue3')
const upperText = ref('')

const article = reactive({ title: '标题', content: '正文内容' })

const score = ref(3)
</script>

<style scoped>
h4 {
  margin: 14px 0 6px;
  font-size: 14px;
  color: #1677ff;
}
</style>
