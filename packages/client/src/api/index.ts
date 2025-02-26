import axios from 'axios'
import * as LLM from './llm'
import * as Config from './config'
import * as User from './user'
import * as Auth from './auth'

export const API_INSTANCE = axios.create({
    baseURL: 'http://localhost:3000',
})

export const API = {
    LLM,
    Config,
    User,
    Auth,
}

export default API
