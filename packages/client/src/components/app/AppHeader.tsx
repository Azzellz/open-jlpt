import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import SakuraIcon from '@/components/icon/SakuraIcon'
import { useI18n } from 'vue-i18n'
import { NAvatar, NButton, NIcon, NPopselect, useMessage, NPopover, NDivider } from 'naive-ui'
import { LogoGithub as LogoGithubIcon } from '@vicons/ionicons5'
import { MenuOpenOutlined as MenuIcon } from '@vicons/material'
import { Translate20Regular as TranslateIcon } from '@vicons/fluent'
import { useUserStore } from '@/stores/user'
import { isSuccessResponse } from '@root/shared'
import { ref } from 'vue'

const desktopNavItemClass =
    'cursor-pointer px-5 block whitespace-nowrap h-16 line-height-16 hover:text-red-300 transition'
const mobileNavItemClass = 'w-full text-center h-7 hover:text-red-300 transition'
const activeNavItemClass = 'text-red-300 border-b-2 border-b-red-300 border-b-solid'

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
        const result = await userStore.logout()
        isLoading.value = false
        if (isSuccessResponse(result)) {
            message.success('注销成功')
        } else {
            console.error(result)
            message.error('注销失败')
        }
    }

    //#endregion

    //#region 菜单导航栏
    const UserAvatar = () => (
        <RouterLink
            class="px-2 h-16 flex items-center"
            to="/user/profile"
            active-class={activeNavItemClass}
        >
            <NPopselect
                class="p-0"
                v-slots={{
                    empty: () => <div>{userStore.user?.name}</div>,
                    action: () => (
                        <div class="flex-y items-center">
                            <NButton text onClick={handleLoginout} loading={isLoading.value}>
                                注销登录
                            </NButton>
                        </div>
                    ),
                }}
            >
                <NAvatar round src={userStore.user?.avatar} size={36} />
            </NPopselect>
        </RouterLink>
    )

    const NavItems = ({ type }: { type: 'desktop' | 'mobile' }) => {
        const itemClass = type === 'desktop' ? desktopNavItemClass : mobileNavItemClass
        return (
            <>
                <RouterLink to="/jlpt/text" class={itemClass} active-class={activeNavItemClass}>
                    {t('jlpt.text')}
                </RouterLink>
                <RouterLink to="/jlpt/read" class={itemClass} active-class={activeNavItemClass}>
                    {t('jlpt.read')}
                </RouterLink>
                <RouterLink
                    to="/jlpt/vocabulary"
                    class={itemClass}
                    active-class={activeNavItemClass}
                >
                    {t('jlpt.vocabulary')}
                </RouterLink>
                <RouterLink to="/jlpt/grammar" class={itemClass} active-class={activeNavItemClass}>
                    {t('jlpt.grammar')}
                </RouterLink>
                <RouterLink to="/jlpt/hearing" class={itemClass} active-class={activeNavItemClass}>
                    {t('jlpt.hearing')}
                </RouterLink>
                <RouterLink to="/other/speech" class={itemClass} active-class={activeNavItemClass}>
                    口语
                </RouterLink>
                {type === 'mobile' && <NDivider style="margin-top:0px;margin-bottom:0px" />}
                {/*  i18n  */}
                <NPopselect
                    v-model:value={locale.value}
                    options={i18nOptions}
                    size="medium"
                    scrollable
                >
                    <NButton
                        text
                        class={
                            type === 'desktop'
                                ? 'h-2/5 mx-3 px-3 border-x-1.5 border-x-gray-300 border-x-solid'
                                : ''
                        }
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
                    <NIcon component={LogoGithubIcon} size="32" />
                </NButton>
            </>
        )
    }
    //#endregion

    return () => (
        <header class="h-16 shadow-md z-10">
            <div class="px-2 md:px-8  h-16 flex-x gap-10">
                {/* Logo */}
                <RouterLink
                    to="/"
                    class="h-full text-lg cursor-pointer transition flex items-center px-2"
                    activeClass={activeNavItemClass}
                >
                    <SakuraIcon class="mb-1.5 mr-2" size="24" />
                    <div>
                        <span class="text-gray">OPEN</span>
                        <span class="text-red-300">·</span>
                        <span class="text-red">JLPT</span>
                    </div>
                </RouterLink>
                {/* 响应式菜单导航栏 */}
                {/* 桌面端导航栏 */}
                <nav class="h-full max-md:hidden ml-auto flex items-center font-bold">
                    <NavItems type="desktop" />
                    <UserAvatar />
                </nav>
                {/* 移动端导航栏 */}
                <nav class="h-full md:hidden ml-auto flex gap-2 items-center font-bold">
                    {/* 更多选项 */}
                    <NPopover
                        trigger="click"
                        v-slots={{
                            trigger: () => (
                                <NButton text>
                                    <NIcon size="32" component={MenuIcon} />
                                </NButton>
                            ),
                        }}
                    >
                        <div class="flex-y items-center gap-2">
                            <NavItems type="mobile" />
                        </div>
                    </NPopover>
                    <UserAvatar />
                </nav>
            </div>
        </header>
    )
})
