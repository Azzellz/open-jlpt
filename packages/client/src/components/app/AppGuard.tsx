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
    NAlert,
} from 'naive-ui'
import SakuraRain from '../tools/SakuraRain'
import { defineComponent, onMounted, ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import API from '@/api'
import { isSuccessResponse } from '@root/shared'
import AppLoader from './loader/AppLoader'
import AppIntroduction from './AppIntroduction'
import { useI18n } from 'vue-i18n'

export default defineComponent(() => {
    const message = useMessage()
    const { t } = useI18n()
    const isLoading = ref(false)
    const userStore = useUserStore()
    const loginErrorMessage = ref('')
    const registerErrorMessage = ref('')

    // 登录/注册失败尝试次数计数
    const loginAttempts = ref(0)
    const registerAttempts = ref(0)

    // 是否显示验证码（当尝试失败超过3次时）
    const showCaptcha = computed(() => loginAttempts.value >= 3 || registerAttempts.value >= 3)

    //#region 登录表单

    const loginFormRef = ref<FormInst | null>(null)
    const loginFormValue = ref({
        account: '',
        password: '',
        captcha: '',
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
        captcha: {
            required: showCaptcha.value,
            message: '请输入验证码',
            trigger: 'blur',
        },
    }
    async function handleLogin(e: MouseEvent) {
        e.preventDefault()
        loginErrorMessage.value = ''

        loginFormRef.value?.validate(async (errors) => {
            if (errors) {
                return console.log(errors)
            }

            // 如果需要验证码但未输入
            if (showCaptcha.value && !loginFormValue.value.captcha) {
                loginErrorMessage.value = '请输入验证码'
                return
            }

            isLoading.value = true
            const result = await API.Auth.createAuthSession(loginFormValue.value)

            if (isSuccessResponse(result)) {
                message.success('登录成功！')
                userStore.user = result.data.user
                userStore.saveToken(result.data.token)
                userStore.loadLocalConfig()
                loginAttempts.value = 0
            } else {
                loginAttempts.value++

                // 根据错误代码显示不同的错误信息
                if (result.code === 404) {
                    loginErrorMessage.value = '账号不存在'
                } else if (result.code === 401) {
                    loginErrorMessage.value = '密码错误'
                } else {
                    loginErrorMessage.value = `登录失败: ${result.error || '未知错误'}`
                }
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
        captcha: '',
    })

    // 检查两次密码是否一致
    const passwordsMatch = computed(
        () => registerFormValue.value.password === registerFormValue.value.rePassword,
    )

    // 检查密码强度
    const passwordStrong = computed(() => {
        const pwd = registerFormValue.value.password
        if (!pwd) return false

        // 密码必须至少8个字符，包含大小写字母和数字
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
        return regex.test(pwd)
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
        password: [
            {
                required: true,
                message: '请输入密码',
                trigger: 'blur',
            },
            {
                validator: () => passwordStrong.value,
                message: '密码必须至少8个字符，包含大小写字母和数字',
                trigger: 'blur',
            },
        ],
        rePassword: [
            {
                required: true,
                message: '请输入重复密码',
                trigger: 'blur',
            },
            {
                validator: () => passwordsMatch.value,
                message: '两次输入的密码不一致',
                trigger: ['blur', 'input'],
            },
        ],
        captcha: {
            required: showCaptcha.value,
            message: '请输入验证码',
            trigger: 'blur',
        },
    }
    async function handleRegister(e: MouseEvent) {
        e.preventDefault()
        registerErrorMessage.value = ''

        registerFormRef.value?.validate(async (errors) => {
            if (errors) {
                return
            }

            if (!passwordsMatch.value) {
                registerErrorMessage.value = '两次输入的密码不一致'
                return
            }

            if (!passwordStrong.value) {
                registerErrorMessage.value = '密码强度不够'
                return
            }

            // 如果需要验证码但未输入
            if (showCaptcha.value && !registerFormValue.value.captcha) {
                registerErrorMessage.value = '请输入验证码'
                return
            }

            isLoading.value = true
            const result = await API.User.createUser(registerFormValue.value)

            if (isSuccessResponse(result)) {
                message.success('注册成功！')
                userStore.user = result.data.user
                userStore.saveToken(result.data.token)
                userStore.loadLocalConfig()
                registerAttempts.value = 0
            } else {
                registerAttempts.value++
                // 根据错误代码显示不同的错误信息
                if (result.code === 409) {
                    registerErrorMessage.value = '账号已存在'
                } else {
                    registerErrorMessage.value = `注册失败: ${result.error || '未知错误'}`
                }
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
        message.destroyAll()
        if (isSuccessResponse(result)) {
            userStore.user = result.data
            userStore.loadLocalConfig()
            message.success('自动登录成功！')
        } else {
            message.error('自动登录失败，请重新登录')
            userStore.removeToken()
            console.error(result)
        }
    })

    //#endregion

    //#region 验证码相关（模拟，实际应该对接真实验证码服务）
    const captchaUrl = ref('')
    function refreshCaptcha() {
        // 模拟生成新的验证码URL
        captchaUrl.value = `/api/captcha?t=${Date.now()}`
    }

    // 当需要验证码时自动刷新
    if (showCaptcha.value && !captchaUrl.value) {
        refreshCaptcha()
    }

    // 忘记密码处理
    function handleForgotPassword() {
        message.info('请联系管理员重置密码')
    }
    //#endregion

    return () => (
        <SakuraRain class="h-full">
            {/* 如果有token则展示加载界面，此时为自动登录，如果自动登录失败则重新展示登录框 */}
            {userStore.token ? (
                <div class="h-full flex">
                    <AppLoader class="m-auto" />
                </div>
            ) : (
                <div class="flex gap-10 items-center h-full p-20 max-lg:flex-y max-md:p-5">
                    <div class="md:flex-2/3 flex">
                        <AppIntroduction responsive />
                    </div>
                    <div class="flex-1/3 w-full flex-y">
                        <NCard class="max-w-100 md:m-auto shadow-xl">
                            <NTabs
                                class="card-tabs"
                                defaultValue="signin"
                                size="large"
                                animated
                                paneWrapperStyle="margin: 0 -4px"
                                paneStyle="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
                            >
                                <NTabPane name="signin" tab="登录">
                                    {loginErrorMessage.value && (
                                        <NAlert
                                            type="error"
                                            title={loginErrorMessage.value}
                                            class="mb-4"
                                        />
                                    )}
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
                                        {showCaptcha.value && (
                                            <NFormItemRow label="验证码" path="captcha">
                                                <div class="flex gap-2">
                                                    <NInput
                                                        v-model:value={loginFormValue.value.captcha}
                                                        placeholder="请输入验证码"
                                                    />
                                                    <div
                                                        class="flex-shrink-0 cursor-pointer"
                                                        onClick={refreshCaptcha}
                                                    >
                                                        <img
                                                            src={captchaUrl.value}
                                                            alt="验证码"
                                                            height="38"
                                                        />
                                                    </div>
                                                </div>
                                            </NFormItemRow>
                                        )}
                                    </NForm>
                                    <div class="mb-4 text-right">
                                        <a
                                            class="text-blue-500 text-sm cursor-pointer"
                                            onClick={handleForgotPassword}
                                        >
                                            忘记密码?
                                        </a>
                                    </div>
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
                                    {registerErrorMessage.value && (
                                        <NAlert
                                            type="error"
                                            title={registerErrorMessage.value}
                                            class="mb-4"
                                        />
                                    )}
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
                                                placeholder="请输入密码（至少8个字符，包含大小写字母和数字）"
                                            />
                                        </NFormItemRow>
                                        <NFormItemRow label="重复密码" path="rePassword">
                                            <NInput
                                                v-model:value={registerFormValue.value.rePassword}
                                                type="password"
                                                showPasswordOn="click"
                                                placeholder="请再次输入密码"
                                            />
                                        </NFormItemRow>
                                        {showCaptcha.value && (
                                            <NFormItemRow label="验证码" path="captcha">
                                                <div class="flex gap-2">
                                                    <NInput
                                                        v-model:value={
                                                            registerFormValue.value.captcha
                                                        }
                                                        placeholder="请输入验证码"
                                                    />
                                                    <div
                                                        class="flex-shrink-0 cursor-pointer"
                                                        onClick={refreshCaptcha}
                                                    >
                                                        <img
                                                            src={captchaUrl.value}
                                                            alt="验证码"
                                                            height="38"
                                                        />
                                                    </div>
                                                </div>
                                            </NFormItemRow>
                                        )}
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
            )}
        </SakuraRain>
    )
})
