/**
 * 组合式函数示例 1：计数器
 *
 * 组合式函数（Composable）的约定：
 *   1. 文件名和函数名以 use 开头，如 useCounter / useMouse
 *   2. 内部可以使用 ref、computed、watch、生命周期钩子等任意组合式 API
 *   3. 通常返回「响应式数据 + 操作函数」组成的对象
 *   4. 每次调用都会创建独立的状态，不会在多个组件间共享（和 Vuex/Pinia 不同）
 *   5. 参数尽量支持「ref / getter / 普通值」多种形式，用 toValue 统一读取（Vue 3.3+）
 */
import { ref, computed, toValue, type MaybeRefOrGetter } from 'vue'

export interface UseCounterOptions {
  /** 初始值 */
  initial?: number
  /** 每次加减的步长 */
  step?: number
  /** 最小值（可选） */
  min?: number
  /** 最大值（可选） */
  max?: number
}

export function useCounter(options: UseCounterOptions = {}) {
  const { initial = 0, step = 1, min = -Infinity, max = Infinity } = options

  const count = ref(initial)

  // 计算派生状态
  const double = computed(() => count.value * 2)
  const isMin = computed(() => count.value <= min)
  const isMax = computed(() => count.value >= max)

  const add = () => {
    count.value = Math.min(count.value + step, max)
  }
  const reduce = () => {
    count.value = Math.max(count.value - step, min)
  }
  const reset = () => {
    count.value = initial
  }

  return {
    // 状态
    count,
    double,
    isMin,
    isMax,
    // 方法
    add,
    reduce,
    reset,
  }
}

/**
 * 组合式函数示例 2：让步长可动态变化
 * 演示如何接收 MaybeRefOrGetter 类型的参数（值 / ref / getter 都支持）
 */
export function useDynamicCounter(initial: MaybeRefOrGetter<number> = 0) {
  const count = ref(toValue(initial))

  const add = (step: MaybeRefOrGetter<number> = 1) => {
    // toValue：如果是 ref 就取 .value，如果是函数就调用，否则原样返回
    count.value += toValue(step)
  }

  return { count, add }
}
