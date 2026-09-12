<!--
  用户管理练习页 · User Management Playground
  ==================================================================
  这是你的「列表查询 + 前后端打通」练习画布，请把开发重点放这里：
    · 顶部搜索（用户名模糊 / 手机号模糊 / 状态精确）→ 列表查询逻辑
    · el-table 列表 + el-pagination 分页
    · el-dialog 弹窗做新增 / 编辑，含表单校验
    · 删除带二次确认
  当前数据是前端 mock（allUsers 数组），不依赖后端也能跑。
  👉 想接真实后端时，把 loadData / createUser / updateUser / deleteUser
     三个方法换成调 src/api/user.ts（对应后端 /api/users 接口）即可。

  视觉效果（护眼低亮）：樱花飘落 + 右下樱花树 + 玻璃拟态。
  导航栏：鼠标移到页面顶部（clientY<72）才浮现，平时隐藏。
  ==================================================================
-->
<template>
  <div class="page" @mousemove="onMove">
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
        <!-- 树干 -->
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
        <!-- 花冠：多个粉色半透明团 -->
        <circle cx="92" cy="96" r="34" fill="#ffb3d1" opacity="0.82" />
        <circle cx="132" cy="92" r="30" fill="#ff9ec4" opacity="0.78" />
        <circle cx="110" cy="70" r="32" fill="#ffc9de" opacity="0.85" />
        <circle cx="76" cy="74" r="24" fill="#ffb3d1" opacity="0.8" />
        <circle cx="146" cy="72" r="22" fill="#ff9ec4" opacity="0.75" />
        <circle cx="110" cy="104" r="26" fill="#ffd6e6" opacity="0.8" />
        <!-- 高光点缀 -->
        <circle cx="100" cy="82" r="5" fill="#fff" opacity="0.6" />
        <circle cx="124" cy="98" r="4" fill="#fff" opacity="0.5" />
        <circle cx="88" cy="100" r="3.5" fill="#fff" opacity="0.5" />
      </g>
    </svg>

    <!-- ===== 顶部导航：接近顶部才出现 ===== -->
    <header class="topbar" :class="{ show: showNav }">
      <button class="back-btn" type="button" @click="goBack">
        <span class="back-ico">‹</span>
        <span>返回首页</span>
      </button>
      <div class="topbar-title">用户管理练习 · User Playground</div>
      <RouterLink to="/backend-demo" class="nav-link">接口示例</RouterLink>
    </header>
    <!-- 顶部常驻的极低调呼出提示 -->
    <div class="nav-hint" :class="{ hide: showNav }" aria-hidden="true">
      <span class="hint-line"></span>
    </div>

    <!-- ===== 主体 ===== -->
    <main class="container" :style="parallaxStyle">
      <section class="panel">
        <!-- 标题 + 新增 -->
        <div class="panel-head">
          <div>
            <p class="eyebrow">Vue 3 · 列表查询练习</p>
            <h1 class="title">用户管理 <span class="grad">练习场</span></h1>
          </div>
          <button class="add-btn" type="button" @click="openAdd">
            <span class="plus">＋</span> 新增用户
          </button>
        </div>

        <!-- 搜索栏（列表查询条件） -->
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
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 列表 -->
        <el-table
          v-loading="loading"
          :data="pagedList"
          class="dark-table"
          row-key="id"
          stripe
          empty-text="暂无数据"
        >
          <el-table-column type="index" label="#" width="56" align="center" />
          <el-table-column prop="username" label="用户名" min-width="120" />
          <el-table-column prop="phone" label="手机号" min-width="140">
            <template #default="{ row }">{{ row.phone || '—' }}</template>
          </el-table-column>
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small" effect="dark">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="160" show-overflow-tooltip />
          <el-table-column prop="createTime" label="创建时间" min-width="170" />
          <el-table-column label="操作" width="150" fixed="right" align="center">
            <template #default="{ row }">
              <el-button link type="primary" size="small" @click="openEdit(row)">编辑</el-button>
              <el-button link type="danger" size="small" @click="onDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pager">
          <el-pagination
            v-model:current-page="page.pageNum"
            v-model:page-size="page.pageSize"
            :total="page.total"
            :page-sizes="[5, 10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            background
            @size-change="onSearch"
            @current-change="onSearch"
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
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" maxlength="50" />
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
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="onSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'

const router = useRouter()

/* ---------- 导航：鼠标接近顶部才浮现 ---------- */
const showNav = ref(false)
const onMove = (e: MouseEvent) => {
  showNav.value = e.clientY < 72
}
const goBack = () => {
  if (window.history.length > 1) router.back()
  else router.push('/')
}

/* ---------- 鼠标视差（轻微） ---------- */
const mx = ref(0)
const my = ref(0)
const parallaxStyle = computed(() => ({
  transform: `translate3d(${mx.value * 10}px, ${my.value * 6}px, 0)`,
}))
const onParallax = (e: MouseEvent) => {
  mx.value = e.clientX / window.innerWidth - 0.5
  my.value = e.clientY / window.innerHeight - 0.5
}

