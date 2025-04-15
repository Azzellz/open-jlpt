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
    "difficulty": "N1",
    "kanaMap": {
        "人生": "じんせい",
        "充実": "じゅうじつ",
        "目標": "もくひょう",
        "達成": "たっせい",
        "自己": "じこ",
        "成長": "せいちょう",
        "意義": "いぎ",
        "探求": "たんきゅう",
        "価値": "かち",
        "見出": "みだ",
        "過程": "かてい",
        "困難": "こんなん",
        "克服": "こくふく",
        "努力": "どりょく",
        "成功": "せいこう",
        "失敗": "しっぱい",
        "経験": "けいけん",
        "学び": "まなび",
        "未来": "みらい",
        "可能性": "かのうせい"
    },
    "article": {
        "title": "人生の意義を探る",
        "contents": [
            "人生とは何か。この問いは古来より多くの哲学者や思想家によって探求されてきた。",
            "現代社会においても、個人の人生の充実感や幸福感は重要なテーマである。",
            "人生において目標を設定し、それを達成することは自己成長につながる。",
            "しかし、人生の意義は単に目標を達成することだけにあるわけではない。",
            "むしろ、その過程で遭遇する困難を克服し、努力を重ねることが重要である。",
            "成功や失敗を通じて得られる経験は、私たちに多くの学びをもたらす。",
            "そして、それらの経験が未来への可能性を広げるのである。",
            "人生の価値は、自分自身で見出すものであり、他人の評価に左右されるべきではない。",
            "最終的に、人生の意義は個人の探求と選択によって決定される。"
        ]
    },
    "vocabList": [
        {
            "word": "人生",
            "definition": "人の一生、生涯"
        },
        {
            "word": "充実",
            "definition": "内容が豊かで満ち足りていること"
        },
        {
            "word": "目標",
            "definition": "目指すべきところ、目的"
        },
        {
            "word": "達成",
            "definition": "目的を果たすこと、成し遂げること"
        },
        {
            "word": "自己",
            "definition": "自分自身"
        },
        {
            "word": "成長",
            "definition": "発展して大きくなること、進歩すること"
        },
        {
            "word": "意義",
            "definition": "物事の価値や重要性"
        },
        {
            "word": "探求",
            "definition": "物事の本質や真理を探し求めること"
        },
        {
            "word": "価値",
            "definition": "物事の有用性や重要性"
        },
        {
            "word": "見出",
            "definition": "発見すること、見つけ出すこと"
        },
        {
            "word": "過程",
            "definition": "物事が進んでいく経過"
        },
        {
            "word": "困難",
            "definition": "解決が難しい問題や状況"
        },
        {
            "word": "克服",
            "definition": "困難や問題を乗り越えること"
        },
        {
            "word": "努力",
            "definition": "目標を達成するために力を尽くすこと"
        },
        {
            "word": "成功",
            "definition": "目的を達成すること、うまくいくこと"
        },
        {
            "word": "失敗",
            "definition": "目的を達成できないこと、うまくいかないこと"
        },
        {
            "word": "経験",
            "definition": "実際に体験して得た知識や技能"
        },
        {
            "word": "学び",
            "definition": "知識や技能を身につけること"
        },
        {
            "word": "未来",
            "definition": "これから来る時、将来"
        },
        {
            "word": "可能性",
            "definition": "実現する見込みや潜在的な能力"
        }
    ],
    "questions": [
        {
            "number": 1,
            "type": "主旨理解",
            "question": "本文の主旨として最も適切なものはどれか。",
            "options": [
                "人生の意義は目標を達成することにある。",
                "人生の価値は他人の評価によって決まる。",
                "人生の意義は個人の探求と選択によって決定される。",
                "人生の充実感は成功の数によって測られる。"
            ],
            "answer": 2,
            "analysis": "本文の最後の段落で「人生の意義は個人の探求と選択によって決定される。」と述べられている。この文が本文の主旨を最もよく表している。"
        },
        {
            "number": 2,
            "type": "詳細理解",
            "question": "本文によると、人生の過程で重要なことは何か。",
            "options": [
                "目標を設定すること",
                "成功を収めること",
                "困難を克服すること",
                "他人の評価を得ること"
            ],
            "answer": 2,
            "analysis": "本文の第五段落で「むしろ、その過程で遭遇する困難を克服し、努力を重ねることが重要である。」と述べられている。これが人生の過程で重要なことである。"
        },
        {
            "number": 3,
            "type": "語彙理解",
            "question": "「克服」の意味として最も適切なものはどれか。",
            "options": [
                "困難を乗り越えること",
                "目標を達成すること",
                "他人を助けること",
                "知識を身につけること"
            ],
            "answer": 0,
            "analysis": "「克服」とは、困難や問題を乗り越えることを意味する。本文の第五段落でこの語が使用されている。"
        }
    ],
    "structure": {
        "paragraphFocus": [
            "人生の意義についての一般的な問い",
            "現代社会における人生の充実感",
            "目標達成と自己成長の関係",
            "人生の意義は目標達成だけではないこと",
            "困難克服と努力の重要性",
            "成功と失敗からの学び",
            "経験が未来への可能性を広げること",
            "人生の価値は自分で見出すべきこと",
            "人生の意義は個人の探求と選択による"
        ]
    }
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

