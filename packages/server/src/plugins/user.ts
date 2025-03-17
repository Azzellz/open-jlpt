import { ERROR_RESPONSE } from '@root/shared'
import Elysia from 'elysia'
import { checkObjectIdPlugin } from './other'
import { DB_UserModel } from '@/db'
import { User } from '@root/models'
import { Document } from 'mongoose'

export function checkUserAvailablePlugin() {
    return new Elysia()
        .use(checkObjectIdPlugin('userID'))
        .state('user', {} as Omit<User, 'password'> & Document)
        .onBeforeHandle(async ({ store }) => {
            const user = await DB_UserModel.findById(store.userID)
            if (!user) {
                return ERROR_RESPONSE.USER.NOT_FOUND
            } else {
                store.user = user
            }
        })
        .as('plugin')
}
