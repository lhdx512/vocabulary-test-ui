// lib/test-engine/engine.ts

import type { Sentence, SessionState } from "./types"

/**
 * v1 创建会话：先用固定句数停测（maxSteps）
 * v2 再升级为：误差阈值收敛停测
 */
export function createSession(maxSteps = 20): SessionState {
  return {
    step: 0,
    maxSteps,
    stats: { seen: 0, uncertain: 0 },
  }
}

/**
 * v1：与现有 SentenceCard 的“可点击词”规则对齐：
 * - 只把长度>=5的英文词当作 content words
 */
export function extractContentWords(sentence: Sentence): string[] {
  const words = sentence.text.match(/\b[\w']+\b|[.,!?;]/g) || []
  const content = words.filter((w) => /^[a-zA-Z]{5,}$/.test(w))
  return content
}

/**
 * v1：每完成一句，更新统计：
 * seen += contentWords 数量
 * uncertain += 用户选中的词数量
 *
 * 注意：v1 只为闭环跑通，不追求严谨估计；
 * v2 会改成“词族去重 + 按词频 band 统计”。
 */
export function updateSession(state: SessionState, sentence: Sentence, selectedWords: Set<string>): SessionState {
  const contentWords = extractContentWords(sentence)
  const seenAdd = contentWords.length
  const uncertainAdd = selectedWords.size

  return {
    ...state,
    step: state.step + 1,
    stats: {
      seen: state.stats.seen + seenAdd,
      uncertain: state.stats.uncertain + uncertainAdd,
    },
  }
}

export function shouldStop(state: SessionState): boolean {
  return state.step >= state.maxSteps
}

/**
 * v1：给一个“能解释、能稳定演示”的估计口径：
 * - 用不确定率估计已掌握比例 pKnown
 * - 词族规模先用一个常数上限（如 8000）演示，后续换成真正词族表积分
 * - 误差用二项分布标准误差近似（seen 越多，误差越小）
 */
export function estimate(state: SessionState) {
  const seen = Math.max(1, state.stats.seen)
  const pUncertain = state.stats.uncertain / seen
  const pKnown = clamp01(1 - pUncertain)

  const vocabCap = 8000 // v1 演示上限；v2 替换为“词族表累计”
  const vocab = Math.round(vocabCap * pKnown)

  // 标准误差：sqrt(p(1-p)/n)，再映射到词族数量
  const se = Math.sqrt((pKnown * (1 - pKnown)) / seen)
  const error = Math.max(50, Math.round(vocabCap * se))

  return { vocab, error, pKnown, seen }
}

function clamp01(x: number) {
  if (x < 0) return 0
  if (x > 1) return 1
  return x
}
