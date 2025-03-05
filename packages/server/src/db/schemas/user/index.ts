import { User } from '@root/models/user'
import { model, Schema } from 'mongoose'
import { DB_UserConfigSchema } from './config'
import { DB_JLPTPracticeMapSchema } from '../common/jlpt'

export * from './config'

export const DB_UserSchema = new Schema<User>(
    {
        name: { type: String, required: true },
        avatar: { type: String, required: true },
        account: { type: String, required: true },
        password: { type: String, required: true },
        config: DB_UserConfigSchema,
        histories: DB_JLPTPracticeMapSchema,
        favorites: DB_JLPTPracticeMapSchema,
        publishes: DB_JLPTPracticeMapSchema,
    },
    {
        versionKey: false,
        toJSON: {
            transform(_, ret) {
                ret.id = ret._id
                delete ret._id
                delete ret.password
            },
        },
        toObject: {
            transform(_, ret) {
                ret.id = ret._id
                delete ret._id
                delete ret.password
            },
        },
    }
)

export const DB_UserModel = model('user', DB_UserSchema, 'users')
