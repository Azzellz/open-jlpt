import { defineComponent } from 'vue'
import AiIcon from '@/components/icon/AiIcon'
import SettingIcon from '@/components/icon/SettingIcon'
import { useUserStore } from '@/stores/user'
import { Close as CloseIcon } from '@vicons/ionicons5'
import { AppsAddIn20Regular as AppsAddIn20RegularIcon } from '@vicons/fluent'
import { NDivider, NSelect, NCard, NModal, NButton, NIcon, useMessage, useDialog } from 'naive-ui'
import { computed, ref } from 'vue'
import LLMForm from '@/components/llm/LLM-Form'
import LLMCard from '@/components/llm/LLM-Card'
import type { ClientLLM_Config, LLM_Config, LLM_CreateParams } from '@root/models'
import API from '@/api'
import { nanoid } from 'nanoid'
import { isSuccessResponse } from '@root/shared'
import { mapEntries, omit } from 'radash'

const settingItemTitleClass = 'text-4xl font-bold'

// 通用设置
const CommonSetting = defineComponent(() => {
    return () => (
        <div>
            <div class="flex items-center">
                <SettingIcon size="64" />
                <div class={settingItemTitleClass}>通用设置</div>
            </div>
            <NDivider />
        </div>
    )
})

// AI模型设置
const AiSetting = defineComponent(() => {
    const userStore = useUserStore()
    const message = useMessage()
    const dialog = useDialog()
    const showLLMAddModal = ref(false)
    const showLLMEditModal = ref(false)
    const currentEditingLLM = ref<ClientLLM_Config | null>(null)

    const llms = computed<ClientLLM_Config[]>(() => {
        return [
            ...userStore.localConfig!.llm.items.map((item) => ({
                ...item,
                local: true,
            })),
            ...userStore.remoteConfig!.llm.items.map((item) => ({
                ...item,
                local: false,
            })),
        ]
    })

    //#region 模型卡片

    function handleEditLLM(llm: ClientLLM_Config) {
        showLLMEditModal.value = true
        currentEditingLLM.value = llm
    }

    async function handleDeleteLLM(llm: ClientLLM_Config) {
        dialog.warning({
            title: '警告',
            content: '你确定要删除这个模型吗？',
            positiveText: '确定',
            negativeText: '取消',
            draggable: true,
            async onPositiveClick() {
                currentEditingLLM.value = null

                // 如果默认模型是当前模型，则清空默认模型
                if (defaultLLMID.value === llm.id) {
                    defaultLLMID.value = ''
                }

                // 删除本地设置中的模型
                if (llm.local) {
                    userStore.localConfig!.llm.items = userStore.localConfig!.llm.items.filter(
                        (item) => item.id !== llm.id,
                    )
                    // 如果本地设置的默认模型是当前模型，则清空默认模型
                    if (userStore.localConfig!.llm.default === llm.id) {
                        userStore.localConfig!.llm.default = ''
                    }
                    userStore.saveLocalConfig()
                    message.success('删除成功')
                } else {
                    // 删除远程设置中的模型
                    const result = await API.User.updateUser({
                        config: {
                            llm: {
                                items: userStore.remoteConfig!.llm.items.filter(
                                    (item) => item.id !== llm.id,
                                ),
                                default:
                                    userStore.remoteConfig!.llm.default === llm.id
                                        ? ''
                                        : userStore.remoteConfig!.llm.default,
                            },
                        },
                    })
                    if (isSuccessResponse(result)) {
                        message.success('删除成功')
                        userStore.user!.config = result.data.config
                    } else {
                        message.error('删除失败')
                    }
                }
            },
        })
    }

    //#endregion

    //#region 模型表单

    // 编辑模型
    async function handleSubmitLLMEditForm(model: LLM_CreateParams, complete: () => void) {
        const updater = omit(model, ['local'])

        const remoteLLM = userStore.remoteConfig!.llm.items.find(
            (llm) => llm.id === currentEditingLLM.value?.id,
        )
        const localLLM = userStore.localConfig!.llm.items.find(
            (llm) => llm.id === currentEditingLLM.value?.id,
        )
        // 更新为本地设置
        if (model.local) {
            // 本地设置不存在，则创建
            if (!localLLM) {
                userStore.localConfig!.llm.items.push({
                    id: nanoid(),
                    ...updater,
                })
            } else {
                mapEntries(updater, (k, v) => {
                    localLLM[k] = v
                    return [k, v]
                })
            }
            userStore.saveLocalConfig()

            // 如果远程设置存在目标模型，则删除
            if (remoteLLM) {
                userStore.user!.config.llm.items = userStore.user!.config.llm.items.filter(
                    (llm) => llm.id !== currentEditingLLM.value?.id,
                )
                const result = await API.User.updateUser({
                    config: userStore.user!.config,
                })

                if (isSuccessResponse(result)) {
                    message.success('更新成功')
                    showLLMEditModal.value = false
                } else {
                    message.error('更新失败')
                }
            } else {
                message.success('更新成功')
                showLLMEditModal.value = false
            }

            complete()
        } else {
            // 更新为远程设置
            if (!remoteLLM) {
                userStore.user!.config.llm.items.push({
                    id: nanoid(),
                    ...updater,
                })
            } else {
                mapEntries(updater, (k, v) => {
                    remoteLLM[k] = v
                    return [k, v]
                })
            }

            // 如果本地设置存在目标模型，则删除
            if (localLLM) {
                userStore.localConfig!.llm.items = userStore.localConfig!.llm.items.filter(
                    (llm) => llm.id !== currentEditingLLM.value?.id,
                )
                userStore.saveLocalConfig()
            }

            const result = await API.User.updateUser({
                config: userStore.user!.config,
            })
            if (isSuccessResponse(result)) {
                message.success('更新成功')
                showLLMEditModal.value = false
            } else {
                message.error('更新失败')
            }

            complete()
        }
    }

    // 添加模型
    async function handleSubmitLLMAddForm(model: LLM_CreateParams, complete: () => void) {
        // 重名检查
        if (userStore.mergedConfig.llm.items.find((llm) => llm.name === model.name)) {
            return message.error('存在相同名称的模型！')
        }

        const newLLM: LLM_Config = {
            id: nanoid(),
            ...model,
        }

        // 添加到本地设置
        if (model.local) {
            userStore.localConfig!.llm.items.push(newLLM)
            userStore.saveLocalConfig()
        } else {
            // 添加到远程设置
            const result = await API.User.updateUser({
                config: {
                    llm: {
                        items: [...userStore.remoteConfig!.llm.items, newLLM],
                        default: userStore.remoteConfig!.llm.default,
                    },
                },
            })

            if (isSuccessResponse(result)) {
                message.success('添加成功')
                userStore.user!.config.llm.items = result.data.config.llm.items
            } else {
                message.error('添加失败')
            }
        }

        showLLMAddModal.value = false
        complete()
    }
    

    //#endregion

    //#region 默认模型
    const defaultLLMID = ref(userStore.mergedConfig.llm.default || void 0)
    const defaultLLMOptions = computed(() => {
        return userStore.mergedConfig!.llm.items.map((llm) => {
            return {
                label: llm.name,
                value: llm.id,
            }
        })
    })
    async function handleEditDefaultLLM(llmID: string) {
        // 如果默认模型相同，则不更新
        if (llmID === defaultLLMID.value) {
            return
        }

        const isRemoteLLM = !!userStore.remoteConfig!.llm.items.find((llm) => llm.id === llmID)

        // 将远程模型设置为默认模型
        if (isRemoteLLM) {
            const result = await API.User.updateUser({
                config: {
                    llm: {
                        items: userStore.remoteConfig!.llm.items,
                        default: llmID,
                    },
                },
            })
            if (isSuccessResponse(result)) {
                message.success('更新成功')
                userStore.user!.config.llm.default = llmID
                // 本地设置的默认模型清空
                userStore.localConfig!.llm.default = ''
                userStore.saveLocalConfig()
            } else {
                message.error('更新失败')
                console.error(result)
            }
        } else {
            // 将本地模型设置为默认模型
            userStore.localConfig!.llm.default = llmID
            userStore.saveLocalConfig()
            // 远程设置的默认模型清空
            userStore.user!.config.llm.default = ''
            const result = await API.User.updateUser({
                config: {
                    llm: {
                        items: userStore.remoteConfig!.llm.items,
                        default: '',
                    },
                },
            })
            if (isSuccessResponse(result)) {
                message.success('更新成功')
            } else {
                message.error('更新失败')
                console.error(result)
            }
        }
    }

    //#endregion

    return () => (
        <div class="flex-y">
            <div class="ml-3 flex items-center gap-2">
                <AiIcon size="40" />
                <div class={settingItemTitleClass}>AI模型设置</div>
            </div>
            <NDivider />
            <div class="flex-y gap-5">
                {/* <!-- 添加模型 --> */}
                <div class="flex-y gap-3">
                    <div class="flex-y">
                        <div class="flex">
                            <NButton
                                class="text-lg"
                                text
                                onClick={() => (showLLMAddModal.value = true)}
                            >
                                <NIcon size="24" component={AppsAddIn20RegularIcon} />
                                <span>添加模型</span>
                            </NButton>
                        </div>
                        <div class="text-gray-400 text-12px">
                            推荐优先设置为本地设置，这样更安全
                        </div>
                    </div>
                    {llms.value.length && (
                        <div class="flex-x flex-wrap gap-5">
                            {llms.value.map((llm) => {
                                const local = !!userStore.localConfig!.llm.items.find(
                                    (item) => item.id === llm.id,
                                )
                                return (
                                    <LLMCard
                                        class="w-100"
                                        llm={{ ...llm, local }}
                                        onEdit={handleEditLLM}
                                        onDelete={handleDeleteLLM}
                                    />
                                )
                            })}
                        </div>
                    )}

                    {/* <!-- 模型添加/编辑 模态框表单 --> */}
                    <NModal v-model:show={showLLMAddModal.value}>
                        <NCard
                            class="max-w-150"
                            hoverable
                            title={() => (
                                <>
                                    <div>添加新模型</div>
                                    <div class="text-gray text-sm">
                                        目前只支持Generic OpenAI格式
                                    </div>
                                </>
                            )}
                            headerExtra={() => (
                                <NButton text onClick={() => (showLLMAddModal.value = false)}>
                                    <NIcon component={CloseIcon} size="32" />
                                </NButton>
                            )}
                        >
                            <LLMForm onSubmit={handleSubmitLLMAddForm} />
                        </NCard>
                    </NModal>

                    <NModal v-model:show={showLLMEditModal.value}>
                        <NCard
                            class="max-w-150"
                            hoverable
                            title="编辑模型"
                            headerExtra={() => (
                                <NButton text onClick={() => (showLLMEditModal.value = false)}>
                                    <NIcon component={CloseIcon} size="32" />
                                </NButton>
                            )}
                        >
                            <LLMForm
                                onSubmit={handleSubmitLLMEditForm}
                                model={currentEditingLLM.value!}
                            />
                        </NCard>
                    </NModal>
                </div>
                {/*<!-- 有模型才展示更多选项 -->*/}
                {llms.value.length && (
                    <div class="flex-y gap-1 w-75">
                        <span class="text-gray">默认模型</span>
                        <NSelect
                            v-model:value={defaultLLMID.value}
                            options={defaultLLMOptions.value}
                            onUpdateValue={handleEditDefaultLLM}
                        />
                    </div>
                )}
            </div>
        </div>
    )
})

export default defineComponent(() => {
    return () => (
        <div class="gap-10">
            {/* <!-- 通用设置 --> */}
            <CommonSetting />
            {/* <!-- AI模型设置 --> */}
            <AiSetting />
        </div>
    )
})
