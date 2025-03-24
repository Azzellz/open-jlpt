import { useI18n } from 'vue-i18n'
import SakuraIcon from '../icon/SakuraIcon'

export default function AppIntroduction() {
    const { t } = useI18n()

    return (
        <div class="m-auto flex-y items-center gap-10">
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
            <div class="max-md:hidden p-2 w-75% text-2xl max-md:text-lg italic text-center text-gray-300">
                {t('guard.description')}
            </div>
        </div>
    )
}
