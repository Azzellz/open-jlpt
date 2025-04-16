import { AUTH_CONSTANTS } from '@/constants/auth'
import { JwtPayload } from '@/plugins'
import { nanoid } from 'nanoid'

type Params = Omit<JwtPayload, '_random' | 'expiresAt'>

/**
 * 生成刷新令牌的 payload
 * @param params
 */
export function generateRefreshTokenPayload(params: Params) {
    return {
        ...params,
        _random: nanoid(),
        expiresAt: Date.now() + AUTH_CONSTANTS.JWT.EXPIRES_AT.REFRESH,
    }
}

/**
 * 生成访问令牌的 payload
 * @param params
 */
export function generateAccessTokenPayload(params: Params) {
    return {
        ...params,
        _random: nanoid(),
        expiresAt: Date.now() + AUTH_CONSTANTS.JWT.EXPIRES_AT.ACCESS,
    }
}
