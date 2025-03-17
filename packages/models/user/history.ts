/**
 * 用户的答题历史记录
 */
export interface UserHistory {
    reads: UserHistoryItem[]
}

export interface UserHistoryItem {
    id: string
    answers: number[]
    timeStamp: number
    /**
     * 引用的阅读ID
     */
    ref: string
}

export interface UserHistoryCreateParams extends Pick<UserHistoryItem, 'answers' | 'ref'> {}
