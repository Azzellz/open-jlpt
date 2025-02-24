<template>
    <!-- 阅读题卡片 -->
    <n-card>
        <template #header>
            <div class="flex gap-3 items-center">
                <n-tag size="small" :type="difficultyColorMap[read.difficulty || 'N5']">{{
                    read.difficulty
                }}</n-tag>
                <span v-text="read.article?.title" />
            </div>
        </template>
        <!-- 交互栏 -->
        <template #header-extra>
            <div class="flex gap-5">
                <n-button ghost type="info" @click="handleSubmitAnswers" :disabled="!isAllowSubmit">
                    <span class="font-bold">{{
                        isAllowSubmit ? '提交答案' : '请完成所有问题'
                    }}</span>
                </n-button>
                <n-button v-if="isSubmitted" ghost type="success" @click="handleReAnswer">
                    <span class="font-bold">重新答题</span>
                </n-button>
                <n-button ghost type="warning">
                    <span class="font-bold"> 收藏 </span>
                </n-button>
            </div>
        </template>
        
        <!-- 内容部分 -->
        <TextSelectMenu>
            <!-- 默认插槽内容 -->
            <template #default>
                <div v-if="read.article?.contents" class="flex flex-col gap-5">
                    <div v-for="content in read.article.contents">
                        {{ content }}
                    </div>
                </div>
                <n-divider />
                <!-- 词汇表 -->
                <div class="flex flex-col gap-5" v-if="read.vocabList?.length">
                    <div class="text-lg">词汇表</div>
                    <div class="flex flex-wrap gap-5">
                        <JLPT_ReadVocabCard
                            class="min-w-50 max-w-75 flex-1"
                            v-for="vocab in read.vocabList"
                            :vocab="vocab"
                        />
                    </div>
                </div>
                <n-divider />
                <!-- 问题部分 -->
                <div v-if="read.questions" class="flex flex-col gap-5">
                    <div
                        v-for="(question, questionIndex) in read.questions"
                        class="flex flex-col gap-5"
                    >
                        <!-- 题干 -->
                        <div class="flex items-center font-bold gap-2">
                            <n-tag type="primary" size="small">{{ question.type }}</n-tag>
                            <div>{{ question.question }}</div>
                        </div>
                        <!-- 选项 -->
                        <div
                            class="ml-2.5 flex gap-2 items-center"
                            v-for="(option, optionIndex) in question.options"
                        >
                            <n-radio
                                :checked="selects[questionIndex] === optionIndex + 1"
                                :value="optionIndex + 1"
                                :disabled="isSubmitted"
                                @change="
                                    () => {
                                        selects[questionIndex] = optionIndex + 1
                                        answerCount++
                                    }
                                "
                            >
                                {{ option }}
                            </n-radio>
                            <!-- 正确与错误 -->
                            <template v-if="isSubmitted">
                                <SuccessIcon v-if="optionIndex === question.answer" size="16" />
                                <ErrorIcon v-else size="16" />
                            </template>
                        </div>
                        <!-- 解析 -->
                        <div v-if="isSubmitted" class="text-gray ml-2.5 italic">
                            {{ question.analysis }}
                        </div>
                        <n-divider />
                    </div>
                </div>
            </template>

            <!-- 自定义菜单
            <template #menu="{ selectedText }">
                <button @click="console.log(selectedText)">自定义操作</button>
            </template> -->
        </TextSelectMenu>
    </n-card>
</template>

<script setup lang="ts">
import type { JLPT_Read } from '@root/models'
import { NCard, NDivider, NRadio, NTag, NButton } from 'naive-ui'
import { computed, ref } from 'vue'
import JLPT_ReadVocabCard from './JLPT-ReadVocabCard.vue'
import ErrorIcon from '@/components/icon/ErrorIcon.vue'
import SuccessIcon from '@/components/icon/SuccessIcon.vue'
import TextSelectMenu from '@/components/tools/TextSelectMenu.vue'

const { read } = defineProps<{
    read: Partial<JLPT_Read>
}>()

const selects = ref<number[]>([])
// 记录已经回答的题数
const answerCount = ref(0)
const isAllowSubmit = computed(() => {
    return answerCount.value === read.questions?.length
})

const isSubmitted = ref(false)
async function handleSubmitAnswers() {
    isSubmitted.value = true
}
async function handleReAnswer() {
    isSubmitted.value = false
    selects.value = []
    answerCount.value = 0
}

// 映射难度标签的颜色
const difficultyColorMap: Record<
    JLPT_Read['difficulty'],
    'error' | 'warning' | 'info' | 'success' | 'default' | 'primary' | undefined
> = {
    N1: 'error',
    N2: 'warning',
    N3: 'info',
    N4: 'success',
    N5: 'success',
}
</script>
