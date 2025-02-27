import type { User } from '../user'

export interface AuthParams {
    account: string
    password: string
}

export interface AuthVoucher {
    user: Omit<User, 'password'>
    token: string
}
