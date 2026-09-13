<!--
  用户管理练习页 · User Management Playground
  ==================================================================
  对接的后端：studydemo-backend 的 UserController（@RequestMapping("/api/users")）

  接口清单（详见 src/api/user.ts）：
    GET    /api/users?username=&phone=&status=&pageNum=&pageSize=   分页列表
    GET    /api/users/{id}                       详情查询
    POST   /api/users                            新增
    PUT    /api/users/{id}                       修改
    DELETE /api/users/{id}                       删除（后端逻辑删除）

  ⚠️ 分页在后端：
    列表接口返回 PageResult{ records, total, pageNum, pageSize, pages }，
    筛选和分页都由后端 SQL 完成。所以「查询 / 重置 / 翻页 / 改每页条数」
    四个动作都要重新请求后端，前端只负责把 pageNum、pageSize 传下去。
  ==================================================================
-->
<template>
  <div class="page">
    <!-- ===== 背景层（纯装饰） ===== -->
    <div class="bg-orbs" aria-hidden="true">
      <span class="orb o1"></span>
      <span class="orb o2"></span>
      <span class="orb o3"></span>
    </div>

    <!-- 樱花飘落 -->
    <div class="sakura" aria-hidden="true">
      <span v-for="p in petals" :key="'p' + p.id" class="petal" :style="p.style"></span>
    </div>

    <!-- 樱花树（右下角，轻微摇摆） -->
    <svg class="sakura-tree" viewBox="0 0 220 260" aria-hidden="true">
      <g class="tree-sway">
        <path
            d="M108 260 L104 170 Q102 150 96 132 Q92 120 78 110"
            stroke="#6b4a36" stroke-width="9" fill="none" stroke-linecap="round"
        />
        <path
            d="M104 170 Q108 150 118 134 Q126 122 142 116"
            stroke="#6b4a36" stroke-width="7" fill="none" stroke-linecap="round"
        />
        <path
            d="M104 158 Q110 150 110 138 Q110 128 104 118"
            stroke="#7a5640" stroke-width="6" fill="none" stroke-linecap="round"
        />
        <circle cx="92" cy="96" r="34" fill="#ffb3d1" opacity="0.82" />
        <circle cx="132" cy="92" r="30" fill="#ff9ec4" opacity="0.78" />
        <circle cx="110" cy="70" r="32" fill="#ffc9de" opacity="0.85" />
        <circle cx="76" cy="74" r="24" fill="#ffb3d1" opacity="0.8" />
        <circle cx="146" cy="72" r="22" fill="#ff9ec4" opacity="0.75" />
        <circle cx="110" cy="104" r="26" fill="#ffd6e6" opacity="0.8" />
        <circle cx="100" cy="82" r="5" fill="#fff" opacity="0.6" />
        <circle cx="124" cy="98" r="4" fill="#fff" opacity="0.5" />
        <circle cx="88" cy="100" r="3.5" fill="#fff" opacity="0.5" />
      </g>
    </svg>

    <!-- ===== 顶部导航（鼠标靠近顶部时浮现） ===== -->
    <header class="topbar" :class="{ show: showNav }">
      <button class="back-btn" type="button" @click="goBack">
        <span class="back-ico">‹</span>
        <span>返回首页</span>
      </button>
      <div class="topbar-title">用户管理练习 · User Playground</div>
      <RouterLink to="/backend-demo" class="nav-link">接口示例</RouterLink>
    </header>
    <div class="nav-hint" :class="{ hide: showNav }" aria-hidden="true">
      <span class="hint-line"></span>
    </div>

    <!-- ===== 主体 ===== -->
    <main class="container" :style="parallaxStyle">
      <section class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Vue 3 · 对接 Spring Boot</p>
            <h1 class="title">用户管理 <span class="grad">练习场</span></h1>
          </div>
          <button class="add-btn" type="button" @click="openAdd">
            <span class="plus">＋</span> 新增用户
          </button>
        </div>

        <!-- 当前实际请求的地址，随筛选条件实时变化，方便和后端对照 -->
        <p class="endpoint">
          <span class="verb">GET</span>
          <code>{{ listUrl }}</code>
        </p>

        <!-- 搜索栏：点「查询」才会真的打到后端 -->
        <el-form :model="query" class="search" inline @submit.prevent>
          <el-form-item label="用户名">
            <el-input
                v-model="query.username"
                placeholder="模糊匹配"
                clearable
                class="w200"
                @keyup.enter="onSearch"
            />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input
                v-model="query.phone"
                placeholder="模糊匹配"
                clearable
                class="w200"
                @keyup.enter="onSearch"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="query.status" placeholder="全部" clearable class="w140">
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="onSearch">查询</el-button>
            <el-button :disabled="loading" @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 列表：数据源就是后端返回的当前页 records -->
        <el-table
            v-loading="loading"
            :data="records"
            class="glass-table"
            row-key="id"
            stripe
            :empty-text="emptyText"
        >
          <!-- 序号跨页连续：不能直接用 type="index"（那样每页都从 1 开始） -->
          <el-table-column type="index" :index="indexMethod" label="#" width="56" align="center" />
          <el-table-column prop="username" label="用户名" min-width="120" show-overflow-tooltip />

          <!-- phone / remark / createTime 在后端可能为 null 且会被 Jackson 整个省略，统一兜底 -->
          <el-table-column label="手机号" min-width="140">
            <template #default="{ row }">{{ row.phone || '—' }}</template>
          </el-table-column>

          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="success" size="small" effect="light">启用</el-tag>
              <el-tag v-else-if="row.status === 0" type="info" size="small" effect="light">禁用</el-tag>
              <span v-else class="muted">—</span>
            </template>
          </el-table-column>

          <el-table-column label="备注" min-width="160" show-overflow-tooltip>
            <template #default="{ row }">
              <span :class="{ muted: !row.remark }">{{ row.remark || '—' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" min-width="170">
            <template #default="{ row }">
              <span :class="{ muted: !row.createTime }">{{ row.createTime || '—' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="150" fixed="right" align="center">
            <template #default="{ row }">
              <el-button link type="primary" size="small" @click="openEdit(row)">编辑</el-button>
              <el-button
                  link
                  type="danger"
                  size="small"
                  :loading="deletingId === row.id"
                  @click="onDelete(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页：纯前端，切换页码不会发请求 -->
        <div class="pager">
          <el-pagination
              v-model:current-page="page.pageNum"
              v-model:page-size="page.pageSize"
              :total="total"
              :page-sizes="[5, 10, 20, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              background
              @size-change="onSizeChange"
              @current-change="onPageChange"
          />
        </div>
      </section>
    </main>

    <!-- ===== 新增 / 编辑弹窗 ===== -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogMode === 'add' ? '新增用户' : '编辑用户'"
        width="460px"
        class="user-dialog"
        append-to-body
        :close-on-click-modal="false"
        @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="选填，最多 20 位" maxlength="20" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
              v-model="form.remark"
              type="textarea"
              :rows="3"
              placeholder="选填"
              maxlength="255"
              show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :disabled="submitting" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="onSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { API_BASE, ApiError } from '@/api/http'
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
  usersPath,
  type UserSaveDTO,
  type UserVO,
} from '@/api/user'

const router = useRouter()

/* ================= 导航（鼠标靠近顶部时浮现） ================= */
const showNav = ref(false)

const goBack = () => {
  if (window.history.length > 1) router.back()
  else router.push('/')
}

/* ================= 鼠标视差 + 导航显隐 ================= */
/** 系统开了「减少动态效果」就把视差关掉 */
const motionOff = ref(false)
const mx = ref(0)
const my = ref(0)

const parallaxStyle = computed(() => {
  if (motionOff.value) return undefined
  return {
    transform: `translate3d(${(mx.value * 8).toFixed(2)}px, ${(my.value * 5).toFixed(2)}px, 0)`,
  }
})

/** mousemove 触发极频繁，用 rAF 合并成每帧一次，避免主线程被拖满 */
let ticking = false
const onWindowMouseMove = (event: MouseEvent) => {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    ticking = false
    showNav.value = event.clientY < 72
    mx.value = event.clientX / window.innerWidth - 0.5
    my.value = event.clientY / window.innerHeight - 0.5
  })
}

/* ================= 背景：樱花（纯装饰，一次性生成的随机值，不需要响应式） ================= */
const petals = Array.from({ length: 22 }, (_, id) => {
  const size = 8 + Math.random() * 10
  const drift = Math.round(Math.random() * 80 - 40)
  return {
    id,
    style: {
      left: Math.random() * 100 + '%',
      width: size + 'px',
      height: size + 'px',
      background: `linear-gradient(135deg, #fff 0%, ${Math.random() > 0.5 ? '#ffc9de' : '#ff9ec4'} 100%)`,
      animationDuration: 7 + Math.random() * 8 + 's',
      animationDelay: '-' + Math.random() * 10 + 's',
      '--drift': drift + 'px',
    } as Record<string, string>,
  }
})

/* ================= 查询条件 + 分页状态 ================= */
const query = reactive<{ username: string; phone: string; status: number | null }>({
  username: '',
  phone: '',
  status: null,
})

/** 分页参数：跟着每次列表请求一起发给后端 */
const page = reactive({ pageNum: 1, pageSize: 10 })

const loading = ref(false)
/** 正在删除的行 id，用来给那一行的删除按钮单独上 loading，防止连点 */
const deletingId = ref<number | null>(null)

/** 当前页数据（后端 PageResult.records）与满足条件的总记录数（后端 PageResult.total） */
const records = ref<UserVO[]>([])
const total = ref(0)

/** 序号跨页连续，避免每页都从 1 重新数 */
const indexMethod = (index: number) => (page.pageNum - 1) * page.pageSize + index + 1

/** 页面上那条「即将请求的 URL」，随输入和翻页实时变化 */
const listUrl = computed(() =>
  API_BASE + usersPath({ ...query, pageNum: page.pageNum, pageSize: page.pageSize }),
)

/** 空态文案随「有没有筛选条件」变化，比统一的「暂无数据」友好 */
const emptyText = computed(() => {
  const filtered = !!query.username.trim() || !!query.phone.trim() || query.status != null
  if (loading.value) return '加载中…'
  return filtered ? '没有符合条件的用户' : '还没有数据，点右上角「新增用户」加一条'
})

/* ================= 请求 ================= */
let controller: AbortController | null = null
/** 请求序号：快速连点「查询」时，防止先发的慢响应覆盖后发的结果 */
let seq = 0

/**
 * 拉取列表。筛选条件和分页参数一起交给后端，返回当前页数据 + 总数。
 */
async function loadData() {
  const current = ++seq
  controller?.abort()
  controller = new AbortController()

  loading.value = true
  try {
    const data = await fetchUsers(
      { ...query, pageNum: page.pageNum, pageSize: page.pageSize },
      controller.signal,
    )
    if (current !== seq) return
    records.value = data?.records ?? []
    total.value = data?.total ?? 0
  } catch (err) {
    if (current !== seq || isAbort(err)) return
    // 查不到数据不是错误，真正的错误是「后端没起来 / code 非 200」，这里必须提示出来
    records.value = []
    total.value = 0
    ElMessage.error(toMessage(err))
  } finally {
    if (current === seq) loading.value = false
  }
}

/**
 * 删除后刷新：这一页刚好被删空、又不是第一页时，退回上一页再查一次。
 * 只在删除后调用 —— 搜索和翻页本身不需要这种「补一刀」的逻辑。
 */
async function refreshAfterDelete() {
  await loadData()
  if (records.value.length === 0 && page.pageNum > 1) {
    page.pageNum -= 1
    await loadData()
  }
}

const onSearch = () => {
  page.pageNum = 1
  loadData()
}

const onReset = () => {
  query.username = ''
  query.phone = ''
  query.status = null
  page.pageNum = 1
  loadData()
}

/** 每页条数变了：回到第 1 页重新查（分页在后端，前端切片那套已经不适用） */
const onSizeChange = () => {
  page.pageNum = 1
  loadData()
}

/**
 * 翻页：重新请求后端。
 * 顺带在面板顶部已经滚出视口时把它拉回来 —— 分页器在面板底部，
 * 无条件 scrollIntoView 的话点一下整个页面就跳一次，很晃。
 */
const onPageChange = () => {
  loadData()
  const panel = document.querySelector('.panel')
  if (panel && panel.getBoundingClientRect().top < 0) {
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

/* ================= 新增 / 编辑 ================= */
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const submitting = ref(false)
const formRef = ref<FormInstance>()

const form = reactive<{ id: number | null; username: string; phone: string; status: number; remark: string }>({
  id: null,
  username: '',
  phone: '',
  status: 1,
  remark: '',
})

/**
 * 校验规则刻意和后端 UserSaveDTO 上的注解保持一致：
 *   username @NotBlank + @Size(max=50)、phone @Size(max=20)、remark @Size(max=255)
 * 前端只做相同强度的拦截，不做后端放行的额外限制，避免「前端过不了、后端能过」的错位。
 */
const rules: FormRules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    // whitespace: 纯空格也算空，和后端 @NotBlank 语义对齐（required 默认只拦空串）
    { whitespace: true, message: '用户名不能为空', trigger: 'blur' },
    { max: 50, message: '最多 50 个字', trigger: 'blur' },
  ],
  phone: [{ max: 20, message: '最多 20 位', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  remark: [{ max: 255, message: '最多 255 个字', trigger: 'blur' }],
}

const openAdd = () => {
  dialogMode.value = 'add'
  dialogVisible.value = true
}

/**
 * 打开编辑弹窗。
 * 列表返回的就是完整的 UserVO，直接用行数据，省一次请求；
 * 如果以后需要「以数据库最新值为准」，把下面几行换成 fetchUser(row.id) 再赋值即可。
 */
const openEdit = (row: UserVO) => {
  dialogMode.value = 'edit'
  Object.assign(form, {
    id: row.id,
    username: row.username ?? '',
    // 后端为 null 的字段会被整个省略，解构出来是 undefined；
    // el-input 的 v-model 拿到 null/undefined 会告警并显示异常，这里统一兜成空串
    phone: row.phone ?? '',
    status: row.status ?? 1,
    remark: row.remark ?? '',
  })
  dialogVisible.value = true
}

const resetForm = () => {
  form.id = null
  form.username = ''
  form.phone = ''
  form.status = 1
  form.remark = ''
  formRef.value?.clearValidate()
}

async function onSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().then(() => true).catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const payload: UserSaveDTO = {
      username: form.username.trim(),
      // 空串转 null 再提交：后端 default-property-inclusion 是 non_null，
      // 存 null 比存空串干净，也更贴合「这个字段没填」的语义
      phone: blankToNull(form.phone),
      status: form.status,
      remark: blankToNull(form.remark),
    }

    if (dialogMode.value === 'add') {
      await createUser(payload)
      ElMessage.success('新增成功')
      // 后端按 createTime 倒序，新记录一定在第一页
      page.pageNum = 1
    } else {
      await updateUser(form.id!, payload)
      ElMessage.success('修改成功')
    }

    dialogVisible.value = false
    await loadData()
  } catch (err) {
    // 后端的 @Valid 校验失败（code=400）和「用户不存在」（code=404）
    // 都会带着中文 message 抛回来，直接展示给用户
    ElMessage.error(toMessage(err))
  } finally {
    submitting.value = false
  }
}

/* ================= 删除 ================= */
async function onDelete(row: UserVO) {
  try {
    await ElMessageBox.confirm(`确认删除用户「${row.username}」吗？`, '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return // 用户点了取消，ElMessageBox 以 reject 结束，这里忽略
  }

  deletingId.value = row.id
  try {
    await deleteUser(row.id)
    ElMessage.success('删除成功')
    await refreshAfterDelete()
  } catch (err) {
    ElMessage.error(toMessage(err))
  } finally {
    deletingId.value = null
  }
}

/* ================= 小工具 ================= */
/** 空串 / 纯空格 → null，其余原样（去首尾空格） */
function blankToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

/** 主动取消（切页面、条件变更）不算错误，不弹提示 */
function isAbort(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError'
}

/** 把任意异常转成一句能给用户看的话 */
function toMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message
  return `意料之外的错误：${String(err)}`
}

/* ================= 生命周期 ================= */
onMounted(() => {
  motionOff.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.addEventListener('mousemove', onWindowMouseMove)
  loadData()
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onWindowMouseMove)
  controller?.abort()
})
</script>

