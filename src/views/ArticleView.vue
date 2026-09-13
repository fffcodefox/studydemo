<!--
  文章管理
  ------------------------------------------------------------------
  路由：/articles（普通页，套全站导航 + 页脚）
  接口：src/api/article.ts → studydemo-backend 的 ArticleController（/api/articles）
  功能：列表（后端分页 + 标题/状态筛选）、新增、编辑、删除（逻辑删除，二次确认）
  视觉：沿用站点黄绿书页风格，表格保持浅底深字以确保可读性
-->
<template>
  <div class="articles">
    <header class="head">
      <div class="head-title">
        <p class="eyebrow">Content · 内容管理</p>
        <h1>文章管理</h1>
      </div>
      <el-button type="primary" @click="openCreate">写文章</el-button>
    </header>

    <!-- 筛选栏 -->
    <div class="card filters">
      <el-input
        v-model="search.title"
        placeholder="按标题搜索"
        clearable
        style="width: 240px"
        @keyup.enter="reload"
        @clear="reload"
      />
      <el-select
        v-model="search.status"
        placeholder="状态"
        clearable
        style="width: 140px"
        @change="reload"
      >
        <el-option :value="1" label="已发布" />
        <el-option :value="0" label="草稿" />
      </el-select>
      <el-button @click="reload">查询</el-button>
      <el-button text @click="resetFilters">重置</el-button>
      <span class="count">共 {{ total }} 篇</span>
    </div>

    <!-- 列表 -->
    <div class="card table-card">
      <el-table v-loading="loading" :data="list" row-key="id" @row-dblclick="openEdit">
        <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip />
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small" effect="light">
              {{ row.status === 1 ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="views" label="浏览量" width="90" align="center" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <span class="empty">还没有文章，点右上角「写文章」开始</span>
        </template>
      </el-table>

      <div class="pager">
        <el-pagination
          v-model:current-page="page.pageNum"
          v-model:page-size="page.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @current-change="load"
          @size-change="onSizeChange"
        />
      </div>
    </div>

    <!-- 新增 / 编辑弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.isEdit ? '编辑文章' : '写文章'"
      width="660px"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="72px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" maxlength="120" show-word-limit placeholder="给文章起个标题" />
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input
            v-model="form.summary"
            type="textarea"
            :rows="2"
            maxlength="255"
            show-word-limit
            placeholder="一句话概括（可选）"
          />
        </el-form-item>
        <el-form-item label="正文" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="7"
            placeholder="正文内容，支持 Markdown 文本"
          />
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <el-input v-model="form.cover" placeholder="封面图 URL（可选）" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" placeholder="作者名（可选）" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" style="width: 160px">
            <el-option :value="1" label="已发布" />
            <el-option :value="0" label="草稿" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
  fetchArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  type ArticleSaveDTO,
  type ArticleVO,
} from '../api/article'

const loading = ref(false)
const list = ref<ArticleVO[]>([])
const total = ref(0)
const page = reactive({ pageNum: 1, pageSize: 10 })
const search = reactive<{ title: string; status: number | null }>({ title: '', status: null })

// 防止筛选/翻页时的竞态：每次请求自增序号，只认最后一次
let seq = 0

/** 拉取列表，过滤 + 分页都由后端完成 */
async function load() {
  const current = ++seq
  loading.value = true
  try {
    const data = await fetchArticles({
      title: search.title.trim() || undefined,
      status: search.status,
      pageNum: page.pageNum,
      pageSize: page.pageSize,
    })
    if (current !== seq) return
    list.value = data.records ?? []
    total.value = data.total ?? 0
  } catch (err) {
    if (current !== seq) return
    list.value = []
    total.value = 0
    ElMessage.error((err as Error).message || '文章列表加载失败')
  } finally {
    if (current === seq) loading.value = false
  }
}

function reload() {
  page.pageNum = 1
  load()
}
function resetFilters() {
  search.title = ''
  search.status = null
  reload()
}
function onSizeChange() {
  page.pageNum = 1
  load()
}

// ---------------- 新增 / 编辑表单 ----------------
const dialog = reactive({ visible: false, isEdit: false, id: 0 })
const saving = ref(false)
const formRef = ref<FormInstance>()
const form = reactive<ArticleSaveDTO>({
  title: '',
  summary: '',
  content: '',
  cover: '',
  author: '',
  status: 1,
})
const rules: FormRules<ArticleSaveDTO> = {
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

function resetForm() {
  form.title = ''
  form.summary = ''
  form.content = ''
  form.cover = ''
  form.author = ''
  form.status = 1
  formRef.value?.clearValidate()
}

function openCreate() {
  dialog.isEdit = false
  dialog.id = 0
  dialog.visible = true
}

function openEdit(row: ArticleVO) {
  dialog.isEdit = true
  dialog.id = row.id
  form.title = row.title
  form.summary = row.summary ?? ''
  form.content = row.content ?? ''
  form.cover = row.cover ?? ''
  form.author = row.author ?? ''
  form.status = row.status ?? 1
  dialog.visible = true
}

async function submit() {
  if (!formRef.value) return
  await formRef.value.validate()
  saving.value = true
  const dto: ArticleSaveDTO = {
    title: form.title.trim(),
    summary: (form.summary ?? '').trim() || null,
    content: (form.content ?? '').trim() || null,
    cover: (form.cover ?? '').trim() || null,
    author: (form.author ?? '').trim() || null,
    status: form.status,
  }
  try {
    if (dialog.isEdit) {
      await updateArticle(dialog.id, dto)
      ElMessage.success('已保存')
    } else {
      await createArticle(dto)
      ElMessage.success('已创建')
    }
    dialog.visible = false
    load()
  } catch (err) {
    ElMessage.error((err as Error).message || '保存失败')
  } finally {
    saving.value = false
  }
}

async function remove(row: ArticleVO) {
  try {
    await ElMessageBox.confirm(
      `确定删除《${row.title}》？删除后页面立即消失（后端为逻辑删除，库里仍留档）。`,
      '删除确认',
      { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
    )
  } catch {
    return
  }
  try {
    await deleteArticle(row.id)
    ElMessage.success('已删除')
    // 删的是当前页最后一条且不在第一页时，回退一页避免空页
    if (list.value.length === 1 && page.pageNum > 1) page.pageNum -= 1
    load()
  } catch (err) {
    ElMessage.error((err as Error).message || '删除失败')
  }
}

onMounted(load)
</script>

<style scoped>
.articles {
  max-width: 1080px;
  margin: 0 auto;
  padding: 32px 24px 56px;
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}
.eyebrow {
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-weak);
  margin: 0 0 4px;
}
.head h1 {
  font-family: var(--font-serif);
  font-size: 28px;
  color: #2f3a22;
  margin: 0;
  letter-spacing: 2px;
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
}

.filters {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  margin-bottom: 16px;
}
.count {
  margin-left: auto;
  font-size: 13px;
  color: var(--text-weak);
}

.table-card {
  padding: 8px 8px 16px;
  overflow: hidden;
}
.empty {
  color: var(--text-weak);
  font-size: 14px;
}
.pager {
  display: flex;
  justify-content: flex-end;
  padding: 14px 12px 0;
}
</style>
