/**
 * 业务接口集合 —— 一个后端 Controller 对应这里一个模块。
 * 目前只有 HelloController 这一个，后续加接口照这个模式往下排即可。
 */

import { request, requestRaw } from './http'
import type { ApiResult, HelloVO } from './types'

/**
 * GET /api/hello?name=xxx
 * 后端会返回拼好的问候语 + Redis 访问计数 + MySQL 行数。
 *
 * @param name 称呼；传空字符串或不传时后端兜底为 World
 * @param signal 用于组件卸载时中断请求，避免「请求回来了但页面已经走了」
 */
export function fetchHello(name?: string, signal?: AbortSignal): Promise<HelloVO> {
  return request<HelloVO>(helloPath(name), { method: 'GET', signal })
}

/**
 * 同上，但返回完整的 Result（含 code / message）。
 * 接口示例页要把原始返回打给用户看，用它。
 */
export function fetchHelloRaw(name?: string, signal?: AbortSignal): Promise<ApiResult<HelloVO>> {
  return requestRaw<HelloVO>(helloPath(name), { method: 'GET', signal })
}

/** 拼接口路径。name 走 encodeURIComponent，避免中文/特殊字符把 URL 弄坏 */
function helloPath(name?: string): string {
  return name ? `/hello?name=${encodeURIComponent(name)}` : '/hello'
}
