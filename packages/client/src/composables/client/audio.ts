import { ref, onMounted, computed } from 'vue'

// 单例上下文
const context = ref<AudioContext | null>(null)

export function useAudioContext() {
    const isSafari = ref(false)

    // 检查浏览器类型和音频上下文状态
    onMounted(() => {
        if (context.value) {
            return
        }

        // 检测是否是Safari浏览器
        isSafari.value = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

        // 创建音频上下文
        try {
            context.value = new (window.AudioContext || (window as any).webkitAudioContext)()
        } catch (e) {
            console.error('AudioContext not supported', e)
            alert('当前浏览器不支持音频上下文！')
        }
    })

    /**
     * 恢复音频上下文
     */
    async function resume() {
        // 重置一下音频上下文
        if (context.value?.state !== 'closed') {
            await context.value?.resume()
        }
    }

    /**
     * 关闭音频上下文
     */
    async function close() {
        if (context.value?.state !== 'closed') {
            await context.value?.close()
        }
    }

    /**
     * 暂停音频上下文
     */
    async function suspend() {
        if (context.value?.state !== 'closed') {
            await context.value?.suspend()
        }
    }

    async function toggle() {
        if (context.value?.state === 'closed') {
            return
        } else if (context.value?.state === 'suspended') {
            await resume()
        } else {
            await suspend()
        }
    }

    return {
        isSafari,
        resume,
        close,
        suspend,
        toggle,
        isClosed: () => context.value?.state === 'closed',
        isSuspended: () => context.value?.state === 'suspended',
        isRunning: () => context.value?.state === 'running',
        state: computed(() => context.value?.state),
    }
}
