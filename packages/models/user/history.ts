import type { PaginationQueryParams } from '../common'

/**
 * 用户的答题历史记录
 */
export interface UserHistory {
    reads: UserHistoryRecord[]
}

export interface UserHistoryRecord {
    id: string
    answers: number[]
    timeStamp: number
    /**
     * 引用的阅读ID
     */
    ref: string
}

export interface UserHistoryCreateParams extends Pick<UserHistoryRecord, 'answers' | 'ref'> {}

export interface UserHistoryQueryParams extends PaginationQueryParams {}
