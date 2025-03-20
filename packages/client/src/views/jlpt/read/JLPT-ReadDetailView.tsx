import API from '@/api'
import AppLoader from '@/components/app/loader/AppLoader'
import JLPTReadBody from '@/components/jlpt/read/JLPT-ReadBody'
import type { JLPT_Read } from '@root/models'
import { isSuccessResponse } from '@root/shared'
import { useMessage } from 'naive-ui'
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent(() => {
    const route = useRoute()
    const message = useMessage()

    const read = ref<JLPT_Read | null>(null)
    async function getRead(readID: string) {
        read.value = null
        const result = await API.JLPT.Read.getRead(readID)
        if (isSuccessResponse(result)) {
            read.value = result.data
        } else {
            message.error('获取失败')
            console.error(result)
        }
    }
    onMounted(async () => {
        const readID = route.params['id'] as string
        await getRead(readID)
    })
    watch(() => route.params['id'] as string, getRead)

    return () =>
        read.value ? (
            <JLPTReadBody originRead={read.value} read={read.value} />
        ) : (
            <div class="h-full flex">
                <AppLoader class="m-auto" />
            </div>
        )
})
