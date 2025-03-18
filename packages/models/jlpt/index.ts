import type { JLPT_Read } from './read'

export * from './read'
export * from './common'

export interface JLPT_PracticeMap {
    reads: JLPT_Read[]
}
export interface JLPT_PracticeTypeMap {
    reads: JLPT_Read
}
