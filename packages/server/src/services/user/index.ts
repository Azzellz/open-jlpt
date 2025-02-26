import { DB_UserModel } from '@/db'
import { createErrorResponse, createSuccessResponse } from '@root/shared'
import Elysia, { t } from 'elysia'
import { isValidObjectId } from 'mongoose'
import bcrypt from 'bcryptjs'
import { omit } from 'radash'
import { verifyCommonUserPlugin } from '@/plugins'

export const UserService = new Elysia({ prefix: '/users' })

// 需要认证的部分
const VerifyUserService = new Elysia().use(verifyCommonUserPlugin)

//#region 查询用户

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
            return createSuccessResponse(200, 'OK', users)
        } catch (error) {
            return createErrorResponse(500, error)
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
    async ({ body }) => {
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

            // 这里要排除密码再返回
            return createSuccessResponse(200, 'OK', omit(newUser.toJSON(), ['password']))
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
