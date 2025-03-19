import { defineComponent } from 'vue'
import API from '@/api'
import { computed, onMounted, ref } from 'vue'
import { createJsonBrook } from 'json-brook'
import type { JLPT_Read, JLPT_ReadOrigin, UserHistoryCreateParams } from '@root/models'
import {
    NCard,
    NButton,
    NInput,
    NSelect,
    NCollapse,
    NCollapseItem,
    NInputNumber,
    useMessage,
    NGrid,
    NFormItemGi,
    NDivider,
    NSwitch,
    NSpin,
    NIcon,
} from 'naive-ui'
import JLPT_ReadBody from '@/components/jlpt/read/JLPT-ReadBody'
import { useUserStore } from '@/stores/user'
import { Json as JsonIcon } from '@vicons/carbon'
import { useLLM } from '@/composables/llm'
import { isSuccessResponse } from '@root/shared'
import SakuraIcon from '@/components/icon/SakuraIcon'

//#region prompt 模板

const __testReadString = `
{
    "star": 0,
    "user": "67bebfb72321874830e5aed2",
    "visible": true,
    "timeStamp": 1742202605896,
    "difficulty": "N3",
    "article": {
        "title": "火山の活動",
        "contents": ["火山は、地球の内部からマグマが地表に噴出する現象です。火山活動は、地震や温泉の発生と密接に関連しています。火山の噴火は、時として大きな災害を引き起こすことがありますが、一方で、火山灰は土地を肥沃にするため、農業に役立つこともあります。", "日本は環太平洋火山帯に位置しているため、多くの活火山があります。例えば、富士山は日本で最も有名な火山の一つです。火山の噴火は、事前に観測されることが多いですが、突然噴火することもあります。そのため、火山周辺の住民は常に注意を払う必要があります。", "火山の噴火には、いくつかの種類があります。爆発的噴火は、大量の火山灰や岩石を放出し、広範囲に影響を与えます。一方、溶岩流は、比較的ゆっくりと流れ、直接的な被害は少ないですが、長期間にわたって地形を変えることがあります。"]
    },
    "vocabList": [{
        "word": "火山",
        "definition": "地球の内部からマグマが地表に噴出する現象"
    }, {
        "word": "マグマ",
        "definition": "地球の内部にある高温の溶岩"
    }, {
        "word": "噴火",
        "definition": "火山がマグマや火山灰を噴出すること"
    }, {
        "word": "火山灰",
        "definition": "火山の噴火によって放出される細かい灰"
    }, {
        "word": "溶岩流",
        "definition": "火山から流れ出る溶岩"
    }],
    "structure": {
        "paragraphFocus": ["火山の定義と火山活動の関連性", "日本の火山とその注意点", "火山の噴火の種類とその影響"]
    },
    "questions": [{
        "number": 1,
        "answer": 1,
        "type": "選択",
        "question": "火山活動と密接に関連しているものは何ですか？",
        "options": ["台風", "地震", "洪水", "竜巻"],
        "analysis": "文章の中で、火山活動は地震や温泉の発生と密接に関連していると述べられています。したがって、正解は「地震」です。"
    }, {
        "number": 2,
        "answer": 2,
        "type": "選択",
        "question": "日本で最も有名な火山の一つは何ですか？",
        "options": ["桜島", "阿蘇山", "富士山", "雲仙岳"],
        "analysis": "文章の中で、富士山は日本で最も有名な火山の一つであると述べられています。したがって、正解は「富士山」です。"
    }, {
        "number": 3,
        "answer": 1,
        "type": "選択",
        "question": "爆発的噴火が引き起こす主な影響は何ですか？",
        "options": ["土地を肥沃にする", "大量の火山灰や岩石を放出する", "溶岩流がゆっくり流れる", "直接的な被害が少ない"],
        "analysis": "文章の中で、爆発的噴火は大量の火山灰や岩石を放出し、広範囲に影響を与えると述べられています。したがって、正解は「大量の火山灰や岩石を放出する」です。"
    }],
    "id": "67d7e6ed5de841731c817511"
}
`

