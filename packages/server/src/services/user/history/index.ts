import { DB_JLPT_ModelMap } from '@/db'
import { UserModel } from '@/models/user'
import { verifyPluginReference } from '@/plugins'
import { checkUserAvailablePlugin } from '@/plugins/user'
import type { UserHistoryRecord } from '@root/models'
import { createSuccessResponse, ERROR_RESPONSE, Log } from '@root/shared'
import Elysia from 'elysia'
import { nanoid } from 'nanoid'

export const UserHistoryService = new Elysia({ prefix: '/:userID/histories/:type' })
    .use(UserModel)
    .use(verifyPluginReference)
    .use(checkUserAvailablePlugin())

// 创建历史记录
UserHistoryService.post(
    '/',
    async ({ params: { type }, body, store: { user } }) => {
        try {
            const newHistoryRecord: UserHistoryRecord = {
                ...body,
                id: nanoid(),
                timeStamp: Date.now(),
            }
            user.histories[type].push(newHistoryRecord)
            await user.save()
            return createSuccessResponse(200, '创建成功', newHistoryRecord)
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

// 获取历史记录 (数组)
UserHistoryService.get(
    '/',
    async ({ params: { type }, store: { user }, query: { page, pageSize } }) => {
        try {
            const historyRefs = user.histories[type].map((i) => i.ref)
            const historyRecords = user.histories[type]
            const histories = await DB_JLPT_ModelMap[type]
                .find({
                    _id: { $in: historyRefs },
                })
                .skip((page - 1) * pageSize)
                .limit(0)

            return createSuccessResponse(200, '获取成功', {
                items: histories.map((h) => h.toJSON()),
                records: historyRecords,
                page,
                pageSize,
                total: historyRefs.length,
            })
        } catch (error) {
            Log.error(error)
            return ERROR_RESPONSE.SYSTEM.INTERNAL_ERROR
        }
    },
    {
        params: 'histories.get.params',
        query: 'histories.get.query',
    }
)

// 删除历史记录
UserHistoryService.delete(
    '/:historyID',
    async ({ params: { type, historyID }, store: { user } }) => {
        try {
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
