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
                            <n-form>
                                <n-form-item-row label="用户名">
                                    <n-input />
                                </n-form-item-row>
                                <n-form-item-row label="密码">
                                    <n-input />
                                </n-form-item-row>
                            </n-form>
                            <n-button type="primary" block secondary strong> 登录 </n-button>
                        </n-tab-pane>
                        <n-tab-pane name="signup" tab="注册">
                            <n-form>
                                <n-form-item-row label="用户名">
                                    <n-input />
                                </n-form-item-row>
                                <n-form-item-row label="密码">
                                    <n-input />
                                </n-form-item-row>
                                <n-form-item-row label="重复密码">
                                    <n-input />
                                </n-form-item-row>
                            </n-form>
                            <n-button type="primary" block secondary strong> 注册 </n-button>
                        </n-tab-pane>
                    </n-tabs>
                </n-card>
            </div>
        </div>
    </SakuraRain>
</template>

<script setup lang="ts">
import { NCard, NInput, NFormItemRow, NForm, NTabs, NTabPane, NButton } from 'naive-ui'
import SakuraIcon from '../icon/SakuraIcon.vue'
import SakuraRain from '../tools/SakuraRain.vue'
</script>
