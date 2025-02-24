<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <slot />
    </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, type GlobalThemeOverrides } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
    common: {
        primaryColor: '#fdb5c0',
    },
}
</script>
