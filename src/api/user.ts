/**
 * 用户管理接口 —— 对应 studydemo-backend 的 UserController（@RequestMapping("/api/users")）。
 *
 * 后端实际提供的 5 个接口：
 *
 *   | 功能     | 方法   | 路径            | 入参                  | 返回 data          |
 *   |---------|--------|-----------------|-----------------------|-------------------|
 *   | 分页列表 | GET    | /api/users      | UserQuery（拼在 URL 上） | PageResult<UserVO>|
 *   | 详情查询 | GET    | /api/users/{id} | —                     | UserVO            |
 *   | 新增     | POST   | /api/users      | UserSaveDTO(body)     | UserVO            |
 *   | 修改     | PUT    | /api/users/{id} | UserSaveDTO(body)     | UserVO            |
 *   | 删除     | DELETE | /api/users/{id} | —                     | 无（逻辑删除）      |
 *
 * 列表接口已支持后端分页：pageNum / pageSize 不传时后端默认第 1 页、每页 10 条，
 * pageSize 上限 100（超出由后端截断）。返回结构是：
 *
 *   { code, message, data: { records: UserVO[], total, pageNum, pageSize, pages } }
 *
 * ⚠️ 后端 application.yaml 里配了 `default-property-inclusion: non_null`，
 * 为 null 的字段不会出现在 JSON 里。所以 UserVO 的 phone / remark /
 * createTime 这些「可能没值」的字段，类型上必须允许 undefined，
 * 页面里也要做兜底，不然会渲染出 "undefined"。
 */

import { request } from './http'

/** 统一分页返回结构，对应后端 common/PageResult.java */
export interface PageResult<T> {
  /** 当前页数据 */
  records: T[]
  /** 满足条件的总记录数 */
  total: number
  /** 当前页码，从 1 开始 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 总页数 */
  pages: number
}

/** 用户视图对象，对应后端 dto/UserVO.java（字段名后端就是 camelCase，无需转换） */
export interface UserVO {
  id: number
  username: string
  /** 选填，后端为 null 时该字段会被整体省略 */
  phone?: string | null
  /** 1-启用 0-禁用；历史数据可能为 null */
  status?: number | null
  remark?: string | null
  /** 格式 yyyy-MM-dd HH:mm:ss（后端 Jackson 已配置时区 GMT+8） */
  createTime?: string | null
  updateTime?: string | null
}

/** 列表查询条件，对应后端 dto/UserQueryDTO.java。所有字段都可选 */
export interface UserQuery {
  /** 用户名模糊匹配 */
  username?: string
  /** 手机号模糊匹配 */
  phone?: string
  /** 状态精确匹配；null / undefined 表示不限 */
  status?: number | null
  /** 页码，从 1 开始；不传由后端按 1 处理 */
  pageNum?: number
  /** 每页条数；不传由后端按 10 处理，最大 100 */
  pageSize?: number
}

/** 新增/修改入参，对应后端 dto/UserSaveDTO.java */
export interface UserSaveDTO {
  username: string
  phone?: string | null
  status?: number | null
  remark?: string | null
}

/**
 * 拼列表接口的路径 + 查询串。
 *
 * 单独抽出来是为了让页面能把「即将请求的 URL」显示给用户看（练习页要能对照后端）。
 *
 * 这里必须把空值过滤掉，不能无脑透传：
 *   - `status=null` → Spring 把字符串 "null" 往 Integer 上绑，直接 400；
 *   - `status=`     → 空串的转换行为依赖 Spring 的 emptyAsNull 策略，能少一次是一次。
 * 空条件干脆不拼进 URL，语义上也正好等于「不加这个过滤条件」；
 * 分页参数同理，不传就让后端的默认值生效。
 */
export function usersPath(query: UserQuery = {}): string {
  const search = new URLSearchParams()

  const username = query.username?.trim()
  if (username) {
    search.set('username', username)
  }

  const phone = query.phone?.trim()
  if (phone) {
    search.set('phone', phone)
  }

  // 用 == null 同时挡住 null 和 undefined —— el-select 清空后给的是 undefined
  if (query.status != null) {
    search.set('status', String(query.status))
  }

  if (query.pageNum != null) {
    search.set('pageNum', String(query.pageNum))
  }

  if (query.pageSize != null) {
    search.set('pageSize', String(query.pageSize))
  }

  const queryString = search.toString()
  return queryString ? `/users?${queryString}` : '/users'
}

/**
 * 分页列表查询 —— GET /api/users?username=&phone=&status=&pageNum=&pageSize=
 *
 * 过滤和分页都由后端 SQL 完成，返回当前页数据 + 总数。
 *
 * @param signal 传入 AbortSignal 可在组件卸载 / 条件变更时中断旧请求
 */
export function fetchUsers(query: UserQuery = {}, signal?: AbortSignal): Promise<PageResult<UserVO>> {
  return request<PageResult<UserVO>>(usersPath(query), { method: 'GET', signal })
}

/**
 * 详情查询 —— GET /api/users/{id}
 *
 * 列表返回的已经是完整 UserVO，日常用不到；需要「编辑前拿最新值」或
 * 「刷新单行」时用它。查不到时后端返回 code=404，http.ts 会抛 ApiError。
 */
export function fetchUser(id: number, signal?: AbortSignal): Promise<UserVO> {
  return request<UserVO>(`/users/${id}`, { method: 'GET', signal })
}

/** 新增 —— POST /api/users，body 为 UserSaveDTO */
export function createUser(dto: UserSaveDTO, signal?: AbortSignal): Promise<UserVO> {
  return request<UserVO>('/users', {
    method: 'POST',
    body: JSON.stringify(dto),
    signal,
  })
}

/** 修改 —— PUT /api/users/{id}，body 为 UserSaveDTO */
export function updateUser(id: number, dto: UserSaveDTO, signal?: AbortSignal): Promise<UserVO> {
  return request<UserVO>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
    signal,
  })
}

/**
 * 删除 —— DELETE /api/users/{id}（后端做逻辑删除，把 is_deleted 置 1）
 *
 * 后端返回的 Result 里 data 为 null，所以这里没有返回值。
 * 删不存在的记录会返回 code=404 + "用户不存在或已删除"。
 */
export function deleteUser(id: number, signal?: AbortSignal): Promise<void> {
  return request<void>(`/users/${id}`, { method: 'DELETE', signal })
}
