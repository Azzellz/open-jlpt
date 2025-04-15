import { onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { useAudioContext } from './client/audio'

export function useSTT() {
    // 定义语音识别对象
    const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    let recognition = new SpeechRecognition()
    const isSpeeching = ref(false)
    const speechText = ref('')

    // 集成音频上下文模块
    const audioContext = useAudioContext()

    function _init() {
        if (SpeechRecognition) {
            // 配置参数
            recognition = new SpeechRecognition()
            // recognition.continuous = false
            // recognition.interimResults = false
            // recognition.maxAlternatives = 1
            recognition.lang = 'ja-JP'

            // 默认错误处理
            recognition.onerror = (event: any) => {
                if (event.error !== 'aborted') {
                    alert('识别错误:' + event.error)
                }
                isSpeeching.value = false
            }
            recognition.onend = () => {
                isSpeeching.value = false
            }
        } else {
            alert('当前浏览器不支持语音识别')
        }
    }

    // 检查浏览器是否支持语音识别
    function _checkSupport() {
        const result = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (!result) {
            alert('当前浏览器不支持语音识别')
        }
        return result
    }

    function start() {
        if (!_checkSupport()) {
            return
        }
        audioContext.resume()
        isSpeeching.value = true
        recognition.start()
    }

    function stop() {
        if (!_checkSupport()) {
            return
        }
        audioContext.suspend()
        isSpeeching.value = false
        recognition.stop()
    }

    function abort() {
        if (!_checkSupport()) {
            return
        }
        audioContext.close()
        isSpeeching.value = false
        recognition.abort()
    }

    function reset() {
        if (!_checkSupport()) {
            return
        }
        _init()
    }

    function onError(callback: (error: any) => void) {
        if (!_checkSupport()) {
            return
        }
        recognition.onerror = (event: any) => {
            isSpeeching.value = false
            audioContext.suspend()
            callback(event.error)
        }
    }

    function onResult(callback: (result: string) => void) {
        if (!_checkSupport()) {
            return
        }
        recognition.onresult = (event: any) => {
            const result: SpeechRecognitionResult = event.results[0]
            const transcript: string = result[0].transcript
            speechText.value = transcript
            isSpeeching.value = false
            callback(transcript)
        }
    }

    function onEnd(callback: () => void) {
        if (!_checkSupport()) {
            return
        }
        recognition.onend = () => {
            isSpeeching.value = false
            audioContext.suspend()
            callback()
        }
    }

    function setLanguage(language: 'zh-CN' | 'ja-JP') {
        if (!_checkSupport()) {
            return
        }
        recognition.lang = language
    }

    onMounted(() => {
        _init()
    })

    onUnmounted(abort)
    onDeactivated(abort)
    return {
        start,
        stop,
        onResult,
        onError,
        abort,
        onEnd,
        setLanguage,
        isSpeeching,
        reset,
        speechText,
    }
}
