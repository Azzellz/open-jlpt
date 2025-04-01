export function getClientType() {
    return 'ontouchstart' in window ? 'mobile' : 'desktop'
}
export function getClientSize(): 'sm' | 'md' | 'lg' | 'xl' | '2xl' {
    const width = window.innerWidth
    if (width < 768) {
        return 'sm'
    } else if (width < 1024) {
        return 'md'
    } else if (width < 1280) {
        return 'lg'
    } else if (width < 1536) {
        return 'xl'
    } else {
        return '2xl'
    }
}
