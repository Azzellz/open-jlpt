import Elysia from 'elysia'
import { JLPT_ModelReadCreateBody, JLPT_ModelReadQuery } from './read'

export const JLPT_Model = new Elysia().model({
    'reads.create.body': JLPT_ModelReadCreateBody,
    'reads.get.query': JLPT_ModelReadQuery,
})
