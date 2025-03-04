<template>
    <n-form ref="formRef" :model="formModel" :rules="rules">
        <n-grid :cols="24" :x-gap="24" :y-gap="12">
            <n-form-item-gi required :span="8" label="Name" path="name">
                <n-input v-model:value="formModel.name" />
            </n-form-item-gi>
            <n-form-item-gi required :span="16" label="ApiKey" path="apiKey">
                <n-input v-model:value="formModel.apiKey" />
            </n-form-item-gi>
            <n-form-item-gi required :span="14" label="BaseURL" path="baseURL">
                <n-input v-model:value="formModel.baseURL" />
            </n-form-item-gi>
            <n-form-item-gi required :span="10" label="ID" path="modelID">
                <n-input v-model:value="formModel.modelID" />
            </n-form-item-gi>
            <n-form-item-gi class="px-10" :span="12">
                <n-button
                    class="w-full"
                    type="primary"
                    @click="handleSubmitForm"
                    :loading="isLoading"
                >
                    提交
                </n-button>
            </n-form-item-gi>
            <n-form-item-gi class="px-10" :span="12">
                <n-button class="w-full" type="warning" @click="handleResetForm">重置</n-button>
            </n-form-item-gi>
        </n-grid>
    </n-form>
</template>

<script setup lang="ts">
import type { LLM_Config } from '@root/models'
import { NGrid, NFormItemGi, NInput, NForm, type FormInst, NButton, type FormRules } from 'naive-ui'
import { ref } from 'vue'

const emits = defineEmits<{
    submit: [model: Omit<LLM_Config, 'id'>, complete: () => void]
}>()

const { model } = defineProps<{
    model?: Omit<LLM_Config, 'id'>
}>()

const _emptyLLMModel = {
    name: '',
    apiKey: '',
    baseURL: '',
    modelID: '',
}

const isLoading = ref(false)
const formModel = ref<Omit<LLM_Config, 'id'>>({
    ..._emptyLLMModel,
    ...model,
})

const formRef = ref<FormInst | null>(null)
const rules: FormRules = {
    name: {
        required: true,
        trigger: 'blur',
        message: 'Name 不能为空',
    },
    apiKey: {
        required: true,
        trigger: 'blur',
        message: 'ApiKey 不能为空',
    },
    baseURL: {
        required: true,
        trigger: 'blur',
        message: 'BaseURL 不能为空',
    },
    modelID: {
        required: true,
        trigger: 'blur',
        message: 'ModelID 不能为空',
    },
}
async function handleSubmitForm(e: MouseEvent) {
    e.preventDefault()
    formRef.value?.validate(async (errors) => {
        if (errors) {
            return console.log(errors)
        }
        isLoading.value = true
        emits('submit', formModel.value, () => (isLoading.value = false))
    })
}
function handleResetForm() {
    formModel.value = {
        ..._emptyLLMModel,
    }
}
</script>
