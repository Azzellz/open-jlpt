import { t } from 'elysia'

export const UserHistoryCreateBody = t.Object({
    answer: t.Array(t.Number()),
    ref: t.String(),
})

export const UserHistoryCreateParams = t.Object({
    userID: t.Numeric(),
    type: t.Union([t.Literal('reads')]),
})

export const UserHistoryDeleteParams = t.Composite([
    UserHistoryCreateParams,
    t.Object({
        historyID: t.String(),
    }),
])
