import type { PaginationQueryParams } from '../common'
import type { JLPT_Difficulty, JLPT_KanaMap } from './common'
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
    paragraphFocus: string[]
}

// 由 LLM 生成的原始数据
export interface JLPT_ReadOrigin {
    difficulty: JLPT_Difficulty // 难度
    article: JLPT_ReadArticle // 文章
    vocabList: JLPT_ReadVocab[] // 词汇表
    structure: JLPT_ReadStructure // 文章结构
    questions: JLPT_ReadQuestion[] // 问题
    kanaMap: JLPT_KanaMap // 汉字->假名映射表
}

export interface JLPT_Read extends JLPT_ReadOrigin, JLPT_PracticeBase {
    visible: boolean
}

export interface JLPT_ReadCreateParams extends JLPT_ReadOrigin {}

export interface JLPT_ReadQueryParams extends PaginationQueryParams {
    id?: string
    'user.name'?: string
    'user.account'?: string
    orderBy?: 'star-asc' | 'star-desc'
    keyword?: string
    difficulty?: JLPT_Difficulty
}
