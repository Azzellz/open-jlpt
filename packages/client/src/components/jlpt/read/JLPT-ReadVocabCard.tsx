import StarIcon from '@/components/icon/StarIcon'
import type { JLPT_ReadOrigin, JLPT_ReadVocab } from '@root/models'
import { NCard, NButton } from 'naive-ui'
import JLPT_KanaTagContainer from '../JLPT-KanaTagContainer'

interface Props {
    vocab: JLPT_ReadVocab
    class?: string
    originRead: Partial<JLPT_ReadOrigin>
}
export default function JLPT_ReadVocabCard(props: Props) {
    return (
        <NCard
            hoverable
            title={() => (
                <JLPT_KanaTagContainer
                    contents={[props.vocab.word]}
                    kanaMap={props.originRead.kanaMap!}
                />
            )}
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
            <JLPT_KanaTagContainer
                contents={[props.vocab.definition]}
                kanaMap={props.originRead.kanaMap!}
            />
        </NCard>
    )
}
