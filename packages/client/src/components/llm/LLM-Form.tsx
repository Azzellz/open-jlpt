import { defineComponent, ref } from 'vue'
import type { LLM_CreateParams } from '@root/models'
import {
    NGrid,
    NFormItemGi,
    NInput,
    NForm,
    type FormInst,
    NButton,
    type FormRules,
    NSwitch,
} from 'naive-ui'


interface Props {
    model?: LLM_CreateParams
    onSubmit?: (model: LLM_CreateParams, complete: () => void) => void
}
export default defineComponent((props: Props) => {
    const _emptyLLMModel: LLM_CreateParams = {
        name: '',
        apiKey: '',
        baseURL: '',
        modelID: '',
        local: true,
    }

    const isLoading = ref(false)
    const formModel = ref({
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
        local: {
            required: true,
            trigger: 'blur',
            type: 'boolean',
        },
    }
    async function handleSubmitForm(e: MouseEvent) {
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
            <NGrid responsive="screen" cols="4 s:6 m:8" x-gap={24} yGap="12">
                <NFormItemGi required span="4 s:2 m:3" label="Name" path="name">
                    <NInput v-model:value={formModel.value.name} />
                </NFormItemGi>
                <NFormItemGi required span="4 s:4 m:5" label="ApiKey" path="apiKey">
                    <NInput v-model:value={formModel.value.apiKey} />
                </NFormItemGi>
                <NFormItemGi required span="8" label="BaseURL" path="baseURL">
                    <NInput v-model:value={formModel.value.baseURL} />
                </NFormItemGi>
                <NFormItemGi required span="3 s:4 m:6" label="ID" path="modelID">
                    <NInput v-model:value={formModel.value.modelID} />
                </NFormItemGi>
                <NFormItemGi required span="1 s:2" label="本地设置" path="local">
                    <NSwitch round={false} v-model:value={formModel.value.local} />
                </NFormItemGi>
                <NFormItemGi span="2 s:3 m:4">
                    <NButton
                        class="w-full"
                        type="primary"
                        onClick={handleSubmitForm}
                        loading={isLoading.value}
                    >
                        提交
                    </NButton>
                </NFormItemGi>
                <NFormItemGi span="2 s:3 m:4">
                    <NButton class="w-full" type="warning" onClick={handleResetForm}>
                        重置
                    </NButton>
                </NFormItemGi>
            </NGrid>
        </NForm>
    )
})
