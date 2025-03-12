import { JLPT_Read } from '@root/models'
import { model, Schema, Document } from 'mongoose'
import { DB_JLPT_ReadBaseSchema } from '../common/jlpt'

interface JLPT_ReadDocument extends Omit<JLPT_Read, 'id' | 'user'>, Document {
    user: JLPT_Read['user']
    visible: boolean
}

export const DB_JLPT_ReadSchema = new Schema<JLPT_ReadDocument>(
    {
        star: { type: Number, required: true },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        visible: {
            type: Boolean,
            required: true,
        },
        ...DB_JLPT_ReadBaseSchema.obj,
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

// 查询,创建 自动填充用户
DB_JLPT_ReadSchema.pre<JLPT_ReadDocument>(/^find|save/, function (next) {
    this.populate({
        path: 'user',
        select: 'name avatar account -_id',
    })
    next()
})

export const DB_JLPT_ReadModel = model<JLPT_ReadDocument>('read', DB_JLPT_ReadSchema, 'reads')
