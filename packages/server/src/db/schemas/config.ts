import { OpenJLPT_AI, OpenJLPT_Config } from '@root/models'
import { Schema } from 'mongoose'

const DB_AI_Schema = new Schema<OpenJLPT_AI>(
    {
        name: { type: String, required: true },
        apiKey: { type: String, required: true },
        baseURL: { type: String, required: true },
        modelID: { type: String, required: true },
    },
    {
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

export const DB_ConfigSchema = new Schema<OpenJLPT_Config>(
    {
        ai: [DB_AI_Schema],
    },
    {
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