/* ---------- 背景：樱花 / 星空 ---------- */
const petals = ref(
  Array.from({ length: 22 }, (_, id) => {
    const left = Math.random() * 100
    const size = 8 + Math.random() * 10
    const duration = 7 + Math.random() * 8
    const delay = Math.random() * 10
    const drift = (Math.random() * 80 - 40).toFixed(0)
    const hue = Math.random() > 0.5 ? '#ffc9de' : '#ff9ec4'
    return {
      id,
      style: {
        left: left + '%',
        width: size + 'px',
        height: size + 'px',
        background: `linear-gradient(135deg, #fff 0%, ${hue} 100%)`,
        animationDuration: duration + 's',
        animationDelay: '-' + delay + 's',
        '--drift': drift + 'px',
      } as Record<string, string>,
    }
  }),
)

/* ---------- 数据类型（对应后端 sys_user） ---------- */
interface UserRow {
  id: number
  username: string
  phone: string
  status: number
  remark: string
  createTime: string
}

/* ---------- mock 数据源（练习用，接后端时删掉） ---------- */
const allUsers = ref<UserRow[]>([])
const buildMock = () => {
  const names = ['星野','凛','凪','莲','樱','月','夜','霜','枫','千','遥','蓝','凛音','雪','璃','羽','澈','辰','墨','昔','初','凛月','白']
  const list: UserRow[] = []
  for (let i = 0; i < 23; i++) {
    const status = i % 4 === 0 ? 0 : 1
    list.push({
      id: i + 1,
      username: names[i % names.length] + (i >= names.length ? '_' + i : ''),
      phone: i % 3 === 0 ? '138' + String(10000000 + i * 137) : '',
      status,
      remark: i % 5 === 0 ? '练习账号' : '',
      createTime: '2026-09-' + String((i % 27) + 1).padStart(2, '0') + ' 1' + (i % 9) + ':30:00',
    })
  }
  return list
}

/* ---------- 查询条件 + 分页 ---------- */
const query = reactive<{ username: string; phone: string; status: number | null }>({
  username: '',
  phone: '',
  status: null,
})
const page = reactive({ pageNum: 1, pageSize: 10, total: 0 })
const loading = ref(false)

/* 列表查询：先过滤，再分页（mock）。接后端时换成调 /api/users */
const filtered = computed(() => {
  const kw = query.username.trim()
  const ph = query.phone.trim()
  return allUsers.value.filter((u) => {
    if (kw && !u.username.includes(kw)) return false
    if (ph && !u.phone.includes(ph)) return false
    if (query.status !== null && u.status !== query.status) return false
    return true
  })
})
const pagedList = computed(() => {
  page.total = filtered.value.length
  const start = (page.pageNum - 1) * page.pageSize
  return filtered.value.slice(start, start + page.pageSize)
})

