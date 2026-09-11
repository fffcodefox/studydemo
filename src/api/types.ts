/**
 * 后端接口的类型声明。
 * 与 studydemo-backend 里的 Java 类一一对应：
 *   Result<T>   -> common/Result.java
 *   HelloVO     -> dto/HelloVO.java
 * 后端字段名本身就是 camelCase，无需做下划线转换。
 */

/** 后端统一返回结构 Result<T> */
export interface ApiResult<T> {
  /** 业务状态码，200 表示成功（对应后端 ResultCode.SUCCESS） */
  code: number
  /** 提示信息，成功时固定为 "success" */
  message: string
  /** 真正的业务数据 */
  data: T
}

/** GET /api/hello 的返回数据 */
export interface HelloVO {
  /** 后端实际使用的称呼（传空时后端会兜底成 World） */
  name: string
  /** 拼好的问候语 */
  message: string
  /** Redis 里的累计访问次数 */
  visits: number
  /** MySQL 表 t_demo_message 的总行数 */
  dbCount: number
}
