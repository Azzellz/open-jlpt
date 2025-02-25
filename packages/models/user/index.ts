import type { JLPT_PracticeMap, JLPT_ReadOrigin } from '../jlpt'

export interface UserHistory {
    read: JLPT_ReadOrigin[]
}

export interface User {
    id: string
    name: string
    avatar: string
    account: string
    password: string
    // key 是年份，如 2025
    histories: Record<string, UserHistory>
    favorites: JLPT_PracticeMap
    publishes: JLPT_PracticeMap
}

export interface UserInfo extends Pick<User, 'id' | 'account' | 'name' | 'avatar'> {}
