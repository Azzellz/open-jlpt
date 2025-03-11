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
                    @click="handleGenerateRead"
                    :loading="isGenerating"
                    :disabled="isGenerating || !isAllowGenerate"
                >
                    {{ isGenerating ? '生成中' : isAllowGenerate ? '开始生成' : '请填写配置' }}
                </n-button>
                <n-button v-else type="warning" @click="handleGenerateRead"> 重新生成 </n-button>
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
                v-if="reasoning && isShowReasoning"
                :title="reasoningCardTitle"
                name="1"
            >
                <n-card class="text-gray overflow-auto">
                    <div class="italic">{{ reasoning }}</div>
                </n-card>
            </n-collapse-item>
            <n-collapse-item v-if="content && isShowJSON" title="JSON" name="2">
                <n-card class="text-gray overflow-auto">
                    <pre>{{ content }}</pre>
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
import { isSuccessResponse } from '@root/shared'
import { useLLM } from '@/composables/llm'

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

//#region 生成阅读

//#region prompt 模板

const __testReadString = `
{
  "difficulty": "N1",
  "article": {
    "title": "戦争と平和の相克するダイナミズム",
    "contents": [
      "人類史は戦争と平和の反復によって紡がれてきた。古代メソポタミアの粘土板に刻まれた戦勝記録から21世紀のサイバー戦争に至るまで、暴力の形態は変化しながらも、その本質は不変のままだ。対極にあるはずの平和は、戦争を鏡像とする影のような存在として、常に戦争の概念規定に依存してきた。",
      "軍事史家ジョン・キーガンの指摘によれば、戦争は文明の触媒として機能し、技術革新や社会制度の変革を加速させる反面、文化の断絶と倫理的退行を引き起こす。1945年の広島原爆投下は、核兵器という絶対的破壊力を人類が手にした瞬間であると同時に、戦争の様相を『抑止力の均衡』という新たな段階へと移行させた。",
      "国際政治学者ケネス・ウォルツが提唱した『第三イメージ』理論では、無政府状態の国際システムが国家間に安全保障ジレンマを生起させると説明する。このパラドックスは、各国が自国の防衛力を強化すればするほど、他国からの脅威認知が高まり、結果的にシステム全体の不安定性が増大するという逆説を内包している。",
      "哲学者カール・ヤスパースは『戦争の形而上学』において、暴力の行使を『人間性の根源的欠如』と規定した。彼の議論はハイデガーの存在論的アプローチを継承しつつ、戦争を単なる政治的手段ではなく、人間存在の本質的脆弱性が顕在化する場として再解釈する。この視座は、現代の非対称戦争における民間人被害の増大を予見するかのようだ。",
      "現代の平和構築理論が重視する『積極的平和』概念は、単に戦争のない状態ではなく、構造的暴力の解消と社会的公正の実現を求める。ノルウェーの社会学者ヨハン・ガルトゥングが提唱したこの理論は、冷戦終結後の民族紛争解決に新たな視点を提供したが、その実践過程では文化相対主義と普遍的人権概念の衝突が新たな課題を生んでいる。",
      "人工知能や自律型兵器システムの発展は、戦争の意思決定プロセスから人間性を排除する危険性を孕む。2023年にジュネーブで採択された『致死性自律兵器システム規制枠組み』は、この問題に対処する初の国際的試みとなったが、技術進化の速度と法整備の遅れの間には依然として深刻な乖離が存在する。"
    ]
  },
  "vocabList": [
    {"word": "相克", "definition": "相反する要素が互いに作用し合うこと"},
    {"word": "触媒", "definition": "変化を促進する要因"},
    {"word": "ジレンマ", "definition": "二者択一を迫られる困難な状況"},
    {"word": "形而上学", "definition": "経験を超えた存在の根本原理を探求する学問"},
    {"word": "顕在化", "definition": "隠れていたものが表面に現れること"},
    {"word": "孕む", "definition": "内部に潜在的に持っている"},
    {"word": "乖離", "definition": "かけ離れて一致しないこと"}
  ],
  "questions": [
    {
      "number": 1,
      "type": "主旨理解",
      "question": "本文の全体を通して最も言いたいことは何か",
      "options": [
        "戦争は技術革新を促進する必要悪である",
        "平和概念は戦争の存在を前提として成立している",
        "AI兵器は直ちに全面禁止すべきである",
        "国際法整備が戦争抑止に有効である"
      ],
      "answer": 1,
      "analysis": "各段落で戦争と平和の相互規定関係、技術と倫理の衝突、国際システムの矛盾などが論じられている。選択肢2が「平和概念が戦争を前提とする」という本文全体のテーゼを適切に要約している。他選択肢は部分的な指摘に過ぎない"
    },
    {
      "number": 2,
      "type": "語彙理解",
      "question": "「安全保障ジレンマ」の説明として適切なものはどれか",
      "options": [
        "軍縮交渉における各国の駆け引き",
        "防衛強化がかえって不安定化を招く現象",
        "同盟国間の相互不信の問題",
        "軍事費増大による経済破綻の危険性"
      ],
      "answer": 1,
      "analysis": "第三段落の『各国が防衛力を強化すればするほどシステム全体の不安定性が増大する』という記述と一致。選択肢2が「防衛強化→不安定化」の因果関係を正確に捉えている"
    },
    {
      "number": 3,
      "type": "詳細理解",
      "question": "ヤスパースの戦争観について正しいものはどれか",
      "options": [
        "政治的目的達成の合理的手段",
        "人間性の本質的欠如の表れ",
        "国際システムの必然的帰結",
        "文化相対主義の産物"
      ],
      "answer": 1,
      "analysis": "第四段落『人間性の根源的欠如』という記述が根拠。選択肢2が該当する。他選択項は他の学者の見解や本文の異なる部分の記述"
    },
    {
      "number": 4,
      "type": "推論",
      "question": "筆者の「積極的平和」概念に対する態度として最も近いものはどれか",
      "options": [
        "全面的に支持している",
        "実践上の問題を指摘している",
        "時代遅れとみなしている",
        "理論的欠陥があると批判している"
      ],
      "answer": 1,
      "analysis": "第五段落『その実践過程では...新たな課題を生んでいる』という記述から、肯定的評価と問題意識の両立が読み取れる。選択肢2が「実践上の問題」を指摘する筆者の姿勢を反映"
    },
    {
      "number": 5,
      "type": "主張把握",
      "question": "最終段落が提起している問題の本質は何か",
      "options": [
        "AI技術の軍事転用の是非",
        "技術進歩と法整備の速度差",
        "国際協調体制の不備",
        "兵器開発競争の再燃"
      ],
      "answer": 1,
      "analysis": "『技術進化の速度と法整備の遅れの間の乖離』が直接的な指摘。選択肢2がこの速度差の問題を正確に表現している"
    }
  ],
  "structure": {
    "paragraphFocus": [
      "戦争と平和の概念的相互依存関係",
      "戦争がもたらす文明への複合的影響",
      "国際システムにおける安全保障の逆説",
      "戦争の哲学的・存在論的考察",
      "現代平和概念の進化と課題",
      "新技術が引き起こす倫理的ジレンマ"
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
const jlpt_read = ref<Partial<JLPT_ReadOrigin> | null>(null)
async function handleGenerateRead() {
    // 重置状态
    jlpt_read.value = null
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
                    jlpt_read.value = jsonBrook.getCurrent()
                }
            },
        },
    )
    jsonBrook.end()
    message.success('生成完毕')
    createHistory()
}

// 推送历史记录
async function createHistory(read: JLPT_ReadOrigin = jlpt_read.value! as any) {
    const result = await API.User.createHistory('reads', read)
    if (isSuccessResponse(result)) {
        message.success('已保存到历史记录')
    } else {
        message.error('保存到历史记录失败')
    }
}

//#endregion

//#region 初始化

onMounted(async () => {
    // 测试用
    jlpt_read.value = JSON.parse(__testReadString)
    content.value = __testReadString.toString()
    // createHistory()
})

//#endregion
</script>
