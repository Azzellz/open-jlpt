import { defineComponent, type SetupContext } from 'vue'
import type { LLM_Config } from '@root/models'
import { NCard, NButton, NIcon, NDivider } from 'naive-ui'
import {
    CalendarEdit20Regular as CalendarEdit20RegularIcon,
    Delete20Regular as Delete20RegularIcon,
} from '@vicons/fluent'

interface Props {
    llm: LLM_Config
    onEdit?: (llm: LLM_Config) => void
    onDelete?: (llm: LLM_Config) => void
}

export default defineComponent((props: Props) => {
    return () => (
        <NCard
            title={props.llm.name}
            hoverable
            headerExtra={() => (
                <div class="flex items-center">
                    <NButton text onClick={() => props.onEdit?.(props.llm)}>
                        <NIcon size="24" component={CalendarEdit20RegularIcon} />
                    </NButton>
                    <NDivider vertical />
                    <NButton text onClick={() => props.onDelete?.(props.llm)}>
                        <NIcon size="24" component={Delete20RegularIcon} />
                    </NButton>
                </div>
            )}
        >
            <div class="flex flex-col gap-1 text-gray">
                <div>ApiKey: {props.llm.apiKey}</div>
                <div>BaseURL: {props.llm.baseURL}</div>
                <div>ModelID: {props.llm.modelID}</div>
            </div>
        </NCard>
    )
})
