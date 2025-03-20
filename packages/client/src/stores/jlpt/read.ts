import type { JLPT_Read } from '@root/models'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useJLPTReadStore = defineStore('jlpt-read-store', () => {
    const reads = ref<JLPT_Read[]>([])
    const historyRecords = ref<JLPT_Read[]>([])
    function createHistoryRecord(read: JLPT_Read) {
        // 如果存在旧的记录，则将旧的记录移到第一位
        const old = historyRecords.value.find((r) => r.id === read.id)
        if (old) {
            historyRecords.value = [old, ...historyRecords.value.filter((r) => r.id !== read.id)]
        } else {
            historyRecords.value.push(read)
        }
    }
    return {
        reads,
        historyRecords,
        createHistoryRecord,
    }
})
