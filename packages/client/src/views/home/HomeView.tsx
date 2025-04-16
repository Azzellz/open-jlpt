import { defineComponent } from 'vue'
import SakuraRain from '@/components/tools/SakuraRain'
import AppChat from '@/components/app/AppChat'

export default defineComponent(() => {
    return () => (
        <SakuraRain class="flex-1 flex-y overflow-auto">
            <AppChat class="flex-1 overflow-auto" />
        </SakuraRain>
    )
})
