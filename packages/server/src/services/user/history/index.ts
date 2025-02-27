import { verifyPluginReference } from '@/plugins'
import { checkObjectIdPlugin } from '@/plugins/other'
import Elysia from 'elysia'

export const UserHistoryService = new Elysia({ prefix: '/:id/histories' })
    .use(verifyPluginReference)
    .use(checkObjectIdPlugin)

UserHistoryService.post('/reads', async ({ params: { id } }) => {})
