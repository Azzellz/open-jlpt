export interface PaginationQueryParams {
    page: number
    pageSize: number
}

export interface PaginationResult<T> {
    page: number
    pageSize: number
    total: number
    items: T[]
}

export interface ChatRecord {
    question: {
        value: string
        timeStamp: number
    }
    content: {
        value: string
        timeStamp: number
    }
    reasoning: {
        value: string
        timeStamp: number
    }
}