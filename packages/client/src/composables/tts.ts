import API from '@/api'
import { createErrorResponse, createSuccessResponse, isSuccessResponse } from '@root/shared'
import { ref, computed, watch, onUnmounted, onMounted, onDeactivated, onActivated } from 'vue'

interface Params {
    text?: string
    voice?: 'ja-JP-KeitaNeural' | 'ja-JP-NanamiNeural'
    immediate?: boolean
}
export function useEdgeTTS(params?: Params) {
    const url = ref('')
    const isLoading = ref(false)
    const isError = ref(false)
    const isSpeaking = ref(false)
    const audio = computed(() => {
        return url.value ? new Audio(url.value) : null
    })
    const progress = ref(0)
    async function generate(
        text: string = params?.text ||
            '日本語能力試験を学習するためのAI主導のプラットフォームで、日本語能力試験の全問題形式とパーソナライズされた学習コンテンツをサポートします。',
        voice: Params['voice'] = params?.voice || 'ja-JP-NanamiNeural',
    ) {
        // 生成前先释放之前的 ObjectURL
        free()
        isLoading.value = true
        const result = await API.TTS.createTTS({
            text,
            voice,
        })
        isLoading.value = false
        if (isSuccessResponse(result)) {
            isError.value = false
            const newBlob = new Blob([result.data], { type: 'audio/mpeg' })
            url.value = URL.createObjectURL(newBlob)
            return createSuccessResponse(200, 'OK', url.value)
        } else {
            isError.value = true
            return createErrorResponse(400, '生成失败')
        }
    }
    function toggle() {
        if (!audio.value) {
            return
        }
        if (audio.value.paused) {
            isSpeaking.value = true
            audio.value.play()
        } else {
            isSpeaking.value = false
            audio.value.pause()
        }
    }
    function replay() {
        if (audio.value) {
            audio.value.src = ''
            setTimeout(() => {
                if (audio.value && url.value) {
                    audio.value.src = url.value
                    audio.value.play()
                }
            }, 1000)
        }
    }

    function free() {
        if (audio.value) {
            audio.value.src = ''
            URL.revokeObjectURL(url.value)
        }
    }
    onUnmounted(free)

    // 监听进度
    function _updateProgress() {
        progress.value = Math.floor((audio.value!.currentTime / audio.value!.duration) * 100)
    }

    function _autoPlay() {
        if (audio.value) {
            audio.value.play()
        }
    }
    watch(audio, () => {
        audio.value?.addEventListener('timeupdate', _updateProgress)
    })
    onMounted(() => {
        document.addEventListener('touchstart', _autoPlay)
    })
    onActivated(() => {
        document.addEventListener('touchstart', _autoPlay)
    })
    onUnmounted(() => {
        audio.value?.removeEventListener('timeupdate', _updateProgress)
        document.removeEventListener('touchstart', _autoPlay)
    })
    onDeactivated(() => {
        document.removeEventListener('touchstart', _autoPlay)
    })

    params?.immediate && generate()

    return { url, isError, isLoading, generate, free, audio, isSpeaking, toggle, replay, progress }
}