<style scoped>
.page {
  --ink: #1d3a2a;
  --ink-soft: #4a6b58;
  --pink: #ff8fb8;
  --lav: #3aa6a0;
  --mint: #4caf7d;
  --glass: rgba(255, 255, 255, 0.72);
  --glass-bd: rgba(120, 170, 140, 0.35);

  --el-color-primary: #3f9e74;
  --el-color-primary-light-3: #6fb893;
  --el-color-primary-light-5: #9fd0b5;
  --el-color-primary-light-7: #cfe8da;
  --el-color-primary-light-8: #e3f1ea;
  --el-color-primary-light-9: #eef7f2;
  --el-color-primary-dark-2: #327d5d;
  /* 危险色默认太浅，在这层浅绿玻璃上「删除」两个字几乎糊掉，特意压深一档 */
  --el-color-danger: #d4534b;
  --el-color-danger-light-3: #e2827c;
  --el-color-danger-dark-2: #a83f38;

  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  color: var(--ink);
  font-family: 'PingFang SC', 'Microsoft YaHei', system-ui, -apple-system, sans-serif;
  background:
      radial-gradient(1100px 620px at 18% 8%, rgba(120, 200, 160, 0.30), transparent 60%),
      radial-gradient(900px 520px at 86% 26%, rgba(180, 220, 150, 0.26), transparent 60%),
      radial-gradient(820px 600px at 50% 108%, rgba(120, 210, 190, 0.22), transparent 60%),
      linear-gradient(160deg, #d8efe0 0%, #eaf6ec 50%, #d2ecdd 100%);
}

.bg-orbs { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.55; animation: drift 18s ease-in-out infinite; }
.o1 { width: 380px; height: 380px; top: -80px; left: -60px; background: radial-gradient(circle, rgba(120, 200, 160, 0.55), transparent 70%); }
.o2 { width: 320px; height: 320px; bottom: -60px; right: -40px; background: radial-gradient(circle, rgba(180, 220, 150, 0.5), transparent 70%); animation-delay: -6s; }
.o3 { width: 280px; height: 280px; top: 40%; left: 60%; background: radial-gradient(circle, rgba(120, 210, 190, 0.5), transparent 70%); animation-delay: -11s; }
@keyframes drift { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(30px, -24px) scale(1.08); } }

