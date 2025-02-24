<template>
    <!-- 阅读题卡片 -->
    <n-card :title="read.article?.title">
        <template #header-extra>
            <div class="flex gap-5">
                <n-button ghost type="primary">
                    <span class="font-bold">提交答案</span>
                </n-button>
                <n-button ghost type="warning">
                    <span class="font-bold"> 收藏 </span>
                </n-button>
            </div>
        </template>
        <!-- 内容部分 -->
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
            <div v-for="(question, questionIndex) in read.questions" class="flex flex-col gap-5">
                <!-- 题干 -->
                <div class="flex items-center font-bold gap-2">
                    <n-tag type="primary" size="small">{{ question.type }}</n-tag>
                    <div>{{ question.question }}</div>
                </div>
                <!-- 选项 -->
                <n-radio
                    v-for="(option, optionIndex) in question.options"
                    class="ml-2.5"
                    :checked="selects[questionIndex] === optionIndex + 1"
                    :value="optionIndex + 1"
                    @change="
                        () => {
                            selects[questionIndex] = optionIndex + 1
                        }
                    "
                >
                    {{ option }}
                </n-radio>
            </div>
        </div>
    </n-card>
</template>

<script setup lang="ts">
import type { JLPT_Read } from '@root/models'
import { NCard, NDivider, NRadio, NTag, NButton } from 'naive-ui'
import { ref } from 'vue'
import JLPT_ReadVocabCard from './JLPT-ReadVocabCard.vue'

const { read } = defineProps<{
    read: Partial<JLPT_Read>
}>()

const selects = ref<number[]>([])
</script>
