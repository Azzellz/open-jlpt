import API from '@/api'
import { isSuccessResponse } from '@root/shared'
import { ref } from 'vue'

export function useEdgeTTS(text: string, voice: 'female' | 'male', immediate: boolean = true) {
    const url = ref('')
    const loading = ref(false)
    const isError = ref(false)
    async function generate(newText: string = text, newVoice?: 'female' | 'male') {
        const result = await API.TTS.createTTS({
            text: newText,
            voice: (newVoice || voice) === 'male' ? 'ja-JP-KeitaNeural' : 'ja-JP-NanamiNeural',
        })
        if (isSuccessResponse(result)) {
            url.value = URL.createObjectURL(result.data)
        }
    }

    immediate && generate()

    return { url, isError, loading, generate }
}