const template = `
export interface JLPT_ReadVocab {
    word: string
    definition: string
}

export interface JLPT_ReadQuestion {
    number: number
    type: string
    question: string
    options: string[]
    answer: number
    analysis: string // 答案解析（完整一点）
}

export interface JLPT_ReadArticle {
    title: string
    contents: string[]
}

export interface JLPT_ReadStructure {
    paragraphFocus: string[]
}

export interface JLPT_ReadOrigin {
    difficulty: 'N1' | 'N2' | 'N3' | 'N4' | 'N5' // 难度
    article: JLPT_ReadArticle // 文章
    vocabList: JLPT_ReadVocab[] // 词汇表
    questions: JLPT_ReadQuestion[] // 问题
    structure: JLPT_ReadStructure // 文章结构
}
`
//#endregion

export default defineComponent(() => {
    const userStore = useUserStore()
    const message = useMessage()

    //#region 配置栏

    //#region 阅读相关
    const wordCount = ref()
    const currentLLMID = ref(userStore.user!.config.llm.default)
    const currentLLM = computed(() => {
        return userStore.user!.config.llm.items.find((llm) => llm.id === currentLLMID.value)
    })
    const llmOptions = computed(() => {
        if (userStore.user!.config) {
            const options = userStore.user!.config.llm.items.map((llm) => {
                return { label: llm.name, value: llm.id }
            })
            if (currentLLMID.value) {
                return options
            } else {
                return [...options, { label: '请选择模型', value: '' }]
            }
        } else {
            return []
        }
    })
    const level = ref<JLPT_ReadOrigin['difficulty']>('N1')
    const levelOptions = [
        {
            label: 'N1',
            value: 'N1',
        },
        {
            label: 'N2',
            value: 'N2',
        },
        {
            label: 'N3',
            value: 'N3',
        },
        {
            label: 'N4',
            value: 'N4',
        },
        {
            label: 'N5',
            value: 'N5',
        },
    ]
    const theme = ref('')

    //#endregion

    //#region 调试相关

    const isShowReasoning = ref(false)
    const isShowJSON = ref(false)

    //#endregion

    //#endregion

    const { isReasoning, isGenerating, reasoning, content, generate } = useLLM()
    const isAllowGenerate = computed(() => {
        return theme.value && currentLLMID.value
    })
    const reasoningCardTitle = computed(() => {
        if (!reasoning.value) {
            return '输入相关信息后开始生成'
        }
        if (isReasoning.value) {
            return '思考中...'
        } else {
            return '思考过程'
        }
    })
    const originRead = ref<Partial<JLPT_ReadOrigin> | null>(null)
    const read = ref<JLPT_Read | null>(null)
    async function handleGenerateRead() {
        // 重置状态
        originRead.value = null
        const jsonBrook = createJsonBrook()
        await generate(
            currentLLMID.value,
            [
                {
                    // prompt
                    role: 'system',
                    content: `根据用户给出的主题，生成一篇字数在 ${wordCount.value || '任意'} 字左右的 JLPT ${level.value} 难度的阅读题，只回复 JSON 格式的数据，JSON 格式为 ${template}`,
                },
                {
                    role: 'user',
                    content: theme.value,
                },
            ],
            {
                onContent(str) {
                    isReasoning.value = false
                    if (str === 'json' || str === '```') {
                        return
                    } else {
                        content.value += str
                        jsonBrook.write(str)
                        originRead.value = jsonBrook.getCurrent()
                    }
                },
            },
        )
        jsonBrook.end()
        await createRead()
    }

    // 创建阅读，默认不可见，发布后可见
    async function createRead() {
        const result = await API.JLPT.Read.createRead(originRead.value as any)
        if (isSuccessResponse(result)) {
            message.success('生成完毕')
            read.value = result.data
        } else {
            console.error(result)
        }
    }

    // 发布阅读
    async function handlePublish() {
        if (!read.value) return

        // 发布阅读就是把 visible 设置为 true
        const result = await API.JLPT.Read.updateReadVisible(read.value.id, true)
        if (isSuccessResponse(result)) {
            message.success('发布成功')
            read.value.visible = true
        } else {
            message.error('发布失败')
            console.error(result)
        }
    }

    // 提交作答（推送至历史记录）
    async function handleSubmit(answers: UserHistoryCreateParams['answers']) {
        if (!read.value) return

        const params: UserHistoryCreateParams = {
            answers,
            ref: read.value.id,
        }
        const result = await API.User.createHistory('reads', params)
        if (isSuccessResponse(result)) {
            message.success('提交成功')
        } else {
            console.error(result)
            message.error('提交失败')
        }
    }

    //#endregion

    //#region 初始化

    onMounted(async () => {
        // 测试用
        originRead.value = JSON.parse(__testReadString)
        read.value = JSON.parse(__testReadString)
        content.value = __testReadString.toString()
    })

    //#endregion

    return () => (
        <main class="app-content py-10 reactive">
            {/* <!-- 配置栏 --> */}
            <NGrid cols={24} x-gap={24}>
                <NFormItemGi span={8} label="主题" required>
                    <NInput
                        v-model:value={theme.value}
                        type="text"
                        placeholder="不能是敏感内容哦."
                        clearable
                        maxlength="30"
                        show-count
                    />
                </NFormItemGi>
                <NFormItemGi span={4} label="词数">
                    <NInputNumber
                        v-model:value={wordCount.value}
                        placeholder="任意"
                        min={100}
                        max={2000}
                    />
                </NFormItemGi>
                <NFormItemGi span={4} label="难度">
                    <NSelect v-model:value={level.value} options={levelOptions} />
                </NFormItemGi>
                <NFormItemGi span={4} label="模型" required>
                    <NSelect v-model:value={currentLLMID.value} options={llmOptions.value} />
                </NFormItemGi>
                <NFormItemGi span={2}>
                    {!originRead.value || isGenerating.value ? (
                        <NButton
                            type="primary"
                            onClick={handleGenerateRead}
                            loading={isGenerating.value}
                            disabled={isGenerating.value || !isAllowGenerate.value}
                        >
                            {isGenerating.value
                                ? '生成中'
                                : isAllowGenerate.value
                                  ? '开始生成'
                                  : '请填写配置'}
                        </NButton>
                    ) : (
                        <NButton type="warning" onClick={handleGenerateRead}>
                            重新生成
                        </NButton>
                    )}
                </NFormItemGi>
            </NGrid>

            {/* 调试栏，包含显示思考、JSON */}
            <div class="flex gap-4">
                <NSwitch
                    v-model:value={isShowReasoning.value}
                    round={false}
                    size="large"
                    v-slots={{ icon: () => '🤔' }}
                />
                <NSwitch
                    v-model:value={isShowJSON.value}
                    round={false}
                    size="large"
                    v-slots={{ icon: () => <NIcon component={JsonIcon} /> }}
                />
            </div>

            <NDivider>
                {isGenerating.value ? <NSpin size="small" /> : <SakuraIcon size="22" />}
            </NDivider>

            {/* 折叠栏 */}
            <NCollapse>
                {/* 思考模块 */}
                {reasoning.value && isShowReasoning.value && (
                    <NCollapseItem title={reasoningCardTitle.value} name="1">
                        <NCard class="text-gray overflow-auto">
                            <div class="italic">{reasoning.value}</div>
                        </NCard>
                    </NCollapseItem>
                )}

                {/* JSON模块 */}
                {content.value && isShowJSON.value && (
                    <NCollapseItem title="JSON" name="2">
                        <NCard class="text-gray overflow-auto">
                            <pre>{content.value}</pre>
                        </NCard>
                    </NCollapseItem>
                )}

                {/* 阅读模块 */}
                {originRead.value?.article?.title && (
                    <NCollapseItem title="阅读" name="3">
                        <JLPT_ReadBody
                            originRead={originRead.value}
                            read={read.value}
                            onSubmit={handleSubmit}
                            onPublish={handlePublish}
                        />
                    </NCollapseItem>
                )}
            </NCollapse>
        </main>
    )
})
