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

export interface JLPT_Read {
    article: JLPT_ReadArticle // 文章
    questions: JLPT_ReadQuestion[] // 问题
    vocabList: JLPT_ReadVocab[] // 词汇表
    structure: JLPT_ReadStructure // 文章结构
}
