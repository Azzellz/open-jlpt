import { DB_ConfigModel } from '@/db'
import { createErrorResponse, createSuccessResponse } from '@root/shared'
import Elysia, { t } from 'elysia'

export const ConfigService = new Elysia({ prefix: 'config' })

// 初始化配置
ConfigService.post('/init', async () => {
    const config = await DB_ConfigModel.findOne()
    if (!config) {
        const newConfig = await DB_ConfigModel.create({
            ai: [],
        })
        return createSuccessResponse(200, '配置初始化成功', newConfig.toJSON())
    } else {
        return createSuccessResponse(200, '配置已经初始化过了', config.toJSON())
    }
})

// 获取配置
ConfigService.get('/', async () => {
    const config = await DB_ConfigModel.findOne()
    if (!config?.toJSON()) {
        return createErrorResponse(400, '未初始化配置')
    } else {
        return createSuccessResponse(200, '获取配置成功', config.toJSON())
    }
})

// 添加 AI 配置
ConfigService.post(
    '/ai',
    async ({ body }) => {
        const config = await DB_ConfigModel.findOne()
        if (!config?.toJSON()) {
            return createErrorResponse(400, '未初始化配置')
        }

        const same = config.ai.find((item) => item.name === body.name)
        if (same) {
            return createErrorResponse(400, '已经存在相同的 AI 配置项')
        }

        config.ai.push(body)
        await config.save()
        return createSuccessResponse(200, '创建 AI 配置项成功', config.toJSON())
    },
    {
        body: t.Object({
            name: t.String(),
            apiKey: t.String(),
            baseURL: t.String(),
            modelID: t.String(),
        }),
    }
)
