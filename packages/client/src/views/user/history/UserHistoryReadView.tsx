import API from '@/api'
import { JLPT_DifficultyTag } from '@/components/jlpt/JLPT-DiffucultyTag'
import { useUserStore } from '@/stores/user'
import type { JLPT_Read, PaginationQueryParams, UserHistoryRecord, UserInfo } from '@root/models'
import { isSuccessResponse } from '@root/shared'
import dayjs from 'dayjs'
import { NCard, useMessage, NDivider, NEllipsis, NCollapseTransition, NButton } from 'naive-ui'
import { defineComponent, onMounted, ref } from 'vue'
import ErrorIcon from '@/components/icon/ErrorIcon'
import SuccessIcon from '@/components/icon/SuccessIcon'

function UserHistoryRecordLine({
    record,
    index,
    read,
}: {
    user: UserInfo
    read: JLPT_Read
    record: UserHistoryRecord
    index: number
}) {
    let correct = 0
    let wrong = 0
    read.questions.forEach((question, index) => {
        if (question.answer === record.answers[index]) {
            correct++
        } else {
            wrong++
        }
    })

    return (
        <div class="flex-x gap-2  items-center text-gray">
            <div>{index}</div>
            <NDivider vertical />
            <div>{dayjs(record.timeStamp).format('YYYY/MM/DD - HH:mm:ss')}</div>
            <NDivider vertical />
            <div class="flex-x gap-2 items-center">
                <SuccessIcon size={16} />
                <span>{correct}</span>
                <ErrorIcon class="ml-2" size={16} />
                <span>{wrong}</span>
            </div>
        </div>
    )
}

function UserHistoryReadCard({
    read,
    user,
    records,
}: {
    user: UserInfo
    read: JLPT_Read
    records: UserHistoryRecord[]
}) {
    // 字数统计
    let wordCount = 0
    read.article.contents.forEach((c) => (wordCount += c.length))

    // 答题记录
    const showRecords = ref(false)
    function handleToggleRecords() {
        showRecords.value = !showRecords.value
    }

    // 正确率统计
    let correctCount = 0
    let wrongCount = 0
    records.forEach(({ answers }) => {
        answers.forEach((answer, index) => {
            if (read.questions[index].answer === answer) {
                correctCount++
            } else {
                wrongCount++
            }
        })
    })
    const correctRate = Math.floor((correctCount / (correctCount + wrongCount)) * 100)

    return (
        <NCard class="w-125  shadow-lg">
            <div class="flex-y">
                <div class="flex-y">
                    <div class="flex-x gap-2 items-center">
                        <JLPT_DifficultyTag difficulty={read.difficulty} />
                        <NDivider vertical />
                        <NEllipsis class="text-lg" style="max-width:250px">
                            {read.article.title}
                        </NEllipsis>
                        <div class="ml-auto flex-x gap-2">
                            <NButton size="small" onClick={handleToggleRecords}>
                                {showRecords.value ? '收起' : '展开'}答题记录
                            </NButton>
                            <NButton size="small">详情</NButton>
                        </div>
                    </div>
                    <div class="mt-3 text-sm">
                        <div>{read.article.contents[0]}</div>
                        <div class="mt-2">......... {wordCount} 字</div>
                    </div>
                </div>

                {/* 答题记录 */}
                <NCollapseTransition show={showRecords.value}>
                    <NDivider class="text-sm text-gray">
                        <div class="flex-x gap-2 items-center">
                            <SuccessIcon size={16} />
                            <div>{correctRate}%</div>
                            <ErrorIcon class="ml-2" size={16} />
                            <div>{100 - correctRate}%</div>
                        </div>
                    </NDivider>
                    <div class="flex-y gap-3">
                        {records.map((record, index) => {
                            return (
                                <UserHistoryRecordLine
                                    user={user}
                                    record={record}
                                    index={index + 1}
                                    read={read}
                                />
                            )
                        })}
                    </div>
                </NCollapseTransition>
            </div>
        </NCard>
    )
}

export default defineComponent(() => {
    const userStore = useUserStore()
    const message = useMessage()

    const histories = ref<JLPT_Read[]>([])
    const historyRecords = ref<UserHistoryRecord[]>([])

    const paginationParams = ref<PaginationQueryParams>({
        page: 1,
        pageSize: 10,
    })

    async function getUserHistories() {
        const result = await API.User.getHistories('reads', paginationParams.value)
        if (isSuccessResponse(result)) {
            message.success('获取历史记录成功')
            histories.value = result.data.items
            historyRecords.value = result.data.records
        } else {
            message.error('获取历史记录失败')
            console.error(result)
        }
    }
    onMounted(() => {
        getUserHistories()
    })

    return () => (
        <div class="h-full flex-x flex-wrap gap-4">
            {histories.value.map((read) => {
                const records = historyRecords.value.filter((record) => record.ref === read.id)
                return (
                    <div class="h-1/2">
                        <UserHistoryReadCard user={userStore.user!} records={records} read={read} />
                    </div>
                )
            })}
        </div>
    )
})
