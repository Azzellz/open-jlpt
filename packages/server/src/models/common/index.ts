import Elysia, { t } from 'elysia'

export const PaginationModel = t.Object({
    page: t.Numeric({ default: 1 }),
    pageSize: t.Numeric({ default: 10 }),
})

export const CommonModel = new Elysia().model({
    pagination: PaginationModel,
})
