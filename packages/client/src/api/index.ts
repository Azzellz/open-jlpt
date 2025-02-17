import axios from 'axios'
import * as AI from './ai'

export const API_INSTANCE = axios.create({
    baseURL: 'http://localhost:3000',
})

export const API = {
    AI,
}

export default API
