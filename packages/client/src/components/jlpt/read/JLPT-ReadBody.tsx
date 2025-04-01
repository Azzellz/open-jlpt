import type {
    JLPT_Read,
    JLPT_ReadOrigin,
    JLPT_ReadQuestion,
    UserHistoryCreateParams,
} from '@root/models'
import { NCard, NDivider, NRadio, NTag, NButton } from 'naive-ui'
import { computed, defineComponent, ref } from 'vue'
import JLPT_ReadVocabCard from './JLPT-ReadVocabCard'
import ErrorIcon from '@/components/icon/ErrorIcon'
import SuccessIcon from '@/components/icon/SuccessIcon'
import TextSelectMenu from '@/components/tools/TextSelectMenu'
import AppTextSelectMenu from '@/components/app/AppTextSelectMenu'
import { JLPT_DifficultyTag } from '../JLPT-DiffucultyTag'

interface Props {
    originRead: Partial<JLPT_ReadOrigin>
    read: JLPT_Read | null
    onSubmit?: (answers: UserHistoryCreateParams['answers']) => void
    onPublish?: () => void
}
export default defineComponent((props: Props) => {
    const answers = ref<UserHistoryCreateParams['answers']>([])

    // 记录已经回答的题数
    const answerCount = ref(0)
    const isAllowSubmit = computed(() => {
        return answerCount.value === props.originRead.questions?.length
    })

    const isSubmitted = ref(false)
    async function handleSubmitAnswers() {
        isSubmitted.value = true
        props.onSubmit?.(answers.value)
    }
    async function handleReAnswer() {
        isSubmitted.value = false
        answers.value = []
        answerCount.value = 0
    }

    //#region 动态UI

    const TextContainer = computed(() => {
        if (props.originRead.article?.contents?.length) {
            return (
                <div class="flex flex-col gap-5">
                    {props.originRead.article.contents.map((content) => {
                        return <div>{content}</div>
                    })}
                </div>
            )
        } else {
            return void 0
        }
    })

    const VocabListContainer = computed(() => {
        if (props.originRead.vocabList?.length) {
            return (
                <>
                    <NDivider />
                    <div class="flex-y gap-5">
                        <div class="text-lg">词汇表</div>
                        <div class="flex-x flex-wrap gap-5 justify-center">
                            {props.originRead.vocabList?.map((vocab) => {
                                return (
                                    <JLPT_ReadVocabCard
                                        class="min-w-50 max-w-75 flex-1"
                                        vocab={vocab}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </>
            )
        } else {
            return void 0
        }
    })

    const createQuestionOptionResult = (question: JLPT_ReadQuestion, optionIndex: number) => {
        return optionIndex === question.answer ? <SuccessIcon size={16} /> : <ErrorIcon size={16} />
    }
    const createQuestionOptions = (question: JLPT_ReadQuestion, questionIndex: number) => {
        if (question.options?.length) {
            return question.options.map((option, optionIndex) => {
                return (
                    <div class="ml-2.5 flex gap-2 items-center">
                        <NRadio
                            checked={answers.value[questionIndex] === optionIndex + 1}
                            value={optionIndex + 1}
                            disabled={isSubmitted.value}
                            onUpdateChecked={() => {
                                answers.value[questionIndex] = optionIndex + 1
                                answerCount.value++
                            }}
                        >
                            {option}
                        </NRadio>

                        {isSubmitted.value && createQuestionOptionResult(question, optionIndex)}
                    </div>
                )
            })
        }
    }
    const QuestionsContainer = computed(() => {
        if (props.originRead.questions?.length) {
            return (
                <>
                    <NDivider />
                    <div class="flex flex-col gap-5">
                        {props.originRead.questions.map((question, questionIndex) => {
                            return (
                                <div class="flex flex-col gap-5">
                                    {/* 题干 */}
                                    <div class="flex items-center font-bold gap-2">
                                        <NTag type="primary" size="small">
                                            {question.type}
                                        </NTag>
                                        <div>{question.question}</div>
                                    </div>
                                    {/* 选项 */}
                                    {createQuestionOptions(question, questionIndex)}

                                    {isSubmitted.value && (
                                        <div class="text-gray ml-2.5 italic">
                                            {question.analysis}
                                        </div>
                                    )}

                                    <NDivider />
                                </div>
                            )
                        })}
                    </div>
                </>
            )
        } else {
            return void 0
        }
    })

    //#endregion

    return () => (
        <NCard
            title={() => (
                <div class="flex gap-3 items-center">
                    <JLPT_DifficultyTag difficulty={props.originRead.difficulty} />
                    <span>{props.originRead.article?.title}</span>
                </div>
            )}
        >
            {/* 内容部分 */}
            <AppTextSelectMenu>
                {/* 正文部分 */}
                {TextContainer.value}

                {/* 词汇表 */}
                {VocabListContainer.value}

                {/* 问题部分 */}
                {QuestionsContainer.value}
            </AppTextSelectMenu>

            {/* 交互栏 */}
            {props.read ? (
                <div class="flex gap-5">
                    <NButton
                        ghost
                        type="info"
                        onClick={handleSubmitAnswers}
                        disabled={!isAllowSubmit.value}
                    >
                        <span class="font-bold">
                            {isAllowSubmit.value ? '提交答案' : '请完成所有问题'}
                        </span>
                    </NButton>

                    <NButton
                        disabled={!props.read || props.read.visible}
                        ghost
                        type="success"
                        onClick={() => props.onPublish?.()}
                    >
                        <span class="font-bold"> {props.read?.visible ? '已发布' : '发布'} </span>
                    </NButton>

                    {isSubmitted.value && (
                        <NButton ghost type="success" onClick={handleReAnswer}>
                            <span class="font-bold">重新答题</span>
                        </NButton>
                    )}

                    <NButton ghost type="warning">
                        <span class="font-bold"> 收藏 </span>
                    </NButton>
                </div>
            ) : (
                void 0
            )}
        </NCard>
    )
})