.sakura { position: fixed; inset: 0; z-index: 1; pointer-events: none; }
.petal {
  position: absolute; top: -8%; border-radius: 0 100% 0 100% / 0 100% 0 100%; opacity: 0;
  box-shadow: 0 0 6px rgba(255, 158, 196, 0.5);
  animation-name: fall; animation-timing-function: linear; animation-iteration-count: infinite;
}
@keyframes fall {
  0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
  8% { opacity: 0.85; }
  92% { opacity: 0.85; }
  100% { transform: translateY(112vh) translateX(var(--drift)) rotate(420deg); opacity: 0; }
}

.sakura-tree { position: fixed; right: 12px; bottom: -6px; width: 230px; height: 270px; z-index: 1; pointer-events: none; filter: drop-shadow(0 8px 18px rgba(40, 70, 50, 0.22)); }
.tree-sway { transform-origin: 110px 255px; animation: sway 6s ease-in-out infinite; }
@keyframes sway { 0%, 100% { transform: rotate(-1.4deg); } 50% { transform: rotate(1.4deg); } }

.topbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 20;
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 28px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.80), rgba(255, 255, 255, 0.0));
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--glass-bd);
  opacity: 0; transform: translateY(-100%); pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.topbar.show { opacity: 1; transform: translateY(0); pointer-events: auto; }
