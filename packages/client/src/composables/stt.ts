import { ref } from 'vue'

export function useSTT() {
    // 定义语音识别对象
    const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    const isSpeaking = ref(false)

    if (SpeechRecognition) {
        // 配置参数
        // recognition.continuous = false
        // recognition.interimResults = false
        // recognition.maxAlternatives = 1
        recognition.lang = 'ja-JP'
        // 默认错误处理
        recognition.onerror = (event: any) => {
            console.error('识别错误:', event.error)
            isSpeaking.value = false
        }
        recognition.onend = () => {
            isSpeaking.value = false
        }
    } else {
        alert('当前浏览器不支持语音识别')
    }

    function checkSupport() {
        const result = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (!result) {
            alert('当前浏览器不支持语音识别')
        }
        return result
    }

    function start() {
        if (!checkSupport()) {
            return
        }
        isSpeaking.value = true
        recognition.start()
    }

    function stop() {
        if (!checkSupport()) {
            return
        }
        isSpeaking.value = false
        recognition.stop()
    }

    function abort() {
        if (!checkSupport()) {
            return
        }
        isSpeaking.value = false
        recognition.abort()
    }

    function onError(callback: (error: any) => void) {
        if (!checkSupport()) {
            return
        }
        recognition.onerror = (event: any) => {
            isSpeaking.value = false
            callback(event.error)
        }
    }

    function onResult(callback: (result: string) => void) {
        if (!checkSupport()) {
            return
        }
        recognition.onresult = (event: any) => {
            const result: SpeechRecognitionResult = event.results[0]
            const transcript: string = result[0].transcript
            isSpeaking.value = false
            callback(transcript)
        }
    }

    function onEnd(callback: () => void) {
        if (!checkSupport()) {
            return
        }
        recognition.onend = () => {
            isSpeaking.value = false
            callback()
        }
    }

    function setLanguage(language: 'zh-CN' | 'ja-JP') {
        if (!checkSupport()) {
            return
        }
        recognition.lang = language
    }
    return {
        start,
        stop,
        onResult,
        onError,
        abort,
        onEnd,
        setLanguage,
        isSpeaking,
    }
}
