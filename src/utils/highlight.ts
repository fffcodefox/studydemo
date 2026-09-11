/**
 * 极简代码高亮器（只为本项目的示例源码服务）
 *
 * 为什么自己写：示例里只是想让代码「看着舒服」，引三方高亮库（highlight.js / shiki）太重。
 * 实现思路：
 *   1. 先按行拆分（这样可以给每行加行号）
 *   2. 逐行做词法扫描，用状态变量记录「是否处于多行注释中」
 *   3. 输出带 class 的 HTML 片段，颜色由 CSS 控制
 * 注意：输出内容已做 HTML 转义，用 v-html 渲染是安全的
 */

/** HTML 转义，防止源码里的 < > & 被当成标签解析 */
function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** 包一层 span */
function wrap(cls: string, text: string): string {
  return `<span class="${cls}">${escapeHtml(text)}</span>`
}

/** 关键字 */
const KEYWORDS = new Set([
  'import', 'export', 'default', 'from', 'as', 'const', 'let', 'var', 'function', 'return',
  'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'class',
  'extends', 'super', 'this', 'typeof', 'instanceof', 'in', 'of', 'try', 'catch', 'finally',
  'throw', 'async', 'await', 'interface', 'type', 'enum', 'implements', 'readonly', 'public',
  'private', 'protected', 'static', 'void', 'null', 'undefined', 'true', 'false', 'number',
  'string', 'boolean', 'any', 'unknown', 'never', 'satisfies', 'keyof',
])

/** Vue 的编译器宏 / 常用响应式 API（单独一个颜色，方便一眼认出） */
const BUILTINS = new Set([
  'defineProps', 'defineEmits', 'defineExpose', 'defineModel', 'withDefaults', 'defineOptions',
  'computed', 'watch', 'watchEffect', 'watchPostEffect', 'ref', 'reactive', 'onMounted',
  'onUnmounted', 'onBeforeMount', 'onBeforeUpdate', 'onUpdated', 'onBeforeUnmount',
  'onActivated', 'onDeactivated', 'onErrorCaptured', 'onWatcherCleanup', 'nextTick', 'provide',
  'inject', 'toRefs', 'toRef', 'isRef', 'unref', 'readonly', 'shallowRef', 'shallowReactive',
  'customRef', 'effectScope', 'useTemplateRef', 'toValue', 'markRaw', 'toRaw', 'triggerRef',
  'isProxy', 'isReactive', 'defineAsyncComponent',
])

type BlockState = '' | 'html' | 'css'

/**
 * 高亮一整段源码，返回「每行 HTML」组成的数组（方便外面渲染行号）
 */
export function highlight(source: string): string[] {
  const state: { block: BlockState } = { block: '' }
  return source.split('\n').map((line) => scanLine(line, state))
}

/** 扫描单行 */
function scanLine(line: string, state: { block: BlockState }): string {
  let out = ''
  let i = 0

  while (i < line.length) {
    // ===== 1. 处于多行注释中：只找结束标记 =====
    if (state.block) {
      const closer = state.block === 'html' ? '-->' : '*/'
      const idx = line.indexOf(closer, i)
      if (idx === -1) {
        out += wrap('tk-comment', line.slice(i))
        return out
      }
      out += wrap('tk-comment', line.slice(i, idx + closer.length))
      i = idx + closer.length
      state.block = ''
      continue
    }

    const rest = line.slice(i)

    // ===== 2. 行注释 // =====
    if (rest.startsWith('//')) {
      out += wrap('tk-comment', rest)
      return out
    }

    // ===== 3. 块注释 <!-- --> 和 /* */ =====
    if (rest.startsWith('<!--')) {
      const idx = rest.indexOf('-->', 4)
      if (idx === -1) {
        out += wrap('tk-comment', rest)
        state.block = 'html'
        return out
      }
      out += wrap('tk-comment', rest.slice(0, idx + 3))
      i += idx + 3
      continue
    }
    if (rest.startsWith('/*')) {
      const idx = rest.indexOf('*/', 2)
      if (idx === -1) {
        out += wrap('tk-comment', rest)
        state.block = 'css'
        return out
      }
      out += wrap('tk-comment', rest.slice(0, idx + 2))
      i += idx + 2
      continue
    }

    // ===== 4. 字符串 ' " ` =====
    const strMatch = /^('(?:[^'\\]|\\.)*'?|"(?:[^"\\]|\\.)*"?|`(?:[^`\\]|\\.)*`?)/.exec(rest)
    if (strMatch) {
      out += wrap('tk-string', strMatch[1]!)
      i += strMatch[1]!.length
      continue
    }

    // ===== 5. HTML 标签：<template、</div =====
    const tagMatch = /^<\/?[A-Za-z][\w.:-]*/.exec(rest)
    if (tagMatch) {
      out += wrap('tk-tag', tagMatch[0])
      i += tagMatch[0].length
      continue
    }

    // ===== 6. Vue 指令与简写：v-if / :src / @click / #header =====
    const dirMatch = /^(v-[\w.:-]+|[:@#][\w.[\]-]+)/.exec(rest)
    if (dirMatch) {
      out += wrap('tk-attr', dirMatch[0])
      i += dirMatch[0].length
      continue
    }

    // ===== 7. 数字 =====
    const numMatch = /^\d+(\.\d+)?/.exec(rest)
    if (numMatch && !/[A-Za-z_$]/.test(line[i - 1] ?? '')) {
      out += wrap('tk-number', numMatch[0])
      i += numMatch[0].length
      continue
    }

    // ===== 8. 标识符：关键字 / 内置 API / 函数调用 / 普通文本 =====
    const wordMatch = /^[A-Za-z_$][\w$]*/.exec(rest)
    if (wordMatch) {
      const word = wordMatch[0]
      if (KEYWORDS.has(word)) {
        out += wrap('tk-keyword', word)
      } else if (BUILTINS.has(word)) {
        out += wrap('tk-builtin', word)
      } else if (rest[word.length] === '(') {
        out += wrap('tk-fn', word)
      } else {
        out += escapeHtml(word)
      }
      i += word.length
      continue
    }

    // ===== 9. 其它字符原样输出 =====
    out += escapeHtml(line[i]!)
    i++
  }

  return out
}
