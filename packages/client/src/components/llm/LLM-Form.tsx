import { defineComponent, ref } from 'vue'
import type { LLM_Config } from '@root/models'
import { NGrid, NFormItemGi, NInput, NForm, type FormInst, NButton, type FormRules } from 'naive-ui'

interface Props {
    model?: Omit<LLM_Config, 'id'>
    onSubmit?: (model: Omit<LLM_Config, 'id'>, complete: () => void) => void
}
export default defineComponent((props: Props) => {
    const _emptyLLMModel = {
        name: '',
        apiKey: '',
        baseURL: '',
        modelID: '',
    }

    const isLoading = ref(false)
    const formModel = ref<Omit<LLM_Config, 'id'>>({
        ..._emptyLLMModel,
        ...props.model,
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
        console.log(1)
        e.preventDefault()
        formRef.value?.validate(async (errors) => {
            if (errors) {
                return console.log(errors)
            }
            isLoading.value = true
            props.onSubmit?.(formModel.value, () => (isLoading.value = false))
        })
    }
    function handleResetForm() {
        formModel.value = {
            ..._emptyLLMModel,
        }
    }
    return () => (
        <NForm ref={formRef} model={formModel.value} rules={rules}>
            <NGrid cols="24" xGap="24" yGap="12">
                <NFormItemGi required span="8" label="Name" path="name">
                    <NInput v-model:value={formModel.value.name} />
                </NFormItemGi>
                <NFormItemGi required span="16" label="ApiKey" path="apiKey">
                    <NInput v-model:value={formModel.value.apiKey} />
                </NFormItemGi>
                <NFormItemGi required span="14" label="BaseURL" path="baseURL">
                    <NInput v-model:value={formModel.value.baseURL} />
                </NFormItemGi>
                <NFormItemGi required span="10" label="ID" path="modelID">
                    <NInput v-model:value={formModel.value.modelID} />
                </NFormItemGi>
                <NFormItemGi class="px-10" span="12">
                    <NButton
                        class="w-full"
                        type="primary"
                        onClick={handleSubmitForm}
                        loading={isLoading.value}
                    >
                        提交
                    </NButton>
                </NFormItemGi>
                <NFormItemGi class="px-10" span="12">
                    <NButton class="w-full" type="warning" onClick={handleResetForm}>
                        重置
                    </NButton>
                </NFormItemGi>
            </NGrid>
        </NForm>
    )
})
