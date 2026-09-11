<!--
  示例 21：选项式 API（Options API）对照
  ⚠️ 这个文件是项目里原有的 App.vue 代码，原样保留，用来做「两种写法」的对照学习
  覆盖知识点（选项式 API 的核心选项）：
    data()      → 返回响应式数据（相当于 ref / reactive）
    methods     → 方法（相当于 <script setup> 里的普通函数）
    computed    → 计算属性（同名 API，写法不同）
    watch       → 侦听器（同名 API，写法不同）
    props/emits → 组件通信
    生命周期    → created / mounted / updated / unmounted（组合式里是 onMounted 等）

  👇 两种写法对照（同一段逻辑）
  ┌──────────────── 选项式 API ────────────────┬──────────── 组合式 API（<script setup>）────────────┐
  │ export default {                            │ <script setup>                                      │
  │   data() { return { count: 0 } },           │ const count = ref(0)                                │
  │   computed: { double() { return this.count  │ const double = computed(() => count.value * 2)       │
  │                           * 2 } },          │                                                     │
  │   methods: { add() { this.count++ } },      │ const add = () => count.value++                     │
  │   watch: { count(v) { console.log(v) } },   │ watch(count, (v) => console.log(v))                  │
  │   mounted() { console.log('挂载') }         │ onMounted(() => console.log('挂载'))                 │
  │ }                                           │ </script>                                            │
  └─────────────────────────────────────────────┴─────────────────────────────────────────────────────┘

  选择建议：
    - 新项目 / 需要更好的 TS 支持和逻辑复用 → 组合式 API（<script setup>）
    - 维护老项目、或团队更熟悉 Vue2 → 选项式 API
    - 两者可以混用，但不推荐在同一组件里混着写
-->
<template>
  <!--
    选项式 API 里，模板用法和组合式完全一样
    v-model 双向绑定 data 里返回的字段
  -->
  <div class="container">
    <div class="form-card">
      <h2 class="title">员工信息（选项式 API）</h2>
      <div class="field">
        <span class="label">姓名</span>
        <!-- v-model 绑定 data 中的 username -->
        <input v-model="username" class="input" placeholder="请输入姓名"/>
      </div>
      <div class="field">
        <span class="label">密码</span>
        <input v-model="password" class="input" placeholder="请输入密码" type="password"/>
      </div>
      <button class="btn" @click="submit">
        <span>提交</span>
      </button>
      <p class="result">{{ result }}</p>
    </div>
  </div>
</template>

<script lang="ts">
// 注意：选项式 API 用的是普通的 <script>，导出一个配置对象
// 这里没有写 lang="ts" 时就是纯 JS；保留 TS 可以获得 this 的类型提示
export default {
  name: 'OptionsApiDemo',

  // props：接收父组件传入的数据（对应组合式的 defineProps）
  // props: { title: String },

  // data：必须是一个函数，返回响应式数据对象
  // Vue 会把这些属性挂到 this 上，模板里可以直接用
  data() {
    return {
      username: 'cip1',
      password: '',
      result: '',
    }
  },

  // computed：计算属性，基于 data 派生，有缓存
  // this 指向组件实例
  computed: {
    // 例如：判断表单是否可以提交
    canSubmit(): boolean {
      return this.username.length > 0 && this.password.length > 0
    },
  },

  // watch：监听数据变化
  // 函数名就是要监听的数据名
  watch: {
    username(newVal: string, oldVal: string) {
      console.log(`用户名从 "${oldVal}" 改为 "${newVal}"`)
    },
  },

  // methods：事件处理函数、普通方法
  // 注意：不要用箭头函数，否则 this 指向会丢失
  methods: {
    submit(): void {
      if (!this.canSubmit) {
        this.result = '请填写完整信息'
        return
      }
      this.result = `提交成功：${this.username}`
      console.log('提交的数据：', { username: this.username, password: this.password })
    },
  },

  // 生命周期（选项式写法）
  created() {
    console.log('created：数据已初始化，但 DOM 还没生成')
  },
  mounted() {
    console.log('mounted：DOM 已挂载（对应组合式的 onMounted）')
  },
  unmounted() {
    console.log('unmounted：组件已销毁（对应组合式的 onUnmounted）')
  },
}
</script>

<style scoped>
/* 原有样式保留（深色玻璃卡片风格），这里补上背景色，便于在浅色页面中独立展示 */
.container {
  min-height: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
  border-radius: 8px;
  padding: 20px;
}

.form-card {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 32px 32px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  width: 280px;
}

.title {
  margin: 0 0 24px;
  font-weight: 300;
  font-size: 20px;
  letter-spacing: 2px;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
}

.field {
  margin-bottom: 16px;
}

.label {
  display: block;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 6px;
  letter-spacing: 1px;
}

.input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.input:focus {
  border-color: rgba(120, 119, 198, 0.6);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(120, 119, 198, 0.15);
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.btn {
  margin-top: 8px;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(120, 119, 198, 0.8), rgba(255, 177, 153, 0.7));
  color: #fff;
  font-size: 15px;
  letter-spacing: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(120, 119, 198, 0.35);
}

.result {
  margin: 12px 0 0;
  text-align: center;
  font-size: 13px;
  color: #ffd591;
  min-height: 18px;
}
</style>
