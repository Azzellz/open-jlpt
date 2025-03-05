import { JLPT_PracticeMap } from '@root/models'
import { Schema } from 'mongoose'

export const DB_JLPTPracticeMapSchema = new Schema<JLPT_PracticeMap>(
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
