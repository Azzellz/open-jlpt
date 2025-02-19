import { Log } from '@root/shared'
import { connect } from 'mongoose'

try {
    await connect(process.env['DB_URI'] || '')
    Log.success('数据库连接成功')
} catch (error) {
    Log.error('数据库连接失败: ' + error)
}

export * from './models'
export * from './schemas'
