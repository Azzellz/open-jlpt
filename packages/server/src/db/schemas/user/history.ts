import { Schema } from 'mongoose'

export const DB_UserHistorySchema = new Schema(
    {
        reads: [
            {
                id: { type: String, required: true },
                answers: [{ type: Number }],
                timeStamp: { type: Number, required: true },
                ref: {
                    type: Schema.Types.ObjectId,
                    ref: 'read',
                },
            },
        ],
    },
    {
        _id: false,
        versionKey: false,
    }
)
