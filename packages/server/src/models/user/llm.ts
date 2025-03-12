import { t } from 'elysia'

export const UserModelLLMChatBody = t.Object({
    isStream: t.Boolean(),
    messages: t.Array(
        t.Object({
            role: t.Union([t.Literal('user'), t.Literal('system')]),
            content: t.String(),
        })
    ),
})
