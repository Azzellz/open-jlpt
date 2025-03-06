import axios from 'axios'
import * as User from './user'
import * as Auth from './auth'
import * as TTS from './tts'

export const API_INSTANCE = axios.create({
    baseURL: 'http://localhost:3000',
})

// type ResponseInterceptor = (error: any) => AxiosResponse | Promise<any>

// type RequestInterceptor = (
//     value: InternalAxiosRequestConfig<any>,
// ) => InternalAxiosRequestConfig<any> | Promise<InternalAxiosRequestConfig<any>>

export const API = {
    User,
    Auth,
    TTS,
}

export default API
