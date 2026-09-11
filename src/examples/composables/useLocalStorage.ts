/**
 * 组合式函数示例 3：本地存储（演示响应式数据与 localStorage 双向同步）
 * 实际项目里可以直接用 VueUse 的 useStorage，这里手写一遍是为了理解原理
 */
import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  // 读取已保存的值，没有就用默认值
  const stored = localStorage.getItem(key)
  const data = ref<T>(stored ? (JSON.parse(stored) as T) : defaultValue) as Ref<T>

  // 数据变化时自动写回 localStorage（deep 保证嵌套对象变化也能同步）
  watch(
    data,
    (val) => {
      localStorage.setItem(key, JSON.stringify(val))
    },
    { deep: true },
  )

  const clear = () => {
    localStorage.removeItem(key)
  }

  return { data, clear }
}
