import { verifyCommonUserPlugin } from '@/plugins'
import Elysia from 'elysia'
import { JLPT_ReadService } from './read'

export const JLPT_Service = new Elysia({ prefix: '/jlpt' })
    .use(verifyCommonUserPlugin)
    .use(JLPT_ReadService)
