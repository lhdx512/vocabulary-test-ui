// lib/test-engine/types.ts

export type SentenceToken = {
    surface: string
    key: string // v1: lowercase 作为 key，后续可替换成词族 id
    isContent: boolean
  }
  
  export type Sentence = {
    id: number
    text: string
    translation: string
    wordTranslations: Record<string, string>
  }
  
  /**
   * v1：只做总量统计（seen/uncertain），先跑通闭环。
   * v2：再升级到按 band / 词族的统计。
   */
  export type SessionStats = {
    seen: number
    uncertain: number
  }
  
  export type SessionState = {
    step: number
    maxSteps: number
    stats: SessionStats
  }
  