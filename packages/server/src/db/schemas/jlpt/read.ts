import { JLPT_Read } from '@root/models'
import { model, Schema } from 'mongoose'

export const DB_JLPT_ReadSchema = new Schema<JLPT_Read>(
    {
        timeStamp: { type: Number, required: true },
        star: { type: Number, required: true },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
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

export const DB_JLPT_ReadModel = model('read', DB_JLPT_ReadSchema, 'reads')
