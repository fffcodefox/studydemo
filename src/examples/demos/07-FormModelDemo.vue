<!--
  示例 07：表单输入绑定 v-model
  覆盖知识点：
    1. v-model 是语法糖：:value + @input 的组合
    2. 单行文本 input / 多行 textarea
    3. 单个复选框（布尔）/ 多个复选框（数组）
    4. 单选框 radio
    5. 下拉框 select 单选 / 多选（多选时绑定数组）
    6. 修饰符 .lazy（change 时同步）/ .number（转数字）/ .trim（去空格）
    7. 真实开发中建议把表单数据收拢成一个 reactive 对象
-->
<template>
  <div class="demo">
    <!-- 1. 文本输入：v-model 双向绑定 -->
    <div class="field">
      <label>用户名：</label>
      <input v-model="form.username" placeholder="请输入"/>
      <span class="val">值：{{ form.username }}</span>
    </div>

    <!-- 2. textarea：写法和 input 一样，注意不要用插值 {{ }} -->
    <div class="field">
      <label>简介：</label>
      <textarea v-model="form.desc" rows="3"></textarea>
      <span class="val">长度：{{ form.desc.length }}</span>
    </div>

    <!-- 3. 单个复选框：绑定布尔值 -->
    <div class="field">
      <label>
        <input type="checkbox" v-model="form.agree"/> 同意协议
      </label>
      <span class="val">{{ form.agree }}</span>
    </div>

    <!-- 4. 多个复选框：绑定到同一个数组，value 会被收集进去 -->
    <div class="field">
      <label>爱好：</label>
      <label v-for="h in hobbies" :key="h">
        <input type="checkbox" v-model="form.checkedHobbies" :value="h"/> {{ h }}
      </label>
      <span class="val">{{ form.checkedHobbies.join('、') || '（未选择）' }}</span>
    </div>

    <!-- 5. 单选框：绑定同一个变量，value 决定选中哪个 -->
    <div class="field">
      <label>性别：</label>
      <label><input type="radio" v-model="form.gender" value="male"/> 男</label>
      <label><input type="radio" v-model="form.gender" value="female"/> 女</label>
      <span class="val">{{ form.gender }}</span>
    </div>

    <!-- 6. 下拉单选 -->
    <div class="field">
      <label>城市（单选）：</label>
      <select v-model="form.city">
        <option value="" disabled>请选择</option>
        <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
      </select>
      <span class="val">{{ form.city || '（未选择）' }}</span>
    </div>

    <!-- 7. 下拉多选：按住 Ctrl/Command 多选，绑定值必须是数组 -->
    <div class="field">
      <label>技能（多选）：</label>
      <select v-model="form.skills" multiple size="4">
        <option v-for="s in skillOptions" :key="s" :value="s">{{ s }}</option>
      </select>
      <span class="val">{{ form.skills.join('、') || '（未选择）' }}</span>
    </div>

    <h4>v-model 修饰符</h4>
    <!-- .lazy：从 input 事件改为 change 事件同步（失焦或回车后才更新） -->
    <div class="field">
      <label>.lazy：</label>
      <input v-model.lazy="lazyText"/>
      <span class="val">失焦后才更新：{{ lazyText }}</span>
    </div>
    <!-- .number：自动把输入转成数字（输入非数字时保留字符串） -->
    <div class="field">
      <label>.number：</label>
      <input v-model.number="numText"/>
      <span class="val">{{ numText }}（类型：{{ typeof numText }}）</span>
    </div>
    <!-- .trim：自动去除首尾空格 -->
    <div class="field">
      <label>.trim：</label>
      <input v-model.trim="trimText"/>
      <span class="val">[{{ trimText }}]</span>
    </div>

    <!-- 展示整个表单对象，方便理解数据结构 -->
    <pre class="json">{{ JSON.stringify(form, null, 2) }}</pre>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

// 推荐：把一组表单字段收拢成一个 reactive 对象，提交时直接整体发送
interface FormModel {
  username: string
  desc: string
  agree: boolean
  checkedHobbies: string[]
  gender: string
  city: string
  skills: string[]
}

const form = reactive<FormModel>({
  username: '',
  desc: '',
  agree: false,
  checkedHobbies: [],
  gender: 'male',
  city: '',
  skills: [],
})

// 选项数据（静态）
const hobbies = ['篮球', '音乐', '旅行']
const cities = ['北京', '上海', '广州', '深圳']
const skillOptions = ['Vue', 'React', 'TypeScript', 'Node.js']

// 修饰符演示用的独立变量
const lazyText = ref('')
const numText = ref<string | number>('')
const trimText = ref('')
</script>

<style scoped>
.field {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}
.field label {
  min-width: 90px;
  font-size: 13px;
  color: #555;
}
.val {
  color: #7c9691;
  font-size: 12px;
}
.json {
  background: #f7fbfa;
  border: 1px solid #e6efec;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
}
h4 {
  margin: 16px 0 8px;
  font-size: 14px;
  color: var(--brand);
}
</style>
