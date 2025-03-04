<template>
    <!-- 设置 -->
    <div class="flex flex-col gap-10">
        <!-- 通用设置 -->
        <div>
            <div class="flex items-center">
                <SettingIcon size="64" />
                <div class="setting-item-title">通用设置</div>
            </div>
            <n-divider />
        </div>
        <!-- AI模型设置 -->
        <div class="flex flex-col">
            <div class="ml-3 flex items-center gap-2">
                <AiIcon size="40"></AiIcon>
                <div class="setting-item-title">AI模型设置</div>
            </div>
            <n-divider />
            <div class="flex flex-col gap-5">
                <!-- 添加模型 -->
                <div class="flex flex-col gap-2">
                    <div class="flex">
                        <n-button class="text-lg" text @click="showLLMAddModal = true">
                            <n-icon size="24" :component="AppsAddIn20RegularIcon" />
                            <span>添加模型</span>
                        </n-button>
                    </div>
                    <div v-if="config.llm.items.length" class="flex gap-5">
                        <n-card
                            v-for="llm in config.llm.items"
                            class="w-auto"
                            :title="llm.name"
                            hoverable
                        >
                            <template #header-extra>
                                <div class="flex items-center">
                                    <n-button text @click="handleEditLLM(llm)">
                                        <n-icon size="24" :component="CalendarEdit20RegularIcon" />
                                    </n-button>
                                    <n-divider vertical />
                                    <n-button text @click="handleDeleteLLM(llm)">
                                        <n-icon size="24" :component="Delete20RegularIcon" />
                                    </n-button>
                                </div>
                            </template>
                            <div class="flex flex-col gap-1 text-gray">
                                <div>ApiKey: {{ llm.apiKey }}</div>
                                <div>BaseURL: {{ llm.baseURL }}</div>
                                <div>ModelID: {{ llm.modelID }}</div>
                            </div>
                        </n-card>
                    </div>

                    <!-- 模型添加 模态框表单 -->
                    <n-modal v-model:show="showLLMAddModal">
                        <n-card class="max-w-150" hoverable>
                            <template #header>
                                <div>添加新模型</div>
                                <div class="text-gray text-sm">目前只支持Generic OpenAI格式</div>
                            </template>
                            <template #header-extra>
                                <n-button text @click="showLLMAddModal = false">
                                    <n-icon :component="CloseIcon" size="32" />
                                </n-button>
                            </template>
                            <LLMForm @submit="handleSubmitLLMAddForm" />
                        </n-card>
                    </n-modal>

                    <n-modal v-model:show="showLLMEditModal">
                        <n-card class="max-w-150" hoverable title="编辑模型">
                            <template #header-extra>
                                <n-button text @click="showLLMEditModal = false">
                                    <n-icon :component="CloseIcon" size="32" />
                                </n-button>
                            </template>
                            <LLMForm
                                @submit="handleSubmitLLMEditForm"
                                :model="currentEditingLLM!"
                            />
                        </n-card>
                    </n-modal>
                </div>
                <!-- 默认模型配置 -->
                <div class="flex flex-col gap-1 w-75">
                    <span class="text-gray">默认模型</span>
                    <n-select v-model:value="defaultLLMID" :options="defaultLLMOptions" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import AiIcon from '@/components/icon/AiIcon.vue'
import SettingIcon from '@/components/icon/SettingIcon.vue'
import { useUserStore } from '@/stores/user'
import { Close as CloseIcon } from '@vicons/ionicons5'
import {
    CalendarEdit20Regular as CalendarEdit20RegularIcon,
    Delete20Regular as Delete20RegularIcon,
    AppsAddIn20Regular as AppsAddIn20RegularIcon,
} from '@vicons/fluent'
import { NDivider, NSelect, NCard, NModal, NButton, NIcon, useMessage } from 'naive-ui'
import { computed, ref } from 'vue'
import LLMForm from '../llm/LLM-Form.vue'
import type { LLM_Config } from '@root/models'
import API from '@/api'
import { nanoid } from 'nanoid'
import { isSuccessResponse } from '@root/shared'
import { mapEntries } from 'radash'

const userStore = useUserStore()
const message = useMessage()
const config = computed(() => {
    return userStore.user!.config
})

//#region AI模型设置

const showLLMAddModal = ref(false)
const showLLMEditModal = ref(false)
const currentEditingLLM = ref<LLM_Config | null>(null)
function handleEditLLM(llm: LLM_Config) {
    showLLMEditModal.value = true
    currentEditingLLM.value = llm
}
async function handleDeleteLLM(llm: LLM_Config) {
    currentEditingLLM.value = null
    const result = await API.User.updateUser(userStore.user!.id, {
        config: {
            llm: {
                items: config.value.llm.items.filter((item) => item.id !== llm.id),
            },
        },
    })
    if (isSuccessResponse(result)) {
        message.success('删除成功')
        userStore.user!.config.llm.items = result.data.config.llm.items
    } else {
        message.error('删除失败')
    }
}
async function handleSubmitLLMEditForm(model: Omit<LLM_Config, 'id'>, complete: () => void) {
    const llm = config.value.llm.items.find((llm) => llm.id === currentEditingLLM.value?.id)!
    mapEntries(model, (k, v) => {
        llm[k] = v
        return [k, v]
    })

    const result = await API.User.updateUser(userStore.user!.id, {
        config: config.value,
    })
    complete()
    if (isSuccessResponse(result)) {
        message.success('更新成功')
        showLLMEditModal.value = false
    } else {
        message.error('更新失败')
    }
}
async function handleSubmitLLMAddForm(model: Omit<LLM_Config, 'id'>, complete: () => void) {
    // 重名检查
    if (config.value.llm.items.find((llm) => llm.name === model.name)) {
        return message.error('存在相同名称的模型！')
    }

    const newLLM = {
        id: nanoid(),
        ...model,
    }
    const result = await API.User.updateUser(userStore.user!.id, {
        config: {
            llm: {
                items: [...config.value.llm.items, newLLM],
            },
        },
    })
    complete()
    if (isSuccessResponse(result)) {
        message.success('添加成功')
        showLLMAddModal.value = false
        userStore.user!.config.llm.items = result.data.config.llm.items
    } else {
        message.error('添加失败')
    }
}

const defaultLLMID = ref()
const defaultLLMOptions = computed(() => {
    return userStore.user!.config.llm.items.map((llm) => {
        return {
            label: llm.name,
            value: llm.id,
        }
    })
})

//#endregion
</script>

<style scoped>
.setting-item-title {
    @apply text-4xl font-bold;
}
</style>
