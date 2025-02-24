<script setup lang="ts">
import API from '@/api'
import { computed, onMounted, ref } from 'vue'
import { createJsonBrook } from 'json-brook'
import type { JLPT_Read } from '@root/models'
import { NCard, NDivider, NButton, NInput, NSelect, NCollapse, NCollapseItem } from 'naive-ui'
import { isSuccessResponse, Log } from '@root/shared'
import { useConfigStore } from '@/stores/config'
import JLPT_ReadCard from './JLPT-ReadCard.vue'

const configStore = useConfigStore()

const jsonString = ref('')
const reasoningString = ref('')
const isReasoning = ref(true)
const currentLLMID = ref('')
const llmOptions = computed(() => {
    if (configStore.config) {
        return configStore.config.llms.map((llm) => {
            return { label: llm.name, value: llm.id }
        })
    } else {
        return []
    }
})
const level = ref<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N1')
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
const _testDemo = `
{
  "article": {
    "title": "超常現象と科学の狭間で揺れる現代人の意識",
    "contents": [
      "超常現象とは、通常の物理法則では説明できない現象を指す。心霊現象、予知能力、UFO目撃談など多岐にわたるが、科学的検証が困難な点で学界からは長年懐疑的に扱われてきた。しかし近年、量子力学の進展や脳科学の発達により、従来の枠組みでは計測不能だった領域へのアプローチが可能となりつつある。",
      "実証主義を重んじる科学者たちは、再現性のない現象を研究対象と認めない傾向にある。例えばテレパシー実験では、統計的有意性が確認されるケースがあるものの、実験環境の微妙な差異で結果が大きく変動する。この不安定性が、超常現象研究が疑似科学とみなされる一因となっている。",
      "一方、現象学的アプローチを取る研究者は主観的体験そのものに着目する。臨死体験者が共通して報告する「体外離脱感覚」は、脳の酸欠状態で生じる幻覚と説明されるが、医療機器が記録した脳波データと被験者の証言に矛盾が生じる事例も報告されている。",
      "興味深いのは技術革新がもたらした逆説的現象だ。SNSの普及で怪奇現象の映像が拡散しやすくなった反面、画像編集技術の進化により偽造動画の判別が困難になりつつある。VR空間では意図的に幽霊を出現させるプログラムも開発され、現実と虚構の境界が曖昧になりつつある。",
      "不可知論の立場から言えば、解明不能な現象を直ちに否定するのは科学的態度とは言えない。むしろ未知の領域に対する謙虚な姿勢が、新たなパラダイム転換を促す契機となるかもしれない。超常現象の研究が、従来の科学の盲点を照らし出す鏡として機能する可能性は否定できない。"
    ]
  },
  "vocabList": [
    {"word": "実証主義", "definition": "経験的事実に基づいて理論を構築する科学的態度"},
    {"word": "現象学的", "definition": "主観的体験の本質的構造を探究する哲学的アプローチ"},
    {"word": "不可知論", "definition": "人間の認識能力の限界を認める思想的立場"},
    {"word": "パラダイム転換", "definition": "科学的思考の基本的枠組みが変革されること"},
    {"word": "体外離脱感覚", "definition": "肉体から意識が切り離されたように感じる体験"}
  ],
  "structure": {
    "paragraph_focus": [
      "超常現象の定義と科学技術の関係性",
      "科学界における研究の困難性",
      "主観的体験を重視する研究手法",
      "技術革新がもたらす新たな課題",
      "未知の領域への哲学的考察"
    ]
  },
  "questions": [
    {
      "number": 1,
      "type": "主旨理解",
      "question": "本文で筆者が最も主張したいことは何か",
      "options": [
        "超常現象は疑似科学として排除すべきである",
        "技術革新が超常現象研究を不可能にしている",
        "未知の現象に対する謙虚な姿勢が科学を発展させる",
        "量子力学ですべての超常現象が説明可能になった"
      ],
      "answer": 2
    },
    {
      "number": 2,
      "type": "詳細理解",
      "question": "VR技術の発達について本文の内容と合うものはどれか",
      "options": [
        "幽霊の存在を科学的に立証した",
        "現実と虚構の区別を明確にした",
        "映像編集技術の進歩を妨げている",
        "現実認識に新たな課題を生んでいる"
      ],
      "answer": 3
    },
    {
      "number": 3,
      "type": "語彙定義",
      "question": "「不可知論」の説明として正しいものはどれか",
      "options": [
        "すべての現象は計測可能だと考える立場",
        "人間の認識能力に限界があると考える立場",
        "超自然的な存在を絶対視する立場",
        "主観的体験を重視しない立場"
      ],
      "answer": 1
    },
    {
      "number": 4,
      "type": "理由推定",
      "question": "テレパシー実験が学界で認められにくい理由は何か",
      "options": [
        "実験費用が膨大にかかるため",
        "再現性が確保できないため",
        "被験者が協力的でないため",
        "法的規制が厳しいため"
      ],
      "answer": 1
    },
    {
      "number": 5,
      "type": "文脈理解",
      "question": "「鏡として機能する可能性」とはどのような意味か",
      "options": [
        "科学の進歩を妨げる要因となる",
        "既存の科学体系を批判的に映し出す",
        "虚像を増幅する危険性を持つ",
        "物理法則を可視化する手段となる"
      ],
      "answer": 1
    }
  ]
}`
const template = `
{
    article: {
        title: string
        contents: string[]
    }
    vocabList: {
        word: string
        definition: string
    }[]
    structure: {
        paragraph_focus: string[]
    }
    questions: {
        number: number
        type: string
        question: string
        options: string[]
        answer: number
    }[]
}
`

