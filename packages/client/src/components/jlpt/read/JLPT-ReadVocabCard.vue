<template>
    <n-card hoverable :title="vocab.word" size="small">
        <template #header-extra>
            <n-button quaternary circle size="small" type="warning">
                <template #icon>
                    <StarIcon size="20" />
                </template>
            </n-button>
        </template>
        {{ vocab.definition }}
    </n-card>
</template>

<script setup lang="ts">
import StarIcon from '@/components/icon/StarIcon.vue'
import type { JLPT_ReadVocab } from '@root/models'
import { NCard, NButton } from 'naive-ui'

defineProps<{
    vocab: JLPT_ReadVocab
}>()
</script>
