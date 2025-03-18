import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import SakuraIcon from '@/components/icon/SakuraIcon'
import { useI18n } from 'vue-i18n'
import { NAvatar, NButton, NIcon, NPopselect, useMessage } from 'naive-ui'
import { LogoGithub as LogoGithubIcon } from '@vicons/ionicons5'
import { Translate20Regular as TranslateIcon } from '@vicons/fluent'
import { useUserStore } from '@/stores/user'
import { isSuccessResponse } from '@root/shared'
import { ref } from 'vue'
import API from '@/api'

const navItemClass =
    'cursor-pointer px-5 block whitespace-nowrap h-16 line-height-16 hover:text-red-300 transition'
const activeNavItemClass = 'text-red-300 border-b-2 border-b-red-300 border-b-solid transition'

export default defineComponent(() => {
    const userStore = useUserStore()
    const message = useMessage()

    function to(href: string) {
        location.href = href
    }

    //#region i18n
    const i18nOptions = [
        { label: '简体中文', value: 'zh' },
        { label: 'English', value: 'en' },
        { label: '日本語', value: 'ja' },
    ]

    const { locale, t } = useI18n({ useScope: 'global' })

    //#endregion

    //#region 用户操作

    const isLoading = ref(false)
    async function handleLoginout() {
        isLoading.value = true
        const result = await API.Auth.deleteAuthSession(userStore.user!.id)
        isLoading.value = false
        if (isSuccessResponse(result)) {
            userStore.user = null
            userStore.token = ''
            localStorage.removeItem('token')
            message.success('注销成功')
        } else {
            console.error(result)
            message.error('注销失败')
        }
    }
    //#endregion
    return () => (
        <header class="h-16 shadow-md z-10">
            <div class="px-8 h-16 flex items-center gap-10">
                <RouterLink
                    to="/"
                    class="h-full text-lg cursor-pointer transition flex items-center px-2"
                    active-class={activeNavItemClass}
                >
                    <SakuraIcon class="mb-1.5 mr-2" size="24" />
                    <span class="text-gray">OPEN</span>
                    <span class="text-red-300">·</span>
                    <span class="text-red">JLPT</span>
                </RouterLink>
                <nav class="h-full ml-auto flex items-center font-bold">
                    <RouterLink
                        to="/jlpt/text"
                        class={navItemClass}
                        active-class={activeNavItemClass}
                    >
                        {t('jlpt.text')}
                    </RouterLink>
                    <RouterLink
                        to="/jlpt/vocabulary"
                        class={navItemClass}
                        active-class={activeNavItemClass}
                    >
                        {t('jlpt.vocabulary')}
                    </RouterLink>
                    <RouterLink
                        to="/jlpt/grammar"
                        class={navItemClass}
                        active-class={activeNavItemClass}
                    >
                        {t('jlpt.grammar')}
                    </RouterLink>
                    <RouterLink
                        to="/jlpt/read"
                        class={navItemClass}
                        active-class={activeNavItemClass}
                    >
                        {t('jlpt.read')}
                    </RouterLink>
                    <RouterLink
                        to="/jlpt/hearing"
                        class={navItemClass}
                        active-class={activeNavItemClass}
                    >
                        {t('jlpt.hearing')}
                    </RouterLink>

                    {/*  i18n  */}
                    <NPopselect
                        v-model:value={locale.value}
                        options={i18nOptions}
                        size="medium"
                        scrollable
                    >
                        <NButton
                            class="h-2/5 mx-3 px-3 border-x-1.5 border-x-gray-300 border-x-solid"
                            text
                        >
                            <NIcon component={TranslateIcon} size="30" />
                        </NButton>
                    </NPopselect>

                    {/*  Github  */}
                    <NButton
                        class="px-3"
                        text
                        onClick={() => to('https://github.com/Azzellz/open-jlpt')}
                    >
                        <NIcon component={LogoGithubIcon} size="30" />
                    </NButton>

                    {/*  用户头像交互  */}
                    <RouterLink
                        class="px-2 block h-16 flex items-center"
                        to="/user/profile"
                        active-class={activeNavItemClass}
                    >
                        <NPopselect
                            class="p-0"
                            v-slots={{
                                empty: () => <div>{userStore.user?.name}</div>,
                                action: () => (
                                    <div class="flex-y items-center">
                                        <NButton
                                            text
                                            onClick={handleLoginout}
                                            loading={isLoading.value}
                                        >
                                            注销登录
                                        </NButton>
                                    </div>
                                ),
                            }}
                        >
                            <NAvatar round size="small" src={userStore.user?.avatar} />
                        </NPopselect>
                    </RouterLink>
                </nav>
            </div>
        </header>
    )
})
