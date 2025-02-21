export interface JLPT_Read {
    article: {
        title: string
        contents: string[]
    }
    questions: {
        number: number
        type: string
        question: string
        options: string[]
        answer: number
    }[]
    vocabList: {
        word: string
        definition: string
    }[] //词汇表
    structure: {
        paragraph_focus: string[]
    }
}
