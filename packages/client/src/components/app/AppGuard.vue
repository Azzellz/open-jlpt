<template>
    <SakuraRain>
        <div id="app-guard" class="flex max-md:flex-col h-full p-20">
            <div class="md:flex-2/3 flex">
                <div class="m-auto flex flex-col gap-10">
                    <div class="flex text-8xl gap-2 items-center">
                        <SakuraIcon class="mb-1.5 mr-2" size="150" />
                        <span class="text-gray">OPEN</span>
                        <span class="text-red-300">·</span>
                        <span class="text-red">JLPT</span>
                    </div>
                    <div class="text-2xl italic text-center pl-5 text-gray-300">
                        <a class="underline" href="https://www.jlpt.jp">{{ $t('guard.title') }}</a>
                        {{ $t('guard.description') }}
                    </div>
                </div>
            </div>
            <div class="flex-1/3 flex flex-col">
                <n-card class="w-100 m-auto shadow-xl">
                    <n-tabs
                        class="card-tabs"
                        default-value="signin"
                        size="large"
                        animated
                        pane-wrapper-style="margin: 0 -4px"
                        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
                    >
                        <n-tab-pane name="signin" tab="登录">
                            <n-form
                                ref="loginFormRef"
                                :model="loginFormValue"
                                :rules="loginFormRules"
                            >
                                <n-form-item-row label="账号" path="account">
                                    <n-input
                                        v-model:value="loginFormValue.account"
                                        placeholder="请输入账号"
                                    />
                                </n-form-item-row>
                                <n-form-item-row label="密码" path="password">
                                    <n-input
                                        v-model:value="loginFormValue.password"
                                        type="password"
                                        show-password-on="click"
                                        placeholder="请输入密码"
                                    />
                                </n-form-item-row>
                            </n-form>
                            <n-button
                                type="primary"
                                :loading="isLoading"
                                block
                                strong
                                @click="handleLogin"
                            >
                                登录
                            </n-button>
                        </n-tab-pane>
                        <n-tab-pane name="signup" tab="注册">
                            <n-form
                                ref="registerFormRef"
                                :model="registerFormValue"
                                :rules="registerFormRules"
                            >
                                <n-form-item-row label="用户名" path="name">
                                    <n-input
                                        v-model:value="registerFormValue.name"
                                        placeholder="请输入用户名"
                                    />
                                </n-form-item-row>
                                <n-form-item-row label="账号" path="account">
                                    <n-input
                                        v-model:value="registerFormValue.account"
                                        placeholder="请输入账号"
                                    />
                                </n-form-item-row>
                                <n-form-item-row label="密码" path="password">
                                    <n-input
                                        v-model:value="registerFormValue.password"
                                        type="password"
                                        show-password-on="click"
                                        placeholder="请输入密码"
                                    />
                                </n-form-item-row>
                                <n-form-item-row label="重复密码" path="rePassword">
                                    <n-input
                                        v-model:value="registerFormValue.rePassword"
                                        type="password"
                                        show-password-on="click"
                                        placeholder="请输入重复密码"
                                    />
                                </n-form-item-row>
                            </n-form>
                            <n-button
                                type="primary"
                                :loading="isLoading"
                                block
                                strong
                                @click="handleRegister"
                            >
                                注册
                            </n-button>
                        </n-tab-pane>
                    </n-tabs>
                </n-card>
            </div>
        </div>
    </SakuraRain>
</template>

<script setup lang="ts">
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
import SakuraIcon from '../icon/SakuraIcon.vue'
import SakuraRain from '../tools/SakuraRain.vue'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import API from '@/api'
import { isSuccessResponse } from '@root/shared'

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
            return console.log(errors)
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


</script>
