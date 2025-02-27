import { User } from '@root/models/user'
import { model, Schema } from 'mongoose'
import { DB_UserConfigSchema } from './config'

export * from './config'

export const DB_UserSchema = new Schema<User>(
    {
        name: { type: String, required: true },
        avatar: { type: String, required: true },
        account: { type: String, required: true },
        password: { type: String, required: true },
        config: DB_UserConfigSchema,
        histories: {
            reads: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'read',
                },
            ],
        },
        favorites: {
            reads: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'read',
                },
            ],
        },
        publishes: {
            reads: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'read',
                },
            ],
        },
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

export const DB_UserModel = model('user', DB_UserSchema, 'users')
