import { DB_JLPT_ReadModel } from '@/db'
import { JLPT_Model } from '@/models'
import { verifyPluginReference } from '@/plugins'
import { createSuccessResponse, ERROR_RESPONSE, Log } from '@root/shared'
import Elysia, { t } from 'elysia'
import { isValidObjectId } from 'mongoose'

export const JLPT_ReadService = new Elysia({
    prefix: '/reads',
})
    .use(verifyPluginReference)
    .use(JLPT_Model)

//#region 查询

// 查询多个阅读（数组）
const keywords = ['article.title', 'article.contents', 'vocabList.word']
const excludeKeys = ['page', 'pageSize']
JLPT_ReadService.get(
    '/',
    async ({ query }) => {
        const filter: Record<string, any> = {
            $or: [],
            visible: true, // 这里根据是否是管理员来获取可见或者不可见
        }
        Object.entries(query || {}).forEach(([key, value]) => {
            if (excludeKeys.includes(key)) {
                return
            }
            if (key === 'id' && isValidObjectId(value)) {
                filter['_id'] = value
            } else if (value) {
                const item = {
                    $regex: value,
                    $options: 'i', // 可选：不区分大小写
                }
                // 模糊搜索
                if (key === 'keyword') {
                    keywords.forEach((k) => {
                        filter['$or'].push({
                            [k]: item,
                        })
                    })
                } else {
                    filter[key] = item
                }
            }
        })
        try {
            const { page, pageSize } = query
            const reads = await DB_JLPT_ReadModel.find(filter)
                .skip((page - 1) * pageSize)
                .limit(pageSize)
            return createSuccessResponse(
                200,
                '查询成功',
                reads.map((r) => r.toJSON())
            )
        } catch (error) {
            Log.error(error)
            return ERROR_RESPONSE.SYSTEM.INTERNAL_ERROR
        }
    },
    {
        query: 'reads.get.query',
    }
)

// 查询单个阅读
JLPT_ReadService.get('/:readID', async ({ params: { readID } }) => {
    try {
        const read = await DB_JLPT_ReadModel.findById(readID)
        if (!read || !read.visible) {
            return ERROR_RESPONSE.SYSTEM.NOT_FOUND
        } else {
            return createSuccessResponse(200, '查询成功', read.toJSON())
        }
    } catch (error) {
        Log.error(error)
        return ERROR_RESPONSE.SYSTEM.INTERNAL_ERROR
    }
})

//#endregion

//#region 创建

JLPT_ReadService.post(
    '/',
    async ({
        body,
        store: {
            user: { id },
        },
    }) => {
        try {
            const newRead = await DB_JLPT_ReadModel.create({
                ...body,
                star: 0,
                user: id,
                timeStamp: Date.now(),
                visible: false,
            })

            return createSuccessResponse(200, '创建成功', newRead.toJSON())
        } catch (error) {
            Log.error(error)
            return ERROR_RESPONSE.SYSTEM.INTERNAL_ERROR
        }
    },
    {
        body: 'reads.create.body',
    }
)

//#endregion

//#region 删除

JLPT_ReadService.delete(
    '/:readID',
    async ({
        params: { readID },
        store: {
            user: { id: userID },
        },
    }) => {
        try {
            const targetRead = await DB_JLPT_ReadModel.findById(readID)
            if (!targetRead) {
                return ERROR_RESPONSE.SYSTEM.NOT_FOUND
            }
            if (targetRead.user.id !== userID) {
                return ERROR_RESPONSE.SYSTEM.NOT_PERMISSIONS
            }
            const result = await targetRead.deleteOne()
            return createSuccessResponse(200, '删除成功', null)
        } catch (error) {
            Log.error(error)
            return ERROR_RESPONSE.SYSTEM.INTERNAL_ERROR
        }
    }
)

//#endregion

//#region 更新

JLPT_ReadService.patch(
    '/:readID/visible',
    async ({
        params: { readID },
        store: {
            user: { id: userID },
        },
        body,
    }) => {
        try {
            const targetRead = await DB_JLPT_ReadModel.findById(readID)
            if (!targetRead) {
                return ERROR_RESPONSE.SYSTEM.NOT_FOUND
            }
            if (targetRead.user.id !== userID) {
                return ERROR_RESPONSE.SYSTEM.NOT_PERMISSIONS
            }
            const result = await targetRead.updateOne(body)
            return createSuccessResponse(200, '更新成功', null)
        } catch (error) {
            Log.error(error)
            return ERROR_RESPONSE.SYSTEM.INTERNAL_ERROR
        }
    },
    {
        body: t.Object({
            visible: t.Boolean(),
        }),
    }
)

//#endregion
