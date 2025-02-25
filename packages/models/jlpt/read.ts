import type { JLPT_PracticeBase } from './practice'

export interface JLPT_ReadVocab {
    word: string
    definition: string
}

export interface JLPT_ReadQuestion {
    number: number
    type: string
    question: string
    options: string[]
    answer: number
    analysis: string // 答案解析（完整一点）
}

export interface JLPT_ReadArticle {
    title: string
    contents: string[]
}

export interface JLPT_ReadStructure {
    paragraph_focus: string[]
}

// 由 LLM 生成的原始数据
export interface JLPT_ReadOrigin {
    difficulty: 'N1' | 'N2' | 'N3' | 'N4' | 'N5' // 难度
    article: JLPT_ReadArticle // 文章
    vocabList: JLPT_ReadVocab[] // 词汇表
    structure: JLPT_ReadStructure // 文章结构
    questions: JLPT_ReadQuestion[] // 问题
}

export interface JLPT_Read extends JLPT_ReadOrigin, JLPT_PracticeBase {}
