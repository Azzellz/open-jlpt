<template>
    <main class="app-content py-10 reactive">
        <!-- 配置栏 -->
        <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="8" label="主题" required>
                <n-input
                    v-model:value="theme"
                    type="text"
                    placeholder="不能是敏感内容哦."
                    clearable
                    maxlength="30"
                    show-count
                >
                </n-input>
            </n-form-item-gi>
            <n-form-item-gi :span="4" label="词数">
                <n-input-number
                    v-model:value="wordCount"
                    type="text"
                    placeholder="任意"
                    :min="100"
                    :max="2000"
                />
            </n-form-item-gi>
            <n-form-item-gi :span="4" label="难度">
                <n-select v-model:value="level" :options="levelOptions" />
            </n-form-item-gi>
            <n-form-item-gi :span="4" label="模型" required>
                <n-select v-model:value="currentLLMID" :options="llmOptions" />
            </n-form-item-gi>
            <n-form-item-gi :span="2">
                <n-button
                    v-if="!jlpt_read || isGenerating"
                    type="primary"
                    @click="generateRead"
                    :loading="isGenerating"
                    :disabled="isGenerating || !isAllowGenerate"
                >
                    {{ isGenerating ? '生成中' : isAllowGenerate ? '开始生成' : '请填写配置' }}
                </n-button>
                <n-button v-else type="warning" @click="generateRead"> 重新生成 </n-button>
            </n-form-item-gi>
        </n-grid>
        <div class="flex gap-4">
            <n-switch v-model:value="isShowReasoning" :round="false" size="large">
                <template #icon> 🤔 </template>
            </n-switch>
            <n-switch v-model:value="isShowJSON" :round="false" size="large">
                <template #icon> <n-icon :component="JsonIcon" /> </template>
            </n-switch>
        </div>
        <n-divider v-if="isGenerating">
            <n-spin size="small" />
        </n-divider>
        <n-divider v-else />
        <!-- 折叠栏 -->
        <n-collapse>
            <n-collapse-item
                v-if="reasoningString && isShowReasoning"
                :title="reasoningCardTitle"
                name="1"
            >
                <n-card class="text-gray overflow-auto">
                    <div class="italic">{{ reasoningString }}</div>
                </n-card>
            </n-collapse-item>
            <n-collapse-item v-if="jsonString && isShowJSON" title="JSON" name="2">
                <n-card class="text-gray overflow-auto">
                    <pre>{{ jsonString }}</pre>
                </n-card>
            </n-collapse-item>
            <n-collapse-item v-if="jlpt_read?.article?.title" title="阅读" name="3">
                <JLPT_ReadCard :read="jlpt_read" />
            </n-collapse-item>
        </n-collapse>
    </main>
</template>

<script setup lang="ts">
import API from '@/api'
import { computed, onMounted, ref } from 'vue'
import { createJsonBrook } from 'json-brook'
import type { JLPT_ReadOrigin } from '@root/models'
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
import JLPT_ReadCard from '@/components/jlpt/read/JLPT-ReadCard.vue'
import { useUserStore } from '@/stores/user'
import { Json as JsonIcon } from '@vicons/carbon'

const userStore = useUserStore()
const message = useMessage()

//#region 配置栏

//#region 阅读相关

const wordCount = ref()
const currentLLMID = ref('')
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

//#region 生成阅读

//#region prompt 模板

