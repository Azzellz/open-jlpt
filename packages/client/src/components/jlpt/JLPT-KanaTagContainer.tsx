import { separateJapaneseText } from '@/utils'
import type { JLPT_KanaMap } from '@root/models'
import { defineComponent } from 'vue'

interface Props {
    contents: string[]
    kanaMap: JLPT_KanaMap
}
export default defineComponent((props: Props) => {
    return () => (
        <div class="flex-x flex-wrap items-end">
            {props.contents.map((content) => {
                const chunks = separateJapaneseText(content, props.kanaMap)
                return chunks.map((chunk) => {
                    if (chunk.kana) {
                        return (
                            <div class="flex-y items-center">
                                <div class="text-10px">{chunk.kana}</div>
                                <div>{chunk.text}</div>
                            </div>
                        )
                    } else {
                        return <div>{chunk.text}</div>
                    }
                })
            })}
        </div>
    )
})
