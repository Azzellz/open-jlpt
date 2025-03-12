import { DB_UserModel } from '@/db'
import { UserModel } from '@/models/user'
import { verifyPluginReference } from '@/plugins'
import { checkObjectIdPlugin } from '@/plugins/other'
import type { UserHistoryItem } from '@root/models'
import { createSuccessResponse, ERROR_RESPONSE, Log } from '@root/shared'
import Elysia from 'elysia'
import { nanoid } from 'nanoid'

export const UserHistoryService = new Elysia({ prefix: '/:userID/histories/:type' })
    .use(UserModel)
    .use(verifyPluginReference)
    .use(checkObjectIdPlugin('userID'))

UserHistoryService.post(
    '/',
    async ({ params: { userID, type }, body }) => {
        try {
            const user = await DB_UserModel.findById(userID)
            if (!user) {
                return ERROR_RESPONSE.USER.NOT_FOUND
            }
            const newHistory: UserHistoryItem = {
                ...body,
                id: nanoid(),
                timeStamp: Date.now(),
            }
            user.histories[type].push(newHistory)
            await user.save()
            return createSuccessResponse(200, '创建成功', newHistory)
        } catch (error) {
            Log.error(error)
            return ERROR_RESPONSE.SYSTEM.INTERNAL_ERROR
        }
    },
    {
        body: 'histories.create.body',
        params: 'histories.create.params',
    }
)

UserHistoryService.delete(
    '/:historyID',
    async ({ params: { userID, type, historyID } }) => {
        try {
            const user = await DB_UserModel.findById(userID)
            if (!user) {
                return ERROR_RESPONSE.USER.NOT_FOUND
            }
            user.histories[type] = user.histories[type].filter((item) => item.id !== historyID)

            await user.save()
            return createSuccessResponse(200, '删除成功', null)
        } catch (error) {
            Log.error(error)
            return ERROR_RESPONSE.SYSTEM.INTERNAL_ERROR
        }
    },
    {
        params: 'histories.delete.params',
    }
)
