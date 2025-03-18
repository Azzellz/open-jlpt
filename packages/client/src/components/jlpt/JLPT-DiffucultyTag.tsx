import type { JLPT_Difficulty, JLPT_Read } from '@root/models'
import { NTag } from 'naive-ui'
// 映射难度标签的颜色
const difficultyColorMap: Record<
    JLPT_Read['difficulty'],
    'error' | 'warning' | 'info' | 'success' | 'default' | 'primary' | undefined
> = {
    N1: 'error',
    N2: 'warning',
    N3: 'info',
    N4: 'success',
    N5: 'success',
}

export function JLPT_DifficultyTag({ difficulty }: { difficulty?: JLPT_Difficulty }) {
    return (
        <NTag size="small" type={difficultyColorMap[difficulty || 'N5']}>
            {difficulty}
        </NTag>
    )
}
