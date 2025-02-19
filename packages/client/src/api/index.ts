import axios from 'axios'
import * as LLM from './llm'
import * as Config from './config'

export const API_INSTANCE = axios.create({
    baseURL: 'http://localhost:3000',
})

export const API = {
    LLM,
    Config,
}

export default API