const jlpt_read = ref<Partial<JLPT_Read> | null>(null)
const isGenerating = ref(false)

async function generateArticle() {
    const jsonBrook = createJsonBrook()
    isGenerating.value = true
    let flag = ''
    let isJsoning = false
    reasoningString.value = ''
    jsonString.value = ''
    jlpt_read.value = null
    await API.LLM.chatByStream(
        currentLLMID.value,
        [
            {
                role: 'system',
                content: `根据用户给出的主题，生成一篇 JLPT ${level.value} 难度的阅读题，只回复 JSON 格式的数据，JSON 格式为${template}`,
            },
            {
                role: 'user',
                content: theme.value,
            },
        ],
        (chunk) => {
            if (flag === '```' && chunk === 'json') {
                isJsoning = true
                isReasoning.value = false
                return
            }
            flag = chunk

            if (chunk === '```') {
                return
            }
            if (isJsoning) {
                // JSON部分
                jsonString.value += chunk
                jsonBrook.write(chunk)
                jlpt_read.value = jsonBrook.getCurrent()
            } else {
                // 思考部分
                reasoningString.value += chunk
            }
        },
    )
    jsonBrook.end()
    isGenerating.value = false
}

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

// 初始化
onMounted(async () => {
    const result = await API.Config.getConfig()
    if (isSuccessResponse(result)) {
        configStore.config = result.data
        Log.success(result.message)

        // 默认选择第一个模型
        if (configStore.config.llms.length) {
            currentLLMID.value = configStore.config.llms[0].id
        }
    }

    // 测试用
    jlpt_read.value = JSON.parse(_testDemo)
})
</script>

<template>
    <div class="flex flex-col gap-5">
        <div class="flex gap-5">
            <n-input v-model:value="theme" type="text" placeholder="请输入主题" />
            <n-select v-model:value="level" :options="levelOptions" />
            <n-select v-model:value="currentLLMID" :options="llmOptions" />
            <n-button
                v-if="!jlpt_read || isGenerating"
                type="primary"
                @click="generateArticle"
                :loading="isGenerating"
                :disabled="isGenerating"
            >
                {{ isGenerating ? '生成中' : '开始生成' }}
            </n-button>
            <n-button v-else type="warning" @click="generateArticle"> 重新生成 </n-button>
        </div>
        <div class="flex flex-col">
            <n-collapse>
                <n-collapse-item :title="reasoningCardTitle" name="1">
                    <n-card class="text-gray overflow-auto w-100%">
                        <div>{{ reasoningString }}</div>
                    </n-card>
                </n-collapse-item>
                <n-collapse-item v-if="jsonString" title="JSON" name="2">
                    <n-card class="text-gray overflow-auto w-100%">
                        <pre>{{ jsonString }}</pre>
                    </n-card>
                </n-collapse-item>
                <n-collapse-item v-if="jlpt_read?.article?.title" title="阅读" name="3">
                    <n-divider />
                    <JLPT_ReadCard :read="jlpt_read" />
                </n-collapse-item>
            </n-collapse>
        </div>
    </div>
</template>
