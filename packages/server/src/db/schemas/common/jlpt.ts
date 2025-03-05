import { JLPT_PracticeMap } from '@root/models'
import { Schema } from 'mongoose'

export const DB_JLPT_PracticeRefMapSchema = new Schema<JLPT_PracticeMap>(
    {
        reads: [
            {
                type: Schema.Types.ObjectId,
                ref: 'read',
            },
        ],
    },
    {
        _id: false,
    }
)

export const DB_JLPT_ReadBaseSchema = new Schema(
    {
        timeStamp: { type: Number, required: true },
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
            paragraphFocus: [{ type: String, required: true }],
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
