/**
 * 组合式函数示例 2：追踪鼠标位置
 *
 * 这个例子演示了组合式函数的两个重要实践：
 *   1. 在 onMounted 中注册全局事件监听，在 onUnmounted 中「必须」清理（防止内存泄漏）
 *   2. 函数可以返回一个「控制开关」，让调用方决定什么时候开始监听
 */
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  // 是否正在监听
  const enabled = ref(true)

  const update = (e: MouseEvent) => {
    x.value = e.pageX
    y.value = e.pageY
  }

  const start = () => {
    window.addEventListener('mousemove', update)
    enabled.value = true
  }

  const stop = () => {
    window.removeEventListener('mousemove', update)
    enabled.value = false
  }

  onMounted(start)
  // 组件卸载时自动移除监听，避免内存泄漏
  onUnmounted(stop)

  return { x, y, enabled, start, stop }
}
