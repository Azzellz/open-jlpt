import Elysia from 'elysia'
import { JLPT_ModelReadCreateBody } from './read'

export const JLPT_Model = new Elysia().model({
    'reads.create.body': JLPT_ModelReadCreateBody,
})
