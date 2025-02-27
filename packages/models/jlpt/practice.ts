import type { UserInfo } from '../user'

export interface JLPT_PracticeBase {
    id: string
    timeStamp: number // 发布时间时间戳
    user: UserInfo // 发布该练习的用户
    star: number // 该练习的获赞数
}
