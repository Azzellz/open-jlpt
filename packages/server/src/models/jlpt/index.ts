import Elysia from 'elysia'
import { JLPT_ReadCreateParamsBody } from './read'

export const JLPT_Model = new Elysia().model({
    'read.create': JLPT_ReadCreateParamsBody,
})
