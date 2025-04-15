export type JLPT_Difficulty = 'N1' | 'N2' | 'N3' | 'N4' | 'N5' // 难度
export interface JLPT_KanaMap extends Record<string, string> {}
export interface JLPT_ReadText {
    type: 'kanji' | 'kana' | 'other'
    text: string
    kana?: string
}
