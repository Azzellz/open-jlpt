import {
    NCard,
    NInput,
    NFormItemRow,
    NForm,
    NTabs,
    NTabPane,
    NButton,
    useMessage,
    type FormInst,
    type FormRules,
} from 'naive-ui'
import SakuraIcon from '../icon/SakuraIcon'
import SakuraRain from '../tools/SakuraRain'
import { defineComponent, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import API from '@/api'
import { isSuccessResponse } from '@root/shared'
import AppLoader from './loader/AppLoader'
import { useI18n } from 'vue-i18n'

export default defineComponent(() => {
    const { t } = useI18n()
    const message = useMessage()
    const isLoading = ref(false)
    const userStore = useUserStore()

    //#region 登录表单

    const loginFormRef = ref<FormInst | null>(null)
    const loginFormValue = ref({
        account: '',
        password: '',
    })
    const loginFormRules: FormRules = {
        account: {
            required: true,
            message: '请输入账号',
            trigger: 'blur',
        },
        password: {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
        },
    }
    async function handleLogin(e: MouseEvent) {
        e.preventDefault()
        loginFormRef.value?.validate(async (errors) => {
            if (errors) {
                return console.log(errors)
            }

            isLoading.value = true
            const result = await API.Auth.createAuthSession(loginFormValue.value)

            if (isSuccessResponse(result)) {
                message.success('登录成功！')
                userStore.user = result.data.user
                userStore.token = result.data.token
                localStorage.setItem('token', userStore.token)
            } else {
                message.error('登录失败。')
                console.log(result)
            }

            isLoading.value = false
        })
    }
    //#endregion

    //#region 注册表单
    const registerFormRef = ref<FormInst | null>(null)
    const registerFormValue = ref({
        name: '',
        account: '',
        password: '',
        rePassword: '',
    })
    const registerFormRules: FormRules = {
        name: {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
        },
        account: {
            required: true,
            message: '请输入账号',
            trigger: 'blur',
        },
        password: {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
        },
        rePassword: {
            required: true,
            message: '请输入重复密码',
            trigger: 'blur',
        },
    }
    async function handleRegister(e: MouseEvent) {
        e.preventDefault()
        registerFormRef.value?.validate(async (errors) => {
            if (errors) {
                return
            }

            isLoading.value = true
            const result = await API.User.createUser(registerFormValue.value)

            if (isSuccessResponse(result)) {
                message.success('注册成功！')
                userStore.user = result.data.user
                userStore.token = result.data.token
                localStorage.setItem('token', userStore.token)
            } else {
                message.error('注册失败。')
            }

            isLoading.value = false
        })
    }
    //#endregion

    //#region 自动登录

    onMounted(async () => {
        if (!userStore.token) {
            return
        }

        message.info('自动登录中...')
        const result = await API.User.getUser()
        if (isSuccessResponse(result)) {
            userStore.user = result.data
            message.success('自动登录成功！')
        } else {
            message.error('自动登录失败，请重新登录')
            userStore.token = ''
            localStorage.removeItem('token')
            console.log(result)
        }
    })

    //#endregion

    if (userStore.token) {
        return () => (
            <SakuraRain>
                <div class="h-full flex">
                    <AppLoader class="m-auto" />
                </div>
            </SakuraRain>
        )
    } else {
        return () => (
            <SakuraRain>
                <div id="app-guard" class="flex max-md:flex-col h-full p-20">
                    <div class="md:flex-2/3 flex">
                        <div class="m-auto flex flex-col gap-10">
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
                    </div>
                    <div class="flex-1/3 flex flex-col">
                        <NCard class="w-100 m-auto shadow-xl">
                            <NTabs
                                class="card-tabs"
                                defaultValue="signin"
                                size="large"
                                animated
                                paneWrapperStyle="margin: 0 -4px"
                                paneStyle="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
                            >
                                <NTabPane name="signin" tab="登录">
                                    <NForm
                                        ref={loginFormRef}
                                        model={loginFormValue.value}
                                        rules={loginFormRules}
                                    >
                                        <NFormItemRow label="账号" path="account">
                                            <NInput
                                                v-model:value={loginFormValue.value.account}
                                                placeholder="请输入账号"
                                            />
                                        </NFormItemRow>
                                        <NFormItemRow label="密码" path="password">
                                            <NInput
                                                v-model:value={loginFormValue.value.password}
                                                type="password"
                                                showPasswordOn="click"
                                                placeholder="请输入密码"
                                            />
                                        </NFormItemRow>
                                    </NForm>
                                    <NButton
                                        type="primary"
                                        loading={isLoading.value}
                                        block
                                        strong
                                        onClick={handleLogin}
                                    >
                                        登录
                                    </NButton>
                                </NTabPane>
                                <NTabPane name="signup" tab="注册">
                                    <NForm
                                        ref={registerFormRef}
                                        model={registerFormValue.value}
                                        rules={registerFormRules}
                                    >
                                        <NFormItemRow label="用户名" path="name">
                                            <NInput
                                                v-model:value={registerFormValue.value.name}
                                                placeholder="请输入用户名"
                                            />
                                        </NFormItemRow>
                                        <NFormItemRow label="账号" path="account">
                                            <NInput
                                                v-model:value={registerFormValue.value.account}
                                                placeholder="请输入账号"
                                            />
                                        </NFormItemRow>
                                        <NFormItemRow label="密码" path="password">
                                            <NInput
                                                v-model:value={registerFormValue.value.password}
                                                type="password"
                                                showPasswordOn="click"
                                                placeholder="请输入密码"
                                            />
                                        </NFormItemRow>
                                        <NFormItemRow label="重复密码" path="rePassword">
                                            <NInput
                                                v-model:value={registerFormValue.value.rePassword}
                                                type="password"
                                                showPasswordOn="click"
                                                placeholder="请输入重复密码"
                                            />
                                        </NFormItemRow>
                                    </NForm>
                                    <NButton
                                        type="primary"
                                        loading={isLoading.value}
                                        block
                                        strong
                                        onClick={handleRegister}
                                    >
                                        注册
                                    </NButton>
                                </NTabPane>
                            </NTabs>
                        </NCard>
                    </div>
                </div>
            </SakuraRain>
        )
    }
})
