<template>
    <n-config-provider
        abstract
        :theme-overrides="themeOverrides"
        :locale="jaJP"
        :date-locale="dateJaJP"
    >
        <n-message-provider>
            <n-modal-provider>
                <n-dialog-provider>
                    <slot />
                </n-dialog-provider>
            </n-modal-provider>
        </n-message-provider>
    </n-config-provider>
</template>

<script setup lang="ts">
import {
    NConfigProvider,
    NMessageProvider,
    NModalProvider,
    NDialogProvider,
    type GlobalThemeOverrides,
    jaJP,
    dateJaJP,
} from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
    common: {
        primaryColor: '#fdb5c0',
        primaryColorHover: '#fdb5c0',
        primaryColorPressed: '#fdb5c0',
        primaryColorSuppl: '#fdb5c0',
    },
}
</script>
