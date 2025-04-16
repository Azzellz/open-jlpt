import { User } from '@root/models/user'

export function createTemplateUser(
    basicInfo: Pick<User, 'name' | 'password' | 'account'>
): Omit<User, 'id'> {
    return {
        ...basicInfo,
        avatar: 'default',
        histories: { reads: [] },
        favorites: { reads: [] },
        publishes: { reads: [] },
        config: {
            llm: {
                items: [],
                default: '',
            },
        },
    }
}
