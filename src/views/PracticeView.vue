<!--
  练习页 —— 你的空白画布
  ==================================================================
  这个页面专门留给你照着「需求任务」自己写代码，熟悉 Vue 3 开发，并打通前后端交互。
  现在里面几乎是空的，后续所有的练习（数据绑定、列表渲染、事件、调后端接口）都写在这里。

  入口都给你标好了，照着写就行：
    · <template>  —— 写页面结构（标签、指令 v-if / v-for、事件 @click…）
    · <script setup lang="ts"> —— 写逻辑（ref / reactive / 调 fetchHello）
    · 要调后端，取消最下面那行 import 的注释即可（对应 GET /api/hello）

  调后端的前提：先把 studydemo-backend 跑起来（默认 8080 端口），
  前端通过 Vite 代理把 /api 转过去，所以浏览器眼里是同源，不用管跨域。
-->
<template>
  <div class="practice">
    <header class="page-head">
      <p class="eyebrow">Vue 3 练习 · 你的画布</p>
      <h1>我的练习页</h1>
      <p class="lead">
        这个页面现在是空的，专门留给你照着「需求任务」往上写代码。
        从数据绑定、列表渲染，一直到调通 <code>studydemo-backend</code> 的接口，都在这个文件里完成。
      </p>
    </header>

    <!-- ↓↓↓ 你的练习代码写在这里 ↓↓↓ -->

    <h2>用户列表</h2>

    <!-- 搜索框 -->
    <el-input
        v-model="keyword"
        placeholder="输入用户名搜索"
        style="width: 200px; margin-right: 10px"
    />
    <el-button type="primary" @click="loadData">搜索</el-button>
    <el-button type="success" @click="openAdd">新增</el-button>

    <!-- 表格 -->
    <el-table :data="tableData" style="margin-top: 20px">
      <el-table-column prop="id" label="ID" width="80"/>
      <el-table-column prop="username" label="用户名"/>
      <el-table-column prop="phone" label="手机号"/>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          {{ scope.row.status === 1 ? '启用' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"/>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="openEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        v-model:current-page="page"
        :page-size="size"
        :total="total"
        @current-change="loadData"
        style="margin-top: 20px"
    />

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible">
      <el-form :model="form">
        <el-form-item label="用户名">
          <el-input v-model="form.username"/>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option label="启用" :value="1"/>
            <el-option label="禁用" :value="0"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </template>
    </el-dialog>


  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'

// 列表数据
const tableData = ref<any[]>([])
const total = ref(0)
const page = ref(1)
const size = ref(10)
const keyword = ref('')

// 弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const form = ref({
  id: null as number | null,
  username: '',
  phone: '',
  status: 1
})

// 模拟后端返回数据
const mockBackend = (params: { page: number; size: number; keyword: string }) => {
  const allUsers = [
    {id: 1, username: '张三', phone: '13800000001', status: 1, createTime: '2026-09-01 10:00:00'},
    {id: 2, username: '李四', phone: '13800000002', status: 1, createTime: '2026-09-02 11:00:00'},
    {id: 3, username: '王五', phone: '13800000003', status: 0, createTime: '2026-09-03 12:00:00'},
    {id: 4, username: '赵六', phone: '13800000004', status: 1, createTime: '2026-09-04 13:00:00'},
    {id: 5, username: '张三丰', phone: '13800000005', status: 1, createTime: '2026-09-05 14:00:00'},
  ]

  // 模拟搜索
  let filtered = allUsers
  if (params.keyword) {
    filtered = allUsers.filter(u => u.username.includes(params.keyword))
  }

  // 模拟分页
  const start = (params.page - 1) * params.size
  const list = filtered.slice(start, start + params.size)

  return {
    code: 0,
    data: {
      total: filtered.length,
      list
    }
  }
}

// 加载列表
const loadData = () => {
  const res = mockBackend({
    page: page.value,
    size: size.value,
    keyword: keyword.value
  })
  tableData.value = res.data.list
  total.value = res.data.total
}

// 新增
const openAdd = () => {
  dialogTitle.value = '新增用户'
  form.value = {id: null, username: '', phone: '', status: 1}
  dialogVisible.value = true
}

// 编辑
const openEdit = (row: any) => {
  dialogTitle.value = '编辑用户'
  form.value = {...row}
  dialogVisible.value = true
}

// 提交
const submit = () => {
  if (form.value.id) {
    // 模拟更新
    const idx = tableData.value.findIndex(u => u.id === form.value.id)
    if (idx !== -1) {
      tableData.value[idx] = {...form.value, createTime: tableData.value[idx].createTime}
    }
  } else {
    // 模拟新增
    tableData.value.push({
      ...form.value,
      id: Date.now(),
      createTime: new Date().toLocaleString()
    })
    total.value++
  }
  dialogVisible.value = false
}

// 删除
const handleDelete = (id: number) => {
  const idx = tableData.value.findIndex(u => u.id === id)
  if (idx !== -1) {
    tableData.value.splice(idx, 1)
    total.value--
  }
}

// 页面加载时执行
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.practice {
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 24px 60px;
}

.page-head {
  padding-bottom: 8px;
}

.eyebrow {
  margin: 0 0 10px;
  font-size: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--brand);
}

.page-head h1 {
  margin: 0 0 14px;
  font-family: var(--font-serif);
  font-size: 38px;
  letter-spacing: 1px;
  color: #2c3719;
}

.lead {
  margin: 0;
  max-width: 720px;
  font-size: 14px;
  line-height: 1.95;
  color: var(--text-sub);
}

.lead code {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--brand);
  background: var(--brand-lighter);
  border: 1px solid var(--brand-border);
  border-radius: 4px;
  padding: 1px 6px;
}
</style>
