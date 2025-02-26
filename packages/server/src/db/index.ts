import { Log } from '@root/shared'
import { connect } from 'mongoose'
import { createClient } from 'redis'

export const RedisClient = await createClient({ url: 'redis://localhost:6379' })
    .on('error', (err) => Log.error('Redis连接失败: ' + err))
    .connect()
Log.success('Redis连接成功')

try {
    await connect('mongodb://localhost:27017/open-jlpt')
    Log.success('Mongodb数据库连接成功')
} catch (error) {
    Log.error('Mongodb数据库连接失败: ' + error)
}

export * from './schemas'
