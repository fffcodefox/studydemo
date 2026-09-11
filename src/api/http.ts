/**
 * 极简 HTTP 客户端 —— 基于原生 fetch 封装，不引入 axios。
 *
 * 做三件事：
 *   1. 拼 baseURL（默认 /api，开发环境由 vite.config.ts 的 proxy 转发到 8080）
 *   2. 统一解包后端的 Result<T>：成功直接返回 data，失败抛 ApiError
 *   3. 把「网络层失败」和「业务层失败」区分开，前端能给出不同的提示
 *
 * 之所以不直接 fetch，是因为后端所有接口都套了一层 Result，
 * 每个页面都写一遍 res.json().data 既啰嗦又容易漏判 code。
 */

import type { ApiResult } from './types'

/**
 * 接口前缀，来自 .env.development / .env.production 的 VITE_API_BASE。
 *
 * 开发环境是 /api，由 vite.config.ts 的 server.proxy 转发到后端（目标地址见 DEV_PROXY_TARGET）；
 * 生产环境同样是 /api，由 Nginx 反向代理到后端 —— 前端代码两种环境一字不用改。
 * 若确实要直连后端（跨域），把 VITE_API_BASE 改成完整地址即可。
 */
export const API_BASE: string = import.meta.env.VITE_API_BASE ?? '/api'

/** 后端约定的成功状态码，对应 ResultCode.SUCCESS */
const SUCCESS_CODE = 200

/**
 * 业务异常：只要不是「HTTP 2xx + code=200」，都会抛出这个。
 * 页面里统一 `catch (e) { e instanceof ApiError ? e.message : ... }`
 */
export class ApiError extends Error {
  /** 后端业务码，或 HTTP 状态码；网络层失败时为 0 */
  readonly code: number

  constructor(message: string, code = 0) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

/** AbortError 是主动取消，调用方自己处理，不该被当成失败弹提示 */
function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError'
}

/**
 * 发起一次请求，返回后端的完整 Result（含 code / message / data）。
 * 需要把原始 JSON 展示给用户看的场景（比如接口示例页）用这个。
 *
 * @param path 以 / 开头的接口路径，如 `/hello?name=Vue`
 * @param init 透传给 fetch 的配置（method / body / signal / headers…）
 * @throws ApiError 网络不通、HTTP 非 2xx、code 非 200、响应不是合法 JSON
 */
export async function requestRaw<T>(path: string, init: RequestInit = {}): Promise<ApiResult<T>> {
  const url = API_BASE + path
  const { headers, ...rest } = init

  let response: Response
  try {
    response = await fetch(url, {
      ...rest,
      headers: { 'Content-Type': 'application/json', ...(headers as Record<string, string>) },
    })
  } catch (err) {
    if (isAbortError(err)) throw err
    // fetch 只在网络层失败时 reject：后端没启动、端口不通、被跨域拦截
    throw new ApiError(`请求发不出去：${url}\n后端 studydemo-backend 启动了吗？（期望 8080 端口）`)
  }

  if (!response.ok) {
    throw new ApiError(`HTTP ${response.status} ${response.statusText}`, response.status)
  }

  let payload: ApiResult<T>
  try {
    payload = (await response.json()) as ApiResult<T>
  } catch {
    // 常见于代理转到了一个返回 HTML 的服务（比如代理配错、命中了别的开发服务器）
    throw new ApiError('响应不是合法 JSON，检查代理是否转到了正确的后端')
  }

  if (payload.code !== SUCCESS_CODE) {
    throw new ApiError(payload.message || `业务处理失败（code=${payload.code}）`, payload.code)
  }

  return payload
}

/**
 * 发起一次请求并解包出 data —— 日常业务调用用这个就够。
 *
 * @returns 后端 Result 里的 data 部分
 * @throws ApiError 同 requestRaw
 */
export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const payload = await requestRaw<T>(path, init)
  return payload.data
}
