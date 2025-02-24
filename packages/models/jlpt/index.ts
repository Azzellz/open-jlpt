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
}

export interface JLPT_ReadArticle {
    title: string
    contents: string[]
}

export interface JLPT_ReadStructure {
    paragraph_focus: string[]
}

export interface JLPT_Read {
    article: JLPT_ReadArticle
    questions: JLPT_ReadQuestion[]
    vocabList: JLPT_ReadVocab[] //词汇表
    structure: JLPT_ReadStructure
}