const __testReadString = `
{
  "difficulty":"N1",
  "article": {
    "title": "超自然現象と現代社会の心理的相関",
    "contents": [
      "超自然現象に対する人間の傾倒は、科学が発達した21世紀においても衰えを見せない。むしろ、デジタル化が進む社会において、幽霊やUFO目撃情報がSNSで拡散されやすくなった現状は興味深い逆説と言える。",
      "認知心理学の観点では、人間がパターン認識に依存する生物学的特性を持つことが、曖昧な映像や音声に意味を見出そうとする傾向を生む。特に、ストレス社会において現実逃避の手段として、超自然的解釈が心理的防衛機制として機能する事例が報告されている。",
      "具体的には、2011年の東日本大震災後、被災地で「亡くなった家族の声が聞こえる」という体験談が急増した。民俗学者の佐藤隆は、これを「集合的無意識が生み出す共通知覚」と分析し、トラウマの集団的処理プロセスにおける超自然現象の役割を指摘している。",
      "超常現象ビジネスの隆盛も見逃せない。若者を中心に広がる「心霊スポット巡り」は、単なる非日常体験ではなく、デジタル社会におけるアナログ的つながりを求める現象として解釈する研究者もいる。"
    ]
  },
  "questions": [
    {
      "number": 1,
      "type": "主旨理解",
      "question": "本文の全体を通して最も言いたいことは何か",
      "options": [
        "超自然現象は科学的に説明可能な心理的メカニズムに基づいている",
        "デジタル社会の発展が新たな形の超自然現象を生み出している",
        "現代社会における超自然現象には複合的な要因と機能が存在する",
        "災害時の超自然体験はトラウマ治療に有効な手段となり得る"
      ],
      "answer": 2,
      "analysis": "正解は3。各段落で心理的要因（第2段落）、社会現象（第4段落）、具体的事例（第3段落）など多角的に分析しており、「複合的な要因と機能」という総合的な視点が本文の核心。他選択肢は部分的な指摘に留まっている"
    },
    {
      "number": 2,
      "type": "詳細理解",
      "question": "東日本大震災後の事例について正しい記述はどれか",
      "options": [
        "被災者の現実逃避を助ける目的で広められた",
        "民俗学者によって事前に予測されていた現象である",
        "個人の体験ではなく集団的現象として発生した",
        "デジタル技術の発達が直接的な原因となった"
      ],
      "answer": 2,
      "analysis": "正解は3。第3段落に「集合的無意識」「共通知覚」との記述があり、集団的現象としての特徴が強調されている。選択肢1は心理的防衛機制の一般論、4は別の段落の内容と混同している"
    },
    {
      "number": 3,
      "type": "推論",
      "question": "筆者の立場に最も近い考え方はどれか",
      "options": [
        "超自然現象は科学的検証によって完全に否定されるべきだ",
        "社会構造の変化に伴い現象の形態も変容し続けるだろう",
        "若者の心霊スポット巡りは危険な行動であると考える",
        "デジタル技術の進歩が超自然現象を減少させるだろう"
      ],
      "answer": 1,
      "analysis": "正解は2。第4段落で「デジタル社会におけるアナログ的つながり」という新しい形態を指摘し、第1段落で現象の「衰えを見せない」と述べていることから、変化し続けるという見方が読み取れる"
    },
    {
      "number": 4,
      "type": "語彙",
      "question": "「逆説」の本文中での意味として適切なものはどれか",
      "options": [
        "論理的な矛盾",
        "予想に反する結果",
        "修辞的な表現技法",
        "歴史的な経緯"
      ],
      "answer": 1,
      "analysis": "正解は2。文脈から「科学発達の現代で超自然現象が広まる」という一見矛盾する状況を指す「逆説」の用法。選択肢1は字義的な解釈で文脈に合わない"
    },
    {
      "number": 5,
      "type": "構成分析",
      "question": "第2段落と第3段落の関係性として正しいものはどれか",
      "options": [
        "一般理論と具体例の関係",
        "問題提起と解決策の関係",
        "比較対象の並列表記",
        "時間的順序に基づく展開"
      ],
      "answer": 0,
      "analysis": "正解は1。第2段落で認知心理学的理論を提示し、第3段落で震災事例という具体例を挙げる構成。理論と実例の関係性が明確"
    }
  ],
  "vocabList": [
    {
      "word": "傾倒",
      "definition": "ある物事に深く心を惹かれること"
    },
    {
      "word": "防衛機制",
      "definition": "無意識に働く心理的な自己防衛システム"
    },
    {
      "word": "集約",
      "definition": "複数の要素が一か所に集中・統合されること"
    },
    {
      "word": "不可知",
      "definition": "認識することが原理的に不可能であること"
    },
    {
      "word": "風化",
      "definition": "記憶や痕跡が次第に薄れていくこと"
    }
  ],
  "structure": {
    "paragraphFocus": [
      "現代社会における超自然現象の存続の逆説性",
      "心理学的要因の理論的説明",
      "具体的な社会事例の分析",
      "現象の新しい形態と社会機能"
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

export interface JLPT_ReadOrigin {
    difficulty: 'N1' | 'N2' | 'N3' | 'N4' | 'N5' // 难度
    article: JLPT_ReadArticle // 文章
    vocabList: JLPT_ReadVocab[] // 词汇表
    questions: JLPT_ReadQuestion[] // 问题
    structure: JLPT_ReadStructure // 文章结构
}
`

//#endregion

const isReasoning = ref(true)
const isAllowGenerate = computed(() => {
    return theme.value && currentLLMID.value
})
const jsonString = ref('')
const reasoningString = ref('')
const reasoningCardTitle = computed(() => {
    if (!reasoningString.value) {
        return '输入相关信息后开始生成'
    }
    if (isReasoning.value) {
        return '思考中...'
    } else {
        return '思考过程'
    }
})
const jlpt_read = ref<Partial<JLPT_ReadOrigin> | null>(null)
const isGenerating = ref(false)
async function generateRead() {
    // 重置状态
    isGenerating.value = true
    reasoningString.value = ''
    jsonString.value = ''
    jlpt_read.value = null

    const jsonBrook = createJsonBrook()
    await API.User.chatWithLLM(userStore.user!.id, currentLLMID.value, {
        messages: [
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
        onReasoning(reasoning) {
            isReasoning.value = true
            reasoningString.value += reasoning
        },
        onContent(content) {
            isReasoning.value = false
            if (content === 'json' || content === '```') {
                return
            } else {
                jsonString.value += content
                jsonBrook.write(content)
                jlpt_read.value = jsonBrook.getCurrent()
            }
        },
    })
    jsonBrook.end()
    isGenerating.value = false
    message.success('生成完毕')
}

//#endregion

//#region 初始化

onMounted(async () => {
    // 测试用
    // jlpt_read.value = JSON.parse(__testReadString)
    // jsonString.value = __testReadString.toString()
})

//#endregion
</script>
