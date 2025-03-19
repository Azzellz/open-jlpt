import StarIcon from '@/components/icon/StarIcon'
import type { JLPT_ReadVocab } from '@root/models'
import { NCard, NButton } from 'naive-ui'

interface Props {
    vocab: JLPT_ReadVocab
    class?: string
}
export default function JLPT_ReadVocabCard(props: Props) {
    return (
        <NCard
            hoverable
            title={props.vocab.word}
            size="small"
            headerExtra={() => (
                <NButton
                    quaternary
                    circle
                    size="small"
                    type="warning"
                    renderIcon={() => <StarIcon size={22} />}
                />
            )}
        >
            {props.vocab.definition}
        </NCard>
    )
}
