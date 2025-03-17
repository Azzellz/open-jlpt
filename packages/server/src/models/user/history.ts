import { t } from 'elysia'
import { PaginationModel } from '../common'

export const UserHistoryLocateParams = t.Object({
    userID: t.String(),
    type: t.Union([t.Literal('reads')]),
})

export const UserHistoryCreateBody = t.Object({
    answers: t.Array(t.Number()),
    ref: t.String(),
})

export const UserHistoryCreateParams = UserHistoryLocateParams

export const UserHistoryDeleteParams = t.Composite([
    UserHistoryLocateParams,
    t.Object({
        historyID: t.String(),
    }),
])

export const UserHistoryGetParams = UserHistoryLocateParams

export const UserHistoryGetQuery = PaginationModel
