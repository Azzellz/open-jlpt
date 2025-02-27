import { ERROR_RESPONSE } from '@root/shared'
import Elysia, { t } from 'elysia'
import { isValidObjectId } from 'mongoose'

export const checkObjectIdPlugin = new Elysia()
    .onBeforeHandle(({ params }) => {
        if ((params as any).id && !isValidObjectId((params as any).id)) {
            return ERROR_RESPONSE.SYSTEM.INVALID_OBJECTID
        }
    })
    .as('plugin')
