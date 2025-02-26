import { JLPT_Read } from '@root/models'
import { Schema } from 'mongoose'
import { DB_UserInfoSchema } from '../common'

export const DB_JLPT_ReadSchema = new Schema<JLPT_Read>(
    {
        time: { type: String, required: true },
        star: { type: Number, required: true },
        user: DB_UserInfoSchema,
        difficulty: { type: String, enum: ['N1', 'N2', 'N3', 'N4', 'N5'] },
        article: {
            title: { type: String, required: true },
            contents: [{ type: String, required: true }],
        },
        vocabList: [
            {
                word: { type: String, required: true },
                definition: { type: String, required: true },
            },
        ],
        structure: {
            paragraph_focus: [{ type: String, required: true }],
        },
        questions: [
            {
                number: { type: Number, required: true },
                answer: { type: Number, required: true },
                type: { type: String, required: true },
                question: { type: String, required: true },
                options: [{ type: String, required: true }],
                analysis: { type: String, required: true },
            },
        ],
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