export interface JLPT_KanaMap {
    [key: string]: string // 键为汉字，值为平假名
}

export interface JLPT_ReadOrigin {
    difficulty: 'N1' | 'N2' | 'N3' | 'N4' | 'N5' // 难度
    kanaMap: JLPT_KanaMap // 汉字->假名映射表
    article: JLPT_ReadArticle // 文章
    vocabList: JLPT_ReadVocab[] // 词汇表
    questions: JLPT_ReadQuestion[] // 问题
    structure: JLPT_ReadStructure // 文章结构
}
`
//#endregion

export default defineComponent(() => {
    const message = useMessage()

    //#region 配置栏

    //#region 阅读相关
    const wordCount = ref()
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

    const {
        isReasoning,
        isGenerating,
        reasoning,
        content,
        generate,
        currentLLMID,
        currentLLM,
        llmOptions,
        json,
    } = useLLM({ extends: ['selection', 'json'] })
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
        read.value = null
        const result = await generate(
            currentLLMID.value,
            [
                {
                    role: 'system',
                    content: `根据用户给出的主题，生成一篇字数在 ${wordCount.value || '任意'} 字左右的 JLPT ${level.value} 难度的阅读题，只回复 JSON 格式的数据，JSON 格式为 ${template}，请特别注意是所有在数据中出现的汉字，包括汉字和假名混合的词`,
                },
                {
                    role: 'user',
                    content: theme.value,
                },
            ],
            {
                // 如果当前模型是本地模型，则使用本地设置
                custom: currentLLM.value?.local ? currentLLM.value : void 0,
                onJSON(jsonFragment: any) {
                    originRead.value = jsonFragment
                },
            },
        )
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
        json.value = JSON.parse(__testReadString)
    })

    //#endregion

    return () => (
        <div>
            {/* <!-- 配置栏 --> */}
            <NGrid responsive="screen" cols="2 s:3 m:4" x-gap={24}>
                <NFormItemGi label="主题" required>
                    <NInput
                        v-model:value={theme.value}
                        class="w-full"
                        type="text"
                        placeholder="不能是敏感内容哦."
                        clearable
                        maxlength="30"
                        show-count
                    />
                </NFormItemGi>
                <NFormItemGi label="词数">
                    <NInputNumber
                        v-model:value={wordCount.value}
                        placeholder="任意"
                        class="w-full"
                        min={100}
                        max={2000}
                    />
                </NFormItemGi>
                <NFormItemGi label="难度">
                    <NSelect v-model:value={level.value} class="w-full" options={levelOptions} />
                </NFormItemGi>
                <NFormItemGi label="模型" required>
                    <NSelect
                        v-model:value={currentLLMID.value}
                        class="w-full"
                        options={llmOptions.value}
                    />
                </NFormItemGi>
            </NGrid>

            {/* 调试栏，包含显示思考、JSON */}
            <div class="flex items-center gap-4">
                {!originRead.value || isGenerating.value ? (
                    <NButton
                        type="primary"
                        size="small"
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
                    <NButton type="warning" size="small" onClick={handleGenerateRead}>
                        重新生成
                    </NButton>
                )}
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
        </div>
    )
})
