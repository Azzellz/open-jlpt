import { isValidObjectId } from 'mongoose'

export function createDBQueryFilter(query: Record<string, any>) {
    const filter: Record<string, any> = {}
    Object.entries(query || {}).forEach(([key, value]) => {
        if (key === 'id' && isValidObjectId(value)) {
            filter['_id'] = value
        } else if (value) {
            // 模糊搜索
            filter[key] = {
                $regex: value,
                $options: 'i', // 可选：不区分大小写
            }
        }
    })
    return filter
}
