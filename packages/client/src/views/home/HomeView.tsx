import { defineComponent } from 'vue'
import SakuraIcon from '@/components/icon/SakuraIcon'
import SakuraRain from '@/components/tools/SakuraRain'
import { useI18n } from 'vue-i18n'

export default defineComponent(() => {
    const { t } = useI18n()
    return () => (
        <SakuraRain>
            <main class="h-full flex-x items-center reactive">
                <div class="m-auto flex-y items-center gap-10">
                    <div class="flex-x text-8xl gap-2 items-center">
                        <SakuraIcon class="mb-1.5 mr-2" size="150" />
                        <span class="text-gray">OPEN</span>
                        <span class="text-red-300">·</span>
                        <a class="text-red underline" href="https://www.jlpt.jp">
                            JLPT
                        </a>
                    </div>
                    <div class="text-2xl italic text-center text-gray-300 w-200">
                        {t('guard.description')}
                    </div>
                </div>
            </main>
        </SakuraRain>
    )
})