.back-btn {
  display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px 9px 14px;
  border-radius: 999px; border: 1px solid var(--glass-bd); background: rgba(255, 255, 255, 0.65);
  color: var(--ink); font-size: 14px; letter-spacing: 1px; cursor: pointer;
  transition: transform 0.22s, box-shadow 0.22s, background 0.22s;
}
.back-btn:hover { transform: translateX(-3px); background: #fff; box-shadow: 0 8px 22px rgba(76, 175, 125, 0.3); }
.back-ico { font-size: 20px; line-height: 1; color: var(--lav); }
.topbar-title { font-size: 13px; letter-spacing: 2px; color: var(--ink-soft); }
.nav-link { color: var(--ink); text-decoration: none; font-size: 14px; letter-spacing: 1px; padding: 8px 16px; border-radius: 999px; border: 1px solid var(--glass-bd); background: rgba(255, 255, 255, 0.65); transition: background 0.22s, box-shadow 0.22s; }
.nav-link:hover { background: #fff; box-shadow: 0 8px 22px rgba(76, 175, 125, 0.25); }

.nav-hint { position: fixed; top: 0; left: 0; right: 0; z-index: 19; height: 6px; display: flex; justify-content: center; pointer-events: none; transition: opacity 0.3s; }
.nav-hint.hide { opacity: 0; }
.hint-line { width: 60px; height: 4px; border-radius: 0 0 4px 4px; background: linear-gradient(90deg, transparent, #4caf7d, transparent); opacity: 0.5; }

.container { position: relative; z-index: 3; max-width: 1120px; margin: 0 auto; padding: 64px 24px 48px; transition: transform 0.18s ease-out; }

.panel {
  position: relative; padding: 26px 26px 20px; border-radius: 24px;
  border: 1px solid var(--glass-bd); background: var(--glass);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 18px 44px rgba(40, 70, 50, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.6);
  animation: rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }

.panel-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 10px; flex-wrap: wrap; }
.eyebrow { margin: 0 0 6px; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: var(--lav); }
.title { margin: 0; font-size: 30px; font-weight: 800; letter-spacing: 1px; }
.title .grad { background: linear-gradient(120deg, var(--pink), var(--lav) 50%, var(--mint)); -webkit-background-clip: text; background-clip: text; color: transparent; }

.add-btn {
  display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; border: none; border-radius: 999px;
  font-size: 14px; letter-spacing: 1px; color: #1a3026; font-weight: 700; cursor: pointer;
  background: linear-gradient(120deg, #ffb3d1, #7fd4c4); box-shadow: 0 10px 26px rgba(120, 200, 160, 0.45);
  transition: transform 0.22s, box-shadow 0.22s;
}
.add-btn:hover { transform: translateY(-3px); box-shadow: 0 14px 32px rgba(76, 175, 125, 0.42); }
.add-btn .plus { font-size: 16px; line-height: 1; }

/* 接口地址提示条 */
.endpoint { display: inline-flex; align-items: center; gap: 8px; margin: 0 0 14px; padding: 5px 12px 5px 6px; border: 1px solid var(--glass-bd); border-radius: 999px; background: rgba(255, 255, 255, 0.55); font-size: 12px; max-width: 100%; }
.endpoint .verb { font-size: 10px; font-weight: 800; letter-spacing: 1px; color: #fff; background: #3f9e74; border-radius: 999px; padding: 2px 8px; }
.endpoint code { font-family: 'JetBrains Mono', Consolas, monospace; color: var(--ink-soft); overflow-wrap: anywhere; }

.search { margin-bottom: 8px; }
.w200 { width: 200px; }
.w140 { width: 140px; }
.muted { color: #9aa8a0; }
.pager { display: flex; justify-content: flex-end; margin-top: 16px; }
.pager :deep(.el-pagination) {
  --el-pagination-bg-color: rgba(255, 255, 255, 0.72);
  --el-pagination-text-color: var(--ink-soft);
  --el-pagination-button-color: var(--ink-soft);
  --el-pagination-hover-color: #3f9e74;
}

/*
  表格配色跟着面板走：面板是浅色玻璃，这里就必须用深色文字。
  （原来的 --el-table-text-color: #e8e6f5 是给深色底准备的，放在浅色面板上基本看不见。）
*/
.glass-table.el-table {
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: rgba(120, 180, 150, 0.16);
  --el-table-border-color: rgba(120, 170, 140, 0.26);
  --el-table-text-color: var(--ink);
  --el-table-header-text-color: var(--ink);
  --el-table-row-hover-bg-color: rgba(76, 175, 125, 0.13);
  --el-fill-color-lighter: rgba(120, 180, 150, 0.07);
  --el-table-expanded-cell-bg-color: transparent;
  --el-mask-color: rgba(255, 255, 255, 0.75);
  background: transparent;
  border-radius: 14px;
  overflow: hidden;
}
.glass-table :deep(.el-table__inner-wrapper::before) { display: none; }
.glass-table :deep(th.el-table__cell) { font-weight: 700; letter-spacing: 0.5px; }
/* 行背景是透明的，固定列必须自己补一层底，否则滚动时会和下方内容叠在一起 */
.glass-table :deep(td.el-table-fixed-column--right),
.glass-table :deep(th.el-table-fixed-column--right) { background: #eef8f1; }
.glass-table :deep(.el-table__body tr.hover-row > td.el-table-fixed-column--right) { background: #e3f4e8; }

/* 开了「减少动态效果」就别再飘了 */
@media (prefers-reduced-motion: reduce) {
  .orb, .petal, .tree-sway, .panel { animation: none !important; }
  .petal { display: none; }
}

@media (max-width: 640px) {
  .title { font-size: 24px; }
  .panel { padding: 18px 16px 14px; }
  .w200, .w140 { width: 100%; }
  .sakura-tree { display: none; }
}
</style>

<!--
  弹窗用了 append-to-body，会被挂到 body 上、脱离 .page 作用域，
  所以这里不能写 scoped（否则样式选不中），也不能用 var(--ink)（变量定义在 .page 上取不到），
  颜色直接写死。
-->
<style>
.user-dialog .el-dialog {
  background: rgba(252, 255, 252, 0.96);
  border: 1px solid rgba(120, 170, 140, 0.4);
  border-radius: 18px;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 24px 60px rgba(40, 70, 50, 0.22);
}
.user-dialog .el-dialog__header { padding-bottom: 12px; border-bottom: 1px solid rgba(120, 170, 140, 0.24); }
.user-dialog .el-dialog__title { color: #1d3a2a; font-weight: 700; letter-spacing: 0.5px; }
.user-dialog .el-dialog__body { color: #1d3a2a; padding-top: 18px; }
.user-dialog .el-form-item__label { color: #4a6b58; }
.user-dialog .el-dialog__footer { padding-top: 6px; }
</style>
