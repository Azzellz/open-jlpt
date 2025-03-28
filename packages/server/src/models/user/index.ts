import Elysia from 'elysia'
import {
    UserHistoryCreateBody,
    UserHistoryCreateParams,
    UserHistoryDeleteParams,
    UserHistoryGetParams,
    UserHistoryGetQuery,
} from './history'
import { UserModelLLMChatBody } from './llm'

export const UserModel = new Elysia().model({
    'histories.create.body': UserHistoryCreateBody,
    'histories.get.params': UserHistoryGetParams,
    'histories.get.query': UserHistoryGetQuery,
    'histories.create.params': UserHistoryCreateParams,
    'histories.delete.params': UserHistoryDeleteParams,
    'llms.chat.body': UserModelLLMChatBody,
})
