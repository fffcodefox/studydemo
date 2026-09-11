<!--
  示例 02：v-bind 属性绑定
  覆盖知识点：
    1. v-bind 基本用法与「:」简写
    2. 绑定布尔属性（disabled、checked 等，值为假时属性被移除）
    3. 动态属性名 v-bind:[attrName]
    4. 一次绑定多个属性：v-bind="对象"
    5. 属性值为 null / undefined / false 时的差异
    6. 插值不能用在属性上（必须写 :src="url" 而不是 src="{{ url }}"）
-->
<template>
  <div class="demo">
    <!-- 1. 完整写法 v-bind:src 与简写 :src 完全等价，实际开发都用简写 -->
    <img v-bind:src="imgUrl" alt="图片" width="80"/>
    <img :src="imgUrl" alt="图片" width="80"/>

    <!-- 2. 绑定普通属性（title、id、href 等） -->
    <p><a :href="link" :title="linkTitle" target="_blank">鼠标悬停看 title</a></p>
    <p><a  :href="link" :title="linkTitle" target="_blank"> 悬停效果</a></p>

    <!-- 3. 布尔属性：值为 true 时属性存在，为 false / null / undefined 时属性被移除 -->
    <button :disabled="isDisabled">禁用按钮（isDisabled={{ isDisabled }}）</button>
    <button @click="isDisabled = !isDisabled">切换禁用状态</button>
    <button :disabled="isDisabled">禁用按钮（isDisabled={{ isDisabled }}）</button>
    <p>
      注意区别：
      <code>disabled="false"</code> 字符串会当成真值（仍禁用），
      而 <code>:disabled="false"</code> 才是真的不禁用
    </p>

    <!-- 4. 动态属性名：属性名本身也是变量时用方括号 -->
    <p :[dynamicAttr]="dynamicValue">
      这个 p 标签的属性名是 {{ dynamicAttr }}，值是 {{ dynamicValue }}
    </p>
    <button @click="dynamicAttr = dynamicAttr === 'title' ? 'data-role' : 'title'">
      切换属性名
    </button>

    <!-- 5. 一次性绑定多个属性：直接 v-bind 一个对象，key 是属性名，value 是值 -->
    <!--    等价于 :id="attrs.id" :class="attrs.class" :data-index="attrs['data-index']" -->
    <p v-bind="attrs">这一行同时绑定了 id / class / data-index，鼠标悬停看 title</p>
    <p v-bind="attrs">  </p>

    <!-- 6. 传值可以是表达式、方法调用结果 -->
    <p :title="getTip()">title 来自方法返回值</p>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue'

const imgUrl = ref('https://cn.vuejs.org/images/logo.svg')
const link = ref('https://cn.vuejs.org/')
const linkTitle = ref('Vue 官方文档')

// 布尔属性演示
const isDisabled = ref(true)

// 动态属性名演示
const dynamicAttr = ref('title')
const dynamicValue = ref('我是动态属性')

// 批量绑定的属性对象（用 reactive 或普通对象都可以）
const attrs = reactive({
  id: 'multi-bind-p',
  class: 'highlight',
  title: '来自 v-bind 对象的 title',
  'data-index': 1,
})

const getTip = () => `生成时间：${new Date().toLocaleTimeString()}`
</script>

<style scoped>
.demo img {
  margin-right: 12px;
  vertical-align: middle;
}

.highlight {
  background: #fff7e6;
  padding: 4px;
  border-left: 3px solid #faad14;
}
</style>
