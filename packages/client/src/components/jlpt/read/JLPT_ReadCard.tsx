import type { JLPT_Read } from '@root/models'
import { NCard, NDivider, NEllipsis } from 'naive-ui'
import { JLPT_DifficultyTag } from '../JLPT-DiffucultyTag'
import type { JSX } from 'vue/jsx-runtime'

interface Props {
    read: JLPT_Read
    headerExtra?: () => JSX.Element
    actionsExtra?: () => JSX.Element
    onClick?: () => void
    class?: string
}
export default function JLPT_ReadCard(props: Props) {
    // 字数统计
    let wordCount = 0
    props.read.article.contents.forEach((c) => (wordCount += c.length))

    return (
        <div class="w-125 shadow-lg cursor-pointer" onClick={props.onClick}>
            <NCard>
                <div class="flex-y">
                    <div class="flex-y">
                        <div class="flex-x gap-2 items-center">
                            <JLPT_DifficultyTag difficulty={props.read.difficulty} />
                            <NDivider vertical />
                            <NEllipsis class="text-lg" style="max-width:250px">
                                {props.read.article.title}
                            </NEllipsis>
                            <div class="ml-auto">{props.headerExtra?.()}</div>
                        </div>
                        <div class="mt-3 text-sm">
                            <div>{props.read.article.contents[0]}</div>
                            <div class="mt-2">......... {wordCount} 字</div>
                        </div>
                    </div>
                    {props.actionsExtra?.()}
                </div>
            </NCard>
        </div>
    )
}
