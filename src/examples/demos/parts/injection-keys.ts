// 依赖注入的 key 集中管理
// 真实项目中建议放在 src/constants/injection-keys.ts，由 provide 方和 inject 方共同引用
// ⚠️ 注意：key 必须用「同一个引用」，两个文件各自写 Symbol('theme') 是不同的 Symbol，注入会失败！
import type { InjectionKey, Ref } from 'vue'

export interface Theme {
  color: string
  title: string
}

export interface CurrentUser {
  name: string
  role: string
}

// 主题（只读，防止后代直接改）
export const ThemeKey = Symbol('theme') as InjectionKey<Readonly<Theme>>
// 修改主题的方法
export const UpdateThemeKey = Symbol('updateTheme') as InjectionKey<(color: string) => void>
// 当前用户（ref 形式）
export const CurrentUserKey = Symbol('currentUser') as InjectionKey<Ref<CurrentUser>>
