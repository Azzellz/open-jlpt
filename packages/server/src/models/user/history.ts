import { t } from 'elysia'

export const UserHistoryCreateBody = t.Object({
    answers: t.Array(t.Number()),
    ref: t.String(),
})

export const UserHistoryCreateParams = t.Object({
    userID: t.String(),
    type: t.Union([t.Literal('reads')]),
})

export const UserHistoryDeleteParams = t.Composite([
    UserHistoryCreateParams,
    t.Object({
        historyID: t.String(),
    }),
])
