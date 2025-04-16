import { COMMON_CONSTANTS } from './common'

export const AUTH_CONSTANTS = {
    JWT: {
        EXPIRES_AT: {
            ACCESS: COMMON_CONSTANTS.TIME.HOUR * 2,
            REFRESH: COMMON_CONSTANTS.TIME.DAY * 7,
        },
    },
}
