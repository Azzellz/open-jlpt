import { ERROR_RESPONSE } from '@root/shared'
import Elysia from 'elysia'
import { isValidObjectId } from 'mongoose'

export function checkObjectIdPlugin<T extends string>(key: T, from: 'params' = 'params') {
    return new Elysia()
        .state(key, '')
        .onBeforeHandle((context) => {
            const target = context[from] as Record<string, any>
            const value = target[key]
            if (value && !isValidObjectId(value)) {
                return ERROR_RESPONSE.SYSTEM.INVALID_OBJECTID
            } else {
                ;(context.store as any)[key] = value
            }
        })
        .as('plugin')
}
