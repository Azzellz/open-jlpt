import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import * as LLM from './llm'
import * as Config from './config'
import * as User from './user'
import * as Auth from './auth'

export const API_INSTANCE = axios.create({
    baseURL: 'http://localhost:3000',
})

// type ResponseInterceptor = (error: any) => AxiosResponse | Promise<any>

// type RequestInterceptor = (
//     value: InternalAxiosRequestConfig<any>,
// ) => InternalAxiosRequestConfig<any> | Promise<InternalAxiosRequestConfig<any>>

export const API = {
    LLM,
    Config,
    User,
    Auth,
}

export default API
