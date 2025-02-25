import type { UserInfo } from '../user'

export interface JLPT_PracticeBase {
    id: string
    time: string // 发布时间 YYYY-MM-DD
    user: UserInfo // 发布该练习的用户
    star: number // 该练习的获赞数
}
