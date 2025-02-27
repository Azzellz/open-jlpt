import { DB_JLPT_ReadModel } from '@/db'
import { checkObjectIdPlugin, verifyPluginReference } from '@/plugins'
import { createSuccessResponse, ERROR_RESPONSE, Log } from '@root/shared'
import Elysia, { t } from 'elysia'
import { isValidObjectId } from 'mongoose'

export const JLPT_ReadService = new Elysia({
    prefix: '/reads',
})
    .use(verifyPluginReference)
    .use(checkObjectIdPlugin)

//#region 查询

const keywords = ['article.title', 'article.contents', 'vocabList.word']
JLPT_ReadService.get(
    '/',
    async ({ query }) => {
        const filter: Record<string, any> = {
            $or: [],
        }
        Object.entries(query || {}).forEach(([key, value]) => {
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
            const reads = await DB_JLPT_ReadModel.find(filter).populate(
                'user',
                '_id name avatar account'
            )
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
        query: t.Object({
            id: t.Optional(t.String()),
            'user.name': t.Optional(t.String()),
            'user.account': t.Optional(t.String()),
            orderBy: t.Optional(t.Union([t.Literal('star-asc'), t.Literal('star-desc')])),
            keyword: t.Optional(t.String()),
            difficulty: t.Optional(
                t.Union([
                    t.Literal('N1'),
                    t.Literal('N2'),
                    t.Literal('N3'),
                    t.Literal('N4'),
                    t.Literal('N5'),
                ])
            ),
        }),
    }
)

JLPT_ReadService.get('/:id', async ({ params: { id } }) => {
    try {
        const read = await DB_JLPT_ReadModel.findById(id).populate(
            'user',
            '_id name avatar account'
        )
        if (!read) {
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
            const newRead = await (
                await DB_JLPT_ReadModel.create({
                    ...body,
                    star: 0,
                    user: id,
                    timeStamp: Date.now(),
                })
            ).populate('user', '_id name avatar account')
            return createSuccessResponse(200, '创建成功', newRead.toJSON())
        } catch (error) {
            Log.error(error)
            return ERROR_RESPONSE.SYSTEM.INTERNAL_ERROR
        }
    },
    {
        body: t.Object({
            difficulty: t.Union([
                t.Literal('N1'),
                t.Literal('N2'),
                t.Literal('N3'),
                t.Literal('N4'),
                t.Literal('N5'),
            ]),
            article: t.Object({
                title: t.String(),
                contents: t.Array(t.String()),
            }),
            vocabList: t.Array(
                t.Object({
                    word: t.String(),
                    definition: t.String(),
                })
            ),
            structure: t.Object({
                paragraphFocus: t.Array(t.String()),
            }),
            questions: t.Array(
                t.Object({
                    number: t.Number(),
                    answer: t.Number(),
                    type: t.String(),
                    question: t.String(),
                    options: t.Array(t.String()),
                    analysis: t.String(),
                })
            ),
        }),
    }
)

//#endregion

//#region 删除

JLPT_ReadService.delete(
    '/:id',
    async ({
        params: { id },
        store: {
            user: { id: userID },
        },
    }) => {
        try {
            const targetRead = await DB_JLPT_ReadModel.findById(id).populate('user', '_id')
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
