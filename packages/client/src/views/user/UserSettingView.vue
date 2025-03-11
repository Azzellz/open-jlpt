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
                        <LLMCard
                            v-for="llm in config.llm.items"
                            class="w-auto"
                            :llm="llm"
                            @edit="handleEditLLM"
                            @delete="handleDeleteLLM"
                        />
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
                <!-- 有模型才展示更多选项 -->
                <template v-if="config.llm.items.length">
                    <!-- 默认模型配置 -->
                    <div class="flex flex-col gap-1 w-75">
                        <span class="text-gray">默认模型</span>
                        <n-select
                            v-model:value="defaultLLMID"
                            :options="defaultLLMOptions"
                            @update:value="handleEditDefaultLLM"
                        />
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import AiIcon from '@/components/icon/AiIcon.vue'
import SettingIcon from '@/components/icon/SettingIcon.vue'
import { useUserStore } from '@/stores/user'
import { Close as CloseIcon } from '@vicons/ionicons5'
import { AppsAddIn20Regular as AppsAddIn20RegularIcon } from '@vicons/fluent'
import { NDivider, NSelect, NCard, NModal, NButton, NIcon, useMessage, useDialog } from 'naive-ui'
import { computed, ref } from 'vue'
import LLMForm from '@/components/llm/LLM-Form.vue'
import type { LLM_Config } from '@root/models'
import API from '@/api'
import { nanoid } from 'nanoid'
import { isSuccessResponse } from '@root/shared'
import { mapEntries } from 'radash'
import LLMCard from '@/components/llm/LLM-Card.vue'

const userStore = useUserStore()
const message = useMessage()
const dialog = useDialog()
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
    dialog.warning({
        title: '警告',
        content: '你确定要删除这个模型吗？',
        positiveText: '确定',
        negativeText: '取消',
        draggable: true,
        async onPositiveClick() {
            currentEditingLLM.value = null
            const result = await API.User.updateUser({
                config: {
                    llm: {
                        items: config.value.llm.items.filter((item) => item.id !== llm.id),
                        default:
                            config.value.llm.default === llm.id ? '' : config.value.llm.default,
                    },
                },
            })
            if (isSuccessResponse(result)) {
                message.success('删除成功')
                userStore.user!.config = result.data.config
                if (defaultLLMID.value === llm.id) {
                    defaultLLMID.value = void 0
                }
            } else {
                message.error('删除失败')
            }
        },
    })
}
async function handleSubmitLLMEditForm(model: Omit<LLM_Config, 'id'>, complete: () => void) {
    const llm = config.value.llm.items.find((llm) => llm.id === currentEditingLLM.value?.id)!
    mapEntries(model, (k, v) => {
        llm[k] = v
        return [k, v]
    })

    const result = await API.User.updateUser({
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
    const result = await API.User.updateUser({
        config: {
            llm: {
                items: [...config.value.llm.items, newLLM],
                default: config.value.llm.default,
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

const defaultLLMID = ref(config.value.llm.default || void 0)
const defaultLLMOptions = computed(() => {
    return userStore.user!.config.llm.items.map((llm) => {
        return {
            label: llm.name,
            value: llm.id,
        }
    })
})
async function handleEditDefaultLLM(llmID: string) {
    if (llmID === config.value.llm.default) {
        return
    }
    const result = await API.User.updateUser({
        config: {
            llm: {
                items: config.value.llm.items,
                default: llmID,
            },
        },
    })
    if (isSuccessResponse(result)) {
        message.success('更新成功')
        config.value.llm.default = llmID
    } else {
        message.error('更新失败')
        console.error(result)
    }
}

//#endregion
</script>

<style scoped>
.setting-item-title {
    @apply text-4xl font-bold;
}
</style>
