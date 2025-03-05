import type { UserInfo } from '../user'
import type { JLPT_Read, JLPT_ReadCreateParams } from './read'
export interface JLPT_PracticeBase {
    id: string
    timeStamp: number // 发布时间时间戳
    user: UserInfo // 发布该练习的用户
    star: number // 该练习的获赞数
}

export interface JLPT_PracticeCreateParamsMap {
    reads: JLPT_ReadCreateParams
}

export interface JLPT_PracticeCreateResponseMap {
    reads: JLPT_Read
}
