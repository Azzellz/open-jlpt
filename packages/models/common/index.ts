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
