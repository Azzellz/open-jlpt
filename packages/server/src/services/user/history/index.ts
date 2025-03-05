import { DB_JLPT_ReadModel, DB_UserModel } from '@/db'
import { JLPT_Model } from '@/models'
import { verifyPluginReference } from '@/plugins'
import { checkObjectIdPlugin } from '@/plugins/other'
import { createSuccessResponse, ERROR_RESPONSE, Log } from '@root/shared'
import Elysia from 'elysia'

export const UserHistoryService = new Elysia({ prefix: '/:userID/histories' })
    .use(JLPT_Model)
    .use(verifyPluginReference)
    .use(checkObjectIdPlugin('userID'))

UserHistoryService.post(
    '/reads',
    async ({ params: { userID }, body }) => {
        try {
            const user = await DB_UserModel.findById(userID)
            if (!user) {
                return ERROR_RESPONSE.USER.NOT_FOUND
            }
            const newHistory = {
                ...body,
                timeStamp: Date.now(),
            }
            user.histories.reads.push(newHistory)
            await user.save()
            return createSuccessResponse(200, '创建成功', newHistory)
        } catch (error) {
            Log.error(error)
            return ERROR_RESPONSE.SYSTEM.INTERNAL_ERROR
        }
    },
    {
        body: 'read.create',
    }
)
