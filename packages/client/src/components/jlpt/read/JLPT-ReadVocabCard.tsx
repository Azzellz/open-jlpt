import { defineComponent } from 'vue'
import StarIcon from '@/components/icon/StarIcon'
import type { JLPT_ReadVocab } from '@root/models'
import { NCard, NButton } from 'naive-ui'

interface Props {
    vocab: JLPT_ReadVocab
}
export default defineComponent((props: Props) => {
    return () => (
        <NCard
            hoverable
            title={props.vocab.word}
            size="small"
            v-slots={{
                default: () => props.vocab.definition,
                'header-extra': () => (
                    <NButton
                        quaternary
                        circle
                        size="small"
                        type="warning"
                        v-slots={{
                            icon: () => <StarIcon size={22} />,
                        }}
                    />
                ),
            }}
        />
    )
})
