/**
 * 文章管理接口 —— 对应 studydemo-backend 的 ArticleController（@RequestMapping("/api/console/articleManage")）。
 *
 * 对齐 cdp_service 风格：列表/详情/增/改/删全部 POST，入参放 body；
 * 统一返回 ApiResponseVo（外层 {code,message,data}），由 http.ts 解包出 data。
 *
 * 路径 BASE 为 /console/articleManage，request() 会自动拼上 /api 前缀，
 * 由 vite.config.ts 的 proxy 原样转发到后端（http://127.0.0.1:8080/api/console/articleManage/...）。
 *
 * 列表走后端分页：pageNum / pageSize 不传时后端默认第 1 页、每页 10 条，pageSize 上限 100。
 * 详情接口返回的内容里带正文 content，列表接口的 records 不带（节省带宽）。
 *
 * ⚠️ 后端配了 `default-property-inclusion: non_null`，为 null 的字段不会出现在 JSON 里，
 * 所以 ArticleVO 里「可能没值」的字段类型都允许 undefined，页面也要做兜底。
 */

import { request } from './http'
import type { PageResult } from './user'

/** 文章视图对象，对应后端 dto/ArticleVO.java */
export interface ArticleVO {
  id: number
  title: string
  /** 选填，后端为 null 时字段会被整体省略 */
  summary?: string | null
  /** 正文；列表接口不返回，详情/新增/修改才返回 */
  content?: string | null
  cover?: string | null
  author?: string | null
  /** 1-已发布 0-草稿；历史数据可能为 null */
  status?: number | null
  /** 状态文案：1-已发布 0-草稿，由后端填充，前端可直接展示 */
  statusText?: string | null
  views?: number | null
  /** 格式 yyyy-MM-dd HH:mm:ss（后端 Jackson 已配置时区 GMT+8） */
  createTime?: string | null
  updateTime?: string | null
}

/** 列表查询条件，对应后端 dto/ArticleQueryDTO.java。所有字段都可选 */
export interface ArticleQuery {
  /** 标题模糊匹配 */
  title?: string
  /** 状态精确匹配；null / undefined 表示不限 */
  status?: number | null
  /** 页码，从 1 开始；不传由后端按 1 处理 */
  pageNum?: number
  /** 每页条数；不传由后端按 10 处理，最大 100 */
  pageSize?: number
}

/** 新增/修改入参，对应后端 dto/ArticleSaveDTO.java（title / status 为必填，修改时 id 必填） */
export interface ArticleSaveDTO {
  /** 主键：新增时不传，修改时由 updateArticle 合并进 body */
  id?: number | null
  title: string
  summary?: string | null
  content?: string | null
  cover?: string | null
  author?: string | null
  /** 1-已发布 0-草稿，必填；后端会校验非空 */
  status: number
}

/** 接口前缀：/console/articleManage，request() 会再拼上 /api */
const BASE = '/console/articleManage'

/**
 * 分页列表查询 —— POST /api/console/articleManage/queryArticleList
 *
 * 过滤和分页都由后端完成，返回当前页数据 + 总数。
 * body 直接放 ArticleQuery（空字段不传也不会出错，后端按「不限」处理）。
 */
export function fetchArticles(query: ArticleQuery = {}): Promise<PageResult<ArticleVO>> {
  return request<PageResult<ArticleVO>>(`${BASE}/queryArticleList`, {
    method: 'POST',
    body: JSON.stringify(query),
  })
}

/**
 * 详情查询 —— POST /api/console/articleManage/getArticleDetail，body: { id }
 *
 * 列表返回的 records 不含正文，需要编辑前拿最新值、或展示正文时再用它。
 * 查不到时后端返回非 "200" 的 code，http.ts 会抛 ApiError。
 */
export function fetchArticle(id: number): Promise<ArticleVO> {
  return request<ArticleVO>(`${BASE}/getArticleDetail`, {
    method: 'POST',
    body: JSON.stringify({ id }),
  })
}

/** 新增 —— POST /api/console/articleManage/addArticle，body 为 ArticleSaveDTO */
export function createArticle(dto: ArticleSaveDTO): Promise<ArticleVO> {
  return request<ArticleVO>(`${BASE}/addArticle`, {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

/**
 * 修改 —— POST /api/console/articleManage/updateArticle
 *
 * 后端从 body 里读 id（@RequestBody ArticleSaveDTO 含 id 字段），
 * 所以这里把 id 合并进 dto 再整体提交。id 为空时后端会返回「文章ID不能为空」。
 */
export function updateArticle(id: number, dto: ArticleSaveDTO): Promise<ArticleVO> {
  return request<ArticleVO>(`${BASE}/updateArticle`, {
    method: 'POST',
    body: JSON.stringify({ ...dto, id }),
  })
}

/** 删除 —— POST /api/console/articleManage/deleteArticle，body: { id }（后端逻辑删除） */
export function deleteArticle(id: number): Promise<void> {
  return request<void>(`${BASE}/deleteArticle`, {
    method: 'POST',
    body: JSON.stringify({ id }),
  })
}
