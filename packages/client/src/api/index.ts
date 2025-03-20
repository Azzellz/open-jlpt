import axios from 'axios'
import * as User from './user'
import * as Auth from './auth'
import * as TTS from './tts'
import * as JLPT from './jlpt'

export const API_INSTANCE = axios.create({
    baseURL: 'http://192.168.1.3:3000',
})

// type ResponseInterceptor = (error: any) => AxiosResponse | Promise<any>

// type RequestInterceptor = (
//     value: InternalAxiosRequestConfig<any>,
// ) => InternalAxiosRequestConfig<any> | Promise<InternalAxiosRequestConfig<any>>

export const API = {
    User,
    Auth,
    TTS,
    JLPT,
}

export default API
