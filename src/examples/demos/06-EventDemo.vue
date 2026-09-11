<!--
  示例 06：事件处理与修饰符
  覆盖知识点：
    1. v-on 与 @ 简写
    2. 内联语句 / 方法处理器 / 方法 + 参数
    3. 事件对象 $event 与原生 event
    4. 事件修饰符：.stop .prevent .self .once .capture .passive
    5. 按键修饰符：.enter .tab .esc .space .up .down .delete 及自定义按键名
    6. 系统修饰键：.ctrl .alt .shift .meta，配合 .exact 精确匹配
    7. 鼠标修饰符：.left .right .middle
    8. 修饰符可以串联：@click.stop.prevent
-->
<template>
  <div class="demo">
    <!-- 1. 内联语句：直接写一行 JS -->
    <button @click="count++">内联语句 count++（现在 {{ count }}）</button>

    <!-- 2. 方法处理器：不写括号时，第一个参数默认就是原生事件对象 -->
    <button @click="handleClick">方法处理器（看控制台）</button>

    <!-- 3. 传参 + 事件对象：用 $event 占位 -->
    <button @click="say('你好', $event)">传参 + $event</button>

    <h4>事件修饰符</h4>

    <!-- .stop：阻止事件冒泡（等价于 event.stopPropagation()） -->
    <div class="outer" @click="log('outer 被点击（冒泡上来的）')">
      外层 div
      <button @click.stop="log('内层按钮：.stop 阻止了冒泡，外层不会触发')">.stop</button>
    </div>

    <!-- .prevent：阻止默认行为（等价于 event.preventDefault()） -->
    <a href="https://cn.vuejs.org/" @click.prevent="log('.prevent 阻止了链接跳转')">
      点我不会跳转（.prevent）
    </a>

    <!-- .self：只有事件目标是元素自身时才触发（点击子元素不会触发） -->
    <div class="outer" @click.self="log('.self：只有点击我本身才触发')">
      .self 区域
      <button @click="log('点子元素会冒泡到外层，但外层有 .self 不触发')">子元素</button>
    </div>

    <!-- .once：只触发一次 -->
    <button @click.once="log('.once：我只会触发一次，再点没反应')">.once</button>

    <!-- .capture：使用事件捕获模式（从外到内触发） -->
    <div class="outer" @click.capture="log('capture：外层先触发（捕获阶段）')">
      <button @click="log('capture：内层后触发')">.capture</button>
    </div>

    <!-- 修饰符串联：既阻止冒泡又阻止默认行为 -->
    <form @submit.prevent="log('.prevent 阻止了表单默认提交刷新')">
      <input v-model="keyword" placeholder="输入点什么"/>
      <button type="submit">提交（不会刷新页面）</button>
    </form>

    <h4>按键修饰符</h4>
    <!-- .enter：只有回车才触发；还有 .tab .delete .esc .space .up .down .left .right -->
    <input
      v-model="keyword"
      @keyup.enter="log('回车：' + keyword)"
      @keyup.esc="keyword = ''"
      placeholder="回车输出，Esc 清空"
    />

    <!-- 系统修饰键：按住 ctrl + 回车 才触发 -->
    <input @keyup.ctrl.enter="log('Ctrl + Enter')" placeholder="Ctrl + Enter 试试"/>

    <!-- .exact：精确匹配，只允许 ctrl，按住其他键不触发 -->
    <button @click.ctrl.exact="log('只按 Ctrl 点击')">Ctrl + 点击（.exact）</button>

    <h4>鼠标修饰符</h4>
    <div class="mouse-area" @click.left="log('左键')" @click.right.prevent="log('右键（阻止默认菜单）')">
      在此区域按左键 / 右键
    </div>

    <div class="log-box">
      <p v-for="(item, i) in logs" :key="i">{{ item }}</p>
      <p v-if="!logs.length" class="tip">日志会显示在这里，也可以打开浏览器控制台</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const keyword = ref('')
const logs = ref<string[]>([])

// 日志：同时打印到控制台和页面
const log = (msg: string) => {
  console.log('[事件]', msg)
  // unshift 插到最前面，最新的在上面；只保留最近 6 条
  logs.value.unshift(msg)
  if (logs.value.length > 6) logs.value.pop()
}

// 不传参时，第一个参数默认为原生事件对象
const handleClick = (e: MouseEvent) => {
  console.log('原生事件对象：', e)
  log('方法处理器触发，事件类型：' + e.type)
}

// 传参写法：注意模板里要用 $event 显式传入事件对象
const say = (msg: string, e: MouseEvent) => {
  console.log('事件对象：', e)
  log('收到参数：' + msg)
}
</script>

<style scoped>
.outer {
  border: 1px solid #d9d9d9;
  padding: 8px;
  margin: 6px 0;
  border-radius: 4px;
}
.mouse-area {
  border: 1px dashed #1677ff;
  padding: 16px;
  text-align: center;
  border-radius: 4px;
  user-select: none;
}
.log-box {
  margin-top: 12px;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 8px;
  min-height: 60px;
  font-size: 12px;
}
.log-box p {
  margin: 2px 0;
}
.tip {
  color: #bbb;
}
h4 {
  margin: 14px 0 6px;
  font-size: 14px;
  color: #1677ff;
}
</style>
