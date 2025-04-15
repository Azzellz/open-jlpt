import type { JLPT_ReadText } from '@root/models/jlpt/common'

/**
 * 根据汉字假名映射表，分离日语文本中的汉字和假名
 * @param text 要处理的日语文本
 * @param kanjiMap 汉字假名映射表，key为汉字，value为假名读音
 * @returns 按原始顺序包含汉字和假名的数组
 */
export function separateJapaneseText(
    text: string,
    kanjiMap: Record<string, string>,
): Array<JLPT_ReadText> {
    // 结果数组
    const result: Array<JLPT_ReadText> = []

    // 当前处理的片段
    let currentSegment = ''
    let currentType: 'kanji' | 'kana' | 'other' | null = null

    // 判断字符是汉字、假名还是其他
    const getCharType = (char: string): 'kanji' | 'kana' | 'other' => {
        // 汉字范围：CJK统一汉字 (U+4E00-U+9FFF)
        if (/[\u4E00-\u9FFF]/.test(char)) {
            return 'kanji'
        }
        // 平假名范围 (U+3040-U+309F) 和片假名范围 (U+30A0-U+30FF)
        else if (/[\u3040-\u309F\u30A0-\u30FF]/.test(char)) {
            return 'kana'
        }
        // 其他字符（包括标点、数字、罗马字等）
        else {
            return 'other'
        }
    }

    // 遍历文本中的每个字符
    for (let i = 0; i < text.length; i++) {
        const char = text[i]
        const charType = getCharType(char)

        // 如果是新片段的开始或者类型发生变化
        if (currentType === null || charType !== currentType) {
            // 如果有当前片段，先保存
            if (currentSegment) {
                if (currentType === 'kanji') {
                    // 查找汉字对应的假名读音
                    const kana = kanjiMap[currentSegment] || ''
                    result.push({ type: currentType, text: currentSegment, kana })
                } else {
                    result.push({ type: currentType!, text: currentSegment })
                }
            }

            // 重置为新片段
            currentSegment = char
            currentType = charType
        }
        // 如果类型相同，继续累加到当前片段
        else {
            currentSegment += char
        }
    }

    // 处理最后一个片段
    if (currentSegment) {
        if (currentType === 'kanji') {
            const kana = kanjiMap[currentSegment] || ''
            result.push({ type: currentType, text: currentSegment, kana })
        } else {
            result.push({ type: currentType!, text: currentSegment })
        }
    }

    return result
}

// 更高级版本：处理复合汉字短语
export function advancedSeparateJapaneseText(
    text: string,
    kanjiMap: Record<string, string>,
): Array<{
    type: 'kanji' | 'kana' | 'other'
    text: string
    reading?: string
}> {
    const result = separateJapaneseText(text, kanjiMap)

    // 进一步处理多字汉字组合
    // 例如："日本語" 可能在映射表中有整体的读音
    const finalResult: Array<JLPT_ReadText> = []
    let i = 0

    while (i < result.length) {
        if (result[i].type === 'kanji') {
            // 尝试与后续的汉字组合，看是否有整体读音
            let combined = result[i].text
            let j = i + 1
            let maxMatchLength = 0
            let bestMatch = ''

            // 向前查找可能的汉字组合
            while (j < result.length && result[j].type === 'kanji') {
                combined += result[j].text

                // 检查当前组合是否存在于映射表中
                if (kanjiMap[combined] && combined.length > maxMatchLength) {
                    maxMatchLength = combined.length
                    bestMatch = combined
                }

                j++
            }

            // 如果找到更长的匹配
            if (maxMatchLength > result[i].text.length) {
                finalResult.push({
                    type: 'kanji',
                    text: bestMatch,
                    kana: kanjiMap[bestMatch],
                })

                // 跳过已合并的汉字
                i += maxMatchLength
            } else {
                finalResult.push(result[i])
                i++
            }
        } else {
            finalResult.push(result[i])
            i++
        }
    }

    return finalResult
}
