import { defineComponent } from 'vue'
import SakuraIcon from '@/components/icon/SakuraIcon'
import SakuraRain from '@/components/tools/SakuraRain'
import { useI18n } from 'vue-i18n'

export default defineComponent(() => {
    const { t } = useI18n()
    return () => (
        <SakuraRain>
            <main class="h-full flex-x items-center">
                <div class="m-auto flex-y items-center gap-10 pb-5%">
                    <div class="flex-x text-8xl gap-2 items-center max-md:flex-y max-md:text-4xl">
                        <SakuraIcon class="mb-1.5 mr-2" size="200" />
                        <div>
                            <span class="text-gray">OPEN</span>
                            <span class="text-red-300">·</span>
                            <a class="text-red underline" href="https://www.jlpt.jp">
                                JLPT
                            </a>
                        </div>
                    </div>
                    <div class="p-2 text-2xl max-md:text-lg italic text-center text-gray-300">
                        {t('guard.description')}
                    </div>
                </div>
            </main>
        </SakuraRain>
    )
})
