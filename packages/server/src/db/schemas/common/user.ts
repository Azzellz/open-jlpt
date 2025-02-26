import { UserInfo } from '@root/models'
import { Schema } from 'mongoose'

export const DB_UserInfoSchema = new Schema<UserInfo>(
    {
        name: { type: String, required: true },
        avatar: { type: String, required: true },
        account: { type: String, required: true },
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
