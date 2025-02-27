import { DB_UserModel, RedisClient } from '@/db'
import { createErrorResponse, createSuccessResponse, ERROR_RESPONSE, Log } from '@root/shared'
import Elysia, { t } from 'elysia'
import { isValidObjectId } from 'mongoose'
import bcrypt from 'bcryptjs'
import { omit, pick } from 'radash'
import { accessJwtPlugin, refreshJwtPlugin, verifyCommonUserPlugin } from '@/plugins'
import { nanoid } from 'nanoid'

export const UserService = new Elysia({ prefix: '/users' })
    .use(accessJwtPlugin)
    .use(refreshJwtPlugin)

// 需要认证的部分
const VerifyUserService = new Elysia().use(verifyCommonUserPlugin)

//#region 查询用户

VerifyUserService.get('/self', async ({ store: { user } }) => {
    try {
        const result = await DB_UserModel.findById(user.id)
        if (result) {
            return createSuccessResponse(200, '查询用户成功', omit(result.toJSON(), ['password']))
        } else {
            return createErrorResponse(404, '未查询到用户')
        }
    } catch (error) {
        Log.error(error)
        return ERROR_RESPONSE.COMMON.INTERNAL_ERROR
    }
})

VerifyUserService.get(
    '/',
    async ({ query }) => {
        try {
            const filter: Record<string, any> = {}
            Object.entries(query || {}).forEach(([key, value]) => {
                if (key === 'id' && isValidObjectId(value)) {
                    filter['_id'] = value
                } else if (value) {
                    // 模糊搜索
                    filter[key] = {
                        $regex: value,
                        $options: 'i', // 可选：不区分大小写
                    }
                }
            })
            const users = await DB_UserModel.find(filter)
            return createSuccessResponse(
                200,
                'OK',
                users.map((user) => omit(user.toJSON(), ['password', 'config'])) // 要隐藏一些隐私数据
            )
        } catch (error) {
            Log.error(error)
            return ERROR_RESPONSE.COMMON.INTERNAL_ERROR
        }
    },
    {
        query: t.Object({
            id: t.Optional(t.String()),
            name: t.Optional(t.String()),
            account: t.Optional(t.String()),
        }),
    }
)

//#endregion

//#region 注册

UserService.post(
    '/',
    async ({ body, accessJwt, refreshJwt }) => {
        try {
            // 检查是否有重复用户
            if (await DB_UserModel.findOne({ name: body.name })) {
                return createErrorResponse(409, '存在重复用户名')
            }

            // 对密码加密
            const salt = await bcrypt.genSalt(10)
            body.password = await bcrypt.hash(body.password, salt)

            // 创建新用户
            const newUser = await DB_UserModel.create({
                ...body,
                avatar: 'default',
                histories: { reads: [] },
                favorites: { reads: [] },
                publishes: { reads: [] },
                config: {
                    llms: [],
                },
            })

            const userJson = omit(newUser.toJSON(), ['password'])
            const userPayload = pick(userJson, ['id', 'name', 'account'])

            // 生成访问令牌
            const accessToken = await accessJwt.sign({
                ...userPayload,
                _random: nanoid(),
            })

            // 记录 refreshToken(刷新令牌) 到 Redis，7天过期
            const refreshToken = await refreshJwt.sign({ ...userPayload, _random: nanoid() })
            RedisClient.setEx(`sessions:${userJson.id}`, 3600 * 24 * 7, refreshToken)

            return createSuccessResponse(200, '注册成功', {
                user: userJson,
                token: accessToken,
            })
        } catch (error) {
            return createErrorResponse(500, error)
        }
    },
    {
        body: t.Object({
            name: t.String(),
            account: t.String(),
            password: t.String(),
        }),
    }
)

//#endregion

// 合并认证部分
UserService.use(VerifyUserService)
