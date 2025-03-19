import API from '@/api'
import StarIcon from '@/components/icon/StarIcon'
import JLPT_ReadCard from '@/components/jlpt/read/JLPT_ReadCard'
import type { JLPT_Read, JLPT_ReadQueryParams } from '@root/models'
import { isSuccessResponse } from '@root/shared'
import { useDebounceFn } from '@vueuse/core'
import { useMessage, NButton, NDivider, NInput, NIcon } from 'naive-ui'
import { defineComponent, onMounted, ref } from 'vue'
import { FlashOutline } from '@vicons/ionicons5'
import router from '@/router'

export default defineComponent(() => {
    const reads = ref<JLPT_Read[]>([])
    const message = useMessage()
    const params = ref<JLPT_ReadQueryParams>({
        page: 1,
        pageSize: 10,
        keyword: '',
    })
    async function getReads(_params: JLPT_ReadQueryParams = params.value) {
        const result = await API.JLPT.Read.getReads(_params)
        if (isSuccessResponse(result)) {
            reads.value = result.data
        } else {
            message.error('获取阅读失败')
            console.error(result)
        }
    }
    onMounted(() => {
        getReads()
    })

    // 搜索
    const isSearching = ref(false)
    const handleSearch = useDebounceFn(getReads)
    async function handleUpdateKeyword(newValue: string) {
        params.value.keyword = newValue
        isSearching.value = true
        await handleSearch()
        isSearching.value = false
    }

    // 跳转详情页

    return () => (
        <div class="h-full py-10 px-15% flex-y">
            <div class="flex-x justify-center">
                <NInput
                    class="max-w-100"
                    placeholder="搜索"
                    clearable
                    loading={isSearching.value}
                    value={params.value.keyword}
                    onUpdateValue={handleUpdateKeyword}
                    v-slots={{
                        prefix: () => <NIcon component={FlashOutline} />,
                    }}
                />
            </div>
            <NDivider></NDivider>
            <div class="flex-x gap-2 flex-wrap">
                {reads.value.map((read) => {
                    return (
                        <JLPT_ReadCard
                            read={read}
                            onClick={() =>
                                router.push({
                                    path: `/jlpt/read/detail/${read.id}`,
                                    query: {
                                        title: read.article.title,
                                    },
                                })
                            }
                            headerExtra={() => (
                                <div class="flex-x gap-1 items-center">
                                    <span class="text-4.5 text-gray mt-0.5">{read.star}</span>
                                    <NButton
                                        quaternary
                                        circle
                                        type="warning"
                                        renderIcon={() => <StarIcon size={22} />}
                                    />
                                </div>
                            )}
                        />
                    )
                })}
            </div>
        </div>
    )
})
