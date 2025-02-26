import { User } from '../user'

export interface AuthParams {
    account: string
    password: string
}

export interface AuthVoucher {
    user: Omit<User, 'password'>
    accessToken: string
    refreshToken: string
}
