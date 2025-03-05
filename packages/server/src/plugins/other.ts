import { ERROR_RESPONSE } from '@root/shared'
import Elysia, { t } from 'elysia'
import { isValidObjectId } from 'mongoose'

export const checkObjectIdPlugin = (key: string) => {
    return new Elysia()
        .onBeforeHandle(({ params }) => {
            if ((params as any)[key] && !isValidObjectId((params as any)[key])) {
                return ERROR_RESPONSE.SYSTEM.INVALID_OBJECTID
            }
        })
        .as('plugin')
}
