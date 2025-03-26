import type { JLPT_PracticeMap } from '../jlpt'
import type { UserHistory } from './history'

export interface LLM_CreateParams extends Omit<LLM_Config, 'id'> {
    local: boolean
}
export interface ClientLLM_Config extends LLM_Config {
    local: boolean
}
export interface LLM_Config {
    id: string
    name: string
    apiKey: string
    baseURL: string
    modelID: string
}

export interface UserConfig {
    llm: {
        items: LLM_Config[]
        default: string
    }
}

export interface User {
    id: string
    name: string
    avatar: string
    account: string
    password: string
    histories: UserHistory
    favorites: JLPT_PracticeMap
    publishes: JLPT_PracticeMap
    config: UserConfig
}

export interface UserInfo extends Pick<User, 'id' | 'account' | 'name' | 'avatar'> {}

export interface UserCreateParams extends Pick<User, 'account' | 'name' | 'password'> {}
export interface UserQueryParams extends Pick<User, 'account' | 'name' | 'id'> {}
export interface UserUpdateParams extends Pick<User, 'name' | 'avatar' | 'config'> {}

export * from './history'
