import { t } from 'elysia'

// 基础词汇类型
const JLPT_ReadVocab = t.Object({
    word: t.String(),
    definition: t.String(),
})

// 问题类型（带答案解析）
const JLPT_ReadQuestion = t.Object({
    number: t.Number(),
    type: t.String(),
    question: t.String(),
    options: t.Array(t.String()),
    answer: t.Number(),
    analysis: t.String(),
})

// 文章结构
const JLPT_ReadArticle = t.Object({
    title: t.String(),
    contents: t.Array(t.String()),
})

// 文章结构分析
const JLPT_ReadStructure = t.Object({
    paragraphFocus: t.Array(t.String()),
})

// 原始数据生成接口
const JLPT_ReadOrigin = t.Object({
    difficulty: t.Union([
        t.Literal('N1'),
        t.Literal('N2'),
        t.Literal('N3'),
        t.Literal('N4'),
        t.Literal('N5'),
    ]),
    article: JLPT_ReadArticle,
    vocabList: t.Array(JLPT_ReadVocab),
    structure: JLPT_ReadStructure,
    questions: t.Array(JLPT_ReadQuestion),
})

// 用户信息类型
const UserInfo = t.Object({
    id: t.String(),
    name: t.String(),
    avatar: t.Optional(t.String()),
})

// 完整练习类型
const JLPT_Read = t.Composite([
    JLPT_ReadOrigin,
    t.Object({
        id: t.String(),
        timeStamp: t.Number(),
        user: UserInfo,
        star: t.Number(),
    }),
])

// 创建参数类型
export const JLPT_ModelReadCreateBody = t.Omit(JLPT_Read, ['id', 'timeStamp', 'user', 'star'])

// export const JLPT_ModelReadUpdateBody = t.Object({})
