<script setup lang="ts">
import API from '@/api'
import { computed, onMounted, ref } from 'vue'
import { createJsonBrook } from 'json-brook'
import type { JLPT_Read } from '@root/models'
import { NCard, NDivider, NButton, NInput, NSelect, NCollapse, NCollapseItem } from 'naive-ui'
import { isSuccessResponse, Log } from '@root/shared'
import { useConfigStore } from '@/stores/config'

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
const template = `
{
    article: {
        title: string
        contents: string[]
    }
    questions: {
        number: number
        type: string
        question: string
        options: string[]
        answer: number
    }[]
    vocabList: {
        word: string
        definition: string
    }[]
    structure: {
        paragraph_focus: string[]
    }
}
`

const jlpt_article = ref<Partial<JLPT_Read> | null>(null)
const isGenerating = ref(false)

async function generateArticle() {
    const jsonBrook = createJsonBrook()
    isGenerating.value = true
    let flag = ''
    let isJsoning = false
    reasoningString.value = ''
    jsonString.value = ''
    jlpt_article.value = null
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
                jlpt_article.value = jsonBrook.getCurrent()
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
})
</script>

<template>
    <div class="flex flex-col gap-5">
        <div class="flex gap-5">
            <n-input v-model:value="theme" type="text" placeholder="请输入主题" />
            <n-select v-model:value="level" :options="levelOptions" />
            <n-select v-model:value="currentLLMID" :options="llmOptions" />
            <n-button
                type="primary"
                @click="generateArticle"
                :loading="isGenerating"
                :disabled="isGenerating"
            >
                {{ isGenerating ? '生成中' : '开始生成' }}
            </n-button>
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
                <n-collapse-item v-if="jlpt_article?.article?.title" title="阅读" name="3">
                    <n-divider />
                    <!-- 阅读题卡片 -->
                    <n-card :title="jlpt_article?.article?.title">
                        <!-- 内容部分 -->
                        <div v-if="jlpt_article?.article?.contents" class="flex flex-col gap-5">
                            <div v-for="content in jlpt_article?.article.contents">
                                {{ content }}
                            </div>
                        </div>
                        <n-divider />
                        <!-- 问题部分 -->
                        <div v-if="jlpt_article?.questions" class="flex flex-col gap-5">
                            <div
                                v-for="question in jlpt_article?.questions"
                                class="flex flex-col gap-5 items-center"
                            >
                                <!-- 题干 -->
                                <div class="flex gap-5 items-center">
                                    <div>{{ question.number }}</div>
                                    <div>{{ question.type }}</div>
                                    <div>{{ question.question }}</div>
                                </div>
                                <!-- 选项 -->
                                <n-button v-for="option in question.options" class="flex gap-5">
                                    {{ option }}
                                </n-button>
                            </div>
                        </div>
                    </n-card>
                </n-collapse-item>
            </n-collapse>
        </div>
    </div>
</template>
