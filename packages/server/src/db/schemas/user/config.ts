import { UserConfig } from '@root/models'
import { Schema, model } from 'mongoose'

const DB_LLM_Schema = new Schema<UserConfig['llm']>(
    {
        items: [
            {
                id: { type: String, required: true },
                name: { type: String, required: true },
                apiKey: { type: String, required: true },
                baseURL: { type: String, required: true },
                modelID: { type: String, required: true },
            },
        ],
        default: {
            type: String,
        },
    },
    {
        _id: false,
        versionKey: false,
        toJSON: {
            transform(_, ret) {
                ret.id = ret._id
                delete ret._id
            },
        },
        toObject: {
            transform(_, ret) {
                ret.id = ret._id
                delete ret._id
            },
        },
    }
)

export const DB_UserConfigSchema = new Schema<UserConfig>(
    {
        llm: DB_LLM_Schema,
    },
    {
        _id: false,
        versionKey: false,
    }
)

export const DB_ConfigModel = model('config', DB_UserConfigSchema, 'config')
