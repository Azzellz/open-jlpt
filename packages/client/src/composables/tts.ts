import API from '@/api'
import { createErrorResponse, createSuccessResponse, isSuccessResponse } from '@root/shared'
import { ref, onUnmounted, onMounted, onDeactivated, onActivated } from 'vue'
import { useAudioContext } from '.'

interface Params {
    text?: string
    voice?: 'ja-JP-KeitaNeural' | 'ja-JP-NanamiNeural'
    immediate?: boolean
}
export function useEdgeTTS(params?: Params) {
    const isLoading = ref(false)
    const isError = ref(false)
    const isSpeaking = ref(false)
    const hasAudio = ref(false)
    const progress = ref(0)
    const audioContext = useAudioContext()

    // 音频对象
    const audio = ref<HTMLAudioElement>(new Audio())
    // 更新进度
    function _updateProgress() {
        progress.value = Math.floor((audio.value!.currentTime / audio.value!.duration) * 100)
    }
    audio.value.ontimeupdate = _updateProgress

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
            audio.value.src = URL.createObjectURL(newBlob)
            hasAudio.value = true
            return createSuccessResponse(200, 'OK', audio.value.src)
        } else {
            isError.value = true
            return createErrorResponse(400, '生成失败')
        }
    }

    function toggle() {
        if (audio.value.paused) {
            isSpeaking.value = true
            play()
        } else {
            isSpeaking.value = false
            pause()
        }
    }

    function play() {
        audio.value.play().catch((error) => {
            console.error('播放失败: ' + error)
        })
    }

    function pause() {
        audio.value.pause()
    }

    function replay(delay: number = 1000) {
        const url = audio.value.src
        audio.value.src = ''
        progress.value = 0
        setTimeout(() => {
            if (audio.value && url) {
                audio.value.src = url
                audio.value.play()
            }
        }, delay)
    }

    function free() {
        URL.revokeObjectURL(audio.value.src)
        audio.value.src = ''
        hasAudio.value = false
        progress.value = 0
    }

    function onEnd(callback: () => void) {
        audio.value.onended = () => {
            audioContext.suspend()
            callback()
        }
    }

    function onPlay(callback: () => void) {
        audio.value.onplay = () => {
            audioContext.resume()
            callback()
        }
    }

    // 处理移动端浏览器首次交互播放
    function _firstInteraction() {
        play()
        document.removeEventListener('touchstart', _firstInteraction)
    }

    function _init() {
        document.addEventListener('touchstart', _firstInteraction)
    }
    function _destroy() {
        document.removeEventListener('touchstart', _firstInteraction)
        free()
    }
    onMounted(_init)
    onActivated(_init)
    onUnmounted(_destroy)
    onDeactivated(_destroy)

    params?.immediate && generate()

    return {
        isError,
        isLoading,
        generate,
        free,
        audio,
        isSpeaking,
        toggle,
        replay,
        progress,
        onEnd,
        onPlay,
        play,
        pause,
        hasAudio,
    }
}
