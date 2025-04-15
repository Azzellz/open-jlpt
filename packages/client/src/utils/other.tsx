export function removeLineBreak(text: string) {
    return text.replace(/(\r\n|\n|\r)/gm, '')
}
