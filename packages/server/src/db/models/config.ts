import { model } from 'mongoose'
import { DB_ConfigSchema } from '../schemas'

export const DB_ConfigModel =  model('config-model', DB_ConfigSchema, 'config')
