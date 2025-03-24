import { defineComponent } from 'vue'
import SakuraRain from '@/components/tools/SakuraRain'
import AppIntroduction from '@/components/app/AppIntroduction'

export default defineComponent(() => {
    return () => (
        <SakuraRain>
            <main class="h-full flex-x items-center">
                <AppIntroduction />
            </main>
        </SakuraRain>
    )
})
