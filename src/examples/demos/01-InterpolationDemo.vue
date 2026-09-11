<!--
  示例 01：模板语法与插值
  覆盖知识点：
    1. 文本插值 {{ }}（Mustache 语法）
    2. 插值里可以写「单个 JS 表达式」（不能写语句、不能写 if，只能用三元）
    3. v-text / v-html 的区别（v-html 有 XSS 风险）
    4. v-once：只渲染一次，之后数据变化不再更新
    5. v-pre：跳过编译，原样输出 {{ }}
    6. v-memo：Vue 3.2+ 按条件缓存一块模板（性能优化用）
  补充：本例使用 <script setup lang="ts"> 组合式 API 写法，是本项目的统一风格
-->
<template>
  <div class="demo">
    <!-- 1. 最基础的文本插值：把响应式数据渲染到页面上 -->
    <p>你好，{{ name }}</p>
    <p v-text="'你好!'+name+';你今年'+age+1+'岁了'"></p>

    <!-- 2. 插值中可以直接写 JS 表达式：运算、三元、字符串方法、方法调用都行 -->
    <p>明年你 {{ age + 1 }} 岁</p>
    <p>成年了吗：{{ age >= 18 ? '成年' : '未成年' }}</p>
    <p>名字反转：{{ name.split('').reverse().join('') }}</p>
    <p>调用方法：{{ greet() }}</p>

    <!-- 注意：插值里不能写语句，下面这些都不合法
         {{ var a = 1 }}      ❌ 声明语句
         {{ if (ok) { ... } }} ❌ 流程控制语句（请用三元表达式）
    -->

    <!-- 3. v-text 等价于 {{ }}，会覆盖整个标签内的文本内容 -->
    <p v-text="'v-text 渲染：' + name"></p>

    <!-- 4. v-html 会把字符串当作 HTML 解析（有 XSS 风险，绝不要用于用户输入） -->
    <p>v-html 渲染：<span v-html="rawHtml"></span></p>
    <p>同样的字符串用插值：{{ rawHtml }}</p>

    <!-- 5. v-once：只渲染一次，后续数据变化不再更新这块内容 -->
    <p>普通插值（会跟着变）：{{ count }}</p>
    <p v-once>v-once 插值（永远停在初始值）：{{ count }}</p>
    <button @click="count++">count + 1，观察上面两行的差别</button>

    <!-- 6. v-pre：跳过这个元素及其子元素的编译，原样显示 -->
    <p v-pre>这里不会被编译：{{ name }}</p>

    <!-- 7. v-memo：只有依赖变化时才重新渲染这一块（这里是 count 变化才更新） -->
    <div v-memo="[count]">
      这块被 v-memo 缓存，依赖 count：当前 count = {{ count }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

// ref 用来定义基础类型的响应式数据，在 <script> 中必须通过 .value 访问
const name = ref('张三')
const age = ref(18)
const count = ref(0)
const rawHtml = ref('<strong style="color:#42b883">加粗的绿色文字</strong>')

// 插值里也可以调用方法，每次重新渲染时都会执行
const greet = () => `大家好，我是 ${name.value}`
</script>

<style scoped>
.demo p {
  margin: 6px 0;
}
</style>