const loadData = () => {
  loading.value = true
  // 模拟异步：真实场景用 fetchUsers(query, page)
  window.setTimeout(() => {
    allUsers.value = buildMock()
    loading.value = false
  }, 250)
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

/* ---------- 新增 / 编辑 ---------- */
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
const rules: FormRules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 1, max: 50, message: '长度 1-50', trigger: 'blur' },
  ],
  phone: [{ max: 20, message: '最多 20 位', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  remark: [{ max: 255, message: '最多 255 字', trigger: 'blur' }],
}

const openAdd = () => {
  dialogMode.value = 'add'
  dialogVisible.value = true
}
const openEdit = (row: UserRow) => {
  dialogMode.value = 'edit'
  Object.assign(form, { ...row })
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
const onSubmit = () => {
  formRef.value?.validate((ok) => {
    if (!ok) return
    submitting.value = true
    window.setTimeout(() => {
      if (dialogMode.value === 'add') {
        const id = Math.max(0, ...allUsers.value.map((u) => u.id)) + 1
        allUsers.value.unshift({
          id,
          username: form.username,
          phone: form.phone,
          status: form.status,
          remark: form.remark,
          createTime: '2026-09-12 20:00:00',
        })
        ElMessage.success('新增成功')
      } else {
        const idx = allUsers.value.findIndex((u) => u.id === form.id)
        const cur = allUsers.value[idx]
        if (idx >= 0 && cur) {
          allUsers.value[idx] = {
            id: cur.id,
            username: form.username,
            phone: form.phone,
            status: form.status,
            remark: form.remark,
            createTime: cur.createTime,
          }
          ElMessage.success('修改成功')
        }
      }
      submitting.value = false
      dialogVisible.value = false
      loadData()
    }, 200)
  })
}

/* ---------- 删除 ---------- */
const onDelete = (row: UserRow) => {
  ElMessageBox.confirm(`确认删除用户「${row.username}」吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消',
  })
    .then(() => {
      allUsers.value = allUsers.value.filter((u) => u.id !== row.id)
      ElMessage.success('删除成功')
      loadData()
    })
    .catch(() => {})
}

onMounted(() => {
  loadData()
  window.addEventListener('mousemove', onParallax)
})
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onParallax)
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

  /* 护眼绿主色，让页面内 Element Plus 的 primary 按钮统一成绿色 */
  --el-color-primary: #3f9e74;
  --el-color-primary-light-3: #6fb893;
  --el-color-primary-light-5: #9fd0b5;
  --el-color-primary-light-7: #cfe8da;
  --el-color-primary-light-8: #e3f1ea;
  --el-color-primary-light-9: #eef7f2;
  --el-color-primary-dark-2: #327d5d;

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

/* ===== 背景光球（柔和绿，不抢内容） ===== */
.bg-orbs { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.55; animation: drift 18s ease-in-out infinite; }
.o1 { width: 380px; height: 380px; top: -80px; left: -60px; background: radial-gradient(circle, rgba(120, 200, 160, 0.55), transparent 70%); }
.o2 { width: 320px; height: 320px; bottom: -60px; right: -40px; background: radial-gradient(circle, rgba(180, 220, 150, 0.5), transparent 70%); animation-delay: -6s; }
.o3 { width: 280px; height: 280px; top: 40%; left: 60%; background: radial-gradient(circle, rgba(120, 210, 190, 0.5), transparent 70%); animation-delay: -11s; }
@keyframes drift { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(30px, -24px) scale(1.08); } }

/* ===== 樱花 ===== */
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

/* ===== 樱花树 ===== */
.sakura-tree { position: fixed; right: 12px; bottom: -6px; width: 230px; height: 270px; z-index: 1; pointer-events: none; filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.35)); }
.tree-sway { transform-origin: 110px 255px; animation: sway 6s ease-in-out infinite; }
@keyframes sway { 0%, 100% { transform: rotate(-1.4deg); } 50% { transform: rotate(1.4deg); } }

/* ===== 顶部导航：默认隐藏，接近顶部浮现 ===== */
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

/* 顶部常驻低调度提示：暗示导航可呼出 */
.nav-hint { position: fixed; top: 0; left: 0; right: 0; z-index: 19; height: 6px; display: flex; justify-content: center; pointer-events: none; transition: opacity 0.3s; }
.nav-hint.hide { opacity: 0; }
.hint-line { width: 60px; height: 4px; margin-top: 0; border-radius: 0 0 4px 4px; background: linear-gradient(90deg, transparent, #4caf7d, transparent); opacity: 0.5; }

/* ===== 主体 ===== */
.container { position: relative; z-index: 3; max-width: 1120px; margin: 0 auto; padding: 64px 24px 48px; transition: transform 0.18s ease-out; }

/* 玻璃面板 */
.panel {
  position: relative; padding: 26px 26px 20px; border-radius: 24px;
  border: 1px solid var(--glass-bd); background: var(--glass);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 24px 60px rgba(10, 8, 24, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  animation: rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }

.panel-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 14px; flex-wrap: wrap; }
.eyebrow { margin: 0 0 6px; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: var(--lav); }
.title { margin: 0; font-size: 30px; font-weight: 800; letter-spacing: 1px; }
.title .grad { background: linear-gradient(120deg, var(--pink), var(--lav) 50%, var(--mint)); -webkit-background-clip: text; background-clip: text; color: transparent; }

.add-btn {
  display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; border: none; border-radius: 999px;
  font-size: 14px; letter-spacing: 1px; color: #1a1830; font-weight: 700; cursor: pointer;
  background: linear-gradient(120deg, var(--pink), var(--lav)); box-shadow: 0 10px 26px rgba(184, 155, 255, 0.4);
  transition: transform 0.22s, box-shadow 0.22s;
}
.add-btn:hover { transform: translateY(-3px); box-shadow: 0 14px 32px rgba(76, 175, 125, 0.4); }
.add-btn .plus { font-size: 16px; line-height: 1; }

.search { margin-bottom: 8px; }
.w200 { width: 200px; }
.w140 { width: 140px; }
.pager { display: flex; justify-content: flex-end; margin-top: 16px; }

/* ===== 表格注入深色玻璃感 ===== */
.dark-table.el-table {
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: rgba(255, 255, 255, 0.03);
  --el-table-header-bg-color: rgba(255, 255, 255, 0.07);
  --el-table-border-color: rgba(255, 255, 255, 0.08);
  --el-table-text-color: #e8e6f5;
  --el-table-header-text-color: #cfc9ef;
  --el-fill-color-light: rgba(255, 255, 255, 0.05);
  --el-table-row-hover-bg-color: rgba(184, 155, 255, 0.14);
  background: transparent;
}
.dark-table :deep(.el-table__inner-wrapper::before) { display: none; }

@media (max-width: 640px) {
  .title { font-size: 24px; }
  .panel { padding: 18px 16px 14px; }
  .w200, .w140 { width: 100%; }
}
</style>

<!-- 弹窗深色玻璃（el-dialog 渲染到 body，需非 scoped 覆盖） -->
<style>
.user-dialog .el-dialog {
  background: rgba(30, 26, 51, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 18px;
  backdrop-filter: blur(20px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
}
.user-dialog .el-dialog__title { color: #ece9f5; }
.user-dialog .el-dialog__body { color: #d8d4ea; }
.user-dialog .el-form-item__label { color: #b3aec9; }
</style>
